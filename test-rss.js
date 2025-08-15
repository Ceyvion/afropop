// test-rss.js
const { fetchAndParseRSS } = require('./app/lib/rss-parser')

async function testRSS() {
  try {
    console.log('Testing RSS feed integration...')
    
    // Test with a sample RSS feed (you can replace this with the actual Afropop feed)
    const feed = await fetchAndParseRSS('https://feeds.simplecast.com/EpDu11tq')
    
    console.log('Feed Title:', feed.title)
    console.log('Feed Description:', feed.description)
    console.log('Number of items:', feed.items.length)
    
    // Log the first few items
    console.log('\nFirst 3 items:')
    feed.items.slice(0, 3).forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`)
      console.log(`   Published: ${item.pubDate}`)
      console.log(`   Link: ${item.link}`)
      console.log(`   Categories: ${item.categories?.join(', ') || 'None'}`)
      console.log()
    })
    
    console.log('RSS feed integration test completed successfully!')
  } catch (error) {
    console.error('Error testing RSS feed integration:', error)
  }
}

testRSS()