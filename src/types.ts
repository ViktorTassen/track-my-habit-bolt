import { type BonusType } from './config/animationConfig'

export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  archived?: boolean;
  archivedAt?: string;
}

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface UserProgress {
  points: number;
  level: number;
  streaks: Record<string, number>;
  lastCompletedDates: Record<string, string>;
  awardedStreakMilestones: Record<string, number[]>;
  selectedCharacter?: CharacterSelection;
}

export interface ScoreEvent {
  type: BonusType;
  points: number;
  details: string;
  timestamp: number;
}

export interface CharacterSelection {
  character: string;
  variant: string;
}