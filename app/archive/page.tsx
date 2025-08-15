// Archive page with RSS feed integration
'use client'

import React, { useState, useEffect } from 'react'
import FilterRail from '@/app/components/FilterRail'
import { EpisodeCard, FeatureCard, EventCard } from '@/app/components/Cards'
import { useRSSFeed } from '@/app/lib/use-rss-data'

export default function Archive() {
  const { data, loading, error } = useRSSFeed()
  const [filteredResults, setFilteredResults] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState('all')

  // Filter results based on active filter
  useEffect(() => {
    if (data?.items) {
      if (activeFilter === 'all') {
        setFilteredResults(data.items)
      } else {
        setFilteredResults(
          data.items.filter((item: any) => 
            item.type.toLowerCase() === activeFilter
          )
        )
      }
    }
  }, [data, activeFilter])

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
          <h2 className="text-2xl font-bold text-ink mb-4">Error Loading Archive</h2>
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

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Filter Rail */}
          <FilterRail />
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-ink mb-4 sm:mb-0">Archive</h1>
              
              <div className="flex flex-wrap gap-3">
                <select 
                  className="text-sm border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent-2 focus:border-accent-2 transition-colors duration-200"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  <option value="all">All Content</option>
                  <option value="episode">Episodes</option>
                  <option value="feature">Features</option>
                  <option value="event">Events</option>
                </select>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search archive..."
                    className="text-sm border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-accent-2 focus:border-accent-2 transition-colors duration-200"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Results count */}
            <p className="text-gray-600 mb-6">
              Showing {filteredResults.length} of {data?.count} items
            </p>
            
            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResults.map((item: any) => {
                if (item.type === 'Episode') {
                  return (
                    <EpisodeCard
                      key={item.id}
                      title={item.title}
                      region={item.region || 'Africa'}
                      genre={item.genre || 'World Music'}
                      duration={item.duration || '45 min'}
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
                  />
                )
              })}
            </div>
            
            {/* Load More */}
            <div className="mt-16 text-center">
              <button className="px-8 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider">
                Load More
              </button>
            </div>
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