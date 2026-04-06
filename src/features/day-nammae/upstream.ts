const DEFAULT_PUBLIC_SCHEDULES_API_URL =
  "https://ferhwwjztseoegaizsko.supabase.co/functions/v1/ssobig-meeting-manage/public/day-nammae-schedules";
const DEFAULT_COUPON_API_BASE_URL =
  "https://ferhwwjztseoegaizsko.supabase.co/functions/v1/ssobig-meeting-manage/coupon";

export function getPublicDayNammeSchedulesUrl() {
  return (
    process.env.NEXT_PUBLIC_DAY_NAMMAE_PUBLIC_SCHEDULES_API_URL?.trim() ||
    DEFAULT_PUBLIC_SCHEDULES_API_URL
  );
}

export function getDayNammeCouponApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_DAY_NAMMAE_COUPON_API_BASE_URL?.trim() ||
    DEFAULT_COUPON_API_BASE_URL
  );
}
