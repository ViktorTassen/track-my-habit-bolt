import { useState, useEffect } from "react"
import { HabitForm } from "./components/HabitForm"
import { MonthView } from "./components/MonthView"
import { Modal } from "./components/Modal"
import { StatsSection } from "./components/StatsSection"
import { HelpModal } from "./components/HelpModal"
import { CharacterSelectionModal } from "./components/CharacterSelectionModal"
import { ClearDataSection } from "./components/ClearDataSection"
import { useHabitData } from "./hooks/useHabitData"
import type { Habit, CharacterSelection } from "./types"

export function App() {
  const {
    habits,
    logs,
    progress,
    scoreEvents,
    loadData,
    addHabit,
    updateHabit,
    archiveHabit,
    unarchiveHabit,
    deleteHabit,
    toggleHabit,
    handleClearScore,
    handleClearAll,
    reorderHabits,
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
      await updateHabit(editingHabit.id, name, color)
    } else {
      await addHabit(name, color)
    }
    setShowForm(false)
    setEditingHabit(null)
  }

  const handleCharacterSelect = (selection: CharacterSelection) => {
    setProgress(prev => ({ ...prev, selectedCharacter: selection }))
    setShowCharacterSelect(false)
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-4 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4">
          <StatsSection
            habits={habits}
            logs={logs}
            points={progress.points}
            level={progress.level}
            scoreEvents={scoreEvents}
            selectedCharacter={progress.selectedCharacter ?? { character: 'CuteCat', variant: 'Character01' }}
            onCharacterClick={() => setShowCharacterSelect(true)}
            onOpenHelp={() => setShowHelp(true)}
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
                deleteHabit(editingHabit.id)
                setEditingHabit(null)
              } : undefined}
              onArchive={editingHabit && !editingHabit.archived ? () => {
                archiveHabit(editingHabit.id)
                setEditingHabit(null)
              } : undefined}
              onUnarchive={editingHabit?.archived ? () => {
                unarchiveHabit(editingHabit.id)
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

          <MonthView
            habits={habits}
            logs={logs}
            onToggleHabit={toggleHabit}
            onHabitClick={setEditingHabit}
            onReorderHabits={reorderHabits}
            onAddHabit={() => setShowForm(true)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-40">
        <ClearDataSection
          habits={habits.length}
          onClearScore={() => {
            handleClearScore()
            setShowClearConfirm(null)
          }}
          onClearAll={() => {
            handleClearAll()
            setShowClearConfirm(null)
          }}
          showConfirm={showClearConfirm}
          onCancelClear={() => setShowClearConfirm(null)}
        />
      </div>
    </div>
  )
}