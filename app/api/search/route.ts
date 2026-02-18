// app/api/search/route.ts
// Search API route using FeedBurner integration

import { NextResponse } from 'next/server'
import { searchRSSFeed } from '@/app/lib/rss-service'

const SEARCH_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
}

function buildEpisodeHref(id: string) {
  return `/episodes/${String(id).split('/').map(encodeURIComponent).join('/')}`
}

function buildFeatureHref(item: any) {
  if (item?.link && /^https?:\/\//i.test(item.link)) return item.link
  if (item?.id) return `/features/${String(item.id).split('/').map(encodeURIComponent).join('/')}`
  return '/features'
}

function buildSearchHref(item: any) {
  if (item?.type === 'Episode' && item?.id) return buildEpisodeHref(item.id)
  if (item?.type === 'Feature') return buildFeatureHref(item)
  if (item?.type === 'Event') {
    return `/events?event=${encodeURIComponent(String(item?.id || item?.title || 'event'))}`
  }
  if (item?.type === 'Program') return '/programs'
  if (item?.link && /^https?:\/\//i.test(item.link)) return item.link
  return '/archive'
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || ''
    const region = searchParams.get('region') || ''
    const genre = searchParams.get('genre') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize')) || 24))
    
    // Build filters object
    const filters: any = {}
    if (type) filters.type = type
    if (region) filters.region = region
    if (genre) filters.genre = genre
    if (dateFrom) filters.dateFrom = dateFrom
    if (dateTo) filters.dateTo = dateTo

    // Search the RSS feed
    const results = await searchRSSFeed(query, filters, { page, pageSize })
    const items = results.items.map((item: any) => {
      const href = buildSearchHref(item)
      return {
        ...item,
        href,
        external: /^https?:\/\//i.test(href),
      }
    })
    
    // Return the results
    return NextResponse.json({
      ...results,
      items,
      total: results.total ?? items.length,
      page: results.page ?? page,
      pageSize: results.pageSize ?? pageSize,
      hasMore: Boolean(results.hasMore),
    }, { headers: SEARCH_CACHE_HEADERS })
  } catch (error: any) {
    console.error('Error in search API route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search RSS feed' }, 
      { status: 500 }
    )
  }
}
