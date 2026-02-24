import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "../components/GoogleAnalytics";
import PageViewTracker from "../components/PageViewTracker";
import ChannelTalk from "../components/ChannelTalk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ssobig.com"),
  title: {
    default: "쏘빅 SSOBIG | 머더미스터리 · 추리게임 · 소셜링 플랫폼",
    template: "%s | 쏘빅 SSOBIG",
  },
  description:
    "술 없이도 즐거운 소셜 플랫폼 쏘빅! 머더미스터리, 스토리 추리게임, 보드게임, 일일남매, 불면증마피아, 알파마니또 등 다양한 오프라인 소셜링과 온라인 콘텐츠를 만나보세요.",
  keywords: [
    "쏘빅",
    "ssobig",
    "머더미스터리",
    "추리게임",
    "보드게임",
    "소셜링",
    "일일남매",
    "불면증마피아",
    "알파마니또",
    "플레이룸",
    "오프라인 모임",
    "술 없는 모임",
  ],
  openGraph: {
    title: "쏘빅 SSOBIG | 머더미스터리 · 추리게임 · 소셜링 플랫폼",
    description:
      "술 없이도 즐거운 소셜 플랫폼 쏘빅! 머더미스터리, 추리게임, 보드게임, 소셜링 등 다양한 콘텐츠를 만나보세요.",
    url: "https://www.ssobig.com",
    siteName: "쏘빅 SSOBIG",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/ssobig_assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "쏘빅 SSOBIG",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "쏘빅 SSOBIG | 머더미스터리 · 추리게임 · 소셜링 플랫폼",
    description:
      "술 없이도 즐거운 소셜 플랫폼 쏘빅! 머더미스터리, 추리게임, 보드게임, 소셜링 등 다양한 콘텐츠를 만나보세요.",
    images: ["/ssobig_assets/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.ssobig.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/쏘빅 로고.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "쏘빅 SSOBIG",
              url: "https://www.ssobig.com",
              logo: "https://www.ssobig.com/쏘빅 로고.svg",
              description:
                "술 없이도 즐거운 소셜 플랫폼. 머더미스터리, 추리게임, 보드게임, 소셜링 등 다양한 콘텐츠를 제공합니다.",
              sameAs: [
                "https://www.instagram.com/ssobig_official",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <PageViewTracker />
        <Sidebar />
        <main>{children}</main>
        <ChannelTalk />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
