import { useState } from 'react'
import type { Habit, HabitLog, UserProgress, ScoreEvent } from '../../types'
import { ANIMATION_CONFIG } from '../../config/animationConfig'

export function useHabitState() {
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

  return {
    habits,
    logs,
    progress,
    scoreEvents,
    setHabits,
    setLogs,
    setProgress,
    setScoreEvents
  }
}