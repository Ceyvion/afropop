import ClientEpisode from './ClientEpisode'

export default async function EpisodeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ClientEpisode slug={decodeURIComponent(slug)} />
}
