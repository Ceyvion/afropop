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

## Style DNA (Replication Cheatsheet)

Design tokens and components used to implement the new editorial system.

Design Tokens
- --bg: Light gray canvas (`#F3F4F6`)
- --surface: Card/panel surface (`#FFFFFF`)
- --elevated: Elevated surface (`#FFFFFF`)
- --text: Primary text (`#0B0B0C`)
- --muted: Secondary text (`#5B636C`)
- --border: Subtle separators (`#E6ECE9`)
- --accent: Brand/CTA (`#FF5A2F`)
- --accent-strong: CTA hover (`#E14A22`)
- Poster colors: `poster-mustard:#E0B500`, `poster-sky:#60A5FA`, `poster-coral:#FF6B57`, `poster-lilac:#C084FC`
- Radius: `rounded-card` (24px)
- Max width: centered rows use `max-w-[1200px]`
- Rhythm: 8/16/24px spacing via `.section`, `.section-tight`

Typography
- Display: `Anton` via `font-display-condensed` (all-caps in hero)
- UI/Body: `Inter` via `font-body`
- Mono: `IBM Plex Mono` via `font-mono`

Layout & Utilities
- Full-screen layout: body spans full width; content rows are centered with `max-w-[1200px]` for readability.
- Canvas: `.app-canvas` on `<body>` (light gray background)
- Padding: `.app-card-padding` applies responsive x-padding
- Sections: `.section` and `.section-tight` for vertical rhythm

Hero (Black Band)
- Container: `.hero-band > .hero-wrap`
- Title: `.hero-title` (condensed, uppercase, giant)
- Copy: `.hero-copy` (modest paragraph)
- CTAs: `.btn-hero` (white outline pill, inverts on hover)

Navigation (Minimal)
- Container: `.top-nav`
- Links: `.nav-link` (uppercase, tracked)
- Active: `.nav-link-active` (underline) + `.nav-dot` (tiny dot)
- Right-side micro-button: `.nav-login`

Poster Strip (4-up)
- Row: `.poster-row` (2 cols on mobile, 4 cols on desktop)
- Panel: `.poster` with one of: `bg-poster-mustard|sky|coral|lilac`
- Image: `.poster-img` (grayscale, high contrast, blends for duotone feel)
- Label: `.poster-title` (uppercase tiny utility text)

Files Touched
- `app/layout.tsx`: Adds card shell, loads `Anton` font
- `app/components/Header.tsx`: Minimal nav with active underline + dot and `Login`
- `app/page.tsx`: New black hero band and 4-up poster strip
- `app/globals.css`: Tokens, utilities, and component classes
- `tailwind.config.js`: Poster palette, max width, radius, font family hook

Notes
- No heavy shadows; the look relies on color blocks and contrast.
- Generous rounding (`rounded-card`) is applied to the outer container and the poster row.
- Imagery uses monochrome/duotone styling via `.poster-img` filters and blend mode.

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
