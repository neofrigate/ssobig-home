export type ReviewLanguage = "ko" | "en" | "ja";

const REVIEW_LANGUAGE_METADATA: Record<
  ReviewLanguage,
  { title: string; description: string }
> = {
  ko: {
    title: "쏘빅 플레이 후기",
    description: "쏘빅 플레이룸 게임 후기를 남겨주세요.",
  },
  en: {
    title: "SSOBIG Play Review",
    description: "Share your review for a SSOBIG PLAYROOM game.",
  },
  ja: {
    title: "SSOBIG プレイレビュー",
    description: "SSOBIG PLAYROOM のゲームレビューを投稿してください。",
  },
};

export function normalizeReviewLanguage(
  value: string | null | undefined
): ReviewLanguage {
  const normalized = String(value || "").trim().toLowerCase();
  if (["en", "english"].includes(normalized)) return "en";
  if (["ja", "jp", "japanese"].includes(normalized)) return "ja";
  return "ko";
}

export function getReviewLanguageMetadata(language: ReviewLanguage) {
  return REVIEW_LANGUAGE_METADATA[language];
}
