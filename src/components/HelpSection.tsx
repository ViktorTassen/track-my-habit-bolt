import React, { useState } from 'react'
import { POINTS } from '../config/gameConfig'

export const HelpSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          How Points Work
        </h3>
        <span className="text-gray-500 dark:text-gray-400">
          {isOpen ? '▼' : '▶'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Base Points</h4>
            <p>Every time you complete a habit, you earn {POINTS.BASE} points.</p>
          </section>

          <section>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Monthly Completion Bonus 🎯</h4>
            <p>Complete a habit every day of the month to earn a big bonus:</p>
            <p className="mt-1">
              <span className="font-medium text-blue-600 dark:text-blue-400">+{POINTS.MONTHLY_COMPLETION} points</span> for completing all days in a month
            </p>
          </section>

          <section>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Streak Bonuses 🔥</h4>
            <p className="mb-2">Maintain your habits to earn streak bonuses:</p>
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(POINTS.STREAK_MILESTONES).slice(0, 5).map(([days, points]) => (
                <li key={days}>
                  {days} days streak: <span className="font-medium text-green-600 dark:text-green-400">+{points} points</span>
                </li>
              ))}
              <li>...and more bonuses for longer streaks!</li>
            </ul>
          </section>

          <section>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Daily Combo Bonuses ⚡️</h4>
            <p className="mb-2">Complete multiple habits in a single day:</p>
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(POINTS.MULTI_HABIT_COMPLETION).map(([count, points]) => (
                <li key={count}>
                  {count} habits: <span className="font-medium text-purple-600 dark:text-purple-400">+{points} points</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Milestone Combo Bonuses 🌟</h4>
            <p className="mb-2">Hit streak milestones with multiple habits on the same day:</p>
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(POINTS.MILESTONE_COMBOS).map(([count, points]) => (
                <li key={count}>
                  {count} milestone{count === '1' ? '' : 's'}: <span className="font-medium text-indigo-600 dark:text-indigo-400">+{points} bonus points</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm italic">
              Example: If two habits both reach a 3-day streak on the same day, you'll earn the regular streak bonuses plus an extra milestone combo bonus!
            </p>
          </section>

          <section>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tips for Maximum Points 💡</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Try to complete all your habits every day to earn daily combo bonuses</li>
              <li>Complete habits every day of the month for big monthly bonuses</li>
              <li>Start multiple habits together to align their streak milestones</li>
              <li>Keep going to earn bigger bonuses for longer streaks</li>
              <li>Don't break your streaks - longer streaks mean bigger bonuses!</li>
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}