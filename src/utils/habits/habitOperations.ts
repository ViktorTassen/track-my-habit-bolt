import { format } from 'date-fns'
import type { Habit, HabitLog, UserProgress, ScoreEvent } from '../../types'
import type { HabitOperations } from './types'
import { saveHabits, saveLogs, saveProgress } from '../storage'
import { calculatePointsForHabit, recalculateAllPoints, calculateLevel } from '../scoring'

export const createHabitOperations = (
  habits: Habit[],
  logs: HabitLog[],
  progress: UserProgress,
  setHabits: (habits: Habit[]) => void,
  setLogs: (logs: HabitLog[]) => void,
  setProgress: (progress: UserProgress) => void,
  setScoreEvents: (events: ScoreEvent[]) => void
): HabitOperations => {
  const addHabit = async (name: string, color: string) => {
    const maxOrder = Math.max(...habits.map(h => h.order), -1)
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date().toISOString(),
      frequency: "daily",
      archived: false,
      order: maxOrder + 1
    }
    const updatedHabits = [...habits, newHabit]
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }

  const updateHabit = async (habitId: string, name: string, color: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId ? { ...habit, name, color } : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }

  const archiveHabit = async (habitId: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, archived: true, archivedAt: new Date().toISOString() }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }

  const unarchiveHabit = async (habitId: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, archived: false, archivedAt: undefined }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }

  const deleteHabit = async (habitId: string) => {
    const updatedHabits = habits.filter(h => h.id !== habitId)
    const updatedLogs = logs.filter(l => l.habitId !== habitId)
    
    await Promise.all([
      saveHabits(updatedHabits),
      saveLogs(updatedLogs)
    ])
    
    setHabits(updatedHabits)
    setLogs(updatedLogs)

    const { totalPoints, updatedProgress } = recalculateAllPoints(updatedHabits, updatedLogs, progress)
    const level = calculateLevel(totalPoints)
    const newProgress = {
      ...updatedProgress,
      points: totalPoints,
      level
    }
    
    await saveProgress(newProgress)
    setProgress(newProgress)
  }

  const toggleHabit = async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit || (habit.archived && habit.archivedAt && new Date(date) > new Date(habit.archivedAt))) return

    const existingLog = logs.find(
      l => l.habitId === habitId && l.date === date
    )

    let updatedLogs: HabitLog[]
    if (existingLog) {
      updatedLogs = logs.map(log =>
        log.habitId === habitId && log.date === date
          ? { ...log, completed: !log.completed }
          : log
      )
    } else {
      updatedLogs = [
        ...logs,
        { habitId, date, completed: true }
      ]
    }
    
    await saveLogs(updatedLogs)
    setLogs(updatedLogs)

    const isCompleting = !existingLog || !existingLog.completed
    if (isCompleting) {
      const { points, events, updatedProgress } = calculatePointsForHabit(
        habit,
        date,
        habits,
        updatedLogs,
        progress
      )

      const newProgress = {
        ...updatedProgress,
        points: progress.points + points,
        level: calculateLevel(progress.points + points)
      }
      
      await saveProgress(newProgress)
      setProgress(newProgress)
      setScoreEvents(events)
    }
  }

  const reorderHabits = async (habitIds: string[]) => {
    const updatedHabits = habits.map(habit => ({
      ...habit,
      order: habitIds.indexOf(habit.id)
    }))
    
    const updatedProgress = {
      ...progress,
      habitOrder: habitIds
    }

    await Promise.all([
      saveHabits(updatedHabits),
      saveProgress(updatedProgress)
    ])

    setHabits(updatedHabits)
    setProgress(updatedProgress)
  }

  const handleClearScore = async () => {
    await saveLogs([])
    setLogs([])
    
    const resetProgress: UserProgress = {
      points: 0,
      level: 1,
      streaks: {},
      lastCompletedDates: {},
      awardedStreakMilestones: {},
      selectedCharacter: progress.selectedCharacter
    }
    
    await saveProgress(resetProgress)
    setProgress(resetProgress)
  }

  const handleClearAll = async () => {
    await Promise.all([
      saveHabits([]),
      saveLogs([])
    ])
    
    setHabits([])
    setLogs([])
    
    const resetProgress: UserProgress = {
      points: 0,
      level: 1,
      streaks: {},
      lastCompletedDates: {},
      awardedStreakMilestones: {},
      selectedCharacter: progress.selectedCharacter
    }
    
    await saveProgress(resetProgress)
    setProgress(resetProgress)
  }

  return {
    addHabit,
    updateHabit,
    archiveHabit,
    unarchiveHabit,
    deleteHabit,
    toggleHabit,
    reorderHabits,
    handleClearScore,
    handleClearAll
  }
}