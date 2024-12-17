import React from 'react'

interface ClearDataSectionProps {
  habits: number
  onClearScore: () => void
  onClearAll: () => void
  onGenerateData: () => void
  showConfirm: 'score' | 'all' | null
  onCancelClear: () => void
}

export const ClearDataSection: React.FC<ClearDataSectionProps> = ({
  habits,
  onClearScore,
  onClearAll,
  onGenerateData,
  showConfirm,
  onCancelClear
}) => {
  if (!habits) return null

  if (showConfirm) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {showConfirm === 'score' 
            ? 'Clear all progress? This cannot be undone.'
            : 'Clear all habits and progress? This cannot be undone.'
          }
        </span>
        <button
          onClick={onCancelClear}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={showConfirm === 'score' ? onClearScore : onClearAll}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
        >
          Confirm
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={onGenerateData}
        className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
      >
        Generate Test Data
      </button>
      <button
        onClick={() => onClearScore()}
        className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        Clear Score
      </button>
      <button
        onClick={() => onClearAll()}
        className="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
      >
        Clear All Habits Data
      </button>
    </div>
  )
}