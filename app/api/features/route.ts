// app/api/features/route.ts
// Features API route using FeedBurner integration

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    
    console.log(`Fetching features: limit=${limit}, offset=${offset}`)
    
    // Dynamically import the RSS service
    const mod: any = await import('../../lib/rss-service-feedburner.js')
    const getRSSItemsByType = (mod as any).getRSSItemsByType || mod.default?.getRSSItemsByType
    if (typeof getRSSItemsByType !== 'function') {
      throw new Error('RSS service not loaded correctly')
    }
    
    // Get features (items with type 'Feature')
    let items = [];
    try {
      items = await getRSSItemsByType('Feature');
    } catch (error) {
      console.log('No features found in RSS feed, returning empty array');
      items = [];
    }
    
    // Apply pagination
    const limitNum = parseInt(limit)
    const offsetNum = parseInt(offset)
    const paginatedItems = items.slice(offsetNum, offsetNum + limitNum)
    
    // Return the results
    return NextResponse.json({
      items: paginatedItems,
      count: paginatedItems.length,
      total: items.length,
      type: 'Feature',
      limit: limitNum,
      offset: offsetNum
    })
  } catch (error: any) {
    console.error('Error in features API route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch features' }, 
      { status: 500 }
    )
  }
}
