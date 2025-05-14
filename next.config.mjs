/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.facebook.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig; 