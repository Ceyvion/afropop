import ClientFeature from './ClientFeature'

export default async function FeatureDetail({
  params,
}: {
  params: Promise<{ slug: string | string[] }>
}) {
  const { slug: raw } = await params
  const id = Array.isArray(raw)
    ? raw.map((s) => decodeURIComponent(s)).join('/')
    : decodeURIComponent(raw)
  return <ClientFeature slug={id} />
}
