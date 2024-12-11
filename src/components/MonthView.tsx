import React, { useState, useRef, useMemo } from 'react'
import { addDays, subDays, startOfDay } from 'date-fns'
import type { Habit, HabitLog } from '../types'
import { useCalendarPosition } from '../hooks/useCalendarPosition'
import { useCalendarDays } from '../hooks/useCalendarDays'
import { useCalendarWidth } from '../hooks/useCalendarWidth'
import { CalendarHeader } from './calendar/CalendarHeader'
import { HabitList } from './calendar/HabitList'
import { DayColumn } from './calendar/DayColumn'
import { sortAndGroupHabits } from '../utils/habits'

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
  const [showArchived, setShowArchived] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { startDate, setStartDate } = useCalendarPosition()
  const { daysToShow } = useCalendarWidth(containerRef)
  const { days, endDate, isCurrentDateVisible } = useCalendarDays(startDate, daysToShow)

  const { activeHabits, archivedHabits } = useMemo(() => 
    sortAndGroupHabits(habits), [habits]
  )

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-sm p-4">
        <CalendarHeader
          startDate={startDate}
          endDate={endDate}
          onScrollLeft={() => setStartDate(subDays(startDate, 3))}
          onScrollRight={() => setStartDate(addDays(startDate, 3))}
          onScrollToToday={() => setStartDate(startOfDay(new Date()))}
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
              logs={logs}
              onHabitClick={onHabitClick}
              onReorderHabits={onReorderHabits}
              onShowArchivedChange={setShowArchived}
            />
          </div>

          <div 
            className="flex-1 grid gap-px relative" 
            style={{ gridTemplateColumns: `repeat(${daysToShow}, minmax(24px, 1fr))` }}
          >
            {days.map((day) => (
              <DayColumn
                key={day.toISOString()}
                day={day}
                activeHabits={activeHabits}
                archivedHabits={archivedHabits}
                logs={logs}
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