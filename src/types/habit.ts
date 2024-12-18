export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  archived?: boolean;
  order: number;
}

export interface HabitProgress {
  [habitId: string]: {
    [monthKey: string]: {
      [dateStr: string]: boolean;
    };
  };
}

export type HabitList = Habit[];