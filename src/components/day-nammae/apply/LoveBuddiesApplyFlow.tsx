"use client";

import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  buildDayNammeCouponCode,
  DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH,
  normalizeDayNammeCouponCode,
} from "@/features/day-nammae/coupon";
import {
  DAY_NAMMAE_FREE_COUPON_NOTICE_SECTION,
  DAY_NAMMAE_NOTICE_SECTIONS,
} from "@/features/day-nammae/constants";
import {
  getDayNammeBirthYearsForSchedule,
  isDayNammeBirthYearAllowed,
  getDayNammeScheduleApplicationMode,
  getDayNammeScheduleLabel,
  isDayNammeScheduleSelectable,
} from "@/features/day-nammae/schedule";
import { getDayNammeCouponApiBaseUrl } from "@/features/day-nammae/upstream";
import {
  CouponUseResult,
  CouponValidationResult,
  DayNammeApplicationMode,
  DayNammeFormValues,
  ScheduleItem,
} from "@/features/day-nammae/types";
import {
  buildDayNammaeMetaEventId,
  trackDayNammaeMetaStandardEvent,
} from "@/utils/metaPixel";
import { trackGAEvent } from "@/utils/gtag";
import { getSafeSearchParams } from "@/utils/utm";
import ApplyStepShell from "./ApplyStepShell";
import StepAgreement from "./steps/StepAgreement";
import StepCouponChoice from "./steps/StepCouponChoice";
import StepCouponCode from "./steps/StepCouponCode";
import StepGender from "./steps/StepGender";
import StepPhoto from "./steps/StepPhoto";
import StepProfile from "./steps/StepProfile";
import StepSchedule from "./steps/StepSchedule";
import StepWaitlistContact from "./steps/StepWaitlistContact";

function trackEvent(eventName: string, params?: Record<string, unknown>) {
  void eventName;
  void params;
}

function toAnalyticsBoolean(value: boolean | null) {
  if (value === null) {
    return "unset";
  }

  return value ? "true" : "false";
}

function getStepAnalyticsName(stepKey: FlowStepKey) {
  switch (stepKey) {
    case "gender":
      return "성별 선택";
    case "schedule":
      return "일정 선택";
    case "waitlist_contact":
      return "알림 신청 연락처";
    case "coupon_choice":
      return "쿠폰 사용 여부";
    case "coupon_code":
      return "쿠폰 확인";
    case "free_coupon_notice":
      return "무료초대 안내 동의";
    case "profile":
      return "프로필 입력";
    case "photo":
      return "사진 업로드";
    case "approval":
      return "참가 승인 안내 동의";
    case "marketing":
      return "마케팅 정보 수신 동의";
    case "notice":
      return "유의사항 동의";
    default:
      return "알 수 없음";
  }
}

function getScheduleAnalyticsParams(schedule: ScheduleItem | null) {
  if (!schedule) {
    return {
      schedule_id: "unselected",
      schedule_label: "unselected",
      schedule_status: "unselected",
      schedule_capacity_bucket: "unselected",
      waitlist_available: "unset",
      schedule_applicants_total: 0,
      schedule_remaining_total: 0,
    };
  }

  const remainingTotal = Math.max(
    0,
    schedule.maxCapacity - schedule.applicants.total
  );
  const capacityRatio =
    schedule.maxCapacity > 0 ? schedule.applicants.total / schedule.maxCapacity : 0;
  const scheduleCapacityBucket =
    schedule.status === "전체마감"
      ? "closed"
      : capacityRatio >= 0.9
        ? "90_100"
        : capacityRatio >= 0.75
          ? "75_90"
          : capacityRatio >= 0.5
            ? "50_75"
            : "under_50";

  return {
    schedule_id: schedule.staffScheduleId || "unknown",
    schedule_label: getDayNammeScheduleLabel(schedule),
    schedule_status: schedule.status || "unknown",
    schedule_capacity_bucket: scheduleCapacityBucket,
    waitlist_available:
      schedule.waitlistAvailable.female || schedule.waitlistAvailable.male
        ? "true"
        : "false",
    schedule_applicants_total: schedule.applicants.total,
    schedule_remaining_total: remainingTotal,
  };
}

function getAgreementStepKey(index: number): FlowStepKey {
  return index === 0 ? "approval" : index === 1 ? "marketing" : "notice";
}

function getBlockingReason(stepKey: FlowStepKey) {
  switch (stepKey) {
    case "gender":
      return "missing_gender";
    case "schedule":
      return "missing_or_unconfirmed_schedule";
    case "waitlist_contact":
      return "missing_waitlist_contact";
    case "coupon_choice":
      return "missing_coupon_choice";
    case "coupon_code":
      return "coupon_not_validated";
    case "free_coupon_notice":
      return "free_coupon_notice_required";
    case "profile":
      return "missing_profile_fields";
    case "photo":
      return "missing_or_processing_photo";
    case "approval":
      return "approval_required";
    case "marketing":
      return "marketing_required";
    case "notice":
      return "notice_required";
    default:
      return "unknown";
  }
}

type ApplyFlowMode = "modal" | "page";
type CouponValidationStatus = "idle" | "validating" | "valid" | "invalid";

interface LoveBuddiesApplyFlowProps {
  mode: ApplyFlowMode;
  scheduleData: ScheduleItem[];
  isLoadingSchedules: boolean;
  initialCouponCode?: string;
  onClose?: () => void;
}

interface CheckoutState {
  url: string;
  buttonLabel: string;
  value: number;
  originalPrice: number;
  finalPrice: number;
  couponLabel: string;
  isDiscounted: boolean;
  metaCheckoutEventId: string;
}

interface SubmitState {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  checkout: CheckoutState | null;
  applicationSubmitted: boolean;
  applicationMode: DayNammeApplicationMode | null;
}

interface SubmitResponseMeta {
  requestId: string;
  clientRequestId: string;
  userMessage: string;
  responseStatus: number;
  responseContentType: string;
  responseTextSnippet: string;
  responseUrl: string;
  parseError: string;
}

type SubmitFailureKind = "abort" | "timeout" | "network" | "unknown";

interface SubmitTransportContext {
  attemptCount: number;
  attemptDurationMs: number;
  failureKind: SubmitFailureKind;
  errorName: string;
  errorMessage: string;
  retryAttempted: boolean;
  retryEligible: boolean;
  inAppBrowserName: string;
  onLine: string;
  visibilityState: string;
  connectionType: string;
  connectionEffectiveType: string;
  connectionRtt: string;
  connectionDownlink: string;
  connectionSaveData: string;
}

type FlowStepKey =
  | "gender"
  | "schedule"
  | "waitlist_contact"
  | "coupon_choice"
  | "coupon_code"
  | "free_coupon_notice"
  | "profile"
  | "photo"
  | "approval"
  | "marketing"
  | "notice";

type CouponScheduleLookupResult = Partial<CouponValidationResult> & {
  valid?: boolean;
  reason?: string;
};

const WAITLIST_ALERT_FLOW_STEPS: FlowStepKey[] = [
  "gender",
  "schedule",
  "waitlist_contact",
];

function getNormalFlowSteps(
  hasCoupon: boolean | null,
  isFreeCoupon: boolean,
  isScheduleLimitedCouponMode: boolean,
  shouldShowCouponChoiceStep: boolean
): FlowStepKey[] {
  if (hasCoupon === true && isScheduleLimitedCouponMode) {
    return [
      "gender",
      "coupon_code",
      "schedule",
      ...(isFreeCoupon ? ["free_coupon_notice" as const] : []),
      "profile",
      "photo",
      "approval",
      "marketing",
      "notice",
    ];
  }

  return [
    "gender",
    "schedule",
    ...(shouldShowCouponChoiceStep ? ["coupon_choice" as const] : []),
    ...(hasCoupon === true ? ["coupon_code" as const] : []),
    ...(hasCoupon === true && isFreeCoupon
      ? ["free_coupon_notice" as const]
      : []),
    "profile",
    "photo",
    "approval",
    "marketing",
    "notice",
  ];
}

function getCouponTargetScheduleIds(
  coupon?: Partial<CouponValidationResult> | null
) {
  const ids = new Set<string>();

  if (typeof coupon?.target_staff_schedule_id === "string") {
    const id = coupon.target_staff_schedule_id.trim();
    if (id) ids.add(id);
  }

  if (Array.isArray(coupon?.target_staff_schedule_ids)) {
    coupon.target_staff_schedule_ids.forEach((rawId) => {
      const id = typeof rawId === "string" ? rawId.trim() : "";
      if (id) ids.add(id);
    });
  }

  if (Array.isArray(coupon?.target_schedules)) {
    coupon.target_schedules.forEach((schedule) => {
      const id = String(schedule?.staff_schedule_id || schedule?.id || "").trim();
      if (id) ids.add(id);
    });
  }

  return [...ids];
}

function getCouponTargetScheduleLabel(
  coupon?: Partial<CouponValidationResult> | null
) {
  if (typeof coupon?.target_schedule_label === "string") {
    const label = coupon.target_schedule_label.trim();
    if (label) return label;
  }

  if (Array.isArray(coupon?.target_schedules)) {
    return coupon.target_schedules
      .map((schedule) => String(schedule?.label || "").trim())
      .filter(Boolean)
      .join(", ");
  }

  return "";
}
const MAX_PHOTO_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_PHOTO_FILE_SIZE_LABEL = "4MB";
const MAX_PHOTO_DIMENSION = 1600;
const IN_APP_BROWSER_UPLOAD_MAX_FILE_SIZE_BYTES = 1536 * 1024;
const IN_APP_BROWSER_UPLOAD_MAX_FILE_SIZE_LABEL = "1.5MB";
const IN_APP_BROWSER_MAX_PHOTO_DIMENSION = 1280;
const INITIAL_PHOTO_JPEG_QUALITY = 0.82;
const MIN_PHOTO_JPEG_QUALITY = 0.56;
const SUBMIT_NETWORK_RETRY_DELAY_MS = 700;
const SUBMIT_IN_APP_BROWSER_NETWORK_RETRY_WINDOW_MS = 10000;
const SUBMIT_RETRYABLE_HTTP_STATUSES = new Set([500, 502, 503, 504]);
const HEIC_HEIF_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const HEIC_HEIF_FILE_PATTERN = /\.(heic|heif)$/i;
const IN_APP_BROWSER_PATTERNS: Array<[string, RegExp]> = [
  ["instagram", /Instagram/i],
  ["facebook", /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i],
  ["kakao", /KAKAOTALK/i],
  ["naver", /NAVER/i],
  ["line", /Line\//i],
];
const BASE_PRICE = 35000;
const DEFAULT_NORMAL_BOOKING_URL =
  "https://booking.naver.com/booking/12/bizes/1378688/items/6629371";
const DEFAULT_TEN_PERCENT_BOOKING_URL =
  "https://booking.naver.com/booking/12/bizes/1378688/items/7553785";
const DEFAULT_THIRTY_PERCENT_BOOKING_URL =
  "https://booking.naver.com/booking/12/bizes/1378688/items/7577876";
const DEFAULT_FIFTY_PERCENT_BOOKING_URL =
  "https://booking.naver.com/booking/12/bizes/1378688/items/7553757";
const DEFAULT_SUBMIT_ERROR_MESSAGE =
  "신청서 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 채널톡으로 문의해주세요.";
const DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE =
  "쿠폰 검증 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
const DEFAULT_COUPON_USE_ERROR_MESSAGE =
  "신청서는 접수되었지만 쿠폰 처리에 실패했습니다. 쿠폰 코드를 다시 확인하거나 잠시 후 다시 시도해주세요. 문제가 계속되면 채널톡으로 문의해주세요.";
const DEFAULT_WAITLIST_SUBMIT_SUCCESS_MESSAGE =
  "알림신청이 완료되었습니다. 신청 가능한 자리가 생기면 다시 안내드릴게요.";
const COUPON_VALIDATE_DELAY_MS = 700;

const INITIAL_FORM_VALUES: DayNammeFormValues = {
  gender: "",
  schedule: "",
  staffScheduleId: "",
  name: "",
  birthYear: "",
  height: "",
  phone: "",
  traits: "",
  acquisitionChannel: "",
  acquisitionChannelOther: "",
  photo: null,
  hasCoupon: null,
  couponCode: "",
};

function createInitialFormValues(initialCouponCode = ""): DayNammeFormValues {
  if (!initialCouponCode) {
    return { ...INITIAL_FORM_VALUES, hasCoupon: false };
  }

  return {
    ...INITIAL_FORM_VALUES,
    hasCoupon: true,
    couponCode: initialCouponCode,
  };
}

const INITIAL_SUBMIT_STATE: SubmitState = {
  status: "idle",
  message: "",
  checkout: null,
  applicationSubmitted: false,
  applicationMode: null,
};

interface WaitlistConfirmModalProps {
  scheduleLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

function WaitlistConfirmModal({
  scheduleLabel,
  onClose,
  onConfirm,
}: WaitlistConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label="알림신청 안내 닫기"
      />
      <div className="relative w-full max-w-[380px] rounded-[28px] bg-[#171113] px-6 py-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/60"
          aria-label="알림신청 안내 닫기"
        >
          ×
        </button>
        <div className="inline-flex rounded-full bg-[#F6C66A]/15 px-4 py-1 text-xs font-semibold tracking-[0.16em] text-[#FFE2A4]">
          ALERT
        </div>
        <h2 className="mt-4 text-2xl font-black text-white">
          알림신청으로 접수할게요
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/75">
          선택하신 일정은 지금 마감된 회차입니다.
        </p>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left">
          <p className="text-sm font-semibold text-white">{scheduleLabel}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/68">
            이름과 전화번호만 먼저 남겨두시면, 다른 분 취소로 신청 가능한 자리가 생겼을 때 신청 링크를 다시 보내드립니다.
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-white/65"
          >
            다른 일정 보기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-[#F6C66A] text-sm font-bold text-[#1E1405]"
          >
            알림신청 진행
          </button>
        </div>
      </div>
    </div>
  );
}

const STEP_CONFIG: Record<
  FlowStepKey,
  { title: string; description: string }
> = {
  gender: {
    title: "성별을 선택해주세요",
    description: "해당 성별 기준으로 일정 마감 여부가 달라집니다.",
  },
  schedule: {
    title: "일정을 선택해주세요",
    description: "참여하고 싶은 일정을 골라주세요.",
  },
  waitlist_contact: {
    title: "알림신청 정보를 입력해주세요",
    description: "이름과 전화번호만 남겨두시면 신청 가능한 자리가 생겼을 때 다시 안내드립니다.",
  },
  coupon_choice: {
    title: "쿠폰이 있으신가요?",
    description: "쿠폰이 있다면 결제 전에 할인 여부를 확인해드릴게요.",
  },
  coupon_code: {
    title: "쿠폰 번호를 입력해주세요",
    description: "쿠폰 확인이 완료되면 할인 결제 링크로 안내됩니다.",
  },
  free_coupon_notice: {
    title: "무료초대 안내를 확인해주세요",
    description: "무료 초대권 신청 전 노쇼 및 불참 고지 기준을 확인합니다.",
  },
  profile: {
    title: "신청서를 작성해주세요",
    description: "프로필 정보를 입력해주세요.",
  },
  photo: {
    title: "사진을 등록해주세요",
    description: "본인의 매력이 잘 드러나는 사진 한 장을 올려주세요.",
  },
  approval: {
    title: "승인 기준을 확인해주세요",
    description: "신청 전 꼭 확인해야 하는 내용이에요.",
  },
  marketing: {
    title: "마케팅 동의를 확인해주세요",
    description: "촬영 및 콘텐츠 활용에 대한 안내예요.",
  },
  notice: {
    title: "주의 사항을 확인해주세요",
    description: "참여 전 꼭 알아두셔야 할 사항이에요.",
  },
};

function buildSubmitErrorMessage(supportCode?: string) {
  if (!supportCode) {
    return DEFAULT_SUBMIT_ERROR_MESSAGE;
  }

  return `${DEFAULT_SUBMIT_ERROR_MESSAGE} 문의 코드: ${supportCode}`;
}

function buildCouponUseErrorMessage(reason = "") {
  if (!reason) {
    return DEFAULT_COUPON_USE_ERROR_MESSAGE;
  }

  return `${DEFAULT_COUPON_USE_ERROR_MESSAGE} 사유: ${reason}`;
}

function createRandomIdSuffix() {
  const fallbackSuffix = Math.random().toString(36).slice(2, 10);

  try {
    const cryptoObject = globalThis.crypto;
    if (typeof cryptoObject?.randomUUID === "function") {
      return cryptoObject.randomUUID().slice(0, 8);
    }

    if (typeof cryptoObject?.getRandomValues === "function") {
      const bytes = cryptoObject.getRandomValues(new Uint8Array(4));
      return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    return fallbackSuffix;
  }

  return fallbackSuffix;
}

function createClientRequestId() {
  return `cdn-${Date.now()}-${createRandomIdSuffix()}`;
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length !== 2) {
    return "";
  }

  return parts.pop()?.split(";").shift()?.trim() || "";
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getInAppBrowserName(userAgent: string) {
  for (const [name, pattern] of IN_APP_BROWSER_PATTERNS) {
    if (pattern.test(userAgent)) {
      return name;
    }
  }

  return "";
}

function getCurrentInAppBrowserName() {
  if (typeof window === "undefined") {
    return "";
  }

  return getInAppBrowserName(window.navigator.userAgent);
}

function getInAppBrowserLabel(inAppBrowserName: string) {
  switch (inAppBrowserName) {
    case "instagram":
      return "인스타그램";
    case "facebook":
      return "페이스북";
    case "kakao":
      return "카카오톡";
    case "naver":
      return "네이버";
    case "line":
      return "라인";
    default:
      return "앱 내";
  }
}

function buildTransportFailureMessage(
  supportCode: string,
  failureKind: SubmitFailureKind,
  inAppBrowserName: string
) {
  const guidance = inAppBrowserName
    ? `${getInAppBrowserLabel(inAppBrowserName)} 앱 안 브라우저에서는 사진 업로드가 중간에 끊길 수 있어요. 우측 상단 메뉴에서 외부 브라우저로 열어 다시 시도해주세요.`
    : "";

  if (failureKind === "abort") {
    return [
      "제출 요청이 중간에 중단되었습니다.",
      guidance,
      supportCode ? `문의 코드: ${supportCode}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (failureKind === "network" || failureKind === "timeout") {
    return [
      "네트워크 연결 문제로 제출을 완료하지 못했습니다.",
      guidance,
      supportCode ? `문의 코드: ${supportCode}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    DEFAULT_SUBMIT_ERROR_MESSAGE,
    guidance,
    supportCode ? `문의 코드: ${supportCode}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function classifySubmitFailure(error: unknown): {
  failureKind: SubmitFailureKind;
  errorName: string;
  errorMessage: string;
} {
  const errorName = error instanceof Error ? error.name : "";
  const errorMessage = error instanceof Error ? error.message : String(error || "");
  const normalizedMessage = errorMessage.toLowerCase();

  if (
    errorName === "AbortError" ||
    normalizedMessage.includes("abort") ||
    normalizedMessage.includes("aborted")
  ) {
    return {
      failureKind: "abort",
      errorName,
      errorMessage,
    };
  }

  if (errorName === "TimeoutError" || normalizedMessage.includes("timeout")) {
    return {
      failureKind: "timeout",
      errorName,
      errorMessage,
    };
  }

  if (
    error instanceof TypeError ||
    normalizedMessage.includes("failed to fetch") ||
    normalizedMessage.includes("load failed") ||
    normalizedMessage.includes("networkerror") ||
    normalizedMessage.includes("network request failed")
  ) {
    return {
      failureKind: "network",
      errorName,
      errorMessage,
    };
  }

  return {
    failureKind: "unknown",
    errorName,
    errorMessage,
  };
}

function getSubmitTransportContext(params: {
  attemptCount: number;
  attemptDurationMs: number;
  failureKind: SubmitFailureKind;
  errorName: string;
  errorMessage: string;
  retryAttempted: boolean;
  retryEligible: boolean;
  inAppBrowserName: string;
}): SubmitTransportContext {
  if (typeof window === "undefined") {
    return {
      ...params,
      onLine: "unknown",
      visibilityState: "unknown",
      connectionType: "",
      connectionEffectiveType: "",
      connectionRtt: "",
      connectionDownlink: "",
      connectionSaveData: "",
    };
  }

  const nav = window.navigator as Navigator & {
    connection?: {
      type?: string;
      effectiveType?: string;
      rtt?: number;
      downlink?: number;
      saveData?: boolean;
    };
  };
  const connection = nav.connection;

  return {
    ...params,
    onLine: String(window.navigator.onLine),
    visibilityState: document.visibilityState || "unknown",
    connectionType: connection?.type || "",
    connectionEffectiveType: connection?.effectiveType || "",
    connectionRtt:
      typeof connection?.rtt === "number" ? String(connection.rtt) : "",
    connectionDownlink:
      typeof connection?.downlink === "number" ? String(connection.downlink) : "",
    connectionSaveData:
      typeof connection?.saveData === "boolean" ? String(connection.saveData) : "",
  };
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }

  return `${bytes}B`;
}

function buildPhotoTooLargeMessage(
  size: number,
  limitLabel = MAX_PHOTO_FILE_SIZE_LABEL
) {
  return `사진 용량은 ${limitLabel} 이하만 업로드할 수 있습니다. 현재 파일은 ${formatFileSize(size)}입니다. 용량을 줄인 뒤 다시 시도해주세요.`;
}

function buildPhotoCompressedMessage(originalSize: number, compressedSize: number) {
  return `사진 용량이 커서 업로드 전에 자동으로 최적화했어요. ${formatFileSize(originalSize)} -> ${formatFileSize(compressedSize)}`;
}

function buildPhotoConvertedMessage(originalSize: number, convertedSize: number) {
  return `HEIC/HEIF 사진을 JPG로 자동 변환했어요. ${formatFileSize(originalSize)} -> ${formatFileSize(convertedSize)}`;
}

function buildPhotoConvertedAndCompressedMessage(
  originalSize: number,
  convertedSize: number
) {
  return `HEIC/HEIF 사진을 JPG로 변환하고 업로드 전에 자동으로 최적화했어요. ${formatFileSize(originalSize)} -> ${formatFileSize(convertedSize)}`;
}

function replaceFileExtension(fileName: string, extension: string) {
  const dotIndex = fileName.lastIndexOf(".");
  const baseName = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
  return `${baseName}${extension}`;
}

function isHeicLikeFile(file: File) {
  const normalizedType = file.type.trim().toLowerCase();

  return (
    HEIC_HEIF_MIME_TYPES.has(normalizedType) ||
    HEIC_HEIF_FILE_PATTERN.test(file.name)
  );
}

function loadImageFromFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("이미지 파일을 읽지 못했습니다."));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("이미지 압축 결과를 만들지 못했습니다."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

async function renderCompressedPhoto(
  image: HTMLImageElement,
  width: number,
  height: number,
  quality: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("브라우저에서 이미지 압축을 처리할 수 없습니다.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvasToBlob(canvas, quality);
}

async function loadHeic2Any() {
  const importModule = new Function(
    "moduleName",
    "return import(moduleName);"
  ) as (
    moduleName: string
  ) => Promise<{
    default?: (options: {
      blob: Blob;
      toType: string;
      quality?: number;
    }) => Promise<Blob | Blob[]>;
  }>;

  const imported = await importModule("heic2any");
  return imported.default;
}

async function convertHeicToJpeg(file: File) {
  try {
    const heic2any = await loadHeic2Any();

    if (!heic2any) {
      throw new Error("Missing HEIC converter");
    }

    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: INITIAL_PHOTO_JPEG_QUALITY,
    });
    const convertedBlob = Array.isArray(converted) ? converted[0] : converted;

    if (!(convertedBlob instanceof Blob)) {
      throw new Error("HEIC conversion did not return a Blob.");
    }

    return new File(
      [convertedBlob],
      replaceFileExtension(file.name || "day-nammae-photo", ".jpg"),
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );
  } catch {
    throw new Error(
      "HEIC/HEIF 사진을 JPG로 변환하지 못했습니다. 사진 앱에서 JPG로 저장한 뒤 다시 시도해주세요."
    );
  }
}

async function compressPhotoForUpload(
  file: File,
  options: {
    maxFileSizeBytes?: number;
    maxFileSizeLabel?: string;
    maxDimension?: number;
  } = {}
) {
  if (typeof window === "undefined") {
    return {
      file,
      wasCompressed: false,
      wasConverted: false,
      originalSize: file.size,
      preparedSize: file.size,
    };
  }

  const maxFileSizeBytes = options.maxFileSizeBytes ?? MAX_PHOTO_FILE_SIZE_BYTES;
  const maxFileSizeLabel = options.maxFileSizeLabel ?? MAX_PHOTO_FILE_SIZE_LABEL;
  const maxDimension = options.maxDimension ?? MAX_PHOTO_DIMENSION;
  const originalSize = file.size;
  const workingFile = isHeicLikeFile(file) ? await convertHeicToJpeg(file) : file;
  const image = await loadImageFromFile(workingFile);
  let width = image.naturalWidth;
  let height = image.naturalHeight;
  const longestEdge = Math.max(width, height);
  const needsResize = longestEdge > maxDimension;

  if (!needsResize && workingFile.size <= maxFileSizeBytes) {
    return {
      file: workingFile,
      wasCompressed: false,
      wasConverted: workingFile !== file,
      originalSize,
      preparedSize: workingFile.size,
    };
  }

  if (needsResize) {
    const scale = maxDimension / longestEdge;
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  let quality = INITIAL_PHOTO_JPEG_QUALITY;
  let blob = await renderCompressedPhoto(image, width, height, quality);

  while (blob.size > maxFileSizeBytes) {
    if (quality > MIN_PHOTO_JPEG_QUALITY) {
      quality = Math.max(MIN_PHOTO_JPEG_QUALITY, quality - 0.08);
    } else {
      width = Math.max(1, Math.round(width * 0.85));
      height = Math.max(1, Math.round(height * 0.85));
      quality = INITIAL_PHOTO_JPEG_QUALITY;
    }

    const nextBlob = await renderCompressedPhoto(image, width, height, quality);
    if (nextBlob.size >= blob.size && quality === MIN_PHOTO_JPEG_QUALITY) {
      break;
    }
    blob = nextBlob;
  }

  if (blob.size > maxFileSizeBytes) {
    throw new Error(
      buildPhotoTooLargeMessage(blob.size, maxFileSizeLabel)
    );
  }

  const compressedFile = new File(
    [blob],
    replaceFileExtension(workingFile.name || "day-nammae-photo", ".jpg"),
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );

  return {
    file: compressedFile,
    wasCompressed: true,
    wasConverted: workingFile !== file,
    originalSize,
    preparedSize: compressedFile.size,
  };
}

function buildClientDebugContext(photo: File | null, clientRequestId = "") {
  if (typeof window === "undefined") {
    return null;
  }

  const nav = window.navigator as Navigator & {
    connection?: {
      effectiveType?: string;
      rtt?: number;
      downlink?: number;
      saveData?: boolean;
    };
  };
  const connection = nav.connection;
  const inAppBrowserName = getCurrentInAppBrowserName();

  return {
    clientRequestId,
    submittedAt: new Date().toISOString(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: window.navigator.userAgent,
    inAppBrowserName,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    onLine: window.navigator.onLine,
    visibilityState: document.visibilityState,
    connectionEffectiveType: connection?.effectiveType || "",
    connectionRtt: typeof connection?.rtt === "number" ? connection.rtt : 0,
    connectionDownlink:
      typeof connection?.downlink === "number" ? connection.downlink : 0,
    connectionSaveData:
      typeof connection?.saveData === "boolean" ? connection.saveData : false,
    photoName: photo?.name || "",
    photoType: photo?.type || "",
    photoSize: photo?.size || 0,
    photoLastModified: photo?.lastModified || 0,
  };
}

function getResponseRequestId(result: unknown) {
  if (!result || typeof result !== "object") {
    return "";
  }

  const requestId = (result as { requestId?: unknown }).requestId;
  return typeof requestId === "string" ? requestId : "";
}

function getResponseClientRequestId(result: unknown) {
  if (!result || typeof result !== "object") {
    return "";
  }

  const clientRequestId = (result as { clientRequestId?: unknown }).clientRequestId;
  return typeof clientRequestId === "string" ? clientRequestId : "";
}

function getResponseUserMessage(result: unknown) {
  if (!result || typeof result !== "object") {
    return "";
  }

  const userMessage = (result as { userMessage?: unknown }).userMessage;
  return typeof userMessage === "string" ? userMessage : "";
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function getEdgeBody(result: unknown) {
  return getRecord(getRecord(result)?.edgeBody);
}

function getEdgeCouponUse(result: unknown) {
  const couponUse = getRecord(getEdgeBody(result)?.couponUse);

  if (couponUse?.success !== true || typeof couponUse.id !== "number") {
    return null;
  }

  return couponUse as unknown as CouponUseResult;
}

function getResponseApplicationSubmitted(result: unknown) {
  return getRecord(result)?.applicationSubmitted === true ||
    getEdgeBody(result)?.applicationSubmitted === true;
}

function summarizeResponseText(text: string) {
  const normalizedText = text.replace(/\s+/g, " ").trim();

  if (normalizedText.length <= 280) {
    return normalizedText;
  }

  return `${normalizedText.slice(0, 277)}...`;
}

function isRetryableSubmitHttpResponse(response: Response) {
  const responseContentType = response.headers.get("content-type") || "";

  return (
    SUBMIT_RETRYABLE_HTTP_STATUSES.has(response.status) &&
    !responseContentType.includes("application/json")
  );
}

async function parseSubmitResponse(response: Response): Promise<{
  result: unknown;
  meta: SubmitResponseMeta;
}> {
  const responseContentType = response.headers.get("content-type") || "";
  const rawText = await response.text();
  let result: unknown = null;
  let parseError = "";

  if (rawText) {
    try {
      result = JSON.parse(rawText);
    } catch (error) {
      if (responseContentType.includes("application/json")) {
        parseError = error instanceof Error ? error.message : String(error);
      }
    }
  }

  return {
    result,
    meta: {
      requestId:
        getResponseRequestId(result) ||
        response.headers.get("x-ssobig-request-id") ||
        "",
      clientRequestId:
        getResponseClientRequestId(result) ||
        response.headers.get("x-ssobig-client-request-id") ||
        "",
      userMessage: getResponseUserMessage(result),
      responseStatus: response.status,
      responseContentType,
      responseTextSnippet: summarizeResponseText(rawText),
      responseUrl: response.url,
      parseError,
    },
  };
}

function buildResponseFailureMessage(meta: SubmitResponseMeta, photo: File | null) {
  const supportCode = meta.requestId || meta.clientRequestId;

  if (meta.userMessage) {
    return meta.userMessage;
  }

  if (meta.responseStatus === 413) {
    return `${buildPhotoTooLargeMessage(photo?.size || 0)} 문의 코드: ${supportCode || "upload-too-large"}`;
  }

  return buildSubmitErrorMessage(supportCode);
}

function createHandledSubmitError(
  message: string,
  options: {
    requestId?: string;
    clientRequestId?: string;
    responseStatus?: number;
    responseContentType?: string;
    responseTextSnippet?: string;
    responseUrl?: string;
    parseError?: string;
    stage?: string;
    transportContext?: SubmitTransportContext | null;
  } = {}
) {
  const error = new Error(message) as Error & {
    alreadyReported?: boolean;
    requestId?: string;
    clientRequestId?: string;
    responseStatus?: number;
    responseContentType?: string;
    responseTextSnippet?: string;
    responseUrl?: string;
    parseError?: string;
    stage?: string;
    transportContext?: SubmitTransportContext | null;
  };

  error.alreadyReported = Boolean(options.requestId);
  error.requestId = options.requestId || "";
  error.clientRequestId = options.clientRequestId || "";
  error.responseStatus = options.responseStatus;
  error.responseContentType = options.responseContentType || "";
  error.responseTextSnippet = options.responseTextSnippet || "";
  error.responseUrl = options.responseUrl || "";
  error.parseError = options.parseError || "";
  error.stage = options.stage || "";
  error.transportContext = options.transportContext || null;
  return error;
}

function getHandledSubmitErrorState(error: unknown) {
  if (!(error instanceof Error)) {
    return {
      alreadyReported: false,
      requestId: "",
      clientRequestId: "",
      responseStatus: 0,
      responseContentType: "",
      responseTextSnippet: "",
      responseUrl: "",
      parseError: "",
      stage: "",
      transportContext: null as SubmitTransportContext | null,
    };
  }

  const errorWithMeta = error as Error & {
    alreadyReported?: boolean;
    requestId?: string;
    clientRequestId?: string;
    responseStatus?: number;
    responseContentType?: string;
    responseTextSnippet?: string;
    responseUrl?: string;
    parseError?: string;
    stage?: string;
    transportContext?: SubmitTransportContext | null;
  };

  return {
    alreadyReported: Boolean(errorWithMeta.alreadyReported),
    requestId:
      typeof errorWithMeta.requestId === "string" ? errorWithMeta.requestId : "",
    clientRequestId:
      typeof errorWithMeta.clientRequestId === "string"
        ? errorWithMeta.clientRequestId
        : "",
    responseStatus:
      typeof errorWithMeta.responseStatus === "number"
        ? errorWithMeta.responseStatus
        : 0,
    responseContentType:
      typeof errorWithMeta.responseContentType === "string"
        ? errorWithMeta.responseContentType
        : "",
    responseTextSnippet:
      typeof errorWithMeta.responseTextSnippet === "string"
        ? errorWithMeta.responseTextSnippet
        : "",
    responseUrl:
      typeof errorWithMeta.responseUrl === "string" ? errorWithMeta.responseUrl : "",
    parseError:
      typeof errorWithMeta.parseError === "string" ? errorWithMeta.parseError : "",
    stage: typeof errorWithMeta.stage === "string" ? errorWithMeta.stage : "",
    transportContext:
      errorWithMeta.transportContext && typeof errorWithMeta.transportContext === "object"
        ? errorWithMeta.transportContext
        : null,
  };
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function getCouponReason(payload: unknown, fallbackMessage: string) {
  if (!payload || typeof payload !== "object") {
    return fallbackMessage;
  }

  if ("reason" in payload && typeof payload.reason === "string" && payload.reason) {
    return payload.reason;
  }

  if ("error" in payload && typeof payload.error === "string" && payload.error) {
    return payload.error;
  }

  if ("detail" in payload && typeof payload.detail === "string" && payload.detail) {
    return payload.detail;
  }

  return fallbackMessage;
}

async function parseJsonResponse<T>(response: Response) {
  const rawText = await response.text();

  if (!rawText) {
    return null as T | null;
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    return null as T | null;
  }
}

class CouponValidationError extends Error {
  payload: CouponScheduleLookupResult | null;

  constructor(message: string, payload: CouponScheduleLookupResult | null) {
    super(message);
    this.name = "CouponValidationError";
    this.payload = payload;
  }
}

async function requestCouponValidation(code: string, staffScheduleId: string) {
  const response = await fetch(`${getDayNammeCouponApiBaseUrl()}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, staffScheduleId }),
  });

  const payload = await parseJsonResponse<CouponValidationResult | Record<string, unknown>>(
    response
  );

  if (!response.ok) {
    throw new CouponValidationError(
      getCouponReason(payload, DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE),
      payload && typeof payload === "object"
        ? (payload as CouponScheduleLookupResult)
        : null
    );
  }

  if (!payload || typeof payload !== "object") {
    throw new Error(DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE);
  }

  if (!("valid" in payload) || payload.valid !== true) {
    throw new CouponValidationError(
      getCouponReason(payload, "사용할 수 없는 쿠폰입니다."),
      payload as CouponScheduleLookupResult
    );
  }

  if (!("id" in payload) || typeof payload.id !== "number") {
    throw new Error(DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE);
  }

  return payload as CouponValidationResult;
}

async function requestCouponScheduleLookup(code: string) {
  const response = await fetch(`${getDayNammeCouponApiBaseUrl()}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const payload = await parseJsonResponse<
    CouponScheduleLookupResult | Record<string, unknown>
  >(response);

  if (!response.ok) {
    throw new Error(
      getCouponReason(payload, DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE)
    );
  }

  if (!payload || typeof payload !== "object") {
    throw new Error(DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE);
  }

  return payload as CouponScheduleLookupResult;
}

async function requestCouponUse(code: string, staffScheduleId: string) {
  const response = await fetch(`${getDayNammeCouponApiBaseUrl()}/use`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, staffScheduleId }),
  });

  const payload = await parseJsonResponse<CouponUseResult | Record<string, unknown>>(
    response
  );

  if (!response.ok) {
    throw new Error(getCouponReason(payload, DEFAULT_COUPON_USE_ERROR_MESSAGE));
  }

  if (!payload || typeof payload !== "object") {
    throw new Error(DEFAULT_COUPON_USE_ERROR_MESSAGE);
  }

  if (!("success" in payload) || payload.success !== true) {
    throw new Error(getCouponReason(payload, "쿠폰을 사용할 수 없습니다."));
  }

  if (!("id" in payload) || typeof payload.id !== "number") {
    throw new Error(DEFAULT_COUPON_USE_ERROR_MESSAGE);
  }

  return payload as CouponUseResult;
}

function getTodayDateParam() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value || "";
  const month = parts.find((part) => part.type === "month")?.value || "";
  const day = parts.find((part) => part.type === "day")?.value || "";

  if (!year || !month || !day) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function getScheduleDateParam(scheduleLabel: string) {
  const todayDate = getTodayDateParam();
  const dateMatch = scheduleLabel.match(/(\d{1,2})\/(\d{1,2})/);

  if (!dateMatch || !todayDate) {
    return todayDate;
  }

  const [, monthRaw, dayRaw] = dateMatch;
  const [yearRaw, todayMonthRaw, todayDayRaw] = todayDate.split("-");
  const year = Number.parseInt(yearRaw || "", 10);
  const month = Number.parseInt(monthRaw, 10);
  const day = Number.parseInt(dayRaw, 10);
  const todayMonth = Number.parseInt(todayMonthRaw || "", 10);
  const todayDay = Number.parseInt(todayDayRaw || "", 10);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !Number.isInteger(todayMonth) ||
    !Number.isInteger(todayDay)
  ) {
    return todayDate;
  }

  const resolvedYear =
    month < todayMonth || (month === todayMonth && day < todayDay) ? year + 1 : year;

  return `${resolvedYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function appendStartDateTime(baseUrl: string, scheduleLabel: string) {
  try {
    const url = new URL(baseUrl);
    const startDateTime = getScheduleDateParam(scheduleLabel);

    if (startDateTime) {
      url.searchParams.set("startDateTime", startDateTime);
    }

    return url.toString();
  } catch {
    return baseUrl;
  }
}

function getCouponDiscountRate(
  coupon?: Partial<CouponValidationResult & CouponUseResult> | null
) {
  if (!coupon) {
    return 0;
  }

  if (coupon.discount_type === "percent") {
    return typeof coupon.discount_value === "number" ? coupon.discount_value : 0;
  }

  if (coupon.discount_type === "amount" && typeof coupon.discount_value === "number") {
    if (coupon.discount_value === 3500) {
      return 10;
    }

    if (coupon.discount_value === 10500) {
      return 30;
    }

    if (coupon.discount_value === 17500) {
      return 50;
    }
  }

  const label = typeof coupon.discount_label === "string" ? coupon.discount_label : "";
  if (label.includes("100%") || label.includes("전액")) {
    return 100;
  }

  if (label.includes("반값") || label.includes("50%")) {
    return 50;
  }

  if (label.includes("30%")) {
    return 30;
  }

  if (label.includes("10%")) {
    return 10;
  }

  return 0;
}

function getMappedBookingUrl(
  discountRate: number,
  normalLink: string
) {
  if (discountRate === 10) {
    return DEFAULT_TEN_PERCENT_BOOKING_URL;
  }

  if (discountRate === 30) {
    return DEFAULT_THIRTY_PERCENT_BOOKING_URL;
  }

  if (discountRate === 50) {
    return DEFAULT_FIFTY_PERCENT_BOOKING_URL;
  }

  return normalLink || DEFAULT_NORMAL_BOOKING_URL;
}

function couponRequiresPayment(
  coupon?: Partial<CouponValidationResult & CouponUseResult> | null
) {
  if (!coupon) return true;
  if (coupon.requires_payment === false) return false;
  return getCouponDiscountRate(coupon) < 100;
}

function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function buildCheckoutState(
  scheduleLabel: string,
  coupon?: Partial<CouponValidationResult & CouponUseResult> | null,
  clientRequestId = ""
): CheckoutState {
  const discountRate = getCouponDiscountRate(coupon);
  const normalLink =
    typeof coupon?.normal_link === "string" && coupon.normal_link.trim()
      ? coupon.normal_link.trim()
      : DEFAULT_NORMAL_BOOKING_URL;
  const isDiscounted = Boolean(coupon) &&
    (discountRate === 10 || discountRate === 30 || discountRate === 50);
  const baseUrl = isDiscounted
    ? getMappedBookingUrl(discountRate, normalLink)
    : normalLink;

  let buttonLabel = `${formatPrice(BASE_PRICE)} 결제하기`;
  let value = BASE_PRICE;
  let finalPrice = BASE_PRICE;

  if (discountRate === 10) {
    value = 31500;
    finalPrice = 31500;
  } else if (discountRate === 30) {
    value = 24500;
    finalPrice = 24500;
  } else if (discountRate === 50) {
    value = 17500;
    finalPrice = 17500;
  } else if (isDiscounted) {
    finalPrice = BASE_PRICE;
  }

  buttonLabel = `${formatPrice(finalPrice)} 구매하기`;

  return {
    url: appendStartDateTime(baseUrl, scheduleLabel),
    buttonLabel,
    value,
    originalPrice: BASE_PRICE,
    finalPrice,
    couponLabel: coupon?.discount_label || "",
    isDiscounted,
    metaCheckoutEventId: buildDayNammaeMetaEventId(
      "InitiateCheckout",
      clientRequestId || `${scheduleLabel}:${Date.now()}`
    ),
  };
}

async function submitDayNammeApplyRequest(params: {
  requestBody: FormData;
  clientRequestId: string;
  inAppBrowserName: string;
}) {
  const { requestBody, clientRequestId, inAppBrowserName } = params;
  const maxAttempts = inAppBrowserName ? 2 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const attemptStartedAt =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    try {
      const response = await fetch("/api/offline/day-nammae/apply", {
        method: "POST",
        body: requestBody,
      });

      const retryEligible =
        Boolean(inAppBrowserName) &&
        attempt < maxAttempts &&
        isRetryableSubmitHttpResponse(response);

      if (retryEligible) {
        console.warn("[day-nammae submit http retry]", {
          clientRequestId,
          attemptCount: attempt,
          responseStatus: response.status,
          responseContentType: response.headers.get("content-type") || "",
          responseUrl: response.url,
          inAppBrowserName,
        });
        await delay(SUBMIT_NETWORK_RETRY_DELAY_MS);
        continue;
      }

      return response;
    } catch (error) {
      const attemptDurationMs = Math.max(
        0,
        Math.round(
          (typeof performance !== "undefined" ? performance.now() : Date.now()) -
            attemptStartedAt
        )
      );
      const { failureKind, errorName, errorMessage } = classifySubmitFailure(error);
      const retryEligible =
        Boolean(inAppBrowserName) &&
        failureKind === "network" &&
        attempt < maxAttempts &&
        attemptDurationMs <= SUBMIT_IN_APP_BROWSER_NETWORK_RETRY_WINDOW_MS;
      const transportContext = getSubmitTransportContext({
        attemptCount: attempt,
        attemptDurationMs,
        failureKind,
        errorName,
        errorMessage,
        retryAttempted: attempt > 1,
        retryEligible,
        inAppBrowserName,
      });

      console.warn("[day-nammae submit transport failure]", {
        clientRequestId,
        ...transportContext,
      });

      if (!retryEligible) {
        const stage =
          failureKind === "abort"
            ? "client:fetch:aborted"
            : failureKind === "timeout"
              ? "client:fetch:timeout"
              : "client:fetch:transport_error";

        throw createHandledSubmitError(
          buildTransportFailureMessage(
            clientRequestId,
            failureKind,
            inAppBrowserName
          ),
          {
            clientRequestId,
            stage,
            transportContext,
          }
        );
      }

      await delay(SUBMIT_NETWORK_RETRY_DELAY_MS);
    }
  }

  throw createHandledSubmitError(buildSubmitErrorMessage(clientRequestId), {
    clientRequestId,
    stage: "client:fetch:unknown",
  });
}

export default function LoveBuddiesApplyFlow({
  mode,
  scheduleData,
  isLoadingSchedules,
  initialCouponCode,
  onClose,
}: LoveBuddiesApplyFlowProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const normalizedInitialCouponCode = normalizeDayNammeCouponCode(
    initialCouponCode || ""
  );
  const initialCouponCodeSuffix =
    normalizedInitialCouponCode.length === DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH
      ? normalizedInitialCouponCode
      : "";
  const shouldShowCouponChoiceStep = Boolean(initialCouponCodeSuffix);
  const initialFormValues = createInitialFormValues(initialCouponCodeSuffix);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [photoNotice, setPhotoNotice] = useState("");
  const [isOptimizingPhoto, setIsOptimizingPhoto] = useState(false);
  const [formError, setFormError] = useState("");
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [agreements, setAgreements] = useState([false, false, false]);
  const [freeCouponNoticeAgreed, setFreeCouponNoticeAgreed] = useState(false);
  const [couponValidationStatus, setCouponValidationStatus] =
    useState<CouponValidationStatus>("idle");
  const [validatedCoupon, setValidatedCoupon] =
    useState<CouponValidationResult | null>(null);
  const [scheduleLimitedCoupon, setScheduleLimitedCoupon] =
    useState<CouponScheduleLookupResult | null>(null);
  const [couponScheduleLookupCode, setCouponScheduleLookupCode] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>(INITIAL_SUBMIT_STATE);
  const [waitlistModalSchedule, setWaitlistModalSchedule] =
    useState<ScheduleItem | null>(null);
  const [confirmedWaitlistSchedule, setConfirmedWaitlistSchedule] = useState("");

  const selectedScheduleItem =
    scheduleData.find(
      (schedule) =>
        formValues.staffScheduleId
          ? schedule.staffScheduleId === formValues.staffScheduleId
          : getDayNammeScheduleLabel(schedule) === formValues.schedule
    ) || null;
  const selectedApplicationMode: DayNammeApplicationMode = selectedScheduleItem
    ? getDayNammeScheduleApplicationMode(selectedScheduleItem, formValues.gender)
    : "normal";
  const selectedBirthYears = getDayNammeBirthYearsForSchedule(selectedScheduleItem);
  const selectedAgeRangeLabel = selectedScheduleItem?.ageRange.label || "";
  const isSelectedBirthYearAllowed =
    !formValues.birthYear ||
    isDayNammeBirthYearAllowed(formValues.birthYear, selectedScheduleItem);
  const isWaitlistApplication = selectedApplicationMode === "waitlist_alert";
  const isValidatedFreeCoupon =
    couponValidationStatus === "valid" &&
    Boolean(validatedCoupon || scheduleLimitedCoupon) &&
    !couponRequiresPayment(validatedCoupon || scheduleLimitedCoupon);
  const scheduleLimitedTargetIds = getCouponTargetScheduleIds(
    scheduleLimitedCoupon || validatedCoupon
  );
  const isScheduleLimitedCouponMode =
    formValues.hasCoupon === true && scheduleLimitedTargetIds.length > 0;
  const scheduleLimitedTargetLabel = getCouponTargetScheduleLabel(
    scheduleLimitedCoupon || validatedCoupon
  );
  const flowSteps = isWaitlistApplication
    ? WAITLIST_ALERT_FLOW_STEPS
    : getNormalFlowSteps(
        formValues.hasCoupon,
        isValidatedFreeCoupon,
        isScheduleLimitedCouponMode,
        shouldShowCouponChoiceStep
      );
  const currentStepKey = flowSteps[currentStepIndex] || flowSteps[0];
  const totalSteps = flowSteps.length;
  const displayStep = currentStepIndex + 1;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const inAppBrowserName = getCurrentInAppBrowserName();
  const flowOpenTrackedRef = useRef(false);
  const lastStepViewSignatureRef = useRef("");
  const flowStartedAtMsRef = useRef(Date.now());
  const applyAnalyticsBaseParams = useMemo(() => {
    const flowType = isWaitlistApplication
      ? "waitlist"
      : isValidatedFreeCoupon
        ? "free_coupon"
        : formValues.hasCoupon === true
          ? "coupon"
          : formValues.hasCoupon === false
            ? "standard"
            : "undecided";
    const couponState =
      formValues.hasCoupon !== true
        ? "none"
        : couponValidationStatus === "valid"
          ? isValidatedFreeCoupon
            ? "valid_free"
            : "valid_paid"
          : couponValidationStatus;

    return {
      event_category: "day_nammae_apply",
      apply_mode: mode,
      entry_surface: mode === "modal" ? "desktop_modal" : "mobile_apply_page",
      application_mode: selectedApplicationMode,
      flow_type: flowType,
      gender: formValues.gender || "unset",
      has_coupon: toAnalyticsBoolean(formValues.hasCoupon),
      coupon_state: couponState,
      in_app_browser: inAppBrowserName || "none",
      coupon_code_present: formValues.couponCode.trim() ? "true" : "false",
      ...getScheduleAnalyticsParams(selectedScheduleItem),
    };
  }, [
    couponValidationStatus,
    formValues.couponCode,
    formValues.gender,
    formValues.hasCoupon,
    inAppBrowserName,
    isValidatedFreeCoupon,
    isWaitlistApplication,
    mode,
    selectedApplicationMode,
    selectedScheduleItem,
  ]);

  const goToStep = useCallback(
    (stepKey: FlowStepKey) => {
      const nextIndex = flowSteps.indexOf(stepKey);
      if (nextIndex >= 0) {
        setCurrentStepIndex(nextIndex);
      }
    },
    [flowSteps]
  );

  const goToStepAfter = useCallback(
    (stepKey: FlowStepKey) => {
      const currentIndex = flowSteps.indexOf(stepKey);
      if (currentIndex >= 0) {
        setCurrentStepIndex(Math.min(currentIndex + 1, flowSteps.length - 1));
      }
    },
    [flowSteps]
  );

  const buildStepAnalyticsParams = useCallback(
    (stepKey = currentStepKey, stepIndex = displayStep) => ({
      ...applyAnalyticsBaseParams,
      step_key: stepKey,
      step_name: getStepAnalyticsName(stepKey),
      step_index: stepIndex,
      step_total: totalSteps,
      step_progress_percent: Math.round((stepIndex / totalSteps) * 100),
      elapsed_seconds: Math.round((Date.now() - flowStartedAtMsRef.current) / 1000),
    }),
    [applyAnalyticsBaseParams, currentStepKey, displayStep, totalSteps]
  );

  const trackApplyAnalyticsEvent = useCallback((
    eventName: string,
    params?: Record<string, unknown>
  ) => {
    trackGAEvent(eventName, {
      ...applyAnalyticsBaseParams,
      ...params,
    });
  }, [applyAnalyticsBaseParams]);

  useEffect(() => {
    if (flowOpenTrackedRef.current) {
      return;
    }

    flowOpenTrackedRef.current = true;
    trackApplyAnalyticsEvent("dn_apply_flow_open", {
      step_key: currentStepKey,
      step_index: displayStep,
      step_total: totalSteps,
    });
  }, [currentStepKey, displayStep, totalSteps, trackApplyAnalyticsEvent]);

  useEffect(() => {
    const signature = [
      currentStepKey,
      displayStep,
      totalSteps,
      applyAnalyticsBaseParams.flow_type,
      applyAnalyticsBaseParams.application_mode,
    ].join(":");

    if (lastStepViewSignatureRef.current === signature) {
      return;
    }

    lastStepViewSignatureRef.current = signature;
    trackGAEvent("dn_apply_step_view", buildStepAnalyticsParams());
  }, [
    applyAnalyticsBaseParams,
    buildStepAnalyticsParams,
    currentStepKey,
    displayStep,
    totalSteps,
  ]);

  useEffect(() => {
    if (!formValues.photo) {
      setPhotoPreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(formValues.photo);
    setPhotoPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [formValues.photo]);

  useEffect(() => {
    if (!isValidatedFreeCoupon) {
      setFreeCouponNoticeAgreed(false);
    }
  }, [isValidatedFreeCoupon]);

  useEffect(() => {
    if (!initialCouponCodeSuffix) {
      return;
    }

    setFormValues((current) => {
      if (
        current.couponCode === initialCouponCodeSuffix &&
        current.hasCoupon === true
      ) {
        return current;
      }

      return {
        ...current,
        hasCoupon: true,
        couponCode: initialCouponCodeSuffix,
      };
    });
  }, [initialCouponCodeSuffix]);

  useEffect(() => {
    if (
      !initialCouponCodeSuffix ||
      couponScheduleLookupCode === initialCouponCodeSuffix ||
      isLoadingSchedules ||
      scheduleData.length === 0
    ) {
      return;
    }

    setCouponScheduleLookupCode(initialCouponCodeSuffix);

    requestCouponScheduleLookup(buildDayNammeCouponCode(initialCouponCodeSuffix))
      .then((result) => {
        const targetStaffScheduleIds = getCouponTargetScheduleIds(result);

        if (targetStaffScheduleIds.length === 0) {
          return;
        }

        setScheduleLimitedCoupon(result);
        const targetSchedule = scheduleData.find(
          (schedule) => targetStaffScheduleIds.includes(schedule.staffScheduleId)
        );

        if (!targetSchedule) {
          return;
        }

        const targetScheduleLabel = getDayNammeScheduleLabel(targetSchedule);

        setFormValues((current) => {
          if (
            current.staffScheduleId &&
            !targetStaffScheduleIds.includes(current.staffScheduleId)
          ) {
            return current;
          }

          return {
            ...current,
            hasCoupon: true,
            couponCode: initialCouponCodeSuffix,
            schedule: targetScheduleLabel,
            staffScheduleId: targetSchedule.staffScheduleId,
            birthYear: isDayNammeBirthYearAllowed(current.birthYear, targetSchedule)
              ? current.birthYear
              : "",
          };
        });
        setValidatedCoupon(null);
        setCouponValidationStatus("idle");
      })
      .catch((error) => {
        console.warn("[day-nammae coupon schedule lookup failed]", error);
      });
  }, [
    couponScheduleLookupCode,
    initialCouponCodeSuffix,
    isLoadingSchedules,
    scheduleData,
  ]);

  const closeFlow = () => {
    if (mode === "page") {
      router.push("/offline/11namme");
      return;
    }

    onClose?.();
  };

  const resetFlow = () => {
    flowStartedAtMsRef.current = Date.now();
    flowOpenTrackedRef.current = false;
    lastStepViewSignatureRef.current = "";
    setSubmitState(INITIAL_SUBMIT_STATE);
    setCurrentStepIndex(0);
    setFormValues(initialFormValues);
    setAgreements([false, false, false]);
    setFreeCouponNoticeAgreed(false);
    setShowFieldErrors(false);
    setFormError("");
    setPhotoNotice("");
    setCouponValidationStatus("idle");
    setValidatedCoupon(null);
    setScheduleLimitedCoupon(null);
    setWaitlistModalSchedule(null);
    setConfirmedWaitlistSchedule("");
  };

  const handleValueChange =
    (
      field:
        | "name"
        | "birthYear"
        | "height"
        | "phone"
        | "traits"
        | "acquisitionChannelOther"
    ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let nextValue = event.target.value;
      if (field === "phone") nextValue = formatPhoneNumber(nextValue);
      if (field === "height") nextValue = nextValue.replace(/\D/g, "").slice(0, 3);
      setFormValues((current) => ({ ...current, [field]: nextValue }));
      setFormError("");
    };

  const handleAcquisitionChannelSelect = (channel: string) => {
    setFormValues((current) => ({
      ...current,
      acquisitionChannel: channel,
      acquisitionChannelOther:
        channel === "기타" ? current.acquisitionChannelOther : "",
    }));
    setFormError("");
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith("image/")) {
      setPhotoNotice("");
      setFormError("사진은 이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    if (!file) {
      setFormValues((current) => ({ ...current, photo: null }));
      setPhotoNotice("");
      setFormError("");
      return;
    }

    setIsOptimizingPhoto(true);
    setPhotoNotice("");
    setFormError("");

    const photoUploadOptions = inAppBrowserName
      ? {
          maxFileSizeBytes: IN_APP_BROWSER_UPLOAD_MAX_FILE_SIZE_BYTES,
          maxFileSizeLabel: IN_APP_BROWSER_UPLOAD_MAX_FILE_SIZE_LABEL,
          maxDimension: IN_APP_BROWSER_MAX_PHOTO_DIMENSION,
        }
      : undefined;

    compressPhotoForUpload(file, photoUploadOptions)
      .then(({ file: nextFile, wasCompressed, wasConverted, originalSize, preparedSize }) => {
        setFormValues((current) => ({ ...current, photo: nextFile }));
        const nextNotice = wasConverted
          ? wasCompressed
            ? buildPhotoConvertedAndCompressedMessage(originalSize, preparedSize)
            : buildPhotoConvertedMessage(originalSize, preparedSize)
          : wasCompressed
            ? buildPhotoCompressedMessage(originalSize, preparedSize)
            : "";

        setPhotoNotice(
          inAppBrowserName && nextNotice
            ? `${nextNotice} ${getInAppBrowserLabel(inAppBrowserName)} 앱 내 브라우저에서도 업로드가 되도록 조금 더 가볍게 준비했어요.`
            : nextNotice
        );
      })
      .catch((error) => {
        setFormValues((current) => ({ ...current, photo: null }));
        setPhotoNotice("");
        setFormError(
          error instanceof Error
            ? error.message
            : buildPhotoTooLargeMessage(file.size)
        );
        event.target.value = "";
      })
      .finally(() => {
        setIsOptimizingPhoto(false);
      });
  };

  const handleGenderSelect = (gender: "남" | "여") => {
    setFormValues((current) => {
      const currentSchedule = scheduleData.find(
        (schedule) =>
          current.staffScheduleId
            ? schedule.staffScheduleId === current.staffScheduleId
            : getDayNammeScheduleLabel(schedule) === current.schedule
      );
      const nextSchedule =
        currentSchedule && !isDayNammeScheduleSelectable(currentSchedule, gender)
          ? ""
          : current.schedule;
      const nextStaffScheduleId = nextSchedule ? current.staffScheduleId : "";
      const shouldClearCoupon =
        Boolean(current.schedule) && !nextSchedule && !isScheduleLimitedCouponMode;
      return {
        ...current,
        gender,
        schedule: nextSchedule,
        staffScheduleId: nextStaffScheduleId,
        couponCode: shouldClearCoupon ? "" : current.couponCode,
      };
    });
    if (validatedCoupon) {
      setValidatedCoupon(null);
      setCouponValidationStatus("idle");
      setFreeCouponNoticeAgreed(false);
    }
    setFormError(
      isScheduleLimitedCouponMode &&
        scheduleLimitedTargetIds.length > 0 &&
        !scheduleData.some(
          (schedule) =>
            scheduleLimitedTargetIds.includes(schedule.staffScheduleId) &&
            isDayNammeScheduleSelectable(schedule, gender)
        )
        ? "선택한 성별로 신청 가능한 쿠폰 대상 회차가 없습니다."
        : ""
    );
    setShowFieldErrors(false);
    setWaitlistModalSchedule(null);
    setConfirmedWaitlistSchedule("");
    goToStep(isScheduleLimitedCouponMode ? "coupon_code" : "schedule");
  };

  const validateCouponForSchedule = async (schedule: ScheduleItem) => {
    const couponCodeSuffix = normalizeDayNammeCouponCode(formValues.couponCode);
    if (couponCodeSuffix.length !== DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH) {
      setCouponValidationStatus("invalid");
      setValidatedCoupon(null);
      setFormError("쿠폰 번호 8자리를 입력해주세요.");
      return false;
    }

    setCouponValidationStatus("validating");
    setValidatedCoupon(null);
    setFormError("");

    try {
      const result = await requestCouponValidation(
        buildDayNammeCouponCode(couponCodeSuffix),
        schedule.staffScheduleId
      );
      setCouponValidationStatus("valid");
      setValidatedCoupon(result);
      setScheduleLimitedCoupon(result);
      setFormValues((current) => ({
        ...current,
        couponCode: normalizeDayNammeCouponCode(result.code),
      }));
      trackEvent("DN_ValidateCoupon", {
        code: result.code,
        discount_label: result.discount_label || "",
      });
      return true;
    } catch (error) {
      const payload = error instanceof CouponValidationError ? error.payload : null;
      if (payload && getCouponTargetScheduleIds(payload).length > 0) {
        setScheduleLimitedCoupon(payload);
      }
      setCouponValidationStatus("invalid");
      setValidatedCoupon(null);
      setFormError(
        error instanceof Error ? error.message : DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE
      );
      return false;
    }
  };

  const handleScheduleSelect = async (schedule: ScheduleItem) => {
    const scheduleLabel = getDayNammeScheduleLabel(schedule);

    setFormValues((current) => ({
      ...current,
      schedule: scheduleLabel,
      staffScheduleId: schedule.staffScheduleId,
      birthYear: isDayNammeBirthYearAllowed(current.birthYear, schedule)
        ? current.birthYear
        : "",
    }));
    setValidatedCoupon(null);
    setCouponValidationStatus(formValues.couponCode ? "idle" : "invalid");
    setFreeCouponNoticeAgreed(false);
    setFormError("");
    setShowFieldErrors(false);
    setConfirmedWaitlistSchedule("");

    if (
      getDayNammeScheduleApplicationMode(schedule, formValues.gender) ===
      "waitlist_alert"
    ) {
      setWaitlistModalSchedule(schedule);
      return;
    }

    if (isScheduleLimitedCouponMode) {
      const isValidForSchedule = await validateCouponForSchedule(schedule);
      if (!isValidForSchedule) return;
      goToStepAfter("schedule");
      return;
    }

    goToStep(shouldShowCouponChoiceStep ? "coupon_choice" : "profile");
  };

  const handleWaitlistConfirm = () => {
    if (waitlistModalSchedule) {
      setConfirmedWaitlistSchedule(
        getDayNammeScheduleLabel(waitlistModalSchedule)
      );
    }
    setWaitlistModalSchedule(null);
    goToStep("waitlist_contact");
  };

  const handleBirthYearSelect = (year: string) => {
    setFormValues((current) => ({ ...current, birthYear: year }));
  };

  const handleAgreementChange = (index: number) => (agreed: boolean) => {
    setAgreements((current) => {
      const next = [...current];
      next[index] = agreed;
      return next;
    });
    trackApplyAnalyticsEvent("dn_apply_agreement_toggle", {
      ...buildStepAnalyticsParams(getAgreementStepKey(index)),
      agreement_checked: agreed ? "true" : "false",
    });
  };

  const handleCouponChoice = (nextValue: boolean) => {
    setFormValues((current) => ({
      ...current,
      hasCoupon: nextValue,
      couponCode: nextValue ? current.couponCode : "",
    }));
    if (!nextValue) {
      setValidatedCoupon(null);
      setScheduleLimitedCoupon(null);
      setCouponValidationStatus("idle");
      setFreeCouponNoticeAgreed(false);
    }
    setFormError("");
  };

  const handleCouponCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const couponCode = normalizeDayNammeCouponCode(event.target.value);
    setFormValues((current) => ({ ...current, couponCode }));
    setValidatedCoupon(null);
    setScheduleLimitedCoupon(null);
    setCouponValidationStatus(couponCode ? "idle" : "invalid");
    setFreeCouponNoticeAgreed(false);
    setFormError("");
  };

  const handleValidateCoupon = async () => {
    const couponCodeSuffix = normalizeDayNammeCouponCode(formValues.couponCode);

    if (couponCodeSuffix.length !== DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH) {
      setCouponValidationStatus("invalid");
      setValidatedCoupon(null);
      setFormError("쿠폰 번호 8자리를 입력해주세요.");
      return;
    }

    if (!formValues.staffScheduleId) {
      setCouponValidationStatus("validating");
      setValidatedCoupon(null);
      setFormError("");

      try {
        const result = await requestCouponScheduleLookup(
          buildDayNammeCouponCode(couponCodeSuffix)
        );
        const targetIds = getCouponTargetScheduleIds(result);
        if (targetIds.length === 0) {
          setCouponValidationStatus("invalid");
          setFormError("먼저 신청할 회차를 선택해주세요.");
          return;
        }

        setScheduleLimitedCoupon(result);
        setCouponValidationStatus("valid");
        setCurrentStepIndex(1);
        setFormValues((current) => ({
          ...current,
          hasCoupon: true,
          couponCode: normalizeDayNammeCouponCode(result.code || couponCodeSuffix),
        }));
      } catch (error) {
        setCouponValidationStatus("invalid");
        setScheduleLimitedCoupon(null);
        setFormError(
          error instanceof Error ? error.message : DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE
        );
      }
      return;
    }

    setCouponValidationStatus("validating");
    setValidatedCoupon(null);
    setFormError("");

    try {
      await delay(COUPON_VALIDATE_DELAY_MS);
      const result = await requestCouponValidation(
        buildDayNammeCouponCode(couponCodeSuffix),
        formValues.staffScheduleId
      );
      setCouponValidationStatus("valid");
      setValidatedCoupon(result);
      setScheduleLimitedCoupon(
        getCouponTargetScheduleIds(result).length > 0 ? result : null
      );
      setFormValues((current) => ({
        ...current,
        couponCode: normalizeDayNammeCouponCode(result.code),
      }));
      trackEvent("DN_ValidateCoupon", {
        code: result.code,
        discount_label: result.discount_label || "",
      });
    } catch (error) {
      const payload = error instanceof CouponValidationError ? error.payload : null;
      if (payload && getCouponTargetScheduleIds(payload).length > 0) {
        setScheduleLimitedCoupon(payload);
        setCurrentStepIndex(1);
      }
      setCouponValidationStatus("invalid");
      setValidatedCoupon(null);
      setFormError(
        error instanceof Error ? error.message : DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE
      );
    }
  };

  const handleMoveToCouponTargetSchedule = async () => {
    const targetSchedule = scheduleData.find(
      (schedule) =>
        scheduleLimitedTargetIds.includes(schedule.staffScheduleId) &&
        isDayNammeScheduleSelectable(schedule, formValues.gender)
    );

    if (!targetSchedule) {
      setFormError("현재 선택 가능한 쿠폰 대상 회차가 없습니다.");
      return;
    }

    const scheduleLabel = getDayNammeScheduleLabel(targetSchedule);
    setFormValues((current) => ({
      ...current,
      schedule: scheduleLabel,
      staffScheduleId: targetSchedule.staffScheduleId,
      birthYear: isDayNammeBirthYearAllowed(current.birthYear, targetSchedule)
        ? current.birthYear
        : "",
    }));

    const isValidForSchedule = await validateCouponForSchedule(targetSchedule);
    if (isValidForSchedule) {
      setFormError("");
    }
  };

  const canProceed = (() => {
    switch (currentStepKey) {
      case "gender":
        return formValues.gender !== "";
      case "schedule":
        return (
          formValues.schedule !== "" &&
          (!isWaitlistApplication ||
            confirmedWaitlistSchedule === formValues.schedule)
        );
      case "waitlist_contact":
        return (
          formValues.name.trim() !== "" &&
          formValues.phone.replace(/\D/g, "").length === 11
        );
      case "coupon_choice":
        return formValues.hasCoupon !== null;
      case "coupon_code":
        if (isScheduleLimitedCouponMode && !formValues.staffScheduleId) {
          return (
            couponValidationStatus === "valid" &&
            scheduleLimitedTargetIds.length > 0 &&
            normalizeDayNammeCouponCode(formValues.couponCode).length ===
              DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH
          );
        }
        return (
          couponValidationStatus === "valid" &&
          Boolean(validatedCoupon) &&
          validatedCoupon?.code ===
            buildDayNammeCouponCode(
              normalizeDayNammeCouponCode(formValues.couponCode)
            )
        );
      case "free_coupon_notice":
        return freeCouponNoticeAgreed;
      case "profile":
        return (
          formValues.name.trim() !== "" &&
          formValues.birthYear !== "" &&
          isSelectedBirthYearAllowed &&
          formValues.height.trim() !== "" &&
          formValues.phone.replace(/\D/g, "").length === 11 &&
          formValues.traits.trim() !== "" &&
          formValues.acquisitionChannel !== "" &&
          (formValues.acquisitionChannel !== "기타" ||
            formValues.acquisitionChannelOther.trim() !== "")
        );
      case "photo":
        return formValues.photo !== null && !isOptimizingPhoto;
      case "approval":
        return agreements[0];
      case "marketing":
        return agreements[1];
      case "notice":
        return agreements[2];
      default:
        return false;
    }
  })();

  const getSubmitBlockingStep = (wantsCoupon: boolean): FlowStepKey | null => {
    if (!formValues.gender) return "gender";
    if (
      !formValues.schedule ||
      !formValues.staffScheduleId ||
      (isWaitlistApplication &&
        confirmedWaitlistSchedule !== formValues.schedule)
    ) {
      return "schedule";
    }

    if (isWaitlistApplication) {
      if (
        !formValues.name.trim() ||
        formValues.phone.replace(/\D/g, "").length !== 11
      ) {
        return "waitlist_contact";
      }
      return null;
    }

    if (formValues.hasCoupon === null) return "coupon_choice";
    if (wantsCoupon) {
      const normalizedCouponCode = buildDayNammeCouponCode(
        normalizeDayNammeCouponCode(formValues.couponCode)
      );
      if (
        couponValidationStatus !== "valid" ||
        !validatedCoupon ||
        typeof validatedCoupon.id !== "number" ||
        validatedCoupon.code !== normalizedCouponCode
      ) {
        return "coupon_code";
      }
      if (isValidatedFreeCoupon && !freeCouponNoticeAgreed) {
        return "free_coupon_notice";
      }
    }

    if (
      !formValues.name.trim() ||
      !formValues.birthYear ||
      !isSelectedBirthYearAllowed ||
      !formValues.height.trim() ||
      formValues.phone.replace(/\D/g, "").length !== 11 ||
      !formValues.traits.trim() ||
      !formValues.acquisitionChannel ||
      (formValues.acquisitionChannel === "기타" &&
        !formValues.acquisitionChannelOther.trim())
    ) {
      return "profile";
    }
    if (!formValues.photo || isOptimizingPhoto) return "photo";
    if (!agreements[0]) return "approval";
    if (!agreements[1]) return "marketing";
    if (!agreements[2]) return "notice";
    return null;
  };

  const handleSubmit = async () => {
    const wantsCoupon = !isWaitlistApplication && formValues.hasCoupon === true;
    const normalizedCouponCode = buildDayNammeCouponCode(
      normalizeDayNammeCouponCode(formValues.couponCode)
    );
    const blockingStep = getSubmitBlockingStep(wantsCoupon);

    if (blockingStep) {
      const blockingStepIndex = flowSteps.indexOf(blockingStep);
      trackApplyAnalyticsEvent("dn_apply_step_blocked", {
        ...buildStepAnalyticsParams(
          blockingStep,
          blockingStepIndex >= 0 ? blockingStepIndex + 1 : displayStep
        ),
        error_reason: getBlockingReason(blockingStep),
        result: "blocked",
      });
      if (blockingStep === "profile" || blockingStep === "waitlist_contact") {
        setShowFieldErrors(true);
      }
      goToStep(blockingStep);
      setFormError(
        blockingStep === "coupon_code"
          ? "쿠폰 확인을 완료해주세요."
          : blockingStep === "free_coupon_notice"
            ? "무료초대 노쇼 안내를 확인하고 동의해주세요."
            : blockingStep === "photo"
              ? "프로필 사진을 업로드해주세요."
              : "필수 정보를 입력해주세요."
      );
      return;
    }

    if (wantsCoupon) {
      if (
        couponValidationStatus !== "valid" ||
        !validatedCoupon ||
        typeof validatedCoupon.id !== "number" ||
        validatedCoupon.code !== normalizedCouponCode
      ) {
        trackApplyAnalyticsEvent("dn_apply_step_blocked", {
          ...buildStepAnalyticsParams("coupon_code"),
          error_reason: "coupon_not_validated",
          result: "blocked",
        });
        setFormError("쿠폰 확인을 완료해주세요.");
        return;
      }

      if (isValidatedFreeCoupon && !freeCouponNoticeAgreed) {
        trackApplyAnalyticsEvent("dn_apply_step_blocked", {
          ...buildStepAnalyticsParams("free_coupon_notice"),
          error_reason: "free_coupon_notice_required",
          result: "blocked",
        });
        setFormError("무료초대 노쇼 안내를 확인하고 동의해주세요.");
        return;
      }
    }

    trackApplyAnalyticsEvent("dn_apply_submit_start", {
      step_key: currentStepKey,
      step_index: displayStep,
      step_total: totalSteps,
    });

    setSubmitState((current) => ({
      ...current,
      status: "submitting",
      message: "",
      checkout: null,
      applicationMode: selectedApplicationMode,
    }));
    setFormError("");

    const clientRequestId = createClientRequestId();
    const completeRegistrationEventId = buildDayNammaeMetaEventId(
      "CompleteRegistration",
      clientRequestId
    );
    const checkoutEventId = buildDayNammaeMetaEventId(
      "InitiateCheckout",
      clientRequestId
    );
    const clientDebugContext = buildClientDebugContext(formValues.photo, clientRequestId);
    let submitStage = submitState.applicationSubmitted
      ? "client:coupon-use:retry"
      : "client:prepare";
    let applicationSubmitted = submitState.applicationSubmitted;
    let submitResult: unknown = null;

    try {
      if (!applicationSubmitted) {
        const urlSearchParams =
          typeof window !== "undefined"
            ? getSafeSearchParams(window.location.search)
            : new URLSearchParams();
        const requestBody = new FormData();
        const fbp = getCookieValue("_fbp");
        const fbc = getCookieValue("_fbc");
        requestBody.append("gender", formValues.gender);
        requestBody.append("schedule", formValues.schedule);
        if (formValues.staffScheduleId) {
          requestBody.append("staffScheduleId", formValues.staffScheduleId);
        }
        requestBody.append("name", formValues.name.trim());
        requestBody.append("phone", formValues.phone.trim());
        requestBody.append("utm_source", urlSearchParams.get("utm_source") || "");
        requestBody.append("utm_medium", urlSearchParams.get("utm_medium") || "");
        requestBody.append("utm_content", urlSearchParams.get("utm_content") || "");
        requestBody.append("applicationMode", selectedApplicationMode);
        if (!isWaitlistApplication) {
          requestBody.append("birthYear", formValues.birthYear);
          requestBody.append("height", formValues.height.trim());
          requestBody.append("traits", formValues.traits.trim());
          requestBody.append("acquisitionChannel", formValues.acquisitionChannel);
          requestBody.append(
            "acquisitionChannelOther",
            formValues.acquisitionChannel === "기타"
              ? formValues.acquisitionChannelOther.trim()
              : ""
          );
          requestBody.append("photo", formValues.photo as File);
        }
        if (fbp) {
          requestBody.append("fbp", fbp);
        }
        if (fbc) {
          requestBody.append("fbc", fbc);
        }
        requestBody.append("client_request_id", clientRequestId);
        requestBody.append(
          "meta_complete_registration_event_id",
          completeRegistrationEventId
        );
        requestBody.append("meta_checkout_event_id", checkoutEventId);
        if (wantsCoupon && validatedCoupon) {
          requestBody.append("usedCouponId", String(validatedCoupon.id));
          requestBody.append("couponCode", validatedCoupon.code);
          if (isValidatedFreeCoupon) {
            requestBody.append("freeCouponNoShowAgreement", "true");
          }
        }
        if (clientDebugContext) {
          requestBody.append("debug_client_context", JSON.stringify(clientDebugContext));
        }

        submitStage = "client:fetch:start";
        const response = await submitDayNammeApplyRequest({
          requestBody,
          clientRequestId,
          inAppBrowserName,
        });

        submitStage = "client:response:received";
        const { result, meta } = await parseSubmitResponse(response);
        submitResult = result;
        submitStage = meta.parseError
          ? "client:response:parse_error"
          : "client:response:parsed";

        if (!response.ok) {
          submitStage = "client:response:not_ok";
          const requestId = meta.requestId;
          const userMessage = buildResponseFailureMessage(meta, formValues.photo);
          if (getResponseApplicationSubmitted(result)) {
            applicationSubmitted = true;
          }

          console.error("[day-nammae submit failed]", {
            clientRequestId,
            requestId,
            submitStage,
            result,
            responseStatus: meta.responseStatus,
            responseContentType: meta.responseContentType,
            responseTextSnippet: meta.responseTextSnippet,
            responseUrl: meta.responseUrl,
            parseError: meta.parseError,
            clientDebugContext,
          });

          throw createHandledSubmitError(userMessage, {
            requestId,
            clientRequestId: meta.clientRequestId || clientRequestId,
            responseStatus: meta.responseStatus,
            responseContentType: meta.responseContentType,
            responseTextSnippet: meta.responseTextSnippet,
            responseUrl: meta.responseUrl,
            parseError: meta.parseError,
            stage: submitStage,
          });
        }

        submitStage = "client:apply:success";
        applicationSubmitted = true;
        trackEvent("DN_SubmitApplication", {
          gender: formValues.gender,
          schedule: formValues.schedule,
          has_coupon: wantsCoupon,
          application_mode: selectedApplicationMode,
        });
        trackApplyAnalyticsEvent("dn_apply_submit_success", {
          result: "success",
          application_submitted: "true",
        });
        trackDayNammaeMetaStandardEvent("CompleteRegistration", {
          value: BASE_PRICE,
          eventId: completeRegistrationEventId,
          schedule: formValues.schedule,
          couponApplied: wantsCoupon,
          couponLabel: validatedCoupon?.discount_label,
        });
      }

      let checkoutSource: Partial<CouponValidationResult & CouponUseResult> | null = null;

      if (!isWaitlistApplication && wantsCoupon && validatedCoupon) {
        checkoutSource = getEdgeCouponUse(submitResult);

        if (!checkoutSource) {
          submitStage = "client:coupon-use:start";
          checkoutSource = await requestCouponUse(
            validatedCoupon.code,
            formValues.staffScheduleId
          );
          submitStage = "client:coupon-use:success";
        }
        trackEvent("DN_UseCoupon", {
          code: checkoutSource.code || validatedCoupon.code,
          discount_label: checkoutSource.discount_label || "",
        });
      }

      if (isWaitlistApplication) {
        trackApplyAnalyticsEvent("dn_waitlist_submit_success", {
          result: "success",
        });
        setSubmitState({
          status: "success",
          message: DEFAULT_WAITLIST_SUBMIT_SUCCESS_MESSAGE,
          checkout: null,
          applicationSubmitted,
          applicationMode: selectedApplicationMode,
        });
        return;
      }

      if (!couponRequiresPayment(checkoutSource)) {
        trackApplyAnalyticsEvent("dn_apply_complete_without_payment", {
          result: "success",
          payment_required: "false",
        });
        setSubmitState({
          status: "success",
          message:
            "무료 초대권 신청이 접수되었습니다. 운영진 확인 후 참가확정 알림톡을 보내드릴게요.",
          checkout: null,
          applicationSubmitted,
          applicationMode: selectedApplicationMode,
        });
        return;
      }

      const checkout = buildCheckoutState(
        formValues.schedule,
        checkoutSource,
        clientRequestId
      );
      trackApplyAnalyticsEvent("dn_checkout_ready", {
        result: "success",
        payment_required: "true",
        coupon_applied: checkout.isDiscounted ? "true" : "false",
        checkout_value: checkout.value,
      });

      setSubmitState({
        status: "success",
        message: "신청이 정상적으로 접수되었습니다. 검토 후 안내 메시지를 보내드릴게요.",
        checkout,
        applicationSubmitted,
        applicationMode: selectedApplicationMode,
      });
    } catch (error) {
      const {
        alreadyReported,
        requestId,
        clientRequestId: capturedClientRequestId,
        responseStatus,
        responseContentType,
        responseTextSnippet,
        responseUrl,
        parseError,
        stage,
        transportContext,
      } = getHandledSubmitErrorState(error);
      const supportCode = requestId || capturedClientRequestId || clientRequestId;

      if (!alreadyReported) {
        Sentry.withScope((scope) => {
          scope.setTag("feature", "day-nammae-apply");
          scope.setTag("submit_stage", stage || submitStage);
          scope.setTag("coupon_flow", wantsCoupon ? "with_coupon" : "without_coupon");
          scope.setTag("application_submitted", applicationSubmitted ? "true" : "false");
          scope.setTag(
            "client_request_id",
            capturedClientRequestId || clientRequestId
          );
          if (requestId) {
            scope.setTag("request_id", requestId);
          }
          if (responseStatus) {
            scope.setTag("response_status", String(responseStatus));
          }
          if (transportContext?.failureKind) {
            scope.setTag("submit_failure_kind", transportContext.failureKind);
          }
          if (transportContext?.errorName) {
            scope.setTag("submit_error_name", transportContext.errorName);
          }
          if (typeof transportContext?.retryAttempted === "boolean") {
            scope.setTag(
              "submit_retry_attempted",
              String(transportContext.retryAttempted)
            );
          }
          scope.setFingerprint([
            "day-nammae-submit",
            stage || submitStage || "unknown",
            String(responseStatus || 0),
          ]);
          scope.setContext(
            "submit_client_context",
            clientDebugContext || buildClientDebugContext(formValues.photo, clientRequestId)
          );
          scope.setContext("submit_response_context", {
            responseStatus,
            responseContentType,
            responseTextSnippet,
            responseUrl,
            parseError,
          });
          if (transportContext) {
            scope.setContext("submit_transport_context", {
              ...transportContext,
            });
          }
          Sentry.captureException(
            error instanceof Error ? error : new Error("Unknown client submit error")
          );
        });
      }

      console.error("[day-nammae submit exception]", {
        error,
        clientRequestId,
        supportCode,
        submitStage,
        responseStatus,
        responseContentType,
        responseTextSnippet,
        responseUrl,
        parseError,
        applicationSubmitted,
        transportContext,
      });

      const errorMessage =
        applicationSubmitted && wantsCoupon
          ? buildCouponUseErrorMessage(
              error instanceof Error ? error.message : ""
            )
          : error instanceof Error
            ? error.message
            : buildSubmitErrorMessage(supportCode);

      trackApplyAnalyticsEvent("dn_apply_submit_error", {
        result: "error",
        error_reason: stage || submitStage || "unknown",
        response_status: responseStatus || 0,
        application_submitted: applicationSubmitted ? "true" : "false",
      });

      setSubmitState({
        status: "error",
        message: errorMessage,
        checkout: null,
        applicationSubmitted,
        applicationMode: selectedApplicationMode,
      });
    }
  };

  const handleNext = () => {
    if (
      (currentStepKey === "profile" || currentStepKey === "waitlist_contact") &&
      !canProceed
    ) {
      trackApplyAnalyticsEvent("dn_apply_step_blocked", {
        ...buildStepAnalyticsParams(),
        error_reason: getBlockingReason(currentStepKey),
        result: "blocked",
      });
      setShowFieldErrors(true);
      return;
    }

    if (!canProceed) {
      trackApplyAnalyticsEvent("dn_apply_step_blocked", {
        ...buildStepAnalyticsParams(),
        error_reason: getBlockingReason(currentStepKey),
        result: "blocked",
      });
      return;
    }

    if (isLastStep) {
      if (currentStepKey === "notice") {
        trackEvent("DN_Step8_AcceptNotice");
      }
      if (currentStepKey === "free_coupon_notice") {
        trackEvent("DN_AcceptFreeCouponNotice");
      }
      if (currentStepKey === "waitlist_contact") {
        trackEvent("DN_WaitlistAlertSubmit", {
          schedule: formValues.schedule,
          gender: formValues.gender,
        });
      }
      trackApplyAnalyticsEvent("dn_apply_step_complete", {
        ...buildStepAnalyticsParams(),
        result: "success",
      });
      void handleSubmit();
      return;
    }

    if (currentStepKey === "coupon_choice") {
      if (formValues.hasCoupon === true) {
        trackEvent("DN_SelectCoupon", { has_coupon: true });
        trackApplyAnalyticsEvent("dn_apply_step_complete", {
          ...buildStepAnalyticsParams(),
          result: "success",
        });
        setCurrentStepIndex(currentStepIndex + 1);
        setFormError("");
        return;
      }

      trackEvent("DN_SelectCoupon", { has_coupon: false });
      trackApplyAnalyticsEvent("dn_apply_step_complete", {
        ...buildStepAnalyticsParams(),
        result: "success",
      });
      setCurrentStepIndex(currentStepIndex + 1);
      setFormError("");
      return;
    }

    if (currentStepKey === "coupon_code") {
      trackEvent("DN_ConfirmCoupon", {
        code: validatedCoupon?.code || "",
        discount_label: validatedCoupon?.discount_label || "",
      });
      trackApplyAnalyticsEvent("dn_apply_step_complete", {
        ...buildStepAnalyticsParams(),
        result: "success",
        coupon_valid: "true",
        discount_label: validatedCoupon?.discount_label || "",
      });
      setCurrentStepIndex(currentStepIndex + 1);
      setFormError("");
      return;
    }

    if (currentStepKey === "free_coupon_notice") {
      trackEvent("DN_AcceptFreeCouponNotice");
      trackApplyAnalyticsEvent("dn_apply_step_complete", {
        ...buildStepAnalyticsParams(),
        result: "success",
      });
      setCurrentStepIndex(currentStepIndex + 1);
      setFormError("");
      return;
    }

    const stepEvents: Partial<Record<FlowStepKey, () => void>> = {
      gender: () => trackEvent("DN_SelectGender", { gender: formValues.gender }),
      schedule: () => trackEvent("DN_SelectSchedule", { schedule: formValues.schedule }),
      profile: () => trackEvent("DN_CompleteProfile"),
      photo: () => trackEvent("DN_UploadPhoto"),
      approval: () => trackEvent("DN_AcceptApproval"),
      marketing: () => trackEvent("DN_AcceptMarketing"),
    };
    stepEvents[currentStepKey]?.();

    if (
      currentStepKey === "schedule" &&
      selectedScheduleItem &&
      isWaitlistApplication &&
      confirmedWaitlistSchedule !== formValues.schedule
    ) {
      trackApplyAnalyticsEvent("dn_apply_step_blocked", {
        ...buildStepAnalyticsParams(),
        error_reason: "waitlist_confirmation_required",
        result: "blocked",
      });
      setWaitlistModalSchedule(selectedScheduleItem);
      return;
    }

    trackApplyAnalyticsEvent("dn_apply_step_complete", {
      ...buildStepAnalyticsParams(),
      result: "success",
    });
    setShowFieldErrors(false);
    setCurrentStepIndex(currentStepIndex + 1);
    setFormError("");
  };

  const handleBack = () => {
    if (currentStepIndex === 0) {
      closeFlow();
      return;
    }

    setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
    setFormError("");
  };

  if (
    submitState.status === "success" &&
    submitState.applicationMode === "waitlist_alert"
  ) {
    return (
      <ApplyStepShell
        mode={mode}
        currentStep={totalSteps}
        totalSteps={totalSteps}
        title="알림신청이 완료되었어요"
        description="지금은 마감된 일정이라 신청 가능한 자리가 생기면 다시 안내드립니다."
        canProceed={true}
        hideNav
        onNext={() => {}}
        onBack={() => {}}
      >
        <div className="rounded-2xl border border-[#F6C66A]/25 bg-[#F6C66A]/10 px-5 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#FFE2A4]/80">
            ALERT
          </p>
          <p className="mt-3 text-base font-bold text-white">{formValues.schedule}</p>
          <p className="mt-1 text-sm text-white/70">
            {formValues.name} · {formValues.phone}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-left text-sm leading-relaxed text-white/68">
          <p>{submitState.message}</p>
          <p className="mt-3">
            실제 신청과 결제는 이 단계에서 진행되지 않습니다.
          </p>
          <p className="mt-2">
            신청 가능한 자리가 생기면 링크를 다시 보내드리고, 그때 기존 신청 절차를 진행하시면 됩니다.
          </p>
        </div>

        <button
          type="button"
          onClick={resetFlow}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 text-sm font-medium text-white/70 transition active:scale-[0.98]"
        >
          다른 일정도 보기
        </button>
      </ApplyStepShell>
    );
  }

  if (submitState.status === "success" && !submitState.checkout) {
    return (
      <ApplyStepShell
        mode={mode}
        currentStep={totalSteps}
        totalSteps={totalSteps}
        title="무료초대 신청이 접수되었어요"
        description="운영진 확인 후 참가확정 알림톡을 보내드립니다."
        canProceed={true}
        hideNav
        onNext={() => {}}
        onBack={() => {}}
      >
        <div className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-5 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
            RECEIVED
          </p>
          <p className="mt-3 text-base font-bold text-white">{formValues.schedule}</p>
          <p className="mt-1 text-sm text-white/70">
            {formValues.name} · {formValues.phone}
          </p>
          {validatedCoupon?.discount_label && (
            <div className="mt-4 inline-flex rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
              {validatedCoupon.discount_label}
            </div>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-left text-sm leading-relaxed text-white/68">
          <p>{submitState.message}</p>
          <p className="mt-3">
            최종 확정 후 모임 입장에 필요한 티켓과 웹앱 링크는 모임일 하루 전 알림톡으로 안내됩니다.
          </p>
          <p className="mt-2">
            참석이 어려우신 경우, 모임 하루 전까지 우측 하단 상담 버튼으로 꼭 알려주세요.
          </p>
        </div>

        <button
          type="button"
          onClick={resetFlow}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 text-sm font-medium text-white/70 transition active:scale-[0.98]"
        >
          다른 일정도 보기
        </button>
      </ApplyStepShell>
    );
  }

  if (submitState.status === "success" && submitState.checkout) {
    const checkout = submitState.checkout;

    return (
      <ApplyStepShell
        mode={mode}
        currentStep={totalSteps}
        totalSteps={totalSteps}
        title="결제를 진행해주세요"
        description="결제까지 진행해주셔야 신청이 완료됩니다."
        canProceed={true}
        hideNav
        onNext={() => {}}
        onBack={() => {}}
      >
        <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            신청 내역
          </p>
          <p className="mt-3 text-base font-bold text-white">{formValues.schedule}</p>
          <p className="mt-1 text-sm text-white/70">
            {formValues.name} · {formValues.phone}
          </p>
          {checkout.isDiscounted && checkout.couponLabel && (
            <div className="mt-4 inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              {checkout.couponLabel}
            </div>
          )}
        </div>

        <div className="mt-5 px-1 text-left text-sm leading-relaxed text-white/60">
          <p>• 결제가 완료된 순서대로 참가자를 승인해드립니다.</p>
          <p className="mt-1">
            • 결제 완료 후 &apos;참가 확정 메세지&apos;를 받으셔야 최종 확정입니다.
          </p>
          <p className="mt-1">• 승인/확정 처리까지 최대 24시간이 소요될 수 있습니다.</p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-center">
          {checkout.isDiscounted ? (
            <>
              <p className="text-sm font-medium text-white/45 line-through">
                {formatPrice(checkout.originalPrice)}
              </p>
              <p className="mt-2 text-3xl font-black text-[#FFB1D4]">
                {formatPrice(checkout.finalPrice)}
              </p>
            </>
          ) : (
            <p className="text-3xl font-black text-white">
              {formatPrice(checkout.finalPrice)}
            </p>
          )}
        </div>

        <a
          href={checkout.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackApplyAnalyticsEvent("dn_checkout_click", {
              result: "success",
              payment_required: "true",
              coupon_applied: checkout.isDiscounted ? "true" : "false",
              checkout_value: checkout.value,
            });
            trackEvent("DN_InitiateCheckout", {
              schedule: formValues.schedule,
              coupon_applied: checkout.isDiscounted,
              coupon_label: checkout.couponLabel,
            });
            trackDayNammaeMetaStandardEvent("InitiateCheckout", {
              value: checkout.value,
              eventId: checkout.metaCheckoutEventId,
              schedule: formValues.schedule,
              couponApplied: checkout.isDiscounted,
              couponLabel: checkout.couponLabel,
            });
          }}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#FF6B9F] text-base font-bold text-white transition active:scale-[0.98]"
        >
          {checkout.buttonLabel}
        </a>

        <button
          type="button"
          onClick={resetFlow}
          className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 text-sm font-medium text-white/60 transition active:scale-[0.98]"
        >
          신청서 다시 작성하기
        </button>
      </ApplyStepShell>
    );
  }

  const stepConfig = STEP_CONFIG[currentStepKey];

  return (
    <ApplyStepShell
      mode={mode}
      currentStep={displayStep}
      totalSteps={totalSteps}
      title={stepConfig.title}
      description={stepConfig.description}
      canProceed={
        currentStepKey === "profile" || currentStepKey === "waitlist_contact"
          ? true
          : canProceed
      }
      isSubmitting={submitState.status === "submitting"}
      isLastStep={isLastStep}
      onNext={handleNext}
      onBack={handleBack}
    >
      {inAppBrowserName && (
        <div className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
          <p className="font-semibold text-amber-200">
            {getInAppBrowserLabel(inAppBrowserName)} 앱 안 브라우저를 사용 중입니다.
          </p>
          <p className="mt-2 leading-relaxed text-amber-50/90">
            사진 업로드가 중간에 끊길 수 있어요. 가능하면 우측 상단 메뉴에서 외부 브라우저로 열어 진행해주세요.
          </p>
        </div>
      )}

      {formError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </div>
      )}

      {currentStepKey === "photo" && photoNotice && (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {photoNotice}
        </div>
      )}

      {submitState.status === "error" && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {submitState.message}
        </div>
      )}

      {isLastStep && submitState.status === "submitting" && (
        <div className="mb-4 rounded-2xl border border-[#FF6B9F]/30 bg-[#FF6B9F]/10 px-4 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-[#FF6B9F]" />
            <div>
              <p className="text-sm font-semibold">
                {isWaitlistApplication
                  ? "알림신청을 접수하고 있어요"
                  : submitState.applicationSubmitted
                    ? "쿠폰을 처리하고 있어요"
                    : "신청서를 접수하고 있어요"}
              </p>
              <p className="mt-1 text-xs text-white/65">
                {isWaitlistApplication
                  ? "완료되면 알림신청 완료 화면으로 이동합니다."
                  : isValidatedFreeCoupon
                    ? "완료되면 무료초대 신청 접수 화면으로 이동합니다."
                    : "완료되면 바로 결제 단계로 넘어갑니다."}
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStepKey === "coupon_choice" && (
        <StepCouponChoice
          hasCoupon={formValues.hasCoupon}
          onSelect={handleCouponChoice}
        />
      )}

      {currentStepKey === "coupon_code" && (
        <>
          <StepCouponCode
            couponCode={formValues.couponCode}
            validationStatus={couponValidationStatus}
            validatedCoupon={validatedCoupon}
            scheduleLimitedCoupon={scheduleLimitedCoupon}
            targetScheduleAction={
              scheduleLimitedCoupon && scheduleLimitedTargetIds.length > 0
                ? {
                    label: "쿠폰 대상 회차로 이동",
                    onClick: handleMoveToCouponTargetSchedule,
                  }
                : null
            }
            onCodeChange={handleCouponCodeChange}
            onValidate={handleValidateCoupon}
          />

          {couponValidationStatus === "valid" && validatedCoupon && (
            <div className="mt-4 rounded-2xl border border-amber-400/35 bg-amber-500/10 px-4 py-4 text-sm leading-relaxed text-amber-100">
              <p className="font-semibold">신청 완료 전 꼭 확인해주세요.</p>
              <p className="mt-2">
                `신청 완료` 버튼을 누르면 이 쿠폰은 바로 사용 처리됩니다.
              </p>
              <p className="mt-1">
                사용 처리 후에는 이전 단계로 돌아가 쿠폰을 다시 수정할 수 없습니다.
              </p>
            </div>
          )}
        </>
      )}

      {currentStepKey === "free_coupon_notice" && (
        <StepAgreement
          section={DAY_NAMMAE_FREE_COUPON_NOTICE_SECTION}
          agreed={freeCouponNoticeAgreed}
          onAgreeChange={(agreed) => {
            setFreeCouponNoticeAgreed(agreed);
            trackApplyAnalyticsEvent("dn_apply_agreement_toggle", {
              ...buildStepAnalyticsParams("free_coupon_notice"),
              agreement_checked: agreed ? "true" : "false",
            });
          }}
        />
      )}

      {currentStepKey === "gender" && (
        <StepGender gender={formValues.gender} onSelect={handleGenderSelect} />
      )}

      {currentStepKey === "schedule" && (
        <StepSchedule
          scheduleData={scheduleData}
          isLoading={isLoadingSchedules}
          gender={formValues.gender}
          selectedSchedule={formValues.schedule}
          allowedScheduleIds={
            isScheduleLimitedCouponMode ? scheduleLimitedTargetIds : []
          }
          targetScheduleLabel={scheduleLimitedTargetLabel}
          onSelect={handleScheduleSelect}
        />
      )}

      {currentStepKey === "waitlist_contact" && (
        <StepWaitlistContact
          formValues={formValues}
          onValueChange={handleValueChange}
          showErrors={showFieldErrors}
        />
      )}

      {currentStepKey === "profile" && (
        <StepProfile
          formValues={formValues}
          onValueChange={handleValueChange}
          onAcquisitionChannelSelect={handleAcquisitionChannelSelect}
          onBirthYearSelect={handleBirthYearSelect}
          birthYears={selectedBirthYears}
          ageRangeLabel={selectedAgeRangeLabel}
          showErrors={showFieldErrors}
        />
      )}

      {currentStepKey === "photo" && (
        <StepPhoto
          photoPreviewUrl={photoPreviewUrl}
          isOptimizing={isOptimizingPhoto}
          onPhotoChange={handlePhotoChange}
        />
      )}

      {currentStepKey === "approval" && (
        <StepAgreement
          section={DAY_NAMMAE_NOTICE_SECTIONS[0]}
          agreed={agreements[0]}
          onAgreeChange={handleAgreementChange(0)}
        />
      )}

      {currentStepKey === "marketing" && (
        <StepAgreement
          section={DAY_NAMMAE_NOTICE_SECTIONS[1]}
          agreed={agreements[1]}
          onAgreeChange={handleAgreementChange(1)}
        />
      )}

      {currentStepKey === "notice" && (
        <StepAgreement
          section={DAY_NAMMAE_NOTICE_SECTIONS[2]}
          agreed={agreements[2]}
          onAgreeChange={handleAgreementChange(2)}
        />
      )}

      {waitlistModalSchedule && (
        <WaitlistConfirmModal
          scheduleLabel={getDayNammeScheduleLabel(waitlistModalSchedule)}
          onClose={() => setWaitlistModalSchedule(null)}
          onConfirm={handleWaitlistConfirm}
        />
      )}
    </ApplyStepShell>
  );
}
