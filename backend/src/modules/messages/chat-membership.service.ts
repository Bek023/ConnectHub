import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember } from '@/modules/groups/entities/group-member.entity';
import { ChannelSubscriber } from '@/modules/channels/entities/channel-subscriber.entity';
import { ChatType } from './entities/message.entity';

@Injectable()
export class ChatMembershipService {
  constructor(
    @InjectRepository(GroupMember) private memberRepo: Repository<GroupMember>,
    @InjectRepository(ChannelSubscriber) private subRepo: Repository<ChannelSubscriber>,
  ) {}

  async isMember(chatType: string, chatId: string, userId: string): Promise<boolean> {
    if (chatType === ChatType.GROUP) {
      const member = await this.memberRepo.findOne({ where: { groupId: chatId, userId } });
      return !!member;
    }
    if (chatType === ChatType.CHANNEL) {
      const sub = await this.subRepo.findOne({ where: { channelId: chatId, userId } });
      return !!sub;
    }
    return false;
  }

  async assertMember(chatType: string, chatId: string, userId: string): Promise<void> {
    const member = await this.isMember(chatType, chatId, userId);
    if (!member) {
      throw new ForbiddenException("Bu chatga kirish huquqingiz yo'q");
    }
  }

  async isMemberAnyType(chatId: string, userId: string): Promise<boolean> {
    const [group, channel] = await Promise.all([
      this.isMember(ChatType.GROUP, chatId, userId),
      this.isMember(ChatType.CHANNEL, chatId, userId),
    ]);
    return group || channel;
  }

  async assertMemberAnyType(chatId: string, userId: string): Promise<void> {
    const member = await this.isMemberAnyType(chatId, userId);
    if (!member) {
      throw new ForbiddenException("Bu chatga kirish huquqingiz yo'q");
    }
  }

  async memberIdsFor(chatId: string): Promise<string[]> {
    const [members, subs] = await Promise.all([
      this.memberRepo.find({ where: { groupId: chatId }, select: ['userId'] }),
      this.subRepo.find({ where: { channelId: chatId }, select: ['userId'] }),
    ]);
    return [...new Set([...members.map((m) => m.userId), ...subs.map((s) => s.userId)])];
  }

  async chatIdsFor(userId: string): Promise<string[]> {
    const [groups, channels] = await Promise.all([
      this.memberRepo.find({ where: { userId }, select: ['groupId'] }),
      this.subRepo.find({ where: { userId }, select: ['channelId'] }),
    ]);
    return [...groups.map((g) => g.groupId), ...channels.map((c) => c.channelId)];
  }
}
