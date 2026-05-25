export const DAY_NAMMAE_DEFAULT_AGE_RANGE_KEY = "20_35" as const;

export const DAY_NAMMAE_AGE_RANGE_CONFIG = {
  "20_35": { min: 20, max: 35 },
  "20_30": { min: 20, max: 30 },
  "25_35": { min: 25, max: 35 },
} as const;

export type DayNammeAgeRangeKey = keyof typeof DAY_NAMMAE_AGE_RANGE_CONFIG;

export interface DayNammeAgeRange {
  key: DayNammeAgeRangeKey;
  min: number;
  max: number;
  birthYearMin: number;
  birthYearMax: number;
  label: string;
}

export function getKstCurrentYear(referenceDate = new Date()) {
  const year = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).format(referenceDate);

  return Number.parseInt(year, 10);
}

export function normalizeDayNammeAgeRangeKey(
  value: unknown
): DayNammeAgeRangeKey {
  const key = String(value || "").trim();
  return key in DAY_NAMMAE_AGE_RANGE_CONFIG
    ? (key as DayNammeAgeRangeKey)
    : DAY_NAMMAE_DEFAULT_AGE_RANGE_KEY;
}

export function buildDayNammeAgeRange(
  value: unknown,
  options: {
    currentYear?: number;
    birthYearMin?: number | null;
    birthYearMax?: number | null;
    label?: string | null;
  } = {}
): DayNammeAgeRange {
  const key = normalizeDayNammeAgeRangeKey(value);
  const config = DAY_NAMMAE_AGE_RANGE_CONFIG[key];
  const currentYear = options.currentYear || getKstCurrentYear();
  const birthYearMin =
    typeof options.birthYearMin === "number"
      ? options.birthYearMin
      : currentYear - config.max + 1;
  const birthYearMax =
    typeof options.birthYearMax === "number"
      ? options.birthYearMax
      : currentYear - config.min + 1;

  return {
    key,
    min: config.min,
    max: config.max,
    birthYearMin,
    birthYearMax,
    label: options.label || `${config.min}~${config.max}세`,
  };
}

export function getDayNammeBirthYearsForAgeRange(ageRange: DayNammeAgeRange) {
  const years: string[] = [];
  for (let year = ageRange.birthYearMin; year <= ageRange.birthYearMax; year += 1) {
    years.push(String(year));
  }
  return years;
}

export function getDefaultDayNammeBirthYears() {
  return getDayNammeBirthYearsForAgeRange(
    buildDayNammeAgeRange(DAY_NAMMAE_DEFAULT_AGE_RANGE_KEY)
  );
}

export function isDefaultDayNammeAgeRange(ageRange: DayNammeAgeRange) {
  return ageRange.key === DAY_NAMMAE_DEFAULT_AGE_RANGE_KEY;
}

export function shouldShowDayNammeAgeRangeChip(ageRange: DayNammeAgeRange) {
  return !isDefaultDayNammeAgeRange(ageRange);
}

export function isBirthYearAllowedForAgeRange(
  birthYear: string,
  ageRange: DayNammeAgeRange
) {
  const year = Number.parseInt(birthYear, 10);
  return (
    Number.isInteger(year) &&
    year >= ageRange.birthYearMin &&
    year <= ageRange.birthYearMax
  );
}
