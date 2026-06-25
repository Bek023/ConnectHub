import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message, ChatType, MessageType } from './entities/message.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { MessageRead } from './entities/message-read.entity';
import { SearchService } from '@/modules/search/search.service';

const mockMessage = (): Message =>
  ({
    id: 'msg-uuid-1',
    chatId: 'group-uuid-1',
    chatType: ChatType.GROUP,
    senderId: 'user-uuid-1',
    content: 'Hello',
    messageType: MessageType.TEXT,
    isDeleted: false,
    isEdited: false,
  }) as Message;

describe('MessagesService', () => {
  let service: MessagesService;
  let messageRepo: any;
  let reactionRepo: any;
  let readRepo: any;
  let searchService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MessageReaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MessageRead),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: SearchService,
          useValue: {
            indexDocument: jest.fn(),
            deleteDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MessagesService);
    messageRepo = module.get(getRepositoryToken(Message));
    reactionRepo = module.get(getRepositoryToken(MessageReaction));
    readRepo = module.get(getRepositoryToken(MessageRead));
    searchService = module.get(SearchService);
  });

  describe('create', () => {
    it('creates and saves a message', async () => {
      const message = mockMessage();
      messageRepo.create.mockReturnValue(message);
      messageRepo.save.mockResolvedValue(message);

      const result = await service.create({
        chatId: 'group-uuid-1',
        chatType: ChatType.GROUP,
        senderId: 'user-uuid-1',
        content: 'Hello',
      });

      expect(messageRepo.create).toHaveBeenCalled();
      expect(messageRepo.save).toHaveBeenCalled();
      expect(searchService.indexDocument).toHaveBeenCalledWith(
        'messages',
        message.id,
        expect.objectContaining({ content: message.content }),
      );
      expect(result).toEqual(message);
    });
  });

  describe('edit', () => {
    it('edits message content when user is sender', async () => {
      const message = mockMessage();
      messageRepo.findOne.mockResolvedValue(message);
      messageRepo.save.mockResolvedValue({ ...message, content: 'Updated', isEdited: true });

      const result = await service.edit('msg-uuid-1', 'user-uuid-1', 'Updated');

      expect(result.content).toBe('Updated');
      expect(result.isEdited).toBe(true);
    });

    it('throws ForbiddenException when user is not sender', async () => {
      messageRepo.findOne.mockResolvedValue(mockMessage());
      await expect(service.edit('msg-uuid-1', 'other-user', 'Updated')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws NotFoundException when message does not exist', async () => {
      messageRepo.findOne.mockResolvedValue(null);
      await expect(service.edit('non-existent', 'user-uuid-1', 'Updated')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('soft-deletes message when user is sender', async () => {
      const message = mockMessage();
      messageRepo.findOne.mockResolvedValue(message);
      messageRepo.save.mockResolvedValue({ ...message, isDeleted: true });

      const result = await service.delete('msg-uuid-1', 'user-uuid-1');

      expect(result.isDeleted).toBe(true);
      expect(searchService.deleteDocument).toHaveBeenCalledWith('messages', 'msg-uuid-1');
    });

    it('throws ForbiddenException when user is not sender', async () => {
      messageRepo.findOne.mockResolvedValue(mockMessage());
      await expect(service.delete('msg-uuid-1', 'other-user')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('react', () => {
    it('adds reaction when it does not exist', async () => {
      const message = mockMessage();
      messageRepo.findOne.mockResolvedValue(message);
      reactionRepo.findOne.mockResolvedValue(null);
      reactionRepo.create.mockReturnValue({
        messageId: 'msg-uuid-1',
        userId: 'user-uuid-1',
        emoji: '👍',
      });
      reactionRepo.save.mockResolvedValue({});

      await service.react('msg-uuid-1', 'user-uuid-1', '👍');

      expect(reactionRepo.save).toHaveBeenCalled();
      expect(reactionRepo.delete).not.toHaveBeenCalled();
    });

    it('removes reaction when it already exists (toggle)', async () => {
      const message = mockMessage();
      messageRepo.findOne.mockResolvedValue(message);
      reactionRepo.findOne.mockResolvedValue({ id: 'reaction-uuid-1' });

      await service.react('msg-uuid-1', 'user-uuid-1', '👍');

      expect(reactionRepo.delete).toHaveBeenCalledWith('reaction-uuid-1');
      expect(reactionRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('markRead', () => {
    it('creates read record when not yet read', async () => {
      messageRepo.findOne.mockResolvedValue(mockMessage());
      readRepo.findOne.mockResolvedValue(null);
      readRepo.create.mockReturnValue({ messageId: 'msg-uuid-1', userId: 'user-uuid-1' });
      readRepo.save.mockResolvedValue({});

      const result = await service.markRead('msg-uuid-1', 'user-uuid-1');

      expect(readRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ messageId: 'msg-uuid-1', userId: 'user-uuid-1' });
    });

    it('skips duplicate when already read', async () => {
      messageRepo.findOne.mockResolvedValue(mockMessage());
      readRepo.findOne.mockResolvedValue({ id: 'read-uuid-1' });

      await service.markRead('msg-uuid-1', 'user-uuid-1');

      expect(readRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('readBy', () => {
    it('returns list of users who read the message', async () => {
      messageRepo.findOne.mockResolvedValue(mockMessage());
      readRepo.find.mockResolvedValue([
        { id: 'r1', readAt: new Date(), user: { id: 'user-uuid-1', username: 'john' } },
      ]);

      const result = await service.readBy('msg-uuid-1');

      expect(result.messageId).toBe('msg-uuid-1');
      expect(result.readBy).toHaveLength(1);
    });
  });
});
