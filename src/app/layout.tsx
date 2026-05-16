import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import ClientShell from "../components/ClientShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ssobig.com"),
  title: {
    default: "쏘빅 ssobig | 머더미스터리 · 추리게임 · 소셜링 플랫폼",
    template: "%s | 쏘빅 ssobig",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
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
    title: "쏘빅 ssobig | 머더미스터리 · 추리게임 · 소셜링 플랫폼",
    description:
      "술 없이도 즐거운 소셜 플랫폼 쏘빅! 머더미스터리, 추리게임, 보드게임, 소셜링 등 다양한 콘텐츠를 만나보세요.",
    url: "https://www.ssobig.com",
    siteName: "쏘빅 ssobig",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/ssobig_assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "쏘빅 ssobig",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "쏘빅 ssobig | 머더미스터리 · 추리게임 · 소셜링 플랫폼",
    description:
      "술 없이도 즐거운 소셜 플랫폼 쏘빅! 머더미스터리, 추리게임, 보드게임, 소셜링 등 다양한 콘텐츠를 만나보세요.",
    images: ["/ssobig_assets/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      "naver-site-verification": ["c2b418891f7b9669ea94269cbf6002783babe3f9"],
    },
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
      <body
        suppressHydrationWarning
        className="antialiased"
        style={
          {
            "--font-geist-sans":
              '"Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", Arial, sans-serif',
            "--font-geist-mono":
              '"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          } as CSSProperties
        }
      >
        <ClientShell />
        <main>{children}</main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
