'use client'

import React from 'react'
import Link from 'next/link'
import { useItemById } from '@/app/lib/use-rss-data'
import { usePlayer } from '@/app/components/PlayerProvider'

const formatTime = (value?: number | null) => {
  const safe = Math.max(0, Math.floor(value || 0))
  const minutes = Math.floor(safe / 60)
  const seconds = String(safe % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

const prettyDuration = (value?: number | string | null) => {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'string') return value
  const hours = Math.floor(value / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  const seconds = Math.floor(value % 60)
  if (hours) return `${hours}h ${minutes}m`
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

const stripHtml = (value?: string | null) => {
  if (!value) return ''
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

const getSummary = (data?: any) => {
  if (!data) return ''
  return data.contentSnippet || data.summary || stripHtml(data.description) || ''
}

const buildSummaryExcerpt = (value?: string) => {
  if (!value) return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  const sentences = trimmed.match(/[^.!?]+[.!?]?/g) || []
  const primary = sentences.slice(0, 2).join(' ').trim() || trimmed
  let excerpt = primary
  let truncated = primary.length < trimmed.length

  if (excerpt.length > 420) {
    excerpt = excerpt.slice(0, 420).trim()
    truncated = true
  }

  return truncated ? `${excerpt}…` : excerpt
}

export default function ClientEpisode({ slug }: { slug: string }) {
  const { data, loading, error } = useItemById(slug)
  const { track, isPlaying, currentTime, duration, play, toggle, seek, skip } = usePlayer()

  const audioUrl = data?.audioUrl || null
  const isCurrent = track?.id === data?.id
  const summary = getSummary(data)
  const summaryExcerpt = buildSummaryExcerpt(summary)
  const publishedSource = data?.pubDate || data?.isoDate || ''
  const publishedDate = publishedSource ? new Date(publishedSource) : null
  const hasPublished = !!(publishedDate && !Number.isNaN(publishedDate.getTime()))
  const publishedLong = hasPublished
    ? publishedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null
  const publishedShort = hasPublished
    ? publishedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const durationLabel = prettyDuration(
    typeof data?.duration === 'number'
      ? data.duration
      : typeof data?.duration === 'string'
        ? data.duration
        : duration
  )
  const numericDuration =
    typeof data?.duration === 'number'
      ? data.duration
      : typeof duration === 'number'
        ? duration
        : undefined
  const sliderMax = Math.max(numericDuration || 0, 1)
  const sliderValue = Math.min(isCurrent ? currentTime : 0, sliderMax)
  const categories = Array.isArray(data?.categories) ? data?.categories.filter(Boolean) : []

  const shareEpisode = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (!url) return
    try {
      // @ts-ignore - not always typed
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

  const handlePrimaryAction = () => {
    if (!audioUrl) return
    if (isCurrent) {
      toggle()
    } else {
      play({
        id: data!.id,
        title: data!.title,
        author: data!.author,
        image: data!.image,
        audioUrl,
        duration: data!.duration,
      })
    }
  }

  const handleSeek = (value: number) => {
    if (!audioUrl || !isCurrent) return
    seek(value)
  }

  const handleSkip = (value: number) => {
    if (!audioUrl || !isCurrent) return
    skip(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-page text-body">
        <div className="page-shell py-14 space-y-8">
          <div className="space-y-2">
            <div className="h-4 w-28 rounded-full bg-white/10 animate-pulse" />
            <div className="h-8 w-64 rounded-full bg-white/10 animate-pulse" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-96 rounded-[32px] bg-white/5 animate-pulse" />
            <div className="h-96 rounded-[32px] bg-white/5 animate-pulse" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-56 rounded-3xl bg-white/5 animate-pulse" />
              <div className="h-48 rounded-3xl bg-white/5 animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-48 rounded-3xl bg-white/5 animate-pulse" />
              <div className="h-32 rounded-3xl bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page text-body flex items-center justify-center px-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 px-8 py-10 text-center space-y-4 max-w-md">
          <p className="page-kicker">Playback issue</p>
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight font-light">Error loading episode</h2>
          <p className="text-muted">{String(error)}</p>
          <button onClick={() => window.location.reload()} className="btn-outline-ra mx-auto">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-page text-body flex items-center justify-center px-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 px-8 py-10 text-center space-y-4 max-w-md">
          <p className="page-kicker">Episode detail</p>
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight font-light">Episode not found</h2>
          <p className="text-muted">The episode you are looking for might have moved or no longer exists.</p>
          <Link href="/episodes" className="btn-outline-ra mx-auto">
            Browse Episodes
          </Link>
        </div>
      </div>
    )
  }

  const detailItems = [
    { label: 'Published', value: publishedLong },
    { label: 'Duration', value: durationLabel },
    { label: 'Region', value: data.region },
    { label: 'Genre', value: data.genre },
    { label: 'Author', value: data.author || 'Afropop Worldwide' },
  ].filter((item) => item.value)

  return (
    <div className="min-h-screen bg-page text-body">
      <div className="page-shell py-12 space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-white/40">Podcast detail</p>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Afropop Worldwide</p>
          </div>
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.35em] uppercase text-white/60 hover:text-accent-v transition-colors"
          >
            <span className="hidden sm:inline">Back to episodes</span>
            <span className="sm:hidden">Episodes</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </div>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)] items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[0.65rem] uppercase tracking-[0.45em] text-white/40">
                Broadcast {publishedShort || '—'}
              </p>
              <h1 className="font-display-condensed text-[clamp(2.75rem,6vw,4.8rem)] font-light uppercase tracking-[0.06em] leading-[0.9] text-white">
                {data.title}
              </h1>
            </div>
            {summaryExcerpt && (
              <p className="text-base md:text-lg leading-relaxed text-white/75 max-w-3xl">
                {summaryExcerpt}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-[0.65rem] uppercase tracking-[0.35em] text-white/55">
              {durationLabel && <span>{durationLabel}</span>}
              {data.region && <span>{data.region}</span>}
              {data.genre && <span>{data.genre}</span>}
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 4).map((category: string, index: number) => (
                  <span
                    key={`${category}-${index}`}
                    className="px-3 py-1 rounded-full border border-white/15 text-[0.6rem] uppercase tracking-[0.35em] text-white/65"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {data.image && (
              <figure className="rounded-[28px] overflow-hidden border border-white/10 bg-white/5">
                <img
                  src={data.image}
                  alt={data.title}
                  width={1200}
                  height={640}
                  className="h-64 w-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.onerror = null
                    target.style.display = 'none'
                  }}
                />
              </figure>
            )}

            <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6 space-y-5 backdrop-blur-sm">
              <div className="space-y-1">
                <p className="text-[0.55rem] uppercase tracking-[0.55em] text-white/35">Now playing</p>
                <p className="text-xl font-medium text-white leading-snug">{data.title}</p>
                <p className="text-sm text-white/60">{data.author || 'Afropop Worldwide'}</p>
              </div>

              {audioUrl ? (
                <div className="space-y-4">
                  <button
                    onClick={handlePrimaryAction}
                    className="w-full rounded-full border border-white/15 bg-transparent px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-white transition-colors hover:border-white/45"
                  >
                    {isCurrent && isPlaying ? 'Pause' : 'Play Episode'}
                  </button>
                  <div className="flex items-center justify-between gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-white/60">
                    <button
                      onClick={() => handleSkip(-15)}
                      disabled={!isCurrent}
                      className="flex-1 rounded-full border border-white/15 px-4 py-2 hover:border-white/35 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      −15s
                    </button>
                    <button
                      onClick={() => handleSkip(30)}
                      disabled={!isCurrent}
                      className="flex-1 rounded-full border border-white/15 px-4 py-2 hover:border-white/35 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +30s
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[0.55rem] font-mono uppercase tracking-[0.35em] text-white/45 mb-2">
                      <span>{formatTime(sliderValue)}</span>
                      <span>{formatTime(isCurrent ? duration : numericDuration)}</span>
                    </div>
                    <input
                      aria-label="Seek within episode"
                      type="range"
                      min={0}
                      max={sliderMax}
                      value={sliderValue}
                      disabled={!isCurrent}
                      onChange={(event) => handleSeek(Number(event.target.value))}
                      className="w-full h-1.5 rounded-full cursor-pointer accent-[var(--accent)] disabled:cursor-not-allowed bg-white/20"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 p-4 text-center text-sm text-white/60">
                  Audio not available for this episode.
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={shareEpisode}
                  className="rounded-full border border-white/15 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/70 hover:text-white"
                >
                  Share
                </button>
                {audioUrl && (
                  <a
                    href={audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/70 hover:text-white text-center"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section className="rounded-[32px] border border-white/10 p-8 space-y-4 bg-white/[0.02]">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.45em] text-white/40">
                <span>Episode overview</span>
                {audioUrl && <span>Deep listen</span>}
              </div>
              <div
                className="text-base leading-relaxed text-white/80 space-y-4"
                dangerouslySetInnerHTML={{
                  __html: data.content || data.description || 'No description available.',
                }}
              />
            </section>

            <section className="rounded-[32px] border border-white/10 p-8 space-y-4">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.45em] text-white/40">
                <span>Transcript</span>
                {audioUrl && (
                  <a
                    href={audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.65rem] uppercase tracking-[0.4em] text-accent-v hover:opacity-80"
                  >
                    Download MP3
                  </a>
                )}
              </div>
              <div className="rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm text-white/70 space-y-2">
                <p>A lightly edited transcript will appear shortly after broadcast.</p>
                <p className="text-white/50">Join the community channel for early production notes and cue sheets.</p>
              </div>
            </section>
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <section className="rounded-[32px] border border-white/10 p-6 space-y-4 bg-white/[0.02]">
              <h3 className="text-[0.65rem] uppercase tracking-[0.45em] text-white/40">Episode facts</h3>
              <dl className="space-y-3 text-sm">
                {detailItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 border-b border-white/5 pb-2 last:border-none last:pb-0">
                    <dt className="text-white/45 uppercase tracking-[0.3em] text-[0.6rem]">{item.label}</dt>
                    <dd className="text-white font-medium text-right">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {categories.length > 4 && (
              <section className="rounded-[32px] border border-white/10 p-6 space-y-3">
                <h3 className="text-[0.65rem] uppercase tracking-[0.45em] text-white/40">Signal tags</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(4).map((category: string, index: number) => (
                    <span
                      key={`meta-${category}-${index}`}
                      className="px-3 py-1 rounded-full border border-white/15 text-[0.6rem] uppercase tracking-[0.35em] text-white/65"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {data.link && (
              <section className="rounded-[32px] border border-white/10 p-6 space-y-3">
                <h3 className="text-[0.65rem] uppercase tracking-[0.45em] text-white/40">Original post</h3>
                <p className="text-sm text-white/65">
                  Visit the full program notes, playlists, and producer commentary on our primary feed.
                </p>
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-ra w-full text-center"
                >
                  Open Link
                </a>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
