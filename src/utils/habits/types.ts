import type { Habit, HabitLog } from '../../types'

export interface HabitState {
  activeHabits: Habit[]
  archivedHabits: Habit[]
}

export interface HabitLogState {
  logsByDate: Record<string, HabitLog[]>
  completedByDate: Record<string, string[]>
}

export interface HabitOperations {
  addHabit: (name: string, color: string) => Promise<void>
  updateHabit: (id: string, name: string, color: string) => Promise<void>
  archiveHabit: (id: string) => Promise<void>
  unarchiveHabit: (id: string) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  toggleHabit: (id: string, date: string) => Promise<void>
  reorderHabits: (habitIds: string[]) => Promise<void>
  handleClearScore: () => Promise<void>
  handleClearAll: () => Promise<void>
}