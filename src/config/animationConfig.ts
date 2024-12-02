export const ANIMATION_CONFIG = {
  frameCount: {
    Idle: 20,
    Hit: 50
  },
  frameDuration: 30, // milliseconds per frame
  defaultCharacter: {
    character: 'CuteCat',
    variant: 'Character01'
  }
} as const

export type AnimationType = keyof typeof ANIMATION_CONFIG.frameCount

export const BONUS_ICONS = {
  streak: '🔥',
  multicombo: '⚡',
  completion: '✨',
  first_habit: '🌟'
} as const

export type BonusType = keyof typeof BONUS_ICONS

export const generateFramePaths = (character: string, variant: string, animation: AnimationType) => {
  const frames = [];

  for (let i = 0; i < ANIMATION_CONFIG.frameCount[animation]; i++) {
    frames.push({
      src: `/assets/characters/${character}/${variant}/${animation}/${String(i).padStart(2, '0')}.png`,
      duration: ANIMATION_CONFIG.frameDuration
    })
  }
  return frames
}

export const getCharacterPreviewPath = (character: string, variant: string): string => {
  return `/assets/characters/${character}/${variant}/Idle/00.png`
}