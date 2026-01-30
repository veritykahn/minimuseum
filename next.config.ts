import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
