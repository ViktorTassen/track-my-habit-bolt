import type { HabitLog } from '../../types'
import { calculateStreak } from './streakCalculations'

const BASE_POINTS = {
  '1-4': (day: number) => 10 + (day - 1) * 5, // 10, 15, 20, 25
  '5-29': 35,
  '30-99': 50,
  '100-199': 75,
  '200-364': 100,
  '365+': 150
} as const

export const getBasePointsByStreak = (streak: number): number => {
  if (streak <= 4) {
    return BASE_POINTS['1-4'](streak)
  } else if (streak <= 29) {
    return BASE_POINTS['5-29']
  } else if (streak <= 99) {
    return BASE_POINTS['30-99']
  } else if (streak <= 199) {
    return BASE_POINTS['100-199']
  } else if (streak <= 364) {
    return BASE_POINTS['200-364']
  } else {
    return BASE_POINTS['365+']
  }
}

export const calculateDailyComboBonus = (
  habitIds: string[],
  logs: HabitLog[],
  date: string
): number => {
  const completedLogs = logs.filter(log => 
    log.date === date && 
    log.completed && 
    habitIds.includes(log.habitId)
  )
  
  if (completedLogs.length < 2) return 0

  const totalBasePoints = completedLogs.reduce((sum, log) => {
    const streak = calculateStreak(log.habitId, logs, date)
    return sum + getBasePointsByStreak(streak)
  }, 0)

  const avgStreak = completedLogs.reduce((sum, log) => {
    return sum + calculateStreak(log.habitId, logs, date)
  }, 0) / completedLogs.length

  return Math.round((totalBasePoints / completedLogs.length) * (1 + avgStreak * 0.01))
}