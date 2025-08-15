// app/lib/rss-service-feedburner.js
// Enhanced RSS service implementation using FeedBurner for Afropop Worldwide

const Parser = require('rss-parser')

// Configuration
const AFROPOP_RSS_URL = 'https://feeds.feedburner.com/afropop/podcast'
const ALTERNATIVE_RSS_URLS = [
  'https://afropop.org/feed/podcast',
  'https://f.prxu.org/afropop/feed-rss.xml',
  'https://feeds.prx.org/afropop'
]
const RSS_REQUEST_HEADERS = {
  'User-Agent': 'Afropop Worldwide Website Client (+https://afropop.org)',
  'Accept': 'application/xml,text/xml,*/*',
  'Accept-Encoding': 'gzip, deflate, br'
}
const RSS_CACHE_TIMEOUT = 5 * 60 * 1000 // 5 minutes in milliseconds

// Create parser
const parser = new Parser({
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

// Cache
let cachedFeed = null

// Function to fetch and parse RSS feed
async function fetchAndParseRSS() {
  try {
    console.log(`Fetching RSS feed from FeedBurner: ${AFROPOP_RSS_URL}`)
    
    const response = await fetch(AFROPOP_RSS_URL, {
      headers: RSS_REQUEST_HEADERS
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`)
    }
    
    const xml = await response.text()
    const feed = await parser.parseString(xml)
    
    console.log(`Successfully parsed RSS feed with ${feed.items.length} items`)
    return feed
  } catch (error) {
    console.error('Error fetching from primary FeedBurner URL:', error)
    
    // Try alternative URLs
    for (const url of ALTERNATIVE_RSS_URLS) {
      try {
        console.log(`Trying alternative RSS feed: ${url}`)
        
        const response = await fetch(url, {
          headers: RSS_REQUEST_HEADERS
        })
        
        if (!response.ok) {
          continue
        }
        
        const xml = await response.text()
        const feed = await parser.parseString(xml)
        
        console.log(`Successfully parsed alternative RSS feed with ${feed.items.length} items`)
        return feed
      } catch (altError) {
        console.error(`Error fetching from alternative URL ${url}:`, altError)
        continue
      }
    }
    
    // If all URLs fail, re-throw the original error
    throw new Error(`Failed to fetch RSS feed from all sources: ${error}`)
  }
}

// Function to get RSS feed data with caching
async function getRSSFeed() {
  // Check if we have cached data that's still valid
  if (cachedFeed && Date.now() - cachedFeed.timestamp < RSS_CACHE_TIMEOUT) {
    console.log('Returning cached RSS feed data')
    return cachedFeed.data
  }

  try {
    // Fetch and parse the RSS feed
    const feed = await fetchAndParseRSS()
    
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
    
    console.log(`Returning fresh RSS feed data with ${data.count} items`)
    return data
  } catch (error) {
    console.error('Error in getRSSFeed:', error)
    throw new Error(`Failed to get RSS feed: ${error}`)
  }
}

// Function to normalize RSS items for our application
function normalizeRSSItems(items) {
  return items.map(item => ({
    id: item.guid || item.link,
    title: item.title || 'Untitled',
    description: item.summary || item.contentSnippet || item.description || '',
    content: item.content,
    link: item.link,
    pubDate: item.pubDate,
    isoDate: item.isoDate,
    author: item.author || item.creator || 'Afropop Worldwide',
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
function determineContentType(item) {
  // This would be customized based on Afropop's RSS structure
  // Look for type in categories, tags, or content
  const categories = item.categories?.map(cat => cat.toLowerCase()) || []
  
  if (categories.some(cat => cat.includes('episode') || cat.includes('podcast'))) {
    return 'Episode'
  } else if (categories.some(cat => cat.includes('feature') || cat.includes('article') || cat.includes('story'))) {
    return 'Feature'
  } else if (categories.some(cat => cat.includes('event') || cat.includes('concert') || cat.includes('festival'))) {
    return 'Event'
  } else {
    return 'Episode' // Default to episode
  }
}

// Helper function to extract region from item
function extractRegion(item) {
  // This would be customized based on Afropop's RSS structure
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
function extractGenre(item) {
  // This would be customized based on Afropop's RSS structure
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

// Function to search RSS feed items
async function searchRSSFeed(query, filters = {}) {
  try {
    // Get the RSS feed data
    const feedData = await getRSSFeed()
    
    // Filter items based on search query and filters
    let filteredItems = feedData.items.filter(item => {
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
    filteredItems.sort((a, b) => {
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
    console.error('Error in searchRSSFeed:', error)
    throw new Error(`Failed to search RSS feed: ${error}`)
  }
}

// Function to get a specific item by ID
async function getRSSItemById(id) {
  try {
    const feedData = await getRSSFeed()
    const item = feedData.items.find(item => item.id === id)
    
    if (!item) {
      throw new Error(`Item with ID ${id} not found`)
    }
    
    return item
  } catch (error) {
    console.error('Error in getRSSItemById:', error)
    throw new Error(`Failed to get RSS item: ${error}`)
  }
}

// Function to get items by type
async function getRSSItemsByType(type) {
  try {
    const feedData = await getRSSFeed()
    const items = feedData.items.filter(item => 
      item.type.toLowerCase() === type.toLowerCase()
    )
    
    // Sort by date (newest first)
    items.sort((a, b) => {
      const dateA = new Date(a.isoDate || a.pubDate || '')
      const dateB = new Date(b.isoDate || b.pubDate || '')
      return dateB.getTime() - dateA.getTime()
    })
    
    return items
  } catch (error) {
    console.error('Error in getRSSItemsByType:', error)
    throw new Error(`Failed to get RSS items by type: ${error}`)
  }
}

// Function to refresh the RSS feed cache
async function refreshRSSFeed() {
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
    console.error('Error in refreshRSSFeed:', error)
    throw new Error(`Failed to refresh RSS feed: ${error}`)
  }
}

// Export all functions
module.exports = {
  fetchAndParseRSS,
  getRSSFeed,
  searchRSSFeed,
  getRSSItemById,
  getRSSItemsByType,
  refreshRSSFeed
}