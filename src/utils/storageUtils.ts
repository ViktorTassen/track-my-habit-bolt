import type { HabitData } from '../types/storage';
import { STORAGE_KEYS } from '../types/storage';

export const getMonthlyData = (month: number, year: number): HabitData => {
  const key = STORAGE_KEYS.monthlyData(month, year);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
};

export const getAllMonthlyData = (): Record<string, HabitData> => {
  const allData: Record<string, HabitData> = {};
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.match(/^track-my-habit-\d{1,2}-\d{4}$/)) {
      const stored = localStorage.getItem(key);
      if (stored) {
        allData[key] = JSON.parse(stored);
      }
    }
  });
  
  return allData;
};

export const saveMonthlyData = (
  month: number,
  year: number,
  data: HabitData
): void => {
  const key = STORAGE_KEYS.monthlyData(month, year);
  localStorage.setItem(key, JSON.stringify(data));
};

export const clearMonthlyData = (): void => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.match(/^track-my-habit-\d{1,2}-\d{4}$/)) {
      localStorage.removeItem(key);
    }
  });
};