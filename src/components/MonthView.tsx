import React, { useState, useRef, useEffect, useMemo } from 'react'
import { addDays, subDays, startOfDay, isToday } from 'date-fns'
import type { Habit, HabitLog } from '../types'
import { useCalendarPosition } from '../hooks/useCalendarPosition'
import { memoizedCalculateStreak } from '../utils/memoization'
import { CalendarHeader } from './calendar/CalendarHeader'
import { HabitList } from './calendar/HabitList'
import { DayColumn } from './calendar/DayColumn'

interface MonthViewProps {
  habits: Habit[]
  logs: HabitLog[]
  onToggleHabit: (habitId: string, date: string) => void
  onHabitClick: (habit: Habit) => void
  onReorderHabits: (habitIds: string[]) => void
  onAddHabit: () => void
}

export const MonthView: React.FC<MonthViewProps> = ({
  habits,
  logs,
  onToggleHabit,
  onHabitClick,
  onReorderHabits,
  onAddHabit
}) => {
  const { startDate, setStartDate } = useCalendarPosition()
  const [daysToShow, setDaysToShow] = useState(31)
  const [showArchived, setShowArchived] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Split and sort habits by order
  const { activeHabits, archivedHabits } = useMemo(() => {
    const sorted = [...habits].sort((a, b) => a.order - b.order)
    return sorted.reduce((acc, habit) => {
      if (habit.archived) {
        acc.archivedHabits.push(habit)
      } else {
        acc.activeHabits.push(habit)
      }
      return acc
    }, { activeHabits: [] as Habit[], archivedHabits: [] as Habit[] })
  }, [habits])

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
      const habitColumnWidth = 208
      const availableWidth = containerWidth - habitColumnWidth
      const optimalDays = Math.floor(availableWidth / minDayWidth)
      setDaysToShow(Math.max(7, Math.min(31, optimalDays)))
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
    setStartDate(date => subDays(date, 7))
  }

  const handleScrollRight = () => {
    setStartDate(date => addDays(date, 7))
  }

  const handleScrollToToday = () => {
    setStartDate(startOfDay(new Date()))
  }

  const isCurrentDateVisible = days.some(day => isToday(day))

  return (
    <div className="space-y-3">
      <div className="bg-gray-800 rounded-lg shadow-sm p-4">
        <CalendarHeader
          startDate={startDate}
          endDate={endDate}
          onScrollLeft={handleScrollLeft}
          onScrollRight={handleScrollRight}
          onScrollToToday={handleScrollToToday}
          isCurrentDateVisible={isCurrentDateVisible}
          onAddHabit={onAddHabit}
        />

        <div ref={containerRef} className="flex">
          <div className="w-52 flex-shrink-0 mr-2">
            <div className="h-16 mb-1 flex items-end justify-end pb-1">
              <div className="text-xs font-medium text-gray-400 select-none">
                Current / Best
              </div>
            </div>

            <HabitList
              activeHabits={activeHabits}
              archivedHabits={archivedHabits}
              streakInfo={streakInfo}
              onHabitClick={onHabitClick}
              onReorderHabits={onReorderHabits}
              onShowArchivedChange={setShowArchived}
            />
          </div>

          <div className="flex-1 grid gap-px relative" style={{ 
            gridTemplateColumns: `repeat(${daysToShow}, minmax(24px, 1fr))`
          }}>
            {days.map((day) => (
              <DayColumn
                key={day.toISOString()}
                day={day}
                activeHabits={activeHabits}
                archivedHabits={archivedHabits}
                isHabitCompleted={isHabitCompleted}
                onToggleHabit={onToggleHabit}
                showArchived={showArchived}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}