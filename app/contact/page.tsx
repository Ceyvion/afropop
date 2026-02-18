import React from 'react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-page text-white">
      <section className="page-shell page-section page-stack">
        <div className="space-y-4">
          <p className="page-kicker">Contact</p>
          <h1 className="page-title text-4xl md:text-5xl leading-tight">Contact Afropop Worldwide</h1>
          <p className="text-white/70 max-w-3xl">
            Reach our team for editorial, partnerships, and media requests.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="ra-panel space-y-2 text-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">General</p>
            <a href="mailto:info@afropop.org" className="text-accent-v hover:text-white transition">
              info@afropop.org
            </a>
          </div>
          <div className="ra-panel space-y-2 text-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Press</p>
            <a href="mailto:press@afropop.org" className="text-accent-v hover:text-white transition">
              press@afropop.org
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
