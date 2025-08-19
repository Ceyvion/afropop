"use client"

import React, { useEffect, useMemo, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const isDark = mode === 'dark' || (mode === 'system' && getSystemPrefersDark())
  root.classList[isDark ? 'add' : 'remove']('dark')
  root.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>('system')
  const [open, setOpen] = useState(false)

  // Compute the resolved theme for icon display
  const resolvedDark = useMemo(() => mode === 'dark' || (mode === 'system' && getSystemPrefersDark()), [mode])

  // Initialize from localStorage and apply on mount
  useEffect(() => {
    try {
      const stored = (localStorage.getItem('theme') as ThemeMode | null) || 'system'
      setMode(stored)
      applyTheme(stored)
    } catch {}
  }, [])

  // Listen to system change when in system mode
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (mode === 'system') applyTheme('system')
    }
    mql.addEventListener?.('change', handler)
    return () => mql.removeEventListener?.('change', handler)
  }, [mode])

  // Sync changes across tabs
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const val = (e.newValue as ThemeMode | null) || 'system'
        setMode(val)
        applyTheme(val)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function update(mode: ThemeMode) {
    try {
      localStorage.setItem('theme', mode)
    } catch {}
    setMode(mode)
    applyTheme(mode)
    setOpen(false)
  }

  const label = mode === 'system' ? 'Theme: System' : `Theme: ${mode[0].toUpperCase()}${mode.slice(1)}`

  // Button styles (match header controls)
  const btnBase = compact
    ? 'inline-flex items-center justify-center w-9 h-9 rounded-md border transition-colors duration-200'
    : 'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200'

  return (
    <div className="relative">
      <button
        aria-label="Toggle theme"
        title={label}
        onClick={() => setOpen((v) => !v)}
        className={`${btnBase} border-gray-300 text-ink bg-white hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800`}
      >
        {resolvedDark ? (
          // Moon icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={compact ? 'h-5 w-5' : 'h-4 w-4'}>
            <path d="M21.752 15.002A9.718 9.718 0 0112 21.75a9.75 9.75 0 01-9.75-9.75c0-4.162 2.548-7.727 6.157-9.171a.75.75 0 01.966.966A8.25 8.25 0 0012 20.25c3.356 0 6.232-1.941 7.724-4.773a.75.75 0 011.028-.475z"/>
          </svg>
        ) : (
          // Sun icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={compact ? 'h-5 w-5' : 'h-4 w-4'}>
            <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3A.75.75 0 0112 2.25zM12 18a6 6 0 100-12 6 6 0 000 12zM4.5 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H5.25A.75.75 0 014.5 12zM16.5 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM6.22 6.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L6.22 7.28a.75.75 0 010-1.06zM15.66 15.66a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM6.22 17.78a.75.75 0 011.06 0l1.06-1.06a.75.75 0 11-1.06-1.06L6.22 16.72a.75.75 0 010 1.06zM15.66 8.34a.75.75 0 011.06 0l1.06-1.06a.75.75 0 11-1.06-1.06L15.66 7.28a.75.75 0 010 1.06z"/>
          </svg>
        )}
        {!compact && <span className="hidden sm:inline">Theme</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 dark:bg-neutral-900 dark:border-neutral-700">
          {(['light', 'dark', 'system'] as ThemeMode[]).map((opt) => (
            <button
              key={opt}
              onClick={() => update(opt)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                mode === opt
                  ? 'text-accent-2 bg-gray-50 dark:bg-neutral-800'
                  : 'text-ink hover:bg-gray-50 hover:text-accent-2 dark:text-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              {opt === 'system' ? 'System (Auto)' : opt[0].toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

