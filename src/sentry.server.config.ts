import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN =
  process.env.SENTRY_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  "https://48048aa74886bdd547d8c06d056afe2a@o4505765760204800.ingest.us.sentry.io/4511094127788032";
const SENTRY_ENVIRONMENT =
  process.env.VERCEL_ENV || process.env.NODE_ENV || "development";

function getHeaderValue(
  headers: NonNullable<Sentry.Event["request"]>["headers"],
  name: string
) {
  if (!headers) {
    return undefined;
  }

  if (Array.isArray(headers)) {
    return headers.find(
      ([key]) => key.toLowerCase() === name.toLowerCase()
    )?.[1];
  }

  return headers[name] ?? headers[name.toLowerCase()];
}

function isMalformedRootServerActionProbe(event: Sentry.Event) {
  const exceptionValue = event.exception?.values?.some(
    (value) => value.value === "Unexpected end of form"
  );
  const requestUrl = event.request?.url;
  const nextAction = getHeaderValue(event.request?.headers, "next-action");

  if (!exceptionValue || !requestUrl || !nextAction) {
    return false;
  }

  try {
    return new URL(requestUrl).pathname === "/";
  } catch {
    return requestUrl === "/";
  }
}

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  maxValueLength: 1024,
  normalizeDepth: 5,
  initialScope: (scope) => {
    scope.setTag("runtime", "server");
    return scope;
  },
  beforeSend: (event) => {
    if (isMalformedRootServerActionProbe(event)) {
      return null;
    }

    return event;
  },
});
