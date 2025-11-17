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
      <div className="min-h-screen bg-page text-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto"></div>
          <p className="mt-4 text-white/60">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-accent-v">Error loading events: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-outline-ra"
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
    <div className="min-h-screen bg-page text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 fade-in space-y-4">
          <p className="page-kicker">Events</p>
          <h1 className="page-title text-4xl md:text-5xl leading-tight">Join us across the diaspora.</h1>
          <p className="text-lg text-white/60 max-w-3xl">
            Live performances, workshops, and cultural celebrations around the world.
          </p>
        </div>

        {/* FilterBar: Search + Time + Location + More (minimal) */}
        <div className="mb-3 fade-in delay-100">
          <div className="ra-panel p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by artist, city, venue, or keyword"
                className="input-dark w-full md:flex-1"
              />
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: 'upcoming', label: 'Upcoming' },
                  { key: 'week', label: 'This Week' },
                  { key: 'month', label: 'This Month' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    role="button"
                    aria-pressed={timePreset === key}
                    onClick={() => { setAdvanced((a) => ({ ...a, month: undefined })); setTimePreset(key as any) }}
                    className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.3em] transition-colors ${timePreset === key ? 'bg-accent-v text-white border-accent-v' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  role="button"
                  aria-pressed={ui.showCityPicker}
                  aria-expanded={ui.showCityPicker}
                  onClick={() => setUi((u) => ({ ...u, showCityPicker: !u.showCityPicker }))}
                  className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.3em] transition-colors ${location ? 'bg-accent-v text-white border-accent-v' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
                  title="Filter by city"
                >
                  {location ? location : 'Anywhere'}
                </button>
                <button
                  role="button"
                  aria-pressed={ui.showAdvanced}
                  aria-expanded={ui.showAdvanced}
                  onClick={() => setUi((u) => ({ ...u, showAdvanced: !u.showAdvanced }))}
                  className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.3em] transition-colors ${ui.showAdvanced ? 'bg-accent-v text-white border-accent-v' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
                >
                  More filters
                </button>
                {anyActive && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setLocation(null);
                      setAdvanced({});
                      setTimePreset('upcoming');
                      setUi({ showAdvanced: false, showCityPicker: false, showAllCities: false });
                    }}
                    className="px-3 py-1.5 text-xs uppercase tracking-[0.3em] font-semibold text-white/70 hover:text-accent-v transition"
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
                <span className="ra-chip">
                  {timePreset === 'week' ? 'This Week' : 'This Month'}
                  <button
                    onClick={() => setTimePreset('upcoming')}
                    className="ml-2 opacity-80 hover:opacity-100"
                    aria-label="Clear time preset"
                  >
                    ×
                  </button>
                </span>
              )}
              {advanced.month && (
                <span className="ra-chip">
                  {monthLabel(advanced.month)}
                  <button
                    onClick={() => setAdvanced((a) => ({ ...a, month: undefined }))}
                    className="ml-2 opacity-80 hover:opacity-100"
                    aria-label="Clear month filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {location && (
                <span className="ra-chip">
                  {location}
                  <button
                    onClick={() => setLocation(null)}
                    className="ml-2 opacity-80 hover:opacity-100"
                    aria-label="Clear city filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {(advanced.tags && advanced.tags.length > 0) && advanced.tags.map((t) => (
                <span key={`tag-pill-${t}`} className="ra-chip">
                  {t}
                  <button
                    onClick={() => setAdvanced((a) => ({ ...a, tags: (a.tags || []).filter((x) => x !== t) }))}
                    className="ml-2 opacity-80 hover:opacity-100"
                    aria-label={`Clear tag ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {advanced.includePast && (
                <span className="ra-chip">
                  Past included
                  <button
                    onClick={() => setAdvanced((a) => ({ ...a, includePast: false }))}
                    className="ml-2 opacity-80 hover:opacity-100"
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
            <div className="ra-panel p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-[0.35em] text-white/50">City</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setUi((u) => ({ ...u, showAllCities: !u.showAllCities }))} className="text-accent-v text-xs font-semibold uppercase tracking-[0.3em]">
                    {ui.showAllCities ? 'Top only' : 'Show all'}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  ui.showAllCities ? derived.allCities : derived.topCities
                ).map((c) => (
                  <button
                    key={c}
                    role="button"
                    aria-pressed={location === c}
                    onClick={() => { setLocation((cur) => (cur === c ? null : c)); setUi((u) => ({ ...u, showCityPicker: false })) }}
                    className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.3em] transition-colors ${location === c ? 'bg-accent-v text-white border-accent-v' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
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
            <div className="ra-panel p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.35em] text-white/50 mb-2">Month</div>
                  <div className="flex flex-wrap gap-2">
                    {derived.allMonths.map((m) => (
                      <button
                        key={m}
                        role="button"
                        aria-pressed={advanced.month === m}
                        onClick={() => { setAdvanced((a) => ({ ...a, month: a.month === m ? undefined : m })); setTimePreset('upcoming') }}
                        className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.3em] transition-colors ${advanced.month === m ? 'bg-accent-v text-white border-accent-v' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
                      >
                        {monthLabel(m)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.35em] text-white/50 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {(derived.topTags.length > 0 ? derived.topTags.slice(0, 6) : CURATED_TAGS.slice(0, 6)).map((t) => (
                      <button
                        key={t}
                        role="button"
                        aria-pressed={Boolean(advanced.tags?.includes(t))}
                        onClick={() => setAdvanced((a) => ({ ...a, tags: a.tags?.includes(t) ? (a.tags || []).filter((x) => x !== t) : [ ...(a.tags || []), t ] }))}
                        className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.3em] transition-colors ${advanced.tags?.includes(t) ? 'bg-accent-v text-white border-accent-v' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.35em] text-white/50 mb-2">Options</div>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-white/70">
                      <input
                        type="checkbox"
                        checked={!!advanced.includePast}
                        onChange={(e) => setAdvanced((a) => ({ ...a, includePast: e.target.checked }))}
                        className="rounded border-white/20"
                      />
                      Include past events
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setAdvanced({})}
                  className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-accent-v transition"
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
                role="button"
                aria-pressed={location === c}
                onClick={() => setLocation((cur) => (cur === c ? null : c))}
                className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.3em] transition-colors ${location === c ? 'bg-accent-v text-white border-accent-v' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
                title="Filter by city"
              >
                {c}
              </button>
            ))}
            {canSuggestNextMonth && (
              <button
                key="sugg-next-month"
                role="button"
                aria-pressed={advanced.month === nmKey}
                onClick={() => setAdvanced((a) => ({ ...a, month: nmKey }))}
                className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.3em] transition-colors ${advanced.month === nmKey ? 'bg-accent-v text-white border-accent-v' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
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
            <div className="text-white/60 text-center py-12">No events found.</div>
          ) : (
            derived.orderedKeys.map((key) => {
              const list = derived.groups[key]
              return (
                <section key={key} className="mb-6">
                  <button
                    onClick={() => setOpenMonths((m) => ({ ...m, [key]: !m[key] }))}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-elevated border border-white/10 hover:border-white/20 transition-colors"
                    aria-expanded={!!openMonths[key]}
                    aria-controls={`month-${key}`}
                  >
                    <span className="text-left">
                      <span className="text-xs text-white/50 block uppercase tracking-[0.35em]">{key}</span>
                      <span className="text-white font-display-condensed text-xl uppercase tracking-tight">{monthLabel(key)}</span>
                    </span>
                    <span className={`text-white/50 transition-transform duration-300 ${openMonths[key] ? 'rotate-180' : ''}`}>⌄</span>
                  </button>

                  <Collapsible open={!!openMonths[key]}>
                    <ul id={`month-${key}`} className="pt-4 divide-y divide-white/10">
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
                              <div className="text-xs text-white/50 sm:w-56 shrink-0 uppercase tracking-[0.35em]">
                                {formatEventDateTimeRange(ev.startDate, ev.endDate)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-white font-semibold leading-snug">{ev.title}</h3>
                                <div className="mt-1 text-sm text-white/60">{city}{city && venue ? ', ' : ''}{venue}</div>
                                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em]">
                                  {live && (
                                    <span className="inline-flex items-center gap-1 text-accent-v">
                                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-v animate-pulse"></span>
                                      Live now
                                    </span>
                                  )}
                                  {ctaHref && (
                                    <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="text-accent-v hover:text-white transition">Tickets</a>
                                  )}
                                  <a
                                    href={`/api/event-ics/${encodeURIComponent(ev.id)}`}
                                    className="text-accent-v hover:text-white transition"
                                    title="Add to your calendar"
                                  >
                                    Add to calendar
                                  </a>
                                  <a
                                    href={`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(ev.title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(ev.description || '')}&location=${encodeURIComponent(ev.location || '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/50 hover:text-white transition"
                                  >
                                    Google
                                  </a>
                                  <button
                                    onClick={() => setOpenEvents((s) => ({ ...s, [ev.id]: !s[ev.id] }))}
                                    className="text-accent-v hover:text-white transition inline-flex items-center gap-1"
                                    aria-expanded={!!openEvents[ev.id]}
                                    aria-controls={`ev-${ev.id}`}
                                  >
                                    {openEvents[ev.id] ? 'Hide details' : 'More details'}
                                    <span className={`transition-transform duration-300 ${openEvents[ev.id] ? 'rotate-180' : ''}`}>⌄</span>
                                  </button>
                                </div>
                                <Collapsible open={!!openEvents[ev.id]}>
                                  <div id={`ev-${ev.id}`} className="mt-3 text-sm text-white/70">
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
          <h2 className="text-2xl font-display-condensed uppercase tracking-tight text-white mb-6 text-center">Add to Your Calendar</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => window.open('/api/calendar-ics', '_blank')}
              className="btn-outline-ra flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download ICS
            </button>
            <button
              onClick={() => window.open(`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent('c_2c54e0a2af46caecc80ffb8657a18343ac7ec9af0c5f6e9b8cc6b096c7b60422@group.calendar.google.com')}`, '_blank')}
              className="btn-outline-ra flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Google Calendar
            </button>
            <button
              onClick={() => window.open(`webcal://calendar.google.com/calendar/ical/c_2c54e0a2af46caecc80ffb8657a18343ac7ec9af0c5f6e9b8cc6b096c7b60422%40group.calendar.google.com/public/basic.ics`, '_blank')}
              className="btn-outline-ra flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
