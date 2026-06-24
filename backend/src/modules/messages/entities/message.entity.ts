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
import { MessageReaction } from './message-reaction.entity';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  VOICE = 'voice',
  POLL = 'poll',
}

export enum ChatType {
  GROUP = 'group',
  CHANNEL = 'channel',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chat_type', type: 'enum', enum: ChatType })
  chatType: ChatType;

  @Column({ name: 'chat_id' })
  chatId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ nullable: true, length: 4000 })
  content: string;

  @Column({
    name: 'message_type',
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  messageType: MessageType;

  @Column({ name: 'media_url', nullable: true })
  mediaUrl: string;

  @Column({ name: 'media_metadata', type: 'jsonb', nullable: true })
  mediaMetadata: {
    size?: number;
    duration?: number;
    mimeType?: string;
    width?: number;
    height?: number;
    thumbnailUrl?: string;
  };

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'reply_to' })
  replyTo: Message;

  @Column({ name: 'reply_to', nullable: true })
  replyToId: string;

  @Column({ name: 'is_edited', default: false })
  isEdited: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @OneToMany(() => MessageReaction, (r) => r.message)
  reactions: MessageReaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
