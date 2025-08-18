import ClientFeature from './ClientFeature'

export default async function FeatureDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ClientFeature slug={decodeURIComponent(slug)} />
}
