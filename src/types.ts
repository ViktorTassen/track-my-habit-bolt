import type { CharacterType } from './config/characterConfig'

export interface Habit {
  id: string
  name: string
  color: string
  createdAt: string
  frequency: 'daily' | 'weekly' | 'monthly'
  archived?: boolean
  archivedAt?: string
  order: number
}

export interface HabitLog {
  habitId: string
  date: string
  completed: boolean
}

export interface UserProgress {
  points: number
  level: number
  streaks: Record<string, number>
  lastCompletedDates: Record<string, string>
  awardedStreakMilestones: { [key: string]: number[] }
  selectedCharacter?: CharacterSelection
  habitOrder?: string[]
}

export interface ScoreEvent {
  type: BonusType
  points: number
  details: string
  timestamp: number
}

export interface CharacterSelection {
  character: CharacterType
  variant: string
}

export type BonusType = 'streak' | 'multicombo' | 'completion' | 'first_habit'