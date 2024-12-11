import type { HabitLog } from '../../types'

export const isHabitCompleted = (
  habitId: string,
  date: string,
  logs: HabitLog[]
): boolean => {
  return logs.some(
    log => log.habitId === habitId && 
           log.date === date && 
           log.completed
  )
}

export const getCompletedHabits = (
  date: string,
  logs: HabitLog[]
): string[] => {
  return logs
    .filter(log => log.date === date && log.completed)
    .map(log => log.habitId)
}