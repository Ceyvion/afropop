// Episode detail page with RSS feed integration
'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useItemById } from '@/app/lib/use-rss-data'

export default function EpisodeDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Resolve the params promise
  const resolvedParams = React.use(params);
  // Get the episode data from the RSS feed
  const { data, loading, error } = useItemById(resolvedParams.slug)
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // Extract audio URL from the enclosure or media content
  const audioUrl = data?.enclosure?.url || data?.mediaContent?.$?.url || null

  // Update time as audio plays
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const updateProgress = () => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
    }
    
    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', updateProgress)
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', updateProgress)
      audio.removeEventListener('play', () => setIsPlaying(true))
      audio.removeEventListener('pause', () => setIsPlaying(false))
    }
  }, [data])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(e => console.error('Error playing audio:', e))
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    
    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-2"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Error Loading Episode</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Episode Not Found</h2>
          <p className="text-gray-600 mb-6">The episode you're looking for could not be found.</p>
          <Link 
            href="/episodes"
            className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
          >
            Browse All Episodes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      {/* Hidden audio element */}
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl}
          preload="metadata"
        />
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-accent-2 hover:text-accent transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/episodes" className="text-accent-2 hover:text-accent transition-colors duration-200">
                Episodes
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500 truncate max-w-xs">
              {data.title}
            </li>
          </ol>
        </nav>
        
        {/* Hero */}
        <div className="mb-10 fade-in">
          {data.image ? (
            <img 
              src={data.image} 
              alt={data.title} 
              className="aspect-video rounded-xl mb-8 object-cover w-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.parentElement!.innerHTML = '<div class="bg-gray-200 border-2 border-dashed aspect-video rounded-xl mb-8"></div>';
              }}
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed aspect-video rounded-xl mb-8" />
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-sm text-gray-600">Hosted by {data.author || 'Afropop Worldwide'}</span>
            <span className="text-sm text-gray-600">{data.duration || '45 min'}</span>
            {data.region && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                {data.region}
              </span>
            )}
            {data.genre && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                {data.genre}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {audioUrl ? (
              <button 
                onClick={togglePlay}
                className="btn-primary bg-accent-2 text-white hover:bg-accent flex items-center"
              >
                {isPlaying ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause Episode
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Play Episode
                  </>
                )}
              </button>
            ) : (
              <button className="btn-primary bg-accent-2 text-white hover:bg-accent opacity-50 cursor-not-allowed">
                Audio Not Available
              </button>
            )}
            <button className="btn-secondary border-gray-300 text-ink bg-white hover:bg-gray-50">
              Share
            </button>
            <button className="btn-secondary border-gray-300 text-ink bg-white hover:bg-gray-50">
              Download
            </button>
          </div>
        </div>
        
        {/* Audio Player Progress Bar */}
        {audioUrl && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm fade-in">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-center mt-4">
              <button 
                onClick={togglePlay}
                className="bg-ink text-white rounded-full p-3 hover:bg-accent-2 transition-colors duration-200"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Pinned Player */}
        <div className="bg-white rounded-xl p-6 mb-10 shadow-sm fade-in delay-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {data.image ? (
                <img 
                  src={data.image} 
                  alt={data.title} 
                  className="rounded-xl w-16 h-16 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.parentElement!.innerHTML = '<div class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16"></div>';
                  }}
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              )}
              <div>
                <h3 className="font-bold text-ink">{data.title}</h3>
                <p className="text-sm text-gray-600">{data.author || 'Afropop Worldwide'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-ink hover:text-accent-2 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>
              <button 
                onClick={togglePlay}
                className="bg-ink text-white rounded-full p-2 hover:bg-accent-2 transition-colors duration-200"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              <button className="text-ink hover:text-accent-2 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="bg-white rounded-xl p-8 mb-10 shadow-sm fade-in delay-200">
          <h2 className="text-2xl font-bold text-ink mb-6">Episode Description</h2>
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: data.content || data.description || 'No description available.' }}
          />
        </div>
        
        {/* Transcript */}
        <div className="bg-white rounded-xl p-8 mb-10 shadow-sm fade-in delay-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ink">Transcript</h2>
            <button className="text-sm text-accent-2 hover:text-accent transition-colors duration-200">
              Download MP3
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              Transcript content would appear here...
            </p>
            <button className="text-sm text-accent-2 hover:text-accent font-medium transition-colors duration-200">
              View full transcript
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}