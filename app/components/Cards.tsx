// Card components with refined design
import React from 'react'

// Episode Card
import EngagementBar from './EngagementBar'

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
  // Extract additional tags from categories
  const additionalTags = categories
    ?.filter(cat => 
      cat.toLowerCase() !== region?.toLowerCase() && 
      cat.toLowerCase() !== genre?.toLowerCase() &&
      !['episode', 'podcast', 'audio'].includes(cat.toLowerCase())
    )
    .slice(0, 2) || []

  const compact = density === 'compact'
  const padClass = compact ? 'p-3' : 'p-5'
  const titleClass = compact
    ? 'font-bold text-ink dark:text-gray-100 line-clamp-2 mb-2 text-[15px]'
    : 'font-bold text-ink dark:text-gray-100 line-clamp-2 mb-3'
  const chipsWrapClass = compact ? 'flex flex-wrap gap-1.5 mb-3' : 'flex flex-wrap gap-2 mb-4'
  const chipClass = 'inline-flex items-center rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200 '
    + (compact ? 'px-2 py-0.5' : 'px-2.5 py-0.5')
  const playIconClass = compact ? 'h-4 w-4' : 'h-5 w-5'
  const durationClass = 'text-xs ' + (compact ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400')
  const imageAspect = compact ? 'aspect-[4/3]' : 'aspect-square'
  const showEngage = showEngagement && !compact && id != null

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out card-hover">
      {/* Episode image or placeholder */}
      {image ? (
        <div className={`${imageAspect} w-full overflow-hidden`}>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.parentElement!.innerHTML = `<div class=\"bg-gray-200 border-2 border-dashed ${imageAspect} w-full\"></div>`;
            }}
          />
        </div>
      ) : (
        <div className={`bg-gray-200 border-2 border-dashed ${imageAspect} w-full`} />
      )}
      
      <div className={padClass}>
        <h3 className={titleClass}>{title}</h3>
        
        <div className={chipsWrapClass}>
          {region && (
            <span className={chipClass}>
              {region}
            </span>
          )}
          {genre && (
            <span className={chipClass}>
              {genre}
            </span>
          )}
          {!compact && additionalTags.map((tag, index) => (
            <span key={index} className={chipClass}>{tag}</span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className={durationClass}>{duration}</span>
          <button 
            className="text-accent-v hover:opacity-90 transition-colors duration-200"
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
        </div>
        {showEngage && (
          <div className="mt-4">
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
  const padClass = compact ? 'p-3' : 'p-5'
  const titleClass = compact ? 'font-bold text-ink dark:text-gray-100 line-clamp-2 mb-2 text-[15px]' : 'font-bold text-ink dark:text-gray-100 line-clamp-2 mb-3'
  const dekClass = compact ? 'text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3' : 'text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4'
  const metaClass = 'text-xs text-gray-500 dark:text-gray-400'
  const imageAspect = compact ? 'aspect-[16/9]' : 'aspect-[3/2]'
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out card-hover">
      {/* 3:2 image or placeholder */}
      {image ? (
        <div className={`${imageAspect} w-full overflow-hidden`}>
          <img 
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.parentElement!.innerHTML = `<div class=\"bg-gray-200 border-2 border-dashed ${imageAspect} w-full\"></div>`
            }}
          />
        </div>
      ) : (
        <div className={`bg-gray-200 border-2 border-dashed ${imageAspect} w-full`} />
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
export const EventCard = ({ title, date, city, venue, image, ctaHref, density = 'comfortable' }: { 
  title: string; 
  date: string; 
  city: string; 
  venue: string;
  image?: string;
  ctaHref?: string;
  density?: 'comfortable' | 'compact';
}) => {
  const compact = density === 'compact'
  const padClass = compact ? 'p-3' : 'p-5'
  const titleClass = compact ? 'font-bold text-ink dark:text-gray-100 mb-2 text-[15px]' : 'font-bold text-ink dark:text-gray-100 mb-3'
  const metaRowClass = compact ? 'flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3' : 'flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4'
  const pinIconClass = compact ? 'h-3.5 w-3.5 mr-1' : 'h-4 w-4 mr-1.5'
  const ctaClass = compact
    ? 'w-full btn-accent text-sm'
    : 'w-full btn-accent text-sm'
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out card-hover">
      <div className="relative">
        {/* 3:4 poster or placeholder */}
        {image ? (
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img 
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.parentElement!.innerHTML = '<div class="bg-gray-200 border-2 border-dashed aspect-[3/4] w-full"></div>'
              }}
            />
          </div>
        ) : (
          <div className="bg-gray-200 border-2 border-dashed aspect-[3/4] w-full" />
        )}
        
        {/* Date badge */}
        <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
          {date}
        </div>
      </div>
      
      <div className={padClass}>
        <h3 className={titleClass}>{title}</h3>
        
        <div className={metaRowClass}>
          <svg xmlns="http://www.w3.org/2000/svg" className={pinIconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{city}, {venue}</span>
        </div>
        
        {ctaHref ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={ctaClass}
          >
            Get Tickets
          </a>
        ) : (
          <button className={ctaClass + ' disabled:bg-gray-400 cursor-not-allowed'} disabled>
            Get Tickets
          </button>
        )}
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
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out card-hover">
      {/* 16:9 image placeholder */}
      <div className="bg-gray-200 border-2 border-dashed aspect-video w-full" />
      
      <div className="p-5">
        <h3 className="font-bold text-ink mb-3">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{purpose}</p>
        
        {/* Participating artists - placeholder */}
        <div className="flex -space-x-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8" />
          ))}
          <span className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-500">
            +5
          </span>
        </div>
      </div>
    </div>
  )
}
