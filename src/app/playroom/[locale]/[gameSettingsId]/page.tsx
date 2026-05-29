import Image from "next/image";
import { notFound } from "next/navigation";

import PlayroomHeroActions from "@/app/playroom/PlayroomHeroActions";
import PlayroomHtmlFrame from "@/app/playroom/PlayroomHtmlFrame";
import {
  buildPlayroomTemplatesApiUrl,
  buildPlayroomTemplateDetailApiUrl,
  type PlayroomTemplateApiItem,
} from "@/app/playroom/playroomApi";
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
  satisfaction?: string | null;
  sent_time?: string | null;
  nickname?: string | null;
  additional_comment?: string | null;
};

type PlayroomReviewItem = {
  nickname: string;
  comment: string;
  satisfactionLabel: "excellent" | "okay" | "notForMe" | null;
  sentTime: string;
};

type PlayroomReviewSummary = {
  rating: number | null;
  responseCount: number;
  excellentCount: number;
  okayCount: number;
  notForMeCount: number;
  reviews: PlayroomReviewItem[];
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
    };
  }

  const response = await fetch(
    buildSupabaseUrl(
      `/rest/v1/reviews?template_id=eq.${encodeURIComponent(templateId)}&select=satisfaction,sent_time,nickname,additional_comment&order=sent_time.desc`
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
    .map((record) => ({
      nickname: String(record.nickname || "익명").trim() || "익명",
      comment: normalizeComment(record.additional_comment),
      satisfactionLabel: simplifySatisfaction(record.satisfaction),
      sentTime: String(record.sent_time || "").trim(),
    }))
    .filter((record) => record.comment)
    .slice(0, 8);

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

function formatReviewDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function getSatisfactionMeta(
  label: PlayroomReviewItem["satisfactionLabel"],
  dt: (typeof DETAIL_UI_COPY)[PlayroomSiteLocale],
) {
  if (label === "excellent") return { emoji: "😍", text: dt.excellent };
  if (label === "notForMe") return { emoji: "🥲", text: dt.notForMe };
  return { emoji: "🙂", text: dt.okay };
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
  const itemGame = getTemplateGame(item);
  const summaryGame = getTemplateGame(summaryItem);

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
  const posterImageUrl = resolvePlayroomAssetUrl(
    pickTemplateString(
      itemGame.imageUrl,
      item.imageUrl,
      summaryGame.imageUrl,
      summaryItem?.imageUrl,
      item.card_image_url,
    ),
  );
  const backgroundImageUrl = resolvePlayroomAssetUrl(
    pickTemplateString(
      itemGame.backgroundImageUrl,
      item.backgroundImageUrl,
      summaryGame.backgroundImageUrl,
      summaryItem?.backgroundImageUrl,
    ),
  );
  const themeColor = describeThemeColor(
    itemGame.themeColor ??
      item.themeColor ??
      summaryGame.themeColor ??
      summaryItem?.themeColor ??
      null,
  );
  const heroAccentColor = themeColor.hex || "#009788";
  const isDarkMode =
    item.isDarkMode === true ||
    itemGame.isDarkMode === true ||
    summaryItem?.isDarkMode === true ||
    summaryGame.isDarkMode === true;
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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_26%,#f8fafc_100%)]">
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

          <div className="bg-white p-5 md:p-8">
            {shouldRenderHtml ? (
              <PlayroomHtmlFrame
                html={detailHtml}
                messageKey={`${normalizedLocale}:${gameSettingsId}`}
                title={`${item.title} ${dt.detailSuffix}`}
              />
            ) : (
              renderTextDescription(detailText)
            )}

            {ratedResponseCount > 0 ? (
              <section className="-mx-5 mt-6 bg-[#f8f8f8] md:-mx-8 md:mt-8">
                <div className="h-2 w-full bg-[#f8f8f8]" />
                <div className="bg-white px-5 py-5 md:px-8 md:py-8">
                  <div className="grid grid-cols-2 items-center gap-3 py-3">
                    <div className="flex items-center justify-center gap-2 text-center">
                      <span className="text-[32px] leading-[42px] text-[#f6b617]">⭐️</span>
                      <span className="text-[32px] font-bold leading-[42px] tracking-[-0.05em] text-[#333333]">
                        {reviewSummary.rating?.toFixed(1) || "-"}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-col items-start">
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
                          <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-full bg-[rgba(0,151,136,0.1)]">
                            <div
                              className="h-[6px] shrink-0 rounded-full bg-[#009788]"
                              style={{ width: `${item.percent}%` }}
                            />
                            <div className="h-[6px] min-w-0 flex-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    {reviewSummary.reviews.length > 0 ? (
                      <div className="space-y-8">
                        {reviewSummary.reviews.map((review, index) => {
                          const meta = getSatisfactionMeta(
                            review.satisfactionLabel,
                            dt,
                          );

                          return (
                            <article
                              key={`${review.nickname}:${review.comment}:${index}`}
                              className="flex flex-col gap-1 px-1"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 shrink-0 rounded-full bg-[#e8e8e8]" />
                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                  <span className="truncate text-[15px] font-light leading-[22px] tracking-[-0.025em] text-[#333333]">
                                    {review.nickname}
                                  </span>
                                  <span className="shrink-0 rounded-full bg-[#f4f4f4] px-2 py-[2px] text-[13px] font-light leading-[18px] tracking-[-0.025em] text-[#767676]">
                                    {dt.localeLabel}
                                  </span>
                                </div>
                                <span className="ml-auto shrink-0 text-[18px] leading-none text-[#111111]">
                                  ⋮
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-[#767676]">
                                <span className="text-[15px] font-normal leading-[22px] tracking-[-0.025em] text-[#111111]">
                                  {meta.emoji} {meta.text}
                                </span>
                                <span className="text-[13px] font-light leading-[18px] tracking-[-0.025em]">
                                  {formatReviewDate(review.sentTime)}
                                </span>
                              </div>

                              <p className="whitespace-pre-wrap text-[14px] font-normal leading-[20px] tracking-[-0.025em] text-[#333333]">
                                {review.comment}
                              </p>
                            </article>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[14px] leading-5 text-[#767676]">
                        {dt.noReviews}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
