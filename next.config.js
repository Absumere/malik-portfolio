/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.malikarbab.de', 'res.cloudinary.com'],
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
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS errors during build
  },
  experimental: {
    instrumentationHook: true,
  },
}

module.exports = nextConfig
