// Home page for Afropop Worldwide
'use client'

import React from 'react'
import Link from 'next/link'
import { EpisodeCard, FeatureCard } from '@/app/components/Cards'
import { usePlayer } from '@/app/components/PlayerProvider'
import { useArticles, useEpisodes, useFeatures, useUpcomingEvents } from '@/app/lib/use-rss-data'
import { Button } from '@/app/components/Button'
import AsyncSection from '@/app/components/AsyncSection'

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
    ? `${rawHeroDescription.slice(0, 200).trim()}${rawHeroDescription.length > 200 ? '…' : ''}`
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

  const panelEntries = editorialPanels.map((story: any) => ({
    ...buildEntry(story),
    label: getPrimaryCategory(story),
    title: story.title,
    body: getFeatureSummary(story, 200),
  }))

  const newsEntries = newsStories.map((story: any) => ({
    ...buildEntry(story),
    title: story.title,
    summary: getFeatureSummary(story, 120),
    date: formatShortDate(story.postDate || story.pubDate),
    image: getStoryImage(story),
  }))

  const reviewEntries = reviewStories.map((story: any) => ({
    ...buildEntry(story),
    title: story.title,
    summary: getFeatureSummary(story, 140),
    date: formatShortDate(story.postDate || story.pubDate),
    category: getPrimaryCategory(story, 'Review'),
  }))

  const bulletinEntries = bulletinStories.map((story: any) => ({
    ...buildEntry(story),
    title: story.title,
    date: formatShortDate(story.postDate || story.pubDate),
  }))

  const timelineEntries = timelineStories.map((story: any, index: number) => ({
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
    ? getFeatureSummary(profileFeature, 160)
    : 'Stories from across the diaspora.'
  const profileLocation =
    profileFeature?.sectionHandle?.toUpperCase() ||
    getPrimaryCategory(profileFeature, 'Magazine')
  const profileHref = buildStoryHref(profileFeature)
  const profileExternal = isExternalHref(profileHref)

  const upcomingEvents = Array.isArray(eventsData)
    ? eventsData
    : ((eventsData as any)?.items ?? [])

  return (
    <div className="bg-page text-white">
      {/* ─── Hero ─── */}
      <section className="hero-band">
        <div className="hero-wrap space-y-8">
          <div className="flex items-center gap-3 text-2xs uppercase tracking-[0.4em] text-white/40">
            <span className="inline-block h-px w-8 bg-white/20" />
            <span>Afropop Worldwide</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Music · Culture · Diaspora</span>
          </div>

          <div className="space-y-6">
            <p className="meta-pill">APW SERIES</p>
            <h1 className="hero-title">{heroTitle}</h1>

            <div className="flex flex-wrap gap-5 text-2xs uppercase tracking-[0.3em] text-white/50">
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">Published</span>
                <span className="text-white/80">{heroDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">Length</span>
                <span className="text-white/80">{heroDuration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">Source</span>
                <span className="text-white/80">Afropop Worldwide</span>
              </div>
            </div>

            <p className="hero-copy max-w-2xl">{heroDescription}</p>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/episodes">Listen now</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/archive">View archive</Link>
              </Button>
              <Button asChild variant="accent" size="lg">
                <Link href="/pitch">Submit a Pitch</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {heroTags.map((tag) => (
                <span key={tag} className="ra-chip">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Now Playing ─── */}
      <section className="container-wide py-10 md:py-14 space-y-8">
        {/* Now Playing strip: episode context + SoundCloud side by side */}
        <div className="grid gap-5 lg:grid-cols-[1fr_320px] items-start">
          <Link
            href={profileHref}
            target={profileExternal ? '_blank' : undefined}
            rel={profileExternal ? 'noreferrer' : undefined}
            className="group block"
          >
            <div className="rounded-xl border border-white/15 bg-gradient-to-br from-[#ff2d55]/20 to-transparent p-6 space-y-3 transition-all hover:border-[rgba(255,45,85,0.35)]">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-[#ff2d55] animate-pulse" />
                <p className="text-2xs uppercase tracking-[0.3em] text-accent-v font-bold">Now Playing</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-display-condensed leading-tight uppercase tracking-wide group-hover:text-accent-v/90 transition-colors">
                {profileFeature?.title || heroTitle}
              </h2>
              <p className="text-sm text-white/55 leading-relaxed max-w-2xl">{profileSummary}</p>
              <div className="flex items-center gap-4 pt-1">
                <span className="text-2xs uppercase tracking-[0.25em] text-white/40">{profileName}</span>
                <span className="text-white/20">·</span>
                <span className="text-2xs uppercase tracking-[0.25em] text-white/40">{profileLocation}</span>
              </div>
            </div>
          </Link>
          <div className="space-y-2">
            <p className="text-2xs uppercase tracking-[0.3em] text-white/40 px-1">Listen on SoundCloud</p>
            <div className="overflow-hidden rounded-xl border border-white/8">
              <iframe
                title="Afropop Worldwide SoundCloud Player"
                width="100%"
                height="180"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/afropop-worldwide&color=%23ff2d55&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
              />
            </div>
          </div>
        </div>

        {/* Editorial grid: 3 equal-weight panels */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="section-label">From the Magazine</p>
            <Link href="/features" className="text-2xs uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
              View all
            </Link>
          </div>
          <AsyncSection
            loading={editorialLoading}
            error={editorialError}
            errorLabel="Could not load magazine feed."
            isEmpty={!panelEntries.length}
            emptyLabel="Fresh magazine features will appear here shortly."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {panelEntries.map((panel: any, index: number) => (
                <Link
                  key={panel.id || panel.title}
                  href={panel.href}
                  target={panel.external ? '_blank' : undefined}
                  rel={panel.external ? 'noreferrer' : undefined}
                  className="block group"
                >
                  <article className={`ra-panel space-y-3 h-full hover:border-[rgba(255,45,85,0.3)] transition-all ${index === 0 ? 'ra-panel-strong' : ''}`}>
                    <p className="section-label">{panel.label}</p>
                    <h3 className="text-lg font-display-condensed uppercase tracking-wide group-hover:text-accent-v/90 transition-colors">{panel.title}</h3>
                    <p className="text-sm leading-relaxed text-white/55 line-clamp-3">{panel.body}</p>
                  </article>
                </Link>
              ))}
            </div>
          </AsyncSection>
        </div>
      </section>

      {/* ─── Tracklist ─── */}
      <section className="section-band">
        <div className="container-wide py-10 space-y-5">
          <div className="flex items-center justify-between">
            <p className="section-label">Tracklist</p>
            <Link href="/features" className="text-2xs uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
              View all
            </Link>
          </div>
          <AsyncSection
            loading={editorialLoading}
            error={editorialError}
            errorLabel="Could not load recent stories."
            isEmpty={!timelineEntries.length}
            emptyLabel="Recent magazine stories will populate this strip once the feed updates."
          >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {timelineEntries.map((item: any) => (
                <Link
                  key={item.id || item.title}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-4 block hover:border-[rgba(255,45,85,0.25)] transition-all"
                >
                  <div className="flex items-center justify-between text-2xs uppercase tracking-[0.3em] text-white/40">
                    <span>{item.time}</span>
                    <span className="text-accent-v/70">{item.label}</span>
                  </div>
                  <p className="mt-2.5 text-[15px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-accent-v/90 transition-colors">{item.title}</p>
                  <p className="mt-1 text-xs text-white/50">{item.author}</p>
                </Link>
              ))}
            </div>
          </AsyncSection>
        </div>
      </section>

      {/* ─── CTA band ─── */}
      <section className="container-wide py-10">
        <div className="cta-band flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xs uppercase tracking-[0.3em] opacity-70">Explore opportunities</p>
            <p className="mt-1.5 text-xl font-display-condensed">APW Pro connects promoters, stations, and cultural workers.</p>
          </div>
          <Link href="/support">Explore now</Link>
        </div>
      </section>

      {/* ─── Events + News + Reviews ─── */}
      <section className="container-wide py-10 grid gap-8 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
        {/* Events */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="section-label">Upcoming Events</p>
            <Link href="/events" className="text-2xs uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
              All events
            </Link>
          </div>
          <AsyncSection
            loading={eventsLoading}
            error={eventsError}
            errorLabel="Could not load upcoming events."
            isEmpty={!upcomingEvents.length}
            emptyLabel="No upcoming events in the calendar feed right now."
          >
            <div className="space-y-3">
              {upcomingEvents.map((event: any) => {
                const dateLabel = event.formattedDate || formatDate(event.startDate) || 'Date TBA'
                const detail = event.location || event.venue || 'Location TBA'
                const summary = truncate(stripHtml(event.description || ''), 120) || 'Details coming soon.'
                return (
                  <article key={event.id} className="rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-4 flex flex-col gap-2">
                    <p className="text-2xs uppercase tracking-[0.3em] text-white/40">{dateLabel}</p>
                    <h3 className="text-lg font-semibold leading-tight">{event.title}</h3>
                    <p className="text-sm text-white/55">{detail}</p>
                    <p className="text-sm text-white/45 line-clamp-2">{summary}</p>
                    <Link href="/events" className="text-2xs uppercase tracking-[0.25em] text-accent-v hover:text-white transition-colors mt-1">
                      Details
                    </Link>
                  </article>
                )
              })}
            </div>
          </AsyncSection>
        </div>

        {/* News + Reviews */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="section-label">News</p>
            <AsyncSection
              loading={editorialLoading}
              error={editorialError}
              errorLabel="Could not load news."
              isEmpty={!newsEntries.length}
              emptyLabel="Magazine stories will populate here when available."
            >
              <div className="space-y-3">
                {newsEntries.map((news: any) => (
                  <Link
                    key={news.id || news.title}
                    href={news.href}
                    target={news.external ? '_blank' : undefined}
                    rel={news.external ? 'noreferrer' : undefined}
                    className="flex gap-3.5 rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-3.5 hover:border-[rgba(255,45,85,0.2)] transition-all"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <img
                        src={news.image}
                        alt={news.title}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xs uppercase tracking-[0.3em] text-white/40">{news.date || 'New'}</p>
                      <h3 className="font-semibold text-white text-[15px] leading-snug line-clamp-2 mt-0.5">{news.title}</h3>
                      <p className="text-sm text-white/55 line-clamp-2 mt-1">{news.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </AsyncSection>
          </div>

          <div className="space-y-4">
            <p className="section-label">Reviews</p>
            <AsyncSection
              loading={editorialLoading}
              error={editorialError}
              errorLabel="Could not load reviews."
              isEmpty={!reviewEntries.length}
              emptyLabel="Once the RSS feed updates, review highlights will appear here."
            >
              <div className="space-y-3">
                {reviewEntries.map((review: any) => (
                  <div key={review.id || review.title} className="rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-4 space-y-2">
                    <div className="flex items-center justify-between text-2xs uppercase tracking-[0.3em] text-white/40">
                      <span>{review.date || 'New'}</span>
                      <span className="text-accent-v/60">{review.category}</span>
                    </div>
                    <h3 className="font-semibold leading-snug text-[15px]">{review.title}</h3>
                    <p className="text-sm text-white/55 line-clamp-2">{review.summary}</p>
                    <Link
                      href={review.href}
                      target={review.external ? '_blank' : undefined}
                      rel={review.external ? 'noreferrer' : undefined}
                      className="text-2xs uppercase tracking-[0.25em] text-accent-v hover:text-white transition-colors inline-block pt-1"
                    >
                      Read story
                    </Link>
                  </div>
                ))}
              </div>
            </AsyncSection>
          </div>
        </div>
      </section>

      {/* ─── Latest Features ─── */}
      <section className="container-wide py-10 space-y-5">
        <div className="flex items-center justify-between">
          <p className="section-label">Latest Features</p>
          <Link href="/features" className="text-2xs uppercase tracking-[0.3em] text-accent-v hover:text-white transition-colors">
            View magazine
          </Link>
        </div>
        <AsyncSection
          loading={featuresLoading}
          error={featuresError}
          errorLabel="Could not load feature cards."
          isEmpty={!featuresData?.items?.length}
          emptyLabel="Feature cards will appear when the feed updates."
        >
          <div className="grid gap-4 md:grid-cols-3">
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
        </AsyncSection>
      </section>

      {/* ─── Popular News + Latest Podcasts ─── */}
      <section className="section-band">
        <div className="container-wide py-10 grid gap-8 lg:grid-cols-2">
          {/* Popular news */}
          <div className="space-y-4">
            <p className="section-label">Popular News</p>
            <AsyncSection
              loading={editorialLoading}
              error={editorialError}
              errorLabel="Could not load bulletins."
              isEmpty={!bulletinEntries.length}
              emptyLabel="News bulletins will update when the Afropop feed publishes."
            >
              <ul className="space-y-2">
                {bulletinEntries.map((item: any) => (
                  <li key={item.id || item.title} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-2.5 hover:border-[rgba(255,45,85,0.2)] transition-all">
                    <Link
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className="text-sm hover:text-accent-v transition-colors line-clamp-1 mr-3"
                    >
                      {item.title}
                    </Link>
                    <span className="text-2xs uppercase tracking-[0.25em] text-white/35 flex-shrink-0">{item.date || 'New'}</span>
                  </li>
                ))}
              </ul>
            </AsyncSection>
          </div>

          {/* Latest podcasts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="section-label">Latest Podcasts</p>
              <Link href="/episodes" className="text-2xs uppercase tracking-[0.3em] text-accent-v hover:text-white transition-colors">
                Browse all
              </Link>
            </div>
            <AsyncSection
              loading={episodesLoading}
              error={episodesError}
              errorLabel="Could not load latest podcasts."
              isEmpty={!episodesData?.items?.length}
              emptyLabel="Podcast cards will appear when the feed updates."
            >
              <div className="grid gap-4 md:grid-cols-2">
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
            </AsyncSection>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="container-wide py-14">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-8 md:p-10 text-center space-y-4">
          <p className="section-label justify-center">Are you a promoter?</p>
          <h2 className="text-2xl md:text-3xl font-display-condensed">Send us your events and radio stories.</h2>
          <p className="text-white/55 max-w-xl mx-auto text-sm leading-relaxed">
            Afropop Worldwide partners with curators across the diaspora to surface new collectives, venues, and voices.
          </p>
          <div className="pt-2">
            <Button asChild variant="primary" size="lg">
              <Link href="/pitch">Submit a Pitch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
