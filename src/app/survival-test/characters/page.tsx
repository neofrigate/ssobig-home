import type { Metadata } from "next";
import SurvivalCharactersClient from "./SurvivalCharactersClient";

export const metadata: Metadata = {
  title: "프로토타입 모든 캐릭터",
  description:
    "프로토타입 생존 성향 테스트의 모든 생존자 캐릭터를 확인해보세요.",
  alternates: {
    canonical: "https://www.ssobig.com/survival-test/characters",
  },
  openGraph: {
    title: "프로토타입 모든 캐릭터",
    description:
      "프로토타입 생존 성향 테스트의 모든 생존자 캐릭터를 확인해보세요.",
    url: "https://www.ssobig.com/survival-test/characters",
    siteName: "쏘빅 ssobig",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/prototype-share.png",
        width: 1200,
        height: 630,
        alt: "프로토타입 모든 캐릭터",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "프로토타입 모든 캐릭터",
    description:
      "프로토타입 생존 성향 테스트의 모든 생존자 캐릭터를 확인해보세요.",
    images: ["/images/prototype-share.png"],
  },
};

export default function SurvivalCharactersPage() {
  return <SurvivalCharactersClient />;
}
