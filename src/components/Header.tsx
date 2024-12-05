import React from 'react';

interface HeaderProps {
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp }) => {
  const isTrackMyHabit = window.location.hostname === 'trackmyhabit.com';

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <h1 className="text-2xl font-bold text-blue-100 font-quicksand text-center flex-1">
          Track My Habit
        </h1>
        <button
          onClick={onOpenHelp}
          className="w-10 h-10 flex items-center justify-center text-indigo-400 bg-indigo-900/30 rounded-full hover:bg-indigo-900/50 transition-colors ml-2 sm:ml-0"
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

      {isTrackMyHabit && (
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <a
            href="https://chrome.google.com/webstore/detail/your-extension-id"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center"
            aria-label="Get Track My Habit on Chrome"
          >
            <img
              src="/assets/available.png"
              alt="Available in Chrome"
              className="h-10 rounded-full"
            />
          </a>
        </div>
      )}
    </header>
  );
};
