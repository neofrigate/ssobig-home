import { NextResponse } from "next/server";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
  "CDN-Cache-Control": "max-age=300, stale-while-revalidate=600",
  "Vercel-CDN-Cache-Control": "max-age=300, stale-while-revalidate=600",
};

const QUALITY_SUPABASE_URL = "https://tlyioijsopxeegzfjlqe.supabase.co";
const QUALITY_SUPABASE_KEY = "sb_publishable_AdEHgXPGJ2gKGVAjb7RYSg_YzUuT6jB";

const SB_HEADERS = {
  apikey: QUALITY_SUPABASE_KEY,
  Authorization: `Bearer ${QUALITY_SUPABASE_KEY}`,
};

type GameSetting = {
  id?: string;
  title?: string;
  players?: string;
  order?: number;
  status?: string;
  image_url?: string;
  template_ids?: string[] | null;
};

type ReviewRecord = {
  game_title?: string;
  template_id?: string | null;
  satisfaction?: string | null;
  game_id?: string | null;
  sent_time?: string | null;
  nickname?: string | null;
};

function buildSupabaseUrl(path: string) {
  return new URL(path, QUALITY_SUPABASE_URL).toString();
}

function normalizeGameStatus(status?: string | null) {
  const normalized = String(status || "").trim();
  if (
    normalized === "출시" ||
    normalized === "제작중" ||
    normalized === "기타"
  ) {
    return normalized;
  }
  return "";
}

function getStatusPriority(status?: string | null) {
  const normalized = normalizeGameStatus(status);
  if (normalized === "출시") return 0;
  if (normalized === "제작중") return 1;
  if (normalized === "기타") return 2;
  return 3;
}

function titlesMatch(dataTitle?: string | null, configTitle?: string | null) {
  if (!dataTitle || !configTitle) return false;
  const a = dataTitle.replace(/\s+/g, "");
  const b = configTitle.replace(/\s+/g, "");
  return a === b || a.includes(b) || b.includes(a);
}

function normalizeTitleKey(title?: string | null) {
  return String(title || "").replace(/\s+/g, "").trim();
}

function normalizePlayersValue(players?: string | null) {
  const normalized = String(players || "").trim();
  if (!normalized) return "";
  const digitOnly = normalized.replace(/[^0-9]/g, "");
  if (!digitOnly) return "";
  const numeric = Number(digitOnly);
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 10) return "";
  return String(numeric);
}

function formatPlayersLabel(players?: string | null) {
  const normalized = normalizePlayersValue(players);
  if (!normalized) return "-";
  return `${normalized}인`;
}

function getSatisfactionLabelFromEmoji(text: string) {
  const labels: Array<{ emoji: string; label: string }> = [
    { emoji: "🥰", label: "최고" },
    { emoji: "😍", label: "최고" },
    { emoji: "🤩", label: "최고" },
    { emoji: "🙂", label: "괜찮음" },
    { emoji: "😊", label: "괜찮음" },
    { emoji: "😐", label: "괜찮음" },
    { emoji: "🥲", label: "아쉬움" },
    { emoji: "😢", label: "아쉬움" },
    { emoji: "😞", label: "아쉬움" },
    { emoji: "🙁", label: "아쉬움" },
    { emoji: "😕", label: "아쉬움" },
  ];

  let firstMatch: { index: number; label: string } | null = null;
  for (const { emoji, label } of labels) {
    const index = text.indexOf(emoji);
    if (index === -1) continue;
    if (!firstMatch || index < firstMatch.index) {
      firstMatch = { index, label };
    }
  }
  return firstMatch?.label || "";
}

function simplifySatisfaction(value?: string | null) {
  const text = String(value || "").trim();
  if (!text) return "";
  const emojiLabel = getSatisfactionLabelFromEmoji(text);
  if (emojiLabel) return emojiLabel;
  if (text.includes("최고")) return "최고";
  if (text.includes("괜찮")) return "괜찮음";
  if (text.includes("아쉬")) return "아쉬움";
  return text;
}

function scoreSatisfaction(value?: string | null): number {
  const simplified = simplifySatisfaction(value);
  if (simplified === "최고") return 5;
  if (simplified === "괜찮음") return 3;
  if (simplified === "아쉬움") return 1;
  return 0;
}

function getPlayUnitKey(item: ReviewRecord) {
  const gameId = String(item.game_id || "").trim();
  if (gameId) return gameId;
  return [
    item.game_title || "unknown",
    item.sent_time || "",
    item.nickname || "익명",
  ].join("::");
}

export async function GET() {
  try {
    const [gameSettingsResponse, reviewsResponse] = await Promise.all([
      fetch(
        buildSupabaseUrl(
          "/rest/v1/game_settings?select=id,title,players,order,status,image_url,template_ids&order=order"
        ),
        {
          headers: SB_HEADERS,
          next: {
            revalidate: 300,
          },
        }
      ),
      fetch(
        buildSupabaseUrl(
          "/rest/v1/reviews?select=game_title,template_id,satisfaction,game_id,sent_time,nickname&order=sent_time.desc"
        ),
        {
          headers: SB_HEADERS,
          next: {
            revalidate: 300,
          },
        }
      ),
    ]);

    if (!gameSettingsResponse.ok || !reviewsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to load story option source data" },
        { status: 502 }
      );
    }

    const gameSettings = (await gameSettingsResponse.json()) as GameSetting[];
    const reviews = (await reviewsResponse.json()) as ReviewRecord[];

    const releasedSettings = Array.from(
      gameSettings
        .filter((setting) => normalizeGameStatus(setting.status) === "출시")
        .reduce((map, setting) => {
          const key = normalizeTitleKey(setting.title);
          if (!key) return map;

          const existing = map.get(key);
          if (!existing) {
            map.set(key, {
              ...setting,
              template_ids: Array.isArray(setting.template_ids)
                ? setting.template_ids.filter(Boolean)
                : [],
            });
            return map;
          }

          const mergedTemplateIds = [
            ...new Set([
              ...(Array.isArray(existing.template_ids)
                ? existing.template_ids.filter(Boolean)
                : []),
              ...(Array.isArray(setting.template_ids)
                ? setting.template_ids.filter(Boolean)
                : []),
            ]),
          ];

          map.set(key, {
            ...existing,
            image_url: existing.image_url || setting.image_url,
            players: existing.players || setting.players,
            order:
              typeof existing.order === "number"
                ? existing.order
                : setting.order,
            template_ids: mergedTemplateIds,
          });
          return map;
        }, new Map<string, GameSetting>())
        .values()
    );

    const items = releasedSettings
      .map((setting) => {
        const canonicalTitle = String(setting.title || "").trim();
        const records = reviews.filter((record) =>
          titlesMatch(record.game_title, canonicalTitle)
        );
        const validScores = records
          .map((record) => scoreSatisfaction(record.satisfaction))
          .filter((score) => score > 0);
        const averageScore = validScores.length
          ? Number(
              (
                validScores.reduce((sum, score) => sum + score, 0) /
                validScores.length
              ).toFixed(1)
            )
          : 0;

        const templateIdsFromReviews = [
          ...new Set(
            records
              .map((record) => String(record.template_id || "").trim())
              .filter(Boolean)
          ),
        ];

        const sessionCount = new Set(records.map(getPlayUnitKey).filter(Boolean)).size;

        return {
          sourceTitle: canonicalTitle,
          imageUrl: String(setting.image_url || ""),
          playersLabel: formatPlayersLabel(setting.players),
          averageScore,
          rating: averageScore.toFixed(1),
          statusLabel: normalizeGameStatus(setting.status),
          statusPriority: getStatusPriority(setting.status),
          order: Number(setting.order ?? 0),
          templateIds:
            Array.isArray(setting.template_ids) && setting.template_ids.length > 0
              ? setting.template_ids.filter(Boolean)
              : templateIdsFromReviews,
          sessionCount,
          reviewCount: validScores.length,
        };
      })
      .sort((a, b) => {
        if (a.statusPriority !== b.statusPriority) {
          return a.statusPriority - b.statusPriority;
        }
        if (a.averageScore !== b.averageScore) {
          return b.averageScore - a.averageScore;
        }
        return a.sourceTitle.localeCompare(b.sourceTitle, "ko");
      });

    return NextResponse.json(
      { items },
      {
        headers: CACHE_HEADERS,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to build story options",
      },
      { status: 500 }
    );
  }
}
