import React from 'react'
import { Modal } from './Modal'
import { getAllMilestones, MONTHLY_COMPLETION_BONUS } from '../utils/scoring/milestoneCalculations'
import { getBasePointsByStreak } from '../utils/scoring/basePoints'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const streakMilestones = getAllMilestones()
  const maxBasePoints = getBasePointsByStreak(365)

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
          <div className="bg-gradient-to-b from-indigo-500/20 to-indigo-600/20 rounded-xl p-4 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-quicksand text-lg font-semibold text-white">Daily Points</h3>
                <div className="font-quicksand text-2xl font-bold text-indigo-400">Up to {maxBasePoints}</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Days 1-4</span>
                <span className="font-quicksand text-indigo-400">10-25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Days 5-29</span>
                <span className="font-quicksand text-indigo-400">35</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Days 30+</span>
                <span className="font-quicksand text-indigo-400">50-150</span>
              </div>
            </div>
          </div>

          {/* Streak Bonuses */}
          <div className="bg-gradient-to-b from-orange-500/20 to-red-600/20 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
              <div>
                <h3 className="font-quicksand text-lg font-semibold text-white">Streak Bonuses</h3>
                <div className="font-quicksand text-2xl font-bold text-orange-400">
                  Up to {streakMilestones[1000]}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {Object.entries(streakMilestones).slice(0, 3).map(([days, points]) => (
                <div key={days} className="flex justify-between text-sm">
                  <span className="text-gray-400">{days} days</span>
                  <span className="font-quicksand text-orange-400">+{points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Combo Bonuses */}
          <div className="bg-gradient-to-b from-purple-500/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h3 className="font-quicksand text-lg font-semibold text-white">Daily Combos</h3>
                <div className="text-2xl font-bold text-purple-400">
                  Bonus Formula
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              (Base Points Average) × (1 + Average Streak × 0.01)
            </p>
          </div>

          {/* Monthly Achievement */}
          <div className="bg-gradient-to-b from-green-500/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <h3 className="font-quicksand text-lg font-semibold text-white">Monthly Master</h3>
                <div className="font-quicksand text-2xl font-bold text-green-400">+{MONTHLY_COMPLETION_BONUS}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">Complete a habit every day of the month</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}