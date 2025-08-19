"use client"

import React, { useEffect, useState } from 'react'

type Submission = {
  id: string
  type: 'story' | 'song' | 'event'
  title: string
  summary?: string
  city?: string
  status: 'submitted' | 'in_review' | 'approved' | 'rejected'
  createdAt: string
}

export default function Community() {
  const [items, setItems] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const url = status ? `/api/submissions?status=${encodeURIComponent(status)}` : '/api/submissions'
        const res = await fetch(url, { cache: 'no-store' })
        const json = await res.json()
        setItems(json.items || [])
      } catch (e: any) {
        setError('Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [status])

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">Community Submissions</h1>
          <p className="text-gray-700">A peek at recent pitches from the Afropop community.</p>
        </div>

        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            {['', 'submitted', 'in_review', 'approved', 'rejected'].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full border text-sm ${status === s ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                {s ? s.replace('_', ' ') : 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-2"></div></div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">No submissions yet. Be the first to <a className="text-accent-2 hover:text-accent" href="/pitch">pitch</a>!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-gray-500">{s.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'approved' ? 'bg-green-100 text-green-700' : s.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{s.status.replace('_',' ')}</span>
                </div>
                <h3 className="font-bold text-ink mb-1 line-clamp-2">{s.title}</h3>
                {s.summary && <p className="text-sm text-gray-600 line-clamp-3 mb-2">{s.summary}</p>}
                <div className="text-xs text-gray-500 flex items-center gap-3">
                  <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                  {s.city && (<><span>•</span><span>{s.city}</span></>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

