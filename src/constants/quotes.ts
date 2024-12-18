import { getRandomItem } from '../utils/arrayUtils';

const SINGLE_HABIT_QUOTES = [
  "Good boy! 🌟",
  "Keep it up! 💪",
  "You're doing great! ✨",
  "That's the spirit! 🎯",
  "Excellent work! 🌈",
  "Way to go! 🚀",
  "You're on fire! 🔥",
  "Fantastic job! ⭐",
  "Keep rolling! 🎲",
  "You're crushing it! 💎"
];

const ALL_HABITS_QUOTES = [
  "Amazing! You've completed all habits for today! 🎉",
  "Perfect score! You're absolutely crushing it! 🏆",
  "Wow! All tasks completed - you're unstoppable! 🚀",
  "Full house! You're on a roll today! 🎲",
  "Everything done! You're a productivity machine! ⚡",
  "All green! You're making it look easy! 🌟",
  "Complete success! You're truly inspiring! 💫",
  "Perfect day! Keep this momentum going! 🌈",
  "All done! You're setting the bar high! 🎯",
  "Flawless execution! You're a habit master! 👑",
  "Outstanding! Every single habit checked! 💪",
  "Phenomenal! You didn't miss a single one! ✨",
  "Incredible discipline! All habits completed! 🌠",
  "Magnificent! You're at 100% today! 💯",
  "Spectacular! Every habit nailed perfectly! 🎨",
  "Brilliant work! All tasks accomplished! 💎",
  "Exceptional! Full completion achieved! 🏅",
  "Remarkable! You've done them all! 🌺",
  "Superb! Perfect score today! 🎭",
  "Excellent! Not a single habit missed! 🎪"
];

const MILESTONE_QUOTES = {
  3: [
    "Three days strong! You're building something special! 🌱",
    "Third day in a row! The journey begins! 🚀",
    "Three consecutive days! You're finding your rhythm! ⭐"
  ],
  7: [
    "A whole week! That's what I call dedication! 🌟",
    "Seven days straight! You're becoming unstoppable! 💫",
    "One week milestone! Your consistency is inspiring! 🎯"
  ],
  14: [
    "Two weeks strong! You're making this a real habit! 💪",
    "14 days of excellence! You're on a roll! 🎲",
    "Two weeks in! Your dedication is showing! 🌈"
  ],
  21: [
    "21 days - They say it takes this long to form a habit. You did it! 🎯",
    "Three weeks of consistency! You're transforming! ✨",
    "21 days strong! This is becoming second nature! 🌠"
  ],
  30: [
    "A full month! You're absolutely crushing it! 🏆",
    "30 days of dedication! You're an inspiration! 💎",
    "One month milestone! Your commitment is incredible! 👑"
  ],
  45: [
    "45 days! Your consistency is truly inspiring! ⭐",
    "A month and a half! You're setting records! 🎨",
    "45 days strong! Your persistence is remarkable! 🌺"
  ],
  60: [
    "Two months! Now that's what I call commitment! 🌈",
    "60 days of excellence! You're a habit master! 💫",
    "Two months strong! Your dedication is unmatched! 🎭"
  ],
  77: [
    "77 days! Lucky sevens - and it's not luck, it's dedication! 🍀",
    "77 days of consistency! You're making history! 🎪",
    "Triple sevens! Your streak is legendary! 🎯"
  ],
  90: [
    "90 days! You're in the habit hall of fame! 👑",
    "Three months strong! You're an inspiration to all! 💎",
    "90 days of excellence! This is truly remarkable! 🏅"
  ],
  99: [
    "99 days! One more for the triple digits! 🎨",
    "Day 99! You're on the cusp of greatness! 🌺",
    "99 days strong! Tomorrow is the big one! 🎭"
  ],
  100: [
    "100 DAYS! You're absolutely legendary! 🎉",
    "Triple digits! You've achieved something incredible! 💫",
    "100 days of pure dedication! You're an inspiration! 🏆"
  ]
};

export const QUOTES = {
  singleHabit: () => getRandomItem(SINGLE_HABIT_QUOTES),
  allHabits: () => getRandomItem(ALL_HABITS_QUOTES),
  milestone: (streak: number): string | null => {
    const quotes = MILESTONE_QUOTES[streak as keyof typeof MILESTONE_QUOTES];
    return quotes ? getRandomItem(quotes) : null;
  }
};