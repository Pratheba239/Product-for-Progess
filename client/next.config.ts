import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: generates an 'out/' folder that Azure Static Web Apps can serve natively.
  // All pages use 'use client' so there is no SSR needed — fully compatible.
  output: 'export',
  trailingSlash: true,
  images: {
    // Required when using static export — image optimization is not available
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
