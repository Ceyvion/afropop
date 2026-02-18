import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-page text-white">
      <section className="page-shell page-section page-stack">
        <div className="space-y-4">
          <p className="page-kicker">Privacy</p>
          <h1 className="page-title text-4xl md:text-5xl leading-tight">Privacy Policy</h1>
          <p className="text-white/70 max-w-3xl">
            Afropop Worldwide respects your privacy. This page explains what data is collected, how it is used, and
            how to contact us with privacy questions.
          </p>
        </div>

        <div className="ra-panel space-y-4 text-sm text-white/75 leading-relaxed">
          <p>
            We collect only the information required to operate this website, improve performance, and respond to
            supporter inquiries. We do not sell personal data.
          </p>
          <p>
            For privacy requests, email{' '}
            <a href="mailto:info@afropop.org" className="text-accent-v hover:text-white transition">
              info@afropop.org
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
