// app/lib/rss-parser.ts
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

// Create a parser instance
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
    ]
  }
})

// Function to fetch and parse an RSS feed
export async function fetchAndParseRSS(url: string): Promise<RSSFeed> {
  try {
    const feed = await parser.parseURL(url)
    return feed
  } catch (error) {
    console.error(`Error fetching or parsing RSS feed from ${url}:`, error)
    throw new Error(`Failed to fetch or parse RSS feed: ${error}`)
  }
}

// Function to normalize RSS items for our application
export function normalizeRSSItems(items: RSSItem[]): any[] {
  return items.map(item => ({
    id: item.guid || item.link,
    title: item.title,
    description: item.summary || item.contentSnippet || '',
    content: item.content,
    link: item.link,
    pubDate: item.pubDate,
    isoDate: item.isoDate,
    author: item.author || item.creator,
    duration: item.duration,
    categories: item.categories || [],
    image: item.image?.$?.href || item.thumbnail?.$?.url || null,
    // Additional fields specific to Afropop
    type: determineContentType(item),
    region: extractRegion(item),
    genre: extractGenre(item),
  }))
}

// Helper function to determine content type
function determineContentType(item: RSSItem): string {
  // This would be customized based on Afropop's RSS structure
  if (item.categories?.includes('episode')) {
    return 'Episode'
  } else if (item.categories?.includes('feature')) {
    return 'Feature'
  } else if (item.categories?.includes('event')) {
    return 'Event'
  } else {
    return 'Episode' // Default to episode
  }
}

// Helper function to extract region from item
function extractRegion(item: RSSItem): string | null {
  // This would be customized based on Afropop's RSS structure
  // Look for region in categories, tags, or content
  const regionCategories = item.categories?.filter(cat => 
    cat.toLowerCase().includes('africa') || 
    cat.toLowerCase().includes('caribbean') ||
    cat.toLowerCase().includes('diaspora')
  )
  
  return regionCategories?.[0] || null
}

// Helper function to extract genre from item
function extractGenre(item: RSSItem): string | null {
  // This would be customized based on Afropop's RSS structure
  // Look for genre in categories, tags, or content
  const genreCategories = item.categories?.filter(cat => 
    cat.toLowerCase().includes('highlife') || 
    cat.toLowerCase().includes('afrobeat') ||
    cat.toLowerCase().includes('soukous') ||
    cat.toLowerCase().includes('apapiano') ||
    cat.toLowerCase().includes('taarab')
  )
  
  return genreCategories?.[0] || null
}