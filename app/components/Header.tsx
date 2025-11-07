'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePlayer } from '@/app/components/PlayerProvider'

const Header = () => {
  const pathname = usePathname()
  const { track, isPlaying } = usePlayer()

  const nav = [
    { label: 'Events', href: '/events' },
    { label: 'Music', href: '/episodes' },
    { label: 'Magazine', href: '/features' },
    { label: 'Store', href: '/shop' },
  ]

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
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white/60 hover:text-white"
              aria-label="Open search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m0 0A7 7 0 1010.5 17a7 7 0 006.15-3.35z" />
              </svg>
            </button>
            <Link
              href="/account"
              className="hidden sm:inline-flex text-[0.65rem] uppercase tracking-[0.35em] text-white/70 hover:text-white"
            >
              Account
            </Link>
            <Link
              href="/pro"
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-accent-v hover:text-white"
            >
              APW Pro
            </Link>
          </div>
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
