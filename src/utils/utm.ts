/**
 * UTM 관련 유틸리티 함수
 */

// UTM 파라미터 키 목록
const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_creative",
  "utm_keyword",
  "utm_name",
];

function safeDecodeQueryComponent(value: string) {
  const normalizedValue = value.replace(/\+/g, " ");

  try {
    return decodeURIComponent(normalizedValue);
  } catch {
    return normalizedValue;
  }
}

export const getSafeSearchParams = (search = ""): URLSearchParams => {
  const normalizedSearch = search.startsWith("?") ? search.slice(1) : search;

  try {
    return new URLSearchParams(normalizedSearch);
  } catch (error) {
    console.warn("검색 파라미터 파싱 실패, 안전 파서로 대체합니다.", error);

    const fallbackParams = new URLSearchParams();

    if (!normalizedSearch) {
      return fallbackParams;
    }

    for (const pair of normalizedSearch.split("&")) {
      if (!pair) {
        continue;
      }

      const separatorIndex = pair.indexOf("=");
      const rawKey = separatorIndex === -1 ? pair : pair.slice(0, separatorIndex);
      const rawValue = separatorIndex === -1 ? "" : pair.slice(separatorIndex + 1);
      const key = safeDecodeQueryComponent(rawKey);

      if (!key) {
        continue;
      }

      fallbackParams.append(key, safeDecodeQueryComponent(rawValue));
    }

    return fallbackParams;
  }
};

/**
 * 현재 URL에서 UTM 파라미터를 추출
 */
export const extractUtmParams = (): Record<string, string> => {
  // 브라우저 환경이 아니면 빈 객체 반환
  if (typeof window === "undefined") return {};

  const searchParams = getSafeSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  UTM_PARAMS.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });

  return utmParams;
};

/**
 * UTM 파라미터를 URL에 추가
 */
export const appendUtmParams = (url: string): string => {
  // 브라우저 환경이 아니면 원래 URL 반환
  if (typeof window === "undefined") return url;

  try {
    const utmParams = extractUtmParams();
    // UTM 파라미터가 없으면 원래 URL 반환
    if (Object.keys(utmParams).length === 0) return url;

    // 외부 URL인 경우 완전한 URL 객체 생성
    const isExternalUrl = url.startsWith("http");
    const urlObj = isExternalUrl
      ? new URL(url)
      : new URL(url, window.location.origin);

    // UTM 파라미터 추가
    Object.entries(utmParams).forEach(([key, value]) => {
      // 이미 존재하는 파라미터는 덮어쓰지 않음
      if (!urlObj.searchParams.has(key)) {
        urlObj.searchParams.set(key, value);
      }
    });

    return isExternalUrl
      ? urlObj.toString()
      : `${urlObj.pathname}${urlObj.search}`;
  } catch (e) {
    console.error("URL 파싱 에러:", e);
    return url;
  }
};
