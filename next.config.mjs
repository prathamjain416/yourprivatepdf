/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable TypeScript strict mode for safer code
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Configure image optimization
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  // Configure headers for optimal caching
  async headers() {
    return [
      {
        source: '/public/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Configure environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'Your Private PDF',
  },

  // Enable React strict mode for development warnings
  reactStrictMode: true,

  // Compress static assets
  compress: true,

  // Configure trailing slashes
  trailingSlash: false,
}

export default nextConfig
