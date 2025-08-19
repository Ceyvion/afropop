// Test RSS service to see item types
async function testRSS() {
  try {
    console.log('Testing RSS service...');
    
    // Dynamically import the RSS service
    const rssService = await import('./app/lib/rss-service-feedburner.js');
    const { getRSSFeed } = rssService;
    
    console.log('Fetching RSS feed...');
    const feedData = await getRSSFeed();
    console.log('Total items:', feedData.items.length);
    
    // Count items by type
    const typeCounts = {};
    feedData.items.forEach(item => {
      const type = item.type || 'Unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    console.log('Items by type:', typeCounts);
    
    // Show first few items
    console.log('First 5 items:');
    feedData.items.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. Title: ${item.title}`);
      console.log(`   Type: ${item.type}`);
      console.log(`   Categories: ${item.categories ? item.categories.join(', ') : 'None'}`);
      console.log('');
    });
  } catch (error) {
    console.error('RSS test error:', error);
  }
}

// Run the test
testRSS();