// app/lib/google-calendar-service.js
// Service to fetch and parse events from Google Calendar using iCal

const ICAL = require('ical.js');

// Google Calendar ID for Afropop Worldwide events
const CALENDAR_ID = 'c_2c54e0a2af46caecc80ffb8657a18343ac7ec9af0c5f6e9b8cc6b096c7b60422@group.calendar.google.com';

// Public iCal URL for the calendar
const ICAL_URL = `https://calendar.google.com/calendar/ical/${CALENDAR_ID.replace('@', '%40')}/public/basic.ics`;

// Cache for calendar data
let calendarCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Function to fetch and parse events from the Google Calendar iCal feed
async function getCalendarEvents() {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (calendarCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Returning cached calendar events');
      return calendarCache;
    }
    
    console.log('Fetching events from Google Calendar (iCal format)...');
    console.log(`Fetching from URL: ${ICAL_URL}`);
    
    // Fetch the iCal data
    const response = await fetch(ICAL_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar events: ${response.status} ${response.statusText}`);
    }
    
    const icalData = await response.text();
    
    // Parse the iCal data
    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');
    
    // Convert to our event format
    const events = vevents.map(vevent => {
      const event = new ICAL.Event(vevent);
      
      // Get start and end times
      const startDate = event.startDate.toJSDate();
      const endDate = event.endDate.toJSDate();
      
      // Format the date for display
      const formattedDate = startDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Extract location from the event
      let location = '';
      if (event.location) {
        location = event.location;
      }
      
      return {
        id: event.uid,
        title: event.summary,
        description: event.description || '',
        content: event.description || '',
        link: '', // iCal doesn't typically include links
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        formattedDate: formattedDate,
        location: location,
        venue: location,
        pubDate: startDate.toISOString(),
        isoDate: startDate.toISOString(),
        author: 'Afropop Worldwide',
        categories: [], // iCal might not have categories in the same way
        image: null,
        type: 'Event',
        region: null,
        genre: null
      };
    });
    
    console.log(`Successfully fetched and parsed ${events.length} events from Google Calendar`);
    
    // Update cache
    const result = {
      title: 'Afropop Worldwide Events',
      description: 'Events from Afropop Worldwide Google Calendar',
      items: events,
      count: events.length,
      lastUpdated: new Date().toISOString()
    };
    
    calendarCache = result;
    cacheTimestamp = now;
    
    return result;
  } catch (error) {
    console.error('Error fetching events from Google Calendar:', error);
    throw new Error(`Failed to fetch calendar events: ${error.message}`);
  }
}

// Function to normalize calendar events for our application
function normalizeCalendarEvents(events) {
  // This function is now handled in the main getCalendarEvents function
  return events;
}

// Function to get upcoming events (optimized to filter during parsing)
async function getUpcomingEvents(limit = 10) {
  try {
    console.log(`Fetching upcoming events (limit: ${limit})...`);
    
    // Check if we have valid cached data
    const now = Date.now();
    if (calendarCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Using cached data for upcoming events');
      // Filter cached events to only include upcoming ones
      const nowDate = new Date();
      let upcomingEvents = calendarCache.items.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate >= nowDate;
      });
      
      // Sort by date (soonest first)
      upcomingEvents.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
      });
      
      // Limit the results
      upcomingEvents = upcomingEvents.slice(0, limit);
      
      console.log(`Returning ${upcomingEvents.length} cached upcoming events`);
      return upcomingEvents;
    }
    
    console.log('Fetching fresh data for upcoming events...');
    
    // Fetch fresh data if no valid cache
    const response = await fetch(ICAL_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar events: ${response.status} ${response.statusText}`);
    }
    
    const icalData = await response.text();
    
    // Parse the iCal data
    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');
    
    // Get current date for filtering
    const nowDate = new Date();
    
    // Convert to our event format and filter upcoming events
    let upcomingEvents = [];
    
    for (const vevent of vevents) {
      const event = new ICAL.Event(vevent);
      
      // Get start time
      const startDate = event.startDate.toJSDate();
      
      // Only include upcoming events
      if (startDate >= nowDate) {
        // Format the date for display
        const formattedDate = startDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // Extract location from the event
        let location = '';
        if (event.location) {
          location = event.location;
        }
        
        upcomingEvents.push({
          id: event.uid,
          title: event.summary,
          description: event.description || '',
          content: event.description || '',
          link: '', // iCal doesn't typically include links
          startDate: startDate.toISOString(),
          endDate: event.endDate.toJSDate().toISOString(),
          formattedDate: formattedDate,
          location: location,
          venue: location,
          pubDate: startDate.toISOString(),
          isoDate: startDate.toISOString(),
          author: 'Afropop Worldwide',
          categories: [], // iCal might not have categories in the same way
          image: null,
          type: 'Event',
          region: null,
          genre: null
        });
      }
    }
    
    // Sort by date (soonest first)
    upcomingEvents.sort((a, b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    });
    
    // Limit the results
    upcomingEvents = upcomingEvents.slice(0, limit);
    
    console.log(`Successfully fetched and parsed ${upcomingEvents.length} upcoming events from Google Calendar`);
    
    // Update cache with all events for future use
    const allEvents = vevents.map(vevent => {
      const event = new ICAL.Event(vevent);
      
      // Get start and end times
      const startDate = event.startDate.toJSDate();
      const endDate = event.endDate.toJSDate();
      
      // Format the date for display
      const formattedDate = startDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Extract location from the event
      let location = '';
      if (event.location) {
        location = event.location;
      }
      
      return {
        id: event.uid,
        title: event.summary,
        description: event.description || '',
        content: event.description || '',
        link: '', // iCl doesn't typically include links
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        formattedDate: formattedDate,
        location: location,
        venue: location,
        pubDate: startDate.toISOString(),
        isoDate: startDate.toISOString(),
        author: 'Afropop Worldwide',
        categories: [], // iCal might not have categories in the same way
        image: null,
        type: 'Event',
        region: null,
        genre: null
      };
    });
    
    // Update cache
    const result = {
      title: 'Afropop Worldwide Events',
      description: 'Events from Afropop Worldwide Google Calendar',
      items: allEvents,
      count: allEvents.length,
      lastUpdated: new Date().toISOString()
    };
    
    calendarCache = result;
    cacheTimestamp = now;
    
    return upcomingEvents;
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    throw new Error(`Failed to get upcoming events: ${error.message}`);
  }
}

// Export all functions
module.exports = {
  getCalendarEvents,
  getUpcomingEvents
};