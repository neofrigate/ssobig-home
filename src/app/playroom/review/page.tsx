import type { Metadata } from "next";
import PlayroomReviewForm from "./PlayroomReviewForm";
import {
  getReviewLanguageMetadata,
  normalizeReviewLanguage,
} from "./reviewLanguage";

type PageProps = {
  searchParams: Promise<{
    gameId?: string;
    playerId?: string;
    env?: string;
    lang?: string;
    language?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const language = normalizeReviewLanguage(params.lang || params.language);
  const copy = getReviewLanguageMetadata(language);
  return {
    title: {
      absolute: copy.title,
    },
    description: copy.description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: "https://www.ssobig.com/playroom/review",
    },
  };
}

export default async function PlayroomReviewPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <PlayroomReviewForm
      gameId={params.gameId || ""}
      playerId={params.playerId || ""}
      env={params.env === "staging" ? "staging" : "production"}
      language={normalizeReviewLanguage(params.lang || params.language)}
    />
  );
}
