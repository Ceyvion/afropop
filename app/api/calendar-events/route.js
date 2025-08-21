// app/api/calendar-events/route.js
// API route to fetch events from Google Calendar

const { getCalendarEvents, getUpcomingEvents } = require('../../lib/google-calendar-service');
const { reportError } = require('../../lib/telemetry')

// GET /api/calendar-events
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    let events;
    
    if (type === 'upcoming') {
      events = await getUpcomingEvents(limit);
      return new Response(JSON.stringify(events), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      events = await getCalendarEvents();
      return new Response(JSON.stringify(events), {
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
