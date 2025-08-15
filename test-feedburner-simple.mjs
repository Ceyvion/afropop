// test-feedburner-simple.mjs
// Simple test script to verify FeedBurner RSS integration

async function testFeedBurnerSimple() {
  console.log('=== Testing FeedBurner RSS Integration (Simple) ===\n')
  
  try {
    // Test the FeedBurner URL directly
    const FEEDBURNER_URL = 'https://feeds.feedburner.com/afropop/podcast'
    
    console.log(`1. Testing FeedBurner URL: ${FEEDBURNER_URL}`)
    
    const response = await fetch(FEEDBURNER_URL)
    
    console.log(`   Status: ${response.status}`)
    console.log(`   OK: ${response.ok}`)
    
    const contentType = response.headers.get('content-type')
    console.log(`   Content-Type: ${contentType}`)
    
    if (response.ok && contentType && contentType.includes('xml')) {
      console.log('✅ FeedBurner URL is accessible and returns XML')
      
      // Try to parse a small portion of the response
      const text = await response.text()
      console.log(`   Response length: ${text.length} characters`)
      
      // Check if it looks like an RSS feed
      if (text.includes('<rss') || text.includes('<feed')) {
        console.log('✅ Response contains RSS/Atom markup')
        
        // Show first 200 characters
        console.log('   First 200 characters:')
        console.log(`   ${text.substring(0, 200)}...`)
        
        console.log('\n🎉 Simple FeedBurner RSS test completed successfully!')
        console.log('\n💡 Next steps:')
        console.log('   1. Update your .env.local file with:')
        console.log('      RSS_PARSER_SERVICE=feedburner')
        console.log('      AFROPOP_RSS_URL=https://feeds.feedburner.com/afropop/podcast')
        console.log('   2. Restart your development server')
        console.log('   3. Test the RSS endpoints:')
        console.log('      - http://localhost:3000/api/rss')
        console.log('      - http://localhost:3000/api/search?q=music')
        console.log('      - http://localhost:3000/api/episodes')
      } else {
        console.log('❌ Response does not appear to be an RSS feed')
      }
    } else {
      console.log('❌ FeedBurner URL is not accessible or does not return XML')
      
      // Try alternative URLs
      const alternativeUrls = [
        'https://afropop.org/feed/podcast',
        'https://f.prxu.org/afropop/feed-rss.xml',
        'https://feeds.prx.org/afropop'
      ]
      
      console.log('\n2. Testing alternative URLs:')
      for (const url of alternativeUrls) {
        try {
          console.log(`   Trying: ${url}`)
          const altResponse = await fetch(url)
          console.log(`   Status: ${altResponse.status} (${altResponse.ok ? 'OK' : 'FAILED'})`)
          
          if (altResponse.ok) {
            const altContentType = altResponse.headers.get('content-type')
            console.log(`   Content-Type: ${altContentType}`)
            
            if (altContentType && altContentType.includes('xml')) {
              console.log(`   ✅ Alternative URL works: ${url}`)
              break
            }
          }
        } catch (error) {
          console.log(`   Error: ${error.message}`)
        }
      }
    }
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

testFeedBurnerSimple()