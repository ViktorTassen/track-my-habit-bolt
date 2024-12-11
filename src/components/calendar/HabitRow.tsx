import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Habit, HabitLog } from '../../types'
import { calculateStreakInfo } from '../../utils/streaks'

interface HabitRowProps {
  habit: Habit
  logs: HabitLog[]
  onHabitClick: (habit: Habit) => void
  sortable?: boolean
}

export const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  logs,
  onHabitClick,
  sortable = false
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: habit.id,
    disabled: !sortable
  })

  const style = sortable ? {
    transform: CSS.Transform.toString(transform),
    transition
  } : undefined

  const isArchived = habit.archived
  const { currentStreak, maxStreak } = calculateStreakInfo(habit.id, logs)

  return (
    <div
      ref={sortable ? setNodeRef : undefined}
      style={style}
      className="h-7 mb-1 flex items-center cursor-pointer hover:bg-gray-800 rounded-md group"
      onClick={() => onHabitClick(habit)}
    >
      <div className="flex items-center justify-between w-full select-none">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            {...(sortable ? { ...attributes, ...listeners } : {})}
            className={`w-4 h-4 flex items-center justify-center text-gray-400 ${
              sortable ? 'cursor-grab active:cursor-grabbing' : 'opacity-50'
            }`}
          >
            ⋮
          </div>
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${isArchived ? 'opacity-50' : ''}`}
            style={{ backgroundColor: habit.color }}
          />
          <span className={`font-medium text-xs truncate flex-1 ${
            isArchived ? 'text-gray-400' : 'text-gray-100'
          }`}>
            {habit.name}
          </span>
        </div>
        <div className="flex gap-1 text-[10px] text-gray-400 opacity-60 group-hover:opacity-100 ml-2">
          <span>{currentStreak}</span>
          <span className="text-gray-600">/</span>
          <span className="text-indigo-400">{maxStreak}</span>
        </div>
      </div>
    </div>
  )
}