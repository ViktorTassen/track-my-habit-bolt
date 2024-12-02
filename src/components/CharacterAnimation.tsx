import React, { useEffect, useState } from 'react'
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
  const [imageError, setImageError] = useState(false)
  const { frameRef, frameSrc, hasError, setHasError } = useCharacterAnimation(isHit, selectedCharacter)
  
  useEffect(() => {
    setImageError(false)
  }, [frameSrc])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && (imageError || hasError)) {
        setImageError(false)
        setHasError(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [imageError, hasError, setHasError])

  if (!frameSrc || imageError || hasError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <button 
          onClick={() => {
            setImageError(false)
            setHasError(false)
          }}
          className="text-4xl hover:scale-110 transition-transform"
          aria-label="Retry loading character"
        >
          😺
        </button>
      </div>
    )
  }

  return (
    <img
      ref={frameRef}
      src={frameSrc}
      alt="Character"
      className={`w-full h-full object-contain select-none ${className}`}
      draggable="false"
      style={{ imageRendering: 'pixelated' }}
      onError={() => {
        console.error('Failed to load character frame:', frameSrc)
        setImageError(true)
        setHasError(true)
      }}
    />
  )
}