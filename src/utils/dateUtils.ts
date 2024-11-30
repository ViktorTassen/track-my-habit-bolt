import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameWeek } from 'date-fns'

export const formatDate = (date: Date, formatStr: string) => format(date, formatStr)
export const getMonthDays = (date: Date) => {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  return eachDayOfInterval({ start: monthStart, end: monthEnd })
}
export const checkIsToday = (date: Date) => isToday(date)
export const checkIsSameWeek = (date1: Date, date2: Date) => 
  isSameWeek(date1, date2, { weekStartsOn: 1 })