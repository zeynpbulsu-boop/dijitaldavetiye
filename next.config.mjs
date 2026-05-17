/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted on Coolify via Docker — emit a standalone Node server
  // bundle so we don't ship the entire node_modules tree in the image.
  output: 'standalone',
  // Don't fail the production build on lint issues — keep them as a CI gate
  // instead. Webhooks routes etc. need a tight feedback loop in Coolify.
  eslint: { ignoreDuringBuilds: false },
  images: {
    /* FAZ A.2 — serve AVIF/WebP variants of local PNGs (wax-seal,
       watermark) and remote covers. Next/Image's loader generates
       these at request time and caches via sharp.

       deviceSizes: drives the srcset for the default sizes attribute;
       these match the breakpoints used by the luxe demos (375/414/768
       mobile, 1024+ desktop) plus a 2x retina shoulder.

       imageSizes: small-asset sizes for elements that won't span the
       viewport (wax seals, ornaments). 120/200 cover mobile/footer
       seals; 320/420 cover hero-size seals. */
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [120, 200, 320, 420],
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
