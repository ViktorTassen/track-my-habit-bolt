import React, { useState, useEffect } from 'react';
import { Dialog } from './dialog/Dialog';
import { ColorPicker } from './ColorPicker';
import { Archive, ArchiveRestore } from 'lucide-react';
import type { Habit } from '../types/habit';

interface EditHabitDialogProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (name: string, color: string) => void;
  onDelete: () => void;
  onArchive: () => void;
}

export const EditHabitDialog: React.FC<EditHabitDialogProps> = ({
  habit,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onArchive,
}) => {
  const [habitName, setHabitName] = useState(habit.name);
  const [selectedColor, setSelectedColor] = useState(habit.color);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHabitName(habit.name);
      setSelectedColor(habit.color);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onEdit(habitName.trim(), selectedColor);
      onClose();
    }
  };

  if (showDeleteConfirm) {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title="Delete Habit"
      >
        <div className="space-y-6">
          <p className="text-gray-300">
            Are you sure you want to delete "{habit.name}"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Delete Habit
            </button>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Habit"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="habitName" className="block text-sm font-medium text-gray-300 mb-2">
            Habit Name
          </label>
          <input
            id="habitName"
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="Enter habit name"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Choose Color
          </label>
          <ColorPicker
            selectedColor={selectedColor}
            onChange={setSelectedColor}
          />
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onArchive}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              {habit.archived ? (
                <>
                  <ArchiveRestore className="w-4 h-4" />
                  Unarchive
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  Archive
                </>
              )}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};