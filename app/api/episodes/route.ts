// app/api/episodes/route.ts
// Episodes API route using FeedBurner integration

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    
    console.log(`Fetching episodes: limit=${limit}, offset=${offset}`)
    
    // Dynamically import the RSS service
    const mod: any = await import('../../lib/rss-service-feedburner.js')
    const getRSSItemsByType = (mod as any).getRSSItemsByType || mod.default?.getRSSItemsByType
    if (typeof getRSSItemsByType !== 'function') {
      throw new Error('RSS service not loaded correctly')
    }
    
    // Get episodes (items with type 'Episode')
    const items = await getRSSItemsByType('Episode')
    
    // Apply pagination
    const limitNum = parseInt(limit)
    const offsetNum = parseInt(offset)
    const paginatedItems = items.slice(offsetNum, offsetNum + limitNum)
    
    // Return the results
    return NextResponse.json({
      items: paginatedItems,
      count: paginatedItems.length,
      total: items.length,
      type: 'Episode',
      limit: limitNum,
      offset: offsetNum
    })
  } catch (error: any) {
    console.error('Error in episodes API route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch episodes' }, 
      { status: 500 }
    )
  }
}
