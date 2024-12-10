import { differenceInDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import type { Habit, HabitLog, ScoreEvent, UserProgress } from '../types'
import { POINTS, LEVEL_THRESHOLDS, LEVEL_TITLES } from '../config/gameConfig'

export { LEVEL_THRESHOLDS }

export const calculateLevel = (points: number): number => {
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points < LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return LEVEL_THRESHOLDS.length + 1
}

export const getLevelTitle = (level: number): string => {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
}

export const getNextLevelThreshold = (points: number): number => {
  const level = calculateLevel(points)
  return LEVEL_THRESHOLDS[level - 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
}

export const getPreviousLevelThreshold = (points: number): number => {
  const level = calculateLevel(points)
  return level > 1 ? LEVEL_THRESHOLDS[level - 2] : 0
}

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

const isMonthCompleted = (habitId: string, date: string, logs: HabitLog[]): boolean => {
  const currentDate = new Date(date)
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  return daysInMonth.every(day => 
    logs.some(log => 
      log.habitId === habitId && 
      log.date === format(day, 'yyyy-MM-dd') && 
      log.completed
    )
  )
}

export const calculatePointsForHabit = (
  habit: Habit,
  date: string,
  _habits: Habit[],
  logs: HabitLog[],
  currentProgress: UserProgress
): { points: number; events: ScoreEvent[]; updatedProgress: UserProgress } => {
  const events: ScoreEvent[] = []
  let totalPoints = POINTS.BASE
  const updatedProgress: UserProgress = {
    ...currentProgress,
    awardedStreakMilestones: { 
      ...currentProgress.awardedStreakMilestones,
      [habit.id]: currentProgress.awardedStreakMilestones[habit.id] || []
    }
  }

  // Base points
  events.push({
    type: 'completion',
    points: POINTS.BASE,
    details: `Completed ${habit.name}`,
    timestamp: new Date(date).getTime()
  })

  // Monthly completion bonus
  if (isMonthCompleted(habit.id, date, logs)) {
    totalPoints += POINTS.MONTHLY_COMPLETION
    events.push({
      type: 'streak',
      points: POINTS.MONTHLY_COMPLETION,
      details: `Full month ${habit.name}!`,
      timestamp: new Date(date).getTime()
    })
  }

  // Streak milestone bonuses
  const streak = calculateStreak(habit.id, logs, date)
  Object.entries(POINTS.STREAK_MILESTONES).forEach(([days, points]) => {
    const milestone = parseInt(days)
    const milestones = updatedProgress.awardedStreakMilestones[habit.id] || []
    if (streak === milestone && !milestones.includes(milestone)) {
      totalPoints += points
      events.push({
        type: 'streak',
        points,
        details: `${days}-day streak on ${habit.name}!`,
        timestamp: new Date(date).getTime()
      })
      milestones.push(milestone)
    }
  })

  // Multi-habit completion bonuses
  const completedHabits = logs.filter(log => log.date === date && log.completed)
  const completedCount = completedHabits.length

  if (completedCount >= 2) {
    const bonus = Object.entries(POINTS.MULTI_HABIT_COMPLETION)
      .reverse()
      .find(([count]) => completedCount >= parseInt(count))?.[1] || 0

    if (bonus) {
      totalPoints += bonus
      events.push({
        type: 'multicombo',
        points: bonus,
        details: `${completedCount}x Daily Combo!`,
        timestamp: new Date(date).getTime()
      })
    }
  }

  return { points: totalPoints, events, updatedProgress }
}

export const recalculateAllPoints = (
  habits: Habit[],
  logs: HabitLog[],
  currentProgress: UserProgress
): { totalPoints: number; updatedProgress: UserProgress } => {
  let totalPoints = 0
  const updatedProgress: UserProgress = {
    ...currentProgress,
    awardedStreakMilestones: {}
  }

  // Initialize milestone tracking for each habit
  habits.forEach(habit => {
    updatedProgress.awardedStreakMilestones[habit.id] = []
  })

  // Group logs by date for efficient processing
  const logsByDate = logs.reduce((acc, log) => {
    acc[log.date] = [...(acc[log.date] || []), log]
    return acc
  }, {} as Record<string, HabitLog[]>)

  // Process logs chronologically
  Object.keys(logsByDate)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .forEach(date => {
      const completedLogs = logsByDate[date].filter(log => log.completed)
      
      completedLogs.forEach(log => {
        const habit = habits.find(h => h.id === log.habitId)
        if (habit) {
          const { points, updatedProgress: newProgress } = calculatePointsForHabit(
            habit,
            date,
            habits,
            logs.filter(l => new Date(l.date) <= new Date(date)),
            updatedProgress
          )
          totalPoints += points
          updatedProgress.awardedStreakMilestones = newProgress.awardedStreakMilestones
        }
      })
    })

  return { totalPoints, updatedProgress }
}