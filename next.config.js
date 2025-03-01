/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disable Next.js image optimization for CDN images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.malikarbab.de',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    B2_APPLICATION_KEY_ID: process.env.B2_APPLICATION_KEY_ID,
    B2_APPLICATION_KEY: process.env.B2_APPLICATION_KEY,
    B2_BUCKET_NAME: process.env.B2_BUCKET_NAME,
    B2_BUCKET_ID: process.env.B2_BUCKET_ID,
    B2_ENDPOINT: process.env.B2_ENDPOINT,
    B2_CLOUDFLARE_URL: process.env.B2_CLOUDFLARE_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'malik-portfolio.vercel.app', 'malikarbab.de']
    }
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
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;
