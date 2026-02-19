// RA-styled mini player anchored to the bottom of the viewport
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

  if (!track) return null

  return (
    <div
      id="mini-player"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#050507]/95 text-white backdrop-blur"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Track details */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {track.image ? (
              <img
                src={track.image}
                alt={track.title}
                width={56}
                height={56}
                className="h-12 w-12 md:h-14 md:w-14 rounded-xl object-cover shadow-[0_10px_35px_rgba(0,0,0,0.45)]"
                loading="eager"
                decoding="async"
                fetchPriority="low"
              />
            ) : (
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-white/10 border border-white/10" />
            )}
            <div className="min-w-0">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/50 mb-1">Now Playing</p>
              <h3 className="text-sm md:text-base font-semibold truncate">{track.title}</h3>
              <p className="text-xs text-white/60 truncate">{track.author || 'Afropop Worldwide'}</p>
            </div>
          </div>

          {/* Transport controls */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => skip(-15)}
              className="text-white/70 hover:text-accent-v transition"
              aria-label="Skip backward 15 seconds"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>
            <button
              onClick={toggle}
              className="rounded-full bg-white text-black p-2.5 md:p-3 hover:bg-accent-v hover:text-white transition"
              aria-label={isPlaying ? 'Pause' : 'Play'}
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
              className="text-white/70 hover:text-accent-v transition"
              aria-label="Skip forward 15 seconds"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </button>
          </div>

          {/* Desktop progress + utilities */}
          <div className="hidden md:flex items-center gap-3 min-w-[250px]">
            <span className="text-xs font-mono text-white/50 w-10">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={Math.max(0, duration)}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1 w-full bg-white/10 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white"
              style={{ accentColor: '#ff2d55' }}
            />
            <span className="text-xs font-mono text-white/50 w-12 text-right">{formatTime(duration)}</span>
            <div className="flex items-center gap-2 pl-2">
              {['Queue', 'Share', 'Transcript'].map((label) => (
                <button
                  key={label}
                  className="text-white/50 hover:text-white transition text-xs uppercase tracking-[0.35em]"
                  aria-label={label}
                >
                  {label.slice(0, 1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile progress */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-white/50">{formatTime(currentTime)}</span>
            <span className="text-xs font-mono text-white/50">{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(0, duration)}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 w-full bg-white/10 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white"
            style={{ accentColor: '#ff2d55' }}
          />
        </div>
      </div>
    </div>
  )
}

export default MiniPlayer
