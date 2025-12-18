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
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: false,
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
        destination: "/offline/11namme",
        permanent: true,
      },
      {
        source: "/brand/love_buddies/alpha",
        destination: "/offline/manito",
        permanent: true,
      },
      {
        source: "/offline/alpha",
        destination: "/offline/manito",
        permanent: true,
      },
      {
        source: "/brand/game_orb",
        destination: "/socialing/game-orb",
        permanent: true,
      },
      {
        source: "/brand/game_orb/real_genius",
        destination: "/offline/mafia",
        permanent: true,
      },
      {
        source: "/offline/social_genius",
        destination: "/offline/mafia",
        permanent: true,
      },
      {
        source: "/socialing/love-buddies/11namme",
        destination: "/offline/11namme",
        permanent: true,
      },
      {
        source: "/socialing/love-buddies/alpha",
        destination: "/offline/manito",
        permanent: true,
      },
      {
        source: "/socialing/game-orb/social_genius",
        destination: "/offline/mafia",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
