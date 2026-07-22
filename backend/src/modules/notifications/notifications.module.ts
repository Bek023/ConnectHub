import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Notification } from './entities/notification.entity';
import { PushToken } from './entities/push-token.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationGateway } from './gateways/notification.gateway';
import { WebPushService } from './web-push.service';
import { RedisService } from '@/config/redis.config';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, PushToken]), JwtModule.register({})],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationGateway, WebPushService, RedisService],
  exports: [NotificationsService, NotificationGateway, WebPushService],
})
export class NotificationsModule {}
