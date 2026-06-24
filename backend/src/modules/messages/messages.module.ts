import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { User } from '@/modules/users/entities/user.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { RedisService } from '@/config/redis.config';

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageReaction, User]), JwtModule.register({})],
  controllers: [MessagesController],
  providers: [MessagesService, ChatGateway, RedisService],
  exports: [MessagesService],
})
export class MessagesModule {}
