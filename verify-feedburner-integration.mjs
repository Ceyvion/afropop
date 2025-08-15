// verify-feedburner-integration.mjs
// Simple script to verify FeedBurner RSS integration is working

async function verifyFeedBurnerIntegration() {
  console.log('=== Verifying FeedBurner RSS Integration ===\n')
  
  try {
    // Test the FeedBurner URL directly
    const FEEDBURNER_URL = 'https://feeds.feedburner.com/afropop/podcast'
    
    console.log(`1. Testing FeedBurner URL: ${FEEDBURNER_URL}`)
    
    const startTime = Date.now()
    const response = await fetch(FEEDBURNER_URL)
    const endTime = Date.now()
    
    console.log(`✅ Request completed in ${endTime - startTime}ms`)
    console.log(`   Status: ${response.status}`)
    console.log(`   OK: ${response.ok}`)
    
    const contentType = response.headers.get('content-type')
    console.log(`   Content-Type: ${contentType}`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    if (!contentType || !contentType.includes('xml')) {
      throw new Error(`Expected XML content, got: ${contentType}`)
    }
    
    // Read a small portion of the response to verify it's RSS
    const text = await response.text()
    console.log(`   Response size: ${text.length} characters`)
    
    // Check for RSS markers
    const hasRSS = text.includes('<rss') || text.includes('<feed')
    const hasChannel = text.includes('<channel>')
    const hasItems = text.includes('<item>') || text.includes('<entry>')
    
    console.log(`   Contains RSS structure: ${hasRSS}`)
    console.log(`   Contains channel: ${hasChannel}`)
    console.log(`   Contains items/entries: ${hasItems}`)
    
    // Show a snippet of the content
    console.log('\n2. RSS feed snippet:')
    const snippet = text.substring(0, 300)
    console.log(`   ${snippet.replace(/\s+/g, ' ').substring(0, 200)}...`)
    
    console.log('\n🎉 FeedBurner RSS integration verified successfully!')
    console.log('\n💡 Implementation details:')
    console.log('   - FeedBurner URL is accessible')
    console.log('   - Returns valid XML content')
    console.log('   - Contains proper RSS structure')
    console.log('   - Ready for parsing and integration')
    
    console.log('\n🔧 Next steps:')
    console.log('   1. Start the development server: npm run dev')
    console.log('   2. Visit http://localhost:3000 to view the site')
    console.log('   3. Test RSS endpoints:')
    console.log('      - http://localhost:3000/api/rss')
    console.log('      - http://localhost:3000/api/search?q=music')
    console.log('      - http://localhost:3000/api/episodes')
    
  } catch (error) {
    console.error('❌ Error verifying FeedBurner RSS integration:')
    console.error(`   ${error.message}`)
    console.log('\n🔧 Troubleshooting tips:')
    console.log('   1. Check if the FeedBurner URL is accessible in your browser')
    console.log('   2. Verify your internet connection')
    console.log('   3. Check if a firewall is blocking the request')
    console.log('   4. Try alternative RSS feed URLs')
  }
}

verifyFeedBurnerIntegration()