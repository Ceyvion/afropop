// Features page with RSS feed integration
'use client'

import React from 'react'
import Link from 'next/link'
import { FeatureCard } from '@/app/components/Cards'
import { useFeatures } from '@/app/lib/use-rss-data'

export default function Features() {
  // Get all features from the RSS feed
  const { data, loading, error } = useFeatures()

  return (
    <div className="min-h-screen bg-page text-white">
      <div className="page-shell py-12">
        <div className="mb-12 fade-in space-y-4">
          <p className="page-kicker">Magazine</p>
          <h1 className="page-title text-4xl md:text-5xl leading-tight">In-depth stories about African music and culture.</h1>
          <p className="text-lg text-white/60 max-w-3xl">
            Essays, scene reports, and interviews from Afropop Worldwide contributors.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64 fade-in">
            <div className="spinner spinner-lg"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16 space-y-4 fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-accent-v/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-2xl font-display-condensed uppercase tracking-tight">Error Loading Features</h3>
            <p className="text-white/60 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline-ra mx-auto"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="fade-in delay-100">
            <p className="text-white/50 mb-8 text-sm uppercase tracking-[0.35em]">
              Showing {data?.items?.length || 0} features
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.items?.map((feature: any, index: number) => (
                <Link
                  key={feature.id}
                  href={`/features/${String(feature.id).split('/').map(encodeURIComponent).join('/')}`}
                  className="block"
                >
                  <FeatureCard
                    title={feature.title}
                    dek={feature.description}
                    author={feature.author || 'Afropop Worldwide'}
                    readTime={feature.duration ? `${Math.round(parseInt(feature.duration)/60)} min read` : '8 min read'}
                    density="compact"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Load More */}
        <div className="mt-16 text-center fade-in delay-200">
          <button className="btn-outline-ra">Load More Features</button>
        </div>
      </div>
    </div>
  )
}
