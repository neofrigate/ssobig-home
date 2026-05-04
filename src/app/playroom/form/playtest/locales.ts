export type PlaytestLocale = "ko" | "en";

const SUPPORTED_LOCALES = new Set(["ko", "kr", "en"]);

export function normalizePlaytestLocale(locale: string) {
  const normalized = locale.trim().toLowerCase();
  if (!SUPPORTED_LOCALES.has(normalized)) return null;
  return normalized === "kr" ? "ko" : (normalized as PlaytestLocale);
}
