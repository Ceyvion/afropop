import EpisodeGrid from '@/app/episodes/EpisodeGrid'
import { getRSSItemsByType } from '@/app/lib/rss-service'

export default async function Episodes() {
  try {
    const episodes = await getRSSItemsByType('Episode')

    return (
      <div className="min-h-screen bg-page text-white">
        <div className="page-shell py-12">
          <div className="mb-12 fade-in space-y-4">
            <p className="page-kicker">Episodes</p>
            <h1 className="page-title text-4xl md:text-5xl leading-tight">Broadcasts from every corner of the diaspora.</h1>
            <p className="text-lg text-white/60 max-w-3xl">
              Explore our collection of episodes covering African music and culture from around the world.
            </p>
          </div>
          <div className="fade-in">
            <EpisodeGrid episodes={episodes} />
          </div>
          <div className="mt-16 text-center fade-in delay-300">
            <button className="btn-outline-ra">Load More Episodes</button>
          </div>
        </div>
      </div>
    )
  } catch (error: any) {
    return (
      <div className="min-h-screen bg-page text-white">
        <div className="page-shell py-12">
          <div className="text-center py-16 space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-accent-v/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-2xl font-display-condensed uppercase tracking-tight">Error Loading Episodes</h3>
            <p className="text-white/60 max-w-md mx-auto">
              {error?.message || 'We could not reach the Afropop feed. Please try again.'}
            </p>
          </div>
        </div>
      </div>
    )
  }
}
