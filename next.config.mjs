/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;