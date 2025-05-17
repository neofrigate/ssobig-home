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

/**
 * 현재 URL에서 UTM 파라미터를 추출
 */
export const extractUtmParams = (): Record<string, string> => {
  // 브라우저 환경이 아니면 빈 객체 반환
  if (typeof window === "undefined") return {};

  const url = new URL(window.location.href);
  const utmParams: Record<string, string> = {};

  UTM_PARAMS.forEach((param) => {
    const value = url.searchParams.get(param);
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
