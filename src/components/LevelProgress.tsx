import React from 'react'
import { getNextLevelThreshold, getLevelTitle } from '../utils/scoring'

interface LevelProgressProps {
  level: number
  points: number
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ level, points }) => {
  const nextThreshold = getNextLevelThreshold(points)
  const prevThreshold = level > 1 ? getNextLevelThreshold(points - 1) : 0
  const progress = ((points - prevThreshold) / (nextThreshold - prevThreshold)) * 100

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-lg font-semibold">Level {level}</span>
          <span className="ml-2 text-sm text-gray-600">({getLevelTitle(level)})</span>
        </div>
        <span className="text-sm text-gray-600">{points} points</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{prevThreshold}</span>
        <span>{nextThreshold}</span>
      </div>
    </div>
  )
}