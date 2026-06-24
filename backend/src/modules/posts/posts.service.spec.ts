import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post, PostChatType } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { PostLike } from './entities/post-like.entity';

const mockPost = (): Post =>
  ({
    id: 'post-uuid-1',
    chatId: 'group-uuid-1',
    chatType: PostChatType.GROUP,
    authorId: 'user-uuid-1',
    content: 'Hello world',
    likeCount: 0,
    commentCount: 0,
    isPinned: false,
  }) as Post;

describe('PostsService', () => {
  let service: PostsService;
  let postRepo: any;
  let commentRepo: any;
  let likeRepo: any;
  let dataSource: any;
  let mockManager: any;

  beforeEach(async () => {
    mockManager = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            increment: jest.fn(),
            decrement: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PostLike),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: { transaction: jest.fn((cb) => cb(mockManager)) },
        },
      ],
    }).compile();

    service = module.get(PostsService);
    postRepo = module.get(getRepositoryToken(Post));
    commentRepo = module.get(getRepositoryToken(Comment));
    likeRepo = module.get(getRepositoryToken(PostLike));
    dataSource = module.get(DataSource);
  });

  describe('findOne', () => {
    it('returns post when found', async () => {
      postRepo.findOne.mockResolvedValue(mockPost());
      const result = await service.findOne('post-uuid-1');
      expect(result.id).toBe('post-uuid-1');
    });

    it('throws NotFoundException when not found', async () => {
      postRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates and saves post', async () => {
      const post = mockPost();
      postRepo.create.mockReturnValue(post);
      postRepo.save.mockResolvedValue(post);

      const result = await service.create(
        { chatId: 'group-uuid-1', chatType: PostChatType.GROUP, content: 'Hello world' },
        'user-uuid-1',
      );

      expect(postRepo.save).toHaveBeenCalled();
      expect(result).toEqual(post);
    });
  });

  describe('like', () => {
    it('throws ConflictException when already liked', async () => {
      postRepo.findOne.mockResolvedValue(mockPost());
      likeRepo.findOne.mockResolvedValue({ id: 'like-uuid-1' });

      await expect(service.like('post-uuid-1', 'user-uuid-1')).rejects.toThrow(ConflictException);
    });

    it('creates like and increments likeCount in transaction', async () => {
      postRepo.findOne.mockResolvedValue(mockPost());
      likeRepo.findOne.mockResolvedValue(null);
      mockManager.create.mockReturnValue({ postId: 'post-uuid-1', userId: 'user-uuid-1' });
      mockManager.save.mockResolvedValue({});

      const result = await service.like('post-uuid-1', 'user-uuid-1');

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockManager.increment).toHaveBeenCalledWith(Post, { id: 'post-uuid-1' }, 'likeCount', 1);
      expect(result).toHaveProperty('message');
    });
  });

  describe('unlike', () => {
    it('deletes like and decrements likeCount in transaction when like exists', async () => {
      mockManager.delete.mockResolvedValue({ affected: 1 });

      await service.unlike('post-uuid-1', 'user-uuid-1');

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockManager.decrement).toHaveBeenCalledWith(Post, { id: 'post-uuid-1' }, 'likeCount', 1);
    });

    it('skips decrement when like does not exist', async () => {
      mockManager.delete.mockResolvedValue({ affected: 0 });

      await service.unlike('post-uuid-1', 'user-uuid-1');

      expect(mockManager.decrement).not.toHaveBeenCalled();
    });
  });

  describe('isLiked', () => {
    it('returns true when like exists', async () => {
      likeRepo.findOne.mockResolvedValue({ id: 'like-uuid-1' });
      const result = await service.isLiked('post-uuid-1', 'user-uuid-1');
      expect(result.liked).toBe(true);
    });

    it('returns false when like does not exist', async () => {
      likeRepo.findOne.mockResolvedValue(null);
      const result = await service.isLiked('post-uuid-1', 'user-uuid-1');
      expect(result.liked).toBe(false);
    });
  });

  describe('addComment', () => {
    it('creates comment and increments commentCount', async () => {
      const comment = { id: 'comment-uuid-1', postId: 'post-uuid-1', content: 'Nice!' };
      postRepo.findOne.mockResolvedValue(mockPost());
      commentRepo.create.mockReturnValue(comment);
      commentRepo.save.mockResolvedValue(comment);
      postRepo.increment.mockResolvedValue({});

      const result = await service.addComment('post-uuid-1', 'user-uuid-1', 'Nice!');

      expect(commentRepo.save).toHaveBeenCalled();
      expect(postRepo.increment).toHaveBeenCalledWith({ id: 'post-uuid-1' }, 'commentCount', 1);
      expect(result).toEqual(comment);
    });
  });

  describe('removeComment', () => {
    it('deletes comment and decrements commentCount', async () => {
      commentRepo.delete.mockResolvedValue({ affected: 1 });
      postRepo.decrement.mockResolvedValue({});

      await service.removeComment('post-uuid-1', 'comment-uuid-1');

      expect(commentRepo.delete).toHaveBeenCalledWith('comment-uuid-1');
      expect(postRepo.decrement).toHaveBeenCalledWith({ id: 'post-uuid-1' }, 'commentCount', 1);
    });
  });

  describe('pin / unpin', () => {
    it('sets isPinned to true on pin', async () => {
      const pinned = { ...mockPost(), isPinned: true } as Post;
      postRepo.update.mockResolvedValue({});
      postRepo.findOne.mockResolvedValue(pinned);

      const result = await service.pin('post-uuid-1');
      expect(postRepo.update).toHaveBeenCalledWith('post-uuid-1', { isPinned: true });
      expect(result.isPinned).toBe(true);
    });

    it('sets isPinned to false on unpin', async () => {
      const unpinned = { ...mockPost(), isPinned: false } as Post;
      postRepo.update.mockResolvedValue({});
      postRepo.findOne.mockResolvedValue(unpinned);

      const result = await service.unpin('post-uuid-1');
      expect(postRepo.update).toHaveBeenCalledWith('post-uuid-1', { isPinned: false });
      expect(result.isPinned).toBe(false);
    });
  });
});
