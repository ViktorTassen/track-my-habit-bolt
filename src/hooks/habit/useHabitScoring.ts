import { useCallback } from 'react'
import type { Habit, HabitLog, UserProgress, ScoreEvent } from '../../types'
import { 
  calculatePointsForHabit,
  recalculateAllPoints,
  calculateLevel 
} from '../../utils/scoring'
import { saveLogs, saveProgress } from '../../storage'

export function useHabitScoring(
  habits: Habit[],
  logs: HabitLog[], // Add logs parameter
  progress: UserProgress,
  setLogs: (logs: HabitLog[]) => void,
  setProgress: (progress: UserProgress) => void,
  setScoreEvents: (events: ScoreEvent[]) => void
) {
  const handleToggleHabit = useCallback(async (habitId: string, date: string) => {
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
      const { events, updatedProgress } = calculatePointsForHabit(
        habit,
        date,
        habits,
        updatedLogs,
        progress
      )

      const { totalPoints } = recalculateAllPoints(habits, updatedLogs, updatedProgress)
      const level = calculateLevel(totalPoints)
      const newProgress = {
        ...updatedProgress,
        points: totalPoints,
        level,
        selectedCharacter: progress.selectedCharacter
      }
      
      await saveProgress(newProgress)
      setProgress(newProgress)
      setScoreEvents(events)
    } else {
      const { totalPoints, updatedProgress } = recalculateAllPoints(habits, updatedLogs, progress)
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
    }
  }, [habits, logs, progress, setLogs, setProgress, setScoreEvents])

  return {
    handleToggleHabit
  }
}