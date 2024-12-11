import { CHARACTER_FRAME_CONFIG } from '../../config/animationConfig'
import type { CharacterType } from '../../config/characterConfig'
import type { AnimationType, AnimationFrame } from './types'

export const generateFramePaths = (
  character: CharacterType,
  variant: string,
  animation: AnimationType,
  frameDuration: number
): AnimationFrame[] => {
  const frames: AnimationFrame[] = []
  const frameCount = CHARACTER_FRAME_CONFIG[character][animation]

  for (let i = 0; i < frameCount; i++) {
    frames.push({
      src: `/assets/characters/${character}/${variant}/${animation}/${String(i).padStart(2, '0')}.png`,
      duration: frameDuration
    })
  }
  
  return frames
}

export const getCharacterPreviewPath = (character: string, variant: string): string => {
  return `/assets/characters/${character}/${variant}/Idle/00.png`
}