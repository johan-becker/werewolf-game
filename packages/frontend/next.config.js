/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@werewolf/shared'],
  experimental: {
    esmExternals: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001'
  }
};

module.exports = nextConfig;