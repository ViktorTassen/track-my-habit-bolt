import { useState, useCallback } from 'react'
import { 
  getHabits, 
  saveHabits, 
  getLogs, 
  saveLogs, 
  getProgress, 
  saveProgress,
  getLogsForDateRange 
} from '../storage'
import { 
  calculatePointsForHabit, 
  recalculateAllPoints,
  calculateLevel 
} from '../utils/scoring'
import { ANIMATION_CONFIG } from '../config/animationConfig'
import { isVariantUnlocked } from '../config/unlockConfig'
import type { Habit, HabitLog, UserProgress, ScoreEvent } from '../types'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export function useHabitData() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [progress, setProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    streaks: {},
    lastCompletedDates: {},
    awardedStreakMilestones: {},
    selectedCharacter: ANIMATION_CONFIG.defaultCharacter,
    habitOrder: []
  })
  const [scoreEvents, setScoreEvents] = useState<ScoreEvent[]>([])

  const loadData = useCallback(async () => {
    try {
      const [savedHabits, savedProgress] = await Promise.all([
        getHabits(),
        getProgress()
      ])

      // Get logs for current month only initially
      const today = new Date()
      const monthStart = format(startOfMonth(today), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd')
      const savedLogs = await getLogsForDateRange(monthStart, monthEnd)

      const habitsWithOrder = savedHabits.map((habit, index) => ({
        ...habit,
        order: savedProgress.habitOrder?.indexOf(habit.id) ?? index
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
        level: calculateLevel(savedProgress.points),
        streaks: savedProgress.streaks || {},
        lastCompletedDates: savedProgress.lastCompletedDates || {},
        awardedStreakMilestones: savedProgress.awardedStreakMilestones || {},
        habitOrder: savedProgress.habitOrder || []
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
  }, [habits, progress])

  const handleToggleHabit = useCallback(async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit || (habit.archived && habit.archivedAt && new Date(date) > new Date(habit.archivedAt))) return

    // Get logs for the relevant month
    const targetDate = new Date(date)
    const monthStart = format(startOfMonth(targetDate), 'yyyy-MM-dd')
    const monthEnd = format(endOfMonth(targetDate), 'yyyy-MM-dd')
    const monthLogs = await getLogsForDateRange(monthStart, monthEnd)

    const existingLog = monthLogs.find(
      l => l.habitId === habitId && l.date === date
    )

    let updatedLogs: HabitLog[]
    if (existingLog) {
      updatedLogs = monthLogs.map(log =>
        log.habitId === habitId && log.date === date
          ? { ...log, completed: !log.completed }
          : log
      )
    } else {
      updatedLogs = [
        ...monthLogs,
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
  }, [habits, progress])

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
    const resetProgress: UserProgress = {
      points: 0,
      level: 1,
      streaks: {},
      lastCompletedDates: {},
      awardedStreakMilestones: {},
      selectedCharacter: progress.selectedCharacter,
      habitOrder: progress.habitOrder
    }
    
    await Promise.all([
      saveLogs([]),
      saveProgress(resetProgress)
    ])
    
    setLogs([])
    setProgress(resetProgress)
    setScoreEvents([])
  }, [progress.selectedCharacter, progress.habitOrder])

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
    
    await Promise.all([
      saveHabits([]),
      saveLogs([]),
      saveProgress(resetProgress)
    ])
    
    setHabits([])
    setLogs([])
    setProgress(resetProgress)
    setScoreEvents([])
  }, [progress.selectedCharacter])

  const handleGenerateTestData = useCallback(async (historicalLogs: HabitLog[]) => {
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
  }, [habits, progress])

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
    handleGenerateTestData,
    setProgress
  }
}