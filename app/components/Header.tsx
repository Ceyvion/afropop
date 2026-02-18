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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#040404]/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 text-white">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative inline-flex h-10 w-12 items-center justify-center rounded-sm bg-white text-black font-black tracking-tight">
              <span className="pointer-events-none absolute inset-0 border border-black/40" />
              <span className="text-lg leading-none">AP</span>
            </span>
            <div className="leading-tight hidden sm:block">
              <span className="text-[0.6rem] uppercase tracking-[0.45em] text-white/60">Afropop</span>
              <p className="font-display-condensed text-lg tracking-[0.2em]">Worldwide</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.65rem] uppercase tracking-[0.35em] transition-colors ${active ? 'text-white' : 'text-white/50 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white/60 hover:text-white"
              aria-label="Open search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m0 0A7 7 0 1010.5 17a7 7 0 006.15-3.35z" />
              </svg>
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-accent-v hover:text-white"
            >
              Support
            </Link>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white/60 hover:text-white md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <div id="mobile-nav" className={`${menuOpen ? 'block' : 'hidden'} border-t border-white/10 bg-[#07070a] md:hidden`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="grid gap-3" aria-label="Mobile">
            {[...nav, ...utilityNav].map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full border px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] transition ${
                    active
                      ? 'border-accent-v bg-accent-v/15 text-white'
                      : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {track && (
        <div className="border-t border-white/10 bg-[#0f0f13]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <Link
              href="#mini-player"
              className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-white/60 hover:text-white"
            >
              <span
                className={`inline-flex h-2 w-2 rounded-full ${isPlaying ? 'bg-accent-v animate-pulse' : 'bg-white/40'}`}
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
