// Episode detail page with RSS feed integration
'use client'

import React from 'react'
import Link from 'next/link'
import { useItemById } from '@/app/lib/use-rss-data'

export default function EpisodeDetail({ params }: { params: { slug: string } }) {
  // Get the episode data from the RSS feed
  const { data, loading, error } = useItemById(params.slug)

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
          <h2 className="text-2xl font-bold text-ink mb-4">Error Loading Episode</h2>
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

  if (!data) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Episode Not Found</h2>
          <p className="text-gray-600 mb-6">The episode you're looking for could not be found.</p>
          <Link 
            href="/episodes"
            className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
          >
            Browse All Episodes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-accent-2 hover:text-accent transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/episodes" className="text-accent-2 hover:text-accent transition-colors duration-200">
                Episodes
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500 truncate max-w-xs">
              {data.title}
            </li>
          </ol>
        </nav>
        
        {/* Hero */}
        <div className="mb-10 fade-in">
          <div className="bg-gray-200 border-2 border-dashed aspect-video rounded-xl mb-8" />
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-sm text-gray-600">Hosted by {data.author || 'Afropop Worldwide'}</span>
            <span className="text-sm text-gray-600">{data.duration || '45 min'}</span>
            {data.region && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                {data.region}
              </span>
            )}
            {data.genre && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                {data.genre}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary bg-accent-2 text-white hover:bg-accent">
              Play Episode
            </button>
            <button className="btn-secondary border-gray-300 text-ink bg-white hover:bg-gray-50">
              Share
            </button>
            <button className="btn-secondary border-gray-300 text-ink bg-white hover:bg-gray-50">
              Download
            </button>
          </div>
        </div>
        
        {/* Pinned Player */}
        <div className="bg-white rounded-xl p-6 mb-10 shadow-sm fade-in delay-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div>
                <h3 className="font-bold text-ink">{data.title}</h3>
                <p className="text-sm text-gray-600">{data.author || 'Afropop Worldwide'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-ink hover:text-accent-2 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>
              <button className="bg-ink text-white rounded-full p-2 hover:bg-accent-2 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="text-ink hover:text-accent-2 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="bg-white rounded-xl p-8 mb-10 shadow-sm fade-in delay-200">
          <h2 className="text-2xl font-bold text-ink mb-6">Episode Description</h2>
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: data.content || data.description || 'No description available.' }}
          />
        </div>
        
        {/* Transcript */}
        <div className="bg-white rounded-xl p-8 mb-10 shadow-sm fade-in delay-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ink">Transcript</h2>
            <button className="text-sm text-accent-2 hover:text-accent transition-colors duration-200">
              Download MP3
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              Transcript content would appear here...
            </p>
            <button className="text-sm text-accent-2 hover:text-accent font-medium transition-colors duration-200">
              View full transcript
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}