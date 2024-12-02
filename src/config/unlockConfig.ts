import { LEVEL_THRESHOLDS } from './gameConfig'

// Define unlock requirements for each variant
export const VARIANT_UNLOCK_LEVELS: Record<string, number> = {
  'Character01': 1,  // Available from start
  'Character02': 2,  // Unlock at level 2
  'Character03': 3,  // Unlock at level 5
  'Character04': 4, // Unlock at level 10
  'Character05': 5, // Unlock at level 15
  'Character06': 6, // Unlock at level 20
  'Character07': 7, // Unlock at level 25
  'Character08': 8, // Unlock at level 30
  'Character09': 10, // Unlock at level 35
  'Character10': 12, // Unlock at level 40
  'Character11': 14, // Unlock at level 45
  'Character12': 16, // Unlock at level 50
  'Character13': 20, // Unlock at level 55
  'Character14': 25, // Unlock at level 60
  'Character15': 30, // Unlock at level 65
}

export const isVariantUnlocked = (variant: string, level: number): boolean => {
  const requiredLevel = VARIANT_UNLOCK_LEVELS[variant] || 1
  return level >= requiredLevel
}

export const getNextUnlockLevel = (currentLevel: number): number | null => {
  const nextUnlock = Object.values(VARIANT_UNLOCK_LEVELS)
    .sort((a, b) => a - b)
    .find(level => level > currentLevel)
  
  return nextUnlock || null
}

export const getPointsToNextUnlock = (points: number): number | null => {
  const currentLevel = LEVEL_THRESHOLDS.findIndex(threshold => threshold > points) + 1
  const nextUnlockLevel = getNextUnlockLevel(currentLevel)
  
  if (!nextUnlockLevel) return null
  
  const pointsNeeded = LEVEL_THRESHOLDS[nextUnlockLevel - 1] - points
  return Math.max(0, pointsNeeded)
}