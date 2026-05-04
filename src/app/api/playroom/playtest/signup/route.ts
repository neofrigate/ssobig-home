import { NextResponse } from "next/server";

const SUPPORTED_LOCALES = new Set(["ko", "en"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const platform = optionalString(body.platform);
  const groupSize = optionalString(body.groupSize);
  const experience = optionalString(body.experience);
  const source = stringArray(body.source);
  const consent = body.consent === true;

  if (
    !SUPPORTED_LOCALES.has(locale) ||
    !name ||
    !email ||
    !country ||
    languages.length === 0 ||
    !platform ||
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
    country,
    timezone: optionalString(body.timezone),
    languages,
    platform,
    device: optionalString(body.device),
    groupSize,
    experience,
    source,
    sourceOther: optionalString(body.sourceOther),
    motivation: optionalString(body.motivation),
    consent,
    pageUrl: optionalString(body.pageUrl),
    submittedAt: optionalString(body.submittedAt) || new Date().toISOString(),
  };

  const webhookUrl = process.env.PLAYTEST_SIGNUP_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "production") {
      return jsonResponse(
        {
          success: false,
          error: "Playtest signup endpoint is not configured",
        },
        503
      );
    }

    console.info("[playtest-signup:dry-run]", payload);
    return jsonResponse({ success: true, dryRun: true });
  }

  try {
    const upstreamResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!upstreamResponse.ok) {
      return jsonResponse(
        {
          success: false,
          error: "Failed to forward playtest signup",
        },
        502
      );
    }

    return jsonResponse({ success: true });
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
