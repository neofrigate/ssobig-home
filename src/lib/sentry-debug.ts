const IN_APP_BROWSER_PATTERNS: Array<[string, RegExp]> = [
  ["threads", /\b(?:Barcelona|Threads)\b/i],
  ["instagram", /Instagram/i],
  ["facebook", /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i],
  ["kakao", /KAKAOTALK/i],
  ["naver", /NAVER/i],
  ["line", /Line\//i],
];

type SentryLikeEvent = {
  exception?: {
    values?: Array<{
      type?: string;
      value?: string;
      stacktrace?: {
        frames?: Array<{
          filename?: string;
          function?: string;
        }>;
      };
    }>;
  };
  logentry?: {
    formatted?: string;
    message?: string;
  };
  message?: string;
  tags?: Record<string, unknown>;
  extra?: Record<string, unknown>;
  contexts?: Record<string, unknown>;
  request?: {
    url?: string;
  };
};

const KNOWN_META_WEBVIEW_ERROR_PATTERNS = [
  /enableDidUserTypeOnKeyboardLogging/i,
  /Java object is gone/i,
];
const KNOWN_META_WEBKIT_BRIDGE_ERROR_PATTERNS = [
  /window\.webkit\.messageHandlers/i,
];
const META_ANDROID_NAVIGATION_LOGGER_FILENAME =
  "app://navigation_performance_logger_android";
const META_ANDROID_POST_MESSAGE_ERROR =
  "Error invoking postMessage: Java exception was raised during method invocation";
const KNOWN_META_WEBVIEW_NAMES = new Set(["facebook", "instagram"]);
// Meta's in-app browsers inject a script that reads window._META.IABInnerFrame
// (SSOBIG-HOME-36). Our code never touches _META, so match only the exact
// engine messages for that read: WebKit names the expression, V8 the property.
const META_IAB_INNER_FRAME_ERROR_MESSAGES = new Set([
  "undefined is not an object (evaluating 'window._META.IABInnerFrame')",
  "Cannot read properties of undefined (reading 'IABInnerFrame')",
]);
const META_IAB_INNER_FRAME_BROWSER_NAMES = new Set([
  "facebook",
  "instagram",
  "threads",
]);
const KNOWN_PATHNAME_REDIRECTS: Record<string, string> = {
  "/offline/11namme에": "/offline/11namme",
};
const IOS_WEBKIT_USER_AGENT_PATTERN = /(iPhone|iPad|iPod).*AppleWebKit/i;

function normalizeKnownSsobigPathname(pathname: string): string | undefined {
  return KNOWN_PATHNAME_REDIRECTS[pathname];
}

function parseHostname(value: string): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value).hostname;
  } catch {
    return undefined;
  }
}

function getInAppBrowserName(userAgent: string): string | undefined {
  for (const [name, pattern] of IN_APP_BROWSER_PATTERNS) {
    if (pattern.test(userAgent)) {
      return name;
    }
  }

  return undefined;
}

function getBrowserContextUserAgent(event: SentryLikeEvent): string | undefined {
  const browserContext = event.contexts?.browserContext;

  if (!browserContext || typeof browserContext !== "object") {
    return undefined;
  }

  const userAgent = (browserContext as { userAgent?: unknown }).userAgent;

  return typeof userAgent === "string" ? userAgent : undefined;
}

export function getClientSentryDebugContext() {
  if (typeof window === "undefined") {
    return {
      tags: { runtime: "client" },
      contexts: {},
      extra: {},
    };
  }

  const { location, navigator, document } = window;
  const userAgent = navigator.userAgent;
  const searchParams = location.search
    ? new URLSearchParams(location.search)
    : null;
  const inAppBrowser = getInAppBrowserName(userAgent);
  const normalizedPathname = normalizeKnownSsobigPathname(location.pathname);

  return {
    tags: {
      runtime: "client",
      pathname: location.pathname,
      ...(normalizedPathname
        ? {
            pathname_normalized_candidate: normalizedPathname,
            pathname_needs_redirect: "true",
          }
        : {}),
      in_app_browser: inAppBrowser ? "true" : "false",
      ...(inAppBrowser ? { in_app_browser_name: inAppBrowser } : {}),
      ...(searchParams?.get("utm_source")
        ? { utm_source: searchParams.get("utm_source") as string }
        : {}),
      ...(searchParams?.get("utm_medium")
        ? { utm_medium: searchParams.get("utm_medium") as string }
        : {}),
      ...(searchParams?.get("utm_content")
        ? { utm_content: searchParams.get("utm_content") as string }
        : {}),
      has_fbclid: searchParams?.has("fbclid") ? "true" : "false",
    },
    contexts: {
      app: {
        route: location.pathname,
        normalizedRoute: normalizedPathname,
        search: {
          hasUtmSource: searchParams?.has("utm_source") ?? false,
          hasUtmMedium: searchParams?.has("utm_medium") ?? false,
          hasUtmContent: searchParams?.has("utm_content") ?? false,
          hasFbclid: searchParams?.has("fbclid") ?? false,
        },
      },
      browserContext: {
        userAgent,
        language: navigator.language,
        referrerHost: parseHostname(document.referrer),
      },
    },
    extra: {
      url: location.href,
      referrer: document.referrer || undefined,
      normalizedPathnameCandidate: normalizedPathname,
    },
  };
}

export function shouldIgnoreKnownInAppBrowserError(event: SentryLikeEvent) {
  const browserName =
    typeof event.tags?.in_app_browser_name === "string"
      ? event.tags.in_app_browser_name
      : undefined;

  if (
    browserName &&
    META_IAB_INNER_FRAME_BROWSER_NAMES.has(browserName) &&
    (event.exception?.values ?? []).some(
      (value) =>
        value.type === "TypeError" &&
        typeof value.value === "string" &&
        META_IAB_INNER_FRAME_ERROR_MESSAGES.has(value.value.trim())
    )
  ) {
    return true;
  }

  // Threads uses the Barcelona UA marker. Limit its filter to the observed
  // iOS bridge exception; do not inherit the other Meta browser filters.
  if (browserName === "threads") {
    const userAgent = getBrowserContextUserAgent(event);
    return (
      typeof userAgent === "string" &&
      IOS_WEBKIT_USER_AGENT_PATTERN.test(userAgent) &&
      (event.exception?.values ?? []).some(
        (value) =>
          value.type === "TypeError" &&
          value.value ===
            "undefined is not an object (evaluating 'window.webkit.messageHandlers')"
      )
    );
  }

  if (!browserName || !KNOWN_META_WEBVIEW_NAMES.has(browserName)) {
    return false;
  }

  const errorTexts = [
    event.message,
    event.logentry?.formatted,
    event.logentry?.message,
    ...(event.exception?.values ?? []).flatMap((value) => [
      value.type,
      value.value,
    ]),
  ].filter((value): value is string => Boolean(value));

  const userAgent = getBrowserContextUserAgent(event);
  // Meta iOS IAB can emit WKWebView bridge noise for messageHandlers even when
  // our app code never touches that API; keep this filter narrow to that case.
  const isIosMetaWebkitBridgeNoise =
    typeof userAgent === "string" &&
    IOS_WEBKIT_USER_AGENT_PATTERN.test(userAgent) &&
    errorTexts.some((text) =>
      KNOWN_META_WEBKIT_BRIDGE_ERROR_PATTERNS.some((pattern) =>
        pattern.test(text)
      )
    );

  // Meta's Android IAB injects this navigation logger. Ignore only its exact
  // native bridge failure so similarly worded errors from our code stay visible.
  const isAndroidMetaNavigationLoggerNoise =
    errorTexts.some(
      (text) => text.trim() === META_ANDROID_POST_MESSAGE_ERROR
    ) &&
    (event.exception?.values ?? []).some((value) =>
      value.stacktrace?.frames?.some(
        (frame) =>
          frame.filename === META_ANDROID_NAVIGATION_LOGGER_FILENAME
      )
    );

  return (
    isIosMetaWebkitBridgeNoise ||
    isAndroidMetaNavigationLoggerNoise ||
    errorTexts.some((text) =>
      KNOWN_META_WEBVIEW_ERROR_PATTERNS.some((pattern) => pattern.test(text))
    )
  );
}

// iOS browsers (observed: Whale) inject an autofill script that walks every
// frame looking for password fields and trips over sandboxed iframes
// (SSOBIG-HOME-2H, 2J). Its frames carry these function names.
const AUTOFILL_SANDBOX_ERROR_PREFIX = "Sandbox access violation";
const AUTOFILL_INJECTED_FUNCTION_PATTERN =
  /^(hasPasswordField_|extractFormsAndFormElements_)$/;
// Browser/extension messages that our code never produces. Ignore them only
// when no frame comes from our Next.js bundle (SSOBIG-HOME-2R, 2V).
const THIRD_PARTY_ONLY_ERROR_MESSAGES = new Set([
  "Could not establish connection. Receiving end does not exist.",
  "callback `timer callback` was terminated",
]);
// Microsoft Outlook SafeLinks crawler rejects with this object (SSOBIG-HOME-2X).
const OUTLOOK_SAFELINKS_REJECTION_PATTERN =
  /Object Not Found Matching Id:\d+, MethodName:\w+, ParamCount:\d+/;
const OUR_BUNDLE_PATH_SEGMENT = "/_next/";

function hasOurBundleFrame(event: SentryLikeEvent) {
  return (event.exception?.values ?? []).some((value) =>
    value.stacktrace?.frames?.some(
      (frame) =>
        typeof frame.filename === "string" &&
        frame.filename.includes(OUR_BUNDLE_PATH_SEGMENT)
    )
  );
}

export function shouldIgnoreKnownThirdPartyError(event: SentryLikeEvent) {
  const exceptionValues = event.exception?.values ?? [];

  const isAutofillSandboxNoise = exceptionValues.some(
    (value) =>
      value.type === "SecurityError" &&
      typeof value.value === "string" &&
      value.value.startsWith(AUTOFILL_SANDBOX_ERROR_PREFIX) &&
      (value.stacktrace?.frames ?? []).some(
        (frame) =>
          typeof frame.function === "string" &&
          AUTOFILL_INJECTED_FUNCTION_PATTERN.test(frame.function)
      )
  );

  if (isAutofillSandboxNoise) {
    return true;
  }

  const isOutlookSafeLinksNoise = [
    event.message,
    ...exceptionValues.map((value) => value.value),
  ].some(
    (text) =>
      typeof text === "string" && OUTLOOK_SAFELINKS_REJECTION_PATTERN.test(text)
  );

  if (isOutlookSafeLinksNoise) {
    return true;
  }

  return (
    exceptionValues.some(
      (value) =>
        typeof value.value === "string" &&
        THIRD_PARTY_ONLY_ERROR_MESSAGES.has(value.value.trim())
    ) && !hasOurBundleFrame(event)
  );
}

export function getHydrationDebugContext(event: SentryLikeEvent) {
  const errorTexts = [
    event.message,
    event.logentry?.formatted,
    event.logentry?.message,
    ...(event.exception?.values ?? []).flatMap((value) => [
      value.type,
      value.value,
    ]),
  ].filter((value): value is string => Boolean(value));

  const isHydrationError = errorTexts.some(
    (text) =>
      /hydration error/i.test(text) ||
      /hydration failed/i.test(text) ||
      /server rendered html didn't match the client/i.test(text)
  );

  if (!isHydrationError) {
    return null;
  }

  const eventPathname =
    typeof event.tags?.pathname === "string"
      ? event.tags.pathname
      : undefined;
  const eventUrl =
    typeof event.extra?.url === "string"
      ? event.extra.url
      : typeof event.request?.url === "string"
        ? event.request.url
        : undefined;

  let pathnameFromUrl: string | undefined;
  if (eventUrl) {
    try {
      pathnameFromUrl = new URL(eventUrl).pathname;
    } catch {
      pathnameFromUrl = undefined;
    }
  }

  const observedPathname = eventPathname || pathnameFromUrl;
  const normalizedPathname = observedPathname
    ? normalizeKnownSsobigPathname(observedPathname)
    : undefined;

  return {
    tags: {
      ssobig_issue_kind: "hydration",
      ...(normalizedPathname
        ? {
            pathname_normalized_candidate: normalizedPathname,
            pathname_needs_redirect: "true",
          }
        : {}),
    },
    extra: {
      hydrationObservedPathname: observedPathname,
      hydrationObservedUrl: eventUrl,
      hydrationNormalizedPathnameCandidate: normalizedPathname,
    },
  };
}
