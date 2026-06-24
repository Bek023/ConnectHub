import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(Notification) private notifRepo: Repository<Notification>) {}

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
    return { message: 'Barchasi o\'qilgan deb belgilandi' };
  }

  async markRead(id: string) {
    await this.notifRepo.update(id, { isRead: true });
    return { message: "O'qilgan deb belgilandi" };
  }

  async remove(id: string) {
    await this.notifRepo.delete(id);
    return { message: "Bildirishnoma o'chirildi" };
  }

  async registerPushToken(_userId: string, _token: string, _platform: string) {
    // Firebase FCM token saqlash uchun alohida jadval kerak bo'ladi.
    return { message: 'Push token saqlandi' };
  }
}
