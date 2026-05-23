import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextResponse } from "next/server";

const SUPPORTED_LOCALES = new Set(["ko", "en", "ja", "zh"]);
const SOURCE_TYPES = new Set(["organic", "influencer", "overseas_beta"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_SIGNUP_API_URL =
  "https://tlyioijsopxeegzfjlqe.supabase.co/functions/v1/playtest-signup-public";
const PREVIEW_SIGNUP_DIR = join(tmpdir(), "ssobig-playtest-preview");
const PREVIEW_SIGNUP_FILE = join(
  PREVIEW_SIGNUP_DIR,
  "playtest-signups.jsonl"
);

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizedSourceType(value: unknown) {
  const sourceType = optionalString(value) || "organic";
  return SOURCE_TYPES.has(sourceType) ? sourceType : "organic";
}

function optionalPositiveInteger(value: unknown) {
  const text = optionalString(value);
  if (!text) return null;
  const parsed = Number.parseInt(text, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function inferPrimaryLanguage(locale: string) {
  if (locale === "ko") return "ko-KR";
  if (locale === "ja") return "ja-JP";
  if (locale === "zh") return "zh-CN";
  return "en-US";
}

async function storePreviewSignup(payload: Record<string, unknown>) {
  await mkdir(PREVIEW_SIGNUP_DIR, { recursive: true });
  const id = randomUUID();
  const record = {
    id,
    savedAt: new Date().toISOString(),
    payload,
  };
  await appendFile(PREVIEW_SIGNUP_FILE, `${JSON.stringify(record)}\n`, "utf8");
  return id;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!body) {
    return jsonResponse({ success: false, error: "Invalid request body" }, 400);
  }

  const locale = optionalString(body.locale);
  const email = optionalString(body.email);
  const name = optionalString(body.name);
  const country = optionalString(body.country);
  const languages = stringArray(body.languages);
  const inferredLanguages =
    languages.length > 0 ? languages : [inferPrimaryLanguage(locale)];
  const platform = optionalString(body.platform) || "not_collected";
  const groupSize = optionalString(body.groupSize);
  const experience = optionalString(body.experience);
  const source = stringArray(body.source);
  const consent = body.consent === true;

  if (
    !SUPPORTED_LOCALES.has(locale) ||
    !name ||
    !email ||
    !country ||
    !groupSize ||
    !experience ||
    source.length === 0
  ) {
    return jsonResponse({ success: false, error: "Missing required fields" }, 400);
  }

  if (!EMAIL_PATTERN.test(email)) {
    return jsonResponse({ success: false, error: "Invalid email address" }, 400);
  }

  if (!consent) {
    return jsonResponse({ success: false, error: "Consent is required" }, 400);
  }

  const payload = {
    locale,
    name,
    email,
    phone: optionalString(body.phone),
    country,
    timezone: "",
    languages: inferredLanguages,
    platform,
    device: "",
    groupSize,
    experience,
    source,
    sourceOther: optionalString(body.sourceOther),
    motivation: optionalString(body.motivation),
    consent,
    pageUrl: optionalString(body.pageUrl),
    submittedAt: optionalString(body.submittedAt) || new Date().toISOString(),
    sourceType: normalizedSourceType(body.sourceType),
    campaignSlug: optionalString(body.campaignSlug),
    sourcePlatform: optionalString(body.sourcePlatform),
    influencerId: optionalPositiveInteger(body.influencerId),
    influencerSlug: optionalString(body.influencerSlug),
    selectedTemplateId: optionalString(body.selectedTemplateId),
    selectedTemplateTitle: optionalString(body.selectedTemplateTitle),
    requestedCouponStatus: optionalString(body.requestedCouponStatus),
  };

  const signupApiUrl =
    process.env.PLAYTEST_SIGNUP_API_URL?.trim() ||
    process.env.PLAYTEST_SIGNUP_WEBHOOK_URL?.trim() ||
    DEFAULT_SIGNUP_API_URL;
  const signupApiSecret = process.env.PLAYTEST_SIGNUP_API_SECRET?.trim();

  if (!signupApiUrl) {
    if (process.env.NODE_ENV === "production") {
      return jsonResponse(
        {
          success: false,
          error: "Playtest signup endpoint is not configured",
        },
        503
      );
    }

    const previewId = await storePreviewSignup(payload);
    console.info("[playtest-signup:preview-stored]", {
      id: previewId,
      file: PREVIEW_SIGNUP_FILE,
    });
    return jsonResponse({
      success: true,
      dryRun: true,
      previewStored: true,
      id: previewId,
    });
  }

  try {
    const upstreamResponse = await fetch(signupApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(signupApiSecret
          ? { "X-SSOBIG-PLAYTEST-SECRET": signupApiSecret }
          : {}),
      },
      body: JSON.stringify(payload),
    });
    const upstreamPayload = (await upstreamResponse.json().catch(() => null)) as
      | {
        success?: boolean;
        id?: unknown;
        emailDeliveryStatus?: unknown;
        slackNotificationStatus?: unknown;
        slackNotificationError?: unknown;
        error?: string;
      }
      | null;

    if (!upstreamResponse.ok || !upstreamPayload?.success) {
      return jsonResponse(
        {
          success: false,
          error: upstreamPayload?.error || "Failed to forward playtest signup",
        },
        502
      );
    }

    return jsonResponse({
      success: true,
      id: upstreamPayload.id,
      emailDeliveryStatus: upstreamPayload.emailDeliveryStatus,
      slackNotificationStatus: upstreamPayload.slackNotificationStatus,
      slackNotificationError: upstreamPayload.slackNotificationError,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit playtest signup",
      },
      500
    );
  }
}
