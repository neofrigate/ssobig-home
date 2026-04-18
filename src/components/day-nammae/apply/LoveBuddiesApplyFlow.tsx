"use client";

import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import {
  buildDayNammeCouponCode,
  DAY_NAMMAE_COUPON_CODE_SUFFIX_LENGTH,
  normalizeDayNammeCouponCode,
} from "@/features/day-nammae/coupon";
import { DAY_NAMMAE_NOTICE_SECTIONS } from "@/features/day-nammae/constants";
import {
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
import { safeFbq } from "@/utils/metaPixel";
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
  safeFbq("trackCustom", eventName, params);
}

function trackCompleteRegistration() {
  if (typeof window === "undefined") {
    return;
  }

  safeFbq("track", "CompleteRegistration", {
    content_name: "일일남매",
  });
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

type FlowStepKey =
  | "gender"
  | "schedule"
  | "waitlist_contact"
  | "coupon_choice"
  | "coupon_code"
  | "profile"
  | "photo"
  | "approval"
  | "marketing"
  | "notice";

const WAITLIST_ALERT_FLOW_STEPS: FlowStepKey[] = [
  "gender",
  "schedule",
  "waitlist_contact",
];

function getNormalFlowSteps(hasCoupon: boolean | null): FlowStepKey[] {
  return [
    "gender",
    "schedule",
    "coupon_choice",
    ...(hasCoupon === true ? ["coupon_code" as const] : []),
    "profile",
    "photo",
    "approval",
    "marketing",
    "notice",
  ];
}
const MAX_PHOTO_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_PHOTO_FILE_SIZE_LABEL = "4MB";
const MAX_PHOTO_DIMENSION = 1600;
const INITIAL_PHOTO_JPEG_QUALITY = 0.82;
const MIN_PHOTO_JPEG_QUALITY = 0.56;
const HEIC_HEIF_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const HEIC_HEIF_FILE_PATTERN = /\.(heic|heif)$/i;
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
  name: "",
  birthYear: "",
  height: "",
  phone: "",
  traits: "",
  photo: null,
  hasCoupon: null,
  couponCode: "",
};

function createInitialFormValues(initialCouponCode = ""): DayNammeFormValues {
  if (!initialCouponCode) {
    return { ...INITIAL_FORM_VALUES };
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

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }

  return `${bytes}B`;
}

function buildPhotoTooLargeMessage(size: number) {
  return `사진 용량은 ${MAX_PHOTO_FILE_SIZE_LABEL} 이하만 업로드할 수 있습니다. 현재 파일은 ${formatFileSize(size)}입니다. 용량을 줄인 뒤 다시 시도해주세요.`;
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

async function convertHeicToJpeg(file: File) {
  try {
    const { default: heic2any } = await import("heic2any");
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

async function compressPhotoForUpload(file: File) {
  if (typeof window === "undefined") {
    return {
      file,
      wasCompressed: false,
      wasConverted: false,
      originalSize: file.size,
      preparedSize: file.size,
    };
  }

  const originalSize = file.size;
  const workingFile = isHeicLikeFile(file) ? await convertHeicToJpeg(file) : file;

  if (workingFile.size <= MAX_PHOTO_FILE_SIZE_BYTES) {
    return {
      file: workingFile,
      wasCompressed: false,
      wasConverted: workingFile !== file,
      originalSize,
      preparedSize: workingFile.size,
    };
  }

  const image = await loadImageFromFile(workingFile);
  let width = image.naturalWidth;
  let height = image.naturalHeight;
  const longestEdge = Math.max(width, height);

  if (longestEdge > MAX_PHOTO_DIMENSION) {
    const scale = MAX_PHOTO_DIMENSION / longestEdge;
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  let quality = INITIAL_PHOTO_JPEG_QUALITY;
  let blob = await renderCompressedPhoto(image, width, height, quality);

  while (blob.size > MAX_PHOTO_FILE_SIZE_BYTES) {
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

  if (blob.size > MAX_PHOTO_FILE_SIZE_BYTES) {
    throw new Error(
      "사진 자동 최적화 후에도 용량이 너무 큽니다. 다른 사진을 선택하거나 편집 후 다시 시도해주세요."
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

  return {
    clientRequestId,
    submittedAt: new Date().toISOString(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: window.navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
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

function summarizeResponseText(text: string) {
  const normalizedText = text.replace(/\s+/g, " ").trim();

  if (normalizedText.length <= 280) {
    return normalizedText;
  }

  return `${normalizedText.slice(0, 277)}...`;
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

async function requestCouponValidation(code: string) {
  const response = await fetch(`${getDayNammeCouponApiBaseUrl()}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const payload = await parseJsonResponse<CouponValidationResult | Record<string, unknown>>(
    response
  );

  if (!response.ok) {
    throw new Error(
      getCouponReason(payload, DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE)
    );
  }

  if (!payload || typeof payload !== "object") {
    throw new Error(DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE);
  }

  if (!("valid" in payload) || payload.valid !== true) {
    throw new Error(getCouponReason(payload, "사용할 수 없는 쿠폰입니다."));
  }

  if (!("id" in payload) || typeof payload.id !== "number") {
    throw new Error(DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE);
  }

  return payload as CouponValidationResult;
}

async function requestCouponUse(code: string) {
  const response = await fetch(`${getDayNammeCouponApiBaseUrl()}/use`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
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

function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function buildCheckoutState(
  scheduleLabel: string,
  coupon?: Partial<CouponValidationResult & CouponUseResult> | null
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
  };
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
  const initialFormValues = createInitialFormValues(normalizedInitialCouponCode);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [photoNotice, setPhotoNotice] = useState("");
  const [isOptimizingPhoto, setIsOptimizingPhoto] = useState(false);
  const [formError, setFormError] = useState("");
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [agreements, setAgreements] = useState([false, false, false]);
  const [couponValidationStatus, setCouponValidationStatus] =
    useState<CouponValidationStatus>("idle");
  const [validatedCoupon, setValidatedCoupon] =
    useState<CouponValidationResult | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>(INITIAL_SUBMIT_STATE);
  const [waitlistModalSchedule, setWaitlistModalSchedule] =
    useState<ScheduleItem | null>(null);
  const [confirmedWaitlistSchedule, setConfirmedWaitlistSchedule] = useState("");

  const selectedScheduleItem =
    scheduleData.find(
      (schedule) => getDayNammeScheduleLabel(schedule) === formValues.schedule
    ) || null;
  const selectedApplicationMode: DayNammeApplicationMode = selectedScheduleItem
    ? getDayNammeScheduleApplicationMode(selectedScheduleItem, formValues.gender)
    : "normal";
  const isWaitlistApplication = selectedApplicationMode === "waitlist_alert";
  const flowSteps = isWaitlistApplication
    ? WAITLIST_ALERT_FLOW_STEPS
    : getNormalFlowSteps(formValues.hasCoupon);
  const currentStepKey = flowSteps[currentStepIndex] || flowSteps[0];
  const totalSteps = flowSteps.length;
  const displayStep = currentStepIndex + 1;
  const isLastStep = currentStepIndex === totalSteps - 1;

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
    if (!normalizedInitialCouponCode) {
      return;
    }

    setFormValues((current) => {
      if (
        current.couponCode === normalizedInitialCouponCode &&
        current.hasCoupon === true
      ) {
        return current;
      }

      return {
        ...current,
        hasCoupon: true,
        couponCode: normalizedInitialCouponCode,
      };
    });
  }, [normalizedInitialCouponCode]);

  const closeFlow = () => {
    if (mode === "page") {
      router.push("/offline/11namme");
      return;
    }

    onClose?.();
  };

  const resetFlow = () => {
    setSubmitState(INITIAL_SUBMIT_STATE);
    setCurrentStepIndex(0);
    setFormValues(initialFormValues);
    setAgreements([false, false, false]);
    setShowFieldErrors(false);
    setFormError("");
    setPhotoNotice("");
    setCouponValidationStatus("idle");
    setValidatedCoupon(null);
    setWaitlistModalSchedule(null);
    setConfirmedWaitlistSchedule("");
  };

  const handleValueChange =
    (field: "name" | "birthYear" | "height" | "phone" | "traits") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let nextValue = event.target.value;
      if (field === "phone") nextValue = formatPhoneNumber(nextValue);
      if (field === "height") nextValue = nextValue.replace(/\D/g, "").slice(0, 3);
      setFormValues((current) => ({ ...current, [field]: nextValue }));
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

    compressPhotoForUpload(file)
      .then(({ file: nextFile, wasCompressed, wasConverted, originalSize, preparedSize }) => {
        setFormValues((current) => ({ ...current, photo: nextFile }));
        const nextNotice = wasConverted
          ? wasCompressed
            ? buildPhotoConvertedAndCompressedMessage(originalSize, preparedSize)
            : buildPhotoConvertedMessage(originalSize, preparedSize)
          : wasCompressed
            ? buildPhotoCompressedMessage(originalSize, preparedSize)
            : "";

        setPhotoNotice(nextNotice);
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
        (schedule) => getDayNammeScheduleLabel(schedule) === current.schedule
      );
      const nextSchedule =
        currentSchedule && !isDayNammeScheduleSelectable(currentSchedule, gender)
          ? ""
          : current.schedule;
      return { ...current, gender, schedule: nextSchedule };
    });
    setFormError("");
    setShowFieldErrors(false);
    setWaitlistModalSchedule(null);
    setConfirmedWaitlistSchedule("");
    setCurrentStepIndex(1);
  };

  const handleScheduleSelect = (schedule: ScheduleItem) => {
    const scheduleLabel = getDayNammeScheduleLabel(schedule);

    setFormValues((current) => ({ ...current, schedule: scheduleLabel }));
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

    setCurrentStepIndex(2);
  };

  const handleWaitlistConfirm = () => {
    if (waitlistModalSchedule) {
      setConfirmedWaitlistSchedule(
        getDayNammeScheduleLabel(waitlistModalSchedule)
      );
    }
    setWaitlistModalSchedule(null);
    setCurrentStepIndex(2);
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
  };

  const handleCouponChoice = (nextValue: boolean) => {
    setFormValues((current) => ({
      ...current,
      hasCoupon: nextValue,
      couponCode: nextValue ? current.couponCode : "",
    }));
    if (!nextValue) {
      setValidatedCoupon(null);
      setCouponValidationStatus("idle");
    }
    setFormError("");
  };

  const handleCouponCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const couponCode = normalizeDayNammeCouponCode(event.target.value);
    setFormValues((current) => ({ ...current, couponCode }));
    setValidatedCoupon(null);
    setCouponValidationStatus(couponCode ? "idle" : "invalid");
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

    setCouponValidationStatus("validating");
    setValidatedCoupon(null);
    setFormError("");

    try {
      await delay(COUPON_VALIDATE_DELAY_MS);
      const result = await requestCouponValidation(
        buildDayNammeCouponCode(couponCodeSuffix)
      );
      setCouponValidationStatus("valid");
      setValidatedCoupon(result);
      setFormValues((current) => ({
        ...current,
        couponCode: normalizeDayNammeCouponCode(result.code),
      }));
      trackEvent("DN_ValidateCoupon", {
        code: result.code,
        discount_label: result.discount_label || "",
      });
    } catch (error) {
      setCouponValidationStatus("invalid");
      setValidatedCoupon(null);
      setFormError(
        error instanceof Error ? error.message : DEFAULT_COUPON_VALIDATE_ERROR_MESSAGE
      );
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
        return (
          couponValidationStatus === "valid" &&
          Boolean(validatedCoupon) &&
          validatedCoupon?.code ===
            buildDayNammeCouponCode(
              normalizeDayNammeCouponCode(formValues.couponCode)
            )
        );
      case "profile":
        return (
          formValues.name.trim() !== "" &&
          formValues.birthYear !== "" &&
          formValues.height.trim() !== "" &&
          formValues.phone.replace(/\D/g, "").length === 11 &&
          formValues.traits.trim() !== ""
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

  const handleSubmit = async () => {
    const wantsCoupon = !isWaitlistApplication && formValues.hasCoupon === true;
    const normalizedCouponCode = buildDayNammeCouponCode(
      normalizeDayNammeCouponCode(formValues.couponCode)
    );

    if (wantsCoupon) {
      if (
        couponValidationStatus !== "valid" ||
        !validatedCoupon ||
        typeof validatedCoupon.id !== "number" ||
        validatedCoupon.code !== normalizedCouponCode
      ) {
        setFormError("쿠폰 확인을 완료해주세요.");
        return;
      }
    }

    setSubmitState((current) => ({
      ...current,
      status: "submitting",
      message: "",
      checkout: null,
      applicationMode: selectedApplicationMode,
    }));
    setFormError("");

    const clientRequestId = createClientRequestId();
    const clientDebugContext = buildClientDebugContext(formValues.photo, clientRequestId);
    let submitStage = submitState.applicationSubmitted
      ? "client:coupon-use:retry"
      : "client:prepare";
    let applicationSubmitted = submitState.applicationSubmitted;

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
          requestBody.append("photo", formValues.photo as File);
        }
        if (fbp) {
          requestBody.append("fbp", fbp);
        }
        if (fbc) {
          requestBody.append("fbc", fbc);
        }
        requestBody.append("client_request_id", clientRequestId);
        if (wantsCoupon && validatedCoupon) {
          requestBody.append("usedCouponId", String(validatedCoupon.id));
        }
        if (clientDebugContext) {
          requestBody.append("debug_client_context", JSON.stringify(clientDebugContext));
        }

        submitStage = "client:fetch:start";
        const response = await fetch("/api/offline/day-nammae/apply", {
          method: "POST",
          body: requestBody,
        });

        submitStage = "client:response:received";
        const { result, meta } = await parseSubmitResponse(response);
        submitStage = meta.parseError
          ? "client:response:parse_error"
          : "client:response:parsed";

        if (!response.ok) {
          submitStage = "client:response:not_ok";
          const requestId = meta.requestId;
          const userMessage = buildResponseFailureMessage(meta, formValues.photo);

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
        trackCompleteRegistration();
      }

      let checkoutSource: Partial<CouponValidationResult & CouponUseResult> | null = null;

      if (!isWaitlistApplication && wantsCoupon && validatedCoupon) {
        submitStage = "client:coupon-use:start";
        const usedCoupon = await requestCouponUse(validatedCoupon.code);
        submitStage = "client:coupon-use:success";
        checkoutSource = usedCoupon;
        trackEvent("DN_UseCoupon", {
          code: usedCoupon.code,
          discount_label: usedCoupon.discount_label || "",
        });
      }

      if (isWaitlistApplication) {
        setSubmitState({
          status: "success",
          message: DEFAULT_WAITLIST_SUBMIT_SUCCESS_MESSAGE,
          checkout: null,
          applicationSubmitted,
          applicationMode: selectedApplicationMode,
        });
        return;
      }

      const checkout = buildCheckoutState(formValues.schedule, checkoutSource);

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
      });

      const errorMessage =
        applicationSubmitted && wantsCoupon
          ? buildCouponUseErrorMessage(
              error instanceof Error ? error.message : ""
            )
          : error instanceof Error
            ? error.message
            : buildSubmitErrorMessage(supportCode);

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
      setShowFieldErrors(true);
      return;
    }

    if (isLastStep) {
      if (currentStepKey === "notice") {
        trackEvent("DN_Step8_AcceptNotice");
      }
      if (currentStepKey === "waitlist_contact") {
        trackEvent("DN_WaitlistAlertSubmit", {
          schedule: formValues.schedule,
          gender: formValues.gender,
        });
      }
      void handleSubmit();
      return;
    }

    if (currentStepKey === "coupon_choice") {
      if (formValues.hasCoupon === true) {
        trackEvent("DN_SelectCoupon", { has_coupon: true });
        setCurrentStepIndex((step) => step + 1);
        setFormError("");
        return;
      }

      trackEvent("DN_SelectCoupon", { has_coupon: false });
      setCurrentStepIndex((step) => step + 1);
      setFormError("");
      return;
    }

    if (currentStepKey === "coupon_code") {
      trackEvent("DN_ConfirmCoupon", {
        code: validatedCoupon?.code || "",
        discount_label: validatedCoupon?.discount_label || "",
      });
      setCurrentStepIndex((step) => step + 1);
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
      setWaitlistModalSchedule(selectedScheduleItem);
      return;
    }

    setShowFieldErrors(false);
    setCurrentStepIndex((step) => step + 1);
    setFormError("");
  };

  const handleBack = () => {
    if (currentStepIndex === 0) {
      closeFlow();
      return;
    }

    setCurrentStepIndex((step) => Math.max(0, step - 1));
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
            trackEvent("DN_InitiateCheckout", {
              schedule: formValues.schedule,
              coupon_applied: checkout.isDiscounted,
              coupon_label: checkout.couponLabel,
            });
            safeFbq("track", "InitiateCheckout", {
              value: checkout.value,
              currency: "KRW",
              content_name: "일일남매",
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

      {currentStepKey === "gender" && (
        <StepGender gender={formValues.gender} onSelect={handleGenderSelect} />
      )}

      {currentStepKey === "schedule" && (
        <StepSchedule
          scheduleData={scheduleData}
          isLoading={isLoadingSchedules}
          gender={formValues.gender}
          selectedSchedule={formValues.schedule}
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
          onBirthYearSelect={handleBirthYearSelect}
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
