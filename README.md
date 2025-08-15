# Afropop Worldwide Website

The new website for Afropop Worldwide, featuring audio-first storytelling, archive discovery, and Swiss-leaning design.

## Features

- **Audio-First Storytelling**: Listen to episodes directly on the website with a custom audio player
- **Archive Discovery**: Browse and search through episodes and features with faceted search
- **Responsive Design**: Works on all device sizes
- **RSS Integration**: Real-time content updates from Afropop's podcast feed
- **Swiss Design Principles**: Clean, minimalist aesthetic with precise layouts

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- RSS Parser

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Ceyvion/afropop.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The site can be deployed to Vercel or any other hosting platform that supports Next.js.

## Key Components

### RSS Integration
- Uses FeedBurner RSS feed for reliable content delivery
- Implements caching for performance optimization
- Provides search and filtering capabilities
- Supports real-time content updates

### Audio Player
- Custom-built audio player with play/pause controls
- Progress bar with seeking functionality
- Responsive design that works on all devices

### Navigation
- Proper linking between list pages and detail pages
- Breadcrumb navigation for better user experience
- Smooth transitions between pages

## API Routes

- `/api/rss` - Fetch main RSS feed
- `/api/search` - Search across all content with filters
- `/api/episodes` - Get episodes with pagination
- `/api/features` - Get features with pagination
- `/api/item/[id]` - Get specific item by ID

## Environment Variables

Create a `.env.local` file with the following variables:

```env
RSS_PARSER_SERVICE=rssapp
RSS_PARSER_API_KEY=your_api_key_here
AFROPOP_RSS_URL=https://afropop.org/feed/podcast
RSS_CACHE_TIMEOUT=300000
```