import React, { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import type { Habit } from "../types"

interface HabitFormProps {
  onSubmit: (name: string, color: string) => void
  onCancel: () => void
  onDelete?: () => void
  onArchive?: () => void
  onUnarchive?: () => void
  initialHabit: Habit | null
}

const PRESET_COLORS = [
  '#0667d2', // Blue
  '#4c4ab1', // Violet
  '#9247b7', // Purple
  '#2fa54d', // Green
  '#d2a906', // Yellow
  '#d27d06', // Orange
  '#d2352c', // Red
  '#0891B2', // Cyan
]

export const HabitForm: React.FC<HabitFormProps> = ({
  onSubmit,
  onCancel,
  onDelete,
  onArchive,
  onUnarchive,
  initialHabit = null
}) => {
  const [name, setName] = useState(initialHabit?.name || "")
  const [color, setColor] = useState(initialHabit?.color || "#0667d2")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
  const [showUnarchiveConfirm, setShowUnarchiveConfirm] = useState(false)
  const [showCustomPicker, setShowCustomPicker] = useState(() => {
    if (initialHabit) {
      return !PRESET_COLORS.includes(initialHabit.color)
    }
    return false
  })

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name)
      setColor(initialHabit.color)
      setShowCustomPicker(!PRESET_COLORS.includes(initialHabit.color))
    }
  }, [initialHabit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name, color)
    }
  }

  if (showDeleteConfirm) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Delete Habit</h3>
        <p className="text-sm text-gray-400">
          Are you sure you want to delete "{initialHabit?.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  if (showArchiveConfirm) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Archive Habit</h3>
        <p className="text-sm text-gray-400">
          Are you sure you want to archive "{initialHabit?.name}"? You won't be able to track it anymore, but its history will be preserved.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowArchiveConfirm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onArchive}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
          >
            Archive
          </button>
        </div>
      </div>
    )
  }

  if (showUnarchiveConfirm) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Unarchive Habit</h3>
        <p className="text-sm text-gray-400">
          Are you sure you want to unarchive "{initialHabit?.name}"? You'll be able to track it again.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowUnarchiveConfirm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onUnarchive}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Unarchive
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-medium text-white">
        {initialHabit ? "Edit Habit" : "Add New Habit"}
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Habit Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name"
          className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-gray-700 text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Color
        </label>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                onClick={() => {
                  setColor(presetColor)
                  setShowCustomPicker(false)
                }}
                className={`w-8 h-8 rounded-full transition-all ${
                  color === presetColor && !showCustomPicker
                    ? 'ring-2 ring-offset-2 ring-indigo-400 ring-offset-gray-800'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: presetColor }}
                aria-label={`Select color ${presetColor}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 transition-colors ${
                showCustomPicker ? 'ring-2 ring-indigo-400' : ''
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500" />
              Custom Color
            </button>
          </div>

          {showCustomPicker && (
            <div className="mt-4">
              <HexColorPicker color={color} onChange={setColor} className="w-full max-w-[240px] mx-auto" />
              <div className="mt-2 flex items-center gap-2 justify-center">
                <div
                  className="w-6 h-6 rounded-full border border-gray-600"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-400 uppercase">{color}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 gap-3">
        <div className="flex gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 text-sm font-medium text-red-400 bg-gray-700 border border-red-500/30 rounded-md hover:bg-red-500/10 whitespace-nowrap"
            >
              Delete
            </button>
          )}
          {onArchive && !initialHabit?.archived && (
            <button
              type="button"
              onClick={() => setShowArchiveConfirm(true)}
              className="px-3 py-1.5 text-sm font-medium text-yellow-400 bg-gray-700 border border-yellow-500/30 rounded-md hover:bg-yellow-500/10 whitespace-nowrap"
            >
              Archive
            </button>
          )}
          {onUnarchive && initialHabit?.archived && (
            <button
              type="button"
              onClick={() => setShowUnarchiveConfirm(true)}
              className="px-3 py-1.5 text-sm font-medium text-green-400 bg-gray-700 border border-green-500/30 rounded-md hover:bg-green-500/10 whitespace-nowrap"
            >
              Unarchive
            </button>
          )}
        </div>
        <div className="flex gap-3 ml-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md hover:bg-indigo-600 whitespace-nowrap"
          >
            {initialHabit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </form>
  )
}