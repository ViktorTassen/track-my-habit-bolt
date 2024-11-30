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
  awardedStreakMilestones: {}
}

function getItem<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : defaultValue
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getHabits = () => getItem(STORAGE_KEYS.HABITS, DEFAULT_HABITS)
export const saveHabits = (habits: Habit[]) => setItem(STORAGE_KEYS.HABITS, habits)
export const getLogs = () => getItem(STORAGE_KEYS.LOGS, [] as HabitLog[])
export const saveLogs = (logs: HabitLog[]) => setItem(STORAGE_KEYS.LOGS, logs)
export const getProgress = () => getItem(STORAGE_KEYS.PROGRESS, DEFAULT_PROGRESS)
export const saveProgress = (progress: UserProgress) => setItem(STORAGE_KEYS.PROGRESS, progress)