// Filter rail — dynamic facets with counts, instant apply, mobile drawer
'use client'

import React, { useState, useCallback } from 'react'
import type { Facet } from '@/app/lib/use-facets'

type FiltersMap = Record<string, string[]>

interface FilterRailProps {
  facets: Facet[]
  selected: FiltersMap
  onChange: (filters: FiltersMap) => void
}

// ── Shared facet list (used by both desktop rail and mobile drawer) ──

function FacetList({
  facets,
  selected,
  onToggle,
}: {
  facets: Facet[]
  selected: FiltersMap
  onToggle: (facet: string, option: string) => void
}) {
  return (
    <div className="space-y-7">
      {facets.map((facet) => (
        <div key={facet.name}>
          <h3 className="text-[0.6rem] font-bold text-white/40 mb-3 uppercase tracking-[0.4em]">
            {facet.name}
          </h3>
          <div className="space-y-2">
            {facet.options.map(({ label, count }) => {
              const checked = selected[facet.name]?.includes(label) || false
              const id = `facet-${facet.name}-${label}`
              return (
                <label
                  key={label}
                  htmlFor={id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(facet.name, label)}
                    className="h-4 w-4 rounded border-white/30 bg-transparent focus:ring-0 focus:outline-none"
                    style={{ accentColor: 'var(--accent)' } as any}
                  />
                  <span className={`text-sm transition-colors duration-150 ${checked ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>
                    {label}
                  </span>
                  <span className="ml-auto text-[0.65rem] tabular-nums text-white/30">
                    {count}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Active filter chips ──────────────────────────────────────────────

export function ActiveFilterChips({
  selected,
  onChange,
}: {
  selected: FiltersMap
  onChange: (filters: FiltersMap) => void
}) {
  const entries = Object.entries(selected).flatMap(([facet, labels]) =>
    labels.map((label) => ({ facet, label }))
  )
  if (entries.length === 0) return null

  const remove = (facet: string, label: string) => {
    const next = { ...selected }
    next[facet] = (next[facet] || []).filter((l) => l !== label)
    if (next[facet].length === 0) delete next[facet]
    onChange(next)
  }

  const clearAll = () => onChange({})

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {entries.map(({ facet, label }) => (
        <button
          key={`${facet}-${label}`}
          onClick={() => remove(facet, label)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                     bg-white/10 text-white/80 hover:bg-white/15 transition-colors"
        >
          <span className="text-white/40">{facet}:</span> {label}
          <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      {entries.length > 1 && (
        <button
          onClick={clearAll}
          className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

// ── Mobile filter button + drawer ────────────────────────────────────

export function MobileFilterButton({
  count,
  onClick,
}: {
  count: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg
                 bg-white/10 text-white/80 hover:bg-white/15 transition-colors text-sm"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      Filters
      {count > 0 && (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-v text-[0.6rem] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  )
}

function MobileDrawer({
  open,
  onClose,
  facets,
  selected,
  onToggle,
  onClear,
}: {
  open: boolean
  onClose: () => void
  facets: Facet[]
  selected: FiltersMap
  onToggle: (facet: string, option: string) => void
  onClear: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-[#0b0b10] border-r border-white/10
                     transform transition-transform duration-300 ease-out lg:hidden
                     ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold tracking-[0.2em] text-white/70 uppercase">Filters</h2>
          <div className="flex items-center gap-3">
            <button onClick={onClear} className="text-xs text-white/40 hover:text-white/70 underline">
              Clear
            </button>
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 custom-scroll">
          <FacetList facets={facets} selected={selected} onToggle={onToggle} />
        </div>
      </div>
    </>
  )
}

// ── Main FilterRail (desktop sidebar) ────────────────────────────────

const FilterRail = ({ facets, selected, onChange }: FilterRailProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggle = useCallback(
    (facetName: string, option: string) => {
      const current = selected[facetName] || []
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
      const next = { ...selected, [facetName]: updated }
      if (next[facetName].length === 0) delete next[facetName]
      onChange(next)
    },
    [selected, onChange]
  )

  const clearAll = useCallback(() => onChange({}), [onChange])

  const activeCount = Object.values(selected).reduce((n, arr) => n + arr.length, 0)

  return (
    <>
      {/* Mobile trigger */}
      <MobileFilterButton count={activeCount} onClick={() => setMobileOpen(true)} />

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        facets={facets}
        selected={selected}
        onToggle={(f, o) => { toggle(f, o); }}
        onClear={() => { clearAll(); setMobileOpen(false); }}
      />

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0 pr-6 border-r border-white/10 text-white">
        <div className="sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-[0.3em] text-white/70 uppercase">Filters</h2>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-xs text-white/40 hover:text-white/70 underline underline-offset-2">
                Clear
              </button>
            )}
          </div>
          <div className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1 custom-scroll">
            <FacetList facets={facets} selected={selected} onToggle={toggle} />
            <div className="h-6" />
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterRail
