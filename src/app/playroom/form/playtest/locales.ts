export type PlaytestLocale = "ko" | "en" | "ja" | "zh";

const SUPPORTED_LOCALES = new Set(["ko", "kr", "en", "ja", "jp", "zh", "cn", "zh-cn"]);

export function normalizePlaytestLocale(locale: string) {
  const normalized = locale.trim().toLowerCase();
  if (!SUPPORTED_LOCALES.has(normalized)) return null;
  if (normalized === "kr") return "ko";
  if (normalized === "jp") return "ja";
  if (normalized === "cn" || normalized === "zh-cn") return "zh";
  return normalized as PlaytestLocale;
}
