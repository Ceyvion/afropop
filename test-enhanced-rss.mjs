// test-enhanced-rss.js
async function testEnhancedRSS() {
  try {
    console.log('Testing enhanced RSS service...')
    
    // Dynamically import the enhanced RSS service
    const { getRSSFeed } = await import('./app/lib/rss-service-enhanced')
    
    console.log('Fetching RSS feed...')
    const feedData = await getRSSFeed()
    
    console.log('RSS feed fetched successfully!')
    console.log(`Feed title: ${feedData.title}`)
    console.log(`Feed description: ${feedData.description}`)
    console.log(`Number of items: ${feedData.items.length}`)
    
    if (feedData.items.length > 0) {
      console.log('\nFirst 3 items:')
      feedData.items.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`)
        console.log(`   Type: ${item.type}`)
        console.log(`   Author: ${item.author}`)
        console.log(`   Published: ${item.pubDate}`)
        if (item.region) console.log(`   Region: ${item.region}`)
        if (item.genre) console.log(`   Genre: ${item.genre}`)
        console.log()
      })
    }
    
    console.log('Enhanced RSS service test completed successfully!')
  } catch (error) {
    console.error('Error testing enhanced RSS service:', error.message)
  }
}

testEnhancedRSS()