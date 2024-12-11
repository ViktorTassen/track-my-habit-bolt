export const ANIMATION_SETTINGS = {
  FRAME_DURATION: 30,
  MIN_FRAME_COUNT: 20,
  MAX_FRAME_COUNT: 50,
  PREVIEW_PATH: '/assets/characters/{character}/{variant}/Idle/00.png'
} as const

export const ANIMATION_EVENTS = {
  VISIBILITY_CHANGE: 'visibilitychange',
  FOCUS: 'focus',
  BLUR: 'blur'
} as const