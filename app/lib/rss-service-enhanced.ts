// app/lib/rss-service-enhanced.ts
// Enhanced RSS service using third-party parsing services

// Configuration for RSS parsing service
const RSS_PARSER_SERVICE = 'https://api.rss.app/v1' // Example service
const RSS_PARSER_API_KEY = process.env.RSS_PARSER_API_KEY || ''

// In a real implementation, this would be the actual Afropop RSS feed URL
const AFROPOP_RSS_URL = 'https://afropop.org/feed/podcast'

// Cache for RSS feed data
let cachedFeed: {
  data: any
  timestamp: number
} | null = null

// Cache timeout (5 minutes)
const CACHE_TIMEOUT = 5 * 60 * 1000

// Function to get RSS feed data with caching
export async function getRSSFeed() {
  // Check if we have cached data that's still valid
  if (cachedFeed && Date.now() - cachedFeed.timestamp < CACHE_TIMEOUT) {
    return cachedFeed.data
  }

  try {
    // Try to fetch from third-party service first
    const feedData = await fetchFromThirdPartyService()
    
    // Cache the data
    cachedFeed = {
      data: feedData,
      timestamp: Date.now()
    }
    
    return feedData
  } catch (error) {
    console.warn('Third-party RSS service failed, falling back to direct parsing:', error)
    
    // Fallback to direct parsing
    try {
      const feedData = await fetchAndParseDirectly()
      
      // Cache the data
      cachedFeed = {
        data: feedData,
        timestamp: Date.now()
      }
      
      return feedData
    } catch (fallbackError) {
      console.error('Both RSS parsing methods failed:', fallbackError)
      throw new Error(`Failed to fetch RSS feed: ${fallbackError}`)
    }
  }
}

// Function to fetch from third-party RSS parsing service
async function fetchFromThirdPartyService() {
  // If we have an API key for a third-party service, use it
  if (RSS_PARSER_API_KEY) {
    try {
      const response = await fetch(
        `${RSS_PARSER_SERVICE}/feed?url=${encodeURIComponent(AFROPOP_RSS_URL)}`,
        {
          headers: {
            'Authorization': `Bearer ${RSS_PARSER_API_KEY}`,
            'User-Agent': 'Afropop Worldwide Website Client'
          }
        }
      )
      
      if (!response.ok) {
        throw new Error(`Third-party service error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      return normalizeThirdPartyData(data)
    } catch (error) {
      console.error('Error fetching from third-party service:', error)
      throw error
    }
  }
  
  // If no API key, try a free service or fall back to direct parsing
  throw new Error('No third-party RSS service API key configured')
}

// Function to fetch and parse RSS feed directly
async function fetchAndParseDirectly() {
  try {
    // Fetch the RSS feed
    const response = await fetch(AFROPOP_RSS_URL, {
      headers: {
        'User-Agent': 'Afropop Worldwide Website Client'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`)
    }
    
    // Get the response as text
    const xml = await response.text()
    
    // Parse the RSS feed using our internal parser
    const feed = await parseRSSFeed(xml)
    
    // Normalize the items for our application
    const normalizedItems = normalizeRSSItems(feed.items)
    
    // Create the response data
    const data = {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      items: normalizedItems,
      count: normalizedItems.length,
      lastUpdated: new Date().toISOString()
    }
    
    return data
  } catch (error) {
    console.error('Error fetching or parsing RSS feed directly:', error)
    throw error
  }
}

// Function to parse RSS feed using internal parser
async function parseRSSFeed(xml: string) {
  // Dynamically import rss-parser to avoid server-side issues
  const Parser = (await import('rss-parser')).default
  
  // Create a parser instance with custom fields for podcast feeds
  const parser: any = new Parser({
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
  
  // Parse the RSS feed
  const feed = await parser.parseString(xml)
  return feed
}

// Function to normalize data from third-party service
function normalizeThirdPartyData(data: any): any {
  // This would depend on the specific third-party service format
  // For now, we'll assume it returns a similar structure to our direct parsing
  return {
    title: data.title,
    description: data.description,
    link: data.link,
    items: data.items.map((item: any) => ({
      id: item.guid || item.link,
      title: item.title,
      description: item.summary || item.contentSnippet || item.description || '',
      content: item.content,
      link: item.link,
      pubDate: item.pubDate,
      isoDate: item.isoDate,
      author: item.author || item.creator || 'Unknown',
      duration: item.duration,
      categories: item.categories || [],
      image: item.image?.$?.href || item.thumbnail?.$?.url || null,
      type: determineContentType(item),
      region: extractRegion(item),
      genre: extractGenre(item),
    })),
    count: data.items.length,
    lastUpdated: new Date().toISOString()
  }
}

// Function to normalize RSS items for our application
function normalizeRSSItems(items: any[]): any[] {
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
    // Additional fields specific to Afropop
    type: determineContentType(item),
    region: extractRegion(item),
    genre: extractGenre(item),
  }))
}

// Helper function to determine content type
function determineContentType(item: any): string {
  // This would be customized based on Afropop's RSS structure
  const categories = item.categories?.map((cat: string) => cat.toLowerCase()) || []
  
  if (categories.some((cat: string) => cat.includes('episode') || cat.includes('podcast'))) {
    return 'Episode'
  } else if (categories.some((cat: string) => cat.includes('feature') || cat.includes('article') || cat.includes('story'))) {
    return 'Feature'
  } else if (categories.some((cat: string) => cat.includes('event') || cat.includes('concert') || cat.includes('festival'))) {
    return 'Event'
  } else {
    return 'Episode' // Default to episode
  }
}

// Helper function to extract region from item
function extractRegion(item: any): string | null {
  // This would be customized based on Afropop's RSS structure
  const categories = item.categories?.map((cat: string) => cat.toLowerCase()) || []
  
  const regionKeywords = [
    'africa', 'caribbean', 'diaspora', 'west', 'east', 'south', 'north',
    'nigeria', 'ghana', 'senegal', 'kenya', 'egypt', 'morocco', 'tunisia',
    'south africa', 'zimbabwe', 'uganda', 'ethiopia', 'tanzania'
  ]
  
  const foundRegion = categories.find((cat: string) => 
    regionKeywords.some(keyword => cat.includes(keyword))
  )
  
  return foundRegion || null
}

// Helper function to extract genre from item
function extractGenre(item: any): string | null {
  // This would be customized based on Afropop's RSS structure
  const categories = item.categories?.map((cat: string) => cat.toLowerCase()) || []
  
  const genreKeywords = [
    'highlife', 'afrobeat', 'soukous', 'apapiano', 'taarab', 'juju', 'makossa',
    'mbaqanga', 'kwaito', 'azonto', 'afropop', 'world music', 'traditional'
  ]
  
  const foundGenre = categories.find((cat: string) => 
    genreKeywords.some(keyword => cat.includes(keyword))
  )
  
  return foundGenre || null
}

// Function to search RSS feed items
export async function searchRSSFeed(query: string, filters: {
  type?: string
  region?: string
  genre?: string
  dateFrom?: string
  dateTo?: string
} = {}) {
  try {
    // Get the RSS feed data
    const feedData = await getRSSFeed()
    
    // Filter items based on search query and filters
    let filteredItems = feedData.items.filter((item: any) => {
      // Check search query against title, description, and content
      const matchesQuery = !query || 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(query.toLowerCase()))
      
      // Check type filter
      const matchesType = !filters.type || item.type.toLowerCase() === filters.type.toLowerCase()
      
      // Check region filter
      const matchesRegion = !filters.region || 
        (item.region && item.region.toLowerCase().includes(filters.region.toLowerCase()))
      
      // Check genre filter
      const matchesGenre = !filters.genre || 
        (item.genre && item.genre.toLowerCase().includes(filters.genre.toLowerCase()))
      
      // Check date filters
      let matchesDate = true
      if (filters.dateFrom || filters.dateTo) {
        const itemDate = new Date(item.isoDate || item.pubDate || '')
        if (filters.dateFrom && itemDate < new Date(filters.dateFrom)) {
          matchesDate = false
        }
        if (filters.dateTo && itemDate > new Date(filters.dateTo)) {
          matchesDate = false
        }
      }
      
      return matchesQuery && matchesType && matchesRegion && matchesGenre && matchesDate
    })
    
    // Sort by date (newest first)
    filteredItems.sort((a: any, b: any) => {
      const dateA = new Date(a.isoDate || a.pubDate || '')
      const dateB = new Date(b.isoDate || b.pubDate || '')
      return dateB.getTime() - dateA.getTime()
    })
    
    return {
      items: filteredItems,
      count: filteredItems.length,
      query,
      filters
    }
  } catch (error) {
    console.error('Error searching RSS feed:', error)
    throw new Error(`Failed to search RSS feed: ${error}`)
  }
}

// Function to get a specific item by ID
export async function getRSSItemById(id: string) {
  try {
    const feedData = await getRSSFeed()
    const item = feedData.items.find((item: any) => item.id === id)
    
    if (!item) {
      throw new Error(`Item with ID ${id} not found`)
    }
    
    return item
  } catch (error) {
    console.error('Error fetching RSS item:', error)
    throw new Error(`Failed to fetch RSS item: ${error}`)
  }
}

// Function to get items by type
export async function getRSSItemsByType(type: string) {
  try {
    const feedData = await getRSSFeed()
    const items = feedData.items.filter((item: any) => 
      item.type.toLowerCase() === type.toLowerCase()
    )
    
    // Sort by date (newest first)
    items.sort((a: any, b: any) => {
      const dateA = new Date(a.isoDate || a.pubDate || '')
      const dateB = new Date(b.isoDate || b.pubDate || '')
      return dateB.getTime() - dateA.getTime()
    })
    
    return items
  } catch (error) {
    console.error('Error fetching RSS items by type:', error)
    throw new Error(`Failed to fetch RSS items by type: ${error}`)
  }
}

// Function to refresh the RSS feed cache
export async function refreshRSSFeed() {
  try {
    // Clear the cache
    cachedFeed = null
    
    // Fetch fresh data
    const feedData = await getRSSFeed()
    
    return {
      message: 'RSS feed refreshed successfully',
      count: feedData.count,
      lastUpdated: feedData.lastUpdated
    }
  } catch (error) {
    console.error('Error refreshing RSS feed:', error)
    throw new Error(`Failed to refresh RSS feed: ${error}`)
  }
}