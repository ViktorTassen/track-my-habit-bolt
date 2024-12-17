import type { HabitLog } from '../types'
import { addDays, subDays, format } from 'date-fns'

export const generateHistoricalData = (habitIds: string[], daysBack: number = 1000): HabitLog[] => {
  const logs: HabitLog[] = []
  const today = new Date()
  const startDate = subDays(today, daysBack)

  // Generate logs for each habit
  habitIds.forEach(habitId => {
    let currentDate = startDate
    let streak = 0
    let skipProbability = 0.1 // 10% chance to skip a day initially

    while (currentDate <= today) {
      // Increase skip probability as streak grows
      if (streak > 30) skipProbability = 0.15
      if (streak > 100) skipProbability = 0.2
      if (streak > 365) skipProbability = 0.25

      // Decide whether to complete the habit
      const completed = Math.random() > skipProbability

      if (completed) {
        logs.push({
          habitId,
          date: format(currentDate, 'yyyy-MM-dd'),
          completed: true
        })
        streak++
      } else {
        streak = 0
        skipProbability = 0.1 // Reset skip probability after breaking streak
      }

      currentDate = addDays(currentDate, 1)
    }
  })

  // Sort logs by date
  return logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}