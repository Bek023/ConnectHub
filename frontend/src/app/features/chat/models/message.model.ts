import { PublicUser } from '../../auth/models/auth.model';

export type ChatType = 'group' | 'channel';

export type MessageType = 'text' | 'image' | 'video' | 'file' | 'voice' | 'poll';

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface Message {
  id: string;
  chatType: ChatType;
  chatId: string;
  senderId: string;
  sender: PublicUser;
  content: string | null;
  messageType: MessageType;
  mediaUrl: string | null;
  mediaMetadata: Record<string, unknown> | null;
  replyToId: string | null;
  isEdited: boolean;
  isDeleted: boolean;
  reactions?: MessageReaction[];
  createdAt: string;
}

export type MessageStatus = 'sending' | 'failed';

export interface ChatMessage extends Message {
  status?: MessageStatus;
  localId?: string;
}

export interface SendMessagePayload {
  chatId: string;
  chatType: ChatType;
  content?: string;
  messageType?: MessageType;
  mediaUrl?: string;
  replyTo?: string;
}

export interface TypingEvent {
  userId: string;
  chatId: string;
}

export interface ReactionEvent {
  chatId: string;
  messageId: string;
  emoji: string;
  userId: string;
  reactions: MessageReaction[];
}

export interface ChatTarget {
  id: string;
  chatType: ChatType;
  name: string;
  avatarUrl: string | null;
  memberCount: number;
}
