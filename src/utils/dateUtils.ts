export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getMonthKey = (date: Date): string => {
  return `track-my-habit-${date.getMonth() + 1}-${date.getFullYear()}`;
};

export const getDayRange = (startDate: Date, days: number): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}, ${endDate.getFullYear()}`;
};

export const getUniqueMonthKeys = (startDate: Date, endDate: Date): string[] => {
  const keys = new Set<string>();
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    keys.add(getMonthKey(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return Array.from(keys);
};