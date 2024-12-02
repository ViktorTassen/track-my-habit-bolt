import React from 'react'

interface StatsCardProps {
  label: string
  value: string | number
  icon?: 'habits' | 'completed' | 'streak'
  className?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon,
  className = '' 
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'habits':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
        )
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        )
      case 'streak':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className={`
      flex-1 rounded-lg px-2 py-1.5
      border border-white/10 
      backdrop-blur-sm
      transition-all duration-200
      hover:bg-white/20
      ${className}
    `}>
      <div className="flex items-center gap-1.5">
        {icon && (
          <div className="text-indigo-200/90">
            {getIcon()}
          </div>
        )}
        <div className="text-[10px] text-indigo-200/90">{label}</div>
      </div>
      <div className="text-sm font-bold text-white mt-0.5">{value}</div>
    </div>
  )
}