import { useState, useCallback } from 'react'
import { getHabits, getLogs, getProgress } from '../utils/storage'
import { ANIMATION_CONFIG } from '../config'
import { isVariantUnlocked } from '../config/unlockConfig'
import { createHabitOperations } from '../utils/habits'
import { calculateLevel } from '../utils/scoring'
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
        level: calculateLevel(savedProgress.points),
        streaks: savedProgress.streaks || {},
        lastCompletedDates: savedProgress.lastCompletedDates || {},
        awardedStreakMilestones: savedProgress.awardedStreakMilestones || {}
      }
      
      setProgress(updatedProgress)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [])

  const habitOperations = createHabitOperations(
    habits,
    logs,
    progress,
    setHabits,
    setLogs,
    setProgress,
    setScoreEvents
  )

  return {
    habits,
    logs,
    progress,
    scoreEvents,
    loadData,
    ...habitOperations,
    setProgress
  }
}