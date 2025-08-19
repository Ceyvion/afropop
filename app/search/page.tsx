// Search page with RSS feed integration
'use client'

import React, { useState } from 'react'
import { EpisodeCard, FeatureCard, EventCard } from '@/app/components/Cards'
import { useRSSSearch } from '@/app/lib/use-rss-data'

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data, loading, error, search } = useRSSSearch()
  const [activeFilter, setActiveFilter] = useState('all')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() === '') return
    
    // Build filters object
    const filters: any = {}
    if (activeFilter !== 'all') {
      filters.type = activeFilter
    }
    
    // Perform search
    search(searchQuery, filters)
  }

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
                placeholder="Search episodes, features, events, programs, and contributors..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-2 focus:border-accent-2 transition-colors duration-200"
              />
              <button 
                type="submit"
                className="absolute right-4 top-4 text-gray-400 hover:text-accent-2 transition-colors duration-200"
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
                className={`px-4 py-2 text-sm font-bold rounded-full uppercase tracking-wider transition-colors duration-200 ${
                  activeFilter === filter
                    ? 'bg-accent-2 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64 fade-in">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-2"></div>
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
              onClick={() => search(searchQuery, activeFilter !== 'all' ? { type: activeFilter } : {})}
              className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
            >
              Retry Search
            </button>
          </div>
        ) : data?.items?.length > 0 ? (
          <div className="fade-in">
            <p className="text-gray-600 mb-8">
              Found {data.count} results for "{searchQuery}"
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items.map((item: any) => {
                if (item.type === 'Episode') {
                  return (
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
                
                if (item.type === 'Feature') {
                  return (
                    <FeatureCard
                      key={item.id}
                      title={item.title}
                      dek={item.description}
                      author={item.author || 'Afropop Worldwide'}
                      readTime={item.duration ? `${Math.round(parseInt(item.duration)/60)} min read` : '8 min read'}
                      density="compact"
                    />
                  )
                }
                
                if (item.type === 'Event') {
                  return (
                    <EventCard
                      key={item.id}
                      title={item.title}
                      date={formatDate(item.pubDate)}
                      city="Various Locations"
                      venue="Afropop Event"
                      density="compact"
                    />
                  )
                }
                
                // Default to episode card for unknown types
                return (
                  <EpisodeCard
                    key={item.id}
                    title={item.title}
                    region={item.region || 'Africa'}
                    genre={item.genre || 'World Music'}
                    duration={item.duration || '45 min'}
                    density="compact"
                  />
                )
              })}
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
              onClick={() => setSearchQuery('')}
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

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
