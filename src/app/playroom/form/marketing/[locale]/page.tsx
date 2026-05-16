import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarketingSignupForm from "./MarketingSignupForm";
import {
  normalizePlaytestLocale,
  type PlaytestLocale,
} from "../../playtest/locales";

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

  if (!normalizedLocale) return {};

  const isKorean = normalizedLocale === "ko";
  const title = isKorean
    ? "쏘빅 리뷰어 체험 신청"
    : "ssobig Reviewer Beta Access";
  const description = isKorean
    ? "쏘빅 모바일 머더미스터리 리뷰어 체험권을 신청하고 원하는 시나리오를 선택해주세요."
    : "Apply for ssobig reviewer beta access and choose the scenario you want to try.";
  const canonicalUrl =
    `https://www.ssobig.com/playroom/form/marketing/${normalizedLocale}`;

  return {
    title: { absolute: title },
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

export default async function MarketingFormPage({ params }: PageProps) {
  const { locale } = await params;
  const normalizedLocale = normalizePlaytestLocale(locale);

  if (!normalizedLocale) notFound();

  return <MarketingSignupForm locale={normalizedLocale as PlaytestLocale} />;
}
