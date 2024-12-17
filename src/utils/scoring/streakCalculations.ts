import { differenceInDays } from 'date-fns'
import type { HabitLog } from '../../types'

export const calculateStreak = (habitId: string, logs: HabitLog[], lastDate?: string): number => {
  if (!lastDate) return 0

  const habitLogs = logs
    .filter(log => log.habitId === habitId && log.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let streak = 0
  let currentDate = new Date(lastDate)

  for (const log of habitLogs) {
    const logDate = new Date(log.date)
    if (logDate > currentDate) continue

    const diffDays = Math.abs(differenceInDays(currentDate, logDate))
    if (diffDays > 1) break

    streak++
    currentDate = logDate
  }

  return streak
}