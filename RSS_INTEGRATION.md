# RSS Feed Integration Documentation

## Overview

This document explains how to set up and use the RSS feed integration for the Afropop Worldwide website. The integration allows the website to dynamically fetch and display content from Afropop's RSS feed, providing real-time updates to the archive, search functionality, and content pages.

## Setup

1. **Install Dependencies**:
   The required packages are already included in `package.json`:
   - `rss-parser`: For parsing RSS feeds
   - `feed`: For generating RSS feeds (if needed)

2. **Configuration**:
   Update the RSS feed URL in `app/lib/rss-service.ts`:
   ```typescript
   const AFROPOP_RSS_URL = 'https://afropop.org/feed/podcast' // Replace with actual URL
   ```

## Architecture

The RSS integration follows this architecture:

```
RSS Feed Source
      ↓
RSS Parser (rss-parser)
      ↓
RSS Service Layer (caching, normalization)
      ↓
API Routes (REST endpoints)
      ↓
React Hooks (client-side consumption)
      ↓
UI Components
```

## Key Components

### 1. RSS Parser (`app/lib/rss-parser.ts`)
- Fetches and parses RSS feeds
- Normalizes data for consistent usage across the application
- Extracts metadata like region, genre, and content type

### 2. RSS Service (`app/lib/rss-service.ts`)
- Manages caching of RSS data (5-minute timeout)
- Provides search functionality across all content
- Offers helper functions for filtering and sorting

### 3. API Routes (`app/api/`)
- `/api/rss`: Fetches and returns the main RSS feed
- `/api/search`: Searches across all content with filters
- `/api/items/[type]`: Gets items by content type
- `/api/items/[id]`: Gets a specific item by ID

### 4. React Hooks (`app/lib/use-rss-data.ts`)
- `useRSSFeed`: Fetches the main RSS feed
- `useRSSSearch`: Searches across all content
- `useRSSItemsByType`: Gets items by content type
- `useRSSItemById`: Gets a specific item by ID

## Usage

### In Components
```typescript
import { useRSSFeed } from '@/app/lib/use-rss-data'

export default function MyComponent() {
  const { data, loading, error } = useRSSFeed()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {data?.items?.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  )
}
```

### Search Functionality
```typescript
import { useRSSSearch } from '@/app/lib/use-rss-data'

export default function SearchComponent() {
  const { data, loading, error, search } = useRSSSearch()
  
  const handleSearch = () => {
    search('query', { type: 'episode', region: 'West Africa' })
  }
  
  // ... rest of component
}
```

## Content Types

The integration supports three main content types:

1. **Episodes**: Audio content with duration, region, and genre
2. **Features**: Written articles with author and read time
3. **Events**: Event listings with date and location

## Caching

The RSS service implements in-memory caching with a 5-minute timeout to reduce API calls and improve performance. The cache can be manually refreshed using the `refreshRSSFeed()` function or by calling the `POST /api/rss` endpoint.

## Testing

Test the RSS integration with:
```bash
npm run test:rss
```

Refresh the RSS cache with:
```bash
npm run refresh:rss
```

## Customization

To customize the RSS integration for Afropop's specific needs:

1. **Update RSS Feed URL**: Modify `AFROPOP_RSS_URL` in `rss-service.ts`
2. **Adjust Content Type Detection**: Update `determineContentType()` in `rss-parser.ts`
3. **Customize Metadata Extraction**: Modify `extractRegion()` and `extractGenre()` in `rss-parser.ts`
4. **Add New Content Types**: Extend the type system and UI components as needed

## Troubleshooting

### Common Issues

1. **RSS Feed Not Loading**:
   - Check the RSS feed URL is correct
   - Verify the feed is accessible and valid
   - Check browser console for CORS errors

2. **Content Not Displaying Correctly**:
   - Verify the RSS feed structure matches expectations
   - Check the normalization functions in `rss-parser.ts`
   - Ensure UI components handle all content types

3. **Search Not Working**:
   - Verify search parameters are correctly passed
   - Check the search implementation in `rss-service.ts`
   - Ensure filters are properly applied

### Debugging

Enable debug logging by adding console.log statements in the RSS service layer or by using the test scripts.