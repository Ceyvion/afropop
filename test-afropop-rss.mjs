// test-afropop-rss.js
// Test script to find and verify Afropop Worldwide RSS feed

async function testAfropopRSS() {
  console.log('Testing Afropop Worldwide RSS feed...')
  
  // Common PRX feed patterns
  const possibleUrls = [
    'https://f.prxu.org/afropop/feed-rss.xml',
    'https://f.prxu.org/38411/feed-rss.xml',
    'https://afropop.org/feed/podcast',
    'https://feeds.prx.org/afropop',
    'https://feeds.soundcloud.com/users/soundcloud:users:afropop-worldwide/sounds.rss'
  ]
  
  // Try each URL
  for (const url of possibleUrls) {
    try {
      console.log(`\nTrying: ${url}`)
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Afropop Website Bot)'
        }
      })
      
      console.log(`Status: ${response.status}`)
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        console.log(`Content-Type: ${contentType}`)
        
        if (contentType && (contentType.includes('xml') || contentType.includes('rss'))) {
          const text = await response.text()
          
          // Check if it looks like an RSS feed
          if (text.includes('<rss') || text.includes('<feed')) {
            console.log('✅ SUCCESS! Found valid RSS feed')
            console.log('First 500 characters:')
            console.log(text.substring(0, 500) + '...')
            return url
          }
        }
      }
    } catch (error) {
      console.log(`Error: ${error.message}`)
    }
  }
  
  console.log('\n❌ Could not find valid RSS feed')
  return null
}

testAfropopRSS()