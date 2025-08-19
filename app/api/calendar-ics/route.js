// app/api/calendar-ics/route.js
// API route to generate and download iCal file for events

const ICAL = require('ical.js');
const { getUpcomingEvents } = require('../../lib/google-calendar-service');

// GET /api/calendar-ics
export async function GET(request) {
  try {
    // Fetch only upcoming events (next 10)
    const events = await getUpcomingEvents(10);
    
    console.log(`Generating iCal for ${events.length} events`);

    // Create a new ICAL component
    const icalComponent = new ICAL.Component(['vcalendar', [], []]);
    icalComponent.updatePropertyWithValue('prodid', '-//Afropop Worldwide//Events//EN');
    icalComponent.updatePropertyWithValue('version', '2.0');
    icalComponent.updatePropertyWithValue('name', 'Afropop Worldwide Events');
    icalComponent.updatePropertyWithValue('x-wr-calname', 'Afropop Worldwide Events');
    icalComponent.updatePropertyWithValue('timezone-id', 'UTC');
    icalComponent.updatePropertyWithValue('x-wr-timezone', 'UTC');

    // Add each event to the calendar
    events.forEach(event => {
      const vevent = new ICAL.Component('vevent');
      const uid = event.id || `event-${Date.now()}-${Math.random()}`;
      
      // Add properties to the event
      vevent.addPropertyWithValue('uid', uid);
      vevent.addPropertyWithValue('summary', event.title);
      
      if (event.description) {
        vevent.addPropertyWithValue('description', event.description);
      }
      
      if (event.location) {
        vevent.addPropertyWithValue('location', event.location);
      }
      
      // Add start and end times
      const startDate = ICAL.Time.fromJSDate(new Date(event.startDate), false);
      const endDate = ICAL.Time.fromJSDate(new Date(event.endDate), false);
      
      vevent.addPropertyWithValue('dtstart', startDate);
      vevent.addPropertyWithValue('dtend', endDate);
      
      // Add created and last modified timestamps
      const now = ICAL.Time.now();
      vevent.addPropertyWithValue('created', now);
      vevent.addPropertyWithValue('last-modified', now);
      
      // Add the event to the calendar
      icalComponent.addSubcomponent(vevent);
    });

    // Generate the iCal string
    const icalString = icalComponent.toString();
    
    console.log('Generated iCal string length:', icalString.length);

    // Return the iCal file as a download
    return new Response(icalString, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="afropop-events.ics"'
      },
    });
  } catch (error) {
    console.error('Error generating iCal file:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate iCal file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}