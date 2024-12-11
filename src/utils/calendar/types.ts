export interface CalendarDay {
  date: Date
  isToday: boolean
  isFirstOfMonth: boolean
}

export interface CalendarState {
  startDate: Date
  daysToShow: number
  isCurrentDateVisible: boolean
}

export interface CalendarViewProps {
  startDate: Date
  endDate: Date
  isCurrentDateVisible: boolean
  onScrollLeft: () => void
  onScrollRight: () => void
  onScrollToToday: () => void
  onAddHabit: () => void
}