export interface HabitData {
  [habitId: string]: {
    checked_dates: {
      [dateStr: string]: boolean;
    };
  };
}

export interface StorageKeys {
  habits: string;
  monthlyData: (month: number, year: number) => string;
  calendarRange: string;
}

export const STORAGE_KEYS: StorageKeys = {
  habits: 'track-my-habit-list',
  monthlyData: (month: number, year: number) => `track-my-habit-${month}-${year}`,
  calendarRange: 'track-my-habit-calendar-range',
};