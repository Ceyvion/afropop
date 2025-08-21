// Header component with streamlined layout and prominent search
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePlayer } from '@/app/components/PlayerProvider'
import ThemeToggle from '@/app/components/ThemeToggle'
import PaletteToggle from '@/app/components/PaletteToggle'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const { track, isPlaying } = usePlayer()

  // Core navigation kept visible; others moved to "More"
  const navPrimary = [
    { name: 'Archive', href: '/archive' },
    { name: 'Episodes', href: '/episodes' },
    { name: 'Features', href: '/features' },
    { name: 'Events', href: '/events' },
  ]

  const navMore = [
    { name: 'Pitch', href: '/pitch' },
    { name: 'Community', href: '/community' },
    { name: 'Programs', href: '/programs' },
    { name: 'Contributors', href: '/contributors' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-surface-90 backdrop-blur-sm border-b border-sep shadow-sm">
      {/* Main header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Afropop Worldwide wordmark (text link for now) */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-body">
              Afropop Worldwide
            </Link>
          </div>

          {/* Center: primary nav + More (hidden on mobile) */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navPrimary.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href 
                    ? 'text-accent-v border-b-2 border-accent-v pb-1' 
                    : 'text-body hover:text-accent-v'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="relative">
              <button
                className={`text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1 ${isMoreOpen ? 'text-accent-v' : 'text-body hover:text-accent-v'}`}
                onClick={() => setIsMoreOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isMoreOpen}
              >
                More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
              </button>
              {isMoreOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-surface border border-sep rounded-md shadow-lg py-1 z-50"
                  role="menu"
                >
                  {navMore.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2 text-sm ${pathname === item.href ? 'text-accent-v bg-gray-50' : 'text-body hover:bg-gray-50 hover:text-accent-v'}`}
                      onClick={() => setIsMoreOpen(false)}
                      role="menuitem"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right: prominent Search, Donate, Menu (mobile) */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle desktop */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            {/* Palette toggle desktop */}
            <div className="hidden md:block">
              <PaletteToggle />
            </div>
            <Link
              href="/search"
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-body bg-surface hover:bg-gray-50 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Link>
            <Link
              href="/search"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-body bg-surface hover:bg-gray-50 transition-colors duration-200"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            {/* Theme toggle mobile */}
            <div className="md:hidden">
              <ThemeToggle compact />
            </div>
            {/* Palette toggle mobile */}
            <div className="md:hidden">
              <PaletteToggle />
            </div>
            <Link 
              href="/support"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-md btn-accent"
            >
              Donate
            </Link>
            <button 
              className="md:hidden text-body hover:text-accent-v transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
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
        <div className="md:hidden bg-surface border-t border-sep">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
            <div className="pb-2">
              <Link
                href="/search"
                className="block w-full px-3 py-2 rounded-md border border-gray-300 text-body bg-surface text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
            </div>
            {[...navPrimary, ...navMore].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href 
                    ? 'text-accent-v bg-gray-50' 
                    : 'text-body hover:bg-gray-50 hover:text-accent-v'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/support"
              className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md btn-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Donate
            </Link>
          </div>
        </div>
      )}

      {/* Now Playing strip: only show when a track is active */}
      {track && (
        <div className="bg-accent-v text-white text-center py-2 text-sm font-medium" aria-live="polite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="#mini-player" className="inline-flex items-center gap-2 hover:opacity-90">
              <span className={isPlaying ? 'animate-pulse' : 'opacity-70'}>●</span>
              <span>
                Now Playing: {track.title}
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
