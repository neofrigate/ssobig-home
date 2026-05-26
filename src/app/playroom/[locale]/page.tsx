import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import PlayroomPageClient from "../PlayroomPageClient";
import {
  localeToCanonicalPath,
  localeToOgLocale,
  normalizePlayroomSiteLocale,
  type PlayroomSiteLocale,
} from "../playroomSiteLocale";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const METADATA_COPY: Record<
  PlayroomSiteLocale,
  { title: string; description: string }
> = {
  kr: {
    title: "쏘빅 PLAYROOM | 스토리 추리게임 플레이룸",
    description:
      "밤 아일랜드, 황후마마 살인사건, 기억 속의 너, 도플갱어 등 쏘빅 PLAYROOM의 스토리 추리게임을 확인해보세요.",
  },
  en: {
    title: "SSOBIG PLAYROOM | Story Mystery Games",
    description:
      "Explore public story mystery games on SSOBIG PLAYROOM.",
  },
  ja: {
    title: "SSOBIG PLAYROOM | ストーリー推理ゲーム",
    description:
      "SSOBIG PLAYROOM の公開ストーリー推理ゲームをチェックしてください。",
  },
  zh: {
    title: "SSOBIG PLAYROOM | 剧情推理游戏",
    description: "查看 SSOBIG PLAYROOM 的公开剧情推理作品。",
  },
};

const OG_IMAGE =
  "https://www.ssobig.com/ssobig_assets/playroom/히어로_밤아일랜드_데스크톱.jpg";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizePlayroomSiteLocale(locale);
  if (!normalizedLocale) return {};

  const copy = METADATA_COPY[normalizedLocale];
  const canonicalPath = localeToCanonicalPath(normalizedLocale);
  const canonicalUrl = `https://www.ssobig.com${canonicalPath}`;

  return {
    title: {
      absolute: copy.title,
    },
    description: copy.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: canonicalUrl,
      siteName: "쏘빅 PLAYROOM",
      locale: localeToOgLocale(normalizedLocale),
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "쏘빅 PLAYROOM 스토리 추리게임 미리보기",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [OG_IMAGE],
    },
  };
}

export default async function PlayroomLocalePage({ params }: PageProps) {
  const { locale } = await params;
  const normalizedLocale = normalizePlayroomSiteLocale(locale);
  if (!normalizedLocale) {
    notFound();
  }

  if (locale.toLowerCase() !== normalizedLocale) {
    redirect(localeToCanonicalPath(normalizedLocale));
  }

  return <PlayroomPageClient locale={normalizedLocale} />;
}
