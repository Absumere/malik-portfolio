/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.malikarbab.de'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.malikarbab.de',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
  experimental: {
    instrumentationHook: true,
  },
}

module.exports = nextConfig
