import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';
import { ChannelSubscriber } from './entities/channel-subscriber.entity';

const mockChannel = (): Channel =>
  ({
    id: 'channel-uuid-1',
    name: 'Test Channel',
    goalId: 'goal-uuid-1',
    createdById: 'user-uuid-1',
    subscriberCount: 3,
  }) as Channel;

const mockSubscriber = (): ChannelSubscriber =>
  ({
    id: 'sub-uuid-1',
    channelId: 'channel-uuid-1',
    userId: 'user-uuid-2',
  }) as ChannelSubscriber;

describe('ChannelsService', () => {
  let service: ChannelsService;
  let channelRepo: any;
  let subRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(Channel),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            increment: jest.fn(),
            decrement: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ChannelSubscriber),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ChannelsService);
    channelRepo = module.get(getRepositoryToken(Channel));
    subRepo = module.get(getRepositoryToken(ChannelSubscriber));
  });

  describe('findAll', () => {
    it('paginates channels, optionally filtered by goalId', async () => {
      const channel = mockChannel();
      channelRepo.findAndCount.mockResolvedValue([[channel], 1]);

      const result = await service.findAll('goal-uuid-1', 1, 20);

      expect(channelRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { goalId: 'goal-uuid-1' } }),
      );
      expect(result).toEqual({ items: [channel], total: 1, page: 1, limit: 20, totalPages: 1 });
    });
  });

  describe('findOne', () => {
    it('returns the channel when found', async () => {
      const channel = mockChannel();
      channelRepo.findOne.mockResolvedValue(channel);
      await expect(service.findOne(channel.id)).resolves.toEqual(channel);
    });

    it('throws NotFoundException when not found', async () => {
      channelRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a channel owned by the given user', async () => {
      const channel = mockChannel();
      channelRepo.create.mockReturnValue(channel);
      channelRepo.save.mockResolvedValue(channel);

      const result = await service.create(
        { name: channel.name, goalId: channel.goalId } as any,
        'user-uuid-1',
      );

      expect(channelRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: channel.name, createdById: 'user-uuid-1' }),
      );
      expect(result).toEqual(channel);
    });
  });

  describe('update', () => {
    it('updates and returns the channel', async () => {
      const channel = mockChannel();
      const updated = { ...channel, name: 'Renamed' } as Channel;
      channelRepo.findOne.mockResolvedValueOnce(channel).mockResolvedValueOnce(updated);
      channelRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(channel.id, { name: 'Renamed' }, 'user-uuid-1');

      expect(channelRepo.update).toHaveBeenCalledWith(channel.id, { name: 'Renamed' });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('deletes the channel', async () => {
      const channel = mockChannel();
      channelRepo.findOne.mockResolvedValue(channel);
      channelRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(channel.id, 'user-uuid-1');

      expect(channelRepo.delete).toHaveBeenCalledWith(channel.id);
      expect(result).toEqual({ message: "Kanal o'chirildi" });
    });
  });

  describe('subscribe', () => {
    it('creates a subscription and increments subscriberCount', async () => {
      const channel = mockChannel();
      const sub = mockSubscriber();
      channelRepo.findOne.mockResolvedValue(channel);
      subRepo.findOne.mockResolvedValue(null);
      subRepo.create.mockReturnValue(sub);
      subRepo.save.mockResolvedValue(sub);

      const result = await service.subscribe(channel.id, 'user-uuid-2');

      expect(subRepo.save).toHaveBeenCalledWith(sub);
      expect(channelRepo.increment).toHaveBeenCalledWith({ id: channel.id }, 'subscriberCount', 1);
      expect(result).toEqual(sub);
    });

    it('throws ConflictException when already subscribed', async () => {
      const channel = mockChannel();
      channelRepo.findOne.mockResolvedValue(channel);
      subRepo.findOne.mockResolvedValue(mockSubscriber());

      await expect(service.subscribe(channel.id, 'user-uuid-2')).rejects.toThrow(ConflictException);
      expect(channelRepo.increment).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('deletes the subscription and decrements subscriberCount when it existed', async () => {
      const channel = mockChannel();
      subRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.unsubscribe(channel.id, 'user-uuid-2');

      expect(subRepo.delete).toHaveBeenCalledWith({ channelId: channel.id, userId: 'user-uuid-2' });
      expect(channelRepo.decrement).toHaveBeenCalledWith({ id: channel.id }, 'subscriberCount', 1);
      expect(result).toEqual({ message: 'Obunadan chiqdingiz' });
    });

    it('skips decrement when the subscription did not exist', async () => {
      subRepo.delete.mockResolvedValue({ affected: 0 });

      await service.unsubscribe('channel-uuid-1', 'user-uuid-2');

      expect(channelRepo.decrement).not.toHaveBeenCalled();
    });
  });

  describe('getSubscribers', () => {
    it('paginates subscribers with the user relation', async () => {
      const sub = mockSubscriber();
      subRepo.findAndCount.mockResolvedValue([[sub], 1]);

      const result = await service.getSubscribers('channel-uuid-1', 1, 20);

      expect(subRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { channelId: 'channel-uuid-1' }, relations: ['user'] }),
      );
      expect(result).toEqual({ items: [sub], total: 1, page: 1, limit: 20, totalPages: 1 });
    });
  });

  describe('stats', () => {
    it('returns the subscriberCount for the channel', async () => {
      const channel = mockChannel();
      channelRepo.findOne.mockResolvedValue(channel);

      const result = await service.stats(channel.id);

      expect(result).toEqual({ subscriberCount: channel.subscriberCount });
    });
  });
});
