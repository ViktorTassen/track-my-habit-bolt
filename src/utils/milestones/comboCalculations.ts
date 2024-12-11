import type { MilestoneAchievement, ComboResult } from './achievementTypes'

const calculateStreakWeight = (streakLength: number): number => {
  return Math.pow(1.2, Math.min(streakLength / 10, 10))
}

const calculateMultiplier = (achievements: MilestoneAchievement[]): number => {
  let multiplier = 1.0
  multiplier += (achievements.length - 1) * 0.2

  const hasLongStreak = achievements.some(a => 
    a.type === 'streak' && a.value >= 100
  )
  const hasMonthly = achievements.some(a => a.type === 'monthly')
  const hasHighCombo = achievements.some(a => 
    a.type === 'multi' && a.value >= 5
  )

  if (hasLongStreak) multiplier += 0.3
  if (hasMonthly) multiplier += 0.2
  if (hasHighCombo) multiplier += 0.2

  return multiplier
}

const generateComboDetails = (
  achievements: MilestoneAchievement[],
  multiplier: number
): string => {
  const streaks = achievements.filter(a => a.type === 'streak')
  const monthlies = achievements.filter(a => a.type === 'monthly')
  const multis = achievements.filter(a => a.type === 'multi')

  const parts: string[] = []

  if (streaks.length > 0) {
    const maxStreak = Math.max(...streaks.map(s => s.value))
    parts.push(`${maxStreak}-day streak`)
  }

  if (monthlies.length > 0) {
    parts.push('monthly completion')
  }

  if (multis.length > 0) {
    const maxCombo = Math.max(...multis.map(m => m.value))
    parts.push(`${maxCombo}x combo`)
  }

  return `Epic combo: ${parts.join(' + ')} (${multiplier.toFixed(1)}x)`
}

export const calculateComboScore = (
  achievements: MilestoneAchievement[]
): ComboResult => {
  if (achievements.length < 2) {
    return { points: 0, multiplier: 1, details: '' }
  }

  const basePoints = achievements.reduce((sum, achievement) => {
    let points = achievement.points
    if (achievement.type === 'streak') {
      points *= calculateStreakWeight(achievement.value)
    }
    return sum + points
  }, 0)

  const multiplier = calculateMultiplier(achievements)
  const finalPoints = Math.round(basePoints * multiplier)
  const details = generateComboDetails(achievements, multiplier)

  return {
    points: finalPoints,
    multiplier,
    details
  }
}