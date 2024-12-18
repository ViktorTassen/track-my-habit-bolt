import React from 'react';
import { QUOTES } from '../constants/quotes';

interface CharacterQuoteProps {
  show: boolean;
  isAllCompleted?: boolean;
  milestoneQuote?: string | null;
  streak?: number;
}

export const CharacterQuote: React.FC<CharacterQuoteProps> = ({ 
  show, 
  isAllCompleted = false,
  milestoneQuote = null,
  streak
}) => {
  if (!show) return null;

  let quote: string | null;
  
  if (milestoneQuote && streak) {
    quote = QUOTES.milestone(streak);
  } else if (isAllCompleted) {
    quote = QUOTES.allHabits();
  } else {
    quote = QUOTES.singleHabit();
  }

  const isMilestone = Boolean(milestoneQuote);

  return (
    <div className={`flex items-center gap-4 px-4 py-2 border rounded-tr-lg rounded-br-lg rounded-tl-lg transition-all ${
      isMilestone 
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
        : isAllCompleted 
          ? 'bg-indigo-500 border-indigo-400' 
          : 'border-gray-700'
    }`}>
      <span className="font-medium">{quote}</span>
    </div>
  );
};