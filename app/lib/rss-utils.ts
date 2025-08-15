// app/lib/rss-utils.ts
import Parser from 'rss-parser'

// Define the type for our RSS items
export type RSSItem = {
  title: string
  link: string
  pubDate?: string
  creator?: string
  content?: string
  contentSnippet?: string
  isoDate?: string
  categories?: string[]
  guid?: string
  enclosure?: {
    url: string
    length: string
    type: string
  }
  [key: string]: any
}

// Define the type for our RSS feed
export type RSSFeed = {
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
      ['guid', 'guid'],
      ['enclosure', 'enclosure']
    ]
  }
})

// Function to fetch and parse an RSS feed
export async function fetchAndParseRSS(url: string): Promise<RSSFeed> {
  try {
    // Validate URL
    if (!url) {
      throw new Error('RSS URL is required')
    }

    // Fetch the RSS feed through our proxy API route
    const response = await fetch(`/api/rss-proxy?url=${encodeURIComponent(url)}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`)
    }

    // Parse the JSON response (our proxy returns parsed data)
    const feedData = await response.json()
    return feedData
  } catch (error) {
    console.error(`Error fetching or parsing RSS feed from ${url}:`, error)
    throw new Error(`Failed to fetch or parse RSS feed: ${error}`)
  }
}

// Function to normalize RSS items for our application
export function normalizeRSSItems(items: RSSItem[]): any[] {
  return items.map(item => ({
    id: item.guid || item.link,
    title: item.title || 'Untitled',
    description: item.summary || item.contentSnippet || item.description || '',
    content: item.content,
    link: item.link,
    pubDate: item.pubDate,
    isoDate: item.isoDate,
    author: item.author || item.creator || 'Unknown',
    duration: item.duration,
    categories: item.categories || [],
    image: item.image?.$?.href || item.thumbnail?.$?.url || null,
    enclosure: item.enclosure,
    // Additional fields specific to Afropop
    type: determineContentType(item),
    region: extractRegion(item),
    genre: extractGenre(item),
  }))
}

// Helper function to determine content type
function determineContentType(item: RSSItem): string {
  // Check categories and tags for content type indicators
  const categories = item.categories?.map(cat => cat.toLowerCase()) || []
  
  if (categories.some(cat => cat.includes('episode') || cat.includes('podcast'))) {
    return 'Episode'
  } else if (categories.some(cat => cat.includes('feature') || cat.includes('article') || cat.includes('story'))) {
    return 'Feature'
  } else if (categories.some(cat => cat.includes('event') || cat.includes('concert') || cat.includes('festival'))) {
    return 'Event'
  } else {
    // Default to episode for podcast feeds
    return 'Episode'
  }
}

// Helper function to extract region from item
function extractRegion(item: RSSItem): string | null {
  // Look for region in categories, tags, or content
  const categories = item.categories?.map(cat => cat.toLowerCase()) || []
  
  const regionKeywords = [
    'africa', 'caribbean', 'diaspora', 'west', 'east', 'south', 'north',
    'nigeria', 'ghana', 'senegal', 'kenya', 'egypt', 'morocco', 'tunisia',
    'south africa', 'zimbabwe', 'uganda', 'ethiopia', 'tanzania'
  ]
  
  const foundRegion = categories.find(cat => 
    regionKeywords.some(keyword => cat.includes(keyword))
  )
  
  return foundRegion || null
}

// Helper function to extract genre from item
function extractGenre(item: RSSItem): string | null {
  // Look for genre in categories, tags, or content
  const categories = item.categories?.map(cat => cat.toLowerCase()) || []
  
  const genreKeywords = [
    'highlife', 'afrobeat', 'soukous', 'apapiano', 'taarab', 'juju', 'makossa',
    'mbaqanga', 'kwaito', 'azonto', 'afropop', 'world music', 'traditional'
  ]
  
  const foundGenre = categories.find(cat => 
    genreKeywords.some(keyword => cat.includes(keyword))
  )
  
  return foundGenre || null
}