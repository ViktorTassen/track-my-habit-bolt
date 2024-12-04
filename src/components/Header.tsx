import React from 'react';

interface HeaderProps {
  onOpenCharacterSelect?: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHelp,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
  <h1 className="text-2xl sm:text-2xl font-bold text-blue-100 font-quicksand order-1 text-center sm:text-left w-full sm:w-auto">
    Track My Habit
  </h1>
      
      <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-3 ml-auto hidden md:flex">
        {/* Chrome Extension Link */}
        <a 
          href="https://chrome.google.com/webstore/detail/your-extension-id"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
          aria-label="Get Track My Habit on Chrome"
        >
          <img 
            src="/assets/available.png" 
            alt="Available in Chrome" 
            className="h-10 rounded-full"
          />
        </a>
        
        {/* Help Button */}
        <button
          onClick={onOpenHelp}
          className="w-10 h-10 flex items-center justify-center text-indigo-400 bg-indigo-900/30 rounded-full hover:bg-indigo-900/50 transition-colors"
          aria-label="How Points Work"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
