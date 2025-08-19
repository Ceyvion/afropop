// Simple in-memory submissions API for prototype

type Submission = {
  id: string
  type: 'story' | 'song' | 'event'
  title: string
  summary?: string
  body?: string
  tags?: string[]
  links?: string[]
  media?: string[]
  city?: string
  email?: string
  status: 'submitted' | 'in_review' | 'approved' | 'rejected'
  createdAt: string
}

const store: { items: Submission[] } = { items: [] }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const items = status ? store.items.filter((s) => s.status === status) : store.items
  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const type = (data?.type || '').toLowerCase()
    if (!['story', 'song', 'event'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid type' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    if (!data?.title || String(data.title).trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const s: Submission = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      title: String(data.title).trim(),
      summary: data.summary ? String(data.summary).slice(0, 500) : undefined,
      body: data.body ? String(data.body) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map((t: any) => String(t)).slice(0, 12) : undefined,
      links: Array.isArray(data.links) ? data.links.map((t: any) => String(t)).slice(0, 6) : undefined,
      media: Array.isArray(data.media) ? data.media.map((t: any) => String(t)).slice(0, 6) : undefined,
      city: data.city ? String(data.city) : undefined,
      email: data.email ? String(data.email) : undefined,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    }
    store.items.unshift(s)
    return new Response(JSON.stringify({ item: s }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
}

