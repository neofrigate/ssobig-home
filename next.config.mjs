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
  async redirects() {
    return [
      {
        source: '/brand/love_buddies',
        destination: '/socialing/love-buddies',
        permanent: true,
      },
      {
        source: '/brand/love_buddies/detail',
        destination: '/socialing/love-buddies/11namme',
        permanent: true,
      },
      {
        source: '/brand/love_buddies/alpha',
        destination: '/socialing/love-buddies/alpha',
        permanent: true,
      },
      {
        source: '/brand/game_orb',
        destination: '/socialing/game-orb',
        permanent: true,
      },
      {
        source: '/brand/game_orb/real_genius',
        destination: '/socialing/game-orb/social_genius',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
