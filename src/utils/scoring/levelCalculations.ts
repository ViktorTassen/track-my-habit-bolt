import { LEVEL_THRESHOLDS, LEVEL_TITLES } from '../../config/gameConfig'

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