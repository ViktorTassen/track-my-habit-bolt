import { useMemo } from 'react'
import type { HabitLog } from '../types'
import { calculateStreak } from './scoring'

const streakCache = new Map<string, number>()

export function memoizedCalculateStreak(
  habitId: string,
  logs: HabitLog[],
  lastDate?: string
): number {
  const cacheKey = `${habitId}-${lastDate}-${logs.length}`
  
  if (streakCache.has(cacheKey)) {
    return streakCache.get(cacheKey)!
  }

  const result = calculateStreak(habitId, logs, lastDate)
  streakCache.set(cacheKey, result)
  
  return result
}

export function useStreakInfo(habitId: string, logs: HabitLog[]) {
  return useMemo(() => {
    const habitLogs = logs.filter(log => log.habitId === habitId && log.completed)
    const sortedLogs = habitLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const currentStreak = memoizedCalculateStreak(habitId, logs, sortedLogs[0]?.date)
    
    let maxStreak = 0
    let currentCount = 0
    let prevDate: Date | null = null
    
    sortedLogs.forEach(log => {
      const logDate = new Date(log.date)
      if (!prevDate) {
        currentCount = 1
      } else {
        const diffDays = Math.floor((prevDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          currentCount++
        } else {
          currentCount = 1
        }
      }
      maxStreak = Math.max(maxStreak, currentCount)
      prevDate = logDate
    })

    return { currentStreak, maxStreak }
  }, [habitId, logs])
}