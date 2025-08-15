// test-rss-proxy.js
async function testRSSProxy() {
  try {
    console.log('Testing RSS proxy...')
    
    // Test with a sample podcast RSS feed
    const testUrl = 'https://feeds.simplecast.com/EpDu11tq'
    
    // Make a request to our proxy API
    const response = await fetch(`http://localhost:3000/api/rss-proxy?url=${encodeURIComponent(testUrl)}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('RSS proxy test successful!')
      console.log(`Feed title: ${data.title}`)
      console.log(`Number of items: ${data.items.length}`)
    } else {
      console.log(`RSS proxy test failed with status ${response.status}`)
      const error = await response.text()
      console.log(`Error: ${error}`)
    }
  } catch (error) {
    console.log('RSS proxy test failed with error:')
    console.log(error.message)
  }
}

testRSSProxy()