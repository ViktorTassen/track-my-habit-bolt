import React, { useState, useRef, useEffect, useMemo } from 'react'
import { format, addDays, subDays, isToday, startOfDay, isFirstDayOfMonth } from 'date-fns'
import type { Habit, HabitLog } from '../types'
import { useCalendarPosition } from '../hooks/useCalendarPosition'
import { memoizedCalculateStreak } from '../utils/memoization'

interface MonthViewProps {
  habits: Habit[]
  logs: HabitLog[]
  onToggleHabit: (habitId: string, date: string) => void
  onHabitClick: (habit: Habit) => void
}

const SCROLL_DAYS = 7
const MAX_DAYS = 31

export const MonthView: React.FC<MonthViewProps> = ({
  habits,
  logs,
  onToggleHabit,
  onHabitClick
}) => {
  const [showArchived, setShowArchived] = useState(false)
  const { startDate, setStartDate } = useCalendarPosition()
  const [daysToShow, setDaysToShow] = useState(MAX_DAYS)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate streak info for all habits at once
  const streakInfo = useMemo(() => {
    return habits.reduce((acc, habit) => {
      const habitLogs = logs.filter(log => log.habitId === habit.id && log.completed)
      const sortedLogs = habitLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const currentStreak = memoizedCalculateStreak(habit.id, logs, sortedLogs[0]?.date)
      
      let maxStreak = 0
      let currentCount = 0
      let prevDate: Date | null = null
      
      sortedLogs.forEach(log => {
        const logDate = new Date(log.date)
        if (!prevDate) {
          currentCount = 1
        } else {
          const diffDays = Math.floor((prevDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays === 1) {
            currentCount++
          } else {
            currentCount = 1
          }
        }
        maxStreak = Math.max(maxStreak, currentCount)
        prevDate = logDate
      })

      acc[habit.id] = { currentStreak, maxStreak }
      return acc
    }, {} as Record<string, { currentStreak: number; maxStreak: number }>)
  }, [habits, logs])

  useEffect(() => {
    const calculateDaysToShow = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      const minDayWidth = 32
      const habitColumnWidth = 160
      const availableWidth = containerWidth - habitColumnWidth
      const optimalDays = Math.floor(availableWidth / minDayWidth)
      setDaysToShow(Math.max(7, Math.min(MAX_DAYS, optimalDays)))
    }

    calculateDaysToShow()
    const resizeObserver = new ResizeObserver(calculateDaysToShow)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [])

  const days = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i))
  const endDate = days[days.length - 1]

  const isHabitCompleted = (habitId: string, date: string) => {
    return logs.some(
      (log) => log.habitId === habitId && log.date === date && log.completed
    )
  }

  const handleScrollLeft = () => {
    setStartDate(date => subDays(date, SCROLL_DAYS))
  }

  const handleScrollRight = () => {
    setStartDate(date => addDays(date, SCROLL_DAYS))
  }

  const handleScrollToToday = () => {
    setStartDate(startOfDay(new Date()))
  }

  const displayHabits = habits.filter(habit => {
    if (!habit.archived) return true
    if (!showArchived) return false
    return true
  })

  const archivedHabitsCount = habits.filter(h => h.archived).length
  const isCurrentDateVisible = days.some(day => isToday(day))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleScrollLeft}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md select-none"
          >
            ←
          </button>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}
          </div>
          <button
            onClick={handleScrollRight}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md select-none"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-4">
          {!isCurrentDateVisible && (
            <button
              onClick={handleScrollToToday}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              Today
            </button>
          )}

          {archivedHabitsCount > 0 && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                transition-colors duration-200
                ${showArchived 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }
                hover:bg-indigo-200 dark:hover:bg-indigo-900/70
              `}
            >
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showArchived ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 15l7-7 7 7" 
                />
              </svg>
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </button>
          )}
        </div>
      </div>

      <div ref={containerRef} className="flex">
        <div className="w-40 flex-shrink-0 mr-2">
          <div className="h-16 mb-1 flex items-end justify-end pb-1">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 select-none">
              Current / Best
            </div>
          </div>
          {displayHabits.map((habit) => {
            const { currentStreak, maxStreak } = streakInfo[habit.id] || { currentStreak: 0, maxStreak: 0 }
            
            return (
              <div
                key={`habit-list-${habit.id}`}
                className="h-7 mb-1 flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 group"
                onClick={() => onHabitClick(habit)}
              >
                <div className="flex items-center justify-between w-full select-none">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        habit.archived ? 'opacity-50' : ''
                      }`}
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className={`font-medium text-xs truncate ${
                      habit.archived 
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex gap-2 text-[10px] text-gray-500 dark:text-gray-400 opacity-60 group-hover:opacity-100">
                    <span>{currentStreak}d</span>
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    <span className="text-indigo-500 dark:text-indigo-400">{maxStreak}d</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex-1 grid gap-px relative" style={{ 
          gridTemplateColumns: `repeat(${daysToShow}, minmax(24px, 1fr))`
        }}>
          {days.map((day) => {
            const isCurrentDay = isToday(day)
            const isMonthStart = isFirstDayOfMonth(day)
            const dayKey = format(day, 'yyyy-MM-dd')

            return (
              <div
                key={`day-column-${dayKey}`}
                className={`
                  text-center select-none relative
                  ${isMonthStart ? 'border-l border-gray-200 dark:border-gray-700' : ''}
                  ${isCurrentDay ? 'rounded-lg' : ''}
                `}
              >
                {isCurrentDay && (
                  <div className="absolute inset-0 border-2 border-indigo-500 dark:border-indigo-400 rounded-lg -m-px pointer-events-none" />
                )}
                <div className={`
                  h-16 mb-1 flex flex-col justify-end items-center
                  ${isCurrentDay ? 'text-indigo-600 dark:text-indigo-400' : ''}
                `}>
                  <div className="text-[10px] font-medium text-gray-900 dark:text-gray-100 writing-mode-vertical transform rotate-180">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    {format(day, 'd')}
                  </div>
                </div>
                {displayHabits.map((habit) => {
                  const isArchived = habit.archived
                  const isDisabled = isArchived && habit.archivedAt && new Date(day) > new Date(habit.archivedAt)

                  return (
                    <div
                      key={`habit-day-${habit.id}-${dayKey}`}
                      className="h-7 mb-1 flex items-center justify-center"
                    >
                      <button
                        onClick={() => !isDisabled && onToggleHabit(habit.id, dayKey)}
                        disabled={isDisabled}
                        className={`w-5 h-5 rounded-full transition-all ${
                          isHabitCompleted(habit.id, dayKey)
                            ? `hover:opacity-80 ${isArchived ? 'opacity-50' : ''}`
                            : isDisabled
                              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        style={{
                          backgroundColor: isHabitCompleted(habit.id, dayKey)
                            ? habit.color
                            : undefined
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}