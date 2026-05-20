import crypto from "node:crypto";
import fs from "node:fs";

const PROPERTY_ID = process.env.GA4_PROPERTY_ID || "490558145";
const SERVICE_ACCOUNT_FILE =
  process.env.GA4_SERVICE_ACCOUNT_FILE ||
  "/Users/jowoncheol/.config/ssobig/ga4/ga4-ssobig-reader.json";
const DRY_RUN = process.env.GA4_DRY_RUN === "1";
const SCOPE = "https://www.googleapis.com/auth/analytics.edit";

const CUSTOM_DIMENSIONS = [
  ["step_key", "일일남매 퍼널 스텝 키"],
  ["step_name", "일일남매 퍼널 스텝 이름"],
  ["flow_type", "일일남매 신청 플로우 유형"],
  ["entry_surface", "일일남매 신청 진입 지면"],
  ["apply_mode", "일일남매 신청 UI 모드"],
  ["application_mode", "일일남매 신청 처리 모드"],
  ["gender", "일일남매 신청 성별"],
  ["has_coupon", "일일남매 쿠폰 보유 여부"],
  ["coupon_state", "일일남매 쿠폰 상태"],
  ["coupon_code_present", "일일남매 쿠폰 코드 입력 여부"],
  ["coupon_valid", "일일남매 쿠폰 검증 결과"],
  ["coupon_applied", "일일남매 결제 쿠폰 적용 여부"],
  ["schedule_id", "일일남매 일정 ID"],
  ["schedule_label", "일일남매 일정 라벨"],
  ["schedule_status", "일일남매 일정 상태"],
  ["schedule_capacity_bucket", "일일남매 일정 신청률 구간"],
  ["waitlist_available", "일일남매 알림신청 가능 여부"],
  ["payment_required", "일일남매 결제 필요 여부"],
  ["result", "일일남매 이벤트 처리 결과"],
  ["error_reason", "일일남매 오류 차단 사유"],
  ["discount_label", "일일남매 할인 라벨"],
  ["in_app_browser", "일일남매 인앱 브라우저"],
  ["device_category", "기기 유형"],
  ["referrer_host", "이전 페이지 호스트"],
  ["viewport_size", "뷰포트 크기"],
  ["browser_language", "브라우저 언어"],
  ["utm_source", "UTM source"],
  ["utm_medium", "UTM medium"],
  ["utm_campaign", "UTM campaign"],
  ["utm_term", "UTM term"],
  ["utm_content", "UTM content"],
];

const CUSTOM_METRICS = [
  ["step_index", "일일남매 현재 스텝 번호", "STANDARD"],
  ["step_total", "일일남매 전체 스텝 수", "STANDARD"],
  ["step_progress_percent", "일일남매 스텝 진행률", "STANDARD"],
  ["elapsed_seconds", "일일남매 플로우 경과 초", "STANDARD"],
  ["checkout_value", "일일남매 결제 요청 금액", "STANDARD"],
  ["schedule_applicants_total", "일일남매 일정 신청자 수", "STANDARD"],
  ["schedule_remaining_total", "일일남매 일정 잔여석 수", "STANDARD"],
  ["response_status", "일일남매 제출 응답 상태", "STANDARD"],
];

function base64url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function signJwt(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: serviceAccount.client_email,
    scope: SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(
    JSON.stringify(claim)
  )}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signingInput)
    .sign(serviceAccount.private_key);
  return `${signingInput}.${base64url(signature)}`;
}

async function requestJson(url, { method = "GET", token, body } = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`${method} ${url} failed (${response.status}): ${text}`);
  }

  return payload;
}

async function getAccessToken() {
  const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, "utf8"));
  const assertion = signJwt(serviceAccount);
  const payload = await requestJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    },
  });
  return payload.access_token;
}

async function listAll(token, collectionName) {
  const items = [];
  let pageToken = "";

  do {
    const url = new URL(
      `https://analyticsadmin.googleapis.com/v1beta/properties/${PROPERTY_ID}/${collectionName}`
    );
    url.searchParams.set("pageSize", "200");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const payload = await requestJson(url, { token });
    items.push(...(payload[collectionName] || []));
    pageToken = payload.nextPageToken || "";
  } while (pageToken);

  return items;
}

async function createCustomDimension(token, [parameterName, displayName]) {
  if (DRY_RUN) {
    console.log(`DRY_RUN create dimension ${parameterName}`);
    return;
  }

  await requestJson(
    `https://analyticsadmin.googleapis.com/v1beta/properties/${PROPERTY_ID}/customDimensions`,
    {
      method: "POST",
      token,
      body: {
        parameterName,
        displayName,
        scope: "EVENT",
        description: `${displayName} - ssobig-home 일일남매 funnel reporting`,
      },
    }
  );
  console.log(`created dimension ${parameterName}`);
}

async function createCustomMetric(token, [parameterName, displayName, measurementUnit]) {
  if (DRY_RUN) {
    console.log(`DRY_RUN create metric ${parameterName}`);
    return;
  }

  await requestJson(
    `https://analyticsadmin.googleapis.com/v1beta/properties/${PROPERTY_ID}/customMetrics`,
    {
      method: "POST",
      token,
      body: {
        parameterName,
        displayName,
        scope: "EVENT",
        measurementUnit,
        description: `${displayName} - ssobig-home 일일남매 funnel reporting`,
      },
    }
  );
  console.log(`created metric ${parameterName}`);
}

async function main() {
  const token = await getAccessToken();
  const existingDimensions = await listAll(token, "customDimensions");
  const existingMetrics = await listAll(token, "customMetrics");
  const dimensionNames = new Set(existingDimensions.map((item) => item.parameterName));
  const metricNames = new Set(existingMetrics.map((item) => item.parameterName));

  const missingDimensions = CUSTOM_DIMENSIONS.filter(
    ([parameterName]) => !dimensionNames.has(parameterName)
  );
  const missingMetrics = CUSTOM_METRICS.filter(
    ([parameterName]) => !metricNames.has(parameterName)
  );
  const errors = [];

  console.log(
    JSON.stringify(
      {
        property: PROPERTY_ID,
        dryRun: DRY_RUN,
        existingDimensions: existingDimensions.length,
        missingDimensions: missingDimensions.map(([name]) => name),
        existingMetrics: existingMetrics.length,
        missingMetrics: missingMetrics.map(([name]) => name),
      },
      null,
      2
    )
  );

  for (const definition of missingDimensions) {
    try {
      await createCustomDimension(token, definition);
    } catch (error) {
      errors.push({ type: "dimension", parameterName: definition[0], error });
      console.error(`failed dimension ${definition[0]}: ${error.message}`);
    }
  }

  for (const definition of missingMetrics) {
    try {
      await createCustomMetric(token, definition);
    } catch (error) {
      errors.push({ type: "metric", parameterName: definition[0], error });
      console.error(`failed metric ${definition[0]}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          failed: errors.map((item) => ({
            type: item.type,
            parameterName: item.parameterName,
            message: item.error.message,
          })),
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
