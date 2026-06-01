/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
