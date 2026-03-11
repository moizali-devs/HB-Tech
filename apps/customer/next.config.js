/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 30 days — product images never change
    minimumCacheTTL: 2592000,
    // Limit device sizes to fewer breakpoints — fewer variants = faster cache warm-up
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  transpilePackages: ['@hb-tech/shared'],
}

module.exports = nextConfig
