// app/api/rss-proxy/route.ts
import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { RSS_REQUEST_HEADERS } from '@/app/lib/rss-config'

const ALLOWED_RSS_HOSTS = new Set([
  'feeds.feedburner.com',
  'afropop.org',
  'f.prxu.org',
  'feeds.prx.org',
])

// Define the type for our RSS items
type RSSItem = {
  title: string
  link: string
  pubDate?: string
  creator?: string
  content?: string
  contentSnippet?: string
  isoDate?: string
  categories?: string[]
  guid?: string
  [key: string]: any
}

// Define the type for our RSS feed
type RSSFeed = {
  title: string
  description: string
  link: string
  items: RSSItem[]
  [key: string]: any
}

// Create a parser instance with custom fields for podcast feeds
const parser: Parser<RSSFeed, RSSItem> = new Parser({
  customFields: {
    item: [
      ['itunes:author', 'author'],
      ['itunes:subtitle', 'subtitle'],
      ['itunes:summary', 'summary'],
      ['itunes:image', 'image'],
      ['itunes:duration', 'duration'],
      ['itunes:explicit', 'explicit'],
      ['itunes:episode', 'episode'],
      ['itunes:season', 'season'],
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'thumbnail'],
      ['guid', 'guid']
    ]
  }
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' }, 
        { status: 400 }
      )
    }

    // Validate URL format
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' }, 
        { status: 400 }
      )
    }

    if (!ALLOWED_RSS_HOSTS.has(parsed.hostname)) {
      return NextResponse.json(
        { error: 'Requested host is not permitted' },
        { status: 403 },
      )
    }
    if (parsed.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'Only HTTPS feeds are allowed' },
        { status: 400 },
      )
    }

    // Fetch the RSS feed
    const response = await fetch(url, {
      headers: RSS_REQUEST_HEADERS
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch RSS feed: ${response.status} ${response.statusText}` }, 
        { status: response.status }
      )
    }

    // Check content type
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('xml')) {
      console.warn(`Warning: RSS feed may not be XML. Content-Type: ${contentType}`)
    }

    // Get the response as text
    const xml = await response.text()

    // Parse the RSS feed
    const feed = await parser.parseString(xml)

    // Return the parsed feed
    return NextResponse.json(feed)
  } catch (error: any) {
    console.error('Error in RSS proxy:', error)
    return NextResponse.json(
      { error: `Failed to fetch or parse RSS feed: ${error.message}` }, 
      { status: 500 }
    )
  }
}

// Allow OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
