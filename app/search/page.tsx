// Search page with RSS feed integration
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { EpisodeCard, FeatureCard, EventCard } from '@/app/components/Cards'
import { useRSSSearch } from '@/app/lib/use-rss-data'

const PAGE_SIZE = 24

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function buildFallbackHref(item: any) {
  if (item?.type === 'Episode' && item?.id) {
    return `/episodes/${String(item.id).split('/').map(encodeURIComponent).join('/')}`
  }
  if (item?.type === 'Feature' && item?.id) {
    return `/features/${String(item.id).split('/').map(encodeURIComponent).join('/')}`
  }
  if (item?.type === 'Event') {
    return `/events?event=${encodeURIComponent(String(item?.id || item?.title || 'event'))}`
  }
  if (item?.type === 'Program') {
    return '/programs'
  }
  return '/archive'
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data, loading, error, search } = useRSSSearch()
  const [activeFilter, setActiveFilter] = useState('all')
  const [page, setPage] = useState(1)

  const executeSearch = (nextPage: number, allowShortQuery = false) => {
    const q = searchQuery.trim()
    if (!q) return
    if (!allowShortQuery && q.length < 2) return
    const filters: any = {}
    if (activeFilter !== 'all') filters.type = activeFilter
    setPage(nextPage)
    search(q, filters, { page: nextPage, pageSize: PAGE_SIZE })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch(1, true)
  }

  // Debounced search when typing (min 2 chars)
  useEffect(() => {
    const q = searchQuery.trim()
    const timer = setTimeout(() => {
      if (q.length >= 2) {
        executeSearch(1)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, activeFilter])

  const paging = useMemo(() => {
    const total = data?.total ?? data?.count ?? 0
    const pageSize = data?.pageSize ?? PAGE_SIZE
    const currentPage = data?.page ?? page
    const pageCount = total > 0 ? Math.ceil(total / pageSize) : 1
    const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const to = total === 0 ? 0 : from + (data?.items?.length || 0) - 1
    return { total, pageSize, currentPage, pageCount, from, to }
  }, [data, page])

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">Search</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-10">
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search episodes, features, events, programs, and contributors…"
                aria-label="Search Afropop content"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none transition-colors duration-200"
                style={{ outlineColor: 'var(--accent)' } as any}
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-4 top-4 text-gray-400 hover:text-accent-v transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['all', 'episode', 'feature', 'event'].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`px-4 py-2 text-sm font-bold rounded-full uppercase tracking-wider transition-colors duration-200 ${
                  activeFilter === filter
                    ? 'bg-accent-v text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setActiveFilter(filter)
                  setPage(1)
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64 fade-in">
            <div className="spinner spinner-xl" aria-label="Loading search results" />
          </div>
        ) : error ? (
          <div className="text-center py-16 fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-red-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-2xl font-bold text-ink mb-4">Search Error</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {error}
            </p>
            <button
              type="button"
              onClick={() => executeSearch(page || 1, true)}
              className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
            >
              Retry Search
            </button>
          </div>
        ) : data?.items?.length > 0 ? (
          <div className="fade-in">
            <p className="text-gray-600 mb-8">
              Showing {paging.from}-{paging.to} of {paging.total} results for “{searchQuery}”
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items.map((item: any) => {
                const href = item.href || buildFallbackHref(item)
                const external = Boolean(item.external || /^https?:\/\//i.test(href))
                let card: React.ReactNode

                if (item.type === 'Episode') {
                  card = (
                    <EpisodeCard
                      key={item.id}
                      title={item.title}
                      region={item.region || 'Africa'}
                      genre={item.genre || 'World Music'}
                      duration={item.duration || '45 min'}
                      density="compact"
                    />
                  )
                } else if (item.type === 'Feature') {
                  card = (
                    <FeatureCard
                      key={item.id}
                      title={item.title}
                      dek={item.description}
                      author={item.author || 'Afropop Worldwide'}
                      readTime={item.duration ? `${Math.round(parseInt(item.duration) / 60)} min read` : '8 min read'}
                      density="compact"
                    />
                  )
                } else if (item.type === 'Event') {
                  card = (
                    <EventCard
                      key={item.id}
                      title={item.title}
                      date={formatDate(item.pubDate)}
                      city="Various Locations"
                      venue="Afropop Event"
                    />
                  )
                } else {
                  card = (
                    <EpisodeCard
                      key={item.id}
                      title={item.title}
                      region={item.region || 'Africa'}
                      genre={item.genre || 'World Music'}
                      duration={item.duration || '45 min'}
                      density="compact"
                    />
                  )
                }

                if (external) {
                  return (
                    <a
                      key={item.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-v"
                    >
                      {card}
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.id}
                    href={href}
                    className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-v"
                  >
                    {card}
                  </Link>
                )
              })}
            </div>

            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={paging.currentPage <= 1}
                onClick={() => executeSearch(paging.currentPage - 1, true)}
                className="px-4 py-2 rounded-full border border-white/20 text-xs uppercase tracking-[0.3em] text-white/80 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/50 transition"
              >
                Previous
              </button>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Page {paging.currentPage} of {paging.pageCount}
              </p>
              <button
                type="button"
                disabled={!data?.hasMore}
                onClick={() => executeSearch(paging.currentPage + 1, true)}
                className="px-4 py-2 rounded-full border border-white/20 text-xs uppercase tracking-[0.3em] text-white/80 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/50 transition"
              >
                Next
              </button>
            </div>
          </div>
        ) : searchQuery ? (
          <div className="text-center py-16 fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-ink mb-4">No results found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Try adjusting your search terms or browse our archive instead.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setPage(1)
              }}
              className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="text-center py-16 fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-ink mb-4">Search Afropop Worldwide</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Find episodes, features, events, programs, and contributors
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
