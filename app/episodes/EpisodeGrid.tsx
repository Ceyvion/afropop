'use client'

import { EpisodeCard } from '@/app/components/Cards'
import { usePlayer } from '@/app/components/PlayerProvider'
import { getStaggeredDelayClass } from '@/app/lib/animation-utils'
import type { NormalizedRSSItem } from '@/app/lib/rss-service'

type EpisodeGridProps = {
  episodes: NormalizedRSSItem[]
}

export default function EpisodeGrid({ episodes }: EpisodeGridProps) {
  const player = usePlayer()

  if (!episodes.length) {
    return (
      <p className="text-center py-16 text-white/60">
        Fresh episodes will land here as soon as the feed updates.
      </p>
    )
  }

  return (
    <>
      <p className="text-white/50 mb-8 text-sm uppercase tracking-[0.35em]">
        Showing {episodes.length} episodes
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode, index) => (
          <div key={episode.id} className={`fade-in ${getStaggeredDelayClass(index, 100, 6)}`}>
            <EpisodeCard
              id={episode.id}
              title={episode.title}
              region={episode.region || 'Africa'}
              genre={episode.genre || 'World Music'}
              duration={episode.duration || '45 min'}
              image={episode.image || undefined}
              categories={episode.categories}
              density="compact"
              onPlay={() => {
                if (episode.audioUrl) {
                  player.play({
                    id: episode.id,
                    title: episode.title,
                    author: episode.author,
                    image: episode.image || undefined,
                    audioUrl: episode.audioUrl,
                    duration: episode.duration,
                  })
                }
              }}
            />
          </div>
        ))}
      </div>
    </>
  )
}
