import React, { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { StreakDisplay } from '../StreakDisplay';
import { EditHabitDialog } from '../EditHabitDialog';
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Habit } from '../../types/habit';
import type { StreakInfo } from '../../utils/streakUtils';

interface HabitRowProps {
  habit: Habit;
  dates: Date[];
  streak: StreakInfo;
  onRemove: () => void;
  onEdit: (name: string, color: string) => void;
  onToggle: (date: Date) => void;
  isCompleted: (date: Date) => boolean;
  onArchive: () => void;
}

export const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  dates,
  streak,
  onRemove,
  onEdit,
  onToggle,
  isCompleted,
  onArchive,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const today = new Date();
  const todayStr = formatDate(today);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = (name: string, color: string) => {
    onEdit(name, color);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} className="flex items-center justify-between pr-2 h-10">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            {...listeners}
            className="p-1 -ml-1 text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          <button
            onClick={() => setIsEditModalOpen(true)}
            className={`truncate hover:text-indigo-400 transition-colors text-left ${
              habit.archived ? 'text-gray-500' : 'text-white'
            }`}
            title={habit.name}
          >
            {habit.name}
          </button>
        </div>
        <div className="flex items-center flex-shrink-0">
          <StreakDisplay streak={streak} />
        </div>
      </div>
      <div className="grid grid-cols-15 gap-2">
        {dates.map((date) => {
          const completed = isCompleted(date);
          const isToday = formatDate(date) === todayStr;
          return (
            <div key={formatDate(date)} className="flex items-center justify-center h-10">
              <button
                onClick={() => onToggle(date)}
                className={`w-6 h-6 rounded-full border transition-all hover:scale-110 ${
                  isToday ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-gray-900' : ''
                }`}
                style={{
                  backgroundColor: completed ? habit.color : 'transparent',
                  borderColor: completed ? habit.color : '#374151',
                  opacity: completed ? 1 : 0.5
                }}
                disabled={habit.archived}
              />
            </div>
          );
        })}
      </div>

      <EditHabitDialog
        habit={habit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEdit}
        onDelete={onRemove}
        onArchive={onArchive}
      />
    </>
  );
};