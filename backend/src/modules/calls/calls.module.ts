import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Call } from './entities/call.entity';
import { CallParticipant } from './entities/call-participant.entity';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { WebRTCService } from './webrtc.service';
import { CallGateway } from './gateways/call.gateway';
import { RedisService } from '@/config/redis.config';
import { User } from '@/modules/users/entities/user.entity';
import { MessagesModule } from '@/modules/messages/messages.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Call, CallParticipant, User]),
    JwtModule.register({}),
    MessagesModule,
    NotificationsModule,
  ],
  controllers: [CallsController],
  providers: [CallsService, WebRTCService, CallGateway, RedisService],
  exports: [CallsService, WebRTCService],
})
export class CallsModule {}
