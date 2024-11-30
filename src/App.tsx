import React, { useState, useEffect } from "react"
import { HabitForm } from "./components/HabitForm"
import { MonthView } from "./components/MonthView"
import { Modal } from "./components/Modal"
import { StatsSection } from "./components/StatsSection"
import { HelpModal } from "./components/HelpModal"
import { ThemeToggle } from "./components/ThemeToggle"
import { CharacterStoreModal } from "./components/CharacterStoreModal"
import { getHabits, saveHabits, getLogs, saveLogs, getProgress, saveProgress } from "./utils/storage"
import { recalculateAllPoints, calculatePointsForHabit, LEVEL_THRESHOLDS } from "./utils/scoring"
import type { Habit, HabitLog, UserProgress, ScoreEvent, CharacterSelection } from "./types"

function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showCharacterStore, setShowCharacterStore] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [progress, setProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    streaks: {},
    lastCompletedDates: {},
    awardedStreakMilestones: {},
    selectedCharacter: { character: 'CuteCat', variant: 'Character01' }
  })
  const [scoreEvents, setScoreEvents] = useState<ScoreEvent[]>([])
  const [showClearConfirm, setShowClearConfirm] = useState<'score' | 'all' | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const calculateLevel = (points: number): number => {
    return LEVEL_THRESHOLDS.findIndex(threshold => threshold > points) + 1
  }

  const loadData = async () => {
    try {
      const [savedHabits, savedLogs, savedProgress] = await Promise.all([
        getHabits(),
        getLogs(),
        getProgress()
      ])
      setHabits(savedHabits)
      setLogs(savedLogs)
      
      const defaultCharacter = { character: 'CuteCat', variant: 'Character01' }
      const updatedProgress = {
        ...savedProgress,
        selectedCharacter: savedProgress.selectedCharacter || defaultCharacter,
        level: calculateLevel(savedProgress.points)
      }
      
      setProgress(updatedProgress)
      await saveProgress(updatedProgress)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleAddHabit = async (name: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date().toISOString(),
      frequency: "daily",
      archived: false
    }
    const updatedHabits = [...habits, newHabit]
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
    setShowForm(false)
  }

  const handleUpdateHabit = async (name: string, color: string) => {
    if (!editingHabit) return

    const updatedHabits = habits.map((habit) =>
      habit.id === editingHabit.id
        ? { ...habit, name, color }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
    setEditingHabit(null)
  }

  const handleArchiveHabit = async (habitId: string) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === habitId
        ? { ...habit, archived: true, archivedAt: new Date().toISOString() }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
    setEditingHabit(null)
  }

  const handleUnarchiveHabit = async (habitId: string) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === habitId
        ? { ...habit, archived: false, archivedAt: undefined }
        : habit
    )
    await saveHabits(updatedHabits)
    setHabits(updatedHabits)
    setEditingHabit(null)
  }

  const handleRemoveHabit = async (habitId: string) => {
    const updatedHabits = habits.filter((h) => h.id !== habitId)
    const updatedLogs = logs.filter((l) => l.habitId !== habitId)
    await saveHabits(updatedHabits)
    await saveLogs(updatedLogs)
    setHabits(updatedHabits)
    setLogs(updatedLogs)
    setEditingHabit(null)

    const { totalPoints, updatedProgress } = recalculateAllPoints(updatedHabits, updatedLogs, progress)
    const level = calculateLevel(totalPoints)
    const newProgress = {
      ...updatedProgress,
      points: totalPoints,
      level
    }
    await saveProgress(newProgress)
    setProgress(newProgress)
  }

  const handleToggleHabit = async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit || (habit.archived && habit.archivedAt && new Date(date) > new Date(habit.archivedAt))) return

    const existingLog = logs.find(
      (l) => l.habitId === habitId && l.date === date
    )

    let updatedLogs: HabitLog[]
    if (existingLog) {
      updatedLogs = logs.map((log) =>
        log.habitId === habitId && log.date === date
          ? { ...log, completed: !log.completed }
          : log
      )
    } else {
      updatedLogs = [
        ...logs,
        { habitId, date, completed: true }
      ]
    }
    
    await saveLogs(updatedLogs)
    setLogs(updatedLogs)

    const isCompleting = !existingLog || !existingLog.completed
    if (isCompleting) {
      const { points, events, updatedProgress } = calculatePointsForHabit(
        habit,
        date,
        habits,
        updatedLogs,
        progress
      )

      const { totalPoints } = recalculateAllPoints(habits, updatedLogs, updatedProgress)
      const level = calculateLevel(totalPoints)
      const newProgress = {
        ...updatedProgress,
        points: totalPoints,
        level
      }
      
      await saveProgress(newProgress)
      setProgress(newProgress)
      setScoreEvents(events)

      setTimeout(() => {
        setScoreEvents([])
      }, 3000)
    } else {
      const { totalPoints, updatedProgress } = recalculateAllPoints(habits, updatedLogs, progress)
      const level = calculateLevel(totalPoints)
      const newProgress = {
        ...updatedProgress,
        points: totalPoints,
        level
      }
      
      await saveProgress(newProgress)
      setProgress(newProgress)
      setScoreEvents([])
    }
  }

  const handleClearScore = async () => {
    await saveLogs([])
    setLogs([])
    const resetProgress: UserProgress = {
      points: 0,
      level: 1,
      streaks: {},
      lastCompletedDates: {},
      awardedStreakMilestones: {},
      selectedCharacter: progress.selectedCharacter
    }
    await saveProgress(resetProgress)
    setProgress(resetProgress)
    setShowClearConfirm(null)
  }

  const handleClearHabits = async () => {
    await saveHabits([])
    await saveLogs([])
    setHabits([])
    setLogs([])
    const resetProgress: UserProgress = {
      points: 0,
      level: 1,
      streaks: {},
      lastCompletedDates: {},
      awardedStreakMilestones: {},
      selectedCharacter: progress.selectedCharacter
    }
    await saveProgress(resetProgress)
    setProgress(resetProgress)
    setShowClearConfirm(null)
  }

  const handleSelectCharacter = async (selection: CharacterSelection) => {
    const updatedProgress = {
      ...progress,
      selectedCharacter: selection
    }
    await saveProgress(updatedProgress)
    setProgress(updatedProgress)
    setShowCharacterStore(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Track My Habits</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCharacterStore(true)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-2"
            >
              <span>🎮</span>
              Character Store
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-2"
            >
              <span>💡</span>
              How Points Work
            </button>
            <ThemeToggle />
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Add Habit
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <StatsSection
            habits={habits}
            logs={logs}
            points={progress.points}
            level={progress.level}
            scoreEvents={scoreEvents}
            selectedCharacter={progress.selectedCharacter}
          />

          <Modal
            isOpen={showForm || editingHabit !== null}
            onClose={() => {
              setShowForm(false)
              setEditingHabit(null)
            }}
          >
            <HabitForm
              onSubmit={editingHabit ? handleUpdateHabit : handleAddHabit}
              onCancel={() => {
                setShowForm(false)
                setEditingHabit(null)
              }}
              onDelete={editingHabit ? () => handleRemoveHabit(editingHabit.id) : undefined}
              onArchive={editingHabit ? () => handleArchiveHabit(editingHabit.id) : undefined}
              onUnarchive={editingHabit?.archived ? () => handleUnarchiveHabit(editingHabit.id) : undefined}
              initialHabit={editingHabit}
            />
          </Modal>

          <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

          <CharacterStoreModal
            isOpen={showCharacterStore}
            onClose={() => setShowCharacterStore(false)}
            selectedCharacter={progress.selectedCharacter}
            onSelectCharacter={handleSelectCharacter}
          />

          {habits.length > 0 ? (
            <MonthView
              habits={habits}
              logs={logs}
              onToggleHabit={handleToggleHabit}
              onHabitClick={setEditingHabit}
            />
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No habits added yet. Click "Add Habit" to get started!
              </p>
            </div>
          )}

          {habits.length > 0 && (
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              {showClearConfirm ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {showClearConfirm === 'score' 
                      ? 'Clear all progress? This cannot be undone.'
                      : 'Clear all habits and progress? This cannot be undone.'
                    }
                  </span>
                  <button
                    onClick={() => setShowClearConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showClearConfirm === 'score' ? handleClearScore : handleClearHabits}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowClearConfirm('score')}
                    className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Clear Score
                  </button>
                  <button
                    onClick={() => setShowClearConfirm('all')}
                    className="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                  >
                    Clear All Habits Data
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App