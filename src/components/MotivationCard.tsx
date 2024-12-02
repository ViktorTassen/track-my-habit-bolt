import React, { useState } from 'react'

export const MotivationCard: React.FC = () => {
  const [promise, setPromise] = useState(() => {
    const saved = localStorage.getItem('user-promise')
    return saved || "I commit to building better habits because they shape who I become. Every small action counts towards my greater goals."
  })
  const [isEditing, setIsEditing] = useState(false)

  const handlePromiseChange = (newPromise: string) => {
    const trimmedPromise = newPromise.slice(0, 180)
    setPromise(trimmedPromise)
    localStorage.setItem('user-promise', trimmedPromise)
    setIsEditing(false)
  }

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl relative overflow-hidden flex flex-col min-h-[140px]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-0 w-full h-8 bg-white/5 transform -skew-y-6" />
        <div className="absolute bottom-0 right-0 w-full h-8 bg-black/5 transform skew-y-6" />
      </div>

      <div className="relative p-3 flex flex-col h-full">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-medium text-white">My Motivation</h3>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-indigo-200 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
              />
            </svg>
          </button>
        </div>

        {isEditing ? (
          <div className="flex-1 flex flex-col">
            <textarea
              value={promise}
              onChange={(e) => setPromise(e.target.value)}
              maxLength={180}
              className="flex-1 p-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200/70 focus:ring-2 focus:ring-white/20 focus:border-transparent resize-none"
              placeholder="Write your motivation here..."
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-indigo-200/70">
                {promise.length}/180
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-0.5 text-xs text-indigo-200 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePromiseChange(promise)}
                  className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex-1 flex items-center">
            <div className="absolute top-0 left-0 text-xl text-white/20 transform -translate-y-1 -translate-x-1">
              "
            </div>
            <p className="text-sm text-indigo-100 leading-relaxed px-3">
              {promise}
            </p>
            <div className="absolute bottom-0 right-0 text-xl text-white/20 transform translate-y-1 translate-x-1">
              "
            </div>
          </div>
        )}
      </div>
    </div>
  )
}