import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog } from './dialog/Dialog';
import { ColorPicker } from './ColorPicker';
import { PRESET_COLORS } from '../constants/colors';

interface AddHabitDialogProps {
  onAdd: (name: string, color: string) => void;
}

export const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAdd(habitName.trim(), selectedColor);
      setHabitName('');
      setSelectedColor(PRESET_COLORS[0]);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors z-10"
      >
        <Plus className="w-5 h-5" />
        Track My Habit
      </button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Habit"
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
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg"
            >
              Add Habit
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
};