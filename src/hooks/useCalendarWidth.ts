import { useState, useEffect, RefObject } from 'react'

export function useCalendarWidth(containerRef: RefObject<HTMLDivElement>) {
  const [daysToShow, setDaysToShow] = useState(31)

  useEffect(() => {
    const calculateDaysToShow = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      const minDayWidth = 32
      const habitColumnWidth = 208
      const availableWidth = containerWidth - habitColumnWidth
      const optimalDays = Math.floor(availableWidth / minDayWidth)
      setDaysToShow(Math.max(3, Math.min(31, optimalDays)))
    }

    calculateDaysToShow()
    const resizeObserver = new ResizeObserver(calculateDaysToShow)
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    return () => resizeObserver.disconnect()
  }, [])

  return { daysToShow }
}