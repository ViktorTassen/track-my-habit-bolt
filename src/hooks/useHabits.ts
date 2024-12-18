import { useState, useEffect } from 'react';
import { PRESET_COLORS } from '../constants/colors';
import type { Habit, HabitList } from '../types/habit';
import { STORAGE_KEYS } from '../types/storage';

const defaultHabits: HabitList = [
  {
    id: 'default',
    name: 'Check Habits Daily!',
    color: PRESET_COLORS[3], // Green
    createdAt: new Date().toISOString(),
    archived: false,
    order: 0,
  },
];

export const useHabits = () => {
  const [habits, setHabits] = useState<HabitList>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.habits);
    if (stored) {
      const parsedHabits = JSON.parse(stored);
      // Ensure all habits have an order property
      return parsedHabits.map((habit: Habit, index: number) => ({
        ...habit,
        order: habit.order ?? index,
      }));
    }
    return defaultHabits;
  });
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name: string, color: string) => {
    const maxOrder = Math.max(...habits.map(h => h.order), -1);
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date().toISOString(),
      archived: false,
      order: maxOrder + 1,
    };
    
    setHabits(prev => [...prev, newHabit]);
  };

  const editHabit = (id: string, name: string, color: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, name: name.trim(), color } 
        : habit
    ));
  };

  const removeHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const toggleArchiveHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit =>
      habit.id === habitId
        ? { ...habit, archived: !habit.archived }
        : habit
    ));
  };

  const toggleShowArchived = () => {
    setShowArchived(prev => !prev);
  };

  const reorderHabits = (activeId: string, overId: string) => {
    setHabits(prev => {
      const oldIndex = prev.findIndex(h => h.id === activeId);
      const newIndex = prev.findIndex(h => h.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newHabits = [...prev];
      const [movedHabit] = newHabits.splice(oldIndex, 1);
      newHabits.splice(newIndex, 0, movedHabit);

      // Update order values
      return newHabits.map((habit, index) => ({
        ...habit,
        order: index,
      }));
    });
  };

  // Sort habits by order
  const sortedHabits = [...habits].sort((a, b) => a.order - b.order);

  return {
    habits: sortedHabits,
    showArchived,
    addHabit,
    editHabit,
    removeHabit,
    toggleArchiveHabit,
    toggleShowArchived,
    reorderHabits,
  };
};