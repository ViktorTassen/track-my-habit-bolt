import type { CharacterType } from './characterConfig'
import type { AnimationConfig } from '../utils/animation/types'

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

export const ANIMATION_CONFIG: AnimationConfig = {
  frameDuration: 30,
  defaultCharacter: {
    character: 'CuteCat',
    variant: 'Character01'
  }
}

export const BONUS_ICONS = {
  streak: '🔥',
  multicombo: '⚡',
  completion: '✨',
  first_habit: '🌟'
} as const

export type BonusType = keyof typeof BONUS_ICONS