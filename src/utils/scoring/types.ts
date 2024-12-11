import type { Habit, HabitLog, UserProgress, ScoreEvent } from '../../types'

export interface PointCalculationResult {
  points: number
  events: ScoreEvent[]
  updatedProgress: UserProgress
}

export interface RecalculationResult {
  totalPoints: number
  updatedProgress: UserProgress
}

export interface StreakInfo {
  currentStreak: number
  maxStreak: number
}

export interface LevelInfo {
  level: number
  title: string
  nextThreshold: number
  previousThreshold: number
}