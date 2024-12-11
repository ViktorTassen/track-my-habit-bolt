import { useState, useEffect, useRef } from 'react'
import { ANIMATION_CONFIG } from '../../config/animationConfig'
import { validateCharacterSelection } from '../../config/characterConfig'
import { generateFramePaths } from './frameGeneration'
import { getNextAnimationState, getInitialAnimationState } from './animationState'
import type { AnimationState } from './types'
import type { CharacterSelection } from '../../types'

export function useCharacterAnimation(
  isHit: boolean,
  selectedCharacter: CharacterSelection = ANIMATION_CONFIG.defaultCharacter
) {
  const [state, setState] = useState<AnimationState>(getInitialAnimationState())
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
    setState(getInitialAnimationState())
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
      setState(prev => getNextAnimationState(prev, character))
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
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

  const frames = generateFramePaths(character, variant, state.currentAnimation, ANIMATION_CONFIG.frameDuration)
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