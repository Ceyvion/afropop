// DonateBanner component with refined design + session fade-away
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePlayer } from '@/app/components/PlayerProvider'

const HIDE_KEY = 'donate.hide'
const NAV_COUNT_KEY = 'donate.navCount'
const CLICK_COUNT_KEY = 'donate.clickCount'
const NAV_HIDE_THRESHOLD = 3 // hide after visiting a few pages
const CLICK_HIDE_THRESHOLD = 6 // or after a handful of clicks

const DonateBanner: React.FC = () => {
  const pathname = usePathname()
  const { track } = usePlayer()
  const [visible, setVisible] = useState(false)
  const [render, setRender] = useState(false) // allow fade-out before unmount
  const animTimeout = useRef<number | null>(null)

  // Helpers to read/write sessionStorage safely
  const ssGet = (k: string) => {
    try { return sessionStorage.getItem(k) } catch { return null }
  }
  const ssSet = (k: string, v: string) => {
    try { sessionStorage.setItem(k, v) } catch {}
  }

  const hideForSession = () => {
    ssSet(HIDE_KEY, '1')
    // fade out then unmount
    setVisible(false)
    if (animTimeout.current) window.clearTimeout(animTimeout.current)
    animTimeout.current = window.setTimeout(() => setRender(false), 300) as unknown as number
  }

  // Track navigation count to eventually hide the banner
  useEffect(() => {
    if (ssGet(HIDE_KEY) === '1') return
    // Increment nav count on pathname changes (ignoring initial mount if no previous value)
    const prev = Number(ssGet(NAV_COUNT_KEY) || '0')
    const next = prev + 1
    ssSet(NAV_COUNT_KEY, String(next))
    if (next >= NAV_HIDE_THRESHOLD) hideForSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Track generic clicks (e.g., exploring within a page)
  useEffect(() => {
    if (ssGet(HIDE_KEY) === '1') return
    const onClick = (e: MouseEvent) => {
      // Only count real clicks (not drag), favoring anchor or button
      const target = e.target as HTMLElement | null
      if (!target) return
      const isInteractive = target.closest('a,button,[role="button"],summary')
      if (!isInteractive) return
      const prev = Number(ssGet(CLICK_COUNT_KEY) || '0')
      const next = prev + 1
      ssSet(CLICK_COUNT_KEY, String(next))
      if (next >= CLICK_HIDE_THRESHOLD) hideForSession()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reveal after 25% scroll, unless hidden for session
  useEffect(() => {
    if (ssGet(HIDE_KEY) === '1') return
    const handleScroll = () => {
      const denom = Math.max(1, document.body.scrollHeight - window.innerHeight)
      const scrollPercent = (window.scrollY / denom) * 100
      if (scrollPercent >= 25) {
        setRender(true)
        // delay ensures transition-in applies cleanly
        requestAnimationFrame(() => setVisible(true))
        window.removeEventListener('scroll', handleScroll)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close button and donate click both hide for session
  const handleClose = () => hideForSession()
  const handleDonateClick = () => hideForSession()

  if (!render) return null

  // Position above the mini player if a track is active
  const bottomOffset = track ? '5.5rem' : '1rem' // approx mini-player height vs. safe gap

  return (
    <div
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      style={{ bottom: bottomOffset }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-accent-v text-white px-3 py-3 sm:px-4 sm:py-3 shadow-lg rounded-lg flex items-center justify-between gap-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) / 2)' }}>
          <p className="text-sm leading-snug">
            <span className="font-bold">Support Afropop</span>
            <span className="hidden sm:inline"> — Public-service music journalism, powered by listeners like you.</span>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/support"
              onClick={handleDonateClick}
              className="px-3 py-1.5 bg-white text-accent-v text-sm font-bold rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              Donate
            </Link>
            <button 
              onClick={handleClose}
              className="text-white/90 hover:text-white transition-colors duration-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonateBanner
