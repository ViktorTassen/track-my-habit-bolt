import type { Habit } from '../types'
import { STORAGE_KEYS } from './constants'

const DEFAULT_HABITS: Habit[] = [
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

export const getHabits = (): Habit[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.HABITS)
  return stored ? JSON.parse(stored) : DEFAULT_HABITS
}

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits))
}