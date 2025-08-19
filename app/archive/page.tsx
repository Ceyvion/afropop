// Archive page with RSS feed integration
"use client"

import React, { useMemo, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import FilterRail from '@/app/components/FilterRail'
import { EpisodeCard, FeatureCard, EventCard } from '@/app/components/Cards'
import { usePlayer } from '@/app/components/PlayerProvider'
import { useRSSFeed } from '@/app/lib/use-rss-data'

export default function Archive() {
  const { data: feedData, loading: feedLoading, error: feedError } = useRSSFeed()
  const player = usePlayer()
  const [filteredResults, setFilteredResults] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [visibleCount, setVisibleCount] = useState(12)
  const [facetFilters, setFacetFilters] = useState<Record<string, string[]>>({})
  const [groupMode, setGroupMode] = useState<'none' | 'year' | 'decade'>('none')
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Derived filters for API from facet filters + active type
  const apiFilters = useMemo(() => {
    const filters: any = {}
    if (activeFilter !== 'all') filters.type = activeFilter
    const regionSel = facetFilters['Region'] || []
    const genreSel = facetFilters['Genre'] || []
    if (regionSel.length > 0) {
      const r0 = regionSel[0]
      // Prefer full region label for robust includes() matching
      const regionMap: Record<string, string> = {
        'West Africa': 'west africa',
        'East Africa': 'east africa',
        'Southern Africa': 'southern africa',
        'North Africa': 'north africa',
      }
      filters.region = (regionMap[r0] || r0).toLowerCase()
    }
    if (genreSel.length > 0) filters.genre = genreSel[0]

    const eras = facetFilters['Era/Decade'] || []
    if (eras.length > 0) {
      // Compute min/max date range from selected decades
      const ranges = eras.map(dec => {
        const decadeStart = parseInt(dec) || parseInt(dec.replace(/s$/, ''))
        if (!isNaN(decadeStart)) {
          const from = `${decadeStart}-01-01`
          const to = `${decadeStart + 9}-12-31`
          return { from, to }
        }
        return null
      }).filter(Boolean) as { from: string, to: string }[]
      if (ranges.length > 0) {
        const from = ranges.reduce((min, r) => r.from < min ? r.from : min, ranges[0].from)
        const to = ranges.reduce((max, r) => r.to > max ? r.to : max, ranges[0].to)
        filters.dateFrom = from
        filters.dateTo = to
      }
    }
    return filters
  }, [facetFilters, activeFilter])

  // Source is the full feed; we filter client-side for responsiveness
  const sourceItems = useMemo(() => {
    return feedData?.items || []
  }, [feedData])

  const loading = feedLoading
  const error = feedError

  // Filter results based on active filter, query, and facet filters
  useEffect(() => {
    if (!sourceItems) return

    let items = [...sourceItems]

    // Filter by active type
    if (activeFilter !== 'all') {
      items = items.filter((item: any) => item.type?.toLowerCase() === activeFilter)
    }

    // Apply facet filters: region, genre, and era/decade date range
    const regionSel = (facetFilters['Region'] || []).map(r => r.toLowerCase())
    const genreSel = (facetFilters['Genre'] || []).map(g => g.toLowerCase())
    const eras = facetFilters['Era/Decade'] || []

    if (regionSel.length > 0) {
      const synonyms: Record<string, string[]> = {
        'west africa': ['west africa', 'west', 'western'],
        'east africa': ['east africa', 'east', 'eastern'],
        'southern africa': ['southern africa', 'south', 'southern'],
        'north africa': ['north africa', 'north', 'northern'],
      }
      const targets = regionSel.flatMap(label => {
        const key = label.toLowerCase()
        // Map canonical labels; fall back to the label itself
        return synonyms[key] || [key]
      })
      items = items.filter((item: any) => {
        const r = (item.region || '').toLowerCase()
        return targets.some(t => r.includes(t))
      })
    }

    if (genreSel.length > 0) {
      items = items.filter((item: any) => {
        const g = (item.genre || '').toLowerCase()
        return genreSel.some(t => g.includes(t))
      })
    }

    if (eras.length > 0) {
      const ranges = eras.map(dec => {
        const decadeStart = parseInt(dec) || parseInt(dec.replace(/s$/, ''))
        if (!isNaN(decadeStart)) {
          const from = new Date(`${decadeStart}-01-01`).getTime()
          const to = new Date(`${decadeStart + 9}-12-31`).getTime()
          return { from, to }
        }
        return null
      }).filter(Boolean) as { from: number, to: number }[]
      if (ranges.length > 0) {
        items = items.filter((item: any) => {
          const t = new Date(item.isoDate || item.pubDate || 0).getTime()
          return ranges.some(r => t >= r.from && t <= r.to)
        })
      }
    }

    // Simple client-side search across title and description
    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter((item: any) =>
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q)
      )
    }

    // Sort by date
    items.sort((a: any, b: any) => {
      const da = new Date(a.isoDate || a.pubDate || 0).getTime()
      const db = new Date(b.isoDate || b.pubDate || 0).getTime()
      return sortOrder === 'newest' ? db - da : da - db
    })

    setFilteredResults(items)
    setVisibleCount(12)
  }, [sourceItems, activeFilter, query, sortOrder, facetFilters])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-v"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Error Loading Archive</h2>
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

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Filter Rail (sticky with own scroll; applies on button click) */}
          <FilterRail initialSelected={facetFilters} onApply={(filters) => setFacetFilters(filters)} />
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-ink mb-4 sm:mb-0">Archive</h1>
              
              <div className="flex flex-wrap gap-3">
                <select 
                  className="text-sm border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none transition-colors duration-200"
                  style={{ outlineColor: 'var(--accent)' } as any}
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  <option value="all">All Content</option>
                  <option value="episode">Episodes</option>
                  <option value="feature">Features</option>
                  <option value="event">Events</option>
                </select>
                <select
                  className="text-sm border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none transition-colors duration-200"
                  style={{ outlineColor: 'var(--accent)' } as any}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
                <select
                  className="text-sm border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none transition-colors duration-200"
                  style={{ outlineColor: 'var(--accent)' } as any}
                  value={groupMode}
                  onChange={(e) => setGroupMode(e.target.value as 'none' | 'year' | 'decade')}
                >
                  <option value="none">No grouping</option>
                  <option value="year">Group by year</option>
                  <option value="decade">Group by decade</option>
                </select>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search archive..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none transition-colors duration-200"
                    style={{ outlineColor: 'var(--accent)' } as any}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Results count */}
            <p className="text-gray-600 mb-6">
              Showing {Math.min(filteredResults.length, visibleCount)} of {filteredResults.length} items
            </p>
            
            {/* Results */}
            {(() => {
              const visibleItems = filteredResults.slice(0, visibleCount)
              const renderItem = (item: any, index: number) => {
                if (item.type === 'Episode') {
                  return (
                    <Link
                      key={item.id}
                      href={`/episodes/${String(item.id).split('/').map(encodeURIComponent).join('/')}`}
                      className="block"
                    >
                      <div className={`fade-in delay-${(index % 6 + 1) * 100}`}>
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
                      <div className={`fade-in delay-${(index % 6 + 1) * 100}`}>
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
                    <div key={item.id} className={`fade-in delay-${(index % 6 + 1) * 100}`}>
                      <EventCard
                        title={item.title}
                        date={formatDate(item.pubDate)}
                        city="Various Locations"
                        venue="Afropop Event"
                        image={item.image}
                        density="compact"
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
                    <div className={`fade-in delay-${(index % 6 + 1) * 100}`}>
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
                // Numeric compare based on leading number
                const na = parseInt(a)
                const nb = parseInt(b)
                return sortOrder === 'newest' ? nb - na : na - nb
              })

              return (
                <div className="space-y-12">
                  {groupKeys.map(key => (
                    <div key={key}>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">{key}</h3>
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
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setVisibleCount(c => c + 12)}
                  className="px-8 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
