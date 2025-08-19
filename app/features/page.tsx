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
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">Features</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            In-depth stories about African music and culture
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
            <h3 className="text-2xl font-bold text-ink mb-4">Error Loading Features</h3>
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
              Showing {data?.items?.length || 0} features
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.items?.map((feature: any, index: number) => (
                <Link
                  key={feature.id}
                  href={`/features/${String(feature.id).split('/').map(encodeURIComponent).join('/')}`}
                  className="block"
                >
                  <div className={`fade-in delay-${(index % 6 + 1) * 100}`}>
                    <FeatureCard
                      title={feature.title}
                      dek={feature.description}
                      author={feature.author || 'Afropop Worldwide'}
                      readTime={feature.duration ? `${Math.round(parseInt(feature.duration)/60)} min read` : '8 min read'}
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
            Load More Features
          </button>
        </div>
      </div>
    </div>
  )
}
