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

// -------- Deduping helpers (near-duplicate collapse across different UIDs) --------
function normalizeTitle(str) {
  if (!str) return '';
  let s = String(str).toLowerCase();
  // normalize quotes and punctuation to spaces
  s = s.replace(/[“”"'’]+/g, ' ');
  // strip any non alphanumerics to spaces
  s = s.replace(/[^a-z0-9]+/g, ' ');
  // remove common boilerplate words
  const STOP = new Set(['the','a','an','and','of','ft','feat','featuring','live','launch','album','single','release','concert','show','event','party','tour','vol','volume']);
  s = s.split(' ').filter(Boolean).filter(w => !STOP.has(w)).join(' ');
  // collapse spaces
  return s.replace(/\s+/g, ' ').trim();
}

function extractCityCandidate(location) {
  if (!location) return '';
  const tokens = String(location).split(',').map(s => s.trim()).filter(Boolean);
  // Prefer the last sufficiently descriptive token
  const IGNORES = new Set(['usa','united states','united kingdom','uk','canada']);
  for (let i = tokens.length - 1; i >= 0; i--) {
    const raw = tokens[i];
    const t = raw.toLowerCase().replace(/[^a-z]/g, '');
    if (!t) continue;
    if (t.length <= 2) continue; // likely region code like QC, NY
    if (IGNORES.has(t)) continue;
    return t;
  }
  // fallback: first token cleaned
  return tokens.length ? tokens[0].toLowerCase().replace(/[^a-z]/g, '') : '';
}

function firstUrlFromText(text) {
  if (!text) return null;
  const m = text.match(/https?:\/\/[^\s)]+/i);
  return m ? m[0] : null;
}

function urlHostPath(u) {
  try {
    const url = new URL(u);
    return `${url.hostname}${url.pathname}`.toLowerCase();
  } catch {
    return null;
  }
}

function scoreEventItem(item) {
  let score = 0;
  const dlen = (item.description || '').length;
  if (dlen >= 400) score += 3; else if (dlen >= 200) score += 2; else if (dlen >= 80) score += 1;
  if ((item.description || '').match(/https?:\/\//i)) score += 1;
  if ((item.description || '').toLowerCase().includes('ticket')) score += 1;
  if ((item.title || '').length > 40) score += 1;
  if ((item.location || '').split(',').length > 2 || (item.location || '').length > 20) score += 1;
  return score;
}

function fingerprintEvent(item) {
  const start = new Date(item.startDate);
  const y = start.getUTCFullYear();
  const m = String(start.getUTCMonth() + 1).padStart(2, '0');
  const d = String(start.getUTCDate()).padStart(2, '0');
  const hh = String(start.getUTCHours()).padStart(2, '0');
  const mm = String(start.getUTCMinutes()).padStart(2, '0');
  const timeBucket = `${y}${m}${d}T${hh}${mm}`;
  const city = extractCityCandidate(item.location);
  const titleCore = normalizeTitle(item.title);
  const strongUrl = firstUrlFromText(item.description || '')
  const strongKey = strongUrl ? `${urlHostPath(strongUrl)}|${timeBucket}` : null;
  const weakKey = `${timeBucket}|${city}|${titleCore}`;
  return { strongKey, weakKey };
}

function dedupeNearDuplicates(items) {
  // sort by best-first so better records claim the slot
  const annotated = items.map(it => ({ it, score: scoreEventItem(it) }))
    .sort((a, b) => (b.score - a.score) || (new Date(a.it.startDate) - new Date(b.it.startDate)));
  const usedStrong = new Set();
  const usedWeak = new Set();
  const out = [];
  for (const { it } of annotated) {
    const { strongKey, weakKey } = fingerprintEvent(it);
    if (strongKey && usedStrong.has(strongKey)) continue;
    if (usedWeak.has(weakKey)) continue;
    out.push(it);
    if (strongKey) usedStrong.add(strongKey);
    usedWeak.add(weakKey);
  }
  return out;
}

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

    // Convert to our event format with dedupe and recurrence awareness
    const byKey = new Map();
    for (const vevent of vevents) {
      const status = (vevent.getFirstPropertyValue('status') || '').toString().toUpperCase();
      if (status.includes('CANCEL')) continue; // skip cancelled instances

      const event = new ICAL.Event(vevent);
      const startDate = event.startDate.toJSDate();
      const endDate = event.endDate.toJSDate();

      // occurrence key: UID + recurrence-id (if present) else DTSTART
      const rec = vevent.getFirstPropertyValue('recurrence-id');
      let occISO;
      try {
        occISO = rec && typeof rec.toJSDate === 'function' ? rec.toJSDate().toISOString() : startDate.toISOString();
      } catch {
        occISO = startDate.toISOString();
      }
      const id = `${event.uid}__${occISO}`;

      const formattedDate = startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const location = event.location ? event.location : '';

      const item = {
        id,
        title: event.summary,
        description: event.description || '',
        content: event.description || '',
        link: '',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        formattedDate,
        location,
        venue: location,
        pubDate: startDate.toISOString(),
        isoDate: startDate.toISOString(),
        author: 'Afropop Worldwide',
        categories: [],
        image: null,
        type: 'Event',
        region: null,
        genre: null
      };

      if (!byKey.has(id)) byKey.set(id, item);
    }
    let events = Array.from(byKey.values());
    console.log(`Parsed ${vevents.length} vevents; ${events.length} unique after UID-occurrence dedupe`);
    // Near-duplicate pass across different UIDs
    const eventsBefore = events.length;
    events = dedupeNearDuplicates(events);
    if (events.length !== eventsBefore) {
      console.log(`Near-duplicate collapse: ${eventsBefore} -> ${events.length}`);
    }
    
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
      // Ensure uniqueness by id (defensive)
      const uMap = new Map();
      upcomingEvents.forEach(ev => { if (!uMap.has(ev.id)) uMap.set(ev.id, ev); });
      upcomingEvents = Array.from(uMap.values());
      
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
    const upcomingMap = new Map();
    let upcomingEvents = [];

    for (const vevent of vevents) {
      const status = (vevent.getFirstPropertyValue('status') || '').toString().toUpperCase();
      if (status.includes('CANCEL')) continue;

      const event = new ICAL.Event(vevent);
      const startDate = event.startDate.toJSDate();
      if (startDate < nowDate) continue;

      const rec = vevent.getFirstPropertyValue('recurrence-id');
      let occISO;
      try {
        occISO = rec && typeof rec.toJSDate === 'function' ? rec.toJSDate().toISOString() : startDate.toISOString();
      } catch {
        occISO = startDate.toISOString();
      }
      const id = `${event.uid}__${occISO}`;

      const formattedDate = startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const location = event.location ? event.location : '';
      const item = {
        id,
        title: event.summary,
        description: event.description || '',
        content: event.description || '',
        link: '',
        startDate: startDate.toISOString(),
        endDate: event.endDate.toJSDate().toISOString(),
        formattedDate,
        location,
        venue: location,
        pubDate: startDate.toISOString(),
        isoDate: startDate.toISOString(),
        author: 'Afropop Worldwide',
        categories: [],
        image: null,
        type: 'Event',
        region: null,
        genre: null
      };
      if (!upcomingMap.has(id)) {
        upcomingMap.set(id, item);
        upcomingEvents.push(item);
      }
    }
    
    // Sort by date (soonest first)
    upcomingEvents.sort((a, b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    });
    
    // Limit the results
    upcomingEvents = upcomingEvents.slice(0, limit);
    
    // Near-duplicate pass across different UIDs
    const upBefore = upcomingEvents.length;
    upcomingEvents = dedupeNearDuplicates(upcomingEvents);
    if (upcomingEvents.length !== upBefore) {
      console.log(`Upcoming near-duplicate collapse: ${upBefore} -> ${upcomingEvents.length}`);
    }
    console.log(`Successfully fetched and parsed ${upcomingEvents.length} upcoming events from Google Calendar (deduped)`);
    
    // Update cache with all events for future use
    const allMap = new Map();
    for (const vevent of vevents) {
      const status = (vevent.getFirstPropertyValue('status') || '').toString().toUpperCase();
      if (status.includes('CANCEL')) continue;
      const event = new ICAL.Event(vevent);
      const startDate = event.startDate.toJSDate();
      const endDate = event.endDate.toJSDate();
      const rec = vevent.getFirstPropertyValue('recurrence-id');
      let occISO;
      try {
        occISO = rec && typeof rec.toJSDate === 'function' ? rec.toJSDate().toISOString() : startDate.toISOString();
      } catch {
        occISO = startDate.toISOString();
      }
      const id = `${event.uid}__${occISO}`;
      const formattedDate = startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const location = event.location ? event.location : '';
      const item = {
        id,
        title: event.summary,
        description: event.description || '',
        content: event.description || '',
        link: '', // iCal doesn't typically include links
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        formattedDate,
        location,
        venue: location,
        pubDate: startDate.toISOString(),
        isoDate: startDate.toISOString(),
        author: 'Afropop Worldwide',
        categories: [],
        image: null,
        type: 'Event',
        region: null,
        genre: null
      };
      if (!allMap.has(id)) allMap.set(id, item);
    }
    let allEvents = Array.from(allMap.values());
    console.log(`All events after UID-occurrence dedupe: ${allEvents.length} (from ${vevents.length} vevents)`);
    const allBefore = allEvents.length;
    allEvents = dedupeNearDuplicates(allEvents);
    if (allEvents.length !== allBefore) {
      console.log(`All-events near-duplicate collapse: ${allBefore} -> ${allEvents.length}`);
    }
    
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
