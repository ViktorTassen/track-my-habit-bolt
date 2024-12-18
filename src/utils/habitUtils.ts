import { formatDate } from './dateUtils';

export const areAllHabitsCompletedForDate = (
  habits: { id: string }[],
  date: Date,
  isHabitCompleted: (habitId: string, date: Date) => boolean
): boolean => {
  const activeHabits = habits.filter(habit => !habit.archived);
  if (activeHabits.length === 0) return false;
  
  return activeHabits.every(habit => isHabitCompleted(habit.id, date));
};