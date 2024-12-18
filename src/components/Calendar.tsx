import React, { useState, useCallback } from 'react';
import { getDayRange } from '../utils/dateUtils';
import { calculateStreak } from '../utils/streakUtils';
import { areAllHabitsCompletedForDate } from '../utils/habitUtils';
import { getMilestoneQuote } from '../constants/milestones';
import { CalendarHeader } from './calendar/CalendarHeader';
import { DateHeaders } from './calendar/DateHeaders';
import { HabitRow } from './calendar/HabitRow';
import { Archive } from 'lucide-react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { CalendarRange } from '../types/calendar';
import type { Habit } from '../types/habit';

interface CalendarProps {
  range: CalendarRange;
  habits: Habit[];
  monthlyData: Record<string, any>;
  showArchived: boolean;
  onRangeChange: (startDate: Date) => void;
  onAddHabit: (name: string, color: string) => void;
  onEditHabit: (id: string, name: string, color: string) => void;
  isHabitCompleted: (habitId: string, date: Date) => boolean;
  onToggleHabit: (habitId: string, date: Date) => void;
  onRemoveHabit: (habitId: string) => void;
  onToggleArchiveHabit: (habitId: string) => void;
  onToggleShowArchived: () => void;
  onReorderHabits?: (activeId: string, overId: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  range,
  habits,
  monthlyData,
  showArchived,
  onRangeChange,
  onAddHabit,
  onEditHabit,
  isHabitCompleted,
  onToggleHabit,
  onRemoveHabit,
  onToggleArchiveHabit,
  onToggleShowArchived,
  onReorderHabits,
}) => {
  const [showQuote, setShowQuote] = useState(false);
  const [lastToggledHabit, setLastToggledHabit] = useState<string | null>(null);
  const [lastToggledDate, setLastToggledDate] = useState<Date | null>(null);
  const dates = getDayRange(range.startDate, 15);
  const activeHabits = habits.filter(habit => !habit.archived);
  const archivedHabits = habits.filter(habit => habit.archived);

  const handlePrevious = () => {
    const newStartDate = new Date(range.startDate);
    newStartDate.setDate(range.startDate.getDate() - 3);
    onRangeChange(newStartDate);
  };

  const handleNext = () => {
    const newStartDate = new Date(range.startDate);
    newStartDate.setDate(range.startDate.getDate() + 3);
    onRangeChange(newStartDate);
  };

  const handleGoToToday = () => {
    onRangeChange(new Date());
  };

  const isTodayVisible = () => {
    const today = new Date();
    return today >= range.startDate && today <= range.endDate;
  };

  const handleToggleHabit = useCallback((habitId: string, date: Date) => {
    onToggleHabit(habitId, date);
    if (!isHabitCompleted(habitId, date)) {
      setLastToggledHabit(habitId);
      setLastToggledDate(date);
      setShowQuote(true);
      setTimeout(() => {
        setShowQuote(false);
        setLastToggledHabit(null);
      }, 3000);
    }
  }, [onToggleHabit, isHabitCompleted]);

  const isAllCompleted = lastToggledDate 
    ? areAllHabitsCompletedForDate(habits, lastToggledDate, isHabitCompleted)
    : false;

  const milestoneQuote = lastToggledHabit
    ? getMilestoneQuote(calculateStreak(lastToggledHabit).currentStreak)
    : null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && onReorderHabits) {
      onReorderHabits(active.id.toString(), over.id.toString());
    }
  };

  const renderHabitRows = (habits: Habit[]) => {
    return habits.map((habit) => {
      const streak = calculateStreak(habit.id);
      return (
        <HabitRow
          key={habit.id}
          habit={habit}
          dates={dates}
          streak={streak}
          onRemove={() => onRemoveHabit(habit.id)}
          onEdit={(name, color) => onEditHabit(habit.id, name, color)}
          onToggle={(date) => handleToggleHabit(habit.id, date)}
          isCompleted={(date) => isHabitCompleted(habit.id, date)}
          onArchive={() => onToggleArchiveHabit(habit.id)}
        />
      );
    });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-4xl">
      <CalendarHeader
        range={range}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onAddHabit={onAddHabit}
        onGoToToday={handleGoToToday}
        isTodayVisible={isTodayVisible()}
        showQuote={showQuote}
        isAllCompleted={isAllCompleted}
        milestoneQuote={milestoneQuote}
      />

      <div className="grid grid-cols-[300px_1fr] gap-x-4">
        <DateHeaders dates={dates} />
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activeHabits.map(h => h.id)}
            strategy={verticalListSortingStrategy}
          >
            {renderHabitRows(activeHabits)}
          </SortableContext>
        </DndContext>
      </div>

      {showArchived && archivedHabits.length > 0 && (
        <>
          <div className="grid grid-cols-[300px_1fr] gap-x-4 mt-8 mb-4 border-t border-gray-700 pt-4">
            {renderHabitRows(archivedHabits)}
          </div>
        </>
      )}

      {archivedHabits.length > 0 && (
        <button
          onClick={onToggleShowArchived}
          className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <Archive className="w-4 h-4" />
          {showArchived ? 'Hide archived habits' : 'Show archived habits'}
        </button>
      )}
    </div>
  );
};