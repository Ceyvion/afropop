// Test RSS API endpoints
async function testAPI() {
  try {
    console.log('Testing episodes API...');
    const episodesResponse = await fetch('http://localhost:3000/api/episodes?limit=3');
    const episodesData = await episodesResponse.json();
    console.log('Episodes API response:', episodesData);
    
    console.log('Testing features API...');
    const featuresResponse = await fetch('http://localhost:3000/api/features?limit=2');
    const featuresData = await featuresResponse.json();
    console.log('Features API response:', featuresData);
  } catch (error) {
    console.error('API test error:', error);
  }
}

// Run the test
testAPI();