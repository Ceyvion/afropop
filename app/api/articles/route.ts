import { NextResponse } from 'next/server'

const CRAFT_GRAPHQL_URL =
  process.env.CRAFT_GRAPHQL_URL || 'https://afropop.org/actions/graphql/api'
const CRAFT_API_TOKEN = process.env.CRAFT_API_TOKEN

const GET_LATEST_CONTENT = `
  query GetLatestContent($limit: Int!) {
    entries(section: ["article", "feature"], orderBy: "postDate desc", limit: $limit) {
      id
      title
      slug
      postDate
      sectionHandle
      url
      excerpt
      author {
        ... on users_User {
          fullName
        }
      }
      featuredImage {
        ... on assets_Asset {
        url
      }
      }
    }
  }
`

export async function GET(request: Request) {
  if (!CRAFT_API_TOKEN) {
    console.warn('CRAFT_API_TOKEN is not configured. Returning empty editorial feed.')
    return NextResponse.json(
      {
        items: [],
        count: 0,
        source: 'craft',
        error: 'Editorial stories are temporarily unavailable',
      },
      { status: 200 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const rawLimit = Number(searchParams.get('limit')) || 10
    const limit = Math.max(1, Math.min(rawLimit, 20))

    const response = await fetch(CRAFT_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CRAFT_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: GET_LATEST_CONTENT,
        variables: { limit },
      }),
      // GraphQL endpoint already handles caching; keep fresh for homepage
      cache: 'no-store',
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(
        `Craft GraphQL responded with ${response.status} ${response.statusText} ${text}`
      )
    }

    const json = await response.json()
    if (json.errors?.length) {
      console.error(
        'Craft GraphQL errors:',
        JSON.stringify(json.errors, null, 2)
      )
      return NextResponse.json(
        {
          items: [],
          count: 0,
          source: 'craft',
          error: 'Craft GraphQL query failed',
        },
        { status: 502 }
      )
    }

    const items = json?.data?.entries || []

    return NextResponse.json({
      items,
      count: items.length,
      source: 'craft',
      limit,
    })
  } catch (error: any) {
    console.error('Error fetching Craft articles:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
