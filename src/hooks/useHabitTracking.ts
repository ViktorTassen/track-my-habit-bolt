import { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';
import { getMonthlyData, saveMonthlyData, clearMonthlyData } from '../utils/storageUtils';
import type { HabitData } from '../types/storage';

export const useHabitTracking = (startDate: Date, endDate: Date) => {
  const [monthlyData, setMonthlyData] = useState<Record<string, HabitData>>({});

  const loadMonthlyData = (start: Date, end: Date) => {
    const months: Record<string, HabitData> = {};
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const key = `${month}-${year}`;

      if (!months[key]) {
        months[key] = getMonthlyData(month, year);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setMonthlyData(months);
  };

  useEffect(() => {
    loadMonthlyData(startDate, endDate);
  }, [startDate, endDate]);

  const toggleHabit = (habitId: string, date: Date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthKey = `${month}-${year}`;
    const dateStr = formatDate(date);

    const currentMonthData = monthlyData[monthKey] || {};
    const habitData = currentMonthData[habitId] || { checked_dates: {} };
    
    const newCheckedDates = { ...habitData.checked_dates };
    const isCurrentlyChecked = Boolean(newCheckedDates[dateStr]);

    if (!isCurrentlyChecked) {
      newCheckedDates[dateStr] = true;
    } else {
      delete newCheckedDates[dateStr];
    }

    // Only create habit data if there are checked dates
    const newHabitData = Object.keys(newCheckedDates).length > 0
      ? { checked_dates: newCheckedDates }
      : undefined;

    const newMonthData = {
      ...currentMonthData,
      [habitId]: newHabitData
    };

    // Remove empty habit data
    if (!newHabitData) {
      delete newMonthData[habitId];
    }

    // Only save month data if there are any habits with checked dates
    if (Object.keys(newMonthData).length > 0) {
      setMonthlyData(prev => ({
        ...prev,
        [monthKey]: newMonthData
      }));
      saveMonthlyData(month, year, newMonthData);
    } else {
      // If no habits with checked dates, remove the month data entirely
      setMonthlyData(prev => {
        const newData = { ...prev };
        delete newData[monthKey];
        return newData;
      });
      saveMonthlyData(month, year, {});
    }
  };

  const clearAllProgress = () => {
    clearMonthlyData();
    setMonthlyData({});
  };

  const isHabitCompleted = (habitId: string, date: Date): boolean => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthKey = `${month}-${year}`;
    const dateStr = formatDate(date);
    
    return Boolean(monthlyData[monthKey]?.[habitId]?.checked_dates?.[dateStr]);
  };

  return {
    monthlyData,
    toggleHabit,
    clearAllProgress,
    isHabitCompleted,
    loadMonthlyData
  };
};