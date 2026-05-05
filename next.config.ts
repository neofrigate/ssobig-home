import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
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
      {
        protocol: "https",
        hostname: "tlyioijsopxeegzfjlqe.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/playroom-campaign-assets/**",
      },
    ],
    unoptimized: false,
  },
  productionBrowserSourceMaps: true,
  allowedDevOrigins: [
    "https://undepressive-makenzie-supernaturally.ngrok-free.dev",
    "https://leah-energetistic-exhilaratingly.ngrok-free.dev",
  ],
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "about.ssobig.com" }],
        destination: "https://www.ssobig.com/",
        permanent: true,
      },
      {
        source: "/privacy_policy",
        has: [{ type: "host", value: "about.ssobig.com" }],
        destination: "https://www.ssobig.com/privacy_policy.html",
        permanent: true,
      },
      {
        source: "/privacy_policy.html",
        has: [{ type: "host", value: "about.ssobig.com" }],
        destination: "https://www.ssobig.com/privacy_policy.html",
        permanent: true,
      },
      {
        source: "/terms_of_service",
        has: [{ type: "host", value: "about.ssobig.com" }],
        destination: "https://www.ssobig.com/terms_of_service.html",
        permanent: true,
      },
      {
        source: "/terms_of_service.html",
        has: [{ type: "host", value: "about.ssobig.com" }],
        destination: "https://www.ssobig.com/terms_of_service.html",
        permanent: true,
      },
      {
        source: "/refund_policy",
        has: [{ type: "host", value: "about.ssobig.com" }],
        destination: "https://www.ssobig.com/refund_policy.html",
        permanent: true,
      },
      {
        source: "/refund_policy.html",
        has: [{ type: "host", value: "about.ssobig.com" }],
        destination: "https://www.ssobig.com/refund_policy.html",
        permanent: true,
      },
      {
        source: "/privacy_policy",
        destination: "/privacy_policy.html",
        permanent: true,
      },
      {
        source: "/terms_of_service",
        destination: "/terms_of_service.html",
        permanent: true,
      },
      {
        source: "/refund_policy",
        destination: "/refund_policy.html",
        permanent: true,
      },
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
        source: "/offline/11namme에",
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
      {
        source: "/lovebuddies",
        destination: "https://www.ssobig.com/offline/11namme",
        permanent: true,
      },
      {
        source: "/realgenius",
        destination: "https://www.ssobig.com/offline/mafia",
        permanent: true,
      },
      {
        source: "/manito",
        destination: "https://www.ssobig.com/offline/manito",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "ice-crusher",
  project: "ssobig-home",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  debug: Boolean(process.env.SENTRY_DEBUG),
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: {
    assets: [
      ".next/static/chunks/**/*.js",
      ".next/static/chunks/**/*.js.map",
    ],
    deleteSourcemapsAfterUpload: false,
  },
  release: {
    setCommits: {
      auto: true,
      ignoreEmpty: true,
      ignoreMissing: true,
    },
  },
});
