import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, LessThan, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { PostLike } from './entities/post-like.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(PostLike) private likeRepo: Repository<PostLike>,
    private dataSource: DataSource,
  ) {}

  async feed(page = 1, limit = 20, userId?: string) {
    const [items, total] = await this.postRepo.findAndCount({
      order: { isPinned: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    let likedIds = new Set<string>();
    if (userId && items.length) {
      const likes = await this.likeRepo.find({
        where: { userId, postId: In(items.map((p) => p.id)) },
      });
      likedIds = new Set(likes.map((l) => l.postId));
    }

    const withLiked = items.map((p) => ({ ...p, isLiked: likedIds.has(p.id) }));
    return { items: withLiked, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreatePostDto, authorId: string) {
    const post = this.postRepo.create({ ...dto, authorId });
    return this.postRepo.save(post);
  }

  async findOne(id: string) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post topilmadi');
    return post;
  }

  async update(id: string, content: string, userId: string) {
    const post = await this.findOne(id);
    this.assertAuthor(post, userId);
    await this.postRepo.update(id, { content });
    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const post = await this.findOne(id);
    this.assertAuthor(post, userId);
    await this.postRepo.delete(id);
    return { message: "Post o'chirildi" };
  }

  async like(postId: string, userId: string) {
    await this.findOne(postId);
    const existing = await this.likeRepo.findOne({ where: { postId, userId } });
    if (existing) throw new ConflictException('Allaqachon like bosilgan');

    await this.dataSource.transaction(async (manager) => {
      await manager.save(PostLike, manager.create(PostLike, { postId, userId }));
      await manager.increment(Post, { id: postId }, 'likeCount', 1);
    });

    return { message: 'Like bosildi' };
  }

  async unlike(postId: string, userId: string) {
    await this.dataSource.transaction(async (manager) => {
      const result = await manager.delete(PostLike, { postId, userId });
      if (result.affected) {
        await manager.decrement(Post, { id: postId }, 'likeCount', 1);
      }
    });
    return { message: 'Like olib tashlandi' };
  }

  async isLiked(postId: string, userId: string) {
    const like = await this.likeRepo.findOne({ where: { postId, userId } });
    return { liked: !!like };
  }

  async getComments(postId: string, cursor?: string, limit = 30) {
    const where: any = { postId };
    if (cursor) where.createdAt = LessThan(new Date(cursor));
    return this.commentRepo.find({ where, order: { createdAt: 'DESC' }, take: limit });
  }

  async addComment(postId: string, authorId: string, content: string, replyToId?: string) {
    await this.findOne(postId);
    const comment = this.commentRepo.create({ postId, authorId, content, replyToId });
    await this.commentRepo.save(comment);
    await this.postRepo.increment({ id: postId }, 'commentCount', 1);
    return comment;
  }

  async removeComment(postId: string, commentId: string, userId: string) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId, postId } });
    if (!comment) throw new NotFoundException('Izoh topilmadi');

    const post = await this.findOne(postId);
    if (comment.authorId !== userId && post.authorId !== userId) {
      throw new ForbiddenException("Faqat izoh muallifi yoki post muallifi o'chira oladi");
    }

    const result = await this.commentRepo.delete(commentId);
    if (result.affected) {
      await this.postRepo.decrement({ id: postId }, 'commentCount', 1);
    }
    return { message: "Izoh o'chirildi" };
  }

  async pin(postId: string, userId: string) {
    const post = await this.findOne(postId);
    this.assertAuthor(post, userId);
    await this.postRepo.update(postId, { isPinned: true });
    return this.findOne(postId);
  }

  async unpin(postId: string, userId: string) {
    const post = await this.findOne(postId);
    this.assertAuthor(post, userId);
    await this.postRepo.update(postId, { isPinned: false });
    return this.findOne(postId);
  }

  private assertAuthor(post: Post, userId: string) {
    if (post.authorId !== userId) {
      throw new ForbiddenException("Faqat post muallifi bu amalni bajara oladi");
    }
  }
}
