export type DayNammaeEdgeRequestKind = "apply" | "waitlist_alert";

export type DayNammaeEdgeRejection = {
  status: number;
  errorCode: string;
  message: string;
};

function toRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function getTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

const EXPECTED_REJECTION_STATUSES = new Set([400, 409, 422]);

// An edge 400/409/422 with a string error code and a user-facing message is an
// expected business rejection: show the message, do not report to Sentry.
export function classifyDayNammaeEdgeRejection(
  status: number,
  edgeBody: unknown,
): DayNammaeEdgeRejection | null {
  // 401/403/404/429 point at config or infra problems, so keep reporting them.
  if (!EXPECTED_REJECTION_STATUSES.has(status)) {
    return null;
  }

  const record = toRecord(edgeBody);
  if (!record) return null;

  const errorCode =
    getTrimmedString(record.errorCode) || getTrimmedString(record.code);
  if (!errorCode) return null;

  const message =
    getTrimmedString(record.userMessage) || getTrimmedString(record.error);
  if (!message) return null;

  return { status, errorCode, message };
}

// Stable English message so Sentry groups by status, not by screen copy.
export function buildDayNammaeEdgeFailureMessage(
  status: number | null,
  kind: DayNammaeEdgeRequestKind = "apply",
) {
  const label =
    kind === "waitlist_alert"
      ? "Day Nammae waitlist alert edge request failed"
      : "Day Nammae edge request failed";

  return `${label} (status ${status ?? "unknown"})`;
}

export class DayNammaeEdgeRequestError extends Error {
  status: number | null;
  errorCode: string;

  constructor(params: {
    status: number | null;
    errorCode?: string;
    kind?: DayNammaeEdgeRequestKind;
  }) {
    super(buildDayNammaeEdgeFailureMessage(params.status, params.kind));
    this.name = "DayNammaeEdgeRequestError";
    this.status = params.status;
    this.errorCode = params.errorCode || "";
  }
}

export function createDayNammaeSupabaseError(operation: string, error: unknown) {
  const record = toRecord(error);
  const code =
    typeof record?.code === "string" || typeof record?.code === "number"
      ? String(record.code)
      : "unknown";

  const wrapped = new Error(`Supabase ${operation} failed: ${code}`, {
    cause: error,
  });
  wrapped.name = "DayNammaeSupabaseError";
  return wrapped;
}

export const DAY_NAMMAE_NON_ERROR_THROWN_MESSAGE =
  "Non-Error thrown in day nammae apply";

export function describeThrownValueType(value: unknown) {
  if (value === null) return "null";
  if (typeof value !== "object") return typeof value;

  const constructorName = (value as { constructor?: { name?: unknown } })
    .constructor?.name;
  return typeof constructorName === "string" && constructorName
    ? constructorName
    : "object";
}

// Sentry gets only the non-text fields of the edge summary; the edge message
// is user-facing copy and stays in server logs only.
export function sanitizeDayNammaeEdgeSummaryForSentry(
  summary: Record<string, unknown> | null,
) {
  if (!summary) return null;

  const sanitized: Record<string, unknown> = {};
  for (const field of [
    "bodyType",
    "errorCode",
    "retryable",
    "applicationSubmitted",
    "duplicate",
  ] as const) {
    if (field in summary) {
      sanitized[field] =
        typeof summary[field] === "string"
          ? String(summary[field]).slice(0, 100)
          : summary[field];
    }
  }
  return sanitized;
}
