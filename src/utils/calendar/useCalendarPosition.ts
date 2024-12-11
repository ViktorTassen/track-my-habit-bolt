import { useState, useEffect } from 'react'
import { startOfDay, differenceInDays, addDays } from 'date-fns'

export function useCalendarPosition() {
  const [startDate, setStartDate] = useState(() => {
    const savedDate = localStorage.getItem('calendar-start-date')
    if (savedDate) {
      const savedDateObj = new Date(savedDate)
      const today = startOfDay(new Date())
      // If saved date is more than 31 days in the past, reset to today
      if (differenceInDays(today, savedDateObj) > 31) {
        return today
      }
      return savedDateObj
    }
    return startOfDay(new Date())
  })

  // Ensure we don't show more than 31 days in the future
  const maxEndDate = addDays(new Date(), 31)
  
  useEffect(() => {
    localStorage.setItem('calendar-start-date', startDate.toISOString())
  }, [startDate])

  const setDateWithinBounds = (newDate: Date) => {
    if (differenceInDays(maxEndDate, newDate) < 0) {
      setStartDate(addDays(maxEndDate, -31))
    } else {
      setStartDate(newDate)
    }
  }

  return { startDate, setStartDate: setDateWithinBounds }
}