import { formatDate } from './dateUtils';
import { STORAGE_KEYS } from '../types/storage';
import type { HabitData } from '../types/storage';

export const generateDemoData = (habits: string[]) => {
  const today = new Date();
  const monthlyChunks: Record<string, HabitData> = {};

  // Start from 500 days ago
  for (let i = 499; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthKey = STORAGE_KEYS.monthlyData(month, year);
    const dateStr = formatDate(date);

    // Random completion with 70% chance
    if (Math.random() < 0.7) {
      habits.forEach(habitId => {
        if (!monthlyChunks[monthKey]) {
          monthlyChunks[monthKey] = {};
        }
        if (!monthlyChunks[monthKey][habitId]) {
          monthlyChunks[monthKey][habitId] = { checked_dates: {} };
        }
        monthlyChunks[monthKey][habitId].checked_dates[dateStr] = true;
      });
    }
  }

  // Save each monthly chunk to localStorage
  Object.entries(monthlyChunks).forEach(([monthKey, data]) => {
    localStorage.setItem(monthKey, JSON.stringify(data));
  });
};