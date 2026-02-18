// app/api/episodes/route.ts
// Episodes API route using FeedBurner integration

import { NextResponse } from 'next/server'
import { getRSSItemsByType } from '@/app/lib/rss-service'

const EPISODES_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Get episodes (items with type 'Episode')
    const items = await getRSSItemsByType('Episode')

    // Apply pagination
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10))
    const offsetNum = Math.max(0, Number(offset) || 0)
    const paginatedItems = items.slice(offsetNum, offsetNum + limitNum)

    // Return the results
    return NextResponse.json({
      items: paginatedItems,
      count: paginatedItems.length,
      total: items.length,
      type: 'Episode',
      limit: limitNum,
      offset: offsetNum
    }, { headers: EPISODES_CACHE_HEADERS })
  } catch (error: any) {
    console.error('Error in episodes API route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch episodes' }, 
      { status: 500 }
    )
  }
}
