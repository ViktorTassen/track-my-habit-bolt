import React from 'react'
import { useCharacterAnimation } from '../hooks/useCharacterAnimation'
import type { CharacterSelection } from '../types'

interface CharacterAnimationProps {
  isHit: boolean
  className?: string
  selectedCharacter: CharacterSelection
}

export const CharacterAnimation: React.FC<CharacterAnimationProps> = ({
  isHit,
  className = '',
  selectedCharacter
}) => {
  const { currentFrame, currentAnimation } = useCharacterAnimation(isHit, selectedCharacter)
  
  const frameNumber = currentFrame.toString().padStart(2, '0')
  const framePath = `/assets/characters/${selectedCharacter.character}/${selectedCharacter.variant}/${currentAnimation}/${frameNumber}.png`

  return (
    <img
      src={framePath}
      alt="Character"
      className={`w-full h-full object-contain select-none ${className}`}
      draggable="false"
      style={{ imageRendering: 'pixelated' }}
      onError={(e) => {
        console.error('Failed to load character frame:', e.currentTarget.src)
      }}
    />
  )
}