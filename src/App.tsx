import { useState, useEffect } from "react"
import { Header } from "./components/Header"
import { HabitForm } from "./components/HabitForm"
import { MonthView } from "./components/MonthView"
import { Modal } from "./components/Modal"
import { StatsSection } from "./components/StatsSection"
import { HelpModal } from "./components/HelpModal"
import { CharacterSelectionModal } from "./components/CharacterSelectionModal"
import { ClearDataSection } from "./components/ClearDataSection"
import { useHabitData } from "./hooks/useHabitData"
import type { Habit, CharacterSelection } from "./types"

function App() {
  const {
    habits,
    logs,
    progress,
    scoreEvents,
    loadData,
    handleAddHabit,
    handleUpdateHabit,
    handleArchiveHabit,
    handleUnarchiveHabit,
    handleDeleteHabit,
    handleToggleHabit,
    handleClearScore,
    handleClearAll,
    handleReorderHabits,
    setProgress,
  } = useHabitData()

  const [showForm, setShowForm] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showCharacterSelect, setShowCharacterSelect] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState<'score' | 'all' | null>(null)

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleHabitSubmit = async (name: string, color: string) => {
    if (editingHabit) {
      await handleUpdateHabit(editingHabit.id, name, color)
    } else {
      await handleAddHabit(name, color)
    }
    setShowForm(false)
    setEditingHabit(null)
  }

  const handleCharacterSelect = (selection: CharacterSelection) => {
    setProgress(prev => ({ ...prev, selectedCharacter: selection }))
    setShowCharacterSelect(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <Header
          onOpenCharacterSelect={() => setShowCharacterSelect(true)}
          onOpenHelp={() => setShowHelp(true)}
        />

        <div className="space-y-6">
          <StatsSection
            habits={habits}
            logs={logs}
            points={progress.points}
            level={progress.level}
            scoreEvents={scoreEvents}
            selectedCharacter={progress.selectedCharacter ?? { character: 'CuteCat', variant: 'Character01' }}
            onCharacterClick={() => setShowCharacterSelect(true)}
          />

          <Modal
            isOpen={showForm || editingHabit !== null}
            onClose={() => {
              setShowForm(false)
              setEditingHabit(null)
            }}
          >
            <HabitForm
              onSubmit={handleHabitSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingHabit(null)
              }}
              onDelete={editingHabit ? () => {
                handleDeleteHabit(editingHabit.id)
                setEditingHabit(null)
              } : undefined}
              onArchive={editingHabit && !editingHabit.archived ? () => {
                handleArchiveHabit(editingHabit.id)
                setEditingHabit(null)
              } : undefined}
              onUnarchive={editingHabit?.archived ? () => {
                handleUnarchiveHabit(editingHabit.id)
                setEditingHabit(null)
              } : undefined}
              initialHabit={editingHabit}
            />
          </Modal>

          <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

          <CharacterSelectionModal
            isOpen={showCharacterSelect}
            onClose={() => setShowCharacterSelect(false)}
            selectedCharacter={progress.selectedCharacter}
            onSelectCharacter={handleCharacterSelect}
            level={progress.level}
            points={progress.points}
          />

          {habits.length > 0 ? (
            <MonthView
              habits={habits}
              logs={logs}
              onToggleHabit={handleToggleHabit}
              onHabitClick={setEditingHabit}
              onReorderHabits={handleReorderHabits}
              onAddHabit={() => setShowForm(true)}
            />
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg shadow-sm">
              <p className="text-gray-400 mb-4">
                No habits added yet. Click "Add Habit" to get started!
              </p>
            </div>
          )}


        </div>
        <div className="text-gray-400 text-xs pt-10">


        <div className="mt-4 flex">
          <div className="sharethis-inline-share-buttons"></div>
        </div>
        <div className="my-4">
        <p>
            Track My Habit is free.
          </p>
          <p>
            Love it? Share it with friends!
          </p>
        </div>
      </div>


      </div>

      



      <div className="flex justify-end gap-4 pt-40">
        <ClearDataSection
          habits={habits.length}
          onClearScore={handleClearScore}
          onClearAll={handleClearAll}
          showConfirm={showClearConfirm}
          onCancelClear={() => setShowClearConfirm(null)}
        />
      </div>
    </div>
  )
}

export default App