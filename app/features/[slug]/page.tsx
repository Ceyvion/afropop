// Feature detail page with RSS feed integration
'use client'

import React from 'react'
import Link from 'next/link'
import { useItemById } from '@/app/lib/use-rss-data'

export default function FeatureDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Resolve the params promise
  const resolvedParams = React.use(params);
  // Get the feature data from the RSS feed
  const { data, loading, error } = useItemById(resolvedParams.slug)

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
          <h2 className="text-2xl font-bold text-ink mb-4">Error Loading Feature</h2>
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
          <h2 className="text-2xl font-bold text-ink mb-4">Feature Not Found</h2>
          <p className="text-gray-600 mb-6">The feature you're looking for could not be found.</p>
          <Link 
            href="/features"
            className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
          >
            Browse All Features
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Link href="/features" className="text-accent-2 hover:text-accent transition-colors duration-200">
                Features
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500 truncate max-w-xs">
              {data.title}
            </li>
          </ol>
        </nav>
        
        {/* Article Header */}
        <div className="mb-10 fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-6 leading-tight">
            {data.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-sm text-gray-600">By {data.author || 'Afropop Worldwide'}</span>
            <span className="text-sm text-gray-600">
              {data.duration ? `${Math.round(parseInt(data.duration)/60)} min read` : '8 min read'}
            </span>
            <span className="text-sm text-gray-600">
              Published {new Date(data.pubDate || data.isoDate || '').toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="bg-gray-200 border-2 border-dashed aspect-video rounded-xl mb-10 fade-in delay-100" />
        
        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none fade-in delay-200 text-gray-700"
          dangerouslySetInnerHTML={{ __html: data.content || data.description || 'No content available.' }}
        />
        
        {/* Article Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 fade-in delay-400">
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="btn-secondary border-gray-300 text-ink bg-white hover:bg-gray-50">
              Share Article
            </button>
            <button className="btn-secondary border-gray-300 text-ink bg-white hover:bg-gray-50">
              Save for Later
            </button>
          </div>
          
          {/* Author Bio */}
          <div className="flex items-start gap-5 p-6 bg-white rounded-xl shadow-sm">
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16" />
            <div>
              <h3 className="font-bold text-ink mb-2">{data.author || 'Afropop Worldwide'}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {data.author ? 'Contributor to Afropop Worldwide' : 'Afropop Worldwide is a public-service music journalism organization dedicated to exploring the rich diversity of African music and its global influence.'}
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-accent-2 hover:text-accent transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-accent-2 hover:text-accent transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}