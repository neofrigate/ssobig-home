import { NextResponse } from "next/server";

import {
  buildPlayroomTemplatesApiUrl,
  type PlayroomTemplateApiItem,
} from "@/app/playroom/playroomApi";
import { normalizePlayroomSiteLocale } from "@/app/playroom/playroomSiteLocale";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
  "CDN-Cache-Control": "max-age=300, stale-while-revalidate=600",
  "Vercel-CDN-Cache-Control": "max-age=300, stale-while-revalidate=600",
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const locale = normalizePlayroomSiteLocale(url.searchParams.get("locale"));
    const endpoint = buildPlayroomTemplatesApiUrl(locale || undefined);
    const response = await fetch(endpoint.toString(), {
      next: {
        revalidate: 300,
      },
    });
    if (!response.ok) {
      throw new Error(`Playroom template API failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      items?: PlayroomTemplateApiItem[];
    };

    return NextResponse.json(
      { items: data.items || [] },
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
