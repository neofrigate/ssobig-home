/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.facebook.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // ngrok 도메인에서의 개발 접근 허용
  allowedDevOrigins: [
    "https://undepressive-makenzie-supernaturally.ngrok-free.dev",
  ],
  async redirects() {
    return [
      {
        source: "/brand/love_buddies",
        destination: "/socialing/love-buddies",
        permanent: true,
      },
      {
        source: "/brand/love_buddies/detail",
        destination: "/socialing/love-buddies/11namme",
        permanent: true,
      },
      {
        source: "/brand/love_buddies/alpha",
        destination: "/socialing/love-buddies/alpha",
        permanent: true,
      },
      {
        source: "/brand/game_orb",
        destination: "/socialing/game-orb",
        permanent: true,
      },
      {
        source: "/brand/game_orb/real_genius",
        destination: "/socialing/game-orb/social_genius",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
