'use client'

import { useMemo } from 'react'

// ── Vocabulary maps ──────────────────────────────────────────────────
// Each key is the canonical label shown in the UI; values are the
// lowercase tokens we scan for inside title + description + categories.

const REGION_VOCAB: Record<string, string[]> = {
  'West Africa':     ['west africa', 'western africa'],
  'East Africa':     ['east africa', 'eastern africa'],
  'Southern Africa': ['southern africa', 'south africa'],
  'North Africa':    ['north africa', 'northern africa'],
  'Caribbean':       ['caribbean'],
  'Diaspora':        ['diaspora'],
}

const COUNTRY_VOCAB: Record<string, string[]> = {
  'Nigeria':      ['nigeria', 'nigerian', 'lagos', 'naija'],
  'Ghana':        ['ghana', 'ghanaian', 'accra'],
  'Senegal':      ['senegal', 'senegalese', 'dakar'],
  'South Africa': ['south africa', 'south african', 'johannesburg', 'cape town', 'soweto'],
  'Kenya':        ['kenya', 'kenyan', 'nairobi'],
  'Mali':         ['mali', 'malian', 'bamako'],
  'Ethiopia':     ['ethiopia', 'ethiopian', 'addis ababa'],
  'Congo':        ['congo', 'congolese', 'kinshasa'],
  'Cuba':         ['cuba', 'cuban', 'havana'],
  'Brazil':       ['brazil', 'brazilian'],
  'Egypt':        ['egypt', 'egyptian', 'cairo'],
  'Morocco':      ['morocco', 'moroccan'],
  'Tanzania':     ['tanzania', 'tanzanian', 'dar es salaam'],
  'Zimbabwe':     ['zimbabwe', 'zimbabwean'],
  'Uganda':       ['uganda', 'ugandan', 'kampala'],
  'Cameroon':     ['cameroon', 'cameroonian'],
  'Guinea':       ['guinea', 'guinean', 'conakry'],
  'Ivory Coast':  ['ivory coast', 'côte d\'ivoire', 'abidjan', 'ivorian'],
  'Benin':        ['benin', 'beninese', 'cotonou'],
  'Cape Verde':   ['cape verde', 'cabo verde'],
}

const GENRE_VOCAB: Record<string, string[]> = {
  'Afrobeats':    ['afrobeats', 'afrobeat', 'afro-beat'],
  'Highlife':     ['highlife', 'high life', 'high-life'],
  'Soukous':      ['soukous'],
  'Jùjú':         ['juju', 'jùjú'],
  'Afropop':      ['afropop', 'afro-pop'],
  'Makossa':      ['makossa'],
  'Mbalax':       ['mbalax'],
  'Rumba':        ['rumba'],
  'Reggae':       ['reggae'],
  'Hip Hop':      ['hip hop', 'hip-hop', 'hiphop', 'rap'],
  'Jazz':         ['jazz'],
  'Taarab':       ['taarab'],
  'Kwaito':       ['kwaito'],
  'Amapiano':     ['amapiano'],
  'Gqom':         ['gqom'],
  'Gnawa':        ['gnawa', 'gnaoua'],
  'Desert Blues':  ['desert blues', 'desert rock', 'tishoumaren'],
  'Griot':        ['griot', 'jali', 'jeli'],
  'Fuji':         ['fuji'],
  'Gospel':       ['gospel'],
  'Zouk':         ['zouk'],
  'Soca':         ['soca'],
  'Calypso':      ['calypso'],
  'World Music':  ['world music'],
  'Traditional':  ['traditional'],
  'Folk':         ['folk'],
}

const TAG_VOCAB: Record<string, string[]> = {
  'Interview':   ['interview'],
  'Live':        ['live', 'concert', 'performance'],
  'Festival':    ['festival'],
  'History':     ['history', 'historic', 'historical'],
  'Dance':       ['dance', 'dancing'],
  'Politics':    ['politi', 'protest', 'revolution', 'activist'],
  'Film':        ['film', 'movie', 'cinema', 'soundtrack'],
  'Book':        ['book', 'author', 'memoir', 'novel'],
  'Tribute':     ['tribute', 'memorial', 'rip', 'obituary', 'rememb'],
  'New Release': ['new release', 'new album', 'album review', 'debut'],
  'Tour':        ['tour', 'touring'],
}

// ── Types ────────────────────────────────────────────────────────────

export type FacetOption = {
  label: string
  count: number
}

export type Facet = {
  name: string
  options: FacetOption[]
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Build a searchable text blob from an item */
function itemText(item: any): string {
  return [
    item.title || '',
    item.description || '',
    item.content || '',
    ...(item.categories || []),
  ].join(' ').toLowerCase()
}

/** Check if any token from the vocab matches inside the text */
function vocabMatch(text: string, tokens: string[]): boolean {
  return tokens.some(t => text.includes(t))
}

/** Scan all items against a vocabulary, return facet options sorted by count desc */
function buildVocabFacet(items: any[], vocab: Record<string, string[]>): FacetOption[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    const text = itemText(item)
    for (const [label, tokens] of Object.entries(vocab)) {
      if (vocabMatch(text, tokens)) {
        counts.set(label, (counts.get(label) || 0) + 1)
      }
    }
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

/** Parse duration string to seconds */
function parseDuration(dur: string | undefined): number | null {
  if (!dur) return null
  // "HH:MM:SS" or "MM:SS" or just seconds
  const parts = dur.split(':').map(Number)
  if (parts.some(isNaN)) return null
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 1) return parts[0]
  return null
}

// ── Main hook ────────────────────────────────────────────────────────

export function useFacets(items: any[]): Facet[] {
  return useMemo(() => {
    if (!items || items.length === 0) return []

    const facets: Facet[] = []

    // Region — vocabulary scan
    const regionOpts = buildVocabFacet(items, REGION_VOCAB)
    if (regionOpts.length > 0) facets.push({ name: 'Region', options: regionOpts })

    // Country — vocabulary scan
    const countryOpts = buildVocabFacet(items, COUNTRY_VOCAB)
    if (countryOpts.length > 0) facets.push({ name: 'Country', options: countryOpts })

    // Genre — vocabulary scan
    const genreOpts = buildVocabFacet(items, GENRE_VOCAB)
    if (genreOpts.length > 0) facets.push({ name: 'Genre', options: genreOpts })

    // Era/Decade — derived from pubDate
    const decadeCounts = new Map<string, number>()
    for (const item of items) {
      const d = new Date(item.isoDate || item.pubDate || 0)
      const year = d.getFullYear()
      if (year > 1900) {
        const decade = `${Math.floor(year / 10) * 10}s`
        decadeCounts.set(decade, (decadeCounts.get(decade) || 0) + 1)
      }
    }
    const eraOpts = Array.from(decadeCounts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => {
        // Sort decades newest-first
        const da = parseInt(a.label)
        const db = parseInt(b.label)
        return db - da
      })
    if (eraOpts.length > 0) facets.push({ name: 'Era/Decade', options: eraOpts })

    // Host / Author — derived from item.author field
    const hostCounts = new Map<string, number>()
    for (const item of items) {
      const author = (item.author || '').trim()
      if (author && author !== 'Afropop Worldwide') {
        hostCounts.set(author, (hostCounts.get(author) || 0) + 1)
      }
    }
    const hostOpts = Array.from(hostCounts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15) // cap to top 15 hosts
    if (hostOpts.length > 0) facets.push({ name: 'Host', options: hostOpts })

    // Length — derived from duration
    const lengthBuckets: Record<string, number> = {
      '< 15 min': 0,
      '15–30 min': 0,
      '30–60 min': 0,
      '> 60 min': 0,
    }
    for (const item of items) {
      const secs = parseDuration(item.duration)
      if (secs === null) continue
      const mins = secs / 60
      if (mins < 15) lengthBuckets['< 15 min']++
      else if (mins < 30) lengthBuckets['15–30 min']++
      else if (mins < 60) lengthBuckets['30–60 min']++
      else lengthBuckets['> 60 min']++
    }
    const lengthOpts = Object.entries(lengthBuckets)
      .filter(([, count]) => count > 0)
      .map(([label, count]) => ({ label, count }))
    if (lengthOpts.length > 0) facets.push({ name: 'Length', options: lengthOpts })

    // Tags — vocabulary scan
    const tagOpts = buildVocabFacet(items, TAG_VOCAB)
    if (tagOpts.length > 0) facets.push({ name: 'Tags', options: tagOpts })

    return facets
  }, [items])
}

// ── Filter engine ────────────────────────────────────────────────────
// Given items + selected facet map, returns the filtered subset.
// This centralizes ALL filter logic so the archive page just calls it.

export function applyFacetFilters(
  items: any[],
  facetFilters: Record<string, string[]>,
  query: string,
  sortOrder: 'newest' | 'oldest'
): any[] {
  let result = items

  // Helper: check if item text matches any label's vocab tokens
  const matchesVocab = (item: any, labels: string[], vocab: Record<string, string[]>) => {
    const text = itemText(item)
    return labels.some(label => {
      const tokens = vocab[label]
      return tokens ? vocabMatch(text, tokens) : text.includes(label.toLowerCase())
    })
  }

  // Region
  const regionSel = facetFilters['Region'] || []
  if (regionSel.length > 0) {
    result = result.filter(item => matchesVocab(item, regionSel, REGION_VOCAB))
  }

  // Country
  const countrySel = facetFilters['Country'] || []
  if (countrySel.length > 0) {
    result = result.filter(item => matchesVocab(item, countrySel, COUNTRY_VOCAB))
  }

  // Genre
  const genreSel = facetFilters['Genre'] || []
  if (genreSel.length > 0) {
    result = result.filter(item => matchesVocab(item, genreSel, GENRE_VOCAB))
  }

  // Era/Decade
  const eras = facetFilters['Era/Decade'] || []
  if (eras.length > 0) {
    const ranges = eras.map(dec => {
      const start = parseInt(dec) || parseInt(dec.replace(/s$/, ''))
      if (!isNaN(start)) return { from: new Date(`${start}-01-01`).getTime(), to: new Date(`${start + 9}-12-31`).getTime() }
      return null
    }).filter(Boolean) as { from: number; to: number }[]
    if (ranges.length > 0) {
      result = result.filter(item => {
        const t = new Date(item.isoDate || item.pubDate || 0).getTime()
        return ranges.some(r => t >= r.from && t <= r.to)
      })
    }
  }

  // Host
  const hostSel = facetFilters['Host'] || []
  if (hostSel.length > 0) {
    result = result.filter(item => {
      const author = (item.author || '').trim()
      return hostSel.includes(author)
    })
  }

  // Length
  const lengthSel = facetFilters['Length'] || []
  if (lengthSel.length > 0) {
    result = result.filter(item => {
      const secs = parseDuration(item.duration)
      if (secs === null) return false
      const mins = secs / 60
      return lengthSel.some(bucket => {
        if (bucket === '< 15 min') return mins < 15
        if (bucket === '15–30 min') return mins >= 15 && mins < 30
        if (bucket === '30–60 min') return mins >= 30 && mins < 60
        if (bucket === '> 60 min') return mins >= 60
        return false
      })
    })
  }

  // Tags
  const tagSel = facetFilters['Tags'] || []
  if (tagSel.length > 0) {
    result = result.filter(item => matchesVocab(item, tagSel, TAG_VOCAB))
  }

  // Text search
  if (query.trim()) {
    const q = query.toLowerCase()
    result = result.filter(item => {
      const text = itemText(item)
      return text.includes(q)
    })
  }

  // Sort
  result.sort((a, b) => {
    const da = new Date(a.isoDate || a.pubDate || 0).getTime()
    const db = new Date(b.isoDate || b.pubDate || 0).getTime()
    return sortOrder === 'newest' ? db - da : da - db
  })

  return result
}
