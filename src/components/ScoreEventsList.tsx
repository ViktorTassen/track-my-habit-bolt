import React from 'react'
import type { ScoreEvent } from '../types'
import { BONUS_ICONS } from '../config/animationConfig'

interface ScoreEventsListProps {
  events: ScoreEvent[]
}

export const ScoreEventsList: React.FC<ScoreEventsListProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 gap-0.5">
      {events.map((event, index) => (
        <div
          key={`${event.type}-${event.timestamp}-${index}`}
          className={`
            flex items-center gap-1
            animate-[slideIn_0.3s_ease-out_forwards]
            ${event.type !== 'completion' ? 'text-yellow-300' : 'text-white'}
          `}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            textShadow: event.type !== 'completion' ? '0 0 10px rgba(250, 204, 21, 0.5)' : 'none',
            fontSize: '0.75rem',
            lineHeight: '1.1rem'
          }}
        >
          <span className="text-sm leading-none">
            {BONUS_ICONS[event.type]}
          </span>

          <div className="flex-1 min-w-0">
            <span className="truncate">{event.details}</span>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <span className="font-bold">+{event.points}</span>
            {event.type !== 'completion' && (
              <span className="text-[9px] opacity-75">bonus</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}