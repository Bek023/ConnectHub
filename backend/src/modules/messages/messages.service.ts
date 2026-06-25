import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { MessageRead } from './entities/message-read.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { SearchService } from '@/modules/search/search.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(MessageReaction) private reactionRepo: Repository<MessageReaction>,
    @InjectRepository(MessageRead) private readRepo: Repository<MessageRead>,
    private searchService: SearchService,
  ) {}

  async create(data: SendMessageDto & { senderId: string }) {
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

  async findByChat(chatType: string, chatId: string, cursor?: string, limit = 30) {
    const where: any = { chatId, chatType, isDeleted: false };
    if (cursor) where.createdAt = LessThan(new Date(cursor));
    return this.messageRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async edit(messageId: string, userId: string, content: string) {
    const message = await this.findOneOrFail(messageId);
    if (message.senderId !== userId) {
      throw new ForbiddenException("Faqat o'z xabaringizni tahrirlay olasiz");
    }
    message.content = content;
    message.isEdited = true;
    return this.messageRepo.save(message);
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
    await this.findOneOrFail(messageId);
    const existing = await this.reactionRepo.findOne({ where: { messageId, userId, emoji } });
    if (existing) {
      await this.reactionRepo.delete(existing.id);
    } else {
      const reaction = this.reactionRepo.create({ messageId, userId, emoji });
      await this.reactionRepo.save(reaction);
    }
    const message = await this.findOneOrFail(messageId);
    return { chatId: message.chatId, messageId, emoji, userId };
  }

  async markRead(messageId: string, userId: string) {
    await this.findOneOrFail(messageId);
    const exists = await this.readRepo.findOne({ where: { messageId, userId } });
    if (!exists) {
      await this.readRepo.save(this.readRepo.create({ messageId, userId }));
    }
    return { messageId, userId };
  }

  async readBy(messageId: string) {
    await this.findOneOrFail(messageId);
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
