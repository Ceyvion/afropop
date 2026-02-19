// Card components — tighter, sharper, system-consistent
import React from 'react'
import EngagementBar from './EngagementBar'

// Episode Card
export const EpisodeCard = ({ id, title, region, genre, duration, image, categories, onPlay, showEngagement = true, density = 'comfortable' }: {
  id?: string | number;
  title: string;
  region: string;
  genre: string;
  duration: string;
  image?: string;
  categories?: string[];
  onPlay?: (e: React.MouseEvent) => void;
  showEngagement?: boolean;
  density?: 'comfortable' | 'compact';
}) => {
  const additionalTags = categories
    ?.filter(cat =>
      cat.toLowerCase() !== region?.toLowerCase() &&
      cat.toLowerCase() !== genre?.toLowerCase() &&
      !['episode', 'podcast', 'audio'].includes(cat.toLowerCase())
    )
    .slice(0, 2) || []

  const compact = density === 'compact'
  const padClass = compact ? 'p-3.5' : 'p-5'
  const titleClass = compact
    ? 'font-semibold text-white line-clamp-2 mb-1.5 text-[15px] leading-snug'
    : 'font-semibold text-white line-clamp-2 mb-2.5 text-lg leading-snug'
  const chipsWrapClass = compact ? 'flex flex-wrap gap-1.5 mb-3' : 'flex flex-wrap gap-1.5 mb-4'
  const chipClass = 'inline-flex items-center rounded-md text-[0.6rem] font-semibold uppercase tracking-[0.15em] bg-white/[0.06] text-white/60 '
    + (compact ? 'px-1.5 py-0.5' : 'px-2 py-0.5')
  const playIconClass = compact ? 'h-4 w-4' : 'h-5 w-5'
  const durationClass = 'text-xs text-white/45'
  const imageAspect = compact ? 'aspect-[4/3]' : 'aspect-square'
  const imageWidth = compact ? 640 : 800
  const imageHeight = compact ? 480 : 800
  const showEngage = showEngagement && !compact && id != null
  const canPlay = typeof onPlay === 'function'

  return (
    <div className={`group overflow-hidden border border-[var(--border)] bg-[var(--elevated)] text-white transition-all duration-200 card-hover ${compact ? 'rounded-xl' : 'rounded-xl shadow-[var(--shadow-md)] hover:border-[rgba(255,45,85,0.25)]'}`}>
      {image ? (
        <div className={`${imageAspect} w-full overflow-hidden`}>
          <img
            src={image}
            alt={title}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.parentElement!.innerHTML = `<div class="bg-white/[0.03] ${imageAspect} w-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg></div>`;
            }}
          />
        </div>
      ) : (
        <div className={`bg-white/[0.03] ${imageAspect} w-full flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      )}

      <div className={padClass}>
        <h3 className={titleClass}>{title}</h3>

        <div className={chipsWrapClass}>
          {region && <span className={chipClass}>{region}</span>}
          {genre && <span className={chipClass}>{genre}</span>}
          {!compact && additionalTags.map((tag, index) => (
            <span key={index} className={chipClass}>{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className={durationClass}>{duration}</span>
          {canPlay ? (
            <button
              className="text-accent-v transition-colors hover:text-white"
              aria-label={`Play ${title}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPlay?.(e);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={playIconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : (
            <span className="text-white/20" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className={playIconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          )}
        </div>
        {showEngage && (
          <div className="mt-3">
            <EngagementBar targetType="episode" targetId={id} />
          </div>
        )}
      </div>
    </div>
  )
}

// Feature Card
export const FeatureCard = ({ title, dek, author, readTime, image, density = 'comfortable' }: {
  title: string;
  dek: string;
  author: string;
  readTime: string;
  image?: string;
  density?: 'comfortable' | 'compact';
}) => {
  const compact = density === 'compact'
  const padClass = compact ? 'p-3.5' : 'p-5'
  const titleClass = compact ? 'font-semibold text-white line-clamp-2 mb-1.5 text-[15px] leading-snug' : 'font-semibold text-white line-clamp-2 mb-2 text-lg leading-snug'
  const dekClass = compact ? 'text-sm text-white/55 line-clamp-2 mb-2.5' : 'text-sm text-white/55 line-clamp-2 mb-3'
  const metaClass = 'text-xs text-white/40'
  const imageAspect = compact ? 'aspect-[16/9]' : 'aspect-[3/2]'
  const imageWidth = compact ? 960 : 1200
  const imageHeight = compact ? 540 : 800
  return (
    <div className={`group overflow-hidden border border-[var(--border)] bg-[var(--elevated)] text-white transition-all duration-200 card-hover ${compact ? 'rounded-xl' : 'rounded-xl shadow-[var(--shadow-md)] hover:border-[rgba(255,45,85,0.25)]'}`}>
      {image ? (
        <div className={`${imageAspect} w-full overflow-hidden`}>
          <img
            src={image}
            alt={title}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.parentElement!.innerHTML = `<div class="bg-white/[0.03] ${imageAspect} w-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>`
            }}
          />
        </div>
      ) : (
        <div className={`bg-white/[0.03] ${imageAspect} w-full flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div className={padClass}>
        <h3 className={titleClass}>{title}</h3>
        <p className={dekClass}>{dek}</p>

        <div className="flex items-center justify-between">
          <span className={metaClass}>{author}</span>
          <span className={metaClass}>{readTime}</span>
        </div>
      </div>
    </div>
  )
}

// Event Card
export const EventCard = ({ title, date, city, venue, ctaHref }: {
  title: string;
  date: string;
  city: string;
  venue: string;
  ctaHref?: string;
}) => {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-4 text-white">
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2.5">
        <div className="text-2xs uppercase tracking-[0.3em] text-white/40 sm:w-36 shrink-0">{date}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold leading-snug">{title}</h3>
          <div className="mt-1 text-sm text-white/55">{city}{city && venue ? ', ' : ''}{venue}</div>
          {ctaHref ? (
            <div className="mt-2.5">
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xs uppercase tracking-[0.25em] text-accent-v hover:text-white transition-colors"
              >
                Tickets
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// Program Card
export const ProgramCard = ({ title, purpose }: {
  title: string;
  purpose: string;
}) => {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--elevated)] text-white card-hover">
      <div className="bg-white/[0.03] border-b border-[var(--border-subtle)] aspect-video w-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>

      <div className="p-5">
        <p className="text-2xs uppercase tracking-[0.25em] text-white/40 mb-2">Program</p>
        <h3 className="font-semibold text-xl mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-white/55 line-clamp-2 mb-3">{purpose}</p>

        <div className="flex -space-x-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white/[0.06] border border-[var(--border)] rounded-full w-7 h-7" />
          ))}
          <span className="flex items-center justify-center w-7 h-7 text-xs font-medium text-white/40">
            +5
          </span>
        </div>
      </div>
    </div>
  )
}
