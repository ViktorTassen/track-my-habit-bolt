import type { CharacterType } from './characterConfig'
import { getAssetPath, getCharacterPath } from '../utils/assetPaths'

export const CHARACTER_FRAME_CONFIG: Record<CharacterType, { Hit: number; Idle: number }> = {
  CuteCat: {
    Hit: 50,
    Idle: 20
  },
  CuteCapybara: {
    Hit: 40,
    Idle: 20
  },
  CutePenguin: {
    Hit: 35,
    Idle: 20
  },
  CuteBear: {
    Hit: 45,
    Idle: 20
  },
  CuteDuck: {
    Hit: 40,
    Idle: 20
  },
  CuteMonster: {
    Hit: 40,
    Idle: 20
  },
  CutePanda: {
    Hit: 45,
    Idle: 20
  },
  CutePig: {
    Hit: 40,
    Idle: 20
  },
  CuteRacoon: {
    Hit: 50,
    Idle: 20
  }
} as const

export const ANIMATION_CONFIG = {
  frameDuration: 30, // milliseconds per frame
  defaultCharacter: {
    character: 'CuteCat',
    variant: 'Character01'
  }
} as const

export type AnimationType = keyof typeof CHARACTER_FRAME_CONFIG.CuteCat

export const BONUS_ICONS = {
  streak: '🔥',
  multicombo: '⚡',
  completion: '✨',
  first_habit: '🌟'
} as const

export type BonusType = keyof typeof BONUS_ICONS

export const generateFramePaths = (character: CharacterType, variant: string, animation: AnimationType) => {
  const frames = []
  const frameCount = CHARACTER_FRAME_CONFIG[character][animation]

  for (let i = 0; i < frameCount; i++) {
    frames.push({
      src: getCharacterPath(
        character,
        variant,
        animation,
        String(i).padStart(2, '0') + '.png'
      ),
      duration: ANIMATION_CONFIG.frameDuration
    })
  }
  return frames
}

export const getCharacterPreviewPath = (character: string, variant: string): string => {
  return getCharacterPath(character, variant, 'Idle', '00.png')
}