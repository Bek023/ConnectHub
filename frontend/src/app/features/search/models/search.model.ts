export interface GoalHit {
  id: string;
  title: string;
  description: string | null;
  category: string;
  score: number;
}

export interface GroupHit {
  id: string;
  name: string;
  description: string | null;
  goal_id: string;
  member_count: number;
  score: number;
}

export interface MessageHit {
  id: string;
  content: string | null;
  chat_id: string;
  chat_type: 'group' | 'channel';
  sender_id: string;
  created_at: string;
  score: number;
}

export interface SearchResults {
  goals: GoalHit[];
  groups: GroupHit[];
  messages: MessageHit[];
}

export const EMPTY_RESULTS: SearchResults = { goals: [], groups: [], messages: [] };
