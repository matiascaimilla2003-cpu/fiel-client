import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

// next-pwa is configured via the manifest + service worker approach
// withPWA wrapper is incompatible with Next.js 16; SW will be set up manually when needed
export default nextConfig;
