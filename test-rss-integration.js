// test-rss-integration.js
const fs = require('fs')

// Check if our RSS utility files exist
const filesToCheck = [
  'app/lib/rss-utils.ts',
  'app/lib/rss-service.ts',
  'app/lib/use-rss-data.ts',
  'app/api/rss-proxy/route.ts',
  'app/api/rss/route.ts',
  'app/api/search/route.ts'
]

console.log('Checking RSS integration files...\n')

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file} exists`)
  } else {
    console.log(`✗ ${file} is missing`)
  }
})

console.log('\nChecking API routes...')
const apiRoutes = [
  'app/api/rss-proxy',
  'app/api/rss',
  'app/api/search',
  'app/api/episodes',
  'app/api/features',
  'app/api/item'
]

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✓ ${route} exists`)
  } else {
    console.log(`✗ ${route} is missing`)
  }
})

console.log('\nRSS integration check complete.')