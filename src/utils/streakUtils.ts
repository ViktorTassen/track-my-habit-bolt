import { formatDate } from './dateUtils';
import { getAllMonthlyData } from './storageUtils';
import type { HabitData } from '../types/storage';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalCount: number;
}

export const calculateStreak = (habitId: string): StreakInfo => {
  const allMonthlyData = getAllMonthlyData();
  
  const allDates = Object.values(allMonthlyData).flatMap(monthData => {
    const habitData = monthData[habitId];
    if (!habitData) return [];
    
    return Object.entries(habitData.checked_dates)
      .filter(([_, completed]) => completed)
      .map(([date]) => date);
  });

  if (allDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      totalCount: 0
    };
  }

  // Sort dates in descending order
  const sortedDates = allDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const lastCompletedDate = sortedDates[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let currentCount = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const nextDate = i < sortedDates.length - 1 ? new Date(sortedDates[i + 1]) : null;

    currentCount++;

    if (nextDate) {
      const diffDays = Math.floor(
        (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > 1) {
        longestStreak = Math.max(longestStreak, currentCount);
        currentCount = 0;
      }
    }
  }

  longestStreak = Math.max(longestStreak, currentCount);

  // Calculate current streak
  currentStreak = 0;
  const latestDate = new Date(lastCompletedDate);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const prevDate = i > 0 ? new Date(sortedDates[i - 1]) : null;

    if (prevDate) {
      const diffDays = Math.floor(
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > 1) break;
    }

    currentStreak++;
  }

  return {
    currentStreak,
    longestStreak,
    lastCompletedDate,
    totalCount: allDates.length
  };
};