import React from 'react'
import { getLevelTitle } from '../utils/scoring'

interface LevelTitleProps {
  level: number
}

export const LevelTitle: React.FC<LevelTitleProps> = ({ level }) => {
  const title = getLevelTitle(level)
  
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-xs font-medium text-indigo-200/80 px-2 py-0.5 rounded-full bg-white/10">
        {title}
      </span>
    </div>
  )
}