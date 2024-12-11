import React from 'react'
import { format, isToday, isFirstDayOfMonth } from 'date-fns'
import type { Habit, HabitLog } from '../../types'
import { isHabitCompleted } from '../../utils/habits'

interface DayColumnProps {
  day: Date
  activeHabits: Habit[]
  archivedHabits: Habit[]
  logs: HabitLog[]
  onToggleHabit: (habitId: string, date: string) => void
  showArchived?: boolean
}

export const DayColumn: React.FC<DayColumnProps> = ({
  day,
  activeHabits,
  archivedHabits,
  logs,
  onToggleHabit,
  showArchived = false
}) => {
  const isCurrentDay = isToday(day)
  const isMonthStart = isFirstDayOfMonth(day)
  const dayKey = format(day, 'yyyy-MM-dd')

  return (
    <div
      className={`
        text-center select-none relative
        ${isMonthStart ? 'border-l border-gray-700' : ''}
        ${isCurrentDay ? 'rounded-lg' : ''}
      `}
    >
      {isCurrentDay && (
        <>
          <div className="absolute inset-0 border-2 border-indigo-400 rounded-lg -m-px pointer-events-none" />
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-indigo-400" />
          </div>
        </>
      )}
      
      <div className={`
        h-16 mb-1 flex flex-col justify-end items-center
        ${isCurrentDay ? 'text-indigo-400' : ''}
      `}>
        <div className="text-[10px] font-medium text-gray-100 writing-mode-vertical transform rotate-180">
          {format(day, 'EEE')}
        </div>
        <div className="text-[10px] text-gray-400 mt-1">
          {format(day, 'd')}
        </div>
      </div>

      {activeHabits.map((habit) => (
        <div
          key={`habit-day-${habit.id}-${dayKey}`}
          className="h-7 mb-1 flex items-center justify-center"
        >
          <button
            onClick={() => onToggleHabit(habit.id, dayKey)}
            className={`w-5 h-5 rounded-full transition-all ${
              isHabitCompleted(habit.id, dayKey, logs)
                ? 'hover:opacity-80'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            style={{
              backgroundColor: isHabitCompleted(habit.id, dayKey, logs)
                ? habit.color
                : undefined
            }}
          />
        </div>
      ))}

      {showArchived && archivedHabits.map((habit) => {
        const isDisabled = !!habit.archivedAt && new Date(day) > new Date(habit.archivedAt)

        return (
          <div
            key={`habit-day-${habit.id}-${dayKey}`}
            className="h-7 mb-1 flex items-center justify-center"
          >
            <button
              onClick={() => !isDisabled && onToggleHabit(habit.id, dayKey)}
              disabled={isDisabled}
              className={`w-5 h-5 rounded-full transition-all ${
                isHabitCompleted(habit.id, dayKey, logs)
                  ? 'opacity-50 hover:opacity-40'
                  : isDisabled
                    ? 'bg-gray-800 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600'
              }`}
              style={{
                backgroundColor: isHabitCompleted(habit.id, dayKey, logs)
                  ? habit.color
                  : undefined
              }}
            />
          </div>
        )
      })}
    </div>
  )
}