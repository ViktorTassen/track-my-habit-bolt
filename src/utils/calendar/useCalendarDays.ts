import { addDays, isToday } from 'date-fns'

export function useCalendarDays(startDate: Date, daysToShow: number) {
  const days = Array.from(
    { length: daysToShow }, 
    (_, i) => addDays(startDate, i)
  )
  
  const endDate = days[days.length - 1]
  const isCurrentDateVisible = days.some(day => isToday(day))

  return {
    days,
    endDate,
    isCurrentDateVisible
  }
}