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

  return {
    title: isKorean ? "쏘빅 플레이테스트 신청" : "SsoBig Playtest Signup",
    description: isKorean
      ? "쏘빅 해외 플레이테스트에 참여하고 영어 버전 콘텐츠를 먼저 경험해보세요."
      : "Join SsoBig's overseas playtest and try story-driven mystery games before launch.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `https://www.ssobig.com/playroom/form/playtest/${normalizedLocale}`,
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
