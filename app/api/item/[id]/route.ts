// app/api/item/[id]/route.ts
// Item API route using FeedBurner integration

import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: raw } = await params
    const id = decodeURIComponent(raw)
    
    console.log(`Fetching item by ID: ${id}`)
    
    // Dynamically import the RSS service
    const mod: any = await import('../../../lib/rss-service-feedburner.js')
    const getRSSItemById = (mod as any).getRSSItemById || mod.default?.getRSSItemById
    if (typeof getRSSItemById !== 'function') {
      throw new Error('RSS service not loaded correctly')
    }
    
    // Get item by ID
    const item = await getRSSItemById(id)
    
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
