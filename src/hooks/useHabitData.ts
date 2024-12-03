import { useState, useCallback } from 'react'
import { getHabits, saveHabits, getLogs, saveLogs, getProgress, saveProgress } from '../storage'
import { recalculateAllPoints, calculatePointsForHabit, calculateLevel } from '../utils/scoring'
import { ANIMATION_CONFIG } from '../config/animationConfig'
import { isVariantUnlocked } from '../config/unlockConfig'
import type { Habit, HabitLog, UserProgress, ScoreEvent } from '../types'

export function useHabitData() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [progress, setProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    streaks: {},
    lastCompletedDates: {},
    awardedStreakMilestones: {},
    selectedCharacter: ANIMATION_CONFIG.defaultCharacter
  })
  const [scoreEvents, setScoreEvents] = useState<ScoreEvent[]>([])

  const loadData = useCallback(async () => {
    try {
      const [savedHabits, savedLogs, savedProgress] = await Promise.all([
        getHabits(),
        getLogs(),
        getProgress()
      ])

      // Add order property if not present
      const habitsWithOrder = savedHabits.map((habit, index) => ({
        ...habit,
        order: savedProgress.habitOrder 
          ? savedProgress.habitOrder.indexOf(habit.id)
          : index
      }))

      setHabits(habitsWithOrder)
      setLogs(savedLogs)
      
      const defaultCharacter = ANIMATION_CONFIG.defaultCharacter
      const selectedCharacter = savedProgress.selectedCharacter || defaultCharacter
      
      if (!isVariantUnlocked(selectedCharacter.variant, savedProgress.level)) {
        savedProgress.selectedCharacter = defaultCharacter
      }
      
      const updatedProgress = {
        ...savedProgress,
        selectedCharacter: savedProgress.selectedCharacter || defaultCharacter,
        level: calculateLevel(savedProgress.points)
      }
      
      setProgress(updatedProgress)
      await saveProgress(updatedProgress)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [])

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
  }, [habits])

  const handleUpdateHabit = useCallback(async (habitId: string, name: string, color: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, name, color }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }, [habits])

  const handleArchiveHabit = useCallback(async (habitId: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, archived: true, archivedAt: new Date().toISOString() }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }, [habits])

  const handleUnarchiveHabit = useCallback(async (habitId: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, archived: false, archivedAt: undefined }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
  }, [habits])

  const handleDeleteHabit = useCallback(async (habitId: string) => {
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
  }, [habits, logs, progress])

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
        level
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
        level
      }
      
      await saveProgress(newProgress)
      setProgress(newProgress)
      setScoreEvents([])
    }
  }, [habits, logs, progress])

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
  }, [habits, progress])

  const handleClearScore = useCallback(async () => {
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
  }, [progress.selectedCharacter])

  const handleClearAll = useCallback(async () => {
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
  }, [progress.selectedCharacter])

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
    handleClearScore,
    handleClearAll,
    handleReorderHabits,
    setProgress
  }
}