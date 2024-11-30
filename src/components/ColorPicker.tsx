import React from 'react'

const PRESET_COLORS = [
  '#4F46E5', // Indigo
  '#DC2626', // Red
  '#059669', // Green
  '#D97706', // Yellow
  '#7C3AED', // Purple
  '#2563EB', // Blue
  '#DB2777', // Pink
  '#EA580C', // Orange
  '#0891B2', // Cyan
  '#4B5563', // Gray
]

interface ColorPickerProps {
  selectedColor: string
  onColorSelect: (color: string) => void
  showCustomPicker: boolean
  onCustomPickerToggle: (e: React.MouseEvent) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  showCustomPicker,
  onCustomPickerToggle,
}) => {
  const isPresetColor = PRESET_COLORS.includes(selectedColor)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => {
              onColorSelect(color)
              if (showCustomPicker) {
                onCustomPickerToggle(new MouseEvent('click') as any)
              }
            }}
            className={`w-8 h-8 rounded-full transition-all ${
              selectedColor === color && !showCustomPicker
                ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800'
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCustomPickerToggle}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
            showCustomPicker ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500" />
          Custom Color
        </button>
      </div>
    </div>
  )
}