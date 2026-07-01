import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Menolak error TypeScript menggagalkan build (Masih didukung)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
