import React from 'react'
import { format } from 'date-fns'

interface CalendarHeaderProps {
  startDate: Date
  endDate: Date
  onScrollLeft: () => void
  onScrollRight: () => void
  onScrollToToday: () => void
  isCurrentDateVisible: boolean
  onAddHabit: () => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  startDate,
  endDate,
  onScrollLeft,
  onScrollRight,
  onScrollToToday,
  isCurrentDateVisible,
  onAddHabit
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onAddHabit}
          className="h-9 px-4 flex items-center gap-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          <span className="hidden sm:inline text-sm font-medium">Add habit</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {!isCurrentDateVisible && (
          <button
            onClick={onScrollToToday}
            className="px-3 py-1.5 text-sm font-medium text-indigo-400 bg-indigo-900/30 rounded-md hover:bg-indigo-900/50 transition-colors"
          >
            Today
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={onScrollLeft}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-md select-none"
          >
            ←
          </button>
          <div className="text-sm font-medium text-white min-w-[120px] text-center">
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}
          </div>
          <button
            onClick={onScrollRight}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-md select-none"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}