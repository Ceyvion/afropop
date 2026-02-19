const { __private } = require('./google-calendar-service')

describe('google-calendar-service dedupeNearDuplicates', () => {
  const { dedupeNearDuplicates } = __private

  it('collapses near-duplicates with same city/time and highly similar titles', () => {
    const items = [
      {
        id: 'a',
        title: 'Vision Festival (OUTFEST) - 30 Years of Black & Multicultural Improvised Arts',
        description: 'Tickets https://example.com/vision',
        location: 'Location TBA, New York',
        startDate: '2026-03-12T20:00:00.000Z',
      },
      {
        id: 'b',
        title: 'Vision Festival 2026 - 30 Years of Black and Multicultural Improvised Arts',
        description: 'Lineup and tickets',
        location: 'NY (Venue TBA), New York City',
        startDate: '2026-03-12T20:00:00.000Z',
      },
    ]

    const result = dedupeNearDuplicates(items)
    expect(result).toHaveLength(1)
  })

  it('keeps repeated-title sessions that are several hours apart', () => {
    const items = [
      {
        id: 'a',
        title: "Simo Cell & Abdullah Miniawy - 'Dying is the internet' Album Release",
        description: 'Session 1',
        location: 'Location TBA, Global Release - France/Egypt/International',
        startDate: '2026-03-12T10:00:00.000Z',
      },
      {
        id: 'b',
        title: "Simo Cell & Abdullah Miniawy - 'Dying is the internet' Album Release",
        description: 'Session 2',
        location: 'Location TBA, Global Release - France/Egypt/International',
        startDate: '2026-03-12T13:00:00.000Z',
      },
    ]

    const result = dedupeNearDuplicates(items)
    expect(result).toHaveLength(2)
  })
})
