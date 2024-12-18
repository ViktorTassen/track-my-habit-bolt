export const STREAK_MILESTONES = [3, 7, 14, 21, 30, 45, 60, 77, 90, 99, 100];

export const getMilestoneQuote = (streak: number): string | null => {
  const milestone = STREAK_MILESTONES.find(m => m === streak);
  if (!milestone) return null;

  switch (milestone) {
    case 3:
      return "Three days in a row! You're building momentum! 🌱";
    case 7:
      return "A whole week! That's what I call dedication! 🌟";
    case 14:
      return "Two weeks strong! You're making this a real habit! 💪";
    case 21:
      return "21 days - They say it takes this long to form a habit. You did it! 🎯";
    case 30:
      return "A month! You're absolutely crushing it! 🏆";
    case 45:
      return "45 days! Your consistency is truly inspiring! ⭐";
    case 60:
      return "Two months! Now that's what I call commitment! 🌈";
    case 77:
      return "77 days! Lucky sevens - and it's not luck, it's dedication! 🍀";
    case 90:
      return "90 days! You're in the habit hall of fame! 👑";
    case 99:
      return "99 days! One more for the triple digits! 🎨";
    case 100:
      return "100 DAYS! You're absolutely legendary! 🎉";
    default:
      return null;
  }
};