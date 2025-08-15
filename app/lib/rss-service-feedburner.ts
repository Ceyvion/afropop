// app/lib/rss-service-feedburner.ts
// RSS service implementation using FeedBurner for Afropop Worldwide

import * as Parser from 'rss-parser'
import { AFROPOP_RSS_URL, ALTERNATIVE_RSS_URLS, RSS_REQUEST_HEADERS, RSS_CACHE_TIMEOUT } from './rss-config'

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
const parser: any = new (Parser as any)({
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

// Cache for RSS feed data
let cachedFeed: {
  data: any
  timestamp: number
} | null = null

// Function to fetch and parse RSS feed with FeedBurner
export async function fetchAndParseRSS(): Promise<RSSFeed> {
  try {
    // Try the primary FeedBurner URL first
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
export async function getRSSFeed() {
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
export function normalizeRSSItems(items: RSSItem[]): any[] {
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
    enclosure: item.enclosure,
    // Additional fields specific to Afropop
    type: determineContentType(item),
    region: extractRegion(item),
    genre: extractGenre(item),
  }))
}

// Helper function to determine content type
function determineContentType(item: RSSItem): string {
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
function extractRegion(item: RSSItem): string | null {
  // Look for region in categories, tags, or content
  const categories = item.categories?.map(cat => cat.toLowerCase()) || []
  
  // More specific region detection
  const regionMap: { [key: string]: string } = {
    'nigeria': 'Nigeria',
    'ghana': 'Ghana',
    'senegal': 'Senegal',
    'kenya': 'Kenya',
    'egypt': 'Egypt',
    'morocco': 'Morocco',
    'tunisia': 'Tunisia',
    'south africa': 'South Africa',
    'zimbabwe': 'Zimbabwe',
    'uganda': 'Uganda',
    'ethiopia': 'Ethiopia',
    'tanzania': 'Tanzania',
    'cameroon': 'Cameroon',
    'ivory coast': 'Ivory Coast',
    'benin': 'Benin',
    'angola': 'Angola',
    'algeria': 'Algeria',
    'libya': 'Libya',
    'mauritania': 'Mauritania',
    'mali': 'Mali',
    'burkina faso': 'Burkina Faso',
    'niger': 'Niger',
    'chad': 'Chad',
    'sudan': 'Sudan',
    'eritrea': 'Eritrea',
    'djibouti': 'Djibouti',
    'somalia': 'Somalia',
    'rwanda': 'Rwanda',
    'burundi': 'Burundi',
    'congo': 'Congo',
    'drc': 'DRC',
    'gabon': 'Gabon',
    'equatorial guinea': 'Equatorial Guinea',
    'central african republic': 'Central African Republic',
    'botswana': 'Botswana',
    'namibia': 'Namibia',
    'lesotho': 'Lesotho',
    'swaziland': 'Swaziland',
    'madagascar': 'Madagascar',
    'mozambique': 'Mozambique',
    'zambia': 'Zambia',
    'malawi': 'Malawi',
    'sierra leone': 'Sierra Leone',
    'liberia': 'Liberia',
    'guinea': 'Guinea',
    'gambia': 'Gambia',
    'cape verde': 'Cape Verde',
    'sao tome': 'Sao Tome',
    'seychelles': 'Seychelles',
    'comoros': 'Comoros',
    'mauritius': 'Mauritius',
    'reunion': 'Reunion',
    'mayotte': 'Mayotte',
    'western sahara': 'Western Sahara',
    'sahrawi': 'Western Sahara',
    'caribbean': 'Caribbean',
    'jamaica': 'Jamaica',
    'haiti': 'Haiti',
    'cuba': 'Cuba',
    'dominican republic': 'Dominican Republic',
    'puerto rico': 'Puerto Rico',
    'trinidad and tobago': 'Trinidad and Tobago',
    'barbados': 'Barbados',
    'bahamas': 'Bahamas',
    'grenada': 'Grenada',
    'saint lucia': 'Saint Lucia',
    'saint vincent': 'Saint Vincent',
    'antigua': 'Antigua',
    'dominica': 'Dominica',
    'st kitts': 'St Kitts',
    'belize': 'Belize',
    'guyana': 'Guyana',
    'suriname': 'Suriname',
    'french guiana': 'French Guiana',
    'diaspora': 'Diaspora',
    'african diaspora': 'Diaspora',
    'afro caribbean': 'Afro Caribbean',
    'afro latin': 'Afro Latin',
    'afro brazilian': 'Afro Brazilian',
    'afro cuban': 'Afro Cuban'
  }
  
  // Check for specific regions first
  for (const [keyword, region] of Object.entries(regionMap)) {
    if (categories.some(cat => cat.includes(keyword))) {
      return region
    }
  }
  
  // Check for broader regions
  const broadRegions = [
    'africa', 'west africa', 'east africa', 'south africa', 'north africa', 'central africa',
    'caribbean', 'latin america', 'north america', 'south america', 'europe', 'asia', 'oceania'
  ]
  
  const foundRegion = categories.find(cat => 
    broadRegions.some(region => cat.includes(region))
  )
  
  return foundRegion ? foundRegion.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join(' ') : null
}

// Helper function to extract genre from item
function extractGenre(item: RSSItem): string | null {
  // Look for genre in categories, tags, or content
  const categories = item.categories?.map(cat => cat.toLowerCase()) || []
  
  // More specific genre detection
  const genreMap: { [key: string]: string } = {
    'afrobeat': 'Afrobeat',
    'afrobeats': 'Afrobeats',
    'highlife': 'Highlife',
    'soukous': 'Soukous',
    'sakara': 'Sakara',
    'apala': 'Apala',
    'juju': 'Juju',
    'fuji': 'Fuji',
    'waka': 'Waka',
    'makossa': 'Makossa',
    'bikutsi': 'Bikutsi',
    'mbaqanga': 'Mbaqanga',
    'kwaito': 'Kwaito',
    'gqom': 'Gqom',
    'amapiano': 'Amapiano',
    'azonto': 'Azonto',
    'afropop': 'Afropop',
    'afro pop': 'Afropop',
    'world music': 'World Music',
    'traditional': 'Traditional',
    'folk': 'Folk',
    'griot': 'Griot',
    'mbube': 'Mbube',
    'maskandi': 'Maskandi',
    'taarab': 'Taarab',
    'bongo flava': 'Bongo Flava',
    'azawakh': 'Azawakh',
    'tishoumaren': 'Tishoumaren',
    'assiko': 'Assiko',
    'ndombolo': 'Ndombolo',
    'salsa': 'Salsa',
    'reggae': 'Reggae',
    'dancehall': 'Dancehall',
    'calypso': 'Calypso',
    'soca': 'Soca',
    'compay': 'Compay',
    'son cubano': 'Son Cubano',
    'rumba': 'Rumba',
    'conga': 'Conga',
    'mambo': 'Mambo',
    'cha cha': 'Cha Cha',
    'merengue': 'Merengue',
    'bachata': 'Bachata',
    'samba': 'Samba',
    'bossa nova': 'Bossa Nova',
    'forro': 'Forro',
    'reggaeton': 'Reggaeton',
    'hip hop': 'Hip Hop',
    'rap': 'Rap',
    'jazz': 'Jazz',
    'blues': 'Blues',
    'soul': 'Soul',
    'funk': 'Funk',
    'r&b': 'R&B',
    'gospel': 'Gospel',
    'electro': 'Electronic',
    'house': 'House',
    'techno': 'Techno',
    'dub': 'Dub',
    'rock': 'Rock',
    'metal': 'Metal',
    'punk': 'Punk',
    'indie': 'Indie',
    'pop': 'Pop',
    'classical': 'Classical',
    'orchestral': 'Orchestral'
  }
  
  // Check for specific genres first
  for (const [keyword, genre] of Object.entries(genreMap)) {
    if (categories.some(cat => cat.includes(keyword))) {
      return genre
    }
  }
  
  // If no specific genre found, return a broader category
  return 'World Music'
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
    console.error('Error in searchRSSFeed:', error)
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
    console.error('Error in getRSSItemById:', error)
    throw new Error(`Failed to get RSS item: ${error}`)
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
    console.error('Error in getRSSItemsByType:', error)
    throw new Error(`Failed to get RSS items by type: ${error}`)
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
    console.error('Error in refreshRSSFeed:', error)
    throw new Error(`Failed to refresh RSS feed: ${error}`)
  }
}