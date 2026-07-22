import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { NotificationType } from '@/modules/notifications/entities/notification.entity';
import { LessThan, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { MessageRead } from './entities/message-read.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { SearchService } from '@/modules/search/search.service';
import { ChatMembershipService } from './chat-membership.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(MessageReaction) private reactionRepo: Repository<MessageReaction>,
    @InjectRepository(MessageRead) private readRepo: Repository<MessageRead>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private searchService: SearchService,
    private membership: ChatMembershipService,
    private notifications: NotificationsService,
  ) {}

  async create(data: SendMessageDto & { senderId: string }) {
    await this.membership.assertMember(data.chatType, data.chatId, data.senderId);
    const { replyTo, ...rest } = data;
    const message = this.messageRepo.create({ ...rest, replyToId: replyTo });
    await this.messageRepo.save(message);
    if (message.content) {
      await this.searchService.indexDocument('messages', message.id, {
        content: message.content,
        chatId: message.chatId,
        senderId: message.senderId,
        createdAt: message.createdAt,
      });
    }
    return message;
  }

  async findByChat(chatType: string, chatId: string, userId: string, cursor?: string, limit = 30) {
    await this.membership.assertMember(chatType, chatId, userId);
    const where: any = { chatId, chatType, isDeleted: false };
    if (cursor) {
      const cursorDate = new Date(cursor);
      if (!isNaN(cursorDate.getTime())) where.createdAt = LessThan(cursorDate);
    }
    const items = await this.messageRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    });
    const nextCursor =
      items.length === limit ? items[items.length - 1].createdAt.toISOString() : null;
    return { items, nextCursor };
  }

  async edit(messageId: string, userId: string, content: string) {
    const message = await this.findOneOrFail(messageId);
    if (message.senderId !== userId) {
      throw new ForbiddenException("Faqat o'z xabaringizni tahrirlay olasiz");
    }
    message.content = content;
    message.isEdited = true;
    const saved = await this.messageRepo.save(message);
    await this.searchService.indexDocument('messages', saved.id, {
      content: saved.content,
      chatId: saved.chatId,
      senderId: saved.senderId,
      createdAt: saved.createdAt,
    });
    return saved;
  }

  async delete(messageId: string, userId: string) {
    const message = await this.findOneOrFail(messageId);
    if (message.senderId !== userId) {
      throw new ForbiddenException("Faqat o'z xabaringizni o'chira olasiz");
    }
    message.isDeleted = true;
    await this.messageRepo.save(message);
    await this.searchService.deleteDocument('messages', messageId);
    return message;
  }

  async react(messageId: string, userId: string, emoji: string) {
    const message = await this.findOneOrFail(messageId);
    await this.membership.assertMember(message.chatType, message.chatId, userId);
    const existing = await this.reactionRepo.findOne({ where: { messageId, userId, emoji } });
    if (existing) {
      await this.reactionRepo.delete(existing.id);
    } else {
      const reaction = this.reactionRepo.create({ messageId, userId, emoji });
      await this.reactionRepo.save(reaction);
    }
    const reactions = await this.reactionRepo.find({ where: { messageId } });

    if (!existing) {
      const actor = await this.userRepo.findOne({
        where: { id: userId },
        select: ['id', 'displayName', 'username', 'avatarUrl'],
      });
      await this.notifications.push(
        message.senderId,
        userId,
        NotificationType.REACTION,
        actor?.displayName ?? 'ConnectHub',
        emoji,
        { chatId: message.chatId, chatType: message.chatType, messageId, emoji, actor },
      );
    }

    return { chatId: message.chatId, messageId, emoji, userId, reactions };
  }

  async markRead(messageId: string, userId: string) {
    const message = await this.findOneOrFail(messageId);
    await this.membership.assertMember(message.chatType, message.chatId, userId);
    const exists = await this.readRepo.findOne({ where: { messageId, userId } });
    if (!exists) {
      await this.readRepo.save(this.readRepo.create({ messageId, userId }));
    }
    return { messageId, userId, chatId: message.chatId };
  }

  async readBy(messageId: string, userId: string) {
    const message = await this.findOneOrFail(messageId);
    await this.membership.assertMember(message.chatType, message.chatId, userId);
    const reads = await this.readRepo.find({
      where: { messageId },
      relations: ['user'],
      select: {
        id: true,
        readAt: true,
        user: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    });
    return { messageId, readBy: reads };
  }

  private async findOneOrFail(id: string) {
    const message = await this.messageRepo.findOne({ where: { id } });
    if (!message) throw new NotFoundException('Xabar topilmadi');
    return message;
  }
}
