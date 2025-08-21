// Events page – calm by default, power-friendly via inline expanders
"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
// Editorial events list layout (no heavy cards)

type RawEvent = {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  location?: string
}

// Minimal curated tags we can detect in text
const CURATED_TAGS = [
  'Festival', 'Concert', 'Workshop', 'Dance', 'DJ', 'Panel', 'Screening', 'Tour', 'Talk', 'Meetup'
]

// Fetch all events (cached in API) and filter client-side
async function fetchAllEvents(): Promise<{ items?: RawEvent[] } | RawEvent[]> {
  try {
    const res = await fetch(`/api/calendar-events?type=all`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch events')
    return await res.json()
  } catch (err) {
    console.error('Error fetching calendar events:', err)
    return []
  }
}

function parseLocation(loc?: string) {
  if (!loc) return { city: 'Location TBA', venue: 'Venue TBA' }
  const parts = loc.split(',').map((s) => s.trim()).filter(Boolean)
  if (parts.length === 1) return { venue: parts[0], city: 'Location TBA' }
  const venue = parts[0]
  const city = parts.slice(1).join(', ')
  return { venue, city }
}

function firstUrlFromText(text?: string): string | null {
  if (!text) return null
  const m = text.match(/https?:\/\/[\w.-]+(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=.]+)?/i)
  return m ? m[0] : null
}

function formatEventDate(d: string) {
  const date = new Date(d)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatEventDateTimeRange(start: string, end?: string) {
  const s = new Date(start)
  const e = end ? new Date(end) : null
  const sameDay = e ? s.toDateString() === e.toDateString() : true
  const datePart = s.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  const timePart = s.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) + (e && sameDay ? ` – ${e.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}` : '')
  return `${datePart} • ${timePart}`
}

function monthKey(d: string) {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`
}

function monthLabel(key: string) {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function extractCuratedTags(ev: RawEvent): string[] {
  const blob = `${ev.title} ${ev.description || ''}`.toLowerCase()
  return CURATED_TAGS.filter((t) => blob.includes(t.toLowerCase()))
}

export default function Events() {
  const [raw, setRaw] = useState<RawEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simplified state
  const [query, setQuery] = useState('')
  const [timePreset, setTimePreset] = useState<'upcoming' | 'week' | 'month'>('upcoming')
  const [location, setLocation] = useState<string | null>(null)
  const [advanced, setAdvanced] = useState<{ month?: string; tags?: string[]; includePast?: boolean }>({})
  const [ui, setUi] = useState<{ showAdvanced: boolean; showCityPicker: boolean; showAllCities: boolean }>({ showAdvanced: false, showCityPicker: false, showAllCities: false })

  // Load from storage (remember advanced state for power users)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('events.filters')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.advanced) setAdvanced(parsed.advanced)
        if (parsed?.location !== undefined) setLocation(parsed.location)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('events.filters', JSON.stringify({ advanced, location }))
    } catch {}
  }, [advanced, location])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchAllEvents()
        const items = Array.isArray(res) ? (res as any) : (res as any)?.items || []
        // Sort ascending by start date
        items.sort((a: RawEvent, b: RawEvent) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        setRaw(items)
      } catch (e: any) {
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const now = Date.now()

  // Progressive disclosure state
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({})
  const [openEvents, setOpenEvents] = useState<Record<string, boolean>>({})

  // (initialized after derived)

  // Simple collapsible helper
  const Collapsible: React.FC<{ open: boolean; children: React.ReactNode }> = ({ open, children }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [maxH, setMaxH] = useState<number>(open ? 9999 : 0)
    useEffect(() => {
      const el = ref.current
      if (!el) return
      const h = el.scrollHeight
      // Set to measured height when opening; 0 when closing
      requestAnimationFrame(() => setMaxH(open ? h + 24 : 0))
    }, [open, children])
    return (
      <div
        ref={ref}
        style={{ maxHeight: `${maxH}px` }}
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${open ? 'opacity-100' : 'opacity-95'}`}
      >
        {children}
      </div>
    )
  }

  const derived = useMemo(() => {
    // Base aggregations
    const cities = new Map<string, number>()
    const months = new Set<string>()
    const tagCounts = new Map<string, number>()

    raw.forEach((ev) => {
      const { city } = parseLocation(ev.location)
      if (city) cities.set(city, (cities.get(city) || 0) + 1)
      months.add(monthKey(ev.startDate))
      const tags = extractCuratedTags(ev)
      tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1))
    })

    // Time windows
    const nowDate = new Date()
    const startOfWeek = new Date(nowDate)
    startOfWeek.setDate(nowDate.getDate() - ((nowDate.getDay() + 6) % 7)) // Monday
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const startOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1)
    const endOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0)
    endOfMonth.setHours(23, 59, 59, 999)

    // Choose date filter
    const monthOverride = advanced.month
    const filteredByTime = raw.filter((ev) => {
      const start = new Date(ev.startDate).getTime()
      const inFuture = start >= now
      const includePast = !!advanced.includePast

      if (monthOverride) {
        return monthKey(ev.startDate) === monthOverride && (includePast || inFuture)
      }

      if (!includePast && !inFuture) return false
      if (timePreset === 'week') return start >= startOfWeek.getTime() && start <= endOfWeek.getTime()
      if (timePreset === 'month') return start >= startOfMonth.getTime() && start <= endOfMonth.getTime()
      return true // 'upcoming'
    })

    const filtered = filteredByTime.filter((ev) => {
      const q = query.trim().toLowerCase()
      const text = `${ev.title} ${ev.description || ''}`.toLowerCase()
      const { city: c } = parseLocation(ev.location)
      const okQ = !q || text.includes(q) || (c && c.toLowerCase().includes(q))
      const okCity = !location || (c && c.toLowerCase() === location.toLowerCase())
      const tags = extractCuratedTags(ev)
      const required = advanced.tags || []
      const okTags = required.length === 0 || required.every((t) => tags.includes(t))
      return okQ && okCity && okTags
    })

    // Group by month key
    const groups: Record<string, RawEvent[]> = {}
    filtered.forEach((ev) => {
      const key = monthKey(ev.startDate)
      if (!groups[key]) groups[key] = []
      groups[key].push(ev)
    })

    Object.values(groups).forEach((arr) => arr.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()))
    const orderedKeys = Object.keys(groups).sort()

    // Top cities and tags for UI
    const topCities = Array.from(cities.entries()).sort((a, b) => b[1] - a[1]).map(([n]) => n)
    const topTags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]).map(([t]) => t)

    return {
      allCities: Array.from(cities.keys()).sort(),
      topCities,
      allMonths: Array.from(months.values()).sort(),
      topTags,
      groups,
      orderedKeys,
    }
  }, [raw, query, location, timePreset, advanced])

  // Initialize open month (current month if present; otherwise first group)
  useEffect(() => {
    const keys = derived.orderedKeys || []
    if (keys.length === 0) return
    const nowDate = new Date()
    const keyNow = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}`
    const initialOpen: Record<string, boolean> = {}
    if (keys.includes(keyNow)) initialOpen[keyNow] = true
    else initialOpen[keys[0]] = true
    setOpenMonths((prev) => ({ ...initialOpen, ...prev }))
  }, [derived.orderedKeys.join(',')])

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-2 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading events: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 btn-accent rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const anyActive = Boolean(
    query || location || advanced.month || (advanced.tags && advanced.tags.length > 0) || advanced.includePast || timePreset !== 'upcoming'
  )

  // Next month suggestion (contextual)
  const nowDateObj = new Date()
  const nmKey = `${nowDateObj.getFullYear() + (nowDateObj.getMonth() === 11 ? 1 : 0)}-${((nowDateObj.getMonth() + 2 - 1) % 12 + 1).toString().padStart(2, '0')}`
  const canSuggestNextMonth = !advanced.month && (timePreset !== 'month') && (derived.allMonths.includes(nmKey))

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">Events</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Join us for live performances, workshops, and cultural celebrations around the world.
          </p>
        </div>

        {/* FilterBar: Search + Time + Location + More (minimal) */}
        <div className="mb-3 fade-in delay-100">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by artist, city, venue, or keyword"
                className="w-full md:flex-1 px-4 py-2.5 border border-gray-300 rounded-md bg-white text-sm"
              />
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: 'upcoming', label: 'Upcoming' },
                  { key: 'week', label: 'This Week' },
                  { key: 'month', label: 'This Month' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setAdvanced((a) => ({ ...a, month: undefined })); setTimePreset(key as any) }}
                    className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${timePreset === key ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => setUi((u) => ({ ...u, showCityPicker: !u.showCityPicker }))}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${location ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  title="Filter by city"
                >
                  {location ? location : 'Anywhere'}
                </button>
                <button
                  onClick={() => setUi((u) => ({ ...u, showAdvanced: !u.showAdvanced }))}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${ui.showAdvanced ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  More filters
                </button>
                {anyActive && (
                  <button
                    onClick={() => { setQuery(''); setLocation(null); setAdvanced({}); setTimePreset('upcoming'); setUi((u) => ({ ...u, showAdvanced: false })); }}
                    className="px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-ink"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {anyActive && (
          <div className="mb-4 fade-in">
            <div className="flex flex-wrap items-center gap-2">
              {timePreset !== 'upcoming' && !advanced.month && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-white text-sm">
                  {timePreset === 'week' ? 'This Week' : 'This Month'}
                  <button
                    onClick={() => setTimePreset('upcoming')}
                    className="opacity-80 hover:opacity-100"
                    aria-label="Clear time preset"
                  >
                    ×
                  </button>
                </span>
              )}
              {advanced.month && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-white text-sm">
                  {monthLabel(advanced.month)}
                  <button
                    onClick={() => setAdvanced((a) => ({ ...a, month: undefined }))}
                    className="opacity-80 hover:opacity-100"
                    aria-label="Clear month filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-white text-sm">
                  {location}
                  <button
                    onClick={() => setLocation(null)}
                    className="opacity-80 hover:opacity-100"
                    aria-label="Clear city filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {(advanced.tags && advanced.tags.length > 0) && advanced.tags.map((t) => (
                <span key={`tag-pill-${t}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-white text-sm">
                  {t}
                  <button
                    onClick={() => setAdvanced((a) => ({ ...a, tags: (a.tags || []).filter((x) => x !== t) }))}
                    className="opacity-80 hover:opacity-100"
                    aria-label={`Clear tag ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {advanced.includePast && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-white text-sm">
                  Past included
                  <button
                    onClick={() => setAdvanced((a) => ({ ...a, includePast: false }))}
                    className="opacity-80 hover:opacity-100"
                    aria-label="Clear include past"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* City inline picker (progressive, inline, not modal) */}
        {ui.showCityPicker && (
          <div className="mb-4 fade-in">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">City</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setUi((u) => ({ ...u, showAllCities: !u.showAllCities }))} className="text-accent-2 text-xs font-semibold">
                    {ui.showAllCities ? 'Top only' : 'Show all'}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  ui.showAllCities ? derived.allCities : derived.topCities
                ).map((c) => (
                  <button
                    key={c}
                    onClick={() => { setLocation((cur) => (cur === c ? null : c)); setUi((u) => ({ ...u, showCityPicker: false })) }}
                    className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${location === c ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AdvancedPanel: Month + Tags + Include past (collapsed by default) */}
        {ui.showAdvanced && (
          <div className="mb-6 fade-in">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 transition-all duration-300 ease-in-out">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Month</div>
                  <div className="flex flex-wrap gap-2">
                    {derived.allMonths.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setAdvanced((a) => ({ ...a, month: a.month === m ? undefined : m })); setTimePreset('upcoming') }}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${advanced.month === m ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      >
                        {monthLabel(m)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {(derived.topTags.length > 0 ? derived.topTags.slice(0, 6) : CURATED_TAGS.slice(0, 6)).map((t) => (
                      <button
                        key={t}
                        onClick={() => setAdvanced((a) => ({ ...a, tags: a.tags?.includes(t) ? (a.tags || []).filter((x) => x !== t) : [ ...(a.tags || []), t ] }))}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${advanced.tags?.includes(t) ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Options</div>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!advanced.includePast}
                        onChange={(e) => setAdvanced((a) => ({ ...a, includePast: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Include past events
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setAdvanced({})}
                  className="text-sm text-gray-600 hover:text-ink"
                  title="Clear advanced filters"
                >
                  Clear advanced
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SuggestionsBar: contextual, lightweight */}
        <div className="mb-6 fade-in delay-150">
          <div className="flex flex-wrap items-center gap-2">
            {derived.topCities.slice(0, 5).map((c) => (
              <button
                key={`sugg-city-${c}`}
                onClick={() => setLocation((cur) => (cur === c ? null : c))}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${location === c ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                title="Filter by city"
              >
                {c}
              </button>
            ))}
            {canSuggestNextMonth && (
              <button
                key="sugg-next-month"
                onClick={() => setAdvanced((a) => ({ ...a, month: nmKey }))}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${advanced.month === nmKey ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                title="Jump to next month"
              >
                Next Month ({monthLabel(nmKey)})
              </button>
            )}
          </div>
        </div>

        {/* Events List (grouped by month) */}
        <div className="fade-in delay-200">
          {derived.orderedKeys.length === 0 ? (
            <div className="text-gray-600">No events found.</div>
          ) : (
            derived.orderedKeys.map((key) => {
              const list = derived.groups[key]
              return (
                <section key={key} className="mb-6">
                  <button
                    onClick={() => setOpenMonths((m) => ({ ...m, [key]: !m[key] }))}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-surface border border-sep hover:bg-gray-50 transition-colors"
                    aria-expanded={!!openMonths[key]}
                    aria-controls={`month-${key}`}
                  >
                    <span className="text-left">
                      <span className="text-sm text-muted block">{key}</span>
                      <span className="text-ink font-bold text-lg">{monthLabel(key)}</span>
                    </span>
                    <span className={`transition-transform duration-300 ${openMonths[key] ? 'rotate-180' : ''}`}>⌄</span>
                  </button>

                  <Collapsible open={!!openMonths[key]}>
                    <ul id={`month-${key}`} className="pt-4 divide-y divide-sep">
                      {list.map((ev: RawEvent) => {
                        const { city, venue } = parseLocation(ev.location)
                        const ctaHref = firstUrlFromText(ev.description || '')
                        const start = new Date(ev.startDate).getTime()
                        const end = new Date(ev.endDate || ev.startDate).getTime()
                        const live = start <= now && now <= end
                        const startIso = new Date(ev.startDate).toISOString().replace(/[-:]|\.\d{3}/g,'')
                        const endIso = new Date(ev.endDate || ev.startDate).toISOString().replace(/[-:]|\.\d{3}/g,'')
                        return (
                          <li key={ev.id} className="py-4">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                              <div className="text-sm text-muted sm:w-56 shrink-0">
                                {formatEventDateTimeRange(ev.startDate, ev.endDate)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-ink font-semibold leading-snug">{ev.title}</h3>
                                <div className="mt-1 text-sm text-gray-600">{city}{city && venue ? ', ' : ''}{venue}</div>
                                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                                  {live && (
                                    <span className="inline-flex items-center gap-1 text-red-600">
                                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                      Live now
                                    </span>
                                  )}
                                  {ctaHref && (
                                    <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="text-accent-v hover:opacity-90">Tickets</a>
                                  )}
                                  <a
                                    href={`/api/event-ics/${encodeURIComponent(ev.id)}`}
                                    className="text-accent-v hover:opacity-90"
                                    title="Add to your calendar"
                                  >
                                    Add to calendar
                                  </a>
                                  <a
                                    href={`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(ev.title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(ev.description || '')}&location=${encodeURIComponent(ev.location || '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-ink"
                                  >
                                    Google
                                  </a>
                                  <button
                                    onClick={() => setOpenEvents((s) => ({ ...s, [ev.id]: !s[ev.id] }))}
                                    className="text-accent-v hover:opacity-90 inline-flex items-center gap-1"
                                    aria-expanded={!!openEvents[ev.id]}
                                    aria-controls={`ev-${ev.id}`}
                                  >
                                    {openEvents[ev.id] ? 'Hide details' : 'More details'}
                                    <span className={`transition-transform duration-300 ${openEvents[ev.id] ? 'rotate-180' : ''}`}>⌄</span>
                                  </button>
                                </div>
                                <Collapsible open={!!openEvents[ev.id]}>
                                  <div id={`ev-${ev.id}`} className="mt-2 text-sm text-gray-700">
                                    {ev.description || 'No description available.'}
                                  </div>
                                </Collapsible>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </Collapsible>
                </section>
              )
            })
          )}
        </div>

        {/* Calendar Integration Options */}
        <div className="mt-16 fade-in delay-400">
          <h2 className="text-xl font-bold text-ink mb-4 text-center">Add to Your Calendar</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => window.open('/api/calendar-ics', '_blank')}
              className="px-6 py-3 border border-gray-300 text-sm font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download ICS
            </button>
            <button 
              onClick={() => window.open(`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent('c_2c54e0a2af46caecc80ffb8657a18343ac7ec9af0c5f6e9b8cc6b096c7b60422@group.calendar.google.com')}`, '_blank')}
              className="px-6 py-3 border border-gray-300 text-sm font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Google Calendar
            </button>
            <button 
              onClick={() => window.open(`webcal://calendar.google.com/calendar/ical/c_2c54e0a2af46caecc80ffb8657a18343ac7ec9af0c5f6e9b8cc6b096c7b60422%40group.calendar.google.com/public/basic.ics`, '_blank')}
              className="px-6 py-3 border border-gray-300 text-sm font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Apple Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
