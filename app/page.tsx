// Resident Advisor-inspired home layout for Afropop Worldwide
'use client'

import React from 'react'
import Link from 'next/link'
import { EpisodeCard, FeatureCard } from '@/app/components/Cards'
import { usePlayer } from '@/app/components/PlayerProvider'
import { useArticles, useEpisodes, useFeatures, useUpcomingEvents } from '@/app/lib/use-rss-data'

const FALLBACK_STORY_IMAGE = 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&auto=format&fit=crop&q=60'

const formatDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const formatShortDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const stripHtml = (value?: string) => {
  if (!value) return ''
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

const truncate = (value?: string, length = 200) => {
  if (!value) return ''
  return value.length > length ? `${value.slice(0, length).trim()}…` : value
}

const getFeatureSummary = (item: any, length = 200) => {
  if (!item) return ''
  const text = stripHtml(item.excerpt || item.description || item.content || '')
  return truncate(text, length)
}

const getPrimaryCategory = (item: any, fallback = 'Feature') => {
  if (item?.sectionHandle) return String(item.sectionHandle).toUpperCase()
  const category = item?.categories?.find(
    (cat: unknown): cat is string => typeof cat === 'string' && cat.trim().length > 0
  )
  return category ? category.toUpperCase() : fallback.toUpperCase()
}

const buildFeatureHref = (id?: string | number) => {
  if (!id) return '/features'
  const slug = String(id)
    .split('/')
    .map((chunk) => encodeURIComponent(chunk))
    .join('/')
  return `/features/${slug}`
}

const buildStoryHref = (item?: any) => {
  if (!item) return '/features'
  if (item.url) return item.url
  if (item.sectionHandle && item.slug) {
    return `/${item.sectionHandle}/${item.slug}`
  }
  return buildFeatureHref(item.id)
}

const isExternalHref = (href?: string) => !!href && /^https?:\/\//i.test(href)

const getStoryImage = (item?: any) => item?.featuredImage?.url || item?.image || FALLBACK_STORY_IMAGE

const getStoryAuthor = (item?: any) =>
  item?.author?.fullName || item?.author || 'Afropop Worldwide'

export default function Home() {
  const { data: episodesData, loading: episodesLoading, error: episodesError } = useEpisodes(4)
  const { data: articlesData, loading: articlesLoading, error: articlesError } = useArticles(12)
  const { data: featuresData, loading: featuresLoading, error: featuresError } = useFeatures(8)
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useUpcomingEvents(4)
  const player = usePlayer()

  const heroEpisode = episodesData?.items?.[0]
  const heroTitle = heroEpisode?.title || 'APW.992 Laurel Halo'
  const heroDate = formatDate(heroEpisode?.pubDate) || 'June 8 2025'
  const heroDuration = heroEpisode?.duration || '01:24:49'
  const rawHeroDescription = stripHtml(heroEpisode?.description || '')
  const heroDescription = rawHeroDescription
    ? `${rawHeroDescription.slice(0, 220).trim()}${rawHeroDescription.length > 220 ? '…' : ''}`
    : 'Laurel Halo charts a widescreen trip through experimental jazz, Angolan kuduro, and the sonic afterlives of Detroit techno.'
  const heroTags: string[] = heroEpisode?.categories
    ? heroEpisode.categories.filter((tag: unknown): tag is string => typeof tag === 'string').slice(0, 3)
    : ['Diaspora', 'Podcast', 'Mix']

  const featureItems = featuresData?.items ?? []
  const articleItems = articlesData?.items ?? []
  const hasArticleFeed = articleItems.length > 0
  const editorialItems = hasArticleFeed ? articleItems : featureItems
  const editorialLoading = hasArticleFeed
    ? articlesLoading
    : (!featureItems.length && (articlesLoading || featuresLoading))
  const editorialError = editorialItems.length ? null : articlesError || featuresError

  const editorialPanels = editorialItems.slice(0, 3)
  const newsStories = editorialItems.slice(0, 4)
  const reviewStories = editorialItems.slice(4, 7)
  const bulletinStories = editorialItems.slice(0, 5)
  const timelineStories = editorialItems.slice(0, 6)

  const buildEntry = (story: any) => {
    const href = buildStoryHref(story)
    return {
      id: story?.id,
      href,
      external: isExternalHref(href),
    }
  }

  const panelEntries = editorialPanels.map((story) => ({
    ...buildEntry(story),
    label: getPrimaryCategory(story),
    title: story.title,
    body: getFeatureSummary(story, 240),
  }))

  const newsEntries = newsStories.map((story) => ({
    ...buildEntry(story),
    title: story.title,
    summary: getFeatureSummary(story, 130),
    date: formatShortDate(story.postDate || story.pubDate),
    image: getStoryImage(story),
  }))

  const reviewEntries = reviewStories.map((story) => ({
    ...buildEntry(story),
    title: story.title,
    summary: getFeatureSummary(story, 150),
    date: formatShortDate(story.postDate || story.pubDate),
    category: getPrimaryCategory(story, 'Review'),
  }))

  const bulletinEntries = bulletinStories.map((story) => ({
    ...buildEntry(story),
    title: story.title,
    date: formatShortDate(story.postDate || story.pubDate),
  }))

  const timelineEntries = timelineStories.map((story, index) => ({
    ...buildEntry(story),
    id: story?.id ?? index,
    time: formatShortDate(story.postDate || story.pubDate) || `#${index + 1}`,
    label: getPrimaryCategory(story),
    title: story.title,
    author: getStoryAuthor(story),
  }))

  const profileFeature = editorialItems[0]
  const profileName = getStoryAuthor(profileFeature)
  const profileSummary = profileFeature
    ? getFeatureSummary(profileFeature, 180)
    : 'Stories from across the diaspora.'
  const profileLocation =
    profileFeature?.sectionHandle?.toUpperCase() ||
    getPrimaryCategory(profileFeature, 'Magazine')
  const profileHref = buildStoryHref(profileFeature)
  const profileExternal = isExternalHref(profileHref)

  const upcomingEvents = Array.isArray(eventsData) ? eventsData : eventsData?.items || []

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
          <div className="rounded-[28px] border border-white/20 bg-gradient-to-b from-[#ff2d55] to-[#b10030] p-6 text-white shadow-2xl space-y-4">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/70">Feature spotlight</p>
            <p className="text-3xl font-display-condensed leading-tight">{profileFeature?.title || profileName}</p>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">{profileName}</p>
            <Link
              href={profileHref}
              target={profileExternal ? '_blank' : undefined}
              rel={profileExternal ? 'noreferrer' : undefined}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/80 hover:text-white"
            >
              Read story
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
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
            <p className="section-label">Magazine</p>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">{profileLocation}</p>
            <p className="text-2xl font-display-condensed leading-tight">{profileName}</p>
            <p className="text-sm text-white/70">{profileSummary}</p>
            <Link
              href={profileHref}
              target={profileExternal ? '_blank' : undefined}
              rel={profileExternal ? 'noreferrer' : undefined}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-accent-v hover:text-white"
            >
              Read feature
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {editorialLoading ? (
            <div className="flex justify-center py-10">
              <div className="spinner" />
            </div>
          ) : editorialError ? (
            <p className="text-sm text-white/60">Error loading magazine feed: {editorialError}</p>
          ) : panelEntries.length ? (
            panelEntries.map((panel) => (
              <Link
                key={panel.id || panel.title}
                href={panel.href}
                target={panel.external ? '_blank' : undefined}
                rel={panel.external ? 'noreferrer' : undefined}
                className="block"
              >
                <article className="ra-panel ra-panel-strong space-y-3 hover:border-accent-v/40 transition">
                  <p className="section-label">{panel.label}</p>
                  <h3 className="text-xl font-display-condensed uppercase tracking-[0.1em]">{panel.title}</h3>
                  <p className="text-sm md:text-base leading-relaxed text-white/80">{panel.body}</p>
                </article>
              </Link>
            ))
          ) : (
            <p className="text-sm text-white/60">Fresh magazine features will appear here shortly.</p>
          )}
          <div className="ra-panel">
            <p className="ra-quote">
              “{heroDescription || 'Afropop Worldwide stretches the archive into something widescreen—music for dancers, yes, but also for people plotting the next chapter of community radio.'}”
            </p>
          </div>
        </div>
      </section>

      {/* Tracklist */}
      <section className="section-band">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <p className="section-label">Tracklist</p>
          {editorialLoading ? (
            <div className="flex justify-center py-10">
              <div className="spinner" />
            </div>
          ) : editorialError ? (
            <p className="text-sm text-white/60">Error loading recent stories: {editorialError}</p>
          ) : timelineEntries.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {timelineEntries.map((item) => (
                <Link
                  key={item.id || item.title}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="rounded-2xl border border-white/10 bg-[#0d0d13] p-5 block hover:border-accent-v/50 transition"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
                    <span>{item.time}</span>
                    <span>{item.label}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-white/70">{item.author}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/60">Recent magazine stories will populate this strip once the feed updates.</p>
          )}
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
          {eventsLoading ? (
            <div className="flex justify-center py-10">
              <div className="spinner" />
            </div>
          ) : eventsError ? (
            <p className="text-sm text-white/60">Error loading events: {eventsError}</p>
          ) : upcomingEvents.length ? (
            <div className="space-y-4">
              {upcomingEvents.map((event: any) => {
                const dateLabel = event.formattedDate || formatDate(event.startDate) || 'Date TBA'
                const detail = event.location || event.venue || 'Location TBA'
                const summary = truncate(stripHtml(event.description || ''), 140) || 'Details coming soon.'
                return (
                  <article key={event.id} className="rounded-2xl border border-white/10 bg-elevated p-5 flex flex-col gap-3">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">{dateLabel}</p>
                    <h3 className="text-xl font-semibold leading-tight">{event.title}</h3>
                    <p className="text-sm text-white/70">{detail}</p>
                    <p className="text-sm text-white/60">{summary}</p>
                    <Link href="/events" className="text-xs uppercase tracking-[0.3em] text-accent-v hover:text-white">
                      Details
                    </Link>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-white/60">No upcoming events in the calendar feed right now.</p>
          )}
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="section-label">News</p>
            {editorialLoading ? (
              <div className="flex justify-center py-6">
                <div className="spinner" />
              </div>
            ) : editorialError ? (
              <p className="text-sm text-white/60">Error loading news: {editorialError}</p>
            ) : newsEntries.length ? (
              newsEntries.map((news) => (
                <Link
                  key={news.id || news.title}
                  href={news.href}
                  target={news.external ? '_blank' : undefined}
                  rel={news.external ? 'noreferrer' : undefined}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-elevated p-4 hover:border-accent-v/40 transition"
                >
                  <div className="h-20 w-24 overflow-hidden rounded-lg bg-white/5">
                    <img src={news.image} alt={news.title} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">{news.date || 'New'}</p>
                    <h3 className="font-semibold text-white line-clamp-2">{news.title}</h3>
                    <p className="text-sm text-white/70 line-clamp-3">{news.summary}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-white/60">Magazine stories will populate here when available.</p>
            )}
          </div>

          <div className="space-y-4">
            <p className="section-label">Reviews</p>
            {editorialLoading ? (
              <div className="flex justify-center py-6">
                <div className="spinner" />
              </div>
            ) : editorialError ? (
              <p className="text-sm text-white/60">Error loading reviews: {editorialError}</p>
            ) : reviewEntries.length ? (
              reviewEntries.map((review) => (
                <div key={review.id || review.title} className="rounded-2xl border border-white/10 bg-elevated p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
                    <span>{review.date || 'New'}</span>
                    <span>{review.category}</span>
                  </div>
                  <h3 className="font-semibold leading-snug">{review.title}</h3>
                  <p className="text-sm text-white/70 line-clamp-3">{review.summary}</p>
                  <Link
                    href={review.href}
                    target={review.external ? '_blank' : undefined}
                    rel={review.external ? 'noreferrer' : undefined}
                    className="text-xs uppercase tracking-[0.3em] text-accent-v hover:text-white"
                  >
                    Read story
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">Once the RSS feed updates, review highlights will appear here.</p>
            )}
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
            {featuresData?.items?.slice(0, 3)?.map((feature: any) => (
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
            {editorialLoading ? (
              <div className="flex justify-center py-6">
                <div className="spinner" />
              </div>
            ) : editorialError ? (
              <p className="text-sm text-white/60">Error loading bulletins: {editorialError}</p>
            ) : bulletinEntries.length ? (
              <ul className="space-y-3">
                {bulletinEntries.map((item) => (
                  <li key={item.id || item.title} className="flex items-center justify-between rounded-full border border-white/10 px-5 py-3">
                    <Link
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className="text-sm hover:text-accent-v transition"
                    >
                      {item.title}
                    </Link>
                    <span className="text-xs uppercase tracking-[0.3em] text-white/50">{item.date || 'New'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/60">News bulletins will update when the Afropop feed publishes.</p>
            )}
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
