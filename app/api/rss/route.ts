import { NextResponse } from 'next/server'
import { getRSSFeed } from '@/app/lib/rss-service'

const RSS_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET() {
  try {
    const data = await getRSSFeed()
    return NextResponse.json(data, { headers: RSS_CACHE_HEADERS })
  } catch (error: any) {
    console.error('Error in RSS API route:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch RSS feed' },
      { status: 500 },
    )
  }
}
