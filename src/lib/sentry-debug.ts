const IN_APP_BROWSER_PATTERNS: Array<[string, RegExp]> = [
  ["instagram", /Instagram/i],
  ["facebook", /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i],
  ["kakao", /KAKAOTALK/i],
  ["naver", /NAVER/i],
  ["line", /Line\//i],
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
