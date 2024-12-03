import React from 'react'
import { CharacterStats } from './CharacterStats'
import { MotivationCard } from './MotivationCard'
import type { Habit, HabitLog, ScoreEvent, CharacterSelection } from '../types'

interface StatsSectionProps {
  habits: Habit[]
  logs: HabitLog[]
  points: number
  level: number
  scoreEvents: ScoreEvent[]
  selectedCharacter: CharacterSelection
  onCharacterClick: () => void
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  habits,
  logs,
  points,
  level,
  scoreEvents,
  selectedCharacter,
  onCharacterClick
}) => {
  const activeHabits = habits.filter(habit => !habit.archived).length
  const totalCompleted = logs.filter(log => log.completed).length

  const bestStreak = habits.reduce((maxStreak, habit) => {
    const habitLogs = logs.filter(log => log.habitId === habit.id && log.completed)
    let currentStreak = 0
    let maxHabitStreak = 0
    let lastDate: Date | null = null

    habitLogs
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach(log => {
        const logDate = new Date(log.date)
        if (!lastDate) {
          currentStreak = 1
        } else {
          const diffDays = Math.floor((lastDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays === 1) {
            currentStreak++
          } else {
            currentStreak = 1
          }
        }
        maxHabitStreak = Math.max(maxHabitStreak, currentStreak)
        lastDate = logDate
      })

    return Math.max(maxStreak, maxHabitStreak)
  }, 0)

  return (
    <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
      <CharacterStats
        level={level}
        points={points}
        activeHabits={activeHabits}
        totalCompleted={totalCompleted}
        bestStreak={bestStreak}
        scoreEvents={scoreEvents}
        selectedCharacter={selectedCharacter}
        onCharacterClick={onCharacterClick}
      />
      <div className="hidden md:block">
        <MotivationCard />
      </div>
    </div>
  )
}