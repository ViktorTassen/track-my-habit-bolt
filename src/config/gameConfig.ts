// Point values for different achievements
export const POINTS = {
  BASE: 10,
  MONTHLY_COMPLETION: 500,
  STREAK_MILESTONES: {
    3: 30,       // Quick win to encourage early engagement
    7: 100,      // First week milestone
    14: 250,     // Two weeks milestone
    21: 400,     // Three weeks milestone
    30: 500,     // One month milestone
    50: 600,     // Monthly milestone
    75: 1000,    // Two months dedication
    90: 1200,    // Three months milestone
    100: 1500,
    111: 2000,
    150: 2500,   // Five months milestone
    180: 3000,   // Half-year mastery
    200: 3500,
    222: 4000,
    250: 4500,
    300: 5000,
    333: 6000,
    350: 7000,   // Near-year milestone
    365: 10000,  // Yearly dedication
    400: 12000,
    500: 15000,  // Long-term commitment
    600: 20000,  // Steadfast persistence
    730: 30000,  // Two-year streak
    1000: 50000, // Legendary streak
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
  
  // Levels 11-20: Skilled Practitioner
  "Discipline Sculptor",
  "Rhythm Builder",
  "Milestone Maker",
  "Focus Engineer",
  "Goal Tracker",
  "Dedication Strategist",
  "Persistence Pilot",
  "Momentum Keeper",
  "Milestone Chaser",
  "Effort Sustainer",

  // Levels 21-50: Habit Mastery
  "Momentum Maverick",
  "Focus Virtuoso",
  "Dedication Conqueror",
  "Routine Alchemist",
  "Resilience Sculptor",
  "Master Planner",
  "Streak Weaver",
  "Goal Guardian",
  "Perseverance Artisan",
  "Milestone Visionary",
  "Rhythm Commander",
  "Habitologist",
  "Progress Tactician",
  "Consistency Commander",
  "Milestone Strategist",
  "Discipline Innovator",
  "Determination Pilot",
  "Pace Setter",
  "Goal Sculptor",
  "Effort Strategist",
  "Consistency Architect",
  "Resilience Vanguard",
  "Perseverance Guardian",
  "Dedication Tactician",
  "Momentum Strategist",
  "Progress Architect",
  "Growth Strategist",
  "Goal Visionary",
  "Rhythm Champion",
  "Streak Maestro",

  // Levels 51-99: Elite Performers
  "Habit Titan",
  "Momentum Virtuoso",
  "Consistency Luminary",
  "Dedication Conqueror",
  "Persistence Luminary",
  "Growth Sentinel",
  "Streak Innovator",
  "Rhythm Vanguard",
  "Goal Virtuoso",
  "Focus Luminary",
  "Progress Guardian",
  "Momentum Alchemist",
  "Consistency Innovator",
  "Perseverance Vanguard",
  "Dedication Visionary",
  "Persistence Champion",
  "Resilience Titan",
  "Habit Commander",
  "Goal Maverick",
  "Focus Sentinel",
  "Rhythm Pioneer",
  "Streak Guardian",
  "Effort Commander",
  "Dedication Strategist",
  "Perseverance Commander",
  "Consistency Visionary",
  "Growth Commander",
  "Momentum Titan",
  "Habit Visionary",
  "Persistence Architect",
  "Goal Pioneer",
  "Rhythm Tactician",
  "Dedication Luminary",
  "Momentum Champion",
  "Effort Innovator",
  "Growth Alchemist",
  "Focus Architect",
  "Rhythm Maverick",
  "Progress Titan",
  "Momentum Vanguard",
  "Streak Commander",
  "Consistency Titan",
  "Effort Sentinel",
  "Perseverance Tactician",
  "Rhythm Alchemist",
  "Momentum Visionary",
  "Focus Virtuoso",
  "Goal Sentinel",
  "Habit Luminary",
  "Legendary Streak Architect",

  // Level 100: Ultimate Habit Legend
  "Eternal Apex Streak Champion"
]