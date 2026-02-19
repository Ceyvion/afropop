// Archive page with RSS feed integration
"use client"

import React, { useMemo, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import FilterRail, { ActiveFilterChips } from '@/app/components/FilterRail'
import { EpisodeCard, FeatureCard, EventCard } from '@/app/components/Cards'
import { usePlayer } from '@/app/components/PlayerProvider'
import { useRSSFeed } from '@/app/lib/use-rss-data'
import { useFacets, applyFacetFilters } from '@/app/lib/use-facets'
import { getStaggeredDelayClass } from '@/app/lib/animation-utils'
import { Button } from '@/app/components/Button'

export default function Archive() {
  const { data: feedData, loading: feedLoading, error: feedError } = useRSSFeed()
  const player = usePlayer()
  const [activeFilter, setActiveFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [visibleCount, setVisibleCount] = useState(12)
  const [facetFilters, setFacetFilters] = useState<Record<string, string[]>>({})
  const [groupMode, setGroupMode] = useState<'none' | 'year' | 'decade'>('none')
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // All items from the feed
  const allItems = useMemo(() => feedData?.items || [], [feedData])

  // Items filtered by content type dropdown (before facet filters)
  const typeFilteredItems = useMemo(() => {
    if (activeFilter === 'all') return allItems
    return allItems.filter((item: any) => item.type?.toLowerCase() === activeFilter)
  }, [allItems, activeFilter])

  // Build dynamic facets from the type-filtered set so counts stay accurate
  const facets = useFacets(typeFilteredItems)

  // Apply all facet filters + search + sort via the centralized engine
  const filteredResults = useMemo(() => {
    return applyFacetFilters(typeFilteredItems, facetFilters, query, sortOrder)
  }, [typeFilteredItems, facetFilters, query, sortOrder])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12)
  }, [activeFilter, query, sortOrder, facetFilters])

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return
    if (visibleCount >= filteredResults.length) return
    const el = sentinelRef.current
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting) {
        setVisibleCount(c => Math.min(c + 12, filteredResults.length))
      }
    }, { rootMargin: '200px' })
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [filteredResults.length, visibleCount])

  if (feedLoading) {
    return (
      <div className="min-h-screen bg-page text-white flex items-center justify-center">
        <div className="spinner spinner-lg"></div>
      </div>
    )
  }

  if (feedError) {
    return (
      <div className="min-h-screen bg-page text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="page-kicker">Archive</p>
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight">Error Loading Archive</h2>
          <p className="text-white/60">{String(feedError)}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="md"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const activeCount = Object.values(facetFilters).reduce((n, arr) => n + arr.length, 0)

  return (
    <div className="min-h-screen bg-page text-white">
      <div className="page-shell py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop filter rail */}
          <FilterRail facets={facets} selected={facetFilters} onChange={setFacetFilters} />

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
              <div>
                <p className="page-kicker mb-3">Archive</p>
                <h1 className="page-title text-4xl md:text-5xl leading-none">Every mix, story, and broadcast.</h1>
                <p className="mt-4 text-white/60 max-w-2xl">
                  Filter the Afropop Worldwide archive by region, era, mood, or format. Play episodes instantly or dive into features.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  className="input-dark w-48"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  <option value="all">All Content</option>
                  <option value="episode">Episodes</option>
                  <option value="feature">Features</option>
                  <option value="event">Events</option>
                </select>
                <select
                  className="input-dark w-48"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
                <select
                  className="input-dark w-48"
                  value={groupMode}
                  onChange={(e) => setGroupMode(e.target.value as 'none' | 'year' | 'decade')}
                >
                  <option value="none">No grouping</option>
                  <option value="year">Group by year</option>
                  <option value="decade">Group by decade</option>
                </select>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search archive..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="input-dark pl-10"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            <ActiveFilterChips selected={facetFilters} onChange={setFacetFilters} />

            {/* Results count */}
            <p className="text-white/50 mb-6 text-sm uppercase tracking-[0.35em]">
              Showing {Math.min(filteredResults.length, visibleCount)} of {filteredResults.length} items
              {activeCount > 0 && (
                <span className="text-white/30 ml-2">
                  ({activeCount} filter{activeCount !== 1 ? 's' : ''} active)
                </span>
              )}
            </p>

            {/* Empty state */}
            {filteredResults.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <p className="text-white/40 text-lg">No results match your filters.</p>
                {activeCount > 0 && (
                  <button
                    onClick={() => setFacetFilters({})}
                    className="text-sm text-accent-v hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Results */}
            {filteredResults.length > 0 && (() => {
              const visibleItems = filteredResults.slice(0, visibleCount)
              const renderItem = (item: any, index: number) => {
                if (item.type === 'Episode') {
                  return (
                    <Link
                      key={item.id}
                      href={`/episodes/${String(item.id).split('/').map(encodeURIComponent).join('/')}`}
                      className="block"
                    >
                      <div className={`fade-in ${getStaggeredDelayClass(index, 100, 6)}`}>
                        <EpisodeCard
                          title={item.title}
                          region={item.region || 'Africa'}
                          genre={item.genre || 'World Music'}
                          duration={item.duration || '45 min'}
                          image={item.image}
                          categories={item.categories}
                          density="compact"
                          onPlay={() => {
                            if (item.audioUrl) {
                              player.play({
                                id: item.id,
                                title: item.title,
                                author: item.author,
                                image: item.image,
                                audioUrl: item.audioUrl,
                                duration: item.duration,
                              })
                            }
                          }}
                        />
                      </div>
                    </Link>
                  )
                }

                if (item.type === 'Feature') {
                  return (
                    <Link
                      key={item.id}
                      href={`/features/${String(item.id).split('/').map(encodeURIComponent).join('/')}`}
                      className="block"
                    >
                      <div className={`fade-in ${getStaggeredDelayClass(index, 100, 6)}`}>
                        <FeatureCard
                          title={item.title}
                          dek={item.description}
                          author={item.author || 'Afropop Worldwide'}
                          readTime={item.duration ? `${Math.round(parseInt(item.duration)/60)} min read` : '8 min read'}
                          image={item.image}
                          density="compact"
                        />
                      </div>
                    </Link>
                  )
                }

                if (item.type === 'Event') {
                  return (
                    <div key={item.id} className={`fade-in ${getStaggeredDelayClass(index, 100, 6)}`}>
                      <EventCard
                        title={item.title}
                        date={formatDate(item.pubDate)}
                        city="Various Locations"
                        venue="Afropop Event"
                      />
                    </div>
                  )
                }

                // Default to episode card for unknown types
                return (
                  <Link
                    key={item.id}
                    href={`/episodes/${String(item.id).split('/').map(encodeURIComponent).join('/')}`}
                    className="block"
                  >
                    <div className={`fade-in ${getStaggeredDelayClass(index, 100, 6)}`}>
                      <EpisodeCard
                        title={item.title}
                        region={item.region || 'Africa'}
                        genre={item.genre || 'World Music'}
                        duration={item.duration || '45 min'}
                        image={item.image}
                        categories={item.categories}
                        density="compact"
                        onPlay={() => {
                          if (item.audioUrl) {
                            player.play({
                              id: item.id,
                              title: item.title,
                              author: item.author,
                              image: item.image,
                              audioUrl: item.audioUrl,
                              duration: item.duration,
                            })
                          }
                        }}
                      />
                    </div>
                  </Link>
                )
              }

              if (groupMode === 'none') {
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleItems.map((item, index) => renderItem(item, index))}
                  </div>
                )
              }

              // Group items by year or decade
              const groupsMap = new Map<string, any[]>()
              visibleItems.forEach(item => {
                const d = new Date(item.isoDate || item.pubDate || 0)
                const year = d.getFullYear()
                const key = groupMode === 'year' ? String(year) : `${Math.floor(year / 10) * 10}s`
                const arr = groupsMap.get(key) || []
                arr.push(item)
                groupsMap.set(key, arr)
              })
              const groupKeys = Array.from(groupsMap.keys()).sort((a, b) => {
                const na = parseInt(a)
                const nb = parseInt(b)
                return sortOrder === 'newest' ? nb - na : na - nb
              })

              return (
                <div className="space-y-12">
                  {groupKeys.map(key => (
                    <div key={key}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40 mb-4">{key}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupsMap.get(key)!.map((item, index) => renderItem(item, index))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}

            {/* Infinite scroll sentinel */}
            {visibleCount < filteredResults.length && (
              <div ref={sentinelRef} className="h-10" />
            )}

            {/* Manual Load More fallback */}
            {visibleCount < filteredResults.length && (
              <div className="mt-10 text-center">
                <Button
                  onClick={() => setVisibleCount(c => c + 12)}
                  variant="outline"
                  size="md"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
