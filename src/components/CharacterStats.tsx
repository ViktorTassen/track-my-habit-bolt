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
      if (eventsTimeoutRef.current) {
        clearTimeout(eventsTimeoutRef.current);
      }

      setAnimationKey((prev) => prev + 1);

      cardsTimeoutRef.current = setTimeout(() => {
        setShowContent(true);
      }, 600);

      eventsTimeoutRef.current = setTimeout(() => {
        setShowContent(false);
        eventsTimeoutRef.current = null;
        scoreEvents.length = 0;
      }, 5000);
    }

    return () => {
      if (eventsTimeoutRef.current) {
        clearTimeout(eventsTimeoutRef.current);
      }
      if (cardsTimeoutRef.current) {
        clearTimeout(cardsTimeoutRef.current);
      }
    };
  }, [scoreEvents]);

  return (
    <div className="relative bg-gradient-to-br from-indigo-500 rounded-xl p-3 select-none min-h-[140px] overflow-visible">
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-0 w-full h-16 bg-white/5 transform -skew-y-6" />
        <div className="absolute bottom-0 right-0 w-full h-16 bg-black/5 transform skew-y-6" />
      </div>

      <div className="relative z-10">
        {/* Desktop Layout (default) - Flex */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="relative w-44 h-40 flex-shrink-0">
            <div className="absolute inset-0 bg-white/5 rounded-full" />
            <button
              onClick={onCharacterClick}
              className="absolute inset-0 scale-[2.2] translate-y-16 -translate-x-2 origin-bottom overflow-visible hover:scale-[2.3] transition-transform duration-200"
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
                  <h2 className="font-quicksand text-lg font-bold text-white">Level {level}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="font-quicksand text-sm font-medium text-indigo-200">
                      {points.toLocaleString()} pts
                    </span>
                    {totalNewPoints > 0 && (
                      <span className="font-quicksand text-sm font-bold text-yellow-300 animate-bounce">
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
                <span>{nextThreshold.toLocaleString()}</span>
              </div>
            </div>

            <div className="h-16 overflow-hidden">
              {showContent && scoreEvents.length > 0 ? (
                <ScoreEventsList events={scoreEvents} />
              ) : (
                <div className="flex gap-2">
                  <StatsCard label="Habits" value={activeHabits} icon="habits" />
                  <StatsCard label="Completed" value={totalCompleted} icon="completed" />
                  <StatsCard label="Best Streak" value={`${bestStreak} days`} icon="streak" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Grid */}
        <div className="sm:hidden grid grid-cols-3 gap-0 items-center">
          {/* Character Section - Left Side */}
          <div className="col-span-1 flex justify-center">
            <div className="relative w-28 h-28 flex-shrink-0">
              <div className="absolute inset-0" />
              <button
                onClick={onCharacterClick}
                className="absolute inset-0 scale-[2.6] translate-y-14 -translate-x-2 origin-bottom overflow-visible hover:scale-[2.7] transition-transform duration-200"
              >
                <CharacterAnimation
                  key={animationKey}
                  isHit={scoreEvents.length > 0}
                  className="w-full h-full object-contain"
                  selectedCharacter={selectedCharacter}
                />
              </button>
            </div>
          </div>

          {/* Level and Progress Section - Right Side */}
          <div className="col-span-2 flex flex-col">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-quicksand text-lg font-bold text-white">Level {level}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="font-quicksand text-sm font-medium text-indigo-200">
                      {points.toLocaleString()} pts
                    </span>
                    {totalNewPoints > 0 && (
                      <span className="font-quicksand text-sm font-bold text-yellow-300 animate-bounce">
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
                <span>{nextThreshold.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards Row - Full Width */}
          <div className="col-span-3">
            <div className="h-16 overflow-hidden">
              {showContent && scoreEvents.length > 0 ? (
                <ScoreEventsList events={scoreEvents} />
              ) : (
                <div className="flex justify-between gap-2">
                  <StatsCard label="Active" value={activeHabits} icon="habits" />
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