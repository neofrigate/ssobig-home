import Script from "next/script";
import type { Metadata } from "next";
import {
  buildMetaPixelPageViewScript,
  SSOBIG_STORY_PIXEL_ID,
} from "../../utils/metaPixel";

export const metadata: Metadata = {
  title: "플레이룸 | 추리게임 & 머더미스터리",
  description:
    "쏘빅 플레이룸에서 스토리 추리게임, 머더미스터리, 보드게임 등 다양한 콘텐츠를 즐겨보세요.",
  openGraph: {
    title: "플레이룸 | 추리게임 & 머더미스터리 | 쏘빅 SSOBIG",
    description:
      "스토리 추리게임, 머더미스터리, 보드게임 등 다양한 콘텐츠를 즐겨보세요.",
    url: "https://www.ssobig.com/playroom",
  },
  alternates: {
    canonical: "https://www.ssobig.com/playroom",
  },
};

export default function PlayroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="facebook-pixel-ssobig-story-playroom"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: buildMetaPixelPageViewScript(SSOBIG_STORY_PIXEL_ID),
        }}
      />
      {children}
    </>
  );
}
