// Home page with RSS feed integration
'use client'

import React from 'react'
import Link from 'next/link'
import { EpisodeCard, FeatureCard } from '@/app/components/Cards'
import { usePlayer } from '@/app/components/PlayerProvider'
import { useEpisodes, useFeatures } from '@/app/lib/use-rss-data'

export default function Home() {
  // Hardcoded YouTube URL for the hero embed
  const HERO_YOUTUBE_URL = 'https://www.youtube.com/watch?v=twDtPs5NCjA&list=RDtwDtPs5NCjA&start_radio=1'

  // Convert common YouTube URL formats to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const u = new URL(url)
      // youtu.be/<id>
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '')
        return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
      }
      // youtube.com/watch?v=<id>
      if (u.searchParams.get('v')) {
        const id = u.searchParams.get('v')!
        return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
      }
      // youtube.com/embed/<id>
      if (u.pathname.includes('/embed/')) {
        return `${u.origin}${u.pathname}${u.search || ''}`
      }
    } catch (e) {
      // no-op; fall through to empty string
    }
    return ''
  }
  // Get the latest episodes from the RSS feed
  const { data: episodesData, loading: episodesLoading, error: episodesError } = useEpisodes(3)
  const player = usePlayer()
  
  // Get the latest features from the RSS feed
  const { data: featuresData, loading: featuresLoading, error: featuresError } = useFeatures(2)

  // Get the upcoming events (in a real implementation, this would be from a different source)
  const events = [
    { id: 1, title: 'Afropop Live: Brooklyn', date: 'Jun 15', city: 'New York', venue: 'Brooklyn Museum' },
    { id: 2, title: 'Festival Spotlight: Felabration', date: 'Oct 8-10', city: 'Lagos', venue: 'Newark Museum' },
  ]

  return (
    <div className="min-h-screen bg-page">
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
                    className="btn-accent"
                  >
                    Explore Archive
                  </Link>
                  <Link 
                    href="/episodes" 
                    className="btn-secondary"
                  >
                    Latest Episode
                  </Link>
                </div>
              </div>
              <div className="aspect-video rounded-xl fade-in delay-200 overflow-hidden shadow-sm bg-black">
                {HERO_YOUTUBE_URL ? (
                  <iframe
                    className="w-full h-full"
                    src={getYouTubeEmbedUrl(HERO_YOUTUBE_URL)}
                    title="Afropop Worldwide Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 border-2 border-dashed" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* New This Week */}
          <section className="mb-20 fade-in">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-ink">New This Week</h2>
                  <Link href="/episodes" className="text-accent-v hover:opacity-90 text-sm font-bold uppercase tracking-wider transition-colors duration-200">
                    View all episodes
                  </Link>
            </div>
            
            {episodesLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-v"></div>
              </div>
            ) : episodesError ? (
              <div className="text-center py-8">
                <p className="text-muted">Error loading episodes: {episodesError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 btn-accent rounded-md"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {episodesData?.items?.map((episode: any, index: number) => (
                <Link
                  key={episode.id}
                  href={`/episodes/${String(episode.id).split('/').map(encodeURIComponent).join('/')}`}
                  className="block"
                >
                    <div className={`fade-in delay-${(index + 1) * 100}`}>
                      <EpisodeCard
                        id={episode.id}
                        title={episode.title}
                        region={episode.region || 'Africa'}
                        genre={episode.genre || 'World Music'}
                        duration={episode.duration || '45 min'}
                        image={episode.image}
                        categories={episode.categories}
                        density="compact"
                        onPlay={() => {
                          if (episode.audioUrl) {
                            player.play({
                              id: episode.id,
                              title: episode.title,
                              author: episode.author,
                              image: episode.image,
                              audioUrl: episode.audioUrl,
                              duration: episode.duration,
                            })
                          }
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* News from the Diaspora — temporarily removed */}
          {false && (
            <section className="mb-20 fade-in">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-ink">News from the Diaspora</h2>
                <Link href="/features" className="text-accent-v hover:opacity-90 text-sm font-bold uppercase tracking-wider transition-colors duration-200">
                  View all features
                </Link>
              </div>
              {featuresLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-v"></div>
                </div>
              ) : featuresError ? (
                <div className="text-center py-8">
                  <p className="text-muted">Error loading features: {featuresError}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 btn-accent rounded-md"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuresData?.items?.map((feature: any, index: number) => (
                    <Link
                      key={feature.id}
                      href={`/features/${String(feature.id).split('/').map(encodeURIComponent).join('/')}`}
                      className="block"
                    >
                      <div className={`fade-in delay-${(index + 1) * 100}`}>
                        <FeatureCard
                          title={feature.title}
                          dek={feature.description || 'Learn more about this feature...'}
                          author={feature.author || 'Afropop Worldwide'}
                          readTime={feature.duration ? `${Math.round(parseInt(feature.duration)/60)} min read` : '8 min read'}
                          image={feature.image}
                          density="compact"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Events Near You */}
          <section className="fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-ink">Events Near You</h2>
              <Link href="/events" className="text-accent-v hover:opacity-90 text-sm font-bold uppercase tracking-wider transition-colors duration-200">
                View all events
              </Link>
            </div>
            <ul className="divide-y divide-sep">
              {events.map((event, index) => (
                <li key={event.id} className={`py-4 fade-in delay-${(index + 1) * 100}`}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <div className="text-sm text-muted sm:w-40 shrink-0">{event.date}</div>
                    <div className="flex-1">
                      <h3 className="text-ink font-semibold leading-snug">{event.title}</h3>
                      <div className="mt-1 text-sm text-gray-600">{event.city}, {event.venue}</div>
                    </div>
                    <div className="sm:ml-auto">
                      <Link href="/events" className="text-accent-v hover:opacity-90 text-sm font-semibold">Details</Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
