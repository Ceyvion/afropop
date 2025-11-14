import { NextResponse } from 'next/server'
import { getRSSFeed } from '@/app/lib/rss-service'

export async function GET() {
  try {
    const data = await getRSSFeed()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in RSS API route:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch RSS feed' },
      { status: 500 },
    )
  }
}
