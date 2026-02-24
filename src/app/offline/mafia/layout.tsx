import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "불면증마피아",
  description:
    "대규모 마피아게임 불면증마피아! 쏘빅에서 진행하는 술 없이 즐기는 대규모 마피아 소셜링.",
  openGraph: {
    title: "불면증마피아 | 쏘빅 SSOBIG",
    description: "대규모 마피아게임 불면증마피아! 술 없이 즐기는 마피아 소셜링.",
    url: "https://www.ssobig.com/offline/mafia",
  },
  alternates: {
    canonical: "https://www.ssobig.com/offline/mafia",
  },
};

export default function MafiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
