import { NextResponse } from "next/server";

const DEFAULT_PUBLIC_SCHEDULES_API_URL =
  "https://manage.ssobig.com/api/public-day-nammae-schedules";

function getPublicSchedulesApiUrl() {
  const configuredUrl = process.env.DAY_NAMMAE_PUBLIC_SCHEDULES_API_URL?.trim();
  return configuredUrl || DEFAULT_PUBLIC_SCHEDULES_API_URL;
}

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  const upstreamUrl = getPublicSchedulesApiUrl();

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      cache: "no-store",
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

    return jsonResponse(payload, 200);
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
