import type { HabitLog } from '../types'
import { addDays, subDays, format, isSameDay } from 'date-fns'

// Configuration for test data generation
const TEST_DATA_CONFIG = {
  DAYS_BACK: 1000,
  STREAK_PROBABILITIES: {
    INITIAL: 0.9,    // 90% chance to complete habit initially
    AFTER_30: 0.85,  // 85% after 30 days
    AFTER_100: 0.8,  // 80% after 100 days
    AFTER_365: 0.75  // 75% after 365 days
  },
  BREAK_PATTERNS: {
    SHORT_BREAK: { minDays: 1, maxDays: 3, probability: 0.3 },
    MEDIUM_BREAK: { minDays: 4, maxDays: 7, probability: 0.15 },
    LONG_BREAK: { minDays: 7, maxDays: 14, probability: 0.05 }
  }
}

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const shouldTakeBreak = (streak: number): { takeBreak: boolean; duration: number } => {
  const { SHORT_BREAK, MEDIUM_BREAK, LONG_BREAK } = TEST_DATA_CONFIG.BREAK_PATTERNS
  
  if (streak > 100 && Math.random() < LONG_BREAK.probability) {
    return { 
      takeBreak: true, 
      duration: getRandomInt(LONG_BREAK.minDays, LONG_BREAK.maxDays) 
    }
  }
  
  if (streak > 30 && Math.random() < MEDIUM_BREAK.probability) {
    return { 
      takeBreak: true, 
      duration: getRandomInt(MEDIUM_BREAK.minDays, MEDIUM_BREAK.maxDays) 
    }
  }
  
  if (Math.random() < SHORT_BREAK.probability) {
    return { 
      takeBreak: true, 
      duration: getRandomInt(SHORT_BREAK.minDays, SHORT_BREAK.maxDays) 
    }
  }

  return { takeBreak: false, duration: 0 }
}

const getCompletionProbability = (streak: number): number => {
  const { INITIAL, AFTER_30, AFTER_100, AFTER_365 } = TEST_DATA_CONFIG.STREAK_PROBABILITIES
  
  if (streak > 365) return AFTER_365
  if (streak > 100) return AFTER_100
  if (streak > 30) return AFTER_30
  return INITIAL
}

export const generateHistoricalData = (habitIds: string[]): HabitLog[] => {
  const logs: HabitLog[] = []
  const today = new Date()
  const startDate = subDays(today, TEST_DATA_CONFIG.DAYS_BACK)

  // Generate logs for each habit
  habitIds.forEach(habitId => {
    let currentDate = startDate
    let streak = 0
    
    while (currentDate <= today) {
      const probability = getCompletionProbability(streak)
      const { takeBreak, duration } = shouldTakeBreak(streak)

      if (takeBreak) {
        // Skip some days to create natural breaks
        currentDate = addDays(currentDate, duration)
        streak = 0
        continue
      }

      // Decide whether to complete the habit
      const completed = Math.random() < probability

      if (completed) {
        logs.push({
          habitId,
          date: format(currentDate, 'yyyy-MM-dd'),
          completed: true
        })
        streak++
      } else {
        streak = 0
      }

      currentDate = addDays(currentDate, 1)
    }
  })

  // Sort logs by date and remove duplicates
  return logs
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((log, index, self) => 
      index === self.findIndex(l => 
        l.habitId === log.habitId && l.date === log.date
      )
    )
}