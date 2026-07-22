import { PublicUser } from '../../auth/models/auth.model';

export type MemberRole = 'admin' | 'moderator' | 'member';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  isPrivate: boolean;
  inviteCode: string | null;
  maxMembers: number;
  memberCount: number;
  goalId: string;
  createdById: string;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  user?: PublicUser;
}

export interface CreateGroupRequest {
  goalId: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  avatarUrl?: string;
  coverUrl?: string;
}
