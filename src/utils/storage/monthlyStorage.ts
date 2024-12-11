import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import type { HabitLog, Habit } from '../../types'
import type { MonthlyLogs, MonthlyStats } from './types'
import { STORAGE_KEYS } from './constants'

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// In-memory cache for monthly logs
const monthlyLogsCache = new Map<string, {
  data: MonthlyLogs[string]
  timestamp: number
}>()

export const getMonthlyLogs = async (monthKey: string): Promise<HabitLog[]> => {
  // Check cache first
  const cached = monthlyLogsCache.get(monthKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data.logs
  }

  // Load from storage if not in cache
  const monthlyLogs: MonthlyLogs = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.MONTHLY_LOGS) || '{}'
  )

  const monthData = monthlyLogs[monthKey]
  if (monthData) {
    // Update cache
    monthlyLogsCache.set(monthKey, {
      data: monthData,
      timestamp: Date.now()
    })
    return monthData.logs
  }

  return []
}

export const getMonthlyStats = async (monthKey: string): Promise<MonthlyStats | null> => {
  // Check cache first
  const cached = monthlyLogsCache.get(monthKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data.stats
  }

  // Load from storage if not in cache
  const monthlyLogs: MonthlyLogs = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.MONTHLY_LOGS) || '{}'
  )

  const monthData = monthlyLogs[monthKey]
  if (monthData) {
    // Update cache
    monthlyLogsCache.set(monthKey, {
      data: monthData,
      timestamp: Date.now()
    })
    return monthData.stats
  }

  return null
}

export const updateHabitLog = async (
  habitId: string,
  date: string,
  completed: boolean,
  habits: Habit[]
): Promise<void> => {
  const monthKey = format(new Date(date), 'yyyy-MM')
  const logs = await getMonthlyLogs(monthKey)
  
  const existingLogIndex = logs.findIndex(
    log => log.habitId === habitId && log.date === date
  )

  if (existingLogIndex >= 0) {
    logs[existingLogIndex].completed = completed
  } else {
    logs.push({ habitId, date, completed })
  }

  await saveMonthlyLogs(logs, habits, monthKey)
}

export const saveMonthlyLogs = async (
  logs: HabitLog[],
  habits: Habit[],
  monthKey: string
): Promise<void> => {
  const monthStart = startOfMonth(new Date(monthKey + '-01'))
  const monthEnd = endOfMonth(monthStart)
  
  const monthlyLogs: MonthlyLogs = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.MONTHLY_LOGS) || '{}'
  )

  const stats = calculateMonthlyStats(logs, habits, monthStart, monthEnd)
  const monthData = {
    logs,
    stats,
    lastUpdated: Date.now()
  }

  monthlyLogs[monthKey] = monthData
  monthlyLogsCache.set(monthKey, {
    data: monthData,
    timestamp: Date.now()
  })

  localStorage.setItem(STORAGE_KEYS.MONTHLY_LOGS, JSON.stringify(monthlyLogs))
}

const calculateMonthlyStats = (
  logs: HabitLog[],
  habits: Habit[],
  monthStart: Date,
  monthEnd: Date
): MonthlyStats => {
  const stats: MonthlyStats = {
    completedCount: logs.filter(log => log.completed).length,
    streaks: {},
    bestStreaks: {},
    monthlyCompletions: []
  }

  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const logsByHabit = new Map<string, Set<string>>()
  
  // Group logs by habit for efficient lookup
  logs.forEach(log => {
    if (log.completed) {
      if (!logsByHabit.has(log.habitId)) {
        logsByHabit.set(log.habitId, new Set())
      }
      logsByHabit.get(log.habitId)!.add(log.date)
    }
  })

  // Calculate stats for each habit
  habits.forEach(habit => {
    let currentStreak = 0
    let bestStreak = 0
    let isMonthlyComplete = true
    const habitLogs = logsByHabit.get(habit.id) || new Set()

    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const completed = habitLogs.has(dateStr)

      if (completed) {
        currentStreak++
        bestStreak = Math.max(bestStreak, currentStreak)
      } else {
        currentStreak = 0
        isMonthlyComplete = false
      }
    })

    stats.streaks[habit.id] = currentStreak
    stats.bestStreaks[habit.id] = bestStreak
    
    if (isMonthlyComplete) {
      stats.monthlyCompletions.push(habit.id)
    }
  })

  return stats
}