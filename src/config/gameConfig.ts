// Point values for different achievements
export const POINTS = {
  BASE: 10,
  MONTHLY_COMPLETION: 500,
  STREAK_MILESTONES: {
    3: 30,     // Quick win to encourage early engagement
    7: 100,    // First week milestone
    14: 250,   // Two weeks milestone
    21: 400,   // Three weeks milestone
    30: 600,   // Monthly milestone
    60: 1000,  // Two months dedication
    90: 1500,  // Quarterly achievement
    180: 3000, // Half-year mastery
    365: 10000 // Yearly dedication
  },
  MULTI_HABIT_COMPLETION: {
    2: 10,   // Encourage multiple habits early
    3: 15,   // Significant boost for 3 habits
    4: 25,  // Major boost for 4 habits
    5: 50,  // Substantial reward for 5 habits
    10: 100  // Ultimate daily achievement
  },
  MILESTONE_COMBOS: {
    2: 300,   // Two milestones
    3: 700,   // Three milestones
    4: 1500,  // Four milestones
    5: 3000   // Five or more milestones
  }
} as const

// Level thresholds with a smoother early game curve
export const LEVEL_THRESHOLDS = [
  20,    // Level 1: 0-20 (Easy first level)
  200,    // Level 2: 20-100 (Quick second level)
  500,    // Level 3: 100-300
  1000,   // Level 4: 300-700
  1800,   // Level 5: 700-1800
  3500,   // Level 6: 1800-3500
  5500,   // Level 7: 3500-5500
  8000,   // Level 8: 5500-8000
  11000,  // Level 9: 8000-11000
  15000,  // Level 10: 11000-15000
  20000,  // Level 11: 15000-20000
  26000,  // Level 12: 20000-26000
  33000,  // Level 13: 26000-33000
  41000,  // Level 14: 33000-41000
  50000,  // Level 15: 41000-50000
  ...Array.from({ length: 85 }, (_, i) => {
    const base = 50000
    const level = i + 16
    if (level <= 30) {
      return Math.floor(base * Math.pow(1.2, i))
    } else if (level <= 50) {
      return Math.floor(base * Math.pow(1.25, i))
    } else {
      return Math.floor(base * Math.pow(1.3, i))
    }
  })
]

// Level titles with meaningful progression
export const LEVEL_TITLES = [
  // Levels 1-5: Beginner's Journey
  "Habit Novice",
  "Routine Starter",
  "Discipline Seeker",
  "Pattern Builder",
  "Consistency Keeper",
  
  // Levels 6-10: Intermediate Growth
  "Habit Explorer",
  "Progress Tracker",
  "Dedication Finder",
  "Rhythm Master",
  "Foundation Champion",
  
  // Levels 11-20: Advanced Mastery
  ...Array.from({ length: 10 }, (_, i) => `Growth Seeker ${i + 1}`),
  
  // Levels 21-50: Expert Status
  ...Array.from({ length: 30 }, (_, i) => `Habit Master ${i + 1}`),
  
  // Levels 51-99: Elite Status
  ...Array.from({ length: 49 }, (_, i) => `Elite Achiever ${i + 1}`),
  
  // Level 100: Ultimate Achievement
  "Legendary Habit Master"
]