 import React from 'react';
import { formatDate } from '../../utils/dateUtils';

interface DateHeadersProps {
  dates: Date[];
}

export const DateHeaders: React.FC<DateHeadersProps> = ({ dates }) => {
  const today = new Date();
  const todayStr = formatDate(today);

  return (
    <>
      <div className="text-gray-400 h-0 flex items-center"></div>
      <div className="grid grid-cols-15 gap-2">
        {dates.map((date) => {
          const isToday = formatDate(date) === todayStr;
          return (
            <div 
              key={formatDate(date)} 
              className="flex flex-col items-center"
            >
              <div className="text-gray-400 text-xs writing-mode-vertical h-10 flex items-center justify-center">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-gray-400 text-xs ${isToday ? 'text-indigo-400 font-medium' : ''}`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};