// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
    medusaUrl: process.env.NEXT_PUBLIC_MEDUSA_URL,
    runpodApiKey: process.env.RUNPOD_API_KEY,
  },
  production: {
    apiUrl: 'https://api.malikarbab.de',
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
    medusaUrl: process.env.NEXT_PUBLIC_MEDUSA_URL,
    runpodApiKey: process.env.RUNPOD_API_KEY,
  }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
