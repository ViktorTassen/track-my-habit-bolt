import React, { useState, useRef, useEffect, useMemo } from 'react'
import { addDays, subDays, startOfDay, isToday, format } from 'date-fns'
import type { Habit, HabitLog } from '../types'
import { useCalendarPosition } from '../hooks/useCalendarPosition'
import { CalendarHeader } from './calendar/CalendarHeader'
import { HabitList } from './calendar/HabitList'
import { DayColumn } from './calendar/DayColumn'
import { getLogsForDateRange } from '../storage'

interface MonthViewProps {
  habits: Habit[]
  logs: HabitLog[] // This now contains all logs
  onToggleHabit: (habitId: string, date: string) => void
  onHabitClick: (habit: Habit) => void
  onReorderHabits: (habitIds: string[]) => void
  onAddHabit: () => void
}

export const MonthView: React.FC<MonthViewProps> = ({
  habits,
  logs, // All logs are passed from parent
  onToggleHabit,
  onHabitClick,
  onReorderHabits,
  onAddHabit
}) => {
  const { startDate, setStartDate } = useCalendarPosition()
  const [daysToShow, setDaysToShow] = useState(31)
  const [showArchived, setShowArchived] = useState(false)
  const [visibleLogs, setVisibleLogs] = useState<HabitLog[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Calculate optimal days to show based on container width
  useEffect(() => {
    const calculateDaysToShow = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      const minDayWidth = 32
      const habitColumnWidth = 208
      const availableWidth = containerWidth - habitColumnWidth
      const optimalDays = Math.floor(availableWidth / minDayWidth)
      setDaysToShow(Math.max(3, Math.min(31, optimalDays)))
    }

    calculateDaysToShow()
    const resizeObserver = new ResizeObserver(calculateDaysToShow)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [])

  // Filter logs for visible date range
  useEffect(() => {
    const visibleStart = format(startDate, 'yyyy-MM-dd')
    const visibleEnd = format(addDays(startDate, daysToShow - 1), 'yyyy-MM-dd')
    
    const filteredLogs = logs.filter(log => {
      const logDate = log.date
      return logDate >= visibleStart && logDate <= visibleEnd
    })
    
    setVisibleLogs(filteredLogs)
  }, [startDate, daysToShow, logs])

  const days = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i))
  const endDate = days[days.length - 1]

  const isHabitCompleted = (habitId: string, date: string) => {
    return visibleLogs.some(
      (log) => log.habitId === habitId && log.date === date && log.completed
    )
  }

  const handleScrollLeft = () => {
    setStartDate(subDays(startDate, 3))
  }

  const handleScrollRight = () => {
    setStartDate(addDays(startDate, 3))
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
          <div className="w-44 flex-shrink-0 mr-2">
            <div className="h-16 mb-1 flex items-end justify-end pb-1">
              <div className="text-xs font-medium text-gray-400 select-none">
                Current / Best
              </div>
            </div>

            <HabitList
              activeHabits={activeHabits}
              archivedHabits={archivedHabits}
              logs={logs} // Pass all logs for streak calculations
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