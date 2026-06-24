import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { PushToken, PushPlatform } from './entities/push-token.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
    @InjectRepository(PushToken) private pushTokenRepo: Repository<PushToken>,
  ) {}

  async findAll(userId: string, page = 1, unreadOnly = false) {
    const where: any = { userId };
    if (unreadOnly) where.isRead = false;
    const limit = 20;
    const [items, total] = await this.notifRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(userId: string, type: NotificationType, title: string, body?: string, data?: Record<string, any>) {
    const notif = this.notifRepo.create({ userId, type, title, body, data });
    return this.notifRepo.save(notif);
  }

  async markAllRead(userId: string) {
    await this.notifRepo.update({ userId, isRead: false }, { isRead: true });
    return { message: "Barchasi o'qilgan deb belgilandi" };
  }

  async markRead(id: string) {
    await this.notifRepo.update(id, { isRead: true });
    return { message: "O'qilgan deb belgilandi" };
  }

  async remove(id: string) {
    await this.notifRepo.delete(id);
    return { message: "Bildirishnoma o'chirildi" };
  }

  async registerPushToken(userId: string, token: string, platform: string) {
    const existing = await this.pushTokenRepo.findOne({ where: { userId, token } });
    if (existing) {
      await this.pushTokenRepo.update(existing.id, { platform: platform as PushPlatform });
    } else {
      await this.pushTokenRepo.save(
        this.pushTokenRepo.create({ userId, token, platform: platform as PushPlatform }),
      );
    }
    return { message: 'Push token saqlandi' };
  }

  async removePushToken(userId: string, token: string) {
    await this.pushTokenRepo.delete({ userId, token });
    return { message: 'Push token o\'chirildi' };
  }

  async getPushTokens(userId: string) {
    return this.pushTokenRepo.find({ where: { userId } });
  }
}
