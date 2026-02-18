// app/api/calendar-events/route.js
// API route to fetch events from Google Calendar

const { getCalendarEvents, getUpcomingEvents } = require('../../lib/google-calendar-service');
const { reportError } = require('../../lib/telemetry')

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function paginate(items, page, pageSize) {
  const total = items.length
  const safePage = Math.max(1, page)
  const safePageSize = clamp(pageSize, 1, 100)
  const start = (safePage - 1) * safePageSize
  const pagedItems = items.slice(start, start + safePageSize)
  return {
    items: pagedItems,
    count: pagedItems.length,
    total,
    page: safePage,
    pageSize: safePageSize,
    hasMore: start + pagedItems.length < total,
  }
}

function filterByQuality(items, quality) {
  if (quality === 'all') return items
  return items.filter((event) => event?.curated !== false)
}

// GET /api/calendar-events
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = clamp(parseInt(searchParams.get('pageSize')) || 50, 1, 100);
    const quality = searchParams.get('quality') === 'all' ? 'all' : 'curated';
    
    let events;
    
    if (type === 'upcoming') {
      events = await getUpcomingEvents(limit);
      const list = Array.isArray(events) ? events : events?.items || []
      const filtered = filterByQuality(list, quality)
      return new Response(JSON.stringify(paginate(filtered, page, pageSize)), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      events = await getCalendarEvents();
      const list = Array.isArray(events) ? events : events?.items || []
      const filtered = filterByQuality(list, quality)
      return new Response(JSON.stringify(paginate(filtered, page, pageSize)), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error in calendar events API route:', error);
    try { await reportError(error, { route: 'calendar-events' }) } catch {}
    return new Response(JSON.stringify({ error: 'Failed to fetch calendar events' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
