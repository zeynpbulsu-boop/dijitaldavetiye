/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted on Coolify via Docker — emit a standalone Node server
  // bundle so we don't ship the entire node_modules tree in the image.
  output: 'standalone',
  // Don't fail the production build on lint issues — keep them as a CI gate
  // instead. Webhooks routes etc. need a tight feedback loop in Coolify.
  eslint: { ignoreDuringBuilds: false },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // FAZ 4 — fal.ai CDN (bespoke Flux Pro 1.1 cover renders)
      { protocol: 'https', hostname: 'v3b.fal.media' },
      { protocol: 'https', hostname: 'v3.fal.media' },
      { protocol: 'https', hostname: 'fal.media' },
    ],
  },
};

export default nextConfig;
