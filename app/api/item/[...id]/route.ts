// app/api/item/[...id]/route.ts
// Catch-all Item API route using FeedBurner integration. This preserves IDs that contain '/' characters.

import { NextResponse } from 'next/server'
import { getRSSItemById } from '@/app/lib/rss-service'

const ITEM_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const pathname = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
    const segments = pathname.split('/')
    const itemIndex = segments.indexOf('item')
    const encodedSegments = itemIndex >= 0 ? segments.slice(itemIndex + 1) : []

    const hasValidSegment = encodedSegments.some((segment) => segment.length > 0)
    if (!encodedSegments.length || !hasValidSegment) {
      return NextResponse.json(
        { error: 'Item ID is required in the URL' },
        { status: 400 }
      )
    }

    const id = encodedSegments.map((segment) => decodeURIComponent(segment)).join('/')
    console.log(`Fetching item by ID: ${id}`)

    // Get item by ID
    const item = await getRSSItemById(id)

    // Return the item
    return NextResponse.json(item, { headers: ITEM_CACHE_HEADERS })
  } catch (error: any) {
    console.error('Error in item API route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch item' }, 
      { status: 500 }
    )
  }
}
