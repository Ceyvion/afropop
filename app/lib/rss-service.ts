// app/lib/rss-service.ts
import { RSSFeed, fetchAndParseRSS, normalizeRSSItems } from '@/app/lib/rss-utils'

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
    // Fetch and parse the RSS feed
    const feed: RSSFeed = await fetchAndParseRSS(AFROPOP_RSS_URL)
    
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
    
    // Cache the data
    cachedFeed = {
      data,
      timestamp: Date.now()
    }
    
    return data
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    throw new Error(`Failed to fetch RSS feed: ${error}`)
  }
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