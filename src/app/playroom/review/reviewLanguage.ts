export type ReviewLanguage = "ko" | "en" | "ja" | "zh";

const REVIEW_LANGUAGE_METADATA: Record<
  ReviewLanguage,
  { title: string; description: string }
> = {
  ko: {
    title: "쏘빅 플레이 리뷰",
    description: "쏘빅 플레이룸 게임 리뷰를 남겨주세요.",
  },
  en: {
    title: "SSOBIG Play Review",
    description: "Share your review for a SSOBIG PLAYROOM game.",
  },
  ja: {
    title: "SSOBIG プレイレビュー",
    description: "SSOBIG PLAYROOM のゲームレビューを投稿してください。",
  },
  zh: {
    title: "SSOBIG 游玩评价",
    description: "请留下你对 SSOBIG PLAYROOM 游戏的评价。",
  },
};

export function normalizeReviewLanguage(
  value: string | null | undefined
): ReviewLanguage {
  const normalized = String(value || "").trim().toLowerCase();
  if (["en", "english"].includes(normalized)) return "en";
  if (["ja", "jp", "japanese"].includes(normalized)) return "ja";
  if (["zh", "cn", "zh-cn", "chinese"].includes(normalized)) return "zh";
  return "ko";
}

export function getReviewLanguageMetadata(language: ReviewLanguage) {
  return REVIEW_LANGUAGE_METADATA[language];
}
