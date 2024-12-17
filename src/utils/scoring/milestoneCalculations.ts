import type { MilestoneAchievement } from './types'

const STREAK_MILESTONES = {
  3: 30,
  7: 150,
  14: 250,
  30: 500,
  50: 1000,
  100: 2500,
  200: 4000,
  365: 7000,
  500: 10000,
  1000: 100000
} as const

export const MONTHLY_COMPLETION_BONUS = 1000

export const getStreakMilestoneBonus = (streak: number): number => {
  return STREAK_MILESTONES[streak as keyof typeof STREAK_MILESTONES] || 0
}

export const calculateMilestoneComboBonus = (achievements: MilestoneAchievement[]): number => {
  if (achievements.length < 2) return 0

  const totalMilestonePoints = achievements.reduce((sum, achievement) => {
    return sum + achievement.points
  }, 0)

  return totalMilestonePoints * achievements.length
}

export const getAllMilestones = () => STREAK_MILESTONES