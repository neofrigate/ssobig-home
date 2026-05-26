export type PlayroomSiteLocale = "kr" | "en" | "ja" | "zh";

const SUPPORTED_SITE_LOCALES = new Set([
  "kr",
  "ko",
  "en",
  "ja",
  "jp",
  "zh",
  "cn",
  "zh-cn",
]);

export function normalizePlayroomSiteLocale(
  locale: string | null | undefined
): PlayroomSiteLocale | null {
  const normalized = String(locale || "").trim().toLowerCase();
  if (!SUPPORTED_SITE_LOCALES.has(normalized)) return null;
  if (normalized === "ko") return "kr";
  if (normalized === "jp") return "ja";
  if (normalized === "cn" || normalized === "zh-cn") return "zh";
  return normalized as PlayroomSiteLocale;
}

export function localeToTemplateLocale(locale: PlayroomSiteLocale) {
  if (locale === "kr") return "ko_kr";
  if (locale === "ja") return "ja_jp";
  if (locale === "zh") return "zh_cn";
  return "en_us";
}

export function localeToCanonicalPath(locale: PlayroomSiteLocale) {
  return `/playroom/${locale}`;
}

export function buildPlayroomDetailPath(
  locale: PlayroomSiteLocale,
  gameSettingsId: string,
) {
  return `/playroom/${locale}/${encodeURIComponent(gameSettingsId)}`;
}

export function localeToOgLocale(locale: PlayroomSiteLocale) {
  if (locale === "kr") return "ko_KR";
  if (locale === "ja") return "ja_JP";
  if (locale === "zh") return "zh_CN";
  return "en_US";
}

export function resolvePlayroomLocaleFromCountry(
  country: string | null | undefined
) {
  const normalized = String(country || "").trim().toUpperCase();
  if (normalized === "KR") return "kr" as const;
  if (normalized === "JP") return "ja" as const;
  if (["CN", "TW", "HK", "MO"].includes(normalized)) return "zh" as const;
  return "en" as const;
}

export function resolvePlayroomLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined
) {
  const normalized = String(acceptLanguage || "").toLowerCase();
  if (normalized.includes("ko")) return "kr" as const;
  if (normalized.includes("ja")) return "ja" as const;
  if (normalized.includes("zh")) return "zh" as const;
  return "en" as const;
}

export function detectPlayroomLocale(headersLike: Pick<Headers, "get">) {
  const country =
    headersLike.get("x-vercel-ip-country") ||
    headersLike.get("cf-ipcountry") ||
    headersLike.get("x-country-code");
  if (country) {
    return resolvePlayroomLocaleFromCountry(country);
  }
  return resolvePlayroomLocaleFromAcceptLanguage(
    headersLike.get("accept-language")
  );
}

export function matchesPlayroomTemplateLocale(
  siteLocale: PlayroomSiteLocale,
  templateLocale: string | null | undefined,
  localeVisibility: string | null | undefined
) {
  const normalizedTemplateLocale = String(templateLocale || "")
    .trim()
    .toLowerCase();
  const normalizedVisibility = String(localeVisibility || "")
    .trim()
    .toLowerCase();

  if (!normalizedTemplateLocale) {
    return siteLocale === "kr";
  }

  if (normalizedVisibility === "all") {
    return true;
  }

  return normalizedTemplateLocale === localeToTemplateLocale(siteLocale);
}
