import {
  Book02Icon,
  Briefcase01Icon,
  GridIcon,
  HeartCheckIcon,
  PaintBrush01Icon,
  Rocket01Icon,
  UserMultipleIcon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons';
import { GOAL_CATEGORIES, GoalCategory } from './goal.model';

const ICONS: Record<GoalCategory, typeof GridIcon> = {
  sport: Rocket01Icon,
  education: Book02Icon,
  career: Briefcase01Icon,
  health: HeartCheckIcon,
  finance: Wallet01Icon,
  creative: PaintBrush01Icon,
  social: UserMultipleIcon,
  other: GridIcon,
};

export function categoryIcon(category: string): typeof GridIcon {
  return ICONS[category as GoalCategory] ?? GridIcon;
}

export function categoryLabelKey(category: string): string {
  return (GOAL_CATEGORIES as readonly string[]).includes(category)
    ? `goals.category.${category}`
    : 'goals.category.other';
}
