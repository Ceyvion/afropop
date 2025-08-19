'use client'

import React from 'react'
import Link from 'next/link'
import { useItemById } from '@/app/lib/use-rss-data'
import { usePlayer } from '@/app/components/PlayerProvider'

export default function ClientEpisode({ slug }: { slug: string }) {
  const { data, loading, error } = useItemById(slug)
  const { track, isPlaying, currentTime, duration, play, toggle, seek, skip } = usePlayer()
  const audioUrl = data?.audioUrl || null
  const isCurrent = track?.id === data?.id

  const formatTime = (time: number) => {
    const minutes = Math.floor((time || 0) / 60)
    const seconds = Math.floor((time || 0) % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const prettyDuration = (d?: number | string | null) => {
    if (!d && d !== 0) return '—'
    if (typeof d === 'number') {
      const h = Math.floor(d / 3600)
      const m = Math.floor((d % 3600) / 60)
      const s = Math.floor(d % 60)
      return h ? `${h}h ${m}m` : `${m}m ${s}s`
    }
    // already like 01:23:45 or 42:10
    return d
  }

  const shareEpisode = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      // @ts-ignore - not typed on older TS
      if (navigator?.share) {
        // @ts-ignore
        await navigator.share({ title: data?.title, url })
        return
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard')
    } catch {
      alert('Share this link: ' + url)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 sm:h-80 w-full bg-gray-200 rounded-2xl mb-8" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                <div className="h-44 bg-white rounded-xl shadow-sm" />
                <div className="h-96 bg-white rounded-xl shadow-sm" />
              </div>
              <div className="lg:col-span-4 space-y-4">
                <div className="h-48 bg-white rounded-xl shadow-sm" />
                <div className="h-48 bg-white rounded-xl shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Error Loading Episode</h2>
          <p className="text-gray-600 mb-6">{String(error)}</p>
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

  const published = new Date(data.pubDate || data.isoDate || '').toLocaleDateString()

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-accent-2 hover:text-accent transition-colors duration-200">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/episodes" className="text-accent-2 hover:text-accent transition-colors duration-200">Episodes</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500 truncate max-w-xs">{data.title}</li>
          </ol>
        </nav>

        {/* Hero with gradient overlay */}
        <div className="relative mb-10 overflow-hidden rounded-2xl">
          <div className="aspect-video w-full bg-gray-200">
            {data.image && (
              <img
                src={data.image}
                alt={data.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.onerror = null
                  t.style.display = 'none'
                }}
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <div className="max-w-3xl">
              <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                {data.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-white/85 text-sm">
                <span>By {data.author || 'Afropop Worldwide'}</span>
                <span className="opacity-50">•</span>
                <span>{published}</span>
                {(data.duration || isCurrent) && <><span className="opacity-50">•</span><span>{prettyDuration(typeof data.duration === 'string' ? data.duration : duration)}</span></>}
                {data.region && (<><span className="opacity-50">•</span><span>{data.region}</span></>)}
                {data.genre && (<><span className="opacity-50">•</span><span>{data.genre}</span></>)}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {audioUrl ? (
                  isCurrent && isPlaying ? (
                    <button onClick={toggle} className="inline-flex items-center px-5 py-3 rounded-full bg-accent-2 text-white font-bold shadow hover:bg-accent transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Pause
                    </button>
                  ) : (
                    <button onClick={() => play({ id: data.id, title: data.title, author: data.author, image: data.image, audioUrl, duration: data.duration })} className="inline-flex items-center px-5 py-3 rounded-full bg-accent-2 text-white font-bold shadow hover:bg-accent transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Play Episode
                    </button>
                  )
                ) : (
                  <button className="inline-flex items-center px-5 py-3 rounded-full bg-gray-400 text-white font-bold cursor-not-allowed">
                    Audio Not Available
                  </button>
                )}
                {audioUrl && (
                  <>
                    <button onClick={() => skip(-15)} className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 text-sm">-15s</button>
                    <button onClick={() => skip(30)} className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 text-sm">+30s</button>
                  </>
                )}
                <button onClick={shareEpisode} className="px-4 py-2 rounded-full bg-white text-ink hover:bg-gray-50 text-sm font-bold">Share</button>
                {audioUrl && (
                  <a href={audioUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-white text-ink hover:bg-gray-50 text-sm font-bold">Download</a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Progress (if playing/current) */}
            {audioUrl && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>{formatTime(isCurrent ? currentTime : 0)}</span>
                  <span>{formatTime(isCurrent ? duration : 0)}</span>
                </div>
                <input
                  aria-label="Seek"
                  type="range"
                  min="0"
                  max={(isCurrent ? duration : 0) || 100}
                  value={isCurrent ? currentTime : 0}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ink mb-4">Episode Description</h2>
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: data.content || data.description || 'No description available.' }} />
            </div>

            {/* Transcript placeholder */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-ink">Transcript</h2>
                {audioUrl && (
                  <a href={audioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-2 hover:text-accent font-bold">Download MP3</a>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-5">
                <p className="text-gray-600 mb-3">Transcript content would appear here…</p>
                <button className="text-sm text-accent-2 hover:text-accent font-medium">View full transcript</button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Published</dt><dd className="text-ink font-medium">{published || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Duration</dt><dd className="text-ink font-medium">{prettyDuration(typeof data.duration === 'string' ? data.duration : duration)}</dd></div>
                {data.region && (<div className="flex justify-between"><dt className="text-gray-500">Region</dt><dd className="text-ink font-medium">{data.region}</dd></div>)}
                {data.genre && (<div className="flex justify-between"><dt className="text-gray-500">Genre</dt><dd className="text-ink font-medium">{data.genre}</dd></div>)}
              </dl>
              {data.categories?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-gray-600 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.categories.slice(0, 12).map((c: string, i: number) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.link && (
                <div className="mt-6">
                  <a href={data.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-accent-2 hover:text-accent">
                    Open original link
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14" /></svg>
                  </a>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={shareEpisode} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-ink hover:bg-gray-50 text-sm font-bold">Share</button>
                {audioUrl && (
                  <a href={audioUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-md border border-gray-300 bg-white text-ink hover:bg-gray-50 text-sm font-bold">Download</a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
