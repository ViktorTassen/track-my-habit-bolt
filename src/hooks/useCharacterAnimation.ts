import { useState, useEffect, useRef } from 'react'
import { ANIMATION_CONFIG, generateFramePaths, type AnimationType } from '../config/animationConfig'
import { validateCharacterSelection } from '../config/characterConfig'
import type { CharacterSelection } from '../types'

interface AnimationState {
  currentFrame: number
  currentAnimation: AnimationType
}

export function useCharacterAnimation(isHit: boolean, selectedCharacter: CharacterSelection = ANIMATION_CONFIG.defaultCharacter) {
  const [state, setState] = useState<AnimationState>({
    currentFrame: 0,
    currentAnimation: 'Idle'
  })

  const frameRef = useRef<HTMLImageElement | null>(null)
  const animationFrameRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const hasErrorRef = useRef<boolean>(false)

  // Validate character selection
  const character = validateCharacterSelection(selectedCharacter.character, selectedCharacter.variant)
    ? selectedCharacter.character
    : ANIMATION_CONFIG.defaultCharacter.character
  const variant = validateCharacterSelection(selectedCharacter.character, selectedCharacter.variant)
    ? selectedCharacter.variant
    : ANIMATION_CONFIG.defaultCharacter.variant

  const startAnimation = () => {
    setState({
      currentFrame: 0,
      currentAnimation: 'Idle'
    })
    lastFrameTimeRef.current = 0
    hasErrorRef.current = false
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  const animate = (timestamp: number) => {
    if (hasErrorRef.current || document.hidden) return

    if (!lastFrameTimeRef.current) {
      lastFrameTimeRef.current = timestamp
    }

    const elapsed = timestamp - lastFrameTimeRef.current
    
    if (elapsed >= ANIMATION_CONFIG.frameDuration) {
      setState(prev => {
        let nextFrame = prev.currentFrame + 1
        let nextAnimation = prev.currentAnimation

        if (nextFrame >= ANIMATION_CONFIG.frameCount[prev.currentAnimation]) {
          if (prev.currentAnimation === 'Idle') {
            nextFrame = 0
          } else {
            nextFrame = 0
            nextAnimation = 'Idle'
          }
        }

        return { currentFrame: nextFrame, currentAnimation: nextAnimation }
      })

      lastFrameTimeRef.current = timestamp
    }

    if (!document.hidden) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      } else {
        startAnimation()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', startAnimation)
    window.addEventListener('blur', () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    })

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', startAnimation)
      window.removeEventListener('blur', startAnimation)
    }
  }, [])

  // Handle character/variant changes
  useEffect(() => {
    startAnimation()
  }, [character, variant])

  // Handle hit animation
  useEffect(() => {
    if (isHit) {
      setState({
        currentFrame: 0,
        currentAnimation: 'Hit'
      })
      lastFrameTimeRef.current = 0
      hasErrorRef.current = false
    }
  }, [isHit])

  // Main animation loop
  useEffect(() => {
    if (!document.hidden && !hasErrorRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [state.currentAnimation, state.currentFrame])

  const frames = generateFramePaths(character, variant, state.currentAnimation)
  const currentFrameData = frames[state.currentFrame]

  return {
    frameRef,
    currentFrame: state.currentFrame,
    currentAnimation: state.currentAnimation,
    frameSrc: currentFrameData?.src,
    hasError: hasErrorRef.current,
    setHasError: (error: boolean) => {
      hasErrorRef.current = error
      if (!error) {
        startAnimation()
      }
    }
  }
}