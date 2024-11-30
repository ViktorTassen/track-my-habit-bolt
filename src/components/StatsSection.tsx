import React, { useState } from 'react'
import type { Habit, HabitLog, ScoreEvent, CharacterSelection } from '../types'
import { CharacterStats } from './CharacterStats'

interface StatsSectionProps {
  habits: Habit[]
  logs: HabitLog[]
  points: number
  level: number
  scoreEvents: ScoreEvent[]
  selectedCharacter: CharacterSelection
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  habits,
  logs,
  points,
  level,
  scoreEvents,
  selectedCharacter
}) => {
  const [promise, setPromise] = useState(() => {
    const saved = localStorage.getItem('user-promise')
    return saved || "I commit to building better habits because they shape who I become. Every small action counts towards my greater goals."
  })
  const [isEditing, setIsEditing] = useState(false)

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

  const handlePromiseChange = (newPromise: string) => {
    const trimmedPromise = newPromise.slice(0, 180)
    setPromise(trimmedPromise)
    localStorage.setItem('user-promise', trimmedPromise)
    setIsEditing(false)
  }

  return (
    <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
      <div>
        <CharacterStats
          level={level}
          points={points}
          activeHabits={activeHabits}
          totalCompleted={totalCompleted}
          bestStreak={bestStreak}
          scoreEvents={scoreEvents}
          selectedCharacter={selectedCharacter}
        />
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-xl relative overflow-hidden flex flex-col min-h-[140px]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 left-0 w-full h-8 bg-white/5 transform -skew-y-6" />
          <div className="absolute bottom-0 right-0 w-full h-8 bg-black/5 transform skew-y-6" />
        </div>

        <div className="relative p-3 flex flex-col h-full">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span role="img" aria-label="Promise" className="text-lg">✨</span>
              <h3 className="text-sm font-medium text-white">My Motivation</h3>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-200 hover:text-white transition-colors"
            >
              ✏️
            </button>
          </div>

          {isEditing ? (
            <div className="flex-1 flex flex-col">
              <textarea
                value={promise}
                onChange={(e) => setPromise(e.target.value)}
                maxLength={180}
                className="flex-1 p-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200/70 focus:ring-2 focus:ring-white/20 focus:border-transparent resize-none"
                placeholder="Write your motivation here..."
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-indigo-200/70">
                  {promise.length}/180
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-2 py-0.5 text-xs text-indigo-200 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePromiseChange(promise)}
                    className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex-1 flex items-center">
              <div className="absolute top-0 left-0 text-xl text-white/20 transform -translate-y-1 -translate-x-1">
                "
              </div>
              <p className="text-sm text-indigo-100 leading-relaxed px-3">
                {promise}
              </p>
              <div className="absolute bottom-0 right-0 text-xl text-white/20 transform translate-y-1 translate-x-1">
                "
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}