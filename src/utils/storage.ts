import type { Habit, HabitLog, UserProgress } from '../types'

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
  frequency: "daily"
}]

const DEFAULT_PROGRESS: UserProgress = {
  points: 0,
  level: 1,
  streaks: {},
  lastCompletedDates: {},
  awardedStreakMilestones: {},
  selectedCharacter: {
    character: 'CuteCat',
    variant: 'Character01'
  }
}

export const getHabits = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.HABITS)
  return stored ? JSON.parse(stored) : DEFAULT_HABITS
}

export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits))
}

export const getLogs = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.LOGS)
  return stored ? JSON.parse(stored) : []
}

export const saveLogs = (logs: HabitLog[]) => {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs))
}

export const getProgress = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS)
  const progress = stored ? JSON.parse(stored) : DEFAULT_PROGRESS
  
  // Ensure default character is set
  if (!progress.selectedCharacter) {
    progress.selectedCharacter = DEFAULT_PROGRESS.selectedCharacter
  }
  
  return progress
}

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
}