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

export default function ClientEpisode({ slug }: { slug: string }) {
  const { data, loading, error } = useItemById(slug)
  const { track, isPlaying, currentTime, duration, play, toggle, seek, skip } = usePlayer()

  const audioUrl = data?.audioUrl || null
  const isCurrent = track?.id === data?.id
  const summary = getSummary(data)
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
        <div className="ra-panel text-center space-y-4 max-w-md">
          <p className="page-kicker">Playback issue</p>
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight">Error loading episode</h2>
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
        <div className="ra-panel text-center space-y-4 max-w-md">
          <p className="page-kicker">Episode detail</p>
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight">Episode not found</h2>
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
      <div className="page-shell py-12 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="page-kicker">Podcast detail</p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Afropop Worldwide</p>
          </div>
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.35em] uppercase text-white/70 hover:text-accent-v transition-colors"
          >
            <span className="hidden sm:inline">Back to episodes</span>
            <span className="sm:hidden">Episodes</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14m-6-6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="relative overflow-hidden rounded-[32px] border border-white/5 bg-elevated min-h-[380px] lg:col-span-2">
            {data.image ? (
              <img
                src={data.image}
                alt={data.title}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  target.style.display = 'none'
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/10" />
            <div className="relative h-full p-6 md:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
                  <span className="meta-pill">Broadcast</span>
                  {publishedShort && <span className="meta-pill text-white/60">{publishedShort}</span>}
                  {data.region && <span className="ra-chip">{data.region}</span>}
                  {data.genre && <span className="ra-chip">{data.genre}</span>}
                </div>
                <h1 className="page-title text-4xl md:text-5xl text-white leading-[0.95]">
                  {data.title}
                </h1>
                {summary && (
                  <p className="text-white/75 text-base md:text-lg max-w-3xl leading-relaxed">
                    {summary}
                  </p>
                )}
              </div>
              {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category: string, index: number) => (
                    <span key={`${category}-${index}`} className="ra-chip text-xs tracking-[0.2em]">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>

          <aside className="ra-panel ra-panel-strong flex flex-col gap-5 lg:col-span-1">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Now playing</p>
              <p className="text-2xl font-semibold text-white leading-tight">{data.title}</p>
              <p className="text-sm text-white/60">{data.author || 'Afropop Worldwide'}</p>
            </div>

            {audioUrl ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handlePrimaryAction}
                    className="btn-accent flex-1 min-w-[160px] justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isCurrent && isPlaying ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9h2v6H9zm4 0h2v6h-2z" />
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5v14l11-7z" />
                        </svg>
                        Play Episode
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSkip(-15)}
                    disabled={!isCurrent}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -15s
                  </button>
                  <button
                    onClick={() => handleSkip(30)}
                    disabled={!isCurrent}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +30s
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[0.7rem] font-mono uppercase tracking-[0.35em] text-white/60 mb-2">
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
                    className="w-full h-2 rounded-full cursor-pointer accent-[var(--accent)] disabled:cursor-not-allowed bg-white/15"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 p-4 text-center text-sm text-white/60">
                Audio not available for this episode.
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={shareEpisode}
                className="inline-flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 hover:text-white"
              >
                Share
              </button>
              {audioUrl && (
                <a
                  href={audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 hover:text-white"
                >
                  Download
                </a>
              )}
            </div>
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <section className="ra-panel ra-panel-strong space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold uppercase tracking-[0.35em] text-white/80">Episode overview</h2>
                {audioUrl && <span className="meta-pill">Deep listen</span>}
              </div>
              <div
                className="text-base leading-relaxed text-white/80 space-y-4"
                dangerouslySetInnerHTML={{
                  __html: data.content || data.description || 'No description available.',
                }}
              />
            </section>

            <section className="ra-panel space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold uppercase tracking-[0.35em] text-white/70">Transcript</h3>
                {audioUrl && (
                  <a
                    href={audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-v hover:opacity-80"
                  >
                    Download MP3
                  </a>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 space-y-2">
                <p>The full transcript for this broadcast will appear soon.</p>
                <p className="text-white/50">Want early access? Join the community slack for production notes.</p>
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <section className="ra-panel space-y-4">
              <h3 className="text-base font-semibold uppercase tracking-[0.35em] text-white/70">Episode facts</h3>
              <dl className="space-y-3 text-sm">
                {detailItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 border-b border-white/5 pb-2 last:pb-0 last:border-none">
                    <dt className="text-white/50 uppercase tracking-[0.3em] text-[0.65rem]">{item.label}</dt>
                    <dd className="text-white font-semibold text-right">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {categories && categories.length > 0 && (
              <section className="ra-panel space-y-3">
                <h3 className="text-base font-semibold uppercase tracking-[0.35em] text-white/70">Signal tags</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category: string, index: number) => (
                    <span key={`${category}-${index}`} className="ra-chip text-xs tracking-[0.2em]">
                      {category}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {data.link && (
              <section className="ra-panel ra-panel-strong space-y-3">
                <h3 className="text-base font-semibold uppercase tracking-[0.35em] text-white/70">Original post</h3>
                <p className="text-sm text-white/70">
                  Dive into the producer notes, playlist links, and companion essays on our primary feed.
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
