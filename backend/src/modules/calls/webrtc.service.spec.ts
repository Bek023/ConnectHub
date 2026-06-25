import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { WebRTCService } from './webrtc.service';

jest.mock('os', () => ({ cpus: jest.fn(() => [{}, {}]) }));
jest.mock('mediasoup', () => ({ createWorker: jest.fn() }));

interface MockProducer {
  id: string;
  kind: 'audio' | 'video';
  observer: { once: jest.Mock };
  close: jest.Mock;
}

let producerIdCounter = 0;
let consumerIdCounter = 0;
let transportIdCounter = 0;
let producerRegistry: Map<string, MockProducer>;

function mockProducer(kind: 'audio' | 'video'): MockProducer {
  const closeListeners: (() => void)[] = [];
  const producer: MockProducer = {
    id: `producer-${producerIdCounter++}`,
    kind,
    observer: {
      once: jest.fn(
        (event: string, cb: () => void) => event === 'close' && closeListeners.push(cb),
      ),
    },
    close: jest.fn(() => closeListeners.forEach((cb) => cb())),
  };
  producerRegistry.set(producer.id, producer);
  return producer;
}

function mockConsumer(producerId: string, kind: 'audio' | 'video') {
  const closeListeners: (() => void)[] = [];
  return {
    id: `consumer-${consumerIdCounter++}`,
    producerId,
    kind,
    rtpParameters: { codecs: [] },
    observer: {
      once: jest.fn(
        (event: string, cb: () => void) => event === 'close' && closeListeners.push(cb),
      ),
    },
    close: jest.fn(() => closeListeners.forEach((cb) => cb())),
    resume: jest.fn().mockResolvedValue(undefined),
  };
}

function mockTransport(appData: Record<string, any> = {}) {
  const producers: MockProducer[] = [];
  const consumers: ReturnType<typeof mockConsumer>[] = [];
  const closeListeners: (() => void)[] = [];
  const transport: any = {
    id: `transport-${transportIdCounter++}`,
    appData,
    iceParameters: { usernameFragment: 'u', password: 'p' },
    iceCandidates: [],
    dtlsParameters: { fingerprints: [] },
    observer: {
      once: jest.fn(
        (event: string, cb: () => void) => event === 'close' && closeListeners.push(cb),
      ),
    },
    connect: jest.fn().mockResolvedValue(undefined),
    produce: jest.fn(async ({ kind }: { kind: 'audio' | 'video' }) => {
      const producer = mockProducer(kind);
      producers.push(producer);
      return producer;
    }),
    consume: jest.fn(async ({ producerId, paused }: { producerId: string; paused?: boolean }) => {
      const producer = producerRegistry.get(producerId);
      const consumer = mockConsumer(producerId, producer!.kind);
      (consumer as any).paused = paused;
      consumers.push(consumer);
      return consumer;
    }),
    close: jest.fn(() => {
      producers.forEach((p) => p.close());
      consumers.forEach((c) => c.close());
      closeListeners.forEach((cb) => cb());
    }),
  };
  return transport;
}

function mockRouter() {
  return {
    rtpCapabilities: { codecs: [{ kind: 'audio' }] },
    createWebRtcTransport: jest.fn(async (options: any) => mockTransport(options?.appData)),
    canConsume: jest.fn().mockReturnValue(true),
    close: jest.fn(),
  };
}

function mockWorker() {
  return {
    pid: Math.floor(Math.random() * 10000),
    on: jest.fn(),
    createRouter: jest.fn(async () => mockRouter()),
    close: jest.fn(),
  };
}

describe('WebRTCService', () => {
  let service: WebRTCService;
  let createWorkerMock: jest.Mock;

  beforeEach(async () => {
    producerRegistry = new Map();
    createWorkerMock = mediasoup.createWorker as jest.Mock;
    createWorkerMock.mockImplementation(async () => mockWorker());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebRTCService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, def?: any) => {
              const vals: Record<string, any> = {
                MEDIASOUP_LISTEN_IP: '0.0.0.0',
                MEDIASOUP_ANNOUNCED_IP: '127.0.0.1',
                MEDIASOUP_MIN_PORT: 10000,
                MEDIASOUP_MAX_PORT: 20000,
              };
              return vals[key] ?? def;
            }),
          },
        },
      ],
    }).compile();

    service = module.get(WebRTCService);
    await service.onModuleInit();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
    jest.clearAllMocks();
  });

  it('starts one mediasoup worker per CPU core', () => {
    expect(createWorkerMock).toHaveBeenCalledTimes(2);
    expect(createWorkerMock).toHaveBeenCalledWith(
      expect.objectContaining({ rtcMinPort: 10000, rtcMaxPort: 20000 }),
    );
  });

  it('closes all workers on module destroy', async () => {
    const workers = await Promise.all(createWorkerMock.mock.results.map((r) => r.value));
    await service.onModuleDestroy();
    workers.forEach((worker) => expect(worker.close).toHaveBeenCalled());
  });

  describe('getRouterCapabilities', () => {
    it('creates a router lazily and reuses it for the same call', async () => {
      const caps1 = await service.getRouterCapabilities('call-1');
      const caps2 = await service.getRouterCapabilities('call-1');
      expect(caps1).toEqual(caps2);

      const worker1 = await createWorkerMock.mock.results[0].value;
      const worker2 = await createWorkerMock.mock.results[1].value;
      const totalRouterCalls =
        worker1.createRouter.mock.calls.length + worker2.createRouter.mock.calls.length;
      expect(totalRouterCalls).toBe(1);
    });

    it('distributes routers across workers using least-loaded selection', async () => {
      await service.getRouterCapabilities('call-1');
      await service.getRouterCapabilities('call-2');

      const worker1 = await createWorkerMock.mock.results[0].value;
      const worker2 = await createWorkerMock.mock.results[1].value;
      expect(worker1.createRouter).toHaveBeenCalledTimes(1);
      expect(worker2.createRouter).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTransport', () => {
    it('returns connection parameters and tracks the transport per direction', async () => {
      const params = await service.createTransport('call-1', 'user-1', 'send');
      expect(params).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          iceParameters: expect.any(Object),
          iceCandidates: expect.any(Array),
          dtlsParameters: expect.any(Object),
        }),
      );
    });

    it('closes a previous transport of the same direction when re-created', async () => {
      await service.createTransport('call-1', 'user-1', 'send');
      const room = (service as any).rooms.get('call-1');
      const firstTransport = room.peers.get('user-1').sendTransport;

      await service.createTransport('call-1', 'user-1', 'send');
      expect(firstTransport.close).toHaveBeenCalled();
    });
  });

  describe('connectTransport', () => {
    it('connects an existing transport', async () => {
      const { id } = await service.createTransport('call-1', 'user-1', 'send');
      await expect(
        service.connectTransport(id, { fingerprints: [] } as any),
      ).resolves.toBeUndefined();
    });

    it('throws NotFoundException for an unknown transport', async () => {
      await expect(service.connectTransport('missing', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('produce / consume', () => {
    async function setupPeer(callId: string, userId: string) {
      const send = await service.createTransport(callId, userId, 'send');
      const recv = await service.createTransport(callId, userId, 'recv');
      return { send, recv };
    }

    it('produces media and tracks the producer', async () => {
      const { send } = await setupPeer('call-1', 'user-1');
      const { producerId } = await service.produce(send.id, 'video', {} as any);
      expect(producerId).toBeDefined();

      const producers = await service.getProducers('call-1', 'someone-else');
      expect(producers).toEqual([{ producerId, userId: 'user-1', kind: 'video' }]);
    });

    it('throws NotFoundException when producing on an unknown transport', async () => {
      await expect(service.produce('missing', 'audio', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('consumes a producer through the consuming peer recv transport, paused for video', async () => {
      const producerPeer = await setupPeer('call-1', 'user-1');
      const { producerId } = await service.produce(producerPeer.send.id, 'video', {} as any);

      await setupPeer('call-1', 'user-2');
      const result = await service.consume('call-1', 'user-2', producerId, { codecs: [] } as any);

      expect(result).toEqual(
        expect.objectContaining({ producerId, kind: 'video', id: expect.any(String) }),
      );
    });

    it('throws NotFoundException when the call room does not exist', async () => {
      await expect(
        service.consume('missing-call', 'user-1', 'producer-x', {} as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the producer does not exist', async () => {
      await service.getRouterCapabilities('call-1');
      await expect(
        service.consume('call-1', 'user-1', 'missing-producer', {} as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when the router cannot consume with the given capabilities', async () => {
      const producerPeer = await setupPeer('call-1', 'user-1');
      const { producerId } = await service.produce(producerPeer.send.id, 'audio', {} as any);
      await setupPeer('call-1', 'user-2');

      const room = (service as any).rooms.get('call-1');
      room.router.canConsume.mockReturnValue(false);

      await expect(service.consume('call-1', 'user-2', producerId, {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when the consuming peer has no recv transport', async () => {
      const producerPeer = await setupPeer('call-1', 'user-1');
      const { producerId } = await service.produce(producerPeer.send.id, 'audio', {} as any);

      await expect(
        service.consume('call-1', 'user-without-recv', producerId, {} as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('resumeConsumer', () => {
    it('resumes a tracked consumer', async () => {
      const producerPeer = await (async () => {
        const send = await service.createTransport('call-1', 'user-1', 'send');
        await service.createTransport('call-1', 'user-1', 'recv');
        return send;
      })();
      const { producerId } = await service.produce(producerPeer.id, 'video', {} as any);
      await service.createTransport('call-1', 'user-2', 'recv');
      const consumer = await service.consume('call-1', 'user-2', producerId, {} as any);

      const room = (service as any).rooms.get('call-1');
      const consumerInstance = room.peers.get('user-2').consumers.get(consumer.id);

      await service.resumeConsumer(consumer.id);
      expect(consumerInstance.resume).toHaveBeenCalled();
    });

    it('throws NotFoundException for an unknown consumer', async () => {
      await expect(service.resumeConsumer('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('closePeer', () => {
    it('closes the peer transports and removes producers from the room', async () => {
      const send = await service.createTransport('call-1', 'user-1', 'send');
      const { producerId } = await service.produce(send.id, 'video', {} as any);
      expect(await service.getProducers('call-1', 'nobody')).toHaveLength(1);

      await service.closePeer('call-1', 'user-1');

      expect(await service.getProducers('call-1', 'nobody')).toHaveLength(0);
      void producerId;
    });

    it('is a no-op for an unknown call or peer', async () => {
      await expect(service.closePeer('missing-call', 'user-1')).resolves.toBeUndefined();
    });
  });

  describe('closeRoom', () => {
    it('closes the router, frees the worker slot and removes the room', async () => {
      await service.getRouterCapabilities('call-1');
      const room = (service as any).rooms.get('call-1');
      const workerEntry = room.worker;
      expect(workerEntry.routerCount).toBe(1);

      await service.closeRoom('call-1');

      expect(room.router.close).toHaveBeenCalled();
      expect(workerEntry.routerCount).toBe(0);
      expect((service as any).rooms.has('call-1')).toBe(false);
    });

    it('is a no-op for an unknown call', async () => {
      await expect(service.closeRoom('missing-call')).resolves.toBeUndefined();
    });
  });
});
