import { PublicUser } from '../../auth/models/auth.model';

export type PostChatType = 'group' | 'channel';

export interface Post {
  id: string;
  chatType: PostChatType;
  chatId: string;
  authorId: string;
  author: PublicUser;
  content: string;
  mediaUrls: string[] | null;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  createdAt: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: PublicUser;
  content: string;
  replyToId: string | null;
  createdAt: string;
}

export interface CreatePostRequest {
  chatType: PostChatType;
  chatId: string;
  content: string;
  mediaUrls?: string[];
}

export interface CreateCommentRequest {
  content: string;
  replyTo?: string;
}
