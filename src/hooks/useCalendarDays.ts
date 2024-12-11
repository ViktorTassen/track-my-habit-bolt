import { useMemo } from 'react'
import { addDays, isToday } from 'date-fns'

export function useCalendarDays(startDate: Date, daysToShow: number) {
  return useMemo(() => {
    const days = Array.from(
      { length: daysToShow }, 
      (_, i) => addDays(startDate, i)
    )
    
    return {
      days,
      endDate: days[days.length - 1],
      isCurrentDateVisible: days.some(day => isToday(day))
    }
  }, [startDate, daysToShow])
}