import React from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Habit, HabitLog } from '../../types'
import { HabitRow } from './HabitRow'
import { calculateStreakInfo } from '../../utils/streakCalculations'

interface HabitListProps {
  activeHabits: Habit[]
  archivedHabits: Habit[]
  logs: HabitLog[]
  onHabitClick: (habit: Habit) => void
  onReorderHabits: (habitIds: string[]) => void
  onShowArchivedChange: (show: boolean) => void
}

export const HabitList: React.FC<HabitListProps> = ({
  activeHabits,
  archivedHabits,
  logs,
  onHabitClick,
  onReorderHabits,
  onShowArchivedChange
}) => {
  const [showArchived, setShowArchived] = React.useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = activeHabits.findIndex(h => h.id === active.id)
      const newIndex = activeHabits.findIndex(h => h.id === over.id)
      
      const reorderedHabits = Array.from(activeHabits)
      const [removed] = reorderedHabits.splice(oldIndex, 1)
      reorderedHabits.splice(newIndex, 0, removed)

      const allHabits = [...reorderedHabits, ...archivedHabits]
      const habitIds = allHabits.map(h => h.id)
      onReorderHabits(habitIds)
    }
  }

  React.useEffect(() => {
    onShowArchivedChange(showArchived)
  }, [showArchived, onShowArchivedChange])

  return (
    <div className="space-y-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeHabits.map(h => h.id)}
          strategy={verticalListSortingStrategy}
        >
          {activeHabits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              streakInfo={calculateStreakInfo(habit.id, logs)}
              onHabitClick={onHabitClick}
              sortable={true}
            />
          ))}
        </SortableContext>
      </DndContext>

      {archivedHabits.length > 0 && (
        <>
          {showArchived && archivedHabits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              streakInfo={calculateStreakInfo(habit.id, logs)}
              onHabitClick={onHabitClick}
              sortable={false}
            />
          ))}
          
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="h-7 w-full flex items-center px-2 text-xs font-medium text-gray-500 hover:text-gray-400 hover:bg-gray-800 rounded-md transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <svg 
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showArchived ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
              <span>{showArchived ? 'Hide archived' : `${archivedHabits.length} archived`}</span>
            </div>
          </button>
        </>
      )}
    </div>
  )
}