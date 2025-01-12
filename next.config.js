/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.malikarbab.de', 'res.cloudinary.com', 's3.eu-central-003.backblazeb2.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.malikarbab.de',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.backblazeb2.com',
        pathname: '/**',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    instrumentationHook: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
