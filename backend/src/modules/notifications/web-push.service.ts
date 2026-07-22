import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { PushToken, PushPlatform } from './entities/push-token.entity';
import { Notification } from './entities/notification.entity';

const GONE_STATUS = [404, 410];

@Injectable()
export class WebPushService implements OnModuleInit {
  private readonly logger = new Logger(WebPushService.name);
  private enabled = false;

  constructor(
    @InjectRepository(PushToken) private pushTokenRepo: Repository<PushToken>,
    private config: ConfigService,
  ) {}

  onModuleInit() {
    const publicKey = this.config.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.config.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.config.get<string>('VAPID_SUBJECT', 'mailto:admin@connecthub.app');

    if (!publicKey || !privateKey) {
      this.logger.warn('VAPID kalitlari yo\'q — web push o\'chirilgan');
      return;
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);
    this.enabled = true;
    this.logger.log('Web push yoqildi');
  }

  get publicKey(): string | null {
    return this.config.get<string>('VAPID_PUBLIC_KEY') ?? null;
  }

  async sendToUser(userId: string, notification: Notification): Promise<void> {
    if (!this.enabled) return;

    const tokens = await this.pushTokenRepo.find({
      where: { userId, platform: PushPlatform.WEB },
    });
    if (!tokens.length) return;

    const payload = JSON.stringify({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data ?? {},
    });

    await Promise.all(tokens.map((token) => this.deliver(token, payload)));
  }

  private async deliver(token: PushToken, payload: string): Promise<void> {
    let subscription: webpush.PushSubscription;
    try {
      subscription = JSON.parse(token.token);
    } catch {
      await this.pushTokenRepo.delete(token.id);
      return;
    }

    try {
      await webpush.sendNotification(subscription, payload);
    } catch (error) {
      const status = (error as { statusCode?: number }).statusCode;
      if (status && GONE_STATUS.includes(status)) {
        await this.pushTokenRepo.delete(token.id);
        return;
      }
      this.logger.warn(
        `Push yuborilmadi (${status ?? 'no-status'}): ${(error as Error).message}`,
      );
    }
  }
}
