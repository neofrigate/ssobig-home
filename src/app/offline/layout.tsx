import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오프라인 소셜링",
  description:
    "쏘빅의 오프라인 소셜링 프로그램. 일일남매, 불면증마피아, 알파마니또 등 술 없이 즐기는 다양한 오프라인 모임을 만나보세요.",
  openGraph: {
    title: "오프라인 소셜링 | 쏘빅 SSOBIG",
    description:
      "일일남매, 불면증마피아, 알파마니또 등 술 없이 즐기는 다양한 오프라인 모임.",
    url: "https://www.ssobig.com/offline",
  },
  alternates: {
    canonical: "https://www.ssobig.com/offline",
  },
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
