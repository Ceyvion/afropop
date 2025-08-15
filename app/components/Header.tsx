// Header component with refined design
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Navigation items from the spec
  const navItems = [
    { name: 'Archive', href: '/archive' },
    { name: 'Episodes', href: '/episodes' },
    { name: 'Features', href: '/features' },
    { name: 'Events', href: '/events' },
    { name: 'Programs', href: '/programs' },
    { name: 'Hosts & Contributors', href: '/contributors' },
    { name: 'Support', href: '/support' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      {/* Main header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Afropop wordmark (SVG) */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-ink">
              Afropop
            </Link>
          </div>

          {/* Center: primary nav (hidden on mobile) */}
          <nav className="hidden md:flex md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href 
                    ? 'text-accent-2 border-b-2 border-accent-2 pb-1' 
                    : 'text-ink hover:text-accent-2'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Search, Donate, Menu (mobile) */}
          <div className="flex items-center space-x-4">
            <Link href="/search" className="text-ink hover:text-accent-2 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link 
              href="/support"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-accent-2 hover:bg-accent transition-colors duration-200"
            >
              Donate
            </Link>
            <button 
              className="md:hidden text-ink hover:text-accent-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href 
                    ? 'text-accent-2 bg-gray-50' 
                    : 'text-ink hover:bg-gray-50 hover:text-accent-2'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/support"
              className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-accent-2 hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Donate
            </Link>
          </div>
        </div>
      )}

      {/* Now Playing strip */}
      <div className="bg-accent-2 text-white text-center py-2 text-sm font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="animate-pulse">●</span> Now Playing: The Origins of Highlife
        </div>
      </div>
    </header>
  )
}

export default Header