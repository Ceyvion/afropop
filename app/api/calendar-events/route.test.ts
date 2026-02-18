/** @jest-environment node */

import { GET } from './route'

jest.mock('../../lib/google-calendar-service', () => ({
  getCalendarEvents: jest.fn(),
  getUpcomingEvents: jest.fn(),
}))

const {
  getCalendarEvents,
  getUpcomingEvents,
} = jest.requireMock('../../lib/google-calendar-service')

describe('GET /api/calendar-events', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('applies curated quality filter and paginates all events', async () => {
    getCalendarEvents.mockResolvedValue({
      items: [
        { id: '1', title: 'Event 1', curated: true },
        { id: '2', title: 'Event 2', curated: false },
        { id: '3', title: 'Event 3', curated: true },
      ],
    })

    const response = await GET(
      new Request('http://localhost/api/calendar-events?type=all&quality=curated&page=1&pageSize=2')
    )
    const body = await response.json()

    expect(body.total).toBe(2)
    expect(body.count).toBe(2)
    expect(body.hasMore).toBe(false)
    expect(body.items.map((event: any) => event.id)).toEqual(['1', '3'])
  })

  it('supports quality=all and paginates upcoming events', async () => {
    getUpcomingEvents.mockResolvedValue([
      { id: 'a', title: 'A', curated: true },
      { id: 'b', title: 'B', curated: false },
      { id: 'c', title: 'C', curated: true },
    ])

    const response = await GET(
      new Request('http://localhost/api/calendar-events?type=upcoming&quality=all&page=1&pageSize=2')
    )
    const body = await response.json()

    expect(body.total).toBe(3)
    expect(body.count).toBe(2)
    expect(body.hasMore).toBe(true)
    expect(body.items.map((event: any) => event.id)).toEqual(['a', 'b'])
  })
})
