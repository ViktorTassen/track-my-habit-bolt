import type { Habit, HabitLog, UserProgress } from '../../types'

export interface MonthlyLogs {
  [monthKey: string]: {
    logs: HabitLog[]
    stats: MonthlyStats
    lastUpdated: number
  }
}

export interface MonthlyStats {
  completedCount: number
  streaks: Record<string, number>
  bestStreaks: Record<string, number>
  monthlyCompletions: string[]
}

export interface StorageKeys {
  HABITS: string
  MONTHLY_LOGS: string
  PROGRESS: string
  CALENDAR_POSITION: string
  USER_MOTIVATION: string
}

export interface StorageData {
  habits: Habit[]
  monthlyLogs: MonthlyLogs
  progress: UserProgress
}