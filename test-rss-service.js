// Test RSS service
async function testRSS() {
  try {
    console.log('Testing RSS service...');
    
    // Dynamically import the RSS service
    const rssService = await import('./app/lib/rss-service-feedburner.js');
    const { getRSSItemsByType } = rssService;
    
    console.log('Fetching episodes...');
    const episodes = await getRSSItemsByType('Episode');
    console.log('Episodes:', episodes.length);
    
    console.log('Fetching features...');
    const features = await getRSSItemsByType('Feature');
    console.log('Features:', features.length);
  } catch (error) {
    console.error('RSS test error:', error);
  }
}

// Run the test
testRSS();