import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "알파마니또",
  description:
    "쏘빅의 알파마니또 소셜링! 마니또 게임으로 새로운 사람들과 특별한 인연을 만들어보세요.",
  openGraph: {
    title: "알파마니또 | 쏘빅 SSOBIG",
    description: "마니또 게임으로 새로운 사람들과 특별한 인연 만들기.",
    url: "https://www.ssobig.com/offline/manito",
  },
  alternates: {
    canonical: "https://www.ssobig.com/offline/manito",
  },
};

export default function ManitoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
