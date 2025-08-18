// app/api/rss/route.js
// RSS feed API route using FeedBurner integration (JavaScript version)

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Fetching RSS feed via API route')
    
    // Dynamically import the RSS service
    const mod = await import('../../lib/rss-service-feedburner.js')
    const getRSSFeed = mod.getRSSFeed || mod.default?.getRSSFeed
    if (typeof getRSSFeed !== 'function') {
      throw new Error('RSS service not loaded correctly')
    }
    
    // Get the RSS feed data
    const data = await getRSSFeed()
    
    // Return the data
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in RSS API route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch RSS feed' }, 
      { status: 500 }
    )
  }
}
