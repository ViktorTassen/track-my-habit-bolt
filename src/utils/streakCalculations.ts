import type { HabitLog } from '../types'
import { differenceInDays } from 'date-fns'

export const calculateCurrentStreak = (habitId: string, logs: HabitLog[]): number => {
  const habitLogs = logs
    .filter(log => log.habitId === habitId && log.completed)
    .map(log => ({ date: new Date(log.date), dateStr: log.date }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  if (habitLogs.length === 0) return 0

  let streak = 1
  let prevDate = habitLogs[0].date

  for (let i = 1; i < habitLogs.length; i++) {
    const currentDate = habitLogs[i].date
    const dayDiff = differenceInDays(prevDate, currentDate)
    
    if (dayDiff === 1) {
      streak++
      prevDate = currentDate
    } else {
      break
    }
  }

  return streak
}

export const calculateBestStreak = (habitId: string, logs: HabitLog[]): number => {
  const habitLogs = logs
    .filter(log => log.habitId === habitId && log.completed)
    .map(log => ({ date: new Date(log.date), dateStr: log.date }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (habitLogs.length === 0) return 0

  let currentStreak = 1
  let maxStreak = 1
  let prevDate = habitLogs[0].date

  for (let i = 1; i < habitLogs.length; i++) {
    const currentDate = habitLogs[i].date
    const dayDiff = differenceInDays(currentDate, prevDate)
    
    if (dayDiff === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
    prevDate = currentDate
  }

  return maxStreak
}

export const calculateStreakInfo = (habitId: string, logs: HabitLog[]) => {
  return {
    currentStreak: calculateCurrentStreak(habitId, logs),
    maxStreak: calculateBestStreak(habitId, logs)
  }
}