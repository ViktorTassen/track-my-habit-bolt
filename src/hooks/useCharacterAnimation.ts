import { useState, useEffect, useRef } from 'react'
import { useVisibility } from './useVisibility'
import { ANIMATION_CONFIG, type AnimationType } from '../config/animationConfig'
import type { CharacterSelection } from '../types'

export function useCharacterAnimation(isHit: boolean, selectedCharacter: CharacterSelection) {
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>('Idle')
  const [currentFrame, setCurrentFrame] = useState(0)
  const frameCountRef = useRef(0)
  const rafRef = useRef<number>()
  const lastTimeRef = useRef(0)
  const isVisible = useVisibility()

  const startAnimation = () => {
    const config = ANIMATION_CONFIG[selectedCharacter.character][selectedCharacter.variant][currentAnimation]
    const frameDuration = 1000 / config.fps

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const elapsed = timestamp - lastTimeRef.current

      if (elapsed >= frameDuration) {
        frameCountRef.current = (frameCountRef.current + 1) % config.frameCount
        lastTimeRef.current = timestamp

        if (currentAnimation === 'Hit' && frameCountRef.current === config.frameCount - 1) {
          setCurrentAnimation('Idle')
          frameCountRef.current = 0
          lastTimeRef.current = 0
        }

        setCurrentFrame(frameCountRef.current)
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isHit) {
      setCurrentAnimation('Hit')
      frameCountRef.current = 0
      lastTimeRef.current = 0
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = undefined
      }
    }
  }, [isHit])

  useEffect(() => {
    if (isVisible) {
      startAnimation()
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [currentAnimation, isVisible, selectedCharacter])

  return {
    currentFrame,
    currentAnimation
  }
}