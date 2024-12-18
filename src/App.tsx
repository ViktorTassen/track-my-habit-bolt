import React from 'react';
import { Calendar } from './components/Calendar';
import { DemoDataButton } from './components/DemoDataButton';
import { useHabitTracking } from './hooks/useHabitTracking';
import { useCalendarRange } from './hooks/useCalendarRange';
import { useHabits } from './hooks/useHabits';

export function App() {
  const { range, updateRange } = useCalendarRange();
  const { 
    habits, 
    showArchived,
    addHabit, 
    editHabit, 
    removeHabit,
    toggleArchiveHabit,
    toggleShowArchived,
    reorderHabits
  } = useHabits();
  const { toggleHabit, clearAllProgress, isHabitCompleted, loadMonthlyData, monthlyData } = useHabitTracking(
    range.startDate,
    range.endDate
  );

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      clearAllProgress();
    }
  };

  const handleDemoDataGenerated = () => {
    loadMonthlyData(range.startDate, range.endDate);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        

        <Calendar
          range={range}
          habits={habits}
          monthlyData={monthlyData}
          showArchived={showArchived}
          onRangeChange={updateRange}
          onAddHabit={addHabit}
          onEditHabit={editHabit}
          isHabitCompleted={isHabitCompleted}
          onToggleHabit={toggleHabit}
          onRemoveHabit={removeHabit}
          onToggleArchiveHabit={toggleArchiveHabit}
          onToggleShowArchived={toggleShowArchived}
          onReorderHabits={reorderHabits}
        />

        <div className="flex items-center mt-96">
        
          <div className="flex gap-4">
            <DemoDataButton 
              habits={habits}
              onDataGenerated={handleDemoDataGenerated}
            />
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Clear All Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;