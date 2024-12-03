import React, { useState, useEffect, useRef } from 'react';
import { CharacterAnimation } from './CharacterAnimation';
import { StatsCard } from './StatsCard';
import { getNextLevelThreshold, getPreviousLevelThreshold } from '../utils/scoring';
import { ScoreEventsList } from './ScoreEventsList';
import { LevelTitle } from './LevelTitle';
import type { ScoreEvent, CharacterSelection } from '../types';

interface CharacterStatsProps {
  level: number;
  points: number;
  activeHabits: number;
  totalCompleted: number;
  bestStreak: number;
  scoreEvents?: ScoreEvent[];
  selectedCharacter: CharacterSelection;
  onCharacterClick?: () => void;
}

export const CharacterStats: React.FC<CharacterStatsProps> = ({
  level,
  points,
  activeHabits,
  totalCompleted,
  bestStreak,
  scoreEvents = [],
  selectedCharacter,
  onCharacterClick,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const eventsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextThreshold = getNextLevelThreshold(points);
  const prevThreshold = getPreviousLevelThreshold(points);
  const progress = Math.min(100, Math.max(0, ((points - prevThreshold) / (nextThreshold - prevThreshold)) * 100));
  const totalNewPoints = scoreEvents.reduce((sum, event) => sum + event.points, 0);

  useEffect(() => {
    if (scoreEvents.length > 0) {
      console.log('Score events received:', scoreEvents);

      // Clear any existing timeout to prevent overlap
      if (eventsTimeoutRef.current) {
        console.log('Clearing existing timeout:', eventsTimeoutRef.current);
        clearTimeout(eventsTimeoutRef.current);
      }

      // Update animation and show content
      setAnimationKey((prev) => prev + 1);

      cardsTimeoutRef.current = setTimeout(() => {
        console.log('Hiding content');
        setShowContent(true);
      }, 600);


      // Set new timeout
      eventsTimeoutRef.current = setTimeout(() => {
        console.log('Timeout reached, hiding content');
        setShowContent(false);
        eventsTimeoutRef.current = null; // Clear reference after timeout completes
        scoreEvents.length = 0;
      }, 5000);

      console.log('New timeout set:', eventsTimeoutRef.current);
    }

    // Cleanup on unmount or when scoreEvents changes
    return () => {
      if (eventsTimeoutRef.current) {
        console.log('Cleaning up timeout:', eventsTimeoutRef.current);
        clearTimeout(eventsTimeoutRef.current);
        // Don't nullify here to preserve debug logs and avoid confusion
      }
      if (cardsTimeoutRef.current) {
        console.log('Cleaning up cards timeout:', cardsTimeoutRef.current);
        clearTimeout(cardsTimeoutRef.current);
        // Don't nullify here to preserve debug logs and avoid
      }
    };
  }, [scoreEvents]);

  return (
    <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 select-none min-h-[140px] overflow-visible">
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-0 w-full h-16 bg-white/5 transform -skew-y-6" />
        <div className="absolute bottom-0 right-0 w-full h-16 bg-black/5 transform skew-y-6" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-48 h-40 flex-shrink-0">
            <div className="absolute inset-0 bg-white/5 rounded-full" />
            <button
              onClick={onCharacterClick}
              className="absolute inset-0 scale-[2.1] translate-y-14 -translate-x-2 origin-bottom overflow-visible hover:scale-[2.2] transition-transform duration-200"
            >
              <CharacterAnimation
                key={animationKey}
                isHit={scoreEvents.length > 0}
                className="w-full h-full object-contain"
                selectedCharacter={selectedCharacter}
              />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-lg font-bold text-white">Level {level}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium text-indigo-200">
                      {points.toLocaleString()} pts
                    </span>
                    {totalNewPoints > 0 && (
                      <span className="text-sm font-bold text-yellow-300 animate-bounce">
                        +{totalNewPoints}
                      </span>
                    )}
                  </div>
                </div>
                <LevelTitle level={level} />
              </div>
            </div>

            <div className="mb-2">
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-end text-[10px] text-indigo-200/90 mt-0.5">
                {/* <span>{Math.round(progress)}% to next level</span> */}
                <span>{nextThreshold.toLocaleString()}</span>
              </div>
            </div>

            <div className="h-16 overflow-hidden">
              {showContent && scoreEvents.length > 0 ? (
                <ScoreEventsList events={scoreEvents} />
              ) : (
                <div className="flex gap-2">
                  <StatsCard label="Active Habits" value={activeHabits} icon="habits" />
                  <StatsCard label="Completed" value={totalCompleted} icon="completed" />
                  <StatsCard label="Best Streak" value={`${bestStreak} days`} icon="streak" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
