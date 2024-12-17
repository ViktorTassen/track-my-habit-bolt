import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns'
import type { HabitLog } from '../../types'

export const isMonthCompleted = (habitId: string, date: string, logs: HabitLog[]): boolean => {
  const currentDate = new Date(date)
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  return daysInMonth.every(day => 
    logs.some(log => 
      log.habitId === habitId && 
      log.date === format(day, 'yyyy-MM-dd') && 
      log.completed
    )
  )
}