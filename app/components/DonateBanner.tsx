// DonateBanner component with refined design
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const DonateBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Show banner after 25% scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent >= 25 && !isDismissed) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  const handleClose = () => {
    setIsVisible(false)
    setIsDismissed(true)
  }

  if (!isVisible || isDismissed) return null

  return (
    <div className="fixed bottom-24 left-0 right-0 bg-accent-2 text-white p-4 shadow-lg z-40 transform transition-transform duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <p className="text-sm">
          <span className="font-bold">Support Afropop Worldwide</span> — Public-service music journalism, powered by listeners like you.
        </p>
        <div className="flex items-center space-x-4">
          <Link 
            href="/support"
            className="px-4 py-2 bg-white text-accent-2 text-sm font-bold rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            Donate
          </Link>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors duration-200"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DonateBanner