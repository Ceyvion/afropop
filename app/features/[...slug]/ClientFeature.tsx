'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useItemById, useEpisodes } from '@/app/lib/use-rss-data'
import { EpisodeCard } from '@/app/components/Cards'
import { usePlayer } from '@/app/components/PlayerProvider'

export default function ClientFeature({ slug }: { slug: string }) {
  const { data, loading, error } = useItemById(slug)
  const episodes = useEpisodes(48)
  const player = usePlayer()

  const shareFeature = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      // @ts-ignore
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

  const related = useMemo(() => {
    if (!data || !episodes?.data?.items) return [] as any[]
    const items = episodes.data.items as any[]
    const cats = new Set((data.categories || []).map((c: string) => c.toLowerCase()))
    const region = (data.region || '').toLowerCase()
    const genre = (data.genre || '').toLowerCase()

    const scored = items
      .filter((it) => it.id !== data.id)
      .map((it) => {
        let score = 0
        const icats = new Set((it.categories || []).map((c: string) => c.toLowerCase()))
        icats.forEach((c) => {
          if (cats.has(c)) score += 2
        })
        if (region && (it.region || '').toLowerCase() === region) score += 1.5
        if (genre && (it.genre || '').toLowerCase() === genre) score += 1.5
        // optionally, add additional heuristics here (kept simple)
        return { it, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ it }) => it)

    return scored
  }, [data, episodes?.data?.items])

  const prettyReadTime = (d?: number | string | null) => {
    if (!d && d !== 0) return '8 min read'
    const n = typeof d === 'string' ? parseInt(d) : d
    if (!n || Number.isNaN(n)) return '8 min read'
    return `${Math.max(1, Math.round((n as number) / 60))} min read`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-page">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 sm:h-80 w-full bg-gray-200 rounded-2xl mb-8" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                <div className="h-96 bg-white rounded-xl shadow-sm" />
              </div>
              <div className="lg:col-span-4 space-y-4">
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
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Error Loading Feature</h2>
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
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Feature Not Found</h2>
          <p className="text-gray-600 mb-6">The feature you’re looking for could not be found.</p>
          <Link 
            href="/features"
            className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
          >
            Browse All Features
          </Link>
        </div>
      </div>
    )
  }

  const published = new Date(data.pubDate || data.isoDate || '').toLocaleDateString()

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-accent-v hover:opacity-90 transition-colors duration-200">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/features" className="text-accent-v hover:opacity-90 transition-colors duration-200">Features</Link>
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
                <span className="opacity-50">•</span>
                <span>{prettyReadTime(data.duration)}</span>
                {data.region && (<><span className="opacity-50">•</span><span>{data.region}</span></>)}
                {data.genre && (<><span className="opacity-50">•</span><span>{data.genre}</span></>)}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button onClick={shareFeature} className="px-4 py-2 rounded-full bg-white text-ink hover:bg-gray-50 text-sm font-bold">Share</button>
                {data.link && (
                  <a href={data.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 text-sm font-bold">Open Original</a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Article Content */}
            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <div className="prose prose-lg max-w-none text-gray-700 dark:prose-invert" dangerouslySetInnerHTML={{ __html: data.content || data.description || 'No content available.' }} />
            </div>

            {/* Related Episodes */}
            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-body mb-4">Related Episodes</h2>
              {episodes.loading ? (
                <div className="text-gray-500 text-sm">Loading related episodes…</div>
              ) : related.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {related.map((ep: any, idx: number) => (
                    <Link key={ep.id} href={`/episodes/${String(ep.id).split('/').map(encodeURIComponent).join('/')}`} className="block">
                      <EpisodeCard
                        title={ep.title}
                        region={ep.region || 'Africa'}
                        genre={ep.genre || 'World Music'}
                        duration={ep.duration || '45 min'}
                        image={ep.image}
                        categories={ep.categories}
                        onPlay={() => {
                          if (ep.audioUrl) {
                            player.play({ id: ep.id, title: ep.title, author: ep.author, image: ep.image, audioUrl: ep.audioUrl, duration: ep.duration })
                          }
                        }}
                        density="compact"
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No related episodes found.</div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Metadata</h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between"><dt className="text-muted">Published</dt><dd className="text-body font-medium">{published}</dd></div>
                {data.region && <div className="flex justify-between"><dt className="text-muted">Region</dt><dd className="text-body font-medium">{data.region}</dd></div>}
                {data.genre && <div className="flex justify-between"><dt className="text-muted">Genre</dt><dd className="text-body font-medium">{data.genre}</dd></div>}
                {Array.isArray(data.categories) && data.categories.length > 0 && (
                  <div>
                    <dt className="text-muted mb-1">Categories</dt>
                    <dd className="flex flex-wrap gap-2">
                      {data.categories.map((c: string, i: number) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium chip-soft">{c}</span>
                      ))}
                    </dd>
                  </div>
                )}
                {data.link && (
                  <div className="pt-2">
                    <a href={data.link} target="_blank" rel="noopener noreferrer" className="text-accent-v hover:bg-accent-strong-v/10 rounded px-1">Original Link</a>
                  </div>
                )}
              </dl>
            </div>

            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={shareFeature} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-ink hover:bg-gray-50 text-sm font-bold">Share</button>
                {data.link && (
                  <a href={data.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-md border border-gray-300 bg-white text-ink hover:bg-gray-50 text-sm font-bold">Open Original</a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
