// Home page with RSS feed integration
'use client'

import React from 'react'
import Link from 'next/link'
import { EpisodeCard } from '@/app/components/Cards'
import { useEpisodes, useFeatures } from '@/app/lib/use-rss-data'

export default function Home() {
  // Get the latest episodes from the RSS feed
  const { data: episodesData, loading: episodesLoading, error: episodesError } = useEpisodes(3)
  
  // Get the latest features from the RSS feed
  const { data: featuresData, loading: featuresLoading, error: featuresError } = useFeatures(2)

  // Get the upcoming events (in a real implementation, this would be from a different source)
  const events = [
    { id: 1, title: 'Afropop Live: Brooklyn', date: 'Jun 15', city: 'New York', venue: 'Brooklyn Museum' },
    { id: 2, title: 'Festival Spotlight: Felabration', date: 'Oct 8-10', city: 'Lagos', venue: 'Newark Museum' },
  ]

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <main>
        {/* Hero Section */}
        <div className="relative bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
                  Listen now to the sounds of Africa and its diaspora
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
                  Audio-first storytelling from Afropop Worldwide
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/archive" 
                    className="btn-primary bg-accent-2 text-white hover:bg-accent"
                  >
                    Explore Archive
                  </Link>
                  <Link 
                    href="/episodes" 
                    className="btn-secondary border-gray-300 text-ink bg-white hover:bg-gray-50"
                  >
                    Latest Episode
                  </Link>
                </div>
              </div>
              <div className="bg-gray-200 border-2 border-dashed aspect-video rounded-xl fade-in delay-200" />
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* New This Week */}
          <section className="mb-20 fade-in">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-ink">New This Week</h2>
              <Link href="/episodes" className="text-accent-2 hover:text-accent text-sm font-bold uppercase tracking-wider transition-colors duration-200">
                View all episodes
              </Link>
            </div>
            
            {episodesLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-2"></div>
              </div>
            ) : episodesError ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Error loading episodes: {episodesError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-accent-2 text-white rounded-md hover:bg-accent"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {episodesData?.items?.map((episode: any, index: number) => (
                  <Link key={episode.id} href={`/episodes/${encodeURIComponent(episode.id)}`} className="block">
                    <div className={`fade-in delay-${(index + 1) * 100}`}>
                      <EpisodeCard
                        title={episode.title}
                        region={episode.region || 'Africa'}
                        genre={episode.genre || 'World Music'}
                        duration={episode.duration || '45 min'}
                        image={episode.image}
                        categories={episode.categories}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* News from the Diaspora */}
          <section className="mb-20 fade-in">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-ink">News from the Diaspora</h2>
              <Link href="/features" className="text-accent-2 hover:text-accent text-sm font-bold uppercase tracking-wider transition-colors duration-200">
                View all features
              </Link>
            </div>
            
            {featuresLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-2"></div>
              </div>
            ) : featuresError ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Error loading features: {featuresError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-accent-2 text-white rounded-md hover:bg-accent"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuresData?.items?.map((feature: any, index: number) => (
                  <Link key={feature.id} href={`/features/${encodeURIComponent(feature.id)}`} className="block">
                    <div className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out card-hover fade-in delay-${(index + 1) * 100}`}>
                      <div className="bg-gray-200 border-2 border-dashed aspect-video w-full" />
                      <div className="p-6">
                        <h3 className="font-bold text-ink line-clamp-2 mb-3">{feature.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-5">
                          {feature.description || 'Learn more about this feature...'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{feature.author || 'Afropop Worldwide'}</span>
                          <span className="text-xs text-gray-500">
                            {feature.duration ? `${Math.round(parseInt(feature.duration)/60)} min read` : '8 min read'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Events Near You */}
          <section className="fade-in">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-ink">Events Near You</h2>
              <Link href="/events" className="text-accent-2 hover:text-accent text-sm font-bold uppercase tracking-wider transition-colors duration-200">
                View all events
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <div key={event.id} className={`fade-in delay-${(index + 1) * 100}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out card-hover">
                    <div className="relative">
                      <div className="bg-gray-200 border-2 border-dashed aspect-[3/4] w-full" />
                      <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                        {event.date}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-ink mb-3">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.city}, {event.venue}</span>
                      </div>
                      <Link 
                        href="/events" 
                        className="w-full py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-2 hover:bg-accent text-center block transition-colors duration-200"
                      >
                        Get Tickets
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}