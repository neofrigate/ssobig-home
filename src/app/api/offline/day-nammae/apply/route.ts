import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_STORAGE_BUCKET = "day-nammae-profiles";
const DAY_NAMMAE_SUPABASE_URL = "https://ferhwwjztseoegaizsko.supabase.co";
const DEFAULT_WAITLIST_ALERT_API_URL =
  "https://ferhwwjztseoegaizsko.supabase.co/functions/v1/ssobig-meeting-manage/public/day-nammae-waitlist-alert";
const DEFAULT_CLIENT_ERROR_MESSAGE =
  "신청서 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 채널톡으로 문의해주세요.";
const UNSUPPORTED_HEIC_PHOTO_ERROR_MESSAGE =
  "HEIC/HEIF 사진은 자동 변환에 실패해 업로드할 수 없습니다. 사진 앱에서 JPG로 저장한 뒤 다시 시도해주세요.";
const HEIC_HEIF_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const HEIC_HEIF_FILE_PATTERN = /\.(heic|heif)$/i;

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} 값이 비어 있습니다.`);
  }

  return value.trim();
}

function generateUuid() {
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  const randomSuffix = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return `ID${timestamp}-${randomSuffix}`;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

async function parseEdgeFunctionResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function createRequestId() {
  return `dn-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalPositiveInt(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }

  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function getApplicationMode(formData: FormData) {
  const value = formData.get("applicationMode");
  return value === "waitlist_alert" ? "waitlist_alert" : "normal";
}

function getWaitlistAlertApiUrl() {
  return (
    process.env.DAY_NAMMAE_WAITLIST_ALERT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_DAY_NAMMAE_WAITLIST_ALERT_API_URL?.trim() ||
    DEFAULT_WAITLIST_ALERT_API_URL
  );
}

function maskPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length < 4) {
    return digits || "-";
  }

  return `${"*".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
}

function isSafeClientErrorMessage(message: string) {
  return (
    message.endsWith("값이 비어 있습니다.") ||
    message === "업로드할 사진 파일이 필요합니다." ||
    message === "이미지 파일만 업로드할 수 있습니다." ||
    message === UNSUPPORTED_HEIC_PHOTO_ERROR_MESSAGE
  );
}

function isUnsupportedHeicLikeFile(file: File) {
  const normalizedType = file.type.trim().toLowerCase();

  return (
    HEIC_HEIF_MIME_TYPES.has(normalizedType) ||
    HEIC_HEIF_FILE_PATTERN.test(file.name)
  );
}

function buildClientErrorMessage(requestId: string, safeMessage?: string) {
  if (safeMessage) {
    return safeMessage;
  }

  return `${DEFAULT_CLIENT_ERROR_MESSAGE} 문의 코드: ${requestId}`;
}

function buildResponseHeaders(requestId: string, clientRequestId = "") {
  const headers = new Headers({
    "x-ssobig-request-id": requestId,
  });

  if (clientRequestId) {
    headers.set("x-ssobig-client-request-id", clientRequestId);
  }

  return headers;
}

function logSubmitEvent(
  requestId: string,
  stage: string,
  details: Record<string, unknown> = {},
  level: "log" | "warn" | "error" = "log"
) {
  const prefix = `[day-nammae/apply][${requestId}][${stage}]`;

  if (level === "error") {
    console.error(prefix, details);
    return;
  }

  if (level === "warn") {
    console.warn(prefix, details);
    return;
  }

  console.log(prefix, details);
}

function parseDebugClientContext(rawValue: FormDataEntryValue | null) {
  if (typeof rawValue !== "string" || !rawValue.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch (error) {
    return {
      rawValue,
      parseError: error instanceof Error ? error.message : String(error),
    };
  }

  return { rawValue };
}

function toObjectRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function summarizeUnknownError(error: unknown) {
  const record = toObjectRecord(error);
  const summary: Record<string, unknown> = {};

  if (error instanceof Error) {
    summary.name = error.name;
    summary.message = error.message;
  } else if (typeof error === "string") {
    summary.message = error;
  }

  const fields = [
    "code",
    "status",
    "statusCode",
    "details",
    "hint",
    "error",
  ] as const;

  for (const field of fields) {
    const value = record?.[field];
    if (value !== undefined && value !== null && value !== "") {
      summary[field] = value;
    }
  }

  return summary;
}

function summarizeStorageUploadData(data: unknown) {
  const record = toObjectRecord(data);
  if (!record) {
    return null;
  }

  const summary: Record<string, unknown> = {};
  const fields = ["id", "path", "fullPath"] as const;

  for (const field of fields) {
    const value = record[field];
    if (typeof value === "string" && value) {
      summary[field] = value;
    }
  }

  return Object.keys(summary).length > 0 ? summary : null;
}

function buildStorageUploadFailureMessage(errorSummary: Record<string, unknown>) {
  const message =
    typeof errorSummary.message === "string" && errorSummary.message.trim()
      ? errorSummary.message
      : "unknown storage error";
  const annotations: string[] = [];

  if (typeof errorSummary.code === "string" && errorSummary.code) {
    annotations.push(`code=${errorSummary.code}`);
  }

  const status =
    typeof errorSummary.status === "number" ||
    typeof errorSummary.status === "string"
      ? errorSummary.status
      : typeof errorSummary.statusCode === "number" ||
          typeof errorSummary.statusCode === "string"
        ? errorSummary.statusCode
        : null;

  if (status !== null) {
    annotations.push(`status=${status}`);
  }

  return annotations.length > 0
    ? `사진 업로드 실패: ${message} (${annotations.join(", ")})`
    : `사진 업로드 실패: ${message}`;
}

async function cleanupUploadedFile(params: {
  requestId: string;
  storageBucket: string;
  uploadedPath: string;
  reason: string;
  client: {
    storage: {
      from: (bucket: string) => {
        remove: (paths: string[]) => Promise<{ error: { message: string } | null }>;
      };
    };
  };
}) {
  const { requestId, storageBucket, uploadedPath, reason, client } = params;

  logSubmitEvent(requestId, "storage:cleanup:start", {
    storageBucket,
    uploadedPath,
    cleanupReason: reason,
  });

  const { error } = await client.storage.from(storageBucket).remove([uploadedPath]);

  if (error) {
    logSubmitEvent(
      requestId,
      "storage:cleanup:error",
      {
        storageBucket,
        uploadedPath,
        cleanupReason: reason,
        error: error.message,
      },
      "error"
    );
    return false;
  }

  logSubmitEvent(requestId, "storage:cleanup:success", {
    storageBucket,
    uploadedPath,
    cleanupReason: reason,
  });
  return true;
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  const apiStartedAt = Date.now();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const storageBucket =
    process.env.SUPABASE_STORAGE_BUCKET_DAY_NAMMAE ||
    process.env.SUPABASE_STORAGE_BUCKET ||
    DEFAULT_STORAGE_BUCKET;
  const requestHeaderContext = {
    contentType: request.headers.get("content-type") || "",
    contentLength: request.headers.get("content-length") || "",
    userAgent: request.headers.get("user-agent") || "",
    referer: request.headers.get("referer") || "",
    forwardedFor: request.headers.get("x-forwarded-for") || "",
  };

  logSubmitEvent(requestId, "submit:start", requestHeaderContext);

  if (!serviceRoleKey) {
    logSubmitEvent(
      requestId,
      "submit:failed",
      { stage: "service_role_check", error: "SUPABASE_SERVICE_ROLE_KEY missing" },
      "error"
    );
    return NextResponse.json(
      {
        requestId,
        error: "SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다.",
        userMessage: buildClientErrorMessage(requestId),
      },
      {
        status: 500,
        headers: buildResponseHeaders(requestId),
      }
    );
  }

  let uploadedPath = "";
  let uuid = "";
  let currentStage = "submit:start";
  let maskedPhone = "";
  let clientRequestId = "";
  let photoContext: Record<string, unknown> = {};
  let debugClientContext: Record<string, unknown> | null = null;
  let storageUploadContext: Record<string, unknown> = {};
  let storageUploadErrorContext: Record<string, unknown> | null = null;
  let storageUploadErrorSummary: Record<string, unknown> | null = null;
  let storageUploadMs: number | null = null;
  let edgeRequestMs: number | null = null;

  try {
    currentStage = "submit:parse";
    const formData = await request.formData();
    const gender = getRequiredString(formData, "gender");
    const schedule = getRequiredString(formData, "schedule");
    const name = getRequiredString(formData, "name");
    const phone = getRequiredString(formData, "phone");
    const applicationMode = getApplicationMode(formData);
    clientRequestId = getOptionalString(formData, "client_request_id");
    debugClientContext = parseDebugClientContext(formData.get("debug_client_context"));
    const utmSource = (formData.get("utm_source") as string) || "";
    const utmMedium = (formData.get("utm_medium") as string) || "";
    const utmContent = (formData.get("utm_content") as string) || "";
    const fbp = getOptionalString(formData, "fbp");
    const fbc = getOptionalString(formData, "fbc");

    maskedPhone = maskPhoneNumber(phone);

    logSubmitEvent(requestId, "submit:validated", {
      clientRequestId,
      name,
      phoneMasked: maskedPhone,
      schedule,
      applicationMode,
      hasFbp: Boolean(fbp),
      hasFbc: Boolean(fbc),
      debugClientContext,
    });

    if (applicationMode === "waitlist_alert") {
      currentStage = "edge:request:start";

      const edgeResponse = await fetch(getWaitlistAlertApiUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          schedule,
          name,
          phone,
          gender,
        }),
      });

      const edgeBody = await parseEdgeFunctionResponse(edgeResponse);

      logSubmitEvent(requestId, "edge:request:complete", {
        clientRequestId,
        edgeStatus: edgeResponse.status,
        edgeSuccess: edgeResponse.ok,
        applicationMode,
      });

      if (!edgeResponse.ok) {
        currentStage = "edge:request:error";
        logSubmitEvent(
          requestId,
          "edge:request:error",
          {
            clientRequestId,
            edgeStatus: edgeResponse.status,
            edgeBody,
            applicationMode,
          },
          "error"
        );
        throw new Error(
          typeof edgeBody === "string"
            ? edgeBody
            : edgeBody?.error || "대기 알림 신청 요청에 실패했습니다."
        );
      }

      currentStage = "submit:success";
      logSubmitEvent(requestId, "submit:success", {
        schedule,
        applicationMode,
      });

      return NextResponse.json(
        {
          success: true,
          requestId,
          clientRequestId,
          payload: {
            requestId,
            gender,
            schedule,
            name,
            phone,
            applicationMode,
          },
          edgeBody,
        },
        {
          headers: buildResponseHeaders(requestId, clientRequestId),
        }
      );
    }

    const birthYear = getRequiredString(formData, "birthYear");
    const height = getRequiredString(formData, "height");
    const traits = getRequiredString(formData, "traits");
    const photo = formData.get("photo");
    const usedCouponId = getOptionalPositiveInt(formData, "usedCouponId");
    const couponCode = getOptionalString(formData, "couponCode");

    if (!(photo instanceof File) || photo.size === 0) {
      throw new Error("업로드할 사진 파일이 필요합니다.");
    }

    if (isUnsupportedHeicLikeFile(photo)) {
      throw new Error(UNSUPPORTED_HEIC_PHOTO_ERROR_MESSAGE);
    }

    if (!photo.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드할 수 있습니다.");
    }

    photoContext = {
      photoName: photo.name,
      photoType: photo.type,
      photoSize: photo.size,
      photoLastModified: photo.lastModified,
    };

    logSubmitEvent(requestId, "submit:validated:apply", {
      clientRequestId,
      name,
      phoneMasked: maskedPhone,
      schedule,
      hasFbp: Boolean(fbp),
      hasFbc: Boolean(fbc),
      ...photoContext,
      debugClientContext,
    });

    const supabase = createClient(DAY_NAMMAE_SUPABASE_URL, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    uuid = generateUuid();
    const fileExtension = photo.name.includes(".")
      ? photo.name.slice(photo.name.lastIndexOf("."))
      : ".jpg";
    const sanitizedFileName = sanitizeFileName(
      photo.name.replace(fileExtension, "")
    );

    uploadedPath = `day-nammae/${uuid}/${sanitizedFileName || "profile"}${fileExtension}`;
    storageUploadContext = {
      requestId,
      clientRequestId,
      uuid,
      storageBucket,
      uploadedPath,
      ...photoContext,
      debugClientContext,
    };

    currentStage = "storage:prepare";
    logSubmitEvent(requestId, "storage:prepare", {
      ...storageUploadContext,
    });

    currentStage = "storage:upload:start";
    logSubmitEvent(requestId, "storage:upload:start", {
      ...storageUploadContext,
    });

    const storageUploadStartedAt = Date.now();
    const uploadResult = await supabase.storage
      .from(storageBucket)
      .upload(uploadedPath, Buffer.from(await photo.arrayBuffer()), {
        contentType: photo.type,
        upsert: false,
      });
    storageUploadMs = Date.now() - storageUploadStartedAt;

    if (uploadResult.error) {
      currentStage = "storage:upload:error";
      storageUploadErrorSummary = summarizeUnknownError(uploadResult.error);
      const storageUploadDataSummary = summarizeStorageUploadData(uploadResult.data);
      storageUploadErrorContext = {
        ...storageUploadContext,
        storage_upload_ms: storageUploadMs,
        storageError: storageUploadErrorSummary,
        ...(storageUploadDataSummary
          ? { storageUploadResult: storageUploadDataSummary }
          : {}),
      };

      logSubmitEvent(
        requestId,
        "storage:upload:error",
        storageUploadErrorContext,
        "error"
      );
      const uploadError = new Error(
        buildStorageUploadFailureMessage(storageUploadErrorSummary)
      );
      uploadError.name = "DayNammaeStorageUploadError";
      throw uploadError;
    }

    logSubmitEvent(requestId, "storage:upload:success", {
      ...storageUploadContext,
      storage_upload_ms: storageUploadMs,
      storageUploadResult: summarizeStorageUploadData(uploadResult.data),
    });

    const { data: publicUrlData } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(uploadedPath);

    logSubmitEvent(requestId, "storage:url:ready", {
      uploadedPath,
      publicUrl: publicUrlData.publicUrl,
    });

    const payload = {
      requestId,
      _raw: "",
      uuid,
      Email: "",
      "Q. 키": height,
      마감: 0,
      응답: 1,
      Nickname: name,
      GameTitle: "[일일남매] 콘텐츠 신청",
      "Q. 나이": birthYear,
      "Q. 사진": publicUrlData.publicUrl,
      "Q. 성별": gender,
      "Q. 이름": name,
      "Q. 지역": "",
      "Q. 특징": traits,
      TemplateId: "",
      utm_medium: utmMedium,
      utm_source: utmSource,
      PhoneNumber: phone,
      utm_content: utmContent,
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {}),
      "Q. 전화번호": phone,
      "Q. 기대되는점": "",
      "[일일남매] 일정 선택": schedule,
      usedCouponId,
      couponCode,
      applicationMode,
    };

    currentStage = "edge:request:start";
    logSubmitEvent(requestId, "edge:request:start", {
      clientRequestId,
      uuid,
      endpoint: "/functions/v1/ssobig-offline/day-nammae",
      uploadedPath,
    });

    const edgeRequestStartedAt = Date.now();
    const edgeResponse = await fetch(
      `${DAY_NAMMAE_SUPABASE_URL}/functions/v1/ssobig-offline/day-nammae`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    edgeRequestMs = Date.now() - edgeRequestStartedAt;

    const edgeBody = await parseEdgeFunctionResponse(edgeResponse);
    const edgeBodyRecord = toObjectRecord(edgeBody);

    logSubmitEvent(requestId, "edge:request:complete", {
      clientRequestId,
      uuid,
      edgeStatus: edgeResponse.status,
      edgeSuccess: edgeResponse.ok,
      edge_request_ms: edgeRequestMs,
    });

    if (!edgeResponse.ok) {
      currentStage = "edge:request:error";
      logSubmitEvent(
        requestId,
        "edge:request:error",
        {
          clientRequestId,
          uuid,
          edgeStatus: edgeResponse.status,
          edgeBody,
          storage_upload_ms: storageUploadMs,
          edge_request_ms: edgeRequestMs,
          total_api_ms: Date.now() - apiStartedAt,
        },
        "error"
      );

      if (edgeBodyRecord?.applicationSubmitted === true) {
        return NextResponse.json(
          {
            success: false,
            requestId,
            clientRequestId,
            applicationSubmitted: true,
            edgeBody,
            userMessage:
              typeof edgeBodyRecord.reason === "string" && edgeBodyRecord.reason
                ? edgeBodyRecord.reason
                : "신청은 접수되었지만 쿠폰 사용 처리에 실패했습니다. 다시 시도해주세요.",
          },
          {
            status: edgeResponse.status,
            headers: buildResponseHeaders(requestId, clientRequestId),
          }
        );
      }

      await cleanupUploadedFile({
        requestId,
        storageBucket,
        uploadedPath,
        reason: "edge_response_not_ok",
        client: supabase,
      });
      uploadedPath = "";
      throw new Error(
        typeof edgeBody === "string"
          ? edgeBody
          : edgeBody?.error || "Edge Function 요청에 실패했습니다."
      );
    }

    currentStage = "submit:success";
    logSubmitEvent(requestId, "submit:success", {
      uuid,
      uploadedPath,
      storage_upload_ms: storageUploadMs,
      edge_request_ms: edgeRequestMs,
      total_api_ms: Date.now() - apiStartedAt,
    });

    return NextResponse.json({
      success: true,
      requestId,
      clientRequestId,
      payload,
      edgeBody,
    }, {
      headers: buildResponseHeaders(requestId, clientRequestId),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "신청서를 제출하지 못했습니다.";
    const safeClientMessage = isSafeClientErrorMessage(errorMessage)
      ? errorMessage
      : undefined;

    logSubmitEvent(
      requestId,
      "submit:failed",
      {
        stage: currentStage,
        clientRequestId,
        uuid,
        uploadedPath,
        phoneMasked: maskedPhone,
        ...photoContext,
        debugClientContext,
        error: errorMessage,
        storage_upload_ms: storageUploadMs,
        edge_request_ms: edgeRequestMs,
        total_api_ms: Date.now() - apiStartedAt,
        storageUploadErrorContext,
      },
      "error"
    );

    if (!safeClientMessage) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "day-nammae-apply");
        scope.setTag("request_id", requestId);
        if (clientRequestId) {
          scope.setTag("client_request_id", clientRequestId);
        }
        scope.setTag("submit_stage", currentStage);
        if (storageUploadErrorSummary) {
          const storageUploadStatus =
            storageUploadErrorSummary.status ??
            storageUploadErrorSummary.statusCode;

          if (
            typeof storageUploadStatus === "string" ||
            typeof storageUploadStatus === "number"
          ) {
            scope.setTag(
              "storage_upload_status",
              String(storageUploadStatus)
            );
          }

          if (
            typeof storageUploadErrorSummary.code === "string" ||
            typeof storageUploadErrorSummary.code === "number"
          ) {
            scope.setTag(
              "storage_upload_code",
              String(storageUploadErrorSummary.code)
            );
          }

          if (typeof storageUploadErrorSummary.name === "string") {
            scope.setTag(
              "storage_upload_error_name",
              storageUploadErrorSummary.name
            );
          }
        }
        scope.setContext("day_nammae_submit", {
          clientRequestId,
          uuid,
          uploadedPath,
          phoneMasked: maskedPhone,
          ...photoContext,
          debugClientContext,
        });
        if (storageUploadErrorContext) {
          scope.setContext("storage_upload", storageUploadErrorContext);
        }
        Sentry.captureException(
          error instanceof Error ? error : new Error(errorMessage)
        );
      });
    }

    if (uploadedPath) {
      try {
        const cleanupClient = createClient(
          DAY_NAMMAE_SUPABASE_URL,
          serviceRoleKey,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            },
          }
        );
        await cleanupUploadedFile({
          requestId,
          storageBucket,
          uploadedPath,
          reason: "route_exception",
          client: cleanupClient,
        });
      } catch (cleanupError) {
        logSubmitEvent(
          requestId,
          "storage:cleanup:error",
          {
            uploadedPath,
            storageBucket,
            cleanupReason: "route_exception",
            error:
              cleanupError instanceof Error
                ? cleanupError.message
                : String(cleanupError),
          },
          "error"
        );
      }
    }

    return NextResponse.json(
      {
        requestId,
        clientRequestId,
        error: safeClientMessage || "신청서 제출 처리 중 내부 오류가 발생했습니다.",
        userMessage: buildClientErrorMessage(requestId, safeClientMessage),
      },
      {
        status: safeClientMessage ? 400 : 500,
        headers: buildResponseHeaders(requestId, clientRequestId),
      }
    );
  }
}
