// verify-setup.js
const fs = require('fs')
const path = require('path')

console.log('Verifying Afropop Worldwide Website Setup...\n')

// Check if required directories exist
const requiredDirs = [
  'app',
  'app/api',
  'app/components',
  'app/lib'
]

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✓ ${dir} directory exists`)
  } else {
    console.log(`✗ ${dir} directory is missing`)
  }
})

console.log('\nChecking API routes...')
const apiRoutes = [
  'app/api/rss-proxy/route.ts',
  'app/api/rss/route.ts',
  'app/api/search/route.ts',
  'app/api/episodes/route.ts',
  'app/api/features/route.ts'
]

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✓ ${route} exists`)
  } else {
    console.log(`✗ ${route} is missing`)
  }
})

console.log('\nChecking lib files...')
const libFiles = [
  'app/lib/rss-utils.ts',
  'app/lib/rss-service.ts',
  'app/lib/use-rss-data.ts'
]

libFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file} exists`)
  } else {
    console.log(`✗ ${file} is missing`)
  }
})

console.log('\nChecking component files...')
const componentFiles = [
  'app/components/Cards.tsx',
  'app/components/Header.tsx',
  'app/components/Footer.tsx',
  'app/components/MiniPlayer.tsx'
]

componentFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file} exists`)
  } else {
    console.log(`✗ ${file} is missing`)
  }
})

console.log('\nChecking page files...')
const pageFiles = [
  'app/page.tsx',
  'app/archive/page.tsx',
  'app/search/page.tsx',
  'app/episodes/page.tsx',
  'app/features/page.tsx'
]

pageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file} exists`)
  } else {
    console.log(`✗ ${file} is missing`)
  }
})

console.log('\nSetup verification complete.')
console.log('\nTo test the RSS integration:')
console.log('1. Ensure the development server is running (npm run dev)')
console.log('2. Visit http://localhost:3000 in your browser')
console.log('3. Check the console for any errors')
console.log('4. Try accessing http://localhost:3000/api/rss to test the API')