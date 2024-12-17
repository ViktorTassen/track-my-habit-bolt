// Update the import section at the top
import { 
  getHabits, 
  saveHabits, 
  getLogs, 
  saveLogs, 
  getProgress, 
  saveProgress,
  getLogsForDateRange,
  clearAllHabitData // Add this import
} from '../storage'

// ... rest of the existing imports ...

// Update the handleClearAll function in the hook
const handleClearAll = useCallback(async () => {
  const resetProgress: UserProgress = {
    points: 0,
    level: 1,
    streaks: {},
    lastCompletedDates: {},
    awardedStreakMilestones: {},
    selectedCharacter: progress.selectedCharacter,
    habitOrder: []
  }
  
  // Clear all habit-related data from localStorage
  clearAllHabitData()
  
  // Reset the state
  setHabits([])
  setLogs([])
  setProgress(resetProgress)
  setScoreEvents([])
}, [progress.selectedCharacter])