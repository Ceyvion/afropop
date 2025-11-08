// app/lib/use-rss-data.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { reportError } from '@/app/lib/telemetry.client'

// Hook to fetch RSS feed data
export function useRSSFeed() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/rss')
        const result = await response.json().catch(() => ({ error: 'Invalid JSON from server' }))
        
        if (response.ok) {
          setData(result)
        } else {
          setError(result.error || 'Failed to fetch RSS feed')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch RSS feed')
        console.error('Error fetching RSS feed:', err)
        reportError(err, { hook: 'useRSSFeed' })
      } finally {
        setLoading(false)
      }
    }

    fetchRSSFeed()
  }, [])

  return { data, loading, error }
}

// Hook to search RSS feed data
export function useRSSSearch() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef<number>(0)

  const search = async (query: string, filters: any = {}) => {
    try {
      // Abort previous in-flight request
      if (controllerRef.current) {
        try { controllerRef.current.abort() } catch {}
      }
      controllerRef.current = new AbortController()
      const { signal } = controllerRef.current

      setLoading(true)
      setError(null)

      // Build query string
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key])
        }
      })

      const myId = ++requestIdRef.current
      const response = await fetch(`/api/search?${params.toString()}`, { signal })
      const result = await response.json().catch(() => ({ error: 'Invalid JSON from server' }))

      // Ignore if a newer request has started
      if (myId !== requestIdRef.current) return

      if (response.ok) {
        setData(result)
      } else {
        setError(result.error || 'Failed to search RSS feed')
      }
    } catch (err: any) {
      // Swallow abort errors gracefully
      if (err?.name === 'AbortError') {
        return
      }
      setError(err?.message || 'Failed to search RSS feed')
      console.error('Error searching RSS feed:', err)
      reportError(err, { hook: 'useRSSSearch' })
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, search }
}

// Hook to get episodes
export function useEpisodes(limit?: number, offset?: number) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build query string
        const params = new URLSearchParams()
        if (limit) params.append('limit', limit.toString())
        if (offset) params.append('offset', offset.toString())
        
        const response = await fetch(`/api/episodes?${params.toString()}`)
        const result = await response.json().catch(() => ({ error: 'Invalid JSON from server' }))
        
        if (response.ok) {
          setData(result)
        } else {
          setError(result.error || 'Failed to fetch episodes')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch episodes')
        console.error('Error fetching episodes:', err)
        reportError(err, { hook: 'useEpisodes' })
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [limit, offset])

  return { data, loading, error }
}

// Hook to get features
export function useFeatures(limit?: number, offset?: number) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build query string
        const params = new URLSearchParams()
        if (limit) params.append('limit', limit.toString())
        if (offset) params.append('offset', offset.toString())
        
        const response = await fetch(`/api/features?${params.toString()}`)
        const result = await response.json().catch(() => ({ error: 'Invalid JSON from server' }))
        
        if (response.ok) {
          setData(result)
        } else {
          setError(result.error || 'Failed to fetch features')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch features')
        console.error('Error fetching features:', err)
        reportError(err, { hook: 'useFeatures' })
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [limit, offset])

  return { data, loading, error }
}

// Hook to get a specific item by ID
export function useItemById(id: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItemById = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!id) {
          setError('Item ID is required')
          setLoading(false)
          return
        }
        
        const encoded = String(id).split('/').map(encodeURIComponent).join('/')
        const response = await fetch(`/api/item/${encoded}`)
        const result = await response.json().catch(() => ({ error: 'Invalid JSON from server' }))
        
        if (response.ok) {
          setData(result)
        } else {
          setError(result.error || 'Failed to fetch item')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch item')
        console.error('Error fetching item:', err)
        reportError(err, { hook: 'useItemById', id })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchItemById()
    }
  }, [id])

  return { data, loading, error }
}

// Hook to fetch Craft CMS articles/features via GraphQL bridge
export function useArticles(limit = 10) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/articles?limit=${limit}`)
        const result = await response.json().catch(() => ({ error: 'Invalid JSON from server' }))

        if (!active) return

        if (response.ok) {
          setData(result)
        } else {
          setError(result?.error || 'Failed to fetch articles')
        }
      } catch (err: any) {
        if (!active) return
        setError(err?.message || 'Failed to fetch articles')
        console.error('Error fetching articles:', err)
        reportError(err, { hook: 'useArticles' })
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchArticles()
    return () => {
      active = false
    }
  }, [limit])

  return { data, loading, error }
}

// Hook to fetch upcoming events from the Afropop calendar feed
export function useUpcomingEvents(limit = 3) {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/calendar-events?type=upcoming&limit=${limit}`)
        const result = await response.json().catch(() => ({ error: 'Invalid JSON from server' }))
        if (!active) return

        if (response.ok) {
          const normalized = Array.isArray(result) ? result : result?.items || []
          setData(normalized)
        } else {
          setError(result?.error || 'Failed to fetch upcoming events')
        }
      } catch (err: any) {
        if (!active) return
        setError(err?.message || 'Failed to fetch upcoming events')
        console.error('Error fetching upcoming events:', err)
        reportError(err, { hook: 'useUpcomingEvents' })
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchEvents()
    return () => {
      active = false
    }
  }, [limit])

  return { data, loading, error }
}
