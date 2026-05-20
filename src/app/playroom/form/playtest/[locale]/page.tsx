import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaytestSignupForm from "./PlaytestSignupFormV2";
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
  const isJapanese = normalizedLocale === "ja";
  const isChinese = normalizedLocale === "zh";
  const title = isKorean
    ? "쏘빅 얼리 액세스 사전 체험 신청"
    : isJapanese
      ? "ssobig 先行体験テスター応募"
      : isChinese
        ? "ssobig 抢先体验测试报名"
        : "ssobig Early Access Playtest";
  const description = isKorean
    ? "쏘빅의 영어권 스토리 추리게임을 정식 출시 전에 먼저 체험하고 의견을 남겨주세요."
    : isJapanese
      ? "ssobigの英語圏向けストーリーミステリーゲームを正式リリース前に体験し、感想をお聞かせください。"
      : isChinese
        ? "欢迎在正式上线前体验ssobig面向英语用户的剧情推理游戏，并向我们分享你的反馈。"
        : "Try ssobig's English-first story mystery games before launch and share your feedback.";
  const canonicalUrl =
    `https://www.ssobig.com/playroom/form/playtest/${normalizedLocale}`;
  const ogImageUrl =
    "https://www.ssobig.com/ssobig_assets/playroom/playtest-preview.png";

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
      locale: isKorean ? "ko_KR" : isJapanese ? "ja_JP" : isChinese ? "zh_CN" : "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "ssobig PLAYROOM 얼리 액세스 사전 체험 신청",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
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
