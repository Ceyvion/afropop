// Resident Advisor-inspired home layout for Afropop Worldwide
'use client'

import React from 'react'
import Link from 'next/link'
import { EpisodeCard, FeatureCard } from '@/app/components/Cards'
import { usePlayer } from '@/app/components/PlayerProvider'
import { useEpisodes, useFeatures } from '@/app/lib/use-rss-data'

const articleSections = [
  {
    heading: 'GLOBAL SOUND DESIGN',
    body: 'Laurel Halo moves through kosmische pulses, Detroit abstraction, and Lagos percussion stems pulled from the Afropop archives. Her APW residency focuses on motion—how rhythm migrates, how textures warp across continents, and how club futurism traces back to diasporic lineages.',
  },
  {
    heading: 'FIELD NOTES',
    body: 'The mix was captured between Berlin and Brooklyn, with Halo balancing prepared piano fragments against field recordings from Accra’s Highlife Café. Afropop senior producer Georges Collinet threads the conversation around memory, archiving, and the practical magic of radio storytelling.',
  },
  {
    heading: 'SCENE REPORTS',
    body: 'Halo highlights younger collectives—Johannesburg’s Femme Frequency, Kampala’s Anti-Mass, and Abidjan’s NITEFLEX—underscoring how underground promoters keep infrastructure alive. Each detour in the interview points listeners to new sonic geographies worth supporting.',
  },
]

const tracklist = [
  { time: '00:00', artist: 'Laurel Halo', track: 'In Situ (Live Edit)', label: 'Hyperdub' },
  { time: '07:42', artist: 'Aybee', track: '11th Sky', label: 'Deepblak' },
  { time: '14:15', artist: 'Sister Nancy', track: 'Dance Over Africa (Halo Dub)', label: 'VP Records' },
  { time: '22:04', artist: 'Phillipi & Rodrigo', track: 'Gueto de Santo Amaro', label: 'Deviant' },
  { time: '34:51', artist: 'Kampire', track: 'Pan African Tendencies', label: 'Nyege Nyege Tapes' },
  { time: '47:03', artist: 'DJ Satelite x Gama', track: 'Quero Mais', label: 'Seres Produções' },
  { time: '59:12', artist: 'MC Yallah', track: 'Yallah Beibe (Instrumental)', label: 'Hakuna Kulala' },
  { time: '73:05', artist: 'Dakota Bones', track: 'New City Ghosts', label: 'APW Dubplate' },
]

const newsItems = [
  {
    title: 'Kinshasa club nights return',
    summary: 'DIY collectives relaunch underwater techno parties along the Congo River with safety patrols and oral history interludes.',
    date: 'Jun 7',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60',
  },
  {
    title: 'Accra sound labs expand',
    summary: 'A new residency at Surf Ghana’s Freedom Skatepark pairs beatmakers with visiting poets from Abidjan and London.',
    date: 'Jun 5',
    image: 'https://images.unsplash.com/photo-1444824775686-4185f172c44b?w=600&auto=format&fit=crop&q=60',
  },
]

const reviewItems = [
  {
    title: 'Review: Laurel Halo – Atlas (Live mix)',
    rating: '4.5/5',
    blurb: 'A crystalline document that shows Halo listening outward—matching piano minimalism to Sub-Saharan polyrhythms.',
  },
  {
    title: 'Review: Kampire – Alternate Routes EP',
    rating: '4/5',
    blurb: 'A fierce, aerodynamic set of percussion workouts primed for sunrise in Goma or 4 A.M. in Queens.',
  },
]

const popularNews = [
  { title: 'Ghanaian highlife takes over Paris Jazz Fest', date: 'Jun 4' },
  { title: 'Johannesburg collectives lobby for safer warehouses', date: 'Jun 3' },
  { title: 'Nouakchott radio archive unlocked to the public', date: 'Jun 1' },
  { title: 'Tunisian synth pioneer Deena Abdelwahed joins APW Live', date: 'May 29' },
]

const events = [
  { id: 1, title: 'Afropop Live: Brooklyn Museum', date: 'Jun 15 • New York', details: 'Listening salon + conversation', link: '/events' },
  { id: 2, title: 'Felabration Lagos Preview', date: 'Oct 8 • Lagos', details: 'Block party + live recording', link: '/events' },
  { id: 3, title: 'Nairobi Listening Lab', date: 'Jul 2 • Nairobi', details: 'Field recording walk + workshop', link: '/events' },
]

const artistProfile = {
  name: 'Laurel Halo',
  location: 'Brooklyn ↔ Berlin',
  summary: 'Composer, producer, and sound artist tuning diasporic frequencies with Afropop Worldwide.',
}

const formatDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const stripHtml = (value?: string) => {
  if (!value) return ''
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function Home() {
  const { data: episodesData, loading: episodesLoading, error: episodesError } = useEpisodes(4)
  const { data: featuresData, loading: featuresLoading, error: featuresError } = useFeatures(3)
  const player = usePlayer()

  const heroEpisode = episodesData?.items?.[0]
  const heroTitle = heroEpisode?.title || 'APW.992 Laurel Halo'
  const heroDate = formatDate(heroEpisode?.pubDate) || 'June 8 2025'
  const heroDuration = heroEpisode?.duration || '01:24:49'
  const rawHeroDescription = stripHtml(heroEpisode?.description || '')
  const heroDescription = rawHeroDescription
    ? `${rawHeroDescription.slice(0, 220).trim()}${rawHeroDescription.length > 220 ? '…' : ''}`
    : 'Laurel Halo charts a widescreen trip through experimental jazz, Angolan kuduro, and the sonic afterlives of Detroit techno.'
  const heroTags = heroEpisode?.categories?.slice(0, 3) || ['Diaspora', 'Podcast', 'Mix']

  return (
    <div className="bg-page text-white">
      {/* Hero */}
      <section className="hero-band">
        <div className="hero-wrap space-y-10">
          <div className="flex flex-wrap items-center justify-between text-[0.65rem] uppercase tracking-[0.4em] text-white/60">
            <span>Afropop Podcast</span>
            <span>ra.co / podcasts</span>
          </div>

          <div className="space-y-8">
            <p className="meta-pill">APW SERIES</p>
            <h1 className="hero-title">{heroTitle}</h1>
            <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.35em] text-white/60">
              <div className="flex items-center gap-2 text-white">
                <span className="text-white/50">Published</span>
                <span>{heroDate}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-white/50">Length</span>
                <span>{heroDuration}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-white/50">Source</span>
                <span>Afropop Worldwide</span>
              </div>
            </div>
            <p className="hero-copy max-w-3xl">{heroDescription}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/episodes" className="btn-hero bg-white text-black">
                Listen now
              </Link>
              <Link href="/archive" className="btn-hero">
                View archive
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {heroTags.map((tag) => (
                <span key={tag} className="ra-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two-column body */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/20 bg-gradient-to-b from-[#ff2d55] to-[#b10030] p-6 text-white shadow-2xl">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/70">Afropop Worldwide</p>
            <p className="mt-4 text-3xl font-display-condensed leading-tight">{artistProfile.name}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/70">{artistProfile.location}</p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <iframe
              title="Afropop Worldwide SoundCloud Player"
              width="100%"
              height="200"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/372389991&color=%23ff2d55&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            />
          </div>

          <div className="ra-panel space-y-4">
            <p className="section-label">Artist Profile</p>
            <p className="text-2xl font-display-condensed">{artistProfile.name}</p>
            <p className="text-sm text-white/70">{artistProfile.summary}</p>
            <button className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-accent-v hover:text-white">
              Follow
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {articleSections.map((section) => (
            <article key={section.heading} className="ra-panel ra-panel-strong space-y-3">
              <p className="section-label">{section.heading}</p>
              <p className="text-sm md:text-base leading-relaxed text-white/80">{section.body}</p>
            </article>
          ))}
          <div className="ra-panel">
            <p className="ra-quote">
              “Laurel Halo stretches the Afropop archive into something widescreen—music for dancers, yes, but also for people plotting the
              next chapter of community radio.”
            </p>
          </div>
        </div>
      </section>

      {/* Tracklist */}
      <section className="section-band">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <p className="section-label">Tracklist</p>
          <div className="grid gap-4 md:grid-cols-2">
            {tracklist.map((item) => (
              <div key={item.time + item.track} className="rounded-2xl border border-white/10 bg-[#0d0d13] p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
                  <span>{item.time}</span>
                  <span>{item.label}</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-white">{item.track}</p>
                <p className="text-sm text-white/70">{item.artist}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="cta-band flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em]">Explore opportunities</p>
            <p className="mt-2 text-2xl font-display-condensed">APW Pro connects promoters, stations, and cultural workers.</p>
          </div>
          <Link href="/support">Explore now</Link>
        </div>
      </section>

      {/* Events, News, Reviews */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <p className="section-label">Upcoming Events</p>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-white/10 bg-elevated p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/50">{event.date}</p>
                  <p className="text-xl font-semibold mt-1">{event.title}</p>
                  <p className="text-sm text-white/70">{event.details}</p>
                </div>
                <div className="sm:ml-auto">
                  <Link href={event.link} className="text-xs uppercase tracking-[0.3em] text-accent-v hover:text-white">
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="section-label">News</p>
            {newsItems.map((news) => (
              <article key={news.title} className="flex gap-4 rounded-2xl border border-white/10 bg-elevated p-4">
                <div className="h-20 w-24 overflow-hidden rounded-lg bg-white/5">
                  <img src={news.image} alt={news.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/50">{news.date}</p>
                  <h3 className="font-semibold text-white">{news.title}</h3>
                  <p className="text-sm text-white/70">{news.summary}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-4">
            <p className="section-label">Reviews</p>
            {reviewItems.map((review) => (
              <div key={review.title} className="rounded-2xl border border-white/10 bg-elevated p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
                  <span>{review.rating}</span>
                  <span>APW</span>
                </div>
                <h3 className="mt-2 font-semibold">{review.title}</h3>
                <p className="text-sm text-white/70">{review.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="section-label">Latest Features</p>
          <Link href="/features" className="text-xs uppercase tracking-[0.35em] text-accent-v hover:text-white">
            View magazine
          </Link>
        </div>
        {featuresLoading ? (
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        ) : featuresError ? (
          <div className="text-center text-white/60">
            Error loading features: {featuresError}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuresData?.items?.map((feature: any) => (
              <Link
                key={feature.id}
                href={`/features/${String(feature.id).split('/').map(encodeURIComponent).join('/')}`}
                className="block"
              >
                <FeatureCard
                  title={feature.title}
                  dek={feature.description || 'Dive deeper into the story behind the mix.'}
                  author={feature.author || 'Afropop Worldwide'}
                  readTime={feature.duration ? `${Math.max(4, Math.round(parseInt(feature.duration, 10) / 60))} min read` : '8 min read'}
                  image={feature.image}
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular news + Latest podcasts */}
      <section className="section-band">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="section-label">Popular News</p>
            <ul className="space-y-3">
              {popularNews.map((item) => (
                <li key={item.title} className="flex items-center justify-between rounded-full border border-white/10 px-5 py-3">
                  <span className="text-sm">{item.title}</span>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="section-label">Latest Podcasts</p>
              <Link href="/episodes" className="text-xs uppercase tracking-[0.35em] text-accent-v hover:text-white">
                Browse all
              </Link>
            </div>
            {episodesLoading ? (
              <div className="flex justify-center py-12">
                <div className="spinner" />
              </div>
            ) : episodesError ? (
              <div className="text-white/60">Error loading episodes: {episodesError}</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {episodesData?.items?.slice(0, 4)?.map((episode: any) => (
                  <Link
                    key={episode.id}
                    href={`/episodes/${String(episode.id).split('/').map(encodeURIComponent).join('/')}`}
                    className="block"
                  >
                    <EpisodeCard
                      id={episode.id}
                      title={episode.title}
                      region={episode.region || 'Africa'}
                      genre={episode.genre || 'Global'}
                      duration={episode.duration || '45 min'}
                      image={episode.image}
                      categories={episode.categories}
                      density="compact"
                      onPlay={() => {
                        if (episode.audioUrl) {
                          player.play({
                            id: episode.id,
                            title: episode.title,
                            author: episode.author,
                            image: episode.image,
                            audioUrl: episode.audioUrl,
                            duration: episode.duration,
                          })
                        }
                      }}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-[32px] border border-white/10 bg-elevated p-8 text-center space-y-4">
          <p className="section-label justify-center">Are you a promoter?</p>
          <h2 className="text-3xl font-display-condensed">Send us your events and radio stories.</h2>
          <p className="text-white/70">
            Afropop Worldwide partners with curators across the diaspora to surface new collectives, venues, and voices.
          </p>
          <Link
            href="/events/submit"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-black transition hover:bg-accent-v hover:text-white"
          >
            Submit an event
          </Link>
        </div>
      </section>
    </div>
  )
}
