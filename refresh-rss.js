// refresh-rss.js
const { refreshRSSFeed } = require('./app/lib/rss-service')

async function refreshRSS() {
  try {
    console.log('Refreshing RSS feed cache...')
    
    const result = await refreshRSSFeed()
    
    console.log('RSS feed refresh result:')
    console.log(`Message: ${result.message}`)
    console.log(`Items count: ${result.count}`)
    console.log(`Last updated: ${result.lastUpdated}`)
    
    console.log('RSS feed cache refreshed successfully!')
  } catch (error) {
    console.error('Error refreshing RSS feed cache:', error)
  }
}

refreshRSS()