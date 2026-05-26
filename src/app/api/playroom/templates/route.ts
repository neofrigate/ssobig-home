import { NextResponse } from "next/server";

import {
  matchesPlayroomTemplateLocale,
  normalizePlayroomSiteLocale,
} from "@/app/playroom/playroomSiteLocale";

const PLAYROOM_TEMPLATE_API_URL =
  "https://tlyioijsopxeegzfjlqe.supabase.co/functions/v1/marketing-management-api/public/playroom-templates";

type PlayroomTemplateCategory = "story_mystery" | "friends";

type PlayroomTemplateApiItem = {
  category: PlayroomTemplateCategory;
  ssobig_tool_template_id: string;
  title: string;
  description: string;
  players_label: string;
  price_label: string;
  card_image_url: string;
  destination_url: string;
  locale?: string;
  locale_visibility?: string;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const locale = normalizePlayroomSiteLocale(url.searchParams.get("locale"));
    const endpoint = new URL(PLAYROOM_TEMPLATE_API_URL);
    if (locale) {
      endpoint.searchParams.set("locale", locale);
    }
    const response = await fetch(endpoint.toString(), {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Playroom template API failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      items?: PlayroomTemplateApiItem[];
    };

    const items = (data.items || []).filter((item) => {
      if (
        locale &&
        !matchesPlayroomTemplateLocale(
          locale,
          item.locale,
          item.locale_visibility
        )
      ) {
        return false;
      }

      return true;
    });

    return NextResponse.json(
      { items },
      {
        headers: {
          "Cache-Control": "no-store",
        },
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
