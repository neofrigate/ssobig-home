import { NextResponse } from "next/server";

import {
  buildPlayroomTemplatesApiUrl,
  type PlayroomTemplateApiItem,
} from "@/app/playroom/playroomApi";
import { normalizePlayroomSiteLocale } from "@/app/playroom/playroomSiteLocale";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const locale = normalizePlayroomSiteLocale(url.searchParams.get("locale"));
    const endpoint = buildPlayroomTemplatesApiUrl(locale || undefined);
    const response = await fetch(endpoint.toString(), {
      cache: "no-store",
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
