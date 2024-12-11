import type { HabitLog } from '../../types'
import { calculateCurrentStreak, calculateBestStreak } from './streakCalculations'

export const calculateStreakInfo = (habitId: string, logs: HabitLog[]) => {
  return {
    currentStreak: calculateCurrentStreak(habitId, logs),
    maxStreak: calculateBestStreak(habitId, logs)
  }
}