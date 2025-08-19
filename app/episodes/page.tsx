// Episodes page with RSS feed integration
'use client'

import React from 'react'
import Link from 'next/link'
import { EpisodeCard } from '@/app/components/Cards'
import { usePlayer } from '@/app/components/PlayerProvider'
import { useEpisodes } from '@/app/lib/use-rss-data'

export default function Episodes() {
  // Get all episodes from the RSS feed
  const { data, loading, error } = useEpisodes()
  const player = usePlayer()

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">Episodes</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore our collection of episodes covering African music and culture from around the world.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-2"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-red-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-2xl font-bold text-ink mb-4">Error Loading Episodes</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="fade-in">
            <p className="text-gray-600 mb-8">
              Showing {data?.items?.length || 0} episodes
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.items?.map((episode: any, index: number) => (
                <Link
                  key={episode.id}
                  href={`/episodes/${String(episode.id).split('/').map(encodeURIComponent).join('/')}`}
                  className="block"
                >
                  <div className={`fade-in delay-${(index % 6 + 1) * 100}`}>
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
          </div>
        )}
        
        {/* Load More */}
        <div className="mt-16 text-center fade-in delay-300">
          <button className="px-8 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider">
            Load More Episodes
          </button>
        </div>
      </div>
    </div>
  )
}
