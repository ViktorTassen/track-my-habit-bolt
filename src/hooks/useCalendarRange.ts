import { useState, useEffect } from 'react';
import type { CalendarRange } from '../types/calendar';
import { STORAGE_KEYS } from '../types/storage';

const getInitialRange = (): CalendarRange => {
  const savedRange = localStorage.getItem(STORAGE_KEYS.calendarRange);
  if (savedRange) {
    const { startDate, endDate } = JSON.parse(savedRange);
    return {
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    };
  }
  
  const today = new Date();
  return {
    startDate: today,
    endDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
  };
};

export const useCalendarRange = () => {
  const [range, setRange] = useState<CalendarRange>(getInitialRange);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.calendarRange, JSON.stringify({
      startDate: range.startDate.toISOString(),
      endDate: range.endDate.toISOString()
    }));
  }, [range]);

  const updateRange = (startDate: Date) => {
    const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    setRange({ startDate, endDate });
  };

  return {
    range,
    updateRange
  };
};