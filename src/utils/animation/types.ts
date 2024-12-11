import type { CharacterType } from '../../config/characterConfig'
import type { CharacterSelection } from '../../types'

export interface AnimationState {
  currentFrame: number
  currentAnimation: AnimationType
}

export interface AnimationFrame {
  src: string
  duration: number
}

export type AnimationType = 'Hit' | 'Idle'

export interface AnimationConfig {
  frameDuration: number
  defaultCharacter: CharacterSelection
}

export interface AnimationHookResult {
  frameRef: React.RefObject<HTMLImageElement>
  currentFrame: number
  currentAnimation: AnimationType
  frameSrc: string | undefined
  hasError: boolean
  setHasError: (error: boolean) => void
}