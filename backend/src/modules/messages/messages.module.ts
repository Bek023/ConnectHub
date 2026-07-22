import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SearchModule } from '@/modules/search/search.module';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { MessageRead } from './entities/message-read.entity';
import { User } from '@/modules/users/entities/user.entity';
import { GroupMember } from '@/modules/groups/entities/group-member.entity';
import { ChannelSubscriber } from '@/modules/channels/entities/channel-subscriber.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { ChatMembershipService } from './chat-membership.service';
import { ChatGateway } from './gateways/chat.gateway';
import { RedisService } from '@/config/redis.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      MessageReaction,
      MessageRead,
      User,
      GroupMember,
      ChannelSubscriber,
    ]),
    JwtModule.register({}),
    SearchModule,
    NotificationsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ChatMembershipService, ChatGateway, RedisService],
  exports: [MessagesService, ChatMembershipService],
})
export class MessagesModule {}
