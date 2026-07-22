import { CallUser } from '../../calls/models/call.model';

export type NotificationType =
  | 'message'
  | 'reaction'
  | 'comment'
  | 'like'
  | 'call'
  | 'group_invite';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: {
    actor?: CallUser;
    postId?: string;
    commentId?: string;
    chatId?: string;
    chatType?: 'group' | 'channel';
    messageId?: string;
    callId?: string;
    emoji?: string;
  } | null;
  isRead: boolean;
  createdAt: string;
}
