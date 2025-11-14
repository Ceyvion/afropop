// app/api/item/[id]/route.ts
// Item API route using FeedBurner integration

import { NextResponse, type NextRequest } from 'next/server'
import { getRSSItemById } from '@/app/lib/rss-service'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const raw = params?.id ?? ''
    const id = raw
      .split('/')
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment))
      .join('/')
    
    console.log(`Fetching item by ID: ${id}`)
    
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
