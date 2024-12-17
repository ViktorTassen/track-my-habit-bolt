export const clearAllHabitData = (): void => {
  // Get all keys from localStorage
  const keys = Object.keys(localStorage)
  
  // Remove all items that start with 'habit-' or 'user-progress'
  keys.forEach(key => {
    if (key.startsWith('habit-') || key === 'user-progress') {
      localStorage.removeItem(key)
    }
  })
}