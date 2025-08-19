"use client"

import React, { useState } from 'react'

type SubmissionPayload = {
  type: 'story' | 'song' | 'event'
  title: string
  summary?: string
  body?: string
  tags?: string[]
  links?: string[]
  media?: string[]
  city?: string
  email?: string
}

export default function PitchPage() {
  const [payload, setPayload] = useState<SubmissionPayload>({ type: 'story', title: '' })
  const [linkDraft, setLinkDraft] = useState('')
  const [tagDraft, setTagDraft] = useState('')
  const [mediaDraft, setMediaDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  function addTo<K extends 'links' | 'tags' | 'media'>(key: K, value: string) {
    setPayload((p) => ({ ...p, [key]: [ ...(p[key] || []), value ] }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to submit')
      setResult({ ok: true, message: 'Thanks! Your pitch has been received.' })
      setPayload({ type: 'story', title: '' })
      setLinkDraft(''); setTagDraft(''); setMediaDraft('')
    } catch (err: any) {
      setResult({ ok: false, message: String(err.message || err) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">Pitch Your Story or Song</h1>
          <p className="text-gray-700">We welcome thoughtful pitches from our community. Keep it concise and include relevant links or media. A curator will review and follow up.</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pitch Type</label>
              <div className="flex gap-2">
                {(['story','song','event'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPayload((p) => ({ ...p, type: t }))}
                    className={`px-3 py-1.5 rounded-full border text-sm ${payload.type === t ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {t[0].toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email (optional)</label>
              <input value={payload.email || ''} onChange={(e) => setPayload((p) => ({ ...p, email: e.target.value }))} type="email" placeholder="you@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={payload.title} onChange={(e) => setPayload((p) => ({ ...p, title: e.target.value }))} required minLength={3} placeholder="Give your pitch a clear title" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea value={payload.summary || ''} onChange={(e) => setPayload((p) => ({ ...p, summary: e.target.value }))} rows={3} placeholder="One or two sentences summarizing your pitch" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea value={payload.body || ''} onChange={(e) => setPayload((p) => ({ ...p, body: e.target.value }))} rows={6} placeholder="Add any relevant background, collaborators, dates, etc." className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City (optional)</label>
              <input value={payload.city || ''} onChange={(e) => setPayload((p) => ({ ...p, city: e.target.value }))} placeholder="City, Country" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Link</label>
              <div className="flex gap-2">
                <input value={linkDraft} onChange={(e) => setLinkDraft(e.target.value)} placeholder="https://…" className="flex-1 px-4 py-2 border border-gray-300 rounded-md" />
                <button type="button" onClick={() => { if (linkDraft) { addTo('links', linkDraft); setLinkDraft('') } }} className="px-3 py-2 border border-gray-300 rounded-md">Add</button>
              </div>
              {payload.links && payload.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {payload.links.map((l, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{l}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Tag</label>
              <div className="flex gap-2">
                <input value={tagDraft} onChange={(e) => setTagDraft(e.target.value)} placeholder="e.g., Festival" className="flex-1 px-4 py-2 border border-gray-300 rounded-md" />
                <button type="button" onClick={() => { if (tagDraft) { addTo('tags', tagDraft); setTagDraft('') } }} className="px-3 py-2 border border-gray-300 rounded-md">Add</button>
              </div>
              {payload.tags && payload.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {payload.tags.map((t, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Media URL</label>
              <div className="flex gap-2">
                <input value={mediaDraft} onChange={(e) => setMediaDraft(e.target.value)} placeholder="Image, audio, or video URL" className="flex-1 px-4 py-2 border border-gray-300 rounded-md" />
                <button type="button" onClick={() => { if (mediaDraft) { addTo('media', mediaDraft); setMediaDraft('') } }} className="px-3 py-2 border border-gray-300 rounded-md">Add</button>
              </div>
              {payload.media && payload.media.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {payload.media.map((m, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{m}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">By submitting, you agree to our community guidelines and grant us permission to review your materials.</p>
            <button disabled={submitting} className="px-6 py-3 border border-gray-300 text-sm font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider">
              {submitting ? 'Submitting…' : 'Submit Pitch'}
            </button>
          </div>

          {result && (
            <div className={`text-sm font-medium ${result.ok ? 'text-green-700' : 'text-red-600'}`}>{result.message}</div>
          )}
        </form>
      </div>
    </div>
  )
}

