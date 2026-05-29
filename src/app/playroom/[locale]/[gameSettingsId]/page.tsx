import Image from "next/image";
import { notFound } from "next/navigation";

import PlayroomHtmlFrame from "@/app/playroom/PlayroomHtmlFrame";
import {
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

function buildSupabaseUrl(path: string) {
  return new URL(path, QUALITY_SUPABASE_URL).toString();
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

  const reviewSummary = await fetchPlayroomReviewSummary(item.ssobig_tool_template_id);

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
        <a
          href={backHref}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          {dt.backToList}
        </a>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:p-8">
            <div className="relative mx-auto aspect-[3/4] w-[180px] overflow-hidden rounded-[22px] bg-slate-100 md:mx-0 md:w-[220px]">
              <Image
                src={item.card_image_url}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 180px, 220px"
                priority
              />
            </div>

            <div className="flex-1">
              <div className="mb-4 flex flex-wrap gap-2">
                {item.price_label ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                    ⚡ {item.price_label}
                  </span>
                ) : null}
                {item.players_label ? (
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-800">
                    👥 {item.players_label}
                  </span>
                ) : null}
              </div>

              <h1 className="mb-3 text-[34px] font-black tracking-[-0.03em] text-slate-950 md:text-[50px]">
                {item.title}
              </h1>
              <p className="max-w-2xl whitespace-pre-wrap text-[16px] leading-7 text-slate-600 md:text-[18px]">
                {item.description}
              </p>

              <div className="mt-6">
                <a
                  href={item.destination_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {dt.playNow}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 p-5 md:p-8">
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
