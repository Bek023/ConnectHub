import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  private likes = new Map<string, Set<string>>(); // postId -> Set<userId> (MVP uchun in-memory)

  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async feed(page = 1, limit = 20) {
    const [items, total] = await this.postRepo.findAndCount({
      order: { isPinned: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
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

  async update(id: string, content: string) {
    await this.findOne(id);
    await this.postRepo.update(id, { content });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.postRepo.delete(id);
    return { message: "Post o'chirildi" };
  }

  async like(postId: string, userId: string) {
    await this.findOne(postId);
    const set = this.likes.get(postId) ?? new Set<string>();
    if (set.has(userId)) throw new ConflictException('Allaqachon like bosilgan');
    set.add(userId);
    this.likes.set(postId, set);
    await this.postRepo.increment({ id: postId }, 'likeCount', 1);
    return { message: 'Like bosildi' };
  }

  async unlike(postId: string, userId: string) {
    const set = this.likes.get(postId);
    if (set?.delete(userId)) {
      await this.postRepo.decrement({ id: postId }, 'likeCount', 1);
    }
    return { message: 'Like olib tashlandi' };
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

  async removeComment(postId: string, commentId: string) {
    await this.commentRepo.delete(commentId);
    await this.postRepo.decrement({ id: postId }, 'commentCount', 1);
    return { message: "Izoh o'chirildi" };
  }

  async pin(postId: string) {
    await this.postRepo.update(postId, { isPinned: true });
    return this.findOne(postId);
  }

  async unpin(postId: string) {
    await this.postRepo.update(postId, { isPinned: false });
    return this.findOne(postId);
  }
}
