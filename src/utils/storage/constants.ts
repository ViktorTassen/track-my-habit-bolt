import type { StorageKeys } from './types'

export const STORAGE_KEYS: StorageKeys = {
  HABITS: 'habits',
  LOGS: 'habit-logs',
  PROGRESS: 'user-progress',
  CALENDAR_POSITION: 'calendar-start-date',
  THEME: 'theme',
  USER_MOTIVATION: 'user-motivation'
} as const