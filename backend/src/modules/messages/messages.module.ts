import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SearchModule } from '@/modules/search/search.module';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { MessageRead } from './entities/message-read.entity';
import { User } from '@/modules/users/entities/user.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { RedisService } from '@/config/redis.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, MessageReaction, MessageRead, User]),
    JwtModule.register({}),
    SearchModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ChatGateway, RedisService],
  exports: [MessagesService],
})
export class MessagesModule {}
