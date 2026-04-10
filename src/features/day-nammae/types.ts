export type DayNammeApplicationMode = "normal" | "waitlist";

export interface ScheduleItem {
  date: string;
  title: string;
  applicants: {
    total: number;
    female: number;
    male: number;
  };
  maxCapacity: number;
  status: string;
  waitlistAvailableFemale: boolean;
  waitlistAvailableMale: boolean;
}

export interface DayNammeFormValues {
  gender: "남" | "여" | "";
  schedule: string;
  name: string;
  birthYear: string;
  height: string;
  phone: string;
  traits: string;
  photo: File | null;
  hasCoupon: boolean | null;
  couponCode: string;
}

export interface CouponValidationResult {
  valid: true;
  id: number;
  code: string;
  discount_type?: string;
  discount_value?: number;
  discount_label?: string;
  discount_link?: string | null;
  normal_link?: string | null;
  expires_at?: string;
}

export interface CouponUseResult {
  success: true;
  id: number;
  code: string;
  discount_type?: string;
  discount_value?: number;
  discount_label?: string;
  discount_link?: string | null;
  normal_link?: string | null;
}
