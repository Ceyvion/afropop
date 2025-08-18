// app/api/search/route.ts
// Search API route using FeedBurner integration

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || ''
    const region = searchParams.get('region') || ''
    const genre = searchParams.get('genre') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''
    
    // Build filters object
    const filters: any = {}
    if (type) filters.type = type
    if (region) filters.region = region
    if (genre) filters.genre = genre
    if (dateFrom) filters.dateFrom = dateFrom
    if (dateTo) filters.dateTo = dateTo
    
    console.log(`Searching RSS feed: query="${query}", filters=`, filters)
    
    // Dynamically import the RSS service
    const mod: any = await import('../../lib/rss-service-feedburner.js')
    const searchRSSFeed = (mod as any).searchRSSFeed || mod.default?.searchRSSFeed
    if (typeof searchRSSFeed !== 'function') {
      throw new Error('RSS service not loaded correctly')
    }
    
    // Search the RSS feed
    const results = await searchRSSFeed(query, filters)
    
    // Return the results
    return NextResponse.json(results)
  } catch (error: any) {
    console.error('Error in search API route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search RSS feed' }, 
      { status: 500 }
    )
  }
}
