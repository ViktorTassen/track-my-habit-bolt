export interface CalendarRange {
  startDate: Date;
  endDate: Date;
}

export interface MonthData {
  [key: string]: boolean; // date string -> completion status
}

export interface HabitData {
  [monthKey: string]: MonthData;
}