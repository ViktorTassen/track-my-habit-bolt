import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Habit, HabitLog, UserProgress } from '../types'
import { getHabits, saveHabits, getLogs, saveLogs, getProgress, saveProgress } from '../utils/storage'

interface HabitContextType {
  habits: Habit[]
  logs: HabitLog[]
  progress: UserProgress
  setHabits: (habits: Habit[]) => Promise<void>
  setLogs: (logs: HabitLog[]) => Promise<void>
  setProgress: (progress: UserProgress) => Promise<void>
}

const HabitContext = createContext<HabitContextType | null>(null)

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabitsState] = useState<Habit[]>([])
  const [logs, setLogsState] = useState<HabitLog[]>([])
  const [progress, setProgressState] = useState<UserProgress>({
    points: 0,
    level: 1,
    streaks: {},
    lastCompletedDates: {},
    awardedStreakMilestones: {}
  })

  useEffect(() => {
    const loadData = async () => {
      const [savedHabits, savedLogs, savedProgress] = await Promise.all([
        getHabits(),
        getLogs(),
        getProgress()
      ])
      setHabitsState(savedHabits)
      setLogsState(savedLogs)
      setProgressState(savedProgress)
    }
    loadData()
  }, [])

  const setHabits = async (newHabits: Habit[]) => {
    await saveHabits(newHabits)
    setHabitsState(newHabits)
  }

  const setLogs = async (newLogs: HabitLog[]) => {
    await saveLogs(newLogs)
    setLogsState(newLogs)
  }

  const setProgress = async (newProgress: UserProgress) => {
    await saveProgress(newProgress)
    setProgressState(newProgress)
  }

  return (
    <HabitContext.Provider value={{ habits, logs, progress, setHabits, setLogs, setProgress }}>
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitContext)
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider')
  }
  return context
}