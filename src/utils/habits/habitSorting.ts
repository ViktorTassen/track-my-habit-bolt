import type { Habit } from '../../types'
import type { HabitState } from './types'

export const sortAndGroupHabits = (habits: Habit[]): HabitState => {
  const sorted = [...habits].sort((a, b) => a.order - b.order)
  
  return sorted.reduce((acc, habit) => {
    if (habit.archived) {
      acc.archivedHabits.push(habit)
    } else {
      acc.activeHabits.push(habit)
    }
    return acc
  }, { activeHabits: [] as Habit[], archivedHabits: [] as Habit[] })
}