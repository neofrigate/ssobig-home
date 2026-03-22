import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_STORAGE_BUCKET = "day-nammae-profiles";
const DAY_NAMMAE_SUPABASE_URL = "https://ferhwwjztseoegaizsko.supabase.co";

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

export async function POST(request: Request) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const storageBucket =
    process.env.SUPABASE_STORAGE_BUCKET_DAY_NAMMAE ||
    process.env.SUPABASE_STORAGE_BUCKET ||
    DEFAULT_STORAGE_BUCKET;

  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다." },
      { status: 500 }
    );
  }

  let uploadedPath = "";

  try {
    const formData = await request.formData();
    const gender = getRequiredString(formData, "gender");
    const schedule = getRequiredString(formData, "schedule");
    const name = getRequiredString(formData, "name");
    const birthYear = getRequiredString(formData, "birthYear");
    const height = getRequiredString(formData, "height");
    const phone = getRequiredString(formData, "phone");
    const traits = getRequiredString(formData, "traits");
    const photo = formData.get("photo");
    const utmSource = (formData.get("utm_source") as string) || "";
    const utmMedium = (formData.get("utm_medium") as string) || "";
    const utmContent = (formData.get("utm_content") as string) || "";

    if (!(photo instanceof File) || photo.size === 0) {
      throw new Error("업로드할 사진 파일이 필요합니다.");
    }

    if (!photo.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드할 수 있습니다.");
    }

    const supabase = createClient(DAY_NAMMAE_SUPABASE_URL, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const uuid = generateUuid();
    const fileExtension = photo.name.includes(".")
      ? photo.name.slice(photo.name.lastIndexOf("."))
      : ".jpg";
    const sanitizedFileName = sanitizeFileName(
      photo.name.replace(fileExtension, "")
    );

    uploadedPath = `day-nammae/${uuid}/${sanitizedFileName || "profile"}${fileExtension}`;

    const uploadResult = await supabase.storage
      .from(storageBucket)
      .upload(uploadedPath, Buffer.from(await photo.arrayBuffer()), {
        contentType: photo.type,
        upsert: false,
      });

    if (uploadResult.error) {
      throw new Error(`사진 업로드 실패: ${uploadResult.error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(uploadedPath);

    const payload = {
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
      "Q. 전화번호": phone,
      "Q. 기대되는점": "",
      "[일일남매] 일정 선택": schedule,
    };

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

    const edgeBody = await parseEdgeFunctionResponse(edgeResponse);

    if (!edgeResponse.ok) {
      await supabase.storage.from(storageBucket).remove([uploadedPath]);
      throw new Error(
        typeof edgeBody === "string"
          ? edgeBody
          : edgeBody?.error || "Edge Function 요청에 실패했습니다."
      );
    }

    return NextResponse.json({
      success: true,
      payload,
      edgeBody,
    });
  } catch (error) {
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
        await cleanupClient.storage.from(storageBucket).remove([uploadedPath]);
      } catch (cleanupError) {
        console.error("업로드 정리 실패:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "신청서를 제출하지 못했습니다.",
      },
      { status: 500 }
    );
  }
}
