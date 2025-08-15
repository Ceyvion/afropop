// simple-test.js
async function testServer() {
  try {
    console.log('Testing Next.js server...')
    
    // Test the main page
    const response = await fetch('http://localhost:3000')
    
    if (response.ok) {
      console.log('✓ Next.js server is running and responding')
    } else {
      console.log(`✗ Next.js server returned status ${response.status}`)
    }
  } catch (error) {
    console.log('✗ Next.js server is not accessible')
    console.log(`Error: ${error.message}`)
  }
}

testServer()