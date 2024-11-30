import React from 'react'

interface StatsCardProps {
  label: string
  value: string | number
  icon?: string
  className?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon, 
  className = '' 
}) => {
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
          <span className="text-base select-none" role="img" aria-label={label}>
            {icon}
          </span>
        )}
        <div className="text-[10px] text-indigo-200/90">{label}</div>
      </div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  )
}