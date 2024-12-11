import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import type { Habit, HabitLog, UserProgress, ScoreEvent } from '../../types'
import { POINTS } from '../../config/gameConfig'
import { calculateLevel } from './levelCalculations'
import { getMonthlyStats, getMonthlyLogs } from '../storage/monthlyStorage'

export const isMonthCompleted = (
  habitId: string, 
  date: string, 
  logs: HabitLog[]
): boolean => {
  const currentDate = new Date(date)
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  return daysInMonth.every(day => 
    logs.some(log => 
      log.habitId === habitId && 
      format(day, 'yyyy-MM-dd') === log.date && 
      log.completed
    )
  )
}

export const calculateMonthPoints = async (
  habit: Habit,
  date: string,
  habits: Habit[],
  currentProgress: UserProgress
): Promise<{
  events: ScoreEvent[]
  updatedProgress: UserProgress
}> => {
  const monthKey = format(new Date(date), 'yyyy-MM')
  const monthStats = await getMonthlyStats(monthKey)
  
  if (!monthStats) {
    return { events: [], updatedProgress: currentProgress }
  }

  const events: ScoreEvent[] = []
  let totalPoints = POINTS.BASE

  // Add base completion points
  events.push({
    type: 'completion',
    points: POINTS.BASE,
    details: `Completed ${habit.name}`,
    timestamp: Date.now()
  })

  // Add streak bonus if applicable
  const currentStreak = monthStats.streaks[habit.id] || 0
  if (currentStreak > 0) {
    const streakPoints = Object.entries(POINTS.STREAK_MILESTONES)
      .find(([days]) => currentStreak === parseInt(days))
      ?.[1] || 0

    if (streakPoints > 0) {
      totalPoints += streakPoints
      events.push({
        type: 'streak',
        points: streakPoints,
        details: `${currentStreak}-day streak on ${habit.name}!`,
        timestamp: Date.now()
      })
    }
  }

  // Add monthly completion bonus if applicable
  if (monthStats.monthlyCompletions.includes(habit.id)) {
    totalPoints += POINTS.MONTHLY_COMPLETION
    events.push({
      type: 'streak',
      points: POINTS.MONTHLY_COMPLETION,
      details: `Full month ${habit.name}!`,
      timestamp: Date.now()
    })
  }

  const updatedProgress = {
    ...currentProgress,
    points: currentProgress.points + totalPoints,
    level: calculateLevel(currentProgress.points + totalPoints)
  }

  return { events, updatedProgress }
}

export const recalculateMonthPoints = async (
  habits: Habit[],
  monthKey: string,
  currentProgress: UserProgress
): Promise<{
  totalPoints: number
  updatedProgress: UserProgress
}> => {
  const monthStats = await getMonthlyStats(monthKey)
  const monthLogs = await getMonthlyLogs(monthKey)
  
  if (!monthStats || !monthLogs) {
    return { 
      totalPoints: currentProgress.points,
      updatedProgress: currentProgress 
    }
  }

  let totalPoints = 0

  // Calculate points for all completed habits
  monthLogs.forEach(log => {
    if (log.completed) {
      totalPoints += POINTS.BASE
    }
  })

  // Add streak bonuses
  Object.entries(monthStats.bestStreaks).forEach(([habitId, streak]) => {
    const streakPoints = Object.entries(POINTS.STREAK_MILESTONES)
      .filter(([days]) => parseInt(days) <= streak)
      .reduce((sum, [_, points]) => sum + points, 0)
    
    totalPoints += streakPoints
  })

  // Add monthly completion bonuses
  monthStats.monthlyCompletions.forEach(() => {
    totalPoints += POINTS.MONTHLY_COMPLETION
  })

  const updatedProgress = {
    ...currentProgress,
    points: totalPoints,
    level: calculateLevel(totalPoints)
  }

  return { totalPoints, updatedProgress }
}