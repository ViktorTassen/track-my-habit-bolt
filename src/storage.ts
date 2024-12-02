import type { Habit, HabitLog, UserProgress } from './types'
import { ANIMATION_CONFIG } from './config/animationConfig'

const STORAGE_KEYS = {
  HABITS: 'habits',
  LOGS: 'habit-logs',
  PROGRESS: 'user-progress'
} as const

const DEFAULT_HABITS: Habit[] = [{
  id: "default-1",
  name: "Daily Exercise",
  color: "#4F46E5",
  createdAt: new Date().toISOString(),
  frequency: "daily",
  order: 0
}]

const DEFAULT_PROGRESS: UserProgress = {
  points: 0,
  level: 1,
  streaks: {},
  lastCompletedDates: {},
  awardedStreakMilestones: {},
  selectedCharacter: ANIMATION_CONFIG.defaultCharacter,
  habitOrder: []
}

export const getHabits = (): Habit[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.HABITS)
  return stored ? JSON.parse(stored) : DEFAULT_HABITS
}

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits))
}

export const getLogs = (): HabitLog[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.LOGS)
  return stored ? JSON.parse(stored) : []
}

export const saveLogs = (logs: HabitLog[]): void => {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs))
}

export const getProgress = (): UserProgress => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS)
  const progress = stored ? JSON.parse(stored) : DEFAULT_PROGRESS
  
  // Ensure default character is set
  if (!progress.selectedCharacter) {
    progress.selectedCharacter = DEFAULT_PROGRESS.selectedCharacter
  }
  
  return progress
}

export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
}