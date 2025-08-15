// verify-rss-implementation.mjs
// Script to verify the RSS implementation is working correctly

async function verifyRSSImplementation() {
  console.log('=== Verifying RSS Implementation ===\n')
  
  try {
    // Test the RSS service directly
    console.log('1. Testing RSS service import...')
    
    // Dynamically import the RSS service
    const { getRSSFeed } = await import('./app/lib/rss-service-feedburner.ts')
    
    console.log('✅ RSS service imported successfully\n')
    
    // Test fetching RSS feed data
    console.log('2. Testing RSS feed fetching...')
    
    const startTime = Date.now()
    const feedData = await getRSSFeed()
    const endTime = Date.now()
    
    console.log(`✅ RSS feed fetched successfully in ${endTime - startTime}ms`)
    console.log(`   Title: ${feedData.title}`)
    console.log(`   Description: ${feedData.description}`)
    console.log(`   Items: ${feedData.count}`)
    console.log(`   Last Updated: ${feedData.lastUpdated}\n`)
    
    // Show first few items
    if (feedData.items.length > 0) {
      console.log('3. Sample items:')
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
    
    // Test search functionality
    console.log('4. Testing search functionality...')
    const { searchRSSFeed } = await import('./app/lib/rss-service-feedburner.ts')
    
    const searchStartTime = Date.now()
    const searchResults = await searchRSSFeed('music')
    const searchEndTime = Date.now()
    
    console.log(`✅ Search completed successfully in ${searchEndTime - searchStartTime}ms`)
    console.log(`   Found ${searchResults.count} results for "music"\n`)
    
    // Test episodes fetching
    console.log('5. Testing episodes fetching...')
    const { getRSSItemsByType } = await import('./app/lib/rss-service-feedburner.ts')
    
    const episodesStartTime = Date.now()
    const episodes = await getRSSItemsByType('Episode')
    const episodesEndTime = Date.now()
    
    console.log(`✅ Episodes fetched successfully in ${episodesEndTime - episodesStartTime}ms`)
    console.log(`   Found ${episodes.length} episodes\n`)
    
    console.log('🎉 RSS implementation verification completed successfully!')
    console.log('\n💡 Next steps:')
    console.log('   1. Start the development server: npm run dev')
    console.log('   2. Visit http://localhost:3000 to view the site')
    console.log('   3. Test RSS endpoints:')
    console.log('      - http://localhost:3000/api/rss')
    console.log('      - http://localhost:3000/api/search?q=music')
    console.log('      - http://localhost:3000/api/episodes')
    
  } catch (error) {
    console.error('❌ Error verifying RSS implementation:')
    console.error(`   ${error.message}`)
    console.log('\n🔧 Troubleshooting tips:')
    console.log('   1. Check if all dependencies are installed: npm install')
    console.log('   2. Verify the RSS service file exists and is correctly formatted')
    console.log('   3. Check if the TypeScript compiler is working correctly')
    console.log('   4. Ensure environment variables are correctly configured')
  }
}

verifyRSSImplementation()