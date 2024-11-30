export const ANIMATION_CONFIG = {
  CuteCat: {
    Character01: {
      Idle: {
        frameCount: 20,
        fps: 30,
        loop: true,
      },
      Hit: {
        frameCount: 50,
        fps: 30,
        loop: false,
      }
    },
    Character02: {
      Idle: {
        frameCount: 20,
        fps: 30,
        loop: true,
      },
      Hit: {
        frameCount: 50,
        fps: 30,
        loop: false,
      }
    },
    Character03: {
      Idle: {
        frameCount: 20,
        fps: 30,
        loop: true,
      },
      Hit: {
        frameCount: 50,
        fps: 30,
        loop: false,
      }
    }
  },
  CartoonPenguin: {
    Character01: {
      Idle: {
        frameCount: 20,
        fps: 30,
        loop: true,
      },
      Hit: {
        frameCount: 35,
        fps: 30,
        loop: false,
      }
    }
  }
} as const

export type AnimationType = 'Idle' | 'Hit'

export const BONUS_ICONS = {
  streak: '🔥',
  multicombo: '⚡',
  completion: '✨',
  first_habit: '🌟'
} as const

export type BonusType = keyof typeof BONUS_ICONS