import { NextResponse } from "next/server";

const DEFAULT_SURVEY_API_URL =
  "https://ferhwwjztseoegaizsko.supabase.co/functions/v1/ssobig-meeting-manage/public/day-nammae-survey";

function getSurveyApiUrl() {
  return process.env.DAY_NAMMAE_SURVEY_API_URL?.trim() || DEFAULT_SURVEY_API_URL;
}

async function parseUpstreamResponse(response: Response) {
  const responseText = await response.text();

  try {
    return responseText ? JSON.parse(responseText) : null;
  } catch {
    return {
      error: responseText || "Invalid upstream response",
    };
  }
}

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function normalizeSurveyPayload(body: Record<string, unknown>) {
  return {
    token: body.token,
    surveyScaleVersion: body.surveyScaleVersion,
    overallSatisfaction: body.overallSatisfaction,
    likedFactors: body.likedFactors,
    likedFactorOther: body.likedFactorOther,
    improvementPoints: body.improvementPoints,
    improvementPointOther: body.improvementPointOther,
    futureSessionPreferences: body.futureSessionPreferences,
    friendIntroText: body.friendIntroText,
    finalOpinionText: body.finalOpinionText,
    discoveryChannels: body.discoveryChannels ?? body.acquisitionChannels,
    discoveryChannelOther:
      body.discoveryChannelOther ?? body.acquisitionChannelEtc,
    contentFlowScore: body.contentFlowScore,
    recommendationScore: body.recommendationScore ?? body.recommendScore,
    recommendedFor:
      body.recommendedFor ?? body.referralTargets ?? body.recommendedTargets,
    recommendedForOther:
      body.recommendedForOther ??
      body.referralTargetOther ??
      body.recommendedTargetEtc,
    feedbackText: body.feedbackText ?? body.freeFeedback ?? body.freeText,
  };
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim();

  if (!token) {
    return jsonResponse({ error: "token query parameter is required" }, 400);
  }

  try {
    const upstreamUrl = new URL(getSurveyApiUrl());
    upstreamUrl.searchParams.set("token", token);

    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const payload = await parseUpstreamResponse(upstreamResponse);
    return jsonResponse(payload, upstreamResponse.status);
  } catch (error) {
    return jsonResponse(
      {
        error: "Failed to fetch day-nammae survey",
        detail: error instanceof Error ? error.message : "Unknown server error",
      },
      500
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!body) {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const upstreamResponse = await fetch(getSurveyApiUrl(), {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(normalizeSurveyPayload(body)),
    });

    const payload = await parseUpstreamResponse(upstreamResponse);

    if (upstreamResponse.status === 409) {
      return jsonResponse(
        {
          alreadySubmitted: true,
          submittedAt:
            payload && typeof payload === "object" && "submittedAt" in payload
              ? payload.submittedAt
              : null,
          error:
            payload && typeof payload === "object" && "reason" in payload
              ? payload.reason
              : payload && typeof payload === "object" && "error" in payload
                ? payload.error
                : "이미 제출된 설문입니다.",
        },
        409
      );
    }

    if (!upstreamResponse.ok) {
      return jsonResponse(
        {
          error:
            payload && typeof payload === "object" && "reason" in payload
              ? payload.reason
              : payload && typeof payload === "object" && "error" in payload
                ? payload.error
                : "설문 제출에 실패했습니다.",
        },
        upstreamResponse.status
      );
    }

    return jsonResponse(payload, 200);
  } catch (error) {
    return jsonResponse(
      {
        error: "Failed to submit day-nammae survey",
        detail: error instanceof Error ? error.message : "Unknown server error",
      },
      500
    );
  }
}
