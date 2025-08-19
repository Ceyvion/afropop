"use client"

import React, { useEffect, useState } from 'react'

type Palette = 'spring' | 'summer' | 'autumn' | 'winter'

function applyPalette(p: Palette) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const palettes: Palette[] = ['spring', 'summer', 'autumn', 'winter']
  palettes.forEach((x) => root.classList.remove('theme-' + x))
  root.classList.add('theme-' + p)
  root.setAttribute('data-palette', p)
}

export default function PaletteToggle() {
  const [open, setOpen] = useState(false)
  const [palette, setPalette] = useState<Palette>('spring')

  useEffect(() => {
    try {
      const p = (localStorage.getItem('palette') as Palette | null) || 'spring'
      setPalette(p)
      applyPalette(p)
    } catch {}
  }, [])

  const label = `Palette: ${palette[0].toUpperCase()}${palette.slice(1)}`

  function update(p: Palette) {
    try { localStorage.setItem('palette', p) } catch {}
    setPalette(p)
    applyPalette(p)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        aria-label="Change palette"
        title={label}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 border-gray-300 text-ink bg-white hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 2a10 10 0 100 20 2 2 0 002-2 2 2 0 00-2-2h-1a1 1 0 01-1-1 3 3 0 013-3 3 3 0 100-6z" />
        </svg>
        <span className="hidden sm:inline">Palette</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 dark:bg-neutral-900 dark:border-neutral-700">
          {(['spring', 'summer', 'autumn', 'winter'] as Palette[]).map((opt) => (
            <button
              key={opt}
              onClick={() => update(opt)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                palette === opt
                  ? 'text-accent-2 bg-gray-50 dark:bg-neutral-800'
                  : 'text-ink hover:bg-gray-50 hover:text-accent-2 dark:text-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              {opt[0].toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

