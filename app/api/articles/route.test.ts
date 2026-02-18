/** @jest-environment node */

describe('GET /api/articles', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
    delete process.env.CRAFT_API_TOKEN
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns explicit degraded status when editorial token is missing', async () => {
    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/api/articles'))
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.code).toBe('EDITORIAL_UNAVAILABLE')
    expect(body.degraded).toBe(true)
    expect(body.items).toEqual([])
  })
})
