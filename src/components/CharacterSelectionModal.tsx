import React from 'react'
import { Modal } from './Modal'
import { CHARACTERS } from '../config/characterConfig'
import { VARIANT_UNLOCK_LEVELS, isVariantUnlocked, getPointsToNextUnlock } from '../config/unlockConfig'
import type { CharacterSelection } from '../types'
import { saveProgress } from '../storage'

interface CharacterSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCharacter?: CharacterSelection
  onSelectCharacter: (selection: CharacterSelection) => void
  level: number
  points: number
}

export const CharacterSelectionModal: React.FC<CharacterSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedCharacter,
  onSelectCharacter,
  level,
  points
}) => {
  const pointsToNextUnlock = getPointsToNextUnlock(points)

  const handleCharacterSelect = async (selection: CharacterSelection) => {
    onSelectCharacter(selection)
    // Save the progress immediately when character is selected
    await saveProgress({
      points,
      level,
      streaks: {},
      lastCompletedDates: {},
      awardedStreakMilestones: {},
      selectedCharacter: selection
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="space-y-4 select-none">
        <div className="text-center">
          <h2 className="font-quicksand text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
             Choose your companion
          </h2>
          {pointsToNextUnlock && (
            <p className="mt-2 text-xs text-indigo-400">
              Next unlock in {pointsToNextUnlock.toLocaleString()} points
            </p>
          )}
        </div>

        <div className="grid gap-4">
          {Object.entries(CHARACTERS).map(([characterKey, character]) => (
            <div key={characterKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white capitalize">
                  {characterKey.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="h-px flex-1 bg-gray-700" />
              </div>
              
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {Object.entries(character.variants).map(([variantKey, variant]) => {
                  const isUnlocked = isVariantUnlocked(variantKey, level)
                  const isSelected = selectedCharacter?.character === characterKey && 
                                   selectedCharacter?.variant === variantKey
                  const unlockLevel = VARIANT_UNLOCK_LEVELS[variantKey]

                  return (
                    <button
                      key={variantKey}
                      onClick={() => isUnlocked && handleCharacterSelect({ character: characterKey, variant: variantKey })}
                      disabled={!isUnlocked}
                      className={`
                        relative p-1 rounded-lg border transition-all select-none
                        ${isSelected 
                          ? 'border-indigo-400 bg-indigo-900/20' 
                          : isUnlocked
                            ? 'border-gray-700 hover:border-indigo-600'
                            : 'border-gray-700 opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="aspect-square bg-gray-800 rounded overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src={variant.previewFrame}
                            alt={`${characterKey} ${variantKey}`}
                            className={`
                              object-contain transform scale-[3] -translate-y-3 -translate-x-1
                              ${!isUnlocked ? 'grayscale' : ''}
                              select-none pointer-events-none
                            `}
                            style={{ 
                              imageRendering: 'pixelated',
                              transformOrigin: 'center'
                            }}
                            draggable="false"
                          />
                        </div>
                      </div>

                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                          <div className="text-[10px] text-white font-medium">
                            Lvl {unlockLevel}
                          </div>
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-indigo-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-[8px]">✓</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}