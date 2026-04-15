import { NextResponse } from "next/server";
import {
  getCouponApiBaseUrl,
  getReason,
  jsonResponse,
  readJsonResponse,
} from "../shared";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string };
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!code) {
      return jsonResponse({ valid: false, reason: "쿠폰코드를 입력해주세요." }, 400);
    }

    const upstreamResponse = await fetch(`${getCouponApiBaseUrl()}/validate`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const payload = await readJsonResponse(upstreamResponse);

    if (!upstreamResponse.ok) {
      return jsonResponse(
        {
          valid: false,
          reason:
            getReason(payload) ||
            `쿠폰 검증 요청에 실패했습니다. (${upstreamResponse.status})`,
        },
        upstreamResponse.status
      );
    }

    return jsonResponse(payload, 200);
  } catch (error) {
    return jsonResponse(
      {
        valid: false,
        reason:
          error instanceof Error
            ? error.message
            : "쿠폰 검증 중 서버 오류가 발생했습니다.",
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });
}
