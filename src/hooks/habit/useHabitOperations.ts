import { useCallback } from 'react'
import type { Habit, HabitLog, UserProgress, ScoreEvent } from '../../types'
import { 
  saveHabits, 
  saveLogs, 
  saveProgress, 
  getLogs,
  clearAllHabitData 
} from '../../storage'
import { recalculateAllPoints, calculateLevel } from '../../utils/scoring'
import { generateHistoricalData } from '../../utils/dataGenerator'

export function useHabitOperations(
  habits: Habit[],
  progress: UserProgress,
  setHabits: (habits: Habit[]) => void,
  setLogs: (logs: HabitLog[]) => void,
  setProgress: (progress: UserProgress) => void,
  setScoreEvents: (events: ScoreEvent[]) => void
) {
  const handleAddHabit = useCallback(async (name: string, color: string) => {
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
  }, [habits, setHabits])

  const handleUpdateHabit = useCallback(async (habitId: string, name: string, color: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, name, color }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }, [habits, setHabits])

  const handleArchiveHabit = useCallback(async (habitId: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, archived: true, archivedAt: new Date().toISOString() }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }, [habits, setHabits])

  const handleUnarchiveHabit = useCallback(async (habitId: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, archived: false, archivedAt: undefined }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }, [habits, setHabits])

  const handleDeleteHabit = useCallback(async (habitId: string) => {
    const updatedHabits = habits.filter(h => h.id !== habitId)
    const allLogs = await getLogs()
    const updatedLogs = allLogs.filter(l => l.habitId !== habitId)
    
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
      level,
      selectedCharacter: progress.selectedCharacter
    }
    
    await saveProgress(newProgress)
    setProgress(newProgress)
  }, [habits, progress, setHabits, setLogs, setProgress])

  const handleReorderHabits = useCallback(async (habitIds: string[]) => {
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
  }, [habits, progress, setHabits, setProgress])

  const handleClearAll = useCallback(async () => {
    const resetProgress: UserProgress = {
      points: 0,
      level: 1,
      streaks: {},
      lastCompletedDates: {},
      awardedStreakMilestones: {},
      selectedCharacter: progress.selectedCharacter,
      habitOrder: []
    }
    
    clearAllHabitData()
    
    setHabits([])
    setLogs([])
    setProgress(resetProgress)
    setScoreEvents([])
  }, [progress.selectedCharacter, setHabits, setLogs, setProgress, setScoreEvents])

  const handleGenerateTestData = useCallback(async () => {
    const activeHabits = habits.filter(h => !h.archived)
    if (activeHabits.length === 0) {
      alert('Please add at least one habit first')
      return
    }
    
    const historicalLogs = generateHistoricalData(activeHabits.map(h => h.id))
    await saveLogs(historicalLogs)
    setLogs(historicalLogs)

    const { totalPoints, updatedProgress } = recalculateAllPoints(habits, historicalLogs, progress)
    const level = calculateLevel(totalPoints)
    const newProgress = {
      ...updatedProgress,
      points: totalPoints,
      level,
      selectedCharacter: progress.selectedCharacter
    }
    
    await saveProgress(newProgress)
    setProgress(newProgress)
    setScoreEvents([])
  }, [habits, progress, setLogs, setProgress, setScoreEvents])

  return {
    handleAddHabit,
    handleUpdateHabit,
    handleArchiveHabit,
    handleUnarchiveHabit,
    handleDeleteHabit,
    handleClearAll,
    handleReorderHabits,
    handleGenerateTestData
  }
}