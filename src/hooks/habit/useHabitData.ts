import { useCallback } from 'react'
import { getHabits, getProgress, getLogs } from '../../storage'
import { useHabitState } from './useHabitState'
import { useHabitOperations } from './useHabitOperations'
import { useHabitScoring } from './useHabitScoring'
import { calculateLevel } from '../../utils/scoring'
import { ANIMATION_CONFIG } from '../../config/animationConfig'

export function useHabitData() {
  const {
    habits,
    logs,
    progress,
    scoreEvents,
    setHabits,
    setLogs,
    setProgress,
    setScoreEvents
  } = useHabitState()

  const {
    handleAddHabit,
    handleUpdateHabit,
    handleArchiveHabit,
    handleUnarchiveHabit,
    handleDeleteHabit,
    handleClearAll,
    handleReorderHabits,
    handleGenerateTestData
  } = useHabitOperations(
    habits,
    progress,
    setHabits,
    setLogs,
    setProgress,
    setScoreEvents
  )

  const {
    handleToggleHabit
  } = useHabitScoring(
    habits,
    logs,
    progress,
    setLogs,
    setProgress,
    setScoreEvents
  )

  const loadData = useCallback(async () => {
    try {
      // Load all data at once
      const [savedHabits, savedProgress, savedLogs] = await Promise.all([
        getHabits(),
        getProgress(),
        getLogs()
      ])

      const habitsWithOrder = savedHabits.map((habit, index) => ({
        ...habit,
        order: savedProgress.habitOrder?.indexOf(habit.id) ?? index
      }))

      setHabits(habitsWithOrder)
      setLogs(savedLogs) // Store all logs in state
      
      const defaultCharacter = ANIMATION_CONFIG.defaultCharacter
      const selectedCharacter = savedProgress.selectedCharacter || defaultCharacter
      
      const updatedProgress = {
        ...savedProgress,
        selectedCharacter,
        level: calculateLevel(savedProgress.points),
        streaks: savedProgress.streaks || {},
        lastCompletedDates: savedProgress.lastCompletedDates || {},
        awardedStreakMilestones: savedProgress.awardedStreakMilestones || {},
        habitOrder: savedProgress.habitOrder || []
      }
      
      setProgress(updatedProgress)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [setHabits, setLogs, setProgress])

  return {
    habits,
    logs,
    progress,
    scoreEvents,
    loadData,
    handleAddHabit,
    handleUpdateHabit,
    handleArchiveHabit,
    handleUnarchiveHabit,
    handleDeleteHabit,
    handleToggleHabit,
    handleClearAll,
    handleReorderHabits,
    handleGenerateTestData,
    setProgress
  }
}