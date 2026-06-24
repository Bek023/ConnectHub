import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Channel } from './channel.entity';

@Entity('channel_subscribers')
export class ChannelSubscriber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @Column({ name: 'channel_id' })
  channelId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'subscribed_at' })
  subscribedAt: Date;
}
