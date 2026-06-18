import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy all /api/* requests to the backend to avoid CORS issues
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://batterydoctor.elvee.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
