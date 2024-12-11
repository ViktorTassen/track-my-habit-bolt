import type { Habit, HabitLog, ScoreEvent, UserProgress } from '../../types'
import { POINTS } from '../../config/gameConfig'
import { calculateMilestoneComboBonus } from '../milestones/milestoneCalculations'
import { calculateStreak } from '../streaks/streakCalculations'
import { isMonthCompleted } from './monthlyCalculations'
import { calculateLevel } from './levelCalculations'
import type { MilestoneAchievement } from '../milestones/achievementTypes'

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

  const achievements: MilestoneAchievement[] = []

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
    achievements.push({
      type: 'monthly',
      value: 1,
      points: POINTS.MONTHLY_COMPLETION
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
      achievements.push({
        type: 'streak',
        value: milestone,
        points
      })
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
      achievements.push({
        type: 'multi',
        value: completedCount,
        points: bonus
      })
    }
  }

  // Calculate milestone combo bonus if multiple achievements
  if (achievements.length >= 2) {
    const { points: comboBonus, event: comboEvent } = calculateMilestoneComboBonus(achievements)
    if (comboBonus > 0 && comboEvent) {
      totalPoints += comboBonus
      events.push(comboEvent)
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