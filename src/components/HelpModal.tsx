import React from 'react'
import { POINTS } from '../config/gameConfig'
import { Modal } from './Modal'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
            How Points Work
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track your habits and earn points to level up
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Base Points */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Daily Check-in</h3>
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-sm text-blue-100 mb-1">Complete any habit</p>
            <div className="text-xl font-bold">+{POINTS.BASE} points</div>
          </div>

          {/* Streak Bonuses */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Streak Rewards</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="space-y-1">
              {Object.entries(POINTS.STREAK_MILESTONES).slice(0, 3).map(([days, points]) => (
                <div key={days} className="flex justify-between text-sm">
                  <span>{days} days</span>
                  <span>+{points} pts</span>
                </div>
              ))}
              <div className="text-xs text-orange-100 mt-1">...and more for longer streaks!</div>
            </div>
          </div>
        </div>

        {/* Additional Bonuses */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Additional Bonuses</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Daily Combo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-lg">⚡</span>
                Daily Combo
              </div>
              <div className="space-y-1">
                {Object.entries(POINTS.MULTI_HABIT_COMPLETION).slice(0, 3).map(([count, points]) => (
                  <div key={count} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{count} habits</span>
                    <span>+{points} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Achievement */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-lg">🏆</span>
                Monthly Achievement
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Complete all days in a month:
                <div className="font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                  +{POINTS.MONTHLY_COMPLETION} points
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro Tips</h3>
          </div>
          <ul className="grid gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              Complete multiple habits daily for combo bonuses
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              Maintain streaks to unlock milestone rewards
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              Aim for monthly completion for big point boosts
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}