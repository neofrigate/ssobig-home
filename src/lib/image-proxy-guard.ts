/**
 * 이미지 프록시 라우트(/api/image-proxy, /api/notion-image) 공용 안전장치.
 * 노션 이미지 계열 호스트만 https로 가져오고, 래스터 이미지(image/*, SVG 제외)만
 * 크기·시간 상한 안에서 돌려준다.
 */

export const IMAGE_FETCH_TIMEOUT_MS = 10_000;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_REDIRECTS = 3;

/** 정확히 일치해야 하는 호스트 */
const ALLOWED_EXACT_HOSTS = new Set([
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "s3.us-west-2.amazonaws.com",
  "notion.so",
  "file.notion.so",
  "notion.site",
  "images.unsplash.com",
]);

/** 하위 도메인을 허용하는 접미사 */
const ALLOWED_HOST_SUFFIXES = [".notion.so", ".notion.site"];

export function isAllowedImageHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (ALLOWED_EXACT_HOSTS.has(host)) return true;
  return ALLOWED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

/** https + 허용 호스트 + 기본 포트일 때만 URL을 돌려준다. */
export function parseAllowedImageUrl(raw: string | null | undefined): URL | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "443") return null;
  if (!isAllowedImageHost(url.hostname)) return null;
  return url;
}

/** image/* 이면서 SVG가 아닌 Content-Type만 허용 */
export function isAllowedImageContentType(contentType: string | null | undefined): boolean {
  if (!contentType) return false;
  const mime = contentType.split(";")[0].trim().toLowerCase();
  if (!mime.startsWith("image/")) return false;
  if (mime === "image/svg+xml" || mime.includes("svg")) return false;
  return true;
}

const NOTION_PAGE_ID_RE =
  /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

/** 32자리 hex(하이픈 없거나 UUID 형식)만 허용하고, 하이픈 없는 소문자 형태로 돌려준다. */
export function normalizeNotionPageId(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!NOTION_PAGE_ID_RE.test(trimmed)) return null;
  return trimmed.replace(/-/g, "").toLowerCase();
}

export const IMAGE_RESPONSE_SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy": "default-src 'none'; sandbox",
};

export type GuardedImageResult =
  | { ok: true; body: ArrayBuffer; contentType: string }
  | { ok: false; status: number; error: string };

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

interface FetchGuardedImageOptions {
  headers?: Record<string, string>;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  maxBytes?: number;
}

/**
 * 허용 호스트의 이미지를 가져온다. 리다이렉트는 직접 따라가며 매번 호스트를 다시 검사한다.
 */
export async function fetchGuardedImage(
  rawUrl: string,
  options: FetchGuardedImageOptions = {}
): Promise<GuardedImageResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? IMAGE_FETCH_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? MAX_IMAGE_BYTES;

  let url = parseAllowedImageUrl(rawUrl);
  if (!url) return { ok: false, status: 403, error: "Image host not allowed" };

  const signal = AbortSignal.timeout(timeoutMs);
  let response: Response;
  try {
    for (let redirects = 0; ; redirects++) {
      response = await fetchImpl(url.toString(), {
        headers: options.headers,
        redirect: "manual",
        signal,
      });
      if (response.status < 300 || response.status >= 400) break;

      const location = response.headers.get("location");
      if (!location || redirects >= MAX_IMAGE_REDIRECTS) {
        return { ok: false, status: 502, error: "Too many redirects" };
      }
      let next: URL;
      try {
        next = new URL(location, url);
      } catch {
        return { ok: false, status: 502, error: "Invalid redirect" };
      }
      const allowed = parseAllowedImageUrl(next.toString());
      if (!allowed) return { ok: false, status: 403, error: "Image host not allowed" };
      url = allowed;
    }
  } catch (error) {
    if (isTimeoutError(error)) return { ok: false, status: 504, error: "Image fetch timed out" };
    return { ok: false, status: 502, error: "Failed to fetch image" };
  }

  if (!response.ok) {
    return { ok: false, status: response.status >= 400 ? response.status : 502, error: "Failed to fetch image" };
  }

  const contentType = response.headers.get("content-type");
  if (!isAllowedImageContentType(contentType)) {
    await response.body?.cancel().catch(() => {});
    return { ok: false, status: 415, error: "Unsupported content type" };
  }

  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    await response.body?.cancel().catch(() => {});
    return { ok: false, status: 502, error: "Image too large" };
  }

  try {
    const body = await readWithLimit(response, maxBytes);
    if (!body) return { ok: false, status: 502, error: "Image too large" };
    return { ok: true, body, contentType: contentType!.split(";")[0].trim().toLowerCase() };
  } catch (error) {
    if (isTimeoutError(error)) return { ok: false, status: 504, error: "Image fetch timed out" };
    return { ok: false, status: 502, error: "Failed to fetch image" };
  }
}

async function readWithLimit(response: Response, maxBytes: number): Promise<ArrayBuffer | null> {
  if (!response.body) return new ArrayBuffer(0);
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out.buffer;
}

function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
  );
}
