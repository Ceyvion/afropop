// app/api/rss/route.js
// RSS feed API route using FeedBurner integration (JavaScript version)

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Fetching RSS feed via API route')
    
    // Dynamically import the RSS service
    const rssService = await import('../../lib/rss-service-feedburner.js')
    const { getRSSFeed } = rssService
    
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