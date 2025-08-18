// Mini Player component with refined design

'use client'

import React from 'react'
import { usePlayer } from '@/app/components/PlayerProvider'

const MiniPlayer = () => {
  const { track, isPlaying, currentTime, duration, toggle, seek, skip } = usePlayer()

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00'
    const secs = Math.max(0, Math.floor(seconds))
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Episode info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {track?.image ? (
              <img src={track.image} alt={track.title} className="rounded-xl w-12 h-12 md:w-14 md:h-14 object-cover" />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 md:w-14 md:h-14" />
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-ink truncate">{track?.title || 'No episode selected'}</h3>
              <p className="text-xs text-gray-500 truncate">{track?.author || ''}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button 
              onClick={() => skip(-15)}
              className="text-ink hover:text-accent-2 transition-colors duration-200"
              aria-label="Skip backward 15 seconds"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>
            
            <button 
              onClick={toggle}
              className="bg-ink text-white rounded-full p-2 md:p-3 hover:bg-accent-2 transition-colors duration-200"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={() => skip(15)}
              className="text-ink hover:text-accent-2 transition-colors duration-200"
              aria-label="Skip forward 15 seconds"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </button>
          </div>

          {/* Time and progress (desktop) */}
          <div className="hidden md:flex items-center space-x-3 ml-4">
            <span className="text-xs text-gray-500 font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={Math.max(0, duration)}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-2"
            />
            <span className="text-xs text-gray-500 font-mono">{formatTime(duration)}</span>
          </div>

          {/* More controls (queue, share, transcript) - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 ml-4">
            <button className="text-ink hover:text-accent-2 transition-colors duration-200" aria-label="Queue">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button className="text-ink hover:text-accent-2 transition-colors duration-200" aria-label="Share">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button className="text-ink hover:text-accent-2 transition-colors duration-200" aria-label="Transcript">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress bar for mobile */}
        <div className="mt-2 md:hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 font-mono">{formatTime(currentTime)}</span>
            <span className="text-xs text-gray-500 font-mono">{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(0, duration)}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-2"
          />
        </div>
      </div>
    </div>
  )
}

export default MiniPlayer
