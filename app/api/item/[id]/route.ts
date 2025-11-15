// app/api/item/[id]/route.ts
// Item API route using FeedBurner integration

import { NextResponse } from 'next/server'
import { getRSSItemById } from '@/app/lib/rss-service'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const segments = url.pathname.split('/').filter(Boolean)
    const encodedId = segments.at(-1)

    if (!encodedId) {
      return NextResponse.json(
        { error: 'Item ID is required in the URL' },
        { status: 400 }
      )
    }

    const id = decodeURIComponent(encodedId)
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
