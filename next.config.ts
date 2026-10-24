import type { NextConfig } from "next";

const SITE_URL = 'https://www.minimuseumproject.org';

const nextConfig: NextConfig = {
  // One address for Google. minimuseumproject.com (with or without www)
  // permanently redirects to the same page on www.minimuseumproject.org, so
  // search engines see one site instead of two identical copies.
  async redirects() {
    return [
      ...['minimuseumproject.com', 'www.minimuseumproject.com'].map((host) => ({
        source: '/:path*',
        has: [{ type: 'host' as const, value: host }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      })),
      // The old all-exhibitions page; both floors now start in the Great Hall.
      { source: '/exhibitions', destination: '/greathall', permanent: true },
    ];
  },

  // Tell search engines the preferred address of every page with a
  // rel="canonical" HTTP header, so the right URL wins even if the page is
  // reached through another hostname or with query strings.
  async headers() {
    return [
      {
        source: '/',
        headers: [{ key: 'Link', value: `<${SITE_URL}/>; rel="canonical"` }],
      },
      {
        source: '/:path+',
        headers: [{ key: 'Link', value: `<${SITE_URL}/:path+>; rel="canonical"` }],
      },
    ];
  },

  // Image optimization configuration
  images: {
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Image sizes for smaller images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Remote image domains (if needed in future)
    remotePatterns: [],
  },
};

export default nextConfig;
