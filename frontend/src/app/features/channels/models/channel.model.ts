import { PublicUser } from '../../auth/models/auth.model';

export interface Channel {
  id: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  subscriberCount: number;
  goalId: string;
  createdById: string;
  createdAt: string;
}

export interface ChannelSubscriber {
  id: string;
  channelId: string;
  userId: string;
  subscribedAt: string;
  user?: PublicUser;
}

export interface ChannelStats {
  subscriberCount: number;
}

export interface CreateChannelRequest {
  goalId: string;
  name: string;
  description?: string;
}
