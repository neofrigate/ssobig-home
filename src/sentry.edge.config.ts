import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN =
  process.env.SENTRY_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  "https://48048aa74886bdd547d8c06d056afe2a@o4505765760204800.ingest.us.sentry.io/4511094127788032";
const SENTRY_ENVIRONMENT =
  process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
// Local dev events stay out of the shared project unless explicitly enabled.
const SENTRY_ENABLED =
  SENTRY_ENVIRONMENT !== "development" ||
  process.env.SENTRY_ENABLE_DEV === "1" ||
  process.env.NEXT_PUBLIC_SENTRY_ENABLE_DEV === "1";

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: SENTRY_ENABLED,
  environment: SENTRY_ENVIRONMENT,
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  maxValueLength: 1024,
  normalizeDepth: 5,
  initialScope: (scope) => {
    scope.setTag("runtime", "edge");
    return scope;
  },
});
