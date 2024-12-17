export interface MilestoneAchievement {
  type: 'streak' | 'monthly' | 'multi'
  value: number
  points: number
}