import type { Metadata } from "next";
import SurvivalTestClient from "./SurvivalTestClient";

export const metadata: Metadata = {
  title: "프로토타입 생존 성향 테스트",
  description:
    "좀비 아포칼립스 속 당신의 생존 성향과 프로토타입 캐릭터를 확인해보세요.",
  alternates: {
    canonical: "https://www.ssobig.com/survival-test",
  },
  openGraph: {
    title: "프로토타입 생존 성향 테스트",
    description:
      "좀비 아포칼립스 속 당신의 생존 성향과 프로토타입 캐릭터를 확인해보세요.",
    url: "https://www.ssobig.com/survival-test",
    siteName: "쏘빅 ssobig",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/prototype-share.png",
        width: 1200,
        height: 630,
        alt: "프로토타입 생존 성향 테스트",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "프로토타입 생존 성향 테스트",
    description:
      "좀비 아포칼립스 속 당신의 생존 성향과 프로토타입 캐릭터를 확인해보세요.",
    images: ["/images/prototype-share.png"],
  },
};

export default function SurvivalTestPage() {
  return <SurvivalTestClient />;
}
