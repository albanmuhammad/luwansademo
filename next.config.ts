import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Menolak error TypeScript menggagalkan build (Masih didukung)
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.jsluwansa.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "www.jsluwansa.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
