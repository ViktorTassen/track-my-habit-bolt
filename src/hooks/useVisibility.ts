import { useState, useEffect } from 'react'

export function useVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    const handleFocus = () => setIsVisible(true)
    const handleBlur = () => setIsVisible(false)

    document.addEventListener('visibilitychange', handleVisibilityChange, false)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return isVisible
}