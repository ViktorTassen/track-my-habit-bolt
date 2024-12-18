import React from 'react';
import { Flame, Trophy, CheckCircle2 } from 'lucide-react';
import type { StreakInfo } from '../utils/streakUtils';

interface StreakDisplayProps {
  streak: StreakInfo;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  return (
    <div className="flex items-center gap-4">
      <div 
        className="flex items-center gap-1.5 min-w-[40px] text-gray-400" 
        title="Total Count"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span className="font-medium tabular-nums">{streak.totalCount}</span>
      </div>
      {streak.longestStreak > 0 && streak.longestStreak !== streak.currentStreak && (
        <div 
          className="flex items-center gap-1.5 min-w-[40px] text-gray-400" 
          title="Best Streak"
        >
          <Trophy className="w-4 h-4" />
          <span className="font-medium tabular-nums">{streak.longestStreak}</span>
        </div>
      )}
      <div className="flex items-center gap-1.5 min-w-[40px]">
        <Flame 
          className={`w-5 h-5 ${streak.currentStreak > 0 ? 'text-orange-500' : 'text-gray-500'}`} 
          title="Current Streak"
        />
        <span 
          className={`font-medium tabular-nums ${
            streak.currentStreak > 0 ? 'text-orange-500' : 'text-gray-500'
          }`}
        >
          {streak.currentStreak}
        </span>
      </div>
    </div>
  );
};