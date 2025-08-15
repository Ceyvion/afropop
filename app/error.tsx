// 500 error page with refined design
'use client'

import React from 'react'
import Link from 'next/link'

export default function Error() {
  return (
    <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
      <div className="max-w-md text-center px-4 fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-500 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-ink mb-4">500</h1>
        <h2 className="text-2xl font-bold text-ink mb-6">Server Error</h2>
        <p className="text-gray-600 mb-10">
          Sorry, something went wrong on our end. We're working to fix the problem as quickly as possible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="px-8 py-4 border border-transparent text-base font-bold rounded-md text-white bg-accent-2 hover:bg-accent text-center transition-colors duration-200 uppercase tracking-wider"
          >
            Go Home
          </Link>
          <Link 
            href="/support" 
            className="px-8 py-4 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 text-center transition-colors duration-200 uppercase tracking-wider"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}