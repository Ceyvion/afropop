// app/api/features/route.ts
// Features API route using FeedBurner integration

import { NextResponse } from 'next/server'
import { getRSSItemsByType, NormalizedRSSItem } from '@/app/lib/rss-service'

const FEATURES_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Get features (items with type 'Feature')
    let items: NormalizedRSSItem[] = []
    try {
      items = await getRSSItemsByType('Feature')
    } catch (error) {
      console.log('No features found in RSS feed, returning empty array')
      items = []
    }
    
    // Apply pagination
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10))
    const offsetNum = Math.max(0, Number(offset) || 0)
    const paginatedItems = items.slice(offsetNum, offsetNum + limitNum)
    
    // Return the results
    return NextResponse.json({
      items: paginatedItems,
      count: paginatedItems.length,
      total: items.length,
      type: 'Feature',
      limit: limitNum,
      offset: offsetNum
    }, { headers: FEATURES_CACHE_HEADERS })
  } catch (error: any) {
    console.error('Error in features API route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch features' }, 
      { status: 500 }
    )
  }
}
