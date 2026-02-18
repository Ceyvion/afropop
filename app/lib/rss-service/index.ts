import Parser from 'rss-parser'
import type { RSSItem as ParserItem } from '@/app/lib/rss-parser'
import { randomUUID } from 'node:crypto'
import {
  AFROPOP_RSS_URL,
  ALTERNATIVE_RSS_URLS,
  RSS_CACHE_TIMEOUT,
  RSS_REQUEST_HEADERS,
  REGION_KEYWORDS,
  GENRE_KEYWORDS,
} from '../rss-config'

export type ContentType = 'Episode' | 'Feature' | 'Event' | 'Program'

export type NormalizedRSSItem = {
  id: string
  title: string
  description: string
  content?: string
  link: string
  pubDate?: string
  isoDate?: string
  author: string
  duration?: string
  categories: string[]
  image: string | null
  audioUrl: string | null
  audioType: string | null
  type: ContentType
  region: string | null
  genre: string | null
}

export type RSSFeedResponse = {
  title?: string
  description?: string
  link?: string
  items: NormalizedRSSItem[]
  count: number
  lastUpdated: string
}

export type RSSSearchFilters = {
  type?: string
  region?: string
  genre?: string
  dateFrom?: string
  dateTo?: string
}

export type RSSSearchPagination = {
  page?: number
  pageSize?: number
}

const RSS_FETCH_TIMEOUT_MS = 12_000

type CachedFeed = {
  data: RSSFeedResponse
  timestamp: number
}

const parser = new Parser({
  customFields: {
    item: [
      ['itunes:author', 'author'],
      ['itunes:subtitle', 'subtitle'],
      ['itunes:summary', 'summary'],
      ['itunes:image', 'image'],
      ['itunes:duration', 'duration'],
      ['itunes:explicit', 'explicit'],
      ['itunes:episode', 'episode'],
      ['itunes:season', 'season'],
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'thumbnail'],
      ['guid', 'guid'],
      ['enclosure', 'enclosure'],
    ],
  },
})

let cachedFeed: CachedFeed | null = null
let inflightFeed: Promise<RSSFeedResponse> | null = null

async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = RSS_FETCH_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchAndParse(url: string) {
  const response = await fetchWithTimeout(url, {
    headers: RSS_REQUEST_HEADERS,
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`)
  }
  const xml = await response.text()
  return parser.parseString(xml)
}

async function loadFeedFromSources() {
  const sources = [AFROPOP_RSS_URL, ...ALTERNATIVE_RSS_URLS]
  let lastError: unknown = null
  for (const source of sources) {
    try {
      const feed = await fetchAndParse(source)
      return { feed, source }
    } catch (error) {
      lastError = error
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Unknown RSS error')
}

function determineContentType(item: ParserItem): ContentType {
  const categories = (item.categories || []).map((entry) => entry.toLowerCase())
  if (categories.some((cat) => cat.includes('feature') || cat.includes('article') || cat.includes('story'))) {
    return 'Feature'
  }
  if (categories.some((cat) => cat.includes('event') || cat.includes('concert') || cat.includes('festival'))) {
    return 'Event'
  }
  if (categories.some((cat) => cat.includes('program'))) {
    return 'Program'
  }
  return 'Episode'
}

function findKeyword(categories: string[], keywords: string[]): string | null {
  const lowered = categories.map((cat) => cat.toLowerCase())
  const match = lowered.find((cat) => keywords.some((keyword) => cat.includes(keyword)))
  return match ?? null
}

function normalizeRSSItems(items: ParserItem[]): NormalizedRSSItem[] {
  return items.map((item) => {
    const categories = item.categories || []
    const type = determineContentType(item)
    const region = findKeyword(categories, REGION_KEYWORDS)
    const genre = findKeyword(categories, GENRE_KEYWORDS)
    const enclosure = (item as any).enclosure ?? (item as any).mediaContent
    const enclosureUrl =
      enclosure?.url ||
      (typeof enclosure?.$?.url === 'string' ? enclosure.$.url : null)
    const enclosureType =
      enclosure?.type ||
      (typeof enclosure?.$?.type === 'string' ? enclosure.$.type : null)
    const image =
      (item as any).image?.$?.href ||
      (item as any).thumbnail?.$?.url ||
      null

    return {
      id: (item as any).guid || item.link || randomUUID(),
      title: item.title || 'Untitled',
      description: item.summary || item.contentSnippet || item.content || '',
      content: item.content,
      link: item.link || '',
      pubDate: item.pubDate,
      isoDate: item.isoDate,
      author: (item as any).author || item.creator || 'Afropop Worldwide',
      duration: (item as any).duration,
      categories,
      image,
      audioUrl: enclosureUrl || null,
      audioType: enclosureType || null,
      type,
      region,
      genre,
    }
  })
}

async function resolveFeed(forceRefresh = false): Promise<RSSFeedResponse> {
  if (!forceRefresh && cachedFeed && Date.now() - cachedFeed.timestamp < RSS_CACHE_TIMEOUT) {
    return cachedFeed.data
  }
  if (!forceRefresh && inflightFeed) {
    return inflightFeed
  }
  inflightFeed = (async () => {
    const { feed } = await loadFeedFromSources()
    const items = normalizeRSSItems(feed.items)
    const data: RSSFeedResponse = {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      items,
      count: items.length,
      lastUpdated: new Date().toISOString(),
    }
    cachedFeed = {
      data,
      timestamp: Date.now(),
    }
    return data
  })()
  try {
    return await inflightFeed
  } finally {
    inflightFeed = null
  }
}

export async function getRSSFeed({ forceRefresh = false }: { forceRefresh?: boolean } = {}) {
  return resolveFeed(forceRefresh)
}

export async function refreshRSSFeed() {
  cachedFeed = null
  const data = await resolveFeed(true)
  return {
    message: 'RSS feed refreshed successfully',
    count: data.count,
    lastUpdated: data.lastUpdated,
  }
}

export async function getRSSItemById(id: string) {
  const feed = await resolveFeed()
  const match = feed.items.find((item) => item.id === id)
  if (!match) {
    throw new Error(`Item with ID ${id} not found`)
  }
  return match
}

export async function getRSSItemsByType(type: string) {
  const feed = await resolveFeed()
  const normalized = type.toLowerCase()
  return feed.items
    .filter((item) => item.type.toLowerCase() === normalized)
    .sort((a, b) => {
      const aDate = new Date(a.isoDate || a.pubDate || '').getTime()
      const bDate = new Date(b.isoDate || b.pubDate || '').getTime()
      return bDate - aDate
    })
}

function matchesFilterRange(item: NormalizedRSSItem, filters: RSSSearchFilters) {
  if (!filters.dateFrom && !filters.dateTo) return true
  const itemDate = new Date(item.isoDate || item.pubDate || '')
  if (Number.isNaN(itemDate.getTime())) {
    return false
  }
  if (filters.dateFrom && itemDate < new Date(filters.dateFrom)) {
    return false
  }
  if (filters.dateTo && itemDate > new Date(filters.dateTo)) {
    return false
  }
  return true
}

export async function searchRSSFeed(
  query: string,
  filters: RSSSearchFilters = {},
  pagination: RSSSearchPagination = {}
) {
  const feed = await resolveFeed()
  const loweredQuery = query.trim().toLowerCase()
  const requestedPage = Number(pagination.page) || 1
  const requestedPageSize = Number(pagination.pageSize) || 24
  const page = Math.max(1, requestedPage)
  const pageSize = Math.min(50, Math.max(1, requestedPageSize))

  const filtered = feed.items
    .filter((item) => {
      const matchesQuery =
        !loweredQuery ||
        item.title.toLowerCase().includes(loweredQuery) ||
        item.description.toLowerCase().includes(loweredQuery) ||
        (item.content?.toLowerCase().includes(loweredQuery) ?? false)

      const matchesType = !filters.type || item.type.toLowerCase() === filters.type.toLowerCase()
      const matchesRegion =
        !filters.region ||
        (item.region && item.region.toLowerCase().includes(filters.region.toLowerCase()))
      const matchesGenre =
        !filters.genre ||
        (item.genre && item.genre.toLowerCase().includes(filters.genre.toLowerCase()))
      const matchesDate = matchesFilterRange(item, filters)

      return matchesQuery && matchesType && matchesRegion && matchesGenre && matchesDate
    })
    .sort((a, b) => {
      const aDate = new Date(a.isoDate || a.pubDate || '').getTime()
      const bDate = new Date(b.isoDate || b.pubDate || '').getTime()
      return bDate - aDate
    })

  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  const hasMore = start + items.length < total

  return {
    items,
    count: items.length,
    total,
    page,
    pageSize,
    hasMore,
    query,
    filters,
  }
}
