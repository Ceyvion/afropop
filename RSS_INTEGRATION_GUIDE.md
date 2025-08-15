# Afropop Worldwide RSS Integration Guide

## Overview

This document explains how the RSS feed integration works in the Afropop Worldwide website and how to troubleshoot any issues that may arise.

## Architecture

The RSS integration follows this architecture:

```
Browser/Client
      ↓
React Hooks (useEpisodes, useFeatures, etc.)
      ↓
API Routes (/api/episodes, /api/features, etc.)
      ↓
RSS Service Layer (caching, normalization)
      ↓
RSS Proxy API (/api/rss-proxy)
      ↓
External RSS Feed (Afropop's podcast feed)
```

## Key Components

### 1. RSS Proxy (`/api/rss-proxy`)
- Handles fetching RSS feeds from external sources
- Bypasses CORS restrictions by acting as a server-side proxy
- Parses RSS XML into JSON format
- Handles errors gracefully

### 2. RSS Service (`/app/lib/rss-service.ts`)
- Manages caching of RSS data (5-minute timeout)
- Normalizes data for consistent usage across the application
- Provides search and filtering functionality

### 3. API Routes
- `/api/rss`: Returns the main RSS feed
- `/api/search`: Searches across all content with filters
- `/api/episodes`: Returns episodes with pagination
- `/api/features`: Returns features with pagination
- `/api/item/[id]`: Returns a specific item by ID

### 4. React Hooks
- `useEpisodes`: Fetches episodes
- `useFeatures`: Fetches features
- `useItemById`: Fetches a specific item by ID
- `useRSSFeed`: Fetches the main RSS feed
- `useRSSSearch`: Searches across all content

## Troubleshooting

### Common Issues

1. **500 Internal Server Error**
   - Check server logs for specific error messages
   - Verify the RSS feed URL is accessible
   - Ensure all dependencies are installed correctly

2. **CORS Errors**
   - The RSS proxy should handle CORS issues
   - Verify the proxy is working correctly

3. **Empty or Missing Data**
   - Check that the RSS feed is returning data
   - Verify the parsing logic matches the feed structure

### Testing the Integration

1. **Test the RSS Proxy**
   ```bash
   curl "http://localhost:3000/api/rss-proxy?url=https://feeds.simplecast.com/EpDu11tq"
   ```

2. **Test the Main RSS API**
   ```bash
   curl "http://localhost:3000/api/rss"
   ```

3. **Test the Search API**
   ```bash
   curl "http://localhost:3000/api/search?q=test"
   ```

### Debugging Steps

1. **Check Server Logs**
   Look for error messages in the terminal where you started the development server.

2. **Verify Dependencies**
   ```bash
   npm list rss-parser feed
   ```

3. **Test RSS Feed Accessibility**
   Try accessing the RSS feed URL directly in a browser to ensure it's accessible.

4. **Check File Structure**
   Ensure all API route files are in the correct locations:
   - `/app/api/rss-proxy/route.ts`
   - `/app/api/rss/route.ts`
   - `/app/api/search/route.ts`
   - `/app/api/episodes/route.ts`
   - `/app/api/features/route.ts`
   - `/app/api/item/[id]/route.ts`

## Customization

### Updating the RSS Feed URL

To update the RSS feed URL, modify the `AFROPOP_RSS_URL` constant in `/app/lib/rss-service.ts`:

```typescript
const AFROPOP_RSS_URL = 'https://your-new-rss-feed-url.com/feed'
```

### Adding New Content Types

To add support for new content types:

1. Update the `determineContentType` function in `/app/lib/rss-utils.ts`
2. Create new API routes if needed
3. Create new React hooks if needed
4. Update UI components to handle the new content type

### Modifying Search Filters

To modify search filters, update the `searchRSSFeed` function in `/app/lib/rss-service.ts` and the search form in `/app/search/page.tsx`.

## Performance Considerations

1. **Caching**: The RSS service implements 5-minute caching to reduce API calls
2. **Pagination**: API routes support pagination to limit data transfer
3. **Lazy Loading**: React components load data only when needed
4. **Error Handling**: Graceful error handling prevents crashes

## Security Considerations

1. **Input Validation**: All API routes validate input parameters
2. **CORS Headers**: Proper CORS headers are set for security
3. **Error Messages**: Error messages don't expose sensitive information
4. **URL Validation**: RSS feed URLs are validated before fetching

## Future Improvements

1. **Server-Side Rendering**: Implement SSR for better performance
2. **Advanced Caching**: Use Redis or similar for more sophisticated caching
3. **Webhooks**: Implement webhooks for real-time updates
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Authentication**: Add authentication for admin features