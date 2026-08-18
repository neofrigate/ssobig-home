import { NextResponse } from "next/server";

import {
  buildPlayroomTemplatesApiUrl,
  type PlayroomTemplateApiItem,
} from "@/app/playroom/playroomApi";
import { normalizePlayroomSiteLocale } from "@/app/playroom/playroomSiteLocale";

const QUALITY_SUPABASE_URL = "https://tlyioijsopxeegzfjlqe.supabase.co";
const QUALITY_SUPABASE_KEY =
  "sb_publishable_AdEHgXPGJ2gKGVAjb7RYSg_YzUuT6jB";
const QUALITY_SB_HEADERS = {
  apikey: QUALITY_SUPABASE_KEY,
  Authorization: `Bearer ${QUALITY_SUPABASE_KEY}`,
};

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
  "CDN-Cache-Control": "max-age=30, stale-while-revalidate=60",
  "Vercel-CDN-Cache-Control": "max-age=30, stale-while-revalidate=60",
};

interface PlayroomReviewRatingRow {
  template_id?: string | null;
  satisfaction?: string | null;
}

function scoreSatisfaction(value?: string | null) {
  const text = String(value || "").trim();
  if (
    text.includes("😍") ||
    text.includes("🥰") ||
    text.includes("🤩") ||
    text.includes("최고")
  ) {
    return 5;
  }
  if (text.includes("🥲") || text.includes("😢") || text.includes("아쉬")) {
    return 1;
  }
  if (text.includes("🙂") || text.includes("😊") || text.includes("괜찮")) {
    return 3;
  }
  return 0;
}

async function addReviewRatings(items: PlayroomTemplateApiItem[]) {
  const templateIds = Array.from(
    new Set(
      items
        .map((item) => item.ssobig_tool_template_id)
        .filter((id) => /^[A-Za-z0-9_-]+$/.test(id)),
    ),
  );

  if (templateIds.length === 0) {
    return items;
  }

  try {
    const reviewsUrl = new URL("/rest/v1/reviews", QUALITY_SUPABASE_URL);
    reviewsUrl.searchParams.set("template_id", `in.(${templateIds.join(",")})`);
    reviewsUrl.searchParams.set("select", "template_id,satisfaction");
    const response = await fetch(reviewsUrl.toString(), {
      headers: QUALITY_SB_HEADERS,
      next: { revalidate: 30 },
    });
    if (!response.ok) {
      throw new Error(`Playroom review API failed: ${response.status}`);
    }

    const rows = (await response.json()) as PlayroomReviewRatingRow[];
    const scoresByTemplate = new Map<string, number[]>();
    rows.forEach((row) => {
      const templateId = String(row.template_id || "").trim();
      const score = scoreSatisfaction(row.satisfaction);
      if (!templateId || score <= 0) return;
      const scores = scoresByTemplate.get(templateId) || [];
      scores.push(score);
      scoresByTemplate.set(templateId, scores);
    });

    return items.map((item) => {
      const scores = scoresByTemplate.get(item.ssobig_tool_template_id) || [];
      if (scores.length === 0) return item;
      const rating =
        Math.round(
          (scores.reduce((sum, score) => sum + score, 0) / scores.length) *
            10,
        ) / 10;
      return { ...item, rating_average: rating };
    });
  } catch (error) {
    console.error("플레이룸 카드 평점 로드 실패:", error);
    return items;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const locale = normalizePlayroomSiteLocale(url.searchParams.get("locale"));
    const endpoint = buildPlayroomTemplatesApiUrl(locale || undefined);
    const response = await fetch(endpoint.toString(), {
      next: {
        revalidate: 30,
      },
    });
    if (!response.ok) {
      throw new Error(`Playroom template API failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      items?: PlayroomTemplateApiItem[];
    };
    const items = await addReviewRatings(data.items || []);

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
            : "Failed to load playroom templates",
      },
      { status: 500 }
    );
  }
}
