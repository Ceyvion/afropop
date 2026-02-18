export type ApiEnvelope<T> = {
  data?: T
  items?: T
  error?: string
  code?: string
  degraded?: boolean
}

export type SearchItem = {
  id: string
  type: 'Episode' | 'Feature' | 'Event' | 'Program'
  title: string
  description: string
  href: string
  external: boolean
  author?: string
  pubDate?: string
  duration?: string
  image?: string | null
  region?: string | null
  genre?: string | null
}
