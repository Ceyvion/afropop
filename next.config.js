/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'afropop.org' },
      { protocol: 'https', hostname: '*.afropop.org' },
      { protocol: 'https', hostname: 'f.prxu.org' },
      { protocol: 'https', hostname: 'feeds.feedburner.com' },
      { protocol: 'https', hostname: 'feeds.prx.org' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
    ],
  },
}

module.exports = nextConfig
