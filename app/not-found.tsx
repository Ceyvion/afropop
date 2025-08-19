// 404 page with refined design
import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center">
      <div className="max-w-md text-center px-4 fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-100 text-accent-v mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-ink mb-4">404</h1>
        <h2 className="text-2xl font-bold text-ink mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-10">
          Sorry, we couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="px-8 py-4 border border-transparent text-base font-bold rounded-md text-white btn-accent text-center transition-colors duration-200 uppercase tracking-wider"
          >
            Go Home
          </Link>
          <Link 
            href="/search" 
            className="px-8 py-4 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 text-center transition-colors duration-200 uppercase tracking-wider"
          >
            Search Site
          </Link>
        </div>
      </div>
    </div>
  )
}
