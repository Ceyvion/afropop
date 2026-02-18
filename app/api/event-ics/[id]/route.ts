// app/api/event-ics/[id]/route.ts
// Generate an ICS file for a single event by ID

// Use CommonJS requires to match existing ical.js usage in this repo
const ICAL = require('ical.js')
const { getCalendarEvents } = require('../../../lib/google-calendar-service')
const { reportError } = require('../../../lib/telemetry')

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing event id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await getCalendarEvents()
    const event = data?.items?.find((e: any) => String(e.id) === String(id))
    if (!event) {
      return new Response(JSON.stringify({ error: 'Event not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const icalComponent = new ICAL.Component(['vcalendar', [], []])
    icalComponent.updatePropertyWithValue('prodid', '-//Afropop Worldwide//Event//EN')
    icalComponent.updatePropertyWithValue('version', '2.0')
    icalComponent.updatePropertyWithValue('name', 'Afropop Worldwide Event')
    icalComponent.updatePropertyWithValue('x-wr-calname', 'Afropop Worldwide Event')
    icalComponent.updatePropertyWithValue('timezone-id', 'UTC')
    icalComponent.updatePropertyWithValue('x-wr-timezone', 'UTC')

    const vevent = new ICAL.Component('vevent')
    const uid = event.id || `event-${Date.now()}`
    vevent.addPropertyWithValue('uid', uid)
    vevent.addPropertyWithValue('summary', event.title || 'Afropop Event')
    if (event.description) vevent.addPropertyWithValue('description', event.description)
    if (event.location) vevent.addPropertyWithValue('location', event.location)

    const startDate = ICAL.Time.fromJSDate(new Date(event.startDate), false)
    const endDate = ICAL.Time.fromJSDate(new Date(event.endDate || event.startDate), false)
    vevent.addPropertyWithValue('dtstart', startDate)
    vevent.addPropertyWithValue('dtend', endDate)

    const now = ICAL.Time.now()
    vevent.addPropertyWithValue('created', now)
    vevent.addPropertyWithValue('last-modified', now)

    icalComponent.addSubcomponent(vevent)
    const icalString = icalComponent.toString()

    return new Response(icalString, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="event-${encodeURIComponent(uid)}.ics"`,
      },
    })
  } catch (error: any) {
    console.error('Error generating single-event iCal:', error)
    try { await reportError(error, { route: 'event-ics', id: (await params)?.id }) } catch {}
    return new Response(JSON.stringify({ error: 'Failed to generate iCal' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
