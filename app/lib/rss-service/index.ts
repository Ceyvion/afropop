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
const META_PUBLISHED_AT = Symbol('rssPublishedAt')
const META_SEARCH_TEXT = Symbol('rssSearchText')
const META_TYPE_LOWER = Symbol('rssTypeLower')
const META_REGION_LOWER = Symbol('rssRegionLower')
const META_GENRE_LOWER = Symbol('rssGenreLower')

type IndexedRSSItem = NormalizedRSSItem & {
  [META_PUBLISHED_AT]: number
  [META_SEARCH_TEXT]: string
  [META_TYPE_LOWER]: string
  [META_REGION_LOWER]: string
  [META_GENRE_LOWER]: string
}

type FeedIndexes = {
  byId: Map<string, IndexedRSSItem>
  byType: Record<ContentType, IndexedRSSItem[]>
  allSorted: IndexedRSSItem[]
}

type CachedFeed = {
  data: RSSFeedResponse
  indexes: FeedIndexes
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
let inflightFeed: Promise<CachedFeed> | null = null

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
  const attempts = sources.map(async (source) => {
    const feed = await fetchAndParse(source)
    return { feed, source }
  })

  try {
    return await Promise.any(attempts)
  } catch (error: unknown) {
    if (error instanceof AggregateError && Array.isArray(error.errors) && error.errors.length > 0) {
      const firstError = error.errors.find((entry) => entry instanceof Error)
      if (firstError instanceof Error) {
        throw firstError
      }
      throw new Error(String(error.errors[0] || 'Unknown RSS error'))
    }
    throw error instanceof Error ? error : new Error(String(error || 'Unknown RSS error'))
  }
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

function toTimestamp(item: Pick<ParserItem, 'isoDate' | 'pubDate'>): number {
  const rawDate = item.isoDate || item.pubDate
  if (!rawDate) return 0
  const parsed = Date.parse(rawDate)
  return Number.isNaN(parsed) ? 0 : parsed
}

function compareByPublishedDateDesc(a: IndexedRSSItem, b: IndexedRSSItem) {
  return b[META_PUBLISHED_AT] - a[META_PUBLISHED_AT]
}

function normalizeType(type: string): ContentType | null {
  const lowered = type.trim().toLowerCase()
  if (lowered === 'episode' || lowered === 'episodes') return 'Episode'
  if (lowered === 'feature' || lowered === 'features') return 'Feature'
  if (lowered === 'event' || lowered === 'events') return 'Event'
  if (lowered === 'program' || lowered === 'programs') return 'Program'
  return null
}

function normalizeRSSItems(items: ParserItem[]): IndexedRSSItem[] {
  return items.map((item) => {
    const categories = item.categories || []
    const type = determineContentType(item)
    const region = findKeyword(categories, REGION_KEYWORDS)
    const genre = findKeyword(categories, GENRE_KEYWORDS)
    const title = item.title || 'Untitled'
    const description = item.summary || item.contentSnippet || item.content || ''
    const content = item.content
    const publishedAt = toTimestamp(item)
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
      title,
      description,
      content,
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
      [META_PUBLISHED_AT]: publishedAt,
      [META_SEARCH_TEXT]: `${title} ${description} ${content || ''}`.toLowerCase(),
      [META_TYPE_LOWER]: type.toLowerCase(),
      [META_REGION_LOWER]: (region || '').toLowerCase(),
      [META_GENRE_LOWER]: (genre || '').toLowerCase(),
    }
  })
}

function buildFeedIndexes(items: IndexedRSSItem[]): FeedIndexes {
  const allSorted = [...items].sort(compareByPublishedDateDesc)
  const byType: Record<ContentType, IndexedRSSItem[]> = {
    Episode: [],
    Feature: [],
    Event: [],
    Program: [],
  }
  const byId = new Map<string, IndexedRSSItem>()

  for (const item of allSorted) {
    if (!byId.has(item.id)) {
      byId.set(item.id, item)
    }
    byType[item.type].push(item)
  }

  return {
    byId,
    byType,
    allSorted,
  }
}

async function resolveFeed(forceRefresh = false): Promise<CachedFeed> {
  if (!forceRefresh && cachedFeed && Date.now() - cachedFeed.timestamp < RSS_CACHE_TIMEOUT) {
    return cachedFeed
  }
  if (!forceRefresh && inflightFeed) {
    return inflightFeed
  }
  inflightFeed = (async () => {
    const { feed } = await loadFeedFromSources()
    const normalizedItems = normalizeRSSItems(feed.items)
    const indexes = buildFeedIndexes(normalizedItems)
    const items: NormalizedRSSItem[] = indexes.allSorted
    const data: RSSFeedResponse = {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      items,
      count: items.length,
      lastUpdated: new Date().toISOString(),
    }
    const nextCache: CachedFeed = {
      data,
      indexes,
      timestamp: Date.now(),
    }
    cachedFeed = nextCache
    return nextCache
  })()
  try {
    return await inflightFeed
  } finally {
    inflightFeed = null
  }
}

export async function getRSSFeed({ forceRefresh = false }: { forceRefresh?: boolean } = {}) {
  const feed = await resolveFeed(forceRefresh)
  return feed.data
}

export async function refreshRSSFeed() {
  cachedFeed = null
  const { data } = await resolveFeed(true)
  return {
    message: 'RSS feed refreshed successfully',
    count: data.count,
    lastUpdated: data.lastUpdated,
  }
}

export async function getRSSItemById(id: string) {
  const feed = await resolveFeed()
  const match = feed.indexes.byId.get(id)
  if (!match) {
    throw new Error(`Item with ID ${id} not found`)
  }
  return match
}

export async function getRSSItemsByType(type: string) {
  const feed = await resolveFeed()
  const normalizedType = normalizeType(type)
  if (!normalizedType) {
    return []
  }
  return feed.indexes.byType[normalizedType].slice()
}

function toFilterTimestamp(value?: string): number | null {
  if (!value) return null
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? null : parsed
}

function matchesFilterRange(item: IndexedRSSItem, dateFrom: number | null, dateTo: number | null) {
  if (dateFrom === null && dateTo === null) return true
  const itemDate = item[META_PUBLISHED_AT]
  if (!itemDate) {
    return false
  }
  if (dateFrom !== null && itemDate < dateFrom) {
    return false
  }
  if (dateTo !== null && itemDate > dateTo) {
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
  const loweredType = filters.type?.trim().toLowerCase() || ''
  const normalizedType = normalizeType(loweredType)
  const typeFilter = normalizedType ? normalizedType.toLowerCase() : loweredType
  const loweredRegion = filters.region?.trim().toLowerCase() || ''
  const loweredGenre = filters.genre?.trim().toLowerCase() || ''
  const dateFrom = toFilterTimestamp(filters.dateFrom)
  const dateTo = toFilterTimestamp(filters.dateTo)
  const requestedPage = Number(pagination.page) || 1
  const requestedPageSize = Number(pagination.pageSize) || 24
  const page = Math.max(1, requestedPage)
  const pageSize = Math.min(50, Math.max(1, requestedPageSize))

  const source =
    loweredType && normalizedType
      ? feed.indexes.byType[normalizedType]
      : loweredType
        ? []
        : feed.indexes.allSorted

  const filtered = source
    .filter((item) => {
      if (loweredQuery && !item[META_SEARCH_TEXT].includes(loweredQuery)) {
        return false
      }
      if (typeFilter && item[META_TYPE_LOWER] !== typeFilter) {
        return false
      }
      if (loweredRegion && !item[META_REGION_LOWER].includes(loweredRegion)) {
        return false
      }
      if (loweredGenre && !item[META_GENRE_LOWER].includes(loweredGenre)) {
        return false
      }
      return matchesFilterRange(item, dateFrom, dateTo)
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
