import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  eslint: {
    // 本番ビルド中の ESLint 実行をスキップ
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
