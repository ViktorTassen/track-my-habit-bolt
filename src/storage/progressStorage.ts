import type { UserProgress } from '../types'
import { STORAGE_KEYS } from './constants'
import { ANIMATION_CONFIG } from '../config/animationConfig'

const DEFAULT_PROGRESS: UserProgress = {
  points: 0,
  level: 1,
  streaks: {},
  lastCompletedDates: {},
  awardedStreakMilestones: {},
  selectedCharacter: ANIMATION_CONFIG.defaultCharacter,
  habitOrder: []
}

export const getProgress = (): UserProgress => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS)
  const progress = stored ? JSON.parse(stored) : DEFAULT_PROGRESS

  if (!progress.selectedCharacter) {
    progress.selectedCharacter = DEFAULT_PROGRESS.selectedCharacter
  }

  return progress
}

export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
}