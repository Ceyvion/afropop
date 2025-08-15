// app/api/item/[id]/route.ts
// Item API route using FeedBurner integration

import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Fetching item by ID: ${params.id}`)
    
    // Dynamically import the RSS service
    const rssService = await import('../../../lib/rss-service-feedburner.js')
    const { getRSSItemById } = rssService
    
    // Get item by ID
    const item = await getRSSItemById(params.id)
    
    // Return the item
    return NextResponse.json(item)
  } catch (error: any) {
    console.error('Error in item API route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch item' }, 
      { status: 500 }
    )
  }
}