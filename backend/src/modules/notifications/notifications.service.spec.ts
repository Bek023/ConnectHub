import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationType } from './entities/notification.entity';
import { PushToken, PushPlatform } from './entities/push-token.entity';

const mockNotif = (): Notification =>
  ({
    id: 'notif-uuid-1',
    userId: 'user-uuid-1',
    type: NotificationType.MESSAGE,
    title: 'New message',
    isRead: false,
  }) as Notification;

describe('NotificationsService', () => {
  let service: NotificationsService;
  let notifRepo: any;
  let pushTokenRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PushToken),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(NotificationsService);
    notifRepo = module.get(getRepositoryToken(Notification));
    pushTokenRepo = module.get(getRepositoryToken(PushToken));
  });

  describe('findAll', () => {
    it('returns paginated notifications for user', async () => {
      notifRepo.findAndCount.mockResolvedValue([[mockNotif()], 1]);
      const result = await service.findAll('user-uuid-1', 1, false);
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
    });

    it('filters unread when unreadOnly is true', async () => {
      notifRepo.findAndCount.mockResolvedValue([[], 0]);
      await service.findAll('user-uuid-1', 1, true);
      expect(notifRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-uuid-1', isRead: false } }),
      );
    });
  });

  describe('create', () => {
    it('creates and saves notification', async () => {
      const notif = mockNotif();
      notifRepo.create.mockReturnValue(notif);
      notifRepo.save.mockResolvedValue(notif);

      const result = await service.create('user-uuid-1', NotificationType.MESSAGE, 'New message');

      expect(notifRepo.save).toHaveBeenCalled();
      expect(result).toEqual(notif);
    });
  });

  describe('markRead', () => {
    it('marks single notification as read', async () => {
      notifRepo.update.mockResolvedValue({ affected: 1 });
      const result = await service.markRead('notif-uuid-1');
      expect(notifRepo.update).toHaveBeenCalledWith('notif-uuid-1', { isRead: true });
      expect(result).toHaveProperty('message');
    });
  });

  describe('markAllRead', () => {
    it('marks all unread notifications as read for user', async () => {
      notifRepo.update.mockResolvedValue({ affected: 3 });
      const result = await service.markAllRead('user-uuid-1');
      expect(notifRepo.update).toHaveBeenCalledWith({ userId: 'user-uuid-1', isRead: false }, { isRead: true });
      expect(result).toHaveProperty('message');
    });
  });

  describe('registerPushToken', () => {
    it('creates new token when it does not exist', async () => {
      pushTokenRepo.findOne.mockResolvedValue(null);
      pushTokenRepo.create.mockReturnValue({ userId: 'user-uuid-1', token: 'fcm-token', platform: PushPlatform.ANDROID });
      pushTokenRepo.save.mockResolvedValue({});

      const result = await service.registerPushToken('user-uuid-1', 'fcm-token', 'android');

      expect(pushTokenRepo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('message');
    });

    it('updates platform when token already exists', async () => {
      pushTokenRepo.findOne.mockResolvedValue({ id: 'token-uuid-1', platform: PushPlatform.IOS });
      pushTokenRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.registerPushToken('user-uuid-1', 'fcm-token', 'android');

      expect(pushTokenRepo.update).toHaveBeenCalledWith('token-uuid-1', { platform: PushPlatform.ANDROID });
      expect(pushTokenRepo.save).not.toHaveBeenCalled();
      expect(result).toHaveProperty('message');
    });
  });

  describe('removePushToken', () => {
    it('deletes token by userId and token value', async () => {
      pushTokenRepo.delete.mockResolvedValue({ affected: 1 });
      const result = await service.removePushToken('user-uuid-1', 'fcm-token');
      expect(pushTokenRepo.delete).toHaveBeenCalledWith({ userId: 'user-uuid-1', token: 'fcm-token' });
      expect(result).toHaveProperty('message');
    });
  });
});
