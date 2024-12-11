import type { AnimationState, AnimationType } from './types'
import { CHARACTER_FRAME_CONFIG } from '../../config/animationConfig'
import type { CharacterType } from '../../config/characterConfig'

export const getNextAnimationState = (
  prevState: AnimationState,
  character: CharacterType
): AnimationState => {
  const nextFrame = prevState.currentFrame + 1
  const maxFrames = CHARACTER_FRAME_CONFIG[character][prevState.currentAnimation]

  if (nextFrame >= maxFrames) {
    if (prevState.currentAnimation === 'Idle') {
      return { currentFrame: 0, currentAnimation: 'Idle' }
    }
    return { currentFrame: 0, currentAnimation: 'Idle' }
  }

  return { currentFrame: nextFrame, currentAnimation: prevState.currentAnimation }
}

export const getInitialAnimationState = (): AnimationState => ({
  currentFrame: 0,
  currentAnimation: 'Idle'
})