import type { Habit, HabitLog, ScoreEvent, UserProgress } from '../types'
import { calculateStreak } from './scoring/streakCalculations'
import { getBasePointsByStreak, calculateDailyComboBonus } from './scoring/basePoints'
import { isMonthCompleted } from './scoring/monthlyCalculations'
import { 
  getStreakMilestoneBonus, 
  calculateMilestoneComboBonus,
  MONTHLY_COMPLETION_BONUS 
} from './scoring/milestoneCalculations'
import {
  calculateLevel,
  getLevelTitle,
  getNextLevelThreshold,
  getPreviousLevelThreshold
} from './scoring/levelCalculations'

export {
  calculateLevel,
  getLevelTitle,
  getNextLevelThreshold,
  getPreviousLevelThreshold
}

export const calculatePointsForHabit = (
  habit: Habit,
  date: string,
  habits: Habit[],
  logs: HabitLog[],
  currentProgress: UserProgress
): { points: number; events: ScoreEvent[]; updatedProgress: UserProgress } => {
  const events: ScoreEvent[] = []
  const achievements: MilestoneAchievement[] = []
  const streak = calculateStreak(habit.id, logs, date)
  
  // Calculate base points based on streak
  const basePoints = getBasePointsByStreak(streak)
  let totalPoints = basePoints

  events.push({
    type: 'completion',
    points: basePoints,
    details: `Completed ${habit.name} (Day ${streak})`,
    timestamp: new Date(date).getTime()
  })

  // Streak milestone bonuses
  const updatedProgress: UserProgress = {
    ...currentProgress,
    awardedStreakMilestones: { 
      ...currentProgress.awardedStreakMilestones,
      [habit.id]: currentProgress.awardedStreakMilestones[habit.id] || []
    }
  }

  const milestoneBonus = getStreakMilestoneBonus(streak)
  if (milestoneBonus > 0) {
    const milestones = updatedProgress.awardedStreakMilestones[habit.id] || []
    if (!milestones.includes(streak)) {
      totalPoints += milestoneBonus
      events.push({
        type: 'streak',
        points: milestoneBonus,
        details: `${streak}-day streak on ${habit.name}!`,
        timestamp: new Date(date).getTime()
      })
      milestones.push(streak)
      achievements.push({
        type: 'streak',
        value: streak,
        points: milestoneBonus
      })
    }
  }

  // Monthly completion bonus
  if (isMonthCompleted(habit.id, date, logs)) {
    totalPoints += MONTHLY_COMPLETION_BONUS
    events.push({
      type: 'streak',
      points: MONTHLY_COMPLETION_BONUS,
      details: `Full month completion for ${habit.name}!`,
      timestamp: new Date(date).getTime()
    })
    achievements.push({
      type: 'monthly',
      value: 1,
      points: MONTHLY_COMPLETION_BONUS
    })
  }

  // Daily combo bonus
  const habitIds = habits.map(h => h.id)
  const comboBonus = calculateDailyComboBonus(habitIds, logs, date)
  if (comboBonus > 0) {
    totalPoints += comboBonus
    events.push({
      type: 'multicombo',
      points: comboBonus,
      details: 'Daily combo bonus!',
      timestamp: new Date(date).getTime()
    })
  }

  // Milestone combo bonus
  if (achievements.length >= 2) {
    const milestoneComboBonus = calculateMilestoneComboBonus(achievements)
    if (milestoneComboBonus > 0) {
      totalPoints += milestoneComboBonus
      events.push({
        type: 'multicombo',
        points: milestoneComboBonus,
        details: 'Multiple milestones combo!',
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

  habits.forEach(habit => {
    updatedProgress.awardedStreakMilestones[habit.id] = []
  })

  const logsByDate = logs.reduce((acc, log) => {
    acc[log.date] = [...(acc[log.date] || []), log]
    return acc
  }, {} as Record<string, HabitLog[]>)

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