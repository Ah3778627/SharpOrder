/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: '/home/abdul-hafiz/Desktop/python/sharporder',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

module.exports = nextConfig;
