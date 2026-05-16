import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaytestSignupForm from "./PlaytestSignupForm";
import {
  normalizePlaytestLocale,
  type PlaytestLocale,
} from "../locales";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizePlaytestLocale(locale);

  if (!normalizedLocale) {
    return {};
  }

  const isKorean = normalizedLocale === "ko";
  const title = isKorean
    ? "쏘빅 얼리 액세스 사전 체험 신청"
    : "ssobig Early Access Playtest";
  const description = isKorean
    ? "쏘빅의 영어권 스토리 추리게임을 정식 출시 전에 먼저 체험하고 의견을 남겨주세요."
    : "Try ssobig's English-first story mystery games before launch and share your feedback.";
  const canonicalUrl =
    `https://www.ssobig.com/playroom/form/playtest/${normalizedLocale}`;

  return {
    title: {
      absolute: title,
    },
    description,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: isKorean ? "쏘빅 ssobig" : "ssobig",
      locale: isKorean ? "ko_KR" : "en_US",
      type: "website",
      images: [
        {
          url: "/ssobig_assets/og-image.png",
          width: 1200,
          height: 630,
          alt: isKorean ? "쏘빅 ssobig" : "ssobig",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/ssobig_assets/og-image.png"],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PlaytestFormPage({ params }: PageProps) {
  const { locale } = await params;
  const normalizedLocale = normalizePlaytestLocale(locale);

  if (!normalizedLocale) {
    notFound();
  }

  return <PlaytestSignupForm locale={normalizedLocale as PlaytestLocale} />;
}
