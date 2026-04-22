import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Azure Static Web Apps works best with static optimization or hybrid */
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
