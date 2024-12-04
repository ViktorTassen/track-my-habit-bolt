import React from 'react'
import { Modal } from './Modal'
import { POINTS } from '../config/gameConfig'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-quicksand text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Level Up Your Habits
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Complete habits, earn points, unlock characters
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Daily Points */}
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl p-4 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-quicksand text-lg font-semibold text-white">Daily Points</h3>
                <div className="font-quicksand text-2xl font-bold text-indigo-400">+{POINTS.BASE}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">Complete any habit to earn base points</p>
          </div>

          {/* Streak Bonuses */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
              <div>
                <h3 className="font-quicksand text-lg font-semibold text-white">Streak Bonuses</h3>
                <div className="font-quicksand text-2xl font-bold text-orange-400">
                  Up to +{Math.max(...Object.values(POINTS.STREAK_MILESTONES))}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {Object.entries(POINTS.STREAK_MILESTONES).slice(0, 3).map(([days, points]) => (
                <div key={days} className="flex justify-between text-sm">
                  <span className="text-gray-400">{days} days</span>
                  <span className="font-quicksand text-orange-400">+{points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Combo Bonuses */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h3 className="font-quicksand text-lg font-semibold text-white">Daily Combos</h3>
                <div className="text-2xl font-bold text-purple-400">
                  Up to +{Math.max(...Object.values(POINTS.MULTI_HABIT_COMPLETION))}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {Object.entries(POINTS.MULTI_HABIT_COMPLETION).slice(0, 3).map(([count, points]) => (
                <div key={count} className="flex justify-between text-sm">
                  <span className="text-gray-400">{count} habits</span>
                  <span className="font-quicksand text-purple-400">+{points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Achievement */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <h3 className="font-quicksand text-lg font-semibold text-white">Monthly Master</h3>
                <div className="font-quicksand text-2xl font-bold text-green-400">+{POINTS.MONTHLY_COMPLETION}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">Complete a habit every day of the month</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}