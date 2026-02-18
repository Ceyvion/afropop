/** @jest-environment node */

import { GET } from './route'
import { searchRSSFeed } from '../../lib/rss-service'

jest.mock('../../lib/rss-service', () => ({
  searchRSSFeed: jest.fn(),
}))

describe('GET /api/search', () => {
  it('passes pagination filters and returns canonical href data', async () => {
    ;(searchRSSFeed as jest.Mock).mockResolvedValue({
      items: [
        {
          id: 'episode-1',
          type: 'Episode',
          title: 'Episode One',
          description: 'Episode description',
        },
        {
          id: 'feature-1',
          type: 'Feature',
          title: 'Feature One',
          description: 'Feature description',
          link: 'https://example.com/features/one',
        },
      ],
      count: 2,
      total: 7,
      page: 2,
      pageSize: 2,
      hasMore: true,
      query: 'afro',
      filters: { type: 'episode' },
    })

    const response = await GET(
      new Request('http://localhost/api/search?q=afro&type=episode&page=2&pageSize=2')
    )
    const body = await response.json()

    expect(searchRSSFeed).toHaveBeenCalledWith(
      'afro',
      { type: 'episode' },
      { page: 2, pageSize: 2 }
    )
    expect(body.total).toBe(7)
    expect(body.page).toBe(2)
    expect(body.pageSize).toBe(2)
    expect(body.hasMore).toBe(true)
    expect(body.items[0].href).toBe('/episodes/episode-1')
    expect(body.items[0].external).toBe(false)
    expect(body.items[1].href).toBe('https://example.com/features/one')
    expect(body.items[1].external).toBe(true)
  })
})
