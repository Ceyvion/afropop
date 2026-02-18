import React from 'react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-page text-white">
      <section className="page-shell page-section page-stack">
        <div className="space-y-4">
          <p className="page-kicker">Terms</p>
          <h1 className="page-title text-4xl md:text-5xl leading-tight">Terms of Use</h1>
          <p className="text-white/70 max-w-3xl">
            By using this site, you agree to use content and tools responsibly and in accordance with applicable law.
          </p>
        </div>

        <div className="ra-panel space-y-4 text-sm text-white/75 leading-relaxed">
          <p>
            Content on Afropop Worldwide is for personal and educational use unless otherwise stated. Republishing or
            redistribution requires written permission.
          </p>
          <p>
            Questions about rights and usage can be sent to{' '}
            <a href="mailto:press@afropop.org" className="text-accent-v hover:text-white transition">
              press@afropop.org
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
