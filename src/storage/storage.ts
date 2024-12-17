import { STORAGE_KEYS } from './constants'

export const clearAllHabitData = (): void => {
  // Get all keys from localStorage
  const keys = Object.keys(localStorage)
  
  // Remove all items that start with 'habit-' or match 'user-progress'
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEYS.LOGS_CHUNK_PREFIX) || 
        key === STORAGE_KEYS.LOGS_INDEX ||
        key === STORAGE_KEYS.HABITS ||
        key === STORAGE_KEYS.PROGRESS) {
      localStorage.removeItem(key)
    }
  })
}