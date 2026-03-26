const IN_APP_BROWSER_PATTERNS: Array<[string, RegExp]> = [
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
    }>;
  };
  logentry?: {
    formatted?: string;
    message?: string;
  };
  message?: string;
  tags?: Record<string, unknown>;
};

const IGNORED_FACEBOOK_WEBVIEW_ERROR_PATTERNS = [
  /enableDidUserTypeOnKeyboardLogging/i,
  /Java object is gone/i,
];

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

  return {
    tags: {
      runtime: "client",
      pathname: location.pathname,
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
    },
  };
}

export function shouldIgnoreKnownInAppBrowserError(event: SentryLikeEvent) {
  const browserName =
    typeof event.tags?.in_app_browser_name === "string"
      ? event.tags.in_app_browser_name
      : undefined;

  if (browserName !== "facebook") {
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

  return errorTexts.some((text) =>
    IGNORED_FACEBOOK_WEBVIEW_ERROR_PATTERNS.every((pattern) =>
      pattern.test(text)
    )
  );
}
