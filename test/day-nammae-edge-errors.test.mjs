import assert from "node:assert/strict";
import test from "node:test";

import {
  DAY_NAMMAE_NON_ERROR_THROWN_MESSAGE,
  DayNammaeEdgeRequestError,
  buildDayNammaeEdgeFailureMessage,
  classifyDayNammaeEdgeRejection,
  createDayNammaeSupabaseError,
  describeThrownValueType,
  sanitizeDayNammaeEdgeSummaryForSentry,
} from "../src/lib/day-nammae-edge-errors.ts";

test("4xx with errorCode and error message is an expected rejection", () => {
  assert.deepEqual(
    classifyDayNammaeEdgeRejection(409, {
      errorCode: "APPLICATION_REJECTED",
      error: " 추천인 보상 쿠폰은 발급받은 본인만 사용할 수 있습니다. ",
    }),
    {
      status: 409,
      errorCode: "APPLICATION_REJECTED",
      message: "추천인 보상 쿠폰은 발급받은 본인만 사용할 수 있습니다.",
    },
  );
});

test("userMessage wins over error and code is accepted as a fallback", () => {
  assert.deepEqual(
    classifyDayNammaeEdgeRejection(400, {
      code: "COUPON_INVALID",
      error: "raw error",
      userMessage: "쿠폰을 확인해 주세요.",
    }),
    { status: 400, errorCode: "COUPON_INVALID", message: "쿠폰을 확인해 주세요." },
  );
});

test("missing code, missing message, non-record body or 5xx is not a rejection", () => {
  assert.equal(classifyDayNammaeEdgeRejection(409, { error: "거절" }), null);
  assert.equal(classifyDayNammaeEdgeRejection(409, { errorCode: "X" }), null);
  assert.equal(
    classifyDayNammaeEdgeRejection(409, { errorCode: 123, error: "거절" }),
    null,
  );
  assert.equal(classifyDayNammaeEdgeRejection(409, { errorCode: "  ", error: "거절" }), null);
  assert.equal(classifyDayNammaeEdgeRejection(409, "거절"), null);
  assert.equal(classifyDayNammaeEdgeRejection(409, null), null);
  assert.equal(
    classifyDayNammaeEdgeRejection(502, { errorCode: "UPSTREAM", error: "실패" }),
    null,
  );
  assert.equal(
    classifyDayNammaeEdgeRejection(200, { errorCode: "OK", error: "x" }),
    null,
  );
});

test("edge failure error uses a stable English message", () => {
  assert.equal(
    buildDayNammaeEdgeFailureMessage(502),
    "Day Nammae edge request failed (status 502)",
  );
  assert.equal(
    buildDayNammaeEdgeFailureMessage(null, "waitlist_alert"),
    "Day Nammae waitlist alert edge request failed (status unknown)",
  );

  const error = new DayNammaeEdgeRequestError({ status: 500, errorCode: "BOOM" });
  assert.ok(error instanceof Error);
  assert.equal(error.name, "DayNammaeEdgeRequestError");
  assert.equal(error.message, "Day Nammae edge request failed (status 500)");
  assert.equal(error.status, 500);
  assert.equal(error.errorCode, "BOOM");
});

test("supabase errors are wrapped with an English message, code and cause", () => {
  const postgrestError = {
    message: "connection reset",
    code: "PGRST301",
    details: null,
    hint: null,
  };
  const error = createDayNammaeSupabaseError("staff_schedules lookup", postgrestError);
  assert.ok(error instanceof Error);
  assert.equal(error.name, "DayNammaeSupabaseError");
  assert.equal(error.message, "Supabase staff_schedules lookup failed: PGRST301");
  assert.equal(error.cause, postgrestError);

  assert.equal(
    createDayNammaeSupabaseError("staff_schedules lookup", {}).message,
    "Supabase staff_schedules lookup failed: unknown",
  );
});

test("non-Error thrown values are described by type only", () => {
  assert.equal(DAY_NAMMAE_NON_ERROR_THROWN_MESSAGE, "Non-Error thrown in day nammae apply");
  assert.equal(describeThrownValueType("text"), "string");
  assert.equal(describeThrownValueType(null), "null");
  assert.equal(describeThrownValueType(undefined), "undefined");
  assert.equal(describeThrownValueType({ code: "x" }), "Object");
  assert.equal(describeThrownValueType(Object.create(null)), "object");
});

test("Sentry edge summary drops the user-facing message", () => {
  assert.deepEqual(
    sanitizeDayNammaeEdgeSummaryForSentry({
      errorCode: "APPLICATION_REJECTED",
      message: "추천인 보상 쿠폰은 발급받은 본인만 사용할 수 있습니다.",
      retryable: false,
      applicationSubmitted: false,
      duplicate: false,
    }),
    {
      errorCode: "APPLICATION_REJECTED",
      retryable: false,
      applicationSubmitted: false,
      duplicate: false,
    },
  );
  assert.deepEqual(
    sanitizeDayNammaeEdgeSummaryForSentry({ bodyType: "string", message: "<html>" }),
    { bodyType: "string" },
  );
  assert.equal(sanitizeDayNammaeEdgeSummaryForSentry(null), null);
});

test("auth, missing route and rate-limit 4xx stay reportable", () => {
  for (const status of [401, 403, 404, 429]) {
    assert.equal(
      classifyDayNammaeEdgeRejection(status, { errorCode: "X", error: "거절" }),
      null,
    );
  }
  assert.deepEqual(
    classifyDayNammaeEdgeRejection(422, { errorCode: "X", userMessage: "확인" }),
    { status: 422, errorCode: "X", message: "확인" },
  );
});
