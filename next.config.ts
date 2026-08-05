import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    qualities: [75, 85, 90, 100],
  },
};

export default nextConfig;
