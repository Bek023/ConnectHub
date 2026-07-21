export interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: string;
  icon: string | null;
  color: string | null;
  memberCount: number;
  createdAt: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  category: string;
  icon?: string;
  color?: string;
}

export const GOAL_CATEGORIES = [
  'sport',
  'education',
  'career',
  'health',
  'finance',
  'creative',
  'social',
  'other',
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];
