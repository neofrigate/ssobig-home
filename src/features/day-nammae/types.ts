import type { DayNammeAgeRange } from "./age";

export type DayNammeApplicationMode = "normal" | "waitlist_alert";

export interface ScheduleItem {
  staffScheduleId: string;
  date: string;
  title: string;
  fullLabel: string;
  applicants: {
    total: number;
    female: number;
    male: number;
  };
  maxCapacity: number;
  status: string;
  ageRange: DayNammeAgeRange;
  waitlistAvailable: {
    female: boolean;
    male: boolean;
  };
  waitlistAlerts: {
    total: number;
    female: number;
    male: number;
  };
}

export interface DayNammeFormValues {
  gender: "남" | "여" | "";
  schedule: string;
  staffScheduleId: string;
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
  requires_payment?: boolean;
  target_staff_schedule_id?: string | null;
  target_staff_schedule_ids?: string[] | null;
  target_schedule_label?: string | null;
  target_schedule_date?: string | null;
  target_schedule_time_slot?: string | null;
  target_schedules?: CouponTargetSchedule[] | null;
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
  requires_payment?: boolean;
  target_staff_schedule_id?: string | null;
  target_staff_schedule_ids?: string[] | null;
  target_schedule_label?: string | null;
  target_schedule_date?: string | null;
  target_schedule_time_slot?: string | null;
  target_schedules?: CouponTargetSchedule[] | null;
}

export interface CouponTargetSchedule {
  id?: string | null;
  staff_schedule_id?: string | null;
  label?: string | null;
  schedule_date?: string | null;
  time_slot?: string | null;
}
