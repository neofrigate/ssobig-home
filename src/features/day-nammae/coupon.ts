export const DAY_NAMMAE_COUPON_CODE_PREFIX = "SSOBIG-";
export const DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH = 8;

export function normalizeDayNammeCouponCode(value: string) {
  const normalized = value.replace(/\s+/g, "").toUpperCase();

  if (normalized.startsWith(DAY_NAMMAE_COUPON_CODE_PREFIX)) {
    return normalized
      .slice(DAY_NAMMAE_COUPON_CODE_PREFIX.length)
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH);
  }

  return normalized
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH);
}

export function buildDayNammeCouponCode(suffix: string) {
  if (!suffix) {
    return "";
  }

  return `${DAY_NAMMAE_COUPON_CODE_PREFIX}${suffix}`;
}

export function getDayNammeCouponSuffixFromSearchParam(
  value: string | null | undefined
) {
  const normalized = normalizeDayNammeCouponCode(value || "");
  return normalized.length === DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH
    ? normalized
    : "";
}
