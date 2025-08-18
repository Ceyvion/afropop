'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export type Track = {
  id: string
  title: string
  author?: string
  image?: string | null
  audioUrl: string
  duration?: number | string | null
}

type PlayerContextType = {
  track: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  play: (t: Track) => void
  toggle: () => void
  seek: (time: number) => void
  skip: (delta: number) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [track, setTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(Math.floor(audioRef.current!.currentTime))
      })
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(Math.floor(audioRef.current!.duration || 0))
      })
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })
      audioRef.current.addEventListener('play', () => setIsPlaying(true))
      audioRef.current.addEventListener('pause', () => setIsPlaying(false))
    }
  }, [])

  const play = (t: Track) => {
    setTrack(t)
    if (!audioRef.current) return
    try {
      audioRef.current.src = t.audioUrl
      audioRef.current.play().catch(() => {/* autoplay blocked */})
    } catch {}
  }

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().catch(() => {})
    else a.pause()
  }

  const seek = (time: number) => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = Math.max(0, Math.min(time, a.duration || time))
    setCurrentTime(Math.floor(a.currentTime))
  }

  const skip = (delta: number) => seek(currentTime + delta)

  return (
    <PlayerContext.Provider value={{ track, isPlaying, currentTime, duration, play, toggle, seek, skip }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}

