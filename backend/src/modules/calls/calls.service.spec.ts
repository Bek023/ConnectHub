import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CallsService } from './calls.service';
import { Call, CallStatus, CallType } from './entities/call.entity';
import { CallParticipant } from './entities/call-participant.entity';
import { WebRTCService } from './webrtc.service';

const mockCall = (): Call =>
  ({
    id: 'call-uuid-1',
    chatId: 'chat-uuid-1',
    initiatorId: 'user-uuid-1',
    type: CallType.VIDEO,
    status: CallStatus.ONGOING,
  }) as Call;

describe('CallsService', () => {
  let service: CallsService;
  let callRepo: any;
  let participantRepo: any;
  let webrtcService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CallsService,
        {
          provide: getRepositoryToken(Call),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CallParticipant),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: WebRTCService,
          useValue: {
            createRouter: jest.fn(),
            closeRoom: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CallsService);
    callRepo = module.get(getRepositoryToken(Call));
    participantRepo = module.get(getRepositoryToken(CallParticipant));
    webrtcService = module.get(WebRTCService);
  });

  describe('create', () => {
    it('creates the call, adds the initiator as a participant and creates the mediasoup router', async () => {
      const call = mockCall();
      callRepo.create.mockReturnValue(call);
      callRepo.save.mockResolvedValue(call);
      participantRepo.create.mockReturnValue({ callId: call.id, userId: call.initiatorId });
      participantRepo.save.mockResolvedValue({});

      const result = await service.create({
        chatId: call.chatId,
        initiatorId: call.initiatorId,
        type: call.type,
      });

      expect(participantRepo.create).toHaveBeenCalledWith({
        callId: call.id,
        userId: call.initiatorId,
      });
      expect(webrtcService.createRouter).toHaveBeenCalledWith(call.id);
      expect(result).toEqual(call);
    });
  });

  describe('findOne', () => {
    it('returns the call when found', async () => {
      const call = mockCall();
      callRepo.findOne.mockResolvedValue(call);
      await expect(service.findOne(call.id)).resolves.toEqual(call);
    });

    it('throws NotFoundException when the call does not exist', async () => {
      callRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('join', () => {
    it('adds a new participant when not already present', async () => {
      const call = mockCall();
      callRepo.findOne.mockResolvedValue(call);
      participantRepo.findOne.mockResolvedValue(null);
      participantRepo.create.mockReturnValue({ callId: call.id, userId: 'user-uuid-2' });

      await service.join(call.id, 'user-uuid-2');

      expect(participantRepo.save).toHaveBeenCalled();
    });

    it('does not duplicate an existing participant', async () => {
      const call = mockCall();
      callRepo.findOne.mockResolvedValue(call);
      participantRepo.findOne.mockResolvedValue({ id: 'existing' });

      await service.join(call.id, 'user-uuid-1');

      expect(participantRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('end', () => {
    it('marks the call ended and closes the mediasoup room', async () => {
      const call = mockCall();
      callRepo.update.mockResolvedValue({});
      participantRepo.update.mockResolvedValue({});
      callRepo.findOne.mockResolvedValue({ ...call, status: CallStatus.ENDED });

      await service.end(call.id, call.initiatorId);

      expect(callRepo.update).toHaveBeenCalledWith(
        call.id,
        expect.objectContaining({ status: CallStatus.ENDED }),
      );
      expect(webrtcService.closeRoom).toHaveBeenCalledWith(call.id);
    });
  });

  describe('history', () => {
    it('paginates the initiator call history', async () => {
      const call = mockCall();
      callRepo.findAndCount.mockResolvedValue([[call], 1]);

      const result = await service.history(call.initiatorId, 1);

      expect(result).toEqual({ items: [call], total: 1, page: 1, limit: 20, totalPages: 1 });
    });
  });
});
