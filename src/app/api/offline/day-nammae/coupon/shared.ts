import { NextResponse } from "next/server";

const DEFAULT_COUPON_API_BASE_URL =
  "https://ferhwwjztseoegaizsko.supabase.co/functions/v1/ssobig-meeting-manage/coupon";

export function getCouponApiBaseUrl() {
  const configuredUrl = process.env.DAY_NAMMAE_COUPON_API_BASE_URL?.trim();
  return configuredUrl || DEFAULT_COUPON_API_BASE_URL;
}

export function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

export async function readJsonResponse(response: Response) {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return null;
  }
}

export function getReason(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if ("reason" in payload && typeof payload.reason === "string") {
    return payload.reason;
  }

  if ("error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  if ("detail" in payload && typeof payload.detail === "string") {
    return payload.detail;
  }

  return "";
}
