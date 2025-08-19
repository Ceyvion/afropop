"use client"

import React, { useEffect, useMemo, useState } from 'react'

type Props = {
  targetType: 'episode' | 'feature' | 'event' | 'submission'
  targetId: string | number
  compact?: boolean
}

type ReactionKind = 'like' | 'clap' | 'fire'

function storageKey(t: string, id: string | number) {
  return `engage:${t}:${id}`
}

export default function EngagementBar({ targetType, targetId, compact }: Props) {
  const key = useMemo(() => storageKey(targetType, targetId), [targetType, targetId])
  const [reactions, setReactions] = useState<Record<ReactionKind, boolean>>({ like: false, clap: false, fire: false })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        setReactions(parsed.reactions || { like: false, clap: false, fire: false })
        setSaved(!!parsed.saved)
      }
    } catch {}
  }, [key])

  function persist(next: { reactions?: Record<ReactionKind, boolean>; saved?: boolean }) {
    try {
      const current = { reactions, saved }
      const payload = { ...current, ...next }
      localStorage.setItem(key, JSON.stringify(payload))
    } catch {}
  }

  function toggleReaction(kind: ReactionKind) {
    setReactions((r) => {
      const next = { ...r, [kind]: !r[kind] }
      persist({ reactions: next })
      return next
    })
  }

  function toggleSave() {
    setSaved((s) => {
      const next = !s
      persist({ saved: next })
      try {
        const listRaw = localStorage.getItem('engage:saved:list')
        const list = listRaw ? (JSON.parse(listRaw) as string[]) : []
        const idStr = `${targetType}:${targetId}`
        const updated = next ? Array.from(new Set([...list, idStr])) : list.filter((x) => x !== idStr)
        localStorage.setItem('engage:saved:list', JSON.stringify(updated))
      } catch {}
      return next
    })
  }

  const classes = compact ? 'text-xs gap-2' : 'text-sm gap-3'

  return (
    <div className={`flex items-center ${classes}`}>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleReaction('like') }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${reactions.like ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        aria-pressed={reactions.like}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        Like
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleReaction('clap') }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${reactions.clap ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        aria-pressed={reactions.clap}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 2a1.5 1.5 0 013 0v4a1.5 1.5 0 01-3 0V2zm5.657 1.343a1.5 1.5 0 112.121 2.121l-2.829 2.829a1.5 1.5 0 11-2.121-2.121l2.829-2.829zM2 10.5a1.5 1.5 0 010-3h4a1.5 1.5 0 010 3H2zm3.343-7.157a1.5 1.5 0 012.121 0l2.829 2.829a1.5 1.5 0 01-2.121 2.121L3.343 5.464a1.5 1.5 0 010-2.121zM7 14l5-5 7.071 7.071a4 4 0 01-5.657 5.657L7 14z"/></svg>
        Clap
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleReaction('fire') }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${reactions.fire ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        aria-pressed={reactions.fire}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s4 3 4 7a4 4 0 01-8 0c0-4 4-7 4-7zm0 9a7 7 0 017 7 7 7 0 11-14 0 7 7 0 017-7z"/></svg>
        Fire
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave() }}
        className={`ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-full border ${saved ? 'bg-ink text-white border-ink' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        aria-pressed={saved}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2a2 2 0 00-2 2v18l8-4 8 4V4a2 2 0 00-2-2H6z"/></svg>
        Save
      </button>
    </div>
  )
}

