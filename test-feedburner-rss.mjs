// test-feedburner-rss.mjs
// Test script to verify FeedBurner RSS integration

import { getRSSFeed, searchRSSFeed } from './app/lib/rss-service-feedburner.js'

async function testFeedBurnerRSS() {
  console.log('=== Testing FeedBurner RSS Integration ===\n')
  
  try {
    console.log('1. Testing basic RSS feed fetching...')
    const feedData = await getRSSFeed()
    
    console.log(`✅ Successfully fetched RSS feed`)
    console.log(`   Title: ${feedData.title}`)
    console.log(`   Description: ${feedData.description}`)
    console.log(`   Items: ${feedData.count}`)
    console.log(`   Last Updated: ${feedData.lastUpdated}\n`)
    
    if (feedData.items.length > 0) {
      console.log('2. Showing first 3 items:')
      feedData.items.slice(0, 3).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title}`)
        console.log(`      Type: ${item.type}`)
        console.log(`      Author: ${item.author}`)
        console.log(`      Published: ${item.pubDate}`)
        if (item.region) console.log(`      Region: ${item.region}`)
        if (item.genre) console.log(`      Genre: ${item.genre}`)
        console.log()
      })
    }
    
    console.log('3. Testing search functionality...')
    const searchResults = await searchRSSFeed('music')
    
    console.log(`✅ Search returned ${searchResults.count} results`)
    if (searchResults.items.length > 0) {
      console.log('   First search result:')
      const item = searchResults.items[0]
      console.log(`     ${item.title}`)
      console.log(`     Type: ${item.type}`)
      console.log(`     Published: ${item.pubDate}`)
    }
    
    console.log('\n🎉 FeedBurner RSS integration test completed successfully!')
    console.log('\n💡 Next steps:')
    console.log('   1. Update your .env.local file with:')
    console.log('      RSS_PARSER_SERVICE=feedburner')
    console.log('      AFROPOP_RSS_URL=https://feeds.feedburner.com/afropop/podcast')
    console.log('   2. Restart your development server')
    console.log('   3. Test the RSS endpoints:')
    console.log('      - http://localhost:3000/api/rss')
    console.log('      - http://localhost:3000/api/search?q=music')
    console.log('      - http://localhost:3000/api/episodes')
    
  } catch (error) {
    console.error('❌ Error testing FeedBurner RSS integration:')
    console.error(`   ${error.message}`)
    console.log('\n🔧 Troubleshooting tips:')
    console.log('   1. Check if the FeedBurner URL is accessible in your browser')
    console.log('   2. Verify your internet connection')
    console.log('   3. Check if the RSS feed requires authentication')
    console.log('   4. Try alternative RSS feed URLs')
  }
}

testFeedBurnerRSS()