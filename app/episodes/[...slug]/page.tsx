import ClientEpisode from './ClientEpisode'

export default async function EpisodeDetail({
  params,
}: {
  params: Promise<{ slug: string | string[] }>
}) {
  const { slug: raw } = await params
  const id = Array.isArray(raw)
    ? raw.map((s) => decodeURIComponent(s)).join('/')
    : decodeURIComponent(raw)
  return <ClientEpisode slug={id} />
}
