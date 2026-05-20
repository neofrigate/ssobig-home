import type { Metadata } from "next";
import PlayroomPageClient from "./PlayroomPageClient";

const TITLE = "쏘빅 PLAYROOM | 스토리 추리게임 플레이룸";
const DESCRIPTION =
  "밤 아일랜드, 황후마마 살인사건, 기억 속의 너, 도플갱어 등 쏘빅 PLAYROOM의 스토리 추리게임을 확인해보세요.";
const URL = "https://www.ssobig.com/playroom";
const OG_IMAGE = "https://www.ssobig.com/ssobig_assets/playroom/히어로_밤아일랜드_데스크톱.jpg";

export const metadata: Metadata = {
  title: {
    absolute: TITLE,
  },
  description: DESCRIPTION,
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "쏘빅 PLAYROOM",
    locale: "ko_KR",
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
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function PlayroomPage() {
  return <PlayroomPageClient />;
}
