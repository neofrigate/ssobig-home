"use client";

import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { DAY_NAMMAE_NOTICE_SECTIONS } from "@/features/day-nammae/constants";
import {
  getDayNammeScheduleLabel,
  isDayNammeScheduleSelectable,
} from "@/features/day-nammae/schedule";
import {
  DayNammeFormValues,
  ScheduleItem,
} from "@/features/day-nammae/types";
import { getSafeSearchParams } from "@/utils/utm";
import ApplyStepShell from "./ApplyStepShell";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function safeFbq(...args: unknown[]) {
  if (typeof window === "undefined" || !window.fbq) {
    return;
  }

  try {
    window.fbq(...args);
  } catch (error) {
    console.error("Meta Pixel 호출 실패:", error);
  }
}

function trackEvent(eventName: string, params?: Record<string, unknown>) {
  safeFbq("trackCustom", eventName, params);
}

function trackCompleteRegistration(formValues: DayNammeFormValues) {
  if (typeof window === "undefined") {
    return;
  }

  const phoneDigits = formValues.phone.replace(/\D/g, "");
  const metaPhone = phoneDigits.length === 11 ? `82${phoneDigits.slice(1)}` : "";
  const metaGender = formValues.gender === "남" ? "m" : "f";
  const metaBirthDate = `${formValues.birthYear}0101`;

  safeFbq("init", "1541266446734040", {
    fn: formValues.name.toLowerCase(),
    ph: metaPhone,
    db: metaBirthDate,
    ge: metaGender,
  });
  safeFbq("track", "CompleteRegistration", {
    content_name: "일일남매",
  });
}
import StepGender from "./steps/StepGender";
import StepSchedule from "./steps/StepSchedule";
import StepProfile from "./steps/StepProfile";
import StepPhoto from "./steps/StepPhoto";
import StepAgreement from "./steps/StepAgreement";

type ApplyFlowMode = "modal" | "page";

interface LoveBuddiesApplyFlowProps {
  mode: ApplyFlowMode;
  scheduleData: ScheduleItem[];
  isLoadingSchedules: boolean;
  onClose?: () => void;
}

interface SubmitState {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
}

const TOTAL_STEPS = 7;
const MAX_PHOTO_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_PHOTO_FILE_SIZE_LABEL = "4MB";
const MAX_PHOTO_DIMENSION = 1600;
const INITIAL_PHOTO_JPEG_QUALITY = 0.82;
const MIN_PHOTO_JPEG_QUALITY = 0.56;
const DEFAULT_SUBMIT_ERROR_MESSAGE =
  "신청서 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 채널톡으로 문의해주세요.";

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

const INITIAL_FORM_VALUES: DayNammeFormValues = {
  gender: "",
  schedule: "",
  name: "",
  birthYear: "",
  height: "",
  phone: "",
  traits: "",
  photo: null,
};

function buildSubmitErrorMessage(supportCode?: string) {
  if (!supportCode) {
    return DEFAULT_SUBMIT_ERROR_MESSAGE;
  }

  return `${DEFAULT_SUBMIT_ERROR_MESSAGE} 문의 코드: ${supportCode}`;
}

function createClientRequestId() {
  return `cdn-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
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

function replaceFileExtension(fileName: string, extension: string) {
  const dotIndex = fileName.lastIndexOf(".");
  const baseName = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
  return `${baseName}${extension}`;
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

async function compressPhotoForUpload(file: File) {
  if (typeof window === "undefined" || file.size <= MAX_PHOTO_FILE_SIZE_BYTES) {
    return {
      file,
      wasCompressed: false,
      originalSize: file.size,
      compressedSize: file.size,
    };
  }

  const image = await loadImageFromFile(file);
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
    replaceFileExtension(file.name || "day-nammae-photo", ".jpg"),
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );

  return {
    file: compressedFile,
    wasCompressed: true,
    originalSize: file.size,
    compressedSize: compressedFile.size,
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

function buildResponseFailureMessage(
  meta: SubmitResponseMeta,
  photo: File | null
) {
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

const STEP_CONFIG = [
  { title: "성별을 선택해주세요", description: "해당 성별 기준으로 일정 마감 여부가 달라집니다." },
  { title: "일정을 선택해주세요", description: "참여하고 싶은 일정을 골라주세요." },
  { title: "신청서를 작성해주세요", description: "프로필 정보를 입력해주세요." },
  { title: "사진을 등록해주세요", description: "본인의 매력이 잘 드러나는 사진 한 장을 올려주세요." },
  { title: "승인 기준을 확인해주세요", description: "신청 전 꼭 확인해야 하는 내용이에요." },
  { title: "마케팅 동의를 확인해주세요", description: "촬영 및 콘텐츠 활용에 대한 안내예요." },
  { title: "주의 사항을 확인해주세요", description: "참여 전 꼭 알아두셔야 할 사항이에요." },
];

export default function LoveBuddiesApplyFlow({
  mode,
  scheduleData,
  isLoadingSchedules,
  onClose,
}: LoveBuddiesApplyFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [photoNotice, setPhotoNotice] = useState("");
  const [isOptimizingPhoto, setIsOptimizingPhoto] = useState(false);
  const [formError, setFormError] = useState("");
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [agreements, setAgreements] = useState([false, false, false]);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    if (!formValues.photo) {
      setPhotoPreviewUrl("");
      return;
    }
    const previewUrl = URL.createObjectURL(formValues.photo);
    setPhotoPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [formValues.photo]);

  const closeFlow = () => {
    if (mode === "page") {
      router.push("/offline/11namme");
      return;
    }
    onClose?.();
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
      .then(({ file: nextFile, wasCompressed, originalSize, compressedSize }) => {
        setFormValues((current) => ({ ...current, photo: nextFile }));
        setPhotoNotice(
          wasCompressed
            ? buildPhotoCompressedMessage(originalSize, compressedSize)
            : ""
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
    setCurrentStep(2);
  };

  const handleScheduleSelect = (scheduleLabel: string) => {
    setFormValues((current) => ({ ...current, schedule: scheduleLabel }));
    setFormError("");
    setShowFieldErrors(false);
    setCurrentStep(3);
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

  const canProceed = (() => {
    switch (currentStep) {
      case 1:
        return formValues.gender !== "";
      case 2:
        return formValues.schedule !== "";
      case 3:
        return (
          formValues.name.trim() !== "" &&
          formValues.birthYear !== "" &&
          formValues.height.trim() !== "" &&
          formValues.phone.replace(/\D/g, "").length === 11 &&
          formValues.traits.trim() !== ""
        );
      case 4:
        return formValues.photo !== null && !isOptimizingPhoto;
      case 5:
        return agreements[0];
      case 6:
        return agreements[1];
      case 7:
        return agreements[2];
      default:
        return false;
    }
  })();

  const handleSubmit = async () => {
    setSubmitState({ status: "submitting", message: "" });
    setFormError("");

    const clientRequestId = createClientRequestId();
    const clientDebugContext = buildClientDebugContext(formValues.photo, clientRequestId);
    let submitStage = "client:prepare";

    try {
      const urlSearchParams =
        typeof window !== "undefined"
          ? getSafeSearchParams(window.location.search)
          : new URLSearchParams();
      const requestBody = new FormData();
      requestBody.append("gender", formValues.gender);
      requestBody.append("schedule", formValues.schedule);
      requestBody.append("name", formValues.name.trim());
      requestBody.append("birthYear", formValues.birthYear);
      requestBody.append("height", formValues.height.trim());
      requestBody.append("phone", formValues.phone.trim());
      requestBody.append("traits", formValues.traits.trim());
      requestBody.append("photo", formValues.photo as File);
      requestBody.append("utm_source", urlSearchParams.get("utm_source") || "");
      requestBody.append("utm_medium", urlSearchParams.get("utm_medium") || "");
      requestBody.append("utm_content", urlSearchParams.get("utm_content") || "");
      requestBody.append("client_request_id", clientRequestId);
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

      submitStage = "client:success";
      trackEvent("DN_SubmitApplication", {
        gender: formValues.gender,
        schedule: formValues.schedule,
      });
      trackCompleteRegistration(formValues);

      setSubmitState({
        status: "success",
        message: "신청이 정상적으로 접수되었습니다. 검토 후 안내 메시지를 보내드릴게요.",
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
      });
      setSubmitState({
        status: "error",
        message:
          error instanceof Error ? error.message : buildSubmitErrorMessage(supportCode),
      });
    }
  };

  const handleNext = () => {
    if (currentStep === 3 && !canProceed) {
      setShowFieldErrors(true);
      return;
    }
    if (currentStep === TOTAL_STEPS) {
      trackEvent("DN_Step7_AcceptNotice");
      handleSubmit();
      return;
    }

    const stepEvents: Record<number, () => void> = {
      1: () => trackEvent("DN_Step1_SelectGender", { gender: formValues.gender }),
      2: () => trackEvent("DN_Step2_SelectSchedule", { schedule: formValues.schedule }),
      3: () => trackEvent("DN_Step3_CompleteProfile"),
      4: () => trackEvent("DN_Step4_UploadPhoto"),
      5: () => trackEvent("DN_Step5_AcceptApproval"),
      6: () => trackEvent("DN_Step6_AcceptMarketing"),
    };
    stepEvents[currentStep]?.();

    setShowFieldErrors(false);
    setCurrentStep((s) => s + 1);
    setFormError("");
  };

  const handleBack = () => {
    if (currentStep === 1) {
      closeFlow();
      return;
    }
    setCurrentStep((s) => s - 1);
    setFormError("");
  };

  if (submitState.status === "success") {
    const bookingUrl = (() => {
      const match = formValues.schedule.match(/(\d+)\/(\d+)/);
      if (!match) return "https://booking.naver.com/booking/12/bizes/1378688/items/6629371";
      const now = new Date();
      const month = parseInt(match[1], 10);
      const day = parseInt(match[2], 10);
      let year = now.getFullYear();
      if (month < now.getMonth() + 1) year += 1;
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return `https://booking.naver.com/booking/12/bizes/1378688/items/6629371?startDateTime=${encodeURIComponent(`${dateStr}T00:00:00+09:00`)}`;
    })();

    return (
      <ApplyStepShell
        mode={mode}
        currentStep={TOTAL_STEPS}
        totalSteps={TOTAL_STEPS}
        title="결제를 진행해주세요"
        description="결제까지 진행해주셔야 신청이 완료됩니다."
        canProceed={true}
        hideNav
        onNext={() => {}}
        onBack={() => {}}
      >
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-5 text-center">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">신청 내역</p>
          <p className="mt-3 text-base font-bold text-white">{formValues.schedule}</p>
          <p className="mt-1 text-sm text-white/70">{formValues.name} · {formValues.phone}</p>
        </div>

        <div className="mt-5 px-1 text-left text-sm leading-relaxed text-white/60">
          <p>• 결제가 완료된 순서대로 참가자를 승인해드립니다.</p>
          <p className="mt-1">• 결제 완료 후 &apos;참가 확정 메세지&apos;를 받으셔야 최종 확정입니다.</p>
          <p className="mt-1">• 승인/확정 처리까지 최대 24시간이 소요될 수 있습니다.</p>
        </div>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("DN_InitiateCheckout", { schedule: formValues.schedule });
            safeFbq("track", "InitiateCheckout", {
              value: 35000,
              currency: "KRW",
              content_name: "일일남매",
            });
          }}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#FF6B9F] text-base font-bold text-white transition active:scale-[0.98]"
        >
          35,000원 결제하기
        </a>
        <button
          type="button"
          onClick={() => {
            setSubmitState({ status: "idle", message: "" });
            setCurrentStep(1);
            setFormValues(INITIAL_FORM_VALUES);
            setAgreements([false, false, false]);
            setShowFieldErrors(false);
          }}
          className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 text-sm font-medium text-white/60 transition active:scale-[0.98]"
        >
          신청서 다시 작성하기
        </button>
      </ApplyStepShell>
    );
  }

  const stepConfig = STEP_CONFIG[currentStep - 1];

  return (
    <ApplyStepShell
      mode={mode}
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      title={stepConfig.title}
      description={stepConfig.description}
      canProceed={currentStep === 3 ? true : canProceed}
      isSubmitting={submitState.status === "submitting"}
      isLastStep={currentStep === TOTAL_STEPS}
      onNext={handleNext}
      onBack={handleBack}
    >
      {formError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </div>
      )}

      {currentStep === 4 && photoNotice && (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {photoNotice}
        </div>
      )}

      {submitState.status === "error" && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {submitState.message}
        </div>
      )}

      {currentStep === 1 && (
        <StepGender gender={formValues.gender} onSelect={handleGenderSelect} />
      )}

      {currentStep === 2 && (
        <StepSchedule
          scheduleData={scheduleData}
          isLoading={isLoadingSchedules}
          gender={formValues.gender}
          selectedSchedule={formValues.schedule}
          onSelect={handleScheduleSelect}
        />
      )}

      {currentStep === 3 && (
        <StepProfile
          formValues={formValues}
          onValueChange={handleValueChange}
          onBirthYearSelect={handleBirthYearSelect}
          showErrors={showFieldErrors}
        />
      )}

      {currentStep === 4 && (
        <StepPhoto
          photoPreviewUrl={photoPreviewUrl}
          isOptimizing={isOptimizingPhoto}
          onPhotoChange={handlePhotoChange}
        />
      )}

      {currentStep === 5 && (
        <StepAgreement
          section={DAY_NAMMAE_NOTICE_SECTIONS[0]}
          agreed={agreements[0]}
          onAgreeChange={handleAgreementChange(0)}
        />
      )}

      {currentStep === 6 && (
        <StepAgreement
          section={DAY_NAMMAE_NOTICE_SECTIONS[1]}
          agreed={agreements[1]}
          onAgreeChange={handleAgreementChange(1)}
        />
      )}

      {currentStep === 7 && (
        <StepAgreement
          section={DAY_NAMMAE_NOTICE_SECTIONS[2]}
          agreed={agreements[2]}
          onAgreeChange={handleAgreementChange(2)}
        />
      )}
    </ApplyStepShell>
  );
}
