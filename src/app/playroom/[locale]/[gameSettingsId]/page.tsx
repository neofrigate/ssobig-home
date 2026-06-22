import Image from "next/image";
import { notFound } from "next/navigation";

import PlayroomHeroActions from "@/app/playroom/PlayroomHeroActions";
import PlayroomHtmlFrame from "@/app/playroom/PlayroomHtmlFrame";
import PlayroomReviewList, {
  type PlayroomReviewListItem,
} from "@/app/playroom/PlayroomReviewList";
import {
  buildPlayroomTemplatesApiUrl,
  buildPlayroomTemplateDetailApiUrl,
  type PlayroomTemplateApiItem,
} from "@/app/playroom/playroomApi";
import { getPlayroomTemplateAssetOverride } from "@/app/playroom/playroomTemplateAssets";
import {
  localeToCanonicalPath,
  normalizePlayroomSiteLocale,
  type PlayroomSiteLocale,
} from "@/app/playroom/playroomSiteLocale";

const QUALITY_SUPABASE_URL = "https://tlyioijsopxeegzfjlqe.supabase.co";
const QUALITY_SUPABASE_KEY = "sb_publishable_AdEHgXPGJ2gKGVAjb7RYSg_YzUuT6jB";

const QUALITY_SB_HEADERS = {
  apikey: QUALITY_SUPABASE_KEY,
  Authorization: `Bearer ${QUALITY_SUPABASE_KEY}`,
};

const DETAIL_UI_COPY: Record<
  PlayroomSiteLocale,
  {
    backToList: string;
    playNow: string;
    detailSuffix: string;
    satisfactionTitle: string;
    reviewTitle: string;
    localeLabel: string;
    excellent: string;
    okay: string;
    notForMe: string;
    noReviews: string;
    loadingMoreReviews: string;
    share: string;
  }
> = {
  kr: {
    backToList: "목록으로 돌아가기",
    playNow: "플레이하러 가기",
    detailSuffix: "상세 설명",
    satisfactionTitle: "만족도",
    reviewTitle: "후기",
    localeLabel: "한국어",
    excellent: "최고예요",
    okay: "괜찮아요",
    notForMe: "아쉬워요",
    noReviews: "아직 등록된 후기가 없어요.",
    loadingMoreReviews: "후기를 더 불러오는 중입니다.",
    share: "공유하기",
  },
  en: {
    backToList: "Back to List",
    playNow: "Play Now",
    detailSuffix: "Details",
    satisfactionTitle: "Satisfaction",
    reviewTitle: "Reviews",
    localeLabel: "English",
    excellent: "Loved it",
    okay: "Okay",
    notForMe: "Mixed",
    noReviews: "No reviews yet.",
    loadingMoreReviews: "Loading more reviews.",
    share: "Share",
  },
  ja: {
    backToList: "一覧に戻る",
    playNow: "プレイする",
    detailSuffix: "詳細説明",
    satisfactionTitle: "満足度",
    reviewTitle: "レビュー",
    localeLabel: "日本語",
    excellent: "とても良い",
    okay: "普通",
    notForMe: "惜しい",
    noReviews: "まだレビューがありません。",
    loadingMoreReviews: "レビューをさらに読み込んでいます。",
    share: "共有",
  },
  zh: {
    backToList: "返回列表",
    playNow: "开始游戏",
    detailSuffix: "详细说明",
    satisfactionTitle: "满意度",
    reviewTitle: "评价",
    localeLabel: "中文",
    excellent: "很喜欢",
    okay: "还不错",
    notForMe: "一般",
    noReviews: "还没有评价。",
    loadingMoreReviews: "正在加载更多评价。",
    share: "分享",
  },
};

type PageProps = {
  params: Promise<{
    locale: string;
    gameSettingsId: string;
  }>;
};

type ReviewRecord = {
  id?: number | string | null;
  satisfaction?: string | null;
  sent_time?: string | null;
  nickname?: string | null;
  additional_comment?: string | null;
  recommendation_target?: string | null;
  charm_point?: string | null;
  moderation_status?: string | null;
};

type PlayroomReviewItem = {
  id: string;
  nickname: string;
  comment: string;
  satisfactionLabel: "excellent" | "okay" | "notForMe" | null;
  sentTime: string;
  moderationStatus: TemplateReviewModerationStatus;
};

type TemplateReviewModerationStatus =
  | "visible"
  | "spoiler_hidden"
  | "preview_hidden"
  | "archived_abuse_spam";

type PlayroomReviewSummary = {
  rating: number | null;
  responseCount: number;
  excellentCount: number;
  okayCount: number;
  notForMeCount: number;
  reviews: PlayroomReviewItem[];
  quadrant: {
    x: number | null;
    y: number | null;
    hasX: boolean;
    hasY: boolean;
    recommendationTop: string | null;
    charmTop: string | null;
  };
};

type RecommendationQuadrantKey =
  | "beginner-immersion"
  | "beginner-deduction"
  | "experienced-immersion"
  | "experienced-deduction";

type PlayroomTemplateAssets = {
  posterImageUrl: string;
  backgroundImageUrl: string;
  logoImageUrl: string;
  themeColor: string | number | null;
};

async function fetchPlayroomTemplateDetail(
  locale: PlayroomSiteLocale,
  gameSettingsId: string,
) {
  const response = await fetch(
    buildPlayroomTemplateDetailApiUrl(locale, gameSettingsId).toString(),
    {
      next: { revalidate: 30 },
    },
  );

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Playroom detail API failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    item?: PlayroomTemplateApiItem | null;
  };
  return data.item || null;
}

async function fetchPlayroomTemplateSummary(
  locale: PlayroomSiteLocale,
  gameSettingsId: string,
  templateId: string,
) {
  const response = await fetch(buildPlayroomTemplatesApiUrl(locale).toString(), {
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    items?: PlayroomTemplateApiItem[];
  };

  const items = Array.isArray(data.items) ? data.items : [];

  return (
    items.find((candidate) => candidate.game_settings_id === gameSettingsId) ||
    items.find(
      (candidate) => candidate.ssobig_tool_template_id === templateId,
    ) ||
    null
  );
}

function buildSupabaseUrl(path: string) {
  return new URL(path, QUALITY_SUPABASE_URL).toString();
}

function resolvePlayroomAssetUrl(value?: string | null) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (url.startsWith("/")) return url;
  if (url.startsWith("ssobig_assets/")) return `/${url}`;
  return url;
}

function getTemplateGame(item?: PlayroomTemplateApiItem | null) {
  return item?.game && typeof item.game === "object" ? item.game : {};
}

function getToolTemplateAssets(
  summary: PlayroomTemplateApiItem | null = null,
  item: PlayroomTemplateApiItem | null = null,
): PlayroomTemplateAssets {
  const game = getTemplateGame(item);
  const summaryGame = getTemplateGame(summary);
  const override = getPlayroomTemplateAssetOverride(item?.title, summary?.title);

  return {
    posterImageUrl: pickTemplateString(
      game.imageUrl,
      item?.imageUrl,
      summaryGame.imageUrl,
      summary?.imageUrl,
      item?.card_image_url,
      summary?.card_image_url,
      override?.posterImageUrl,
    ),
    backgroundImageUrl: pickTemplateString(
      game.backgroundImageUrl,
      item?.backgroundImageUrl,
      summaryGame.backgroundImageUrl,
      summary?.backgroundImageUrl,
      override?.backgroundImageUrl,
    ),
    logoImageUrl: pickTemplateString(
      game.logoImageUrl,
      item?.logoImageUrl,
      summaryGame.logoImageUrl,
      summary?.logoImageUrl,
      override?.logoImageUrl,
    ),
    themeColor:
      game.themeColor ??
      item?.themeColor ??
      summaryGame.themeColor ??
      summary?.themeColor ??
      override?.themeColor ??
      null,
  };
}

function toolTemplateIsDarkMode(
  summary: PlayroomTemplateApiItem | null = null,
  item: PlayroomTemplateApiItem | null = null,
) {
  const game = getTemplateGame(item);
  const summaryGame = getTemplateGame(summary);
  const override = getPlayroomTemplateAssetOverride(item?.title, summary?.title);

  return (
    item?.isDarkMode === true ||
    game.isDarkMode === true ||
    summary?.isDarkMode === true ||
    summaryGame.isDarkMode === true ||
    override?.isDarkMode === true
  );
}

function pickTemplateString(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const text = String(value || "").trim();
    if (text) return text;
  }
  return "";
}

function pickTemplateNumber(
  ...values: Array<string | number | null | undefined>
) {
  for (const value of values) {
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) return num;
  }
  return 0;
}

function normalizeThemeColorRaw(value: string | number | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value) >>> 0;
  }

  const text = String(value ?? "").trim();
  if (!text) return null;

  if (/^0x[0-9a-fA-F]{6,8}$/.test(text)) {
    const normalized = text.slice(2);
    const hex = normalized.length === 6 ? `ff${normalized}` : normalized;
    return Number.parseInt(hex, 16) >>> 0;
  }

  if (/^#?[0-9a-fA-F]{6,8}$/.test(text)) {
    const normalized = text.startsWith("#") ? text.slice(1) : text;
    const hex = normalized.length === 6 ? `ff${normalized}` : normalized;
    return Number.parseInt(hex, 16) >>> 0;
  }

  if (/^\d+$/.test(text)) {
    return Number.parseInt(text, 10) >>> 0;
  }

  return null;
}

function describeThemeColor(value: string | number | null | undefined) {
  const raw = normalizeThemeColorRaw(value);
  if (raw == null) {
    return {
      hex: "",
      alpha: null,
    };
  }

  const a = (raw >>> 24) & 255;
  const r = (raw >>> 16) & 255;
  const g = (raw >>> 8) & 255;
  const b = raw & 255;

  return {
    hex: `#${[r, g, b]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()}`,
    alpha: +(a / 255).toFixed(3),
  };
}

function extractPlayerCountFromLabel(label: string | null | undefined) {
  const text = String(label || "").trim();
  if (!text) return "";

  const rangeMatch = text.match(/(\d+)\s*[~\-]\s*(\d+)\s*인/);
  if (rangeMatch) {
    return `${rangeMatch[1]}~${rangeMatch[2]}인`;
  }

  const singleMatch = text.match(/(\d+)\s*인/);
  if (singleMatch) {
    return `${singleMatch[1]}인`;
  }

  return "";
}

function extractMinutesFromLabel(label: string | null | undefined) {
  const text = String(label || "").trim();
  if (!text) return "";

  const rangeMatch = text.match(/(\d+)\s*[~\-]\s*(\d+)\s*분/);
  if (rangeMatch) {
    return `${rangeMatch[2]}분`;
  }

  const singleMatch = text.match(/(\d+)\s*분/);
  if (singleMatch) {
    return `${singleMatch[1]}분`;
  }

  return "";
}

function formatPlayroomPlayerRange(
  detailItem: PlayroomTemplateApiItem,
  summaryItem: PlayroomTemplateApiItem | null,
) {
  const minPlayerCount = pickTemplateNumber(
    detailItem.minPlayerCount,
    summaryItem?.minPlayerCount,
    detailItem.minPlayers,
    summaryItem?.minPlayers,
  );
  const maxPlayerCount = pickTemplateNumber(
    detailItem.maxPlayerCount,
    summaryItem?.maxPlayerCount,
    detailItem.maxPlayers,
    summaryItem?.maxPlayers,
  );

  if (minPlayerCount && maxPlayerCount) {
    return minPlayerCount === maxPlayerCount
      ? `${minPlayerCount}인`
      : `${minPlayerCount}~${maxPlayerCount}인`;
  }

  const playerCount = minPlayerCount || maxPlayerCount;
  if (playerCount) {
    return `${playerCount}인`;
  }

  return (
    extractPlayerCountFromLabel(detailItem.players_label) ||
    extractPlayerCountFromLabel(summaryItem?.players_label) ||
    ""
  );
}

function formatPlayroomTime(detailItem: PlayroomTemplateApiItem, summaryItem: PlayroomTemplateApiItem | null) {
  const minTimeMinutes = pickTemplateNumber(
    detailItem.minTimeMinutes,
    summaryItem?.minTimeMinutes,
  );
  const maxTimeMinutes = pickTemplateNumber(
    detailItem.maxTimeMinutes,
    summaryItem?.maxTimeMinutes,
  );
  const minutes = maxTimeMinutes || minTimeMinutes;
  if (minutes) {
    return `${minutes}분`;
  }

  return (
    extractMinutesFromLabel(detailItem.players_label) ||
    extractMinutesFromLabel(summaryItem?.players_label) ||
    ""
  );
}

function simplifySatisfaction(value?: string | null) {
  const text = String(value || "").trim();
  if (!text) return null;
  if (text.includes("😍") || text.includes("🥰") || text.includes("🤩") || text.includes("최고")) {
    return "excellent" as const;
  }
  if (text.includes("🥲") || text.includes("😢") || text.includes("아쉬")) {
    return "notForMe" as const;
  }
  if (text.includes("🙂") || text.includes("😊") || text.includes("괜찮")) {
    return "okay" as const;
  }
  return null;
}

function scoreSatisfaction(value?: string | null) {
  const simplified = simplifySatisfaction(value);
  if (simplified === "excellent") return 5;
  if (simplified === "okay") return 3;
  if (simplified === "notForMe") return 1;
  return 0;
}

function normalizeComment(value?: string | null) {
  const trimmed = String(value || "").trim();
  if (!trimmed || trimmed === ".") return "";
  return trimmed;
}

function normalizeReviewDistributionValue(
  value: string | null | undefined,
  kind: "recommendation" | "charm",
) {
  const text = String(value || "").trim();
  if (!text) return "";

  if (kind === "recommendation") {
    if (text.includes("입문")) return "입문자";
    if (text.includes("경험")) return "경험자";
    if (text.includes("고인물")) return "고인물";
    return "";
  }

  if (text.includes("몰입") || text.includes("연기") || text.includes("대화")) {
    return "몰입";
  }
  if (text.includes("추리") || text.includes("단서") || text.includes("범인")) {
    return "추리";
  }
  return "";
}

function buildReviewCountMap(
  rows: ReviewRecord[],
  key: "recommendation_target" | "charm_point",
  kind: "recommendation" | "charm",
) {
  const raw: Record<string, number> = {};
  for (const row of rows) {
    const normalized = normalizeReviewDistributionValue(row[key], kind);
    if (!normalized) continue;
    raw[normalized] = (raw[normalized] || 0) + 1;
  }
  return raw;
}

function getTopCountLabel(raw: Record<string, number>) {
  const entries = Object.entries(raw).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries[0][0] : null;
}

function normalizeTemplateReviewModerationStatus(
  value: unknown,
): TemplateReviewModerationStatus {
  const status = String(value || "visible").trim();
  if (
    status === "visible" ||
    status === "spoiler_hidden" ||
    status === "preview_hidden" ||
    status === "archived_abuse_spam"
  ) {
    return status;
  }
  return "visible";
}

function isTemplateReviewPreviewHidden(review: Pick<ReviewRecord, "moderation_status">) {
  const status = normalizeTemplateReviewModerationStatus(
    review?.moderation_status,
  );
  return status === "preview_hidden" || status === "archived_abuse_spam";
}

function isTemplateReviewSpoilerHidden(
  review: Pick<PlayroomReviewItem, "moderationStatus">,
) {
  return review.moderationStatus === "spoiler_hidden";
}

async function fetchPlayroomReviewSummary(
  templateId: string,
): Promise<PlayroomReviewSummary> {
  if (!templateId) {
    return {
      rating: null,
      responseCount: 0,
      excellentCount: 0,
      okayCount: 0,
      notForMeCount: 0,
      reviews: [],
      quadrant: {
        x: null,
        y: null,
        hasX: false,
        hasY: false,
        recommendationTop: null,
        charmTop: null,
      },
    };
  }

  const response = await fetch(
    buildSupabaseUrl(
      `/rest/v1/reviews?template_id=eq.${encodeURIComponent(templateId)}&select=id,satisfaction,sent_time,nickname,additional_comment,recommendation_target,charm_point,moderation_status&order=sent_time.desc`
    ),
    {
      headers: QUALITY_SB_HEADERS,
      next: { revalidate: 30 },
    },
  );

  if (!response.ok) {
    return {
      rating: null,
      responseCount: 0,
      excellentCount: 0,
      okayCount: 0,
      notForMeCount: 0,
      reviews: [],
      quadrant: {
        x: null,
        y: null,
        hasX: false,
        hasY: false,
        recommendationTop: null,
        charmTop: null,
      },
    };
  }

  const records = (await response.json()) as ReviewRecord[];
  const validScores = records
    .map((record) => scoreSatisfaction(record.satisfaction))
    .filter((score) => score > 0);

  const excellentCount = records.filter(
    (record) => simplifySatisfaction(record.satisfaction) === "excellent",
  ).length;
  const okayCount = records.filter(
    (record) => simplifySatisfaction(record.satisfaction) === "okay",
  ).length;
  const notForMeCount = records.filter(
    (record) => simplifySatisfaction(record.satisfaction) === "notForMe",
  ).length;

  const reviews = records
    .filter((record) => !isTemplateReviewPreviewHidden(record))
    .map((record) => ({
      id: String(record.id || `${record.nickname || "익명"}:${record.sent_time || ""}`),
      nickname: String(record.nickname || "익명").trim() || "익명",
      comment: normalizeComment(record.additional_comment),
      satisfactionLabel: simplifySatisfaction(record.satisfaction),
      sentTime: String(record.sent_time || "").trim(),
      moderationStatus: normalizeTemplateReviewModerationStatus(
        record.moderation_status,
      ),
    }))
    .filter((record) => record.comment);

  const recommendationRaw = buildReviewCountMap(
    records,
    "recommendation_target",
    "recommendation",
  );
  const charmRaw = buildReviewCountMap(records, "charm_point", "charm");
  const beginnerCount = recommendationRaw["입문자"] || 0;
  const experiencedCount = recommendationRaw["경험자"] || 0;
  const veteranCount = recommendationRaw["고인물"] || 0;
  const recommendationTotal = beginnerCount + experiencedCount + veteranCount;
  const recommendationScore = recommendationTotal
    ? (beginnerCount * 0 + experiencedCount * 3 + veteranCount * 5) /
      recommendationTotal
    : null;
  const immersiveCount = charmRaw["몰입"] || 0;
  const mysteryCount = charmRaw["추리"] || 0;
  const charmTotal = immersiveCount + mysteryCount;
  const charmRatio = charmTotal ? immersiveCount / charmTotal : null;

  const rating = validScores.length
    ? Number(
        (
          validScores.reduce<number>((sum, score) => sum + score, 0) /
          validScores.length
        ).toFixed(1),
      )
    : null;

  return {
    rating,
    responseCount: records.length,
    excellentCount,
    okayCount,
    notForMeCount,
    reviews,
    quadrant: {
      x:
        recommendationScore == null
          ? null
          : Number((recommendationScore / 5).toFixed(3)),
      y: charmRatio == null ? null : Number(charmRatio.toFixed(3)),
      hasX: recommendationScore != null,
      hasY: charmRatio != null,
      recommendationTop: getTopCountLabel(recommendationRaw),
      charmTop: getTopCountLabel(charmRaw),
    },
  };
}

function renderTextDescription(text: string) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 text-[17px] leading-8 text-slate-700 md:text-[18px]">
      {blocks.map((block, index) => (
        <p key={index} className="whitespace-pre-wrap">
          {block}
        </p>
      ))}
    </div>
  );
}

function buildPercent(count: number, total: number) {
  if (count <= 0 || total <= 0) return 0;
  return Math.round((count / total) * 100);
}

function previewLocaleGroup(locale: string) {
  const text = String(locale || "").trim();
  if (text === "ja_JP" || /^ja(?:[_-]|$)/i.test(text)) return "ja";
  if (text === "en_US" || /^en(?:[_-]|$)/i.test(text)) return "en";
  if (text === "zh_CN" || /^zh(?:[_-]|$)/i.test(text)) return "zh";
  return "ko";
}

function getRecommendationCopy(locale: string) {
  const group = previewLocaleGroup(locale);
  const axis = {
    ko: { experienced: "경험자", beginner: "입문자", immersion: "몰입", deduction: "추리" },
    ja: { experienced: "経験者", beginner: "初心者", immersion: "没入", deduction: "推理" },
    en: { experienced: "Experienced", beginner: "Beginner", immersion: "Immersion", deduction: "Deduction" },
    zh: { experienced: "熟练者", beginner: "新手", immersion: "沉浸", deduction: "推理" },
  };
  const response = {
    ko: (count: number) => `${count}명이 응답했어요!`,
    ja: (count: number) => `${count}人が回答しました！`,
    en: (count: number) => `${count} players responded!`,
    zh: (count: number) => `已有${count}人参与回答！`,
  };
  const narratives: Record<string, Record<RecommendationQuadrantKey, { headline: string; lines: string[] }>> = {
    ko: {
      "beginner-immersion": {
        headline: "순수 몰입러에게 추천한대요!",
        lines: ["입문하기 좋은 작품이에요!", "서사에 몰입하기 좋은 작품이에요!"],
      },
      "beginner-deduction": {
        headline: "추리 입문자에게 추천한대요!",
        lines: ["입문하기 좋은 작품이에요!", "단서로 추리하는 재미가 있는 작품이에요!"],
      },
      "experienced-immersion": {
        headline: "몰입 마니아에게 추천한대요!",
        lines: ["경험자가 플레이하기 좋은 작품이에요!", "서사에 몰입하기 좋은 작품이에요!"],
      },
      "experienced-deduction": {
        headline: "추리 경험자에게 추천한대요!",
        lines: ["경험자가 플레이하기 좋은 작품이에요!", "치밀한 추리가 필요한 작품이에요!"],
      },
    },
    ja: {
      "beginner-immersion": {
        headline: "没入好きの初心者に\nおすすめです！",
        lines: ["初めてでも遊びやすい\n作品です！", "物語への没入感を\n楽しみやすい作品です！"],
      },
      "beginner-deduction": {
        headline: "推理好きの初心者に\nおすすめです！",
        lines: ["初めてでも遊びやすい\n作品です！", "手がかりをたどる推理の\n面白さがある作品です！"],
      },
      "experienced-immersion": {
        headline: "没入好きの経験者に\nおすすめです！",
        lines: ["経験者が遊びやすい\n作品です！", "物語への没入感を\n楽しみやすい作品です！"],
      },
      "experienced-deduction": {
        headline: "推理好きの経験者に\nおすすめです！",
        lines: ["経験者が遊びやすい\n作品です！", "緻密な推理を\n楽しめる作品です！"],
      },
    },
    en: {
      "beginner-immersion": {
        headline: "Recommended for beginner immersion fans!",
        lines: ["A great pick for first-time players!", "A great pick if you love immersive storytelling!"],
      },
      "beginner-deduction": {
        headline: "Recommended for beginner sleuths!",
        lines: ["A great pick for first-time players!", "A great pick if you enjoy clue-based deduction!"],
      },
      "experienced-immersion": {
        headline: "Recommended for immersion enthusiasts!",
        lines: ["A strong fit for experienced players!", "A great pick if you love immersive storytelling!"],
      },
      "experienced-deduction": {
        headline: "Recommended for experienced detectives!",
        lines: ["A strong fit for experienced players!", "A great pick if you enjoy intricate deduction!"],
      },
    },
    zh: {
      "beginner-immersion": {
        headline: "推荐给沉浸向新手！",
        lines: ["对新手也很友好！", "很适合享受剧情沉浸感的作品！"],
      },
      "beginner-deduction": {
        headline: "推荐给推理向新手！",
        lines: ["对新手也很友好！", "很适合享受线索推理乐趣的作品！"],
      },
      "experienced-immersion": {
        headline: "推荐给沉浸向老手！",
        lines: ["很适合有经验的玩家！", "很适合享受剧情沉浸感的作品！"],
      },
      "experienced-deduction": {
        headline: "推荐给推理向老手！",
        lines: ["很适合有经验的玩家！", "很适合体验缜密推理乐趣的作品！"],
      },
    },
  };

  return {
    axis: axis[group] || axis.ko,
    response: response[group] || response.ko,
    narratives: narratives[group] || narratives.ko,
  };
}

function hexToRgbaString(hex: string, alpha = 1) {
  const text = String(hex || "").trim();
  const normalized = text.startsWith("#") ? text.slice(1) : text;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return `rgba(0, 151, 136, ${alpha})`;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getContrastingTextColor(hex: string) {
  const text = String(hex || "").trim();
  const normalized = text.startsWith("#") ? text.slice(1) : text;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return "#FFFFFF";
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "#111111" : "#FFFFFF";
}

function formatReviewDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function inferAxisFromLabel(label: string | null | undefined, axis: "x" | "y") {
  if (!label) return null;
  if (axis === "x") {
    if (label === "입문자") return 0.25;
    if (label === "경험자" || label === "고인물") return 0.75;
    return null;
  }
  if (label === "몰입") return 0.75;
  if (label === "추리") return 0.25;
  return null;
}

function resolveQuadrantPoint(quadrant: PlayroomReviewSummary["quadrant"]) {
  const rawX =
    quadrant.hasX && quadrant.x != null
      ? Number(quadrant.x)
      : inferAxisFromLabel(quadrant.recommendationTop, "x");
  const rawY =
    quadrant.hasY && quadrant.y != null
      ? Number(quadrant.y)
      : inferAxisFromLabel(quadrant.charmTop, "y");

  if (rawX == null || rawY == null) {
    return null;
  }

  return {
    x: Math.max(0, Math.min(1, rawX || 0)),
    y: Math.max(0, Math.min(1, rawY || 0)),
  };
}

function buildQuadrantNarrative(
  quadrant: PlayroomReviewSummary["quadrant"],
  locale: string,
) {
  const copy = getRecommendationCopy(locale);
  const point = resolveQuadrantPoint(quadrant);

  if (!point) {
    return copy.narratives["beginner-deduction"];
  }

  const isExperienced = point.x >= 0.5;
  const isImmersion = point.y >= 0.5;

  if (!isExperienced && isImmersion) {
    return copy.narratives["beginner-immersion"];
  }
  if (!isExperienced && !isImmersion) {
    return copy.narratives["beginner-deduction"];
  }
  if (isExperienced && isImmersion) {
    return copy.narratives["experienced-immersion"];
  }
  return copy.narratives["experienced-deduction"];
}

function getSatisfactionMeta(
  label: PlayroomReviewItem["satisfactionLabel"],
  dt: (typeof DETAIL_UI_COPY)[PlayroomSiteLocale],
) {
  if (label === "excellent") return { emoji: "😍", text: dt.excellent };
  if (label === "notForMe") return { emoji: "🥲", text: dt.notForMe };
  return { emoji: "🙂", text: dt.okay };
}

function RecommendationQuadrantChart({
  accentColor,
  quadrant,
  locale,
}: {
  accentColor: string;
  quadrant: PlayroomReviewSummary["quadrant"];
  locale: string;
}) {
  const axis = getRecommendationCopy(locale).axis;
  const point = resolveQuadrantPoint(quadrant);
  if (!point) {
    return (
      <div className="flex h-[130px] w-[142px] items-center justify-center text-center text-[12px] leading-[18px] text-[#94a3b8]">
        추천 대상 데이터가
        <br />
        아직 부족해요.
      </div>
    );
  }

  const chartSize = 92;
  const axisLeft = 42;
  const axisBottom = 22;
  const originX = axisLeft;
  const originY = 8;
  const half = chartSize / 2;
  const inset = 6;
  const markerX = originX + inset + (1 - point.y) * (chartSize - inset * 2);
  const markerY = originY + inset + (1 - point.x) * (chartSize - inset * 2);
  const highlightX = point.y >= 0.5 ? originX : originX + half;
  const highlightY = point.x >= 0.5 ? originY : originY + half;

  return (
    <svg
      viewBox="0 0 142 130"
      className="h-[130px] w-[142px] shrink-0"
      role="presentation"
      focusable="false"
    >
      <rect x={originX} y={originY} width={chartSize} height={chartSize} rx="4" fill="#f8f8f8" />
      <rect
        x={highlightX}
        y={highlightY}
        width={half}
        height={half}
        fill={hexToRgbaString(accentColor, 0.14)}
      />
      <line
        x1={originX + half}
        y1={originY}
        x2={originX + half}
        y2={originY + chartSize}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      />
      <line
        x1={originX}
        y1={originY + half}
        x2={originX + chartSize}
        y2={originY + half}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      />
      <circle cx={markerX} cy={markerY} r="6" fill={accentColor} />
      <text x={originX - 12} y={originY + 16} textAnchor="end" fontSize="10" fill="#767676">
        {axis.experienced}
      </text>
      <text x={originX - 12} y={originY + chartSize - 8} textAnchor="end" fontSize="10" fill="#767676">
        {axis.beginner}
      </text>
      <text x={originX} y={originY + chartSize + axisBottom - 2} textAnchor="start" fontSize="10" fill="#767676">
        {axis.immersion}
      </text>
      <text x={originX + chartSize} y={originY + chartSize + axisBottom - 2} textAnchor="end" fontSize="10" fill="#767676">
        {axis.deduction}
      </text>
    </svg>
  );
}

export default async function PlayroomGameDetailPage({ params }: PageProps) {
  const { locale, gameSettingsId } = await params;
  const normalizedLocale = normalizePlayroomSiteLocale(locale);
  if (!normalizedLocale) {
    notFound();
  }

  const item = await fetchPlayroomTemplateDetail(normalizedLocale, gameSettingsId);
  if (!item) {
    notFound();
  }

  const summaryItem = await fetchPlayroomTemplateSummary(
    normalizedLocale,
    gameSettingsId,
    item.ssobig_tool_template_id,
  );
  const reviewSummary = await fetchPlayroomReviewSummary(item.ssobig_tool_template_id);
  const assets = getToolTemplateAssets(summaryItem, item);

  const detailHtml = String(item.detail_description_html || "").trim();
  const detailText = String(
    item.detail_description || item.description || "",
  ).trim();
  const detailFormat = String(item.detail_description_format || "text")
    .trim()
    .toLowerCase();
  const shouldRenderHtml = detailFormat === "html" && detailHtml;
  const backHref = localeToCanonicalPath(normalizedLocale);
  const dt = DETAIL_UI_COPY[normalizedLocale];
  const posterImageUrl = resolvePlayroomAssetUrl(assets.posterImageUrl);
  const backgroundImageUrl = resolvePlayroomAssetUrl(assets.backgroundImageUrl);
  const themeColor = describeThemeColor(assets.themeColor);
  const heroAccentColor = themeColor.hex || "#009788";
  const isDarkMode = toolTemplateIsDarkMode(summaryItem, item);
  const heroTextClass = isDarkMode ? "text-white" : "text-black";
  const heroOverlayColor = isDarkMode
    ? "rgba(0,0,0,0.6)"
    : "rgba(255,255,255,0.6)";
  const heroBackgroundStyle = backgroundImageUrl
    ? {
        backgroundImage: `linear-gradient(180deg, ${heroOverlayColor}, ${heroOverlayColor}), url("${backgroundImageUrl}")`,
      }
    : {
        backgroundImage:
          "linear-gradient(180deg, rgba(201,226,255,0.95), rgba(235,244,255,0.95))",
      };
  const heroCreditText = pickTemplateString(
    String(item.credit ?? "").trim(),
    String(summaryItem?.credit ?? "").trim(),
    item.price_label,
    summaryItem?.price_label,
  );
  const heroPlayerText = formatPlayroomPlayerRange(item, summaryItem) || "-";
  const heroTimeText = formatPlayroomTime(item, summaryItem) || "-";
  const heroRatingText =
    reviewSummary.rating?.toFixed(1) ||
    (pickTemplateNumber(item.rating_average, summaryItem?.rating_average)
      ? pickTemplateNumber(item.rating_average, summaryItem?.rating_average).toFixed(1)
      : "-");
  const ratedResponseCount =
    reviewSummary.excellentCount +
    reviewSummary.okayCount +
    reviewSummary.notForMeCount;
  const excellentPercent = buildPercent(
    reviewSummary.excellentCount,
    ratedResponseCount,
  );
  const okayPercent = buildPercent(reviewSummary.okayCount, ratedResponseCount);
  const notForMePercent = buildPercent(
    reviewSummary.notForMeCount,
    ratedResponseCount,
  );
  const accentTrackColor = hexToRgbaString(heroAccentColor, 0.14);
  const recommendationCopy = getRecommendationCopy(item.locale || summaryItem?.locale || "ko_KR");
  const recommendationNarrative = buildQuadrantNarrative(
    reviewSummary.quadrant,
    item.locale || summaryItem?.locale || "ko_KR",
  );
  const reviewListItems: PlayroomReviewListItem[] = reviewSummary.reviews.map(
    (review) => {
      const meta = getSatisfactionMeta(review.satisfactionLabel, dt);

      return {
        id: review.id,
        nickname: review.nickname,
        localeLabel: dt.localeLabel,
        satisfactionText: meta.text,
        satisfactionEmoji: meta.emoji,
        dateLabel: formatReviewDate(review.sentTime),
        comment: review.comment,
        spoilerHidden: isTemplateReviewSpoilerHidden(review),
      };
    },
  );
  const ctaHref =
    pickTemplateString(item.destination_url, summaryItem?.destination_url) ||
    backHref;
  const ctaIsExternal = !ctaHref.startsWith("/");
  const ctaTextColor = getContrastingTextColor(heroAccentColor);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_26%,#f8fafc_100%)] pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-[calc(env(safe-area-inset-bottom)+112px)]">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
        <section className="overflow-hidden rounded-[30px] bg-[#f8f8f8] shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <div
            className="flex min-h-[253px] flex-col gap-4 bg-cover bg-center bg-no-repeat p-5"
            style={heroBackgroundStyle}
          >
            <PlayroomHeroActions
              backHref={backHref}
              isDarkMode={isDarkMode}
              shareLabel={dt.share}
              backLabel={dt.backToList}
              title={item.title}
              shareUrl={ctaHref}
            />

            <div className="grid grid-cols-[123px_minmax(0,1fr)] gap-6 px-3">
              <div className="relative h-[173px] w-[123px] overflow-hidden rounded-[12px] bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                {posterImageUrl ? (
                  <Image
                    src={posterImageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="123px"
                    unoptimized={posterImageUrl.startsWith("http")}
                    priority
                  />
                ) : null}
              </div>

              <div className="flex min-h-[173px] flex-col">
                <div className="flex flex-1 flex-col gap-[10px] py-3">
                  <h1
                    className={`text-[24px] font-bold leading-[34px] tracking-[-0.025em] ${heroTextClass}`}
                  >
                    {item.title}
                  </h1>

                  <div
                    className={`inline-flex items-center gap-[2.4px] text-[14.4px] font-normal leading-6 tracking-[-0.025em] ${heroTextClass}`}
                  >
                    <span className="inline-flex h-[17px] w-[17px] items-center justify-center">
                      <svg
                        viewBox="0 0 17 17"
                        role="presentation"
                        focusable="false"
                        className="h-[17px] w-[17px] fill-current stroke-current"
                      >
                        <path
                          d="M9.34948 1.57422L8.24546 6.75123H14.9609L7.45692 15.2242L8.5683 10.0348H1.83594L9.34948 1.57422Z"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{heroCreditText || "-"}</span>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-3">
                  {[
                    {
                      value: heroRatingText,
                      icon: (
                        <path d="M12 3.6l2.49 5.05 5.58.81-4.03 3.93.95 5.55L12 16.32 7.01 18.94l.95-5.55L3.93 9.46l5.58-.81L12 3.6Z" />
                      ),
                    },
                    {
                      value: heroPlayerText,
                      icon: (
                        <path d="M12 4.75a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm0 9c4.92 0 8 2.44 8 5.25a1 1 0 1 1-2 0c0-1.33-2.12-3.25-6-3.25s-6 1.92-6 3.25a1 1 0 1 1-2 0c0-2.81 3.08-5.25 8-5.25Z" />
                      ),
                    },
                    {
                      value: heroTimeText,
                      icon: (
                        <path d="M9 2.75a1 1 0 0 1 1 1v.5h4v-.5a1 1 0 1 1 2 0v1.11a8.25 8.25 0 1 1-8 0V3.75a1 1 0 0 1 1-1Zm3 4a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Zm0 2.5a1 1 0 0 1 1 1v2.34l1.66 1.66a1 1 0 1 1-1.41 1.41l-1.96-1.95A1 1 0 0 1 11 13v-2.75a1 1 0 0 1 1-1Z" />
                      ),
                    },
                  ].map((metaCard) => (
                    <div
                      key={metaCard.value}
                      className="flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-[12px] px-1 py-2 text-white backdrop-blur-[10px]"
                      style={{ backgroundColor: heroAccentColor }}
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          role="presentation"
                          focusable="false"
                          className="h-5 w-5 fill-current"
                        >
                          {metaCard.icon}
                        </svg>
                      </span>
                      <span className='min-w-full text-center font-["210_OmniGothic_Condensed","Pretendard","Apple_SD_Gothic_Neo",sans-serif] text-[14px] leading-[1.2] tracking-[0.02em]'>
                        {metaCard.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f8f8f8]">
            <div className="flex flex-col gap-2">
              {reviewSummary.responseCount > 0 ? (
                <section className="bg-white p-5">
                  <p
                    className="mb-3 text-[12px] font-semibold leading-[18px] tracking-[-0.025em]"
                    style={{ color: heroAccentColor }}
                  >
                    {recommendationCopy.response(reviewSummary.responseCount)}
                  </p>
                  <div className="grid grid-cols-[minmax(0,1fr)_142px] gap-[10px]">
                    <div className="flex min-w-0 flex-col justify-center gap-2 text-[#333333]">
                      <h2 className="m-0 whitespace-pre-wrap text-[18px] font-semibold leading-[26px] tracking-[-0.025em]">
                        {recommendationNarrative.headline}
                      </h2>
                      <div className="text-[14px] font-normal leading-[20px] tracking-[-0.025em]">
                        {recommendationNarrative.lines.map((line) => (
                          <p key={line} className="m-0">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <RecommendationQuadrantChart
                        accentColor={heroAccentColor}
                        quadrant={reviewSummary.quadrant}
                        locale={item.locale || summaryItem?.locale || "ko_KR"}
                      />
                    </div>
                  </div>
                </section>
              ) : null}

              <div className="bg-white p-5">
                {shouldRenderHtml ? (
                  <PlayroomHtmlFrame
                    html={detailHtml}
                    messageKey={`${normalizedLocale}:${gameSettingsId}`}
                    title={`${item.title} ${dt.detailSuffix}`}
                  />
                ) : (
                  renderTextDescription(detailText)
                )}
              </div>

              {(ratedResponseCount > 0 || reviewSummary.reviews.length > 0) ? (
                <section className="bg-white p-5">
                  <div className="flex flex-col gap-8">
                    {ratedResponseCount > 0 ? (
                      <div className="flex items-center justify-center gap-3 py-3">
                        <p className="min-w-0 flex-1 text-center text-[32px] font-bold leading-[42px] tracking-[-0.025em] text-[#333333]">
                          ⭐️ {reviewSummary.rating?.toFixed(1) || "-"}
                        </p>
                        <div className="flex min-w-0 flex-1 flex-col items-start">
                          {[
                            { emoji: "😍", percent: excellentPercent },
                            { emoji: "🙂", percent: okayPercent },
                            { emoji: "🥲", percent: notForMePercent },
                          ].map((item) => (
                            <div
                              key={`${item.emoji}:${item.percent}`}
                              className="flex w-full items-center gap-[10px] px-1 py-[2px]"
                            >
                              <span className="shrink-0 text-[18px] leading-[26px]">
                                {item.emoji}
                              </span>
                              <div
                                className="flex min-w-0 flex-1 items-center overflow-hidden rounded-full"
                                style={{ backgroundColor: accentTrackColor }}
                              >
                                <div
                                  className="h-[6px] shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: heroAccentColor,
                                    width: `${item.percent}%`,
                                  }}
                                />
                                <div className="h-[6px] min-w-0 flex-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {reviewSummary.reviews.length > 0 ? (
                      <PlayroomReviewList
                        reviews={reviewListItems}
                        accentColor={heroAccentColor}
                        loadMoreLabel={dt.loadingMoreReviews}
                      />
                    ) : null}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4">
        <div className="mx-auto w-full max-w-[720px] md:max-w-[600px]">
          <a
            href={ctaHref}
            target={ctaIsExternal ? "_blank" : undefined}
            rel={ctaIsExternal ? "noopener noreferrer" : undefined}
            className="flex h-[56px] w-full items-center justify-center rounded-[100px] px-6 text-base font-bold transition-[filter,transform] md:text-lg md:hover:brightness-95"
            style={{
              backgroundColor: heroAccentColor,
              color: ctaTextColor,
            }}
          >
            게임하러 가기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
