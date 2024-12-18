import React from 'react';
import { Database } from 'lucide-react';
import { generateDemoData } from '../utils/demoDataUtils';
import type { Habit } from '../types/habit';

interface DemoDataButtonProps {
  habits: Habit[];
  onDataGenerated: () => void;
}

export const DemoDataButton: React.FC<DemoDataButtonProps> = ({
  habits,
  onDataGenerated
}) => {
  const handleGenerateData = () => {
    if (window.confirm('This will generate 500 days of demo data for all habits. Continue?')) {
      generateDemoData(habits.map(h => h.id));
      onDataGenerated();
    }
  };

  return (
    <button
      onClick={handleGenerateData}
      className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
    >
      <Database className="w-5 h-5" />
      Generate Demo Data
    </button>
  );
};