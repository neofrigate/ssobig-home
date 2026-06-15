import type { Metadata } from "next";
import PlayroomReviewForm from "../../review/PlayroomReviewForm";
import {
  getReviewLanguageMetadata,
  normalizeReviewLanguage,
} from "../../review/reviewLanguage";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    gameId?: string;
    playerId?: string;
    env?: string;
    lang?: string;
    language?: string;
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const query = await searchParams;
  const language = normalizeReviewLanguage(query.lang || query.language || locale);
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
  };
}

export default async function LocalizedPlayroomReviewPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  return (
    <PlayroomReviewForm
      gameId={query.gameId || ""}
      playerId={query.playerId || ""}
      env={query.env === "staging" ? "staging" : "production"}
      language={normalizeReviewLanguage(query.lang || query.language || locale)}
    />
  );
}
