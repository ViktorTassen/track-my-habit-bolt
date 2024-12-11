export interface MilestoneAchievement {
    type: 'streak' | 'monthly' | 'multi'
    value: number // streak length, month count, or combo count
    points: number
  }
  
  export interface ComboResult {
    points: number
    multiplier: number
    details: string
  }