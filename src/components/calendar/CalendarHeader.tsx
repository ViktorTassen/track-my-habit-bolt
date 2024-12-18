import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateRange } from '../../utils/dateUtils';
import { AddHabitDialog } from '../AddHabitDialog';
import { CharacterQuote } from '../CharacterQuote';
import type { CalendarRange } from '../../types/calendar';

interface CalendarHeaderProps {
  range: CalendarRange;
  onPrevious: () => void;
  onNext: () => void;
  onAddHabit: (name: string, color: string) => void;
  onGoToToday: () => void;
  isTodayVisible: boolean;
  showQuote: boolean;
  isAllCompleted: boolean;
  milestoneQuote: string | null;
  currentStreak?: number;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  range,
  onPrevious,
  onNext,
  onAddHabit,
  onGoToToday,
  isTodayVisible,
  showQuote,
  isAllCompleted,
  milestoneQuote,
  currentStreak
}) => (
  <div className="flex justify-between items-center mb-6">
    <div className="flex-1 flex items-center gap-4">
      <img 
        src="/assets/00.png" 
        alt="Character"
        className="w-20 h-12 object-cover scale-[3] translate-y-1"
      />
      {showQuote ? (
        <CharacterQuote 
          show={showQuote} 
          isAllCompleted={isAllCompleted}
          milestoneQuote={milestoneQuote}
          streak={currentStreak}
        />
      ) : (
        <AddHabitDialog onAdd={onAddHabit} />
      )}
    </div>
    
    <div className="flex items-center gap-4">
      {!isTodayVisible && (
        <button
          onClick={onGoToToday}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
        >
          Today
        </button>
      )}
      
      <div className="flex items-center gap-3">
        <button
          onClick={onPrevious}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-white text-sm font-medium min-w-[200px] text-center">
          {formatDateRange(range.startDate, range.endDate)}
        </span>
        
        <button
          onClick={onNext}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);