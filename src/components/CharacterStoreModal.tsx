import React from 'react'
import { Modal } from './Modal'
import { CHARACTERS } from '../config/characterConfig'
import type { CharacterSelection } from '../types'

interface CharacterStoreModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCharacter?: CharacterSelection
  onSelectCharacter: (selection: CharacterSelection) => void
}

export const CharacterStoreModal: React.FC<CharacterStoreModalProps> = ({
  isOpen,
  onClose,
  selectedCharacter,
  onSelectCharacter
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-6xl">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
            Character Store
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Choose your companion for your habit journey
          </p>
        </div>

        <div className="grid gap-4">
          {Object.entries(CHARACTERS).map(([characterKey, character]) => (
            <div key={characterKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {character.name}
                </h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {Object.entries(character.variants).map(([variantKey, variant]) => {
                  const isSelected = selectedCharacter?.character === characterKey && 
                                   selectedCharacter?.variant === variantKey

                  return (
                    <button
                      key={variantKey}
                      onClick={() => onSelectCharacter({ character: characterKey, variant: variantKey })}
                      className={`
                        relative p-2 rounded-lg border transition-all
                        ${isSelected 
                          ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                        }
                      `}
                    >
                      <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-1">
                        <img
                          src={`/assets/characters/${characterKey}/${variantKey}/Idle/00.png`}
                          alt={`${character.name} - ${variant.name}`}
                          className="w-full h-full object-contain"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>

                      <div className="text-left">
                        <div className="font-medium text-xs text-gray-900 dark:text-white truncate">
                          {variant.name}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {variant.description}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 dark:bg-indigo-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px]">✓</span>
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