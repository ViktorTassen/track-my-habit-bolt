import type { Habit, UserProgress } from '../../types'
import { ANIMATION_CONFIG } from '../../config'

export const DEFAULT_HABITS: Habit[] = [
  {
    id: "default-1",
    name: "Daily Exercise",
    color: "#0667d2",
    createdAt: new Date().toISOString(),
    frequency: "daily",
    order: 0
  },
  {
    id: "default-2",
    name: "8h sleep",
    color: "#059669",
    createdAt: new Date().toISOString(),
    frequency: "daily",
    order: 2
  }
]

export const DEFAULT_PROGRESS: UserProgress = {
  points: 0,
  level: 1,
  streaks: {},
  lastCompletedDates: {},
  awardedStreakMilestones: {},
  selectedCharacter: ANIMATION_CONFIG.defaultCharacter,
  habitOrder: []
}