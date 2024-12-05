import type { ScoreEvent } from '../types'
import type { MilestoneAchievement } from './milestoneTypes'
import { calculateComboScore } from './comboCalculations'

export const calculateMilestoneComboBonus = (
  achievements: MilestoneAchievement[]
): {
  points: number
  event: ScoreEvent | null
} => {
  if (achievements.length < 2) {
    return { points: 0, event: null }
  }

  const { points, details } = calculateComboScore(achievements)

  if (points > 0) {
    return {
      points,
      event: {
        type: 'multicombo',
        points,
        details,
        timestamp: Date.now()
      }
    }
  }

  return { points: 0, event: null }
}