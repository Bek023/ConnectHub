import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Comment } from './comment.entity';

export enum PostChatType {
  GROUP = 'group',
  CHANNEL = 'channel',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chat_type', type: 'enum', enum: PostChatType })
  chatType: PostChatType;

  @Column({ name: 'chat_id' })
  chatId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ length: 4000 })
  content: string;

  @Column({ name: 'media_urls', type: 'jsonb', nullable: true })
  mediaUrls: string[];

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'comment_count', default: 0 })
  commentCount: number;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @OneToMany(() => Comment, (c) => c.post)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
