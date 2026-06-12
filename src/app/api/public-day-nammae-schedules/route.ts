import { NextResponse } from "next/server";

const DEFAULT_PUBLIC_SCHEDULES_API_URL =
  "https://ferhwwjztseoegaizsko.supabase.co/functions/v1/ssobig-meeting-manage/public/day-nammae-schedules";
const BROWSER_CACHE_CONTROL = "public, max-age=0, must-revalidate";
const CDN_CACHE_CONTROL = "max-age=60, stale-while-revalidate=300";

function getPublicSchedulesApiUrl() {
  const configuredUrl = process.env.DAY_NAMMAE_PUBLIC_SCHEDULES_API_URL?.trim();
  return configuredUrl || DEFAULT_PUBLIC_SCHEDULES_API_URL;
}

function jsonResponse(
  body: unknown,
  status = 200,
  cacheControl = "no-store",
  vercelCacheControl?: string,
  cdnCacheControl?: string
) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
  };

  if (cacheControl) {
    headers["Cache-Control"] = cacheControl;
  }

  if (cdnCacheControl) {
    headers["CDN-Cache-Control"] = cdnCacheControl;
  }

  if (vercelCacheControl) {
    headers["Vercel-CDN-Cache-Control"] = vercelCacheControl;
  }

  return NextResponse.json(body, {
    status,
    headers,
  });
}

export async function GET() {
  const upstreamUrl = getPublicSchedulesApiUrl();

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      next: {
        revalidate: 60,
      },
      headers: {
        Accept: "application/json",
      },
    });

    const responseText = await upstreamResponse.text();
    let payload: unknown = null;

    try {
      payload = responseText ? JSON.parse(responseText) : null;
    } catch {
      payload = null;
    }

    if (!upstreamResponse.ok) {
      return jsonResponse(
        {
          error: "Failed to fetch public day-nammae schedules",
          detail:
            (payload &&
              typeof payload === "object" &&
              "detail" in payload &&
              typeof payload.detail === "string" &&
              payload.detail) ||
            (payload &&
              typeof payload === "object" &&
              "error" in payload &&
              typeof payload.error === "string" &&
              payload.error) ||
            `Upstream request failed with status ${upstreamResponse.status}`,
        },
        upstreamResponse.status
      );
    }

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid upstream JSON payload");
    }

    return jsonResponse(
      payload,
      200,
      BROWSER_CACHE_CONTROL,
      CDN_CACHE_CONTROL,
      CDN_CACHE_CONTROL
    );
  } catch (error) {
    return jsonResponse(
      {
        error: "Failed to fetch public day-nammae schedules",
        detail:
          error instanceof Error ? error.message : "Unknown server error",
      },
      500
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });
}
