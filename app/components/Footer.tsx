import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white/70">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-accent-v mb-4">Afropop Worldwide</p>
            <h3 className="text-3xl font-display-condensed text-white leading-tight mb-4">
              Bold stories from the global Black diaspora.
            </h3>
            <p className="text-sm text-white/70 max-w-sm">
              We document scenes, host the archive, and keep dance floors in conversation with their communities.
            </p>
            <div className="mt-6 flex gap-4">
              {['Instagram', 'YouTube', 'SoundCloud'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/60 transition"
                  aria-label={label}
                >
                  <span className="text-xs tracking-[0.2em] uppercase">{label.substring(0, 2)}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40 mb-4">Explore</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/archive" className="text-white/70 transition hover:text-white">Archive</Link></li>
              <li><Link href="/episodes" className="text-white/70 transition hover:text-white">Episodes</Link></li>
              <li><Link href="/features" className="text-white/70 transition hover:text-white">Magazine</Link></li>
              <li><Link href="/events" className="text-white/70 transition hover:text-white">Events</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40 mb-4">Platform</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/support" className="text-white/70 transition hover:text-white">Support</Link></li>
              <li><Link href="/programs" className="text-white/70 transition hover:text-white">Programs</Link></li>
              <li><Link href="/contributors" className="text-white/70 transition hover:text-white">Contributors</Link></li>
              <li><Link href="/shop" className="text-white/70 transition hover:text-white">Store</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40 mb-4">Newsletter</p>
            <p className="text-sm text-white/70 mb-4">
              Weekly drops on music, events, and reporting across the culture.
            </p>
            <form className="space-y-3">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Email address"
                className="w-full rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-white/90 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-accent-v hover:text-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.35em] text-white/50 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span>© 2025 Afropop Worldwide</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
