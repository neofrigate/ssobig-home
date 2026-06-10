import type { Metadata } from "next";
import PlayroomReviewForm from "./PlayroomReviewForm";

type PageProps = {
  searchParams: Promise<{
    gameId?: string;
    playerId?: string;
    env?: string;
  }>;
};

export const metadata: Metadata = {
  title: {
    absolute: "쏘빅 플레이 후기",
  },
  description: "쏘빅 플레이룸 게임 후기를 남겨주세요.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.ssobig.com/playroom/review",
  },
};

export default async function PlayroomReviewPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <PlayroomReviewForm
      gameId={params.gameId || ""}
      playerId={params.playerId || ""}
      env={params.env === "staging" ? "staging" : "production"}
    />
  );
}
