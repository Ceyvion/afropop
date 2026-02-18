'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePlayer } from '@/app/components/PlayerProvider'

const Header = () => {
  const pathname = usePathname()
  const { track, isPlaying } = usePlayer()
  const [menuOpen, setMenuOpen] = useState(false)

  const nav = [
    { label: 'Events', href: '/events' },
    { label: 'Music', href: '/episodes' },
    { label: 'Magazine', href: '/features' },
    { label: 'Store', href: '/shop' },
  ]

  const utilityNav = [
    { label: 'Search', href: '/search' },
    { label: 'Support', href: '/support' },
  ]

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[#040404]/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative inline-flex h-9 w-11 items-center justify-center rounded-md bg-white text-black font-black tracking-tight">
              <span className="text-base leading-none">AP</span>
            </span>
            <div className="leading-tight hidden sm:block">
              <span className="text-[0.55rem] uppercase tracking-[0.4em] text-white/40">Afropop</span>
              <p className="font-display-condensed text-base tracking-[0.15em]">Worldwide</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            {nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.6rem] uppercase tracking-[0.3em] transition-colors ${active ? 'text-white font-semibold' : 'text-white/40 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/search"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-white/50 transition-all hover:border-white/30 hover:text-white"
              aria-label="Open search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m0 0A7 7 0 1010.5 17a7 7 0 006.15-3.35z" />
              </svg>
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center rounded-lg bg-white px-3.5 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-black transition-all hover:bg-accent-v hover:text-white"
            >
              Support
            </Link>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-white/50 transition-all hover:border-white/30 hover:text-white md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div id="mobile-nav" className={`${menuOpen ? 'block' : 'hidden'} border-t border-[var(--border-subtle)] bg-[#060608] md:hidden`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="grid gap-2" aria-label="Mobile">
            {[...nav, ...utilityNav].map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg border px-3.5 py-2 text-[0.6rem] uppercase tracking-[0.3em] transition-all ${
                    active
                      ? 'border-accent-v/30 bg-accent-v/10 text-white'
                      : 'border-[var(--border)] text-white/50 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Now playing strip */}
      {track && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--elevated)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
            <Link
              href="#mini-player"
              className="flex items-center gap-2.5 text-[0.6rem] uppercase tracking-[0.3em] text-white/45 hover:text-white transition-colors"
            >
              <span
                className={`inline-flex h-1.5 w-1.5 rounded-full ${isPlaying ? 'bg-accent-v animate-pulse' : 'bg-white/30'}`}
              />
              <span className="truncate">Now Playing: {track.title}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
