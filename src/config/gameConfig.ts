import { LEVEL_TITLES } from './levelTitles'

export const LEVEL_THRESHOLDS = [
  20,     // Level 1: Quick first level
  100,    // Level 2: Early encouragement
  250,    // Level 3: Building momentum
  500,    // Level 4: Getting established
  1000,   // Level 5: First major milestone
  1800,   // Level 6: Becoming consistent
  3000,   // Level 7: Dedicated practitioner
  4500,   // Level 8: Habit master
  6500,   // Level 9: Expert level
  9000,   // Level 10: First prestigious rank
  12000,  // Level 11
  15500,  // Level 12
  19500,  // Level 13
  24000,  // Level 14
  29000,  // Level 15
  ...Array.from({ length: 85 }, (_, i) => {
    const base = 29000
    const level = i + 16
    
    if (level <= 30) {
      return Math.floor(base * Math.pow(1.15, i))
    } else if (level <= 50) {
      return Math.floor(base * Math.pow(1.12, i))
    } else {
      return Math.floor(base * Math.pow(1.10, i))
    }
  })
]

export { LEVEL_TITLES }