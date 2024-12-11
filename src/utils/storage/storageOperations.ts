import type { Habit, HabitLog, UserProgress } from '../../types'
import { STORAGE_KEYS } from './constants'
import { DEFAULT_HABITS, DEFAULT_PROGRESS } from './defaultData'

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

  if (!progress.selectedCharacter) {
    progress.selectedCharacter = DEFAULT_PROGRESS.selectedCharacter
  }

  return progress
}

export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
}