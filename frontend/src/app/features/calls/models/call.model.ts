import { PublicUser } from '../../auth/models/auth.model';

export type CallType = 'audio' | 'video';
export type CallStatus = 'ongoing' | 'ended';

export type CallUser = Pick<PublicUser, 'id' | 'username' | 'displayName' | 'avatarUrl'>;

export interface Call {
  id: string;
  chatId: string;
  initiatorId: string;
  initiator?: CallUser;
  type: CallType;
  status: CallStatus;
  startedAt: string;
  endedAt: string | null;
}

export interface CallParticipant {
  id: string;
  joinedAt: string;
  leftAt: string | null;
  user: CallUser;
}

export interface IncomingCall {
  callId: string;
  chatId: string;
  type: CallType;
  initiator: CallUser;
}

export interface CallEndedEvent {
  callId: string;
  chatId: string;
}

export interface RemotePeer {
  userId: string;
  stream: MediaStream;
  hasVideo: boolean;
}
