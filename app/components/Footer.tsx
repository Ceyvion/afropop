import React from 'react'
import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/afropopww/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@afropopworldwide' },
  { label: 'SoundCloud', href: 'https://soundcloud.com/afropop-worldwide' },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white/60">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-accent-v mb-3">Afropop Worldwide</p>
            <h3 className="text-2xl font-display-condensed text-white leading-tight mb-3">
              Bold stories from the global Black diaspora.
            </h3>
            <p className="text-sm text-white/50 max-w-sm leading-relaxed">
              We document scenes, host the archive, and keep dance floors in conversation with their communities.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-white/45 hover:text-white hover:border-white/25 transition-all"
                  aria-label={social.label}
                >
                  <span className="text-[0.55rem] tracking-[0.15em] uppercase font-semibold">{social.label.substring(0, 2)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[0.55rem] uppercase tracking-[0.35em] text-white/30 mb-3">Explore</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/archive" className="text-white/50 transition-colors hover:text-white">Archive</Link></li>
              <li><Link href="/episodes" className="text-white/50 transition-colors hover:text-white">Episodes</Link></li>
              <li><Link href="/features" className="text-white/50 transition-colors hover:text-white">Magazine</Link></li>
              <li><Link href="/events" className="text-white/50 transition-colors hover:text-white">Events</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[0.55rem] uppercase tracking-[0.35em] text-white/30 mb-3">Platform</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/support" className="text-white/50 transition-colors hover:text-white">Support</Link></li>
              <li><Link href="/programs" className="text-white/50 transition-colors hover:text-white">Programs</Link></li>
              <li><Link href="/contributors" className="text-white/50 transition-colors hover:text-white">Contributors</Link></li>
              <li><Link href="/shop" className="text-white/50 transition-colors hover:text-white">Store</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-[0.55rem] uppercase tracking-[0.35em] text-white/30 mb-3">Newsletter</p>
            <p className="text-sm text-white/50 mb-3 leading-relaxed">
              Weekly drops on music, events, and reporting across the culture.
            </p>
            <Link
              href="/support"
              className="inline-flex w-full items-center justify-center rounded-lg bg-white/90 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black transition-all hover:bg-accent-v hover:text-white"
            >
              Become a Supporter
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border-subtle)] pt-5 text-[0.6rem] uppercase tracking-[0.3em] text-white/30 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span>&copy; {currentYear} Afropop Worldwide</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
