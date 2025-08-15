// final-verification.mjs
// Final verification script to confirm RSS integration is working correctly

async function finalVerification() {
  console.log('=== Final RSS Integration Verification ===\n')
  
  try {
    // Test 1: Verify FeedBurner URL accessibility
    console.log('1. Testing FeedBurner URL accessibility...')
    const FEEDBURNER_URL = 'https://feeds.feedburner.com/afropop/podcast'
    
    const response = await fetch(FEEDBURNER_URL)
    console.log(`   Status: ${response.status} (${response.ok ? 'OK' : 'FAILED'})`)
    
    const contentType = response.headers.get('content-type')
    console.log(`   Content-Type: ${contentType}`)
    
    if (!response.ok || !contentType || !contentType.includes('xml')) {
      throw new Error('FeedBurner URL is not accessible or not returning XML')
    }
    
    console.log('✅ FeedBurner URL is accessible and returns XML\n')
    
    // Test 2: Verify RSS service functions
    console.log('2. Testing RSS service functions...')
    
    // Dynamically import the RSS service
    const rssService = await import('./app/lib/rss-service-feedburner.js')
    const { getRSSFeed, searchRSSFeed, getRSSItemsByType } = rssService
    
    console.log('   ✅ RSS service functions imported successfully')
    
    // Test 3: Verify getRSSFeed function
    console.log('3. Testing getRSSFeed function...')
    const startTime = Date.now()
    const feedData = await getRSSFeed()
    const endTime = Date.now()
    
    console.log(`   ✅ getRSSFeed executed successfully in ${endTime - startTime}ms`)
    console.log(`   Title: ${feedData.title}`)
    console.log(`   Items: ${feedData.count}\n`)
    
    // Test 4: Verify searchRSSFeed function
    console.log('4. Testing searchRSSFeed function...')
    const searchStartTime = Date.now()
    const searchResults = await searchRSSFeed('music')
    const searchEndTime = Date.now()
    
    console.log(`   ✅ searchRSSFeed executed successfully in ${searchEndTime - searchStartTime}ms`)
    console.log(`   Found ${searchResults.count} results for "music"\n`)
    
    // Test 5: Verify getRSSItemsByType function
    console.log('5. Testing getRSSItemsByType function...')
    const episodesStartTime = Date.now()
    const episodes = await getRSSItemsByType('Episode')
    const episodesEndTime = Date.now()
    
    console.log(`   ✅ getRSSItemsByType executed successfully in ${episodesEndTime - episodesStartTime}ms`)
    console.log(`   Found ${episodes.length} episodes\n`)
    
    console.log('🎉 Final verification completed successfully!')
    console.log('\n📋 Summary of verified components:')
    console.log('   ✅ FeedBurner RSS URL accessibility')
    console.log('   ✅ RSS service functions')
    console.log('   ✅ getRSSFeed function')
    console.log('   ✅ searchRSSFeed function')
    console.log('   ✅ getRSSItemsByType function')
    
    console.log('\n🚀 RSS integration is ready for production!')
    
  } catch (error) {
    console.error('❌ Error during final verification:')
    console.error(`   ${error.message}`)
    console.log('\n🔧 Troubleshooting steps:')
    console.log('   1. Check if the development server is running: npm run dev')
    console.log('   2. Verify FeedBurner URL accessibility in browser')
    console.log('   3. Check network connectivity')
    console.log('   4. Verify all dependencies are installed: npm install')
    console.log('   5. Check environment variables')
  }
}

finalVerification()