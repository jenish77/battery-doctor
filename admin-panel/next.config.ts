import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy API requests to avoid CORS issues in development
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
