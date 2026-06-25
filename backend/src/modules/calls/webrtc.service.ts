import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import * as mediasoup from 'mediasoup';
import { mediasoupConfig } from '@/config/mediasoup.config';

interface PeerState {
  sendTransport?: mediasoup.types.WebRtcTransport;
  recvTransport?: mediasoup.types.WebRtcTransport;
  producers: Map<string, mediasoup.types.Producer>;
  consumers: Map<string, mediasoup.types.Consumer>;
}

interface WorkerEntry {
  worker: mediasoup.types.Worker;
  routerCount: number;
}

interface Room {
  router: mediasoup.types.Router;
  worker: WorkerEntry;
  peers: Map<string, PeerState>;
}

@Injectable()
export class WebRTCService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WebRTCService.name);
  private readonly settings: ReturnType<typeof mediasoupConfig>;

  private workers: WorkerEntry[] = [];
  private rooms = new Map<string, Room>();
  private transportsById = new Map<string, mediasoup.types.WebRtcTransport>();
  private producersById = new Map<string, mediasoup.types.Producer>();
  private consumersById = new Map<string, mediasoup.types.Consumer>();

  constructor(private config: ConfigService) {
    this.settings = mediasoupConfig(this.config);
  }

  async onModuleInit() {
    const numWorkers = os.cpus().length;
    for (let i = 0; i < numWorkers; i++) {
      const worker = await mediasoup.createWorker({
        logLevel: 'warn',
        rtcMinPort: this.settings.minPort,
        rtcMaxPort: this.settings.maxPort,
        // io_uring is blocked by seccomp in many sandboxed/CI environments (e.g. GitHub Actions),
        // which hangs worker startup forever instead of failing fast.
        disableLiburing: true,
      });
      worker.on('died', (error) => {
        this.logger.error(`mediasoup worker ${worker.pid} died: ${error.message}`);
        process.exit(1);
      });
      this.workers.push({ worker, routerCount: 0 });
    }
    this.logger.log(`${numWorkers} mediasoup worker(s) started`);
  }

  async onModuleDestroy() {
    for (const room of this.rooms.values()) {
      room.router.close();
    }
    this.rooms.clear();
    for (const { worker } of this.workers) {
      worker.close();
    }
    this.workers = [];
  }

  private getLeastLoadedWorker(): WorkerEntry {
    return this.workers.reduce((least, current) =>
      current.routerCount < least.routerCount ? current : least,
    );
  }

  private async getOrCreateRoom(callId: string): Promise<Room> {
    const existing = this.rooms.get(callId);
    if (existing) return existing;

    const workerEntry = this.getLeastLoadedWorker();
    const router = await workerEntry.worker.createRouter({
      mediaCodecs: this.settings.mediaCodecs,
    });
    workerEntry.routerCount++;

    const room: Room = { router, worker: workerEntry, peers: new Map() };
    this.rooms.set(callId, room);
    return room;
  }

  private getOrCreatePeer(room: Room, userId: string): PeerState {
    let peer = room.peers.get(userId);
    if (!peer) {
      peer = { producers: new Map(), consumers: new Map() };
      room.peers.set(userId, peer);
    }
    return peer;
  }

  async createRouter(callId: string) {
    const room = await this.getOrCreateRoom(callId);
    return room.router.rtpCapabilities;
  }

  async getRouterCapabilities(callId: string) {
    const room = await this.getOrCreateRoom(callId);
    return room.router.rtpCapabilities;
  }

  async createTransport(callId: string, userId: string, direction: 'send' | 'recv') {
    const room = await this.getOrCreateRoom(callId);
    const peer = this.getOrCreatePeer(room, userId);

    const transport = await room.router.createWebRtcTransport({
      listenIps: [{ ip: this.settings.listenIp, announcedIp: this.settings.announcedIp }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: 800000,
      appData: { callId, userId },
    });

    if (direction === 'send') {
      peer.sendTransport?.close();
      peer.sendTransport = transport;
    } else {
      peer.recvTransport?.close();
      peer.recvTransport = transport;
    }

    this.transportsById.set(transport.id, transport);
    transport.observer.once('close', () => this.transportsById.delete(transport.id));

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }

  async connectTransport(transportId: string, dtlsParameters: mediasoup.types.DtlsParameters) {
    const transport = this.transportsById.get(transportId);
    if (!transport) throw new NotFoundException('Transport topilmadi');
    await transport.connect({ dtlsParameters });
  }

  async produce(
    transportId: string,
    kind: mediasoup.types.MediaKind,
    rtpParameters: mediasoup.types.RtpParameters,
  ) {
    const transport = this.transportsById.get(transportId);
    if (!transport) throw new NotFoundException('Transport topilmadi');

    const { callId, userId } = transport.appData as { callId: string; userId: string };
    const room = this.rooms.get(callId);
    const peer = room?.peers.get(userId);
    if (!room || !peer) throw new NotFoundException("Qo'ng'iroq xonasi topilmadi");

    const producer = await transport.produce({ kind, rtpParameters });
    peer.producers.set(producer.id, producer);
    this.producersById.set(producer.id, producer);
    producer.observer.once('close', () => {
      peer.producers.delete(producer.id);
      this.producersById.delete(producer.id);
    });

    return { producerId: producer.id };
  }

  async consume(
    callId: string,
    userId: string,
    producerId: string,
    rtpCapabilities: mediasoup.types.RtpCapabilities,
  ) {
    const room = this.rooms.get(callId);
    if (!room) throw new NotFoundException("Qo'ng'iroq xonasi topilmadi");

    const producer = this.producersById.get(producerId);
    if (!producer) throw new NotFoundException('Producer topilmadi');

    if (!room.router.canConsume({ producerId, rtpCapabilities })) {
      throw new BadRequestException('Consumer mos kelmaydi');
    }

    const peer = room.peers.get(userId);
    const recvTransport = peer?.recvTransport;
    if (!recvTransport) throw new BadRequestException('Recv transport topilmadi');

    const consumer = await recvTransport.consume({
      producerId,
      rtpCapabilities,
      paused: producer.kind === 'video',
    });
    peer.consumers.set(consumer.id, consumer);
    this.consumersById.set(consumer.id, consumer);
    consumer.observer.once('close', () => {
      peer.consumers.delete(consumer.id);
      this.consumersById.delete(consumer.id);
    });

    return {
      id: consumer.id,
      producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    };
  }

  async resumeConsumer(consumerId: string) {
    const consumer = this.consumersById.get(consumerId);
    if (!consumer) throw new NotFoundException('Consumer topilmadi');
    await consumer.resume();
  }

  async getProducers(callId: string, excludeUserId: string) {
    const room = this.rooms.get(callId);
    if (!room) return [];

    const result: { producerId: string; userId: string; kind: mediasoup.types.MediaKind }[] = [];
    for (const [userId, peer] of room.peers) {
      if (userId === excludeUserId) continue;
      for (const producer of peer.producers.values()) {
        result.push({ producerId: producer.id, userId, kind: producer.kind });
      }
    }
    return result;
  }

  async closePeer(callId: string, userId: string) {
    const room = this.rooms.get(callId);
    const peer = room?.peers.get(userId);
    if (!room || !peer) return;

    peer.sendTransport?.close();
    peer.recvTransport?.close();
    room.peers.delete(userId);
  }

  async closeRoom(callId: string) {
    const room = this.rooms.get(callId);
    if (!room) return;

    for (const userId of [...room.peers.keys()]) {
      await this.closePeer(callId, userId);
    }

    room.router.close();
    room.worker.routerCount--;
    this.rooms.delete(callId);
  }
}
