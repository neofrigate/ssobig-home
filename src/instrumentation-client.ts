import * as Sentry from "@sentry/nextjs";
import {
  getClientSentryDebugContext,
  getHydrationDebugContext,
  shouldIgnoreKnownInAppBrowserError,
  shouldIgnoreSavedPageLinkLoadError,
} from "@/lib/sentry-debug";

const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  "https://48048aa74886bdd547d8c06d056afe2a@o4505765760204800.ingest.us.sentry.io/4511094127788032";
const SENTRY_ENVIRONMENT =
  process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || "development";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
  maxValueLength: 1024,
  normalizeDepth: 5,
  initialScope: (scope) => {
    scope.setTag("runtime", "client");
    return scope;
  },
  beforeBreadcrumb: (breadcrumb) => {
    if (breadcrumb.category === "console" && breadcrumb.level === "log") {
      return null;
    }

    return breadcrumb;
  },
  beforeSend: (event) => {
    const debugContext = getClientSentryDebugContext();
    const hydrationDebugContext = getHydrationDebugContext(event);

    event.tags = {
      ...debugContext.tags,
      ...hydrationDebugContext?.tags,
      ...event.tags,
    };
    event.contexts = {
      ...event.contexts,
      ...debugContext.contexts,
    };
    event.extra = {
      ...debugContext.extra,
      ...hydrationDebugContext?.extra,
      ...event.extra,
    };

    if (
      shouldIgnoreSavedPageLinkLoadError(event) ||
      shouldIgnoreKnownInAppBrowserError(event)
    ) {
      return null;
    }

    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
