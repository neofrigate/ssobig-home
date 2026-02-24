import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "일일남매",
  description:
    "매력쟁이들 사이에서 찐친 만들기! 쏘빅의 일일남매 소셜링 프로그램으로 새로운 인연을 만나보세요.",
  openGraph: {
    title: "일일남매 | 쏘빅 SSOBIG",
    description: "매력쟁이들 사이에서 찐친 만들기! 쏘빅의 일일남매 소셜링.",
    url: "https://www.ssobig.com/offline/11namme",
  },
  alternates: {
    canonical: "https://www.ssobig.com/offline/11namme",
  },
};

export default function NammeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
