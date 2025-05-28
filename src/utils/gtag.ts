// Google Analytics 이벤트 추적 함수들

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "consent" | "set",
      targetId: string | Record<string, unknown>,
      config?: Record<string, unknown>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-RN7MB0CJZS";

// UTM 파라미터를 사용자 속성으로 설정하는 함수 (세션당 한 번만)
const setUtmUserProperties = () => {
  if (typeof window === "undefined") return;

  // 이미 설정했는지 확인 (세션당 한 번만)
  const utmAlreadySet = sessionStorage.getItem("utm_properties_set");
  if (utmAlreadySet) return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source");
  const utmMedium = urlParams.get("utm_medium");
  const utmCampaign = urlParams.get("utm_campaign");
  const utmId = urlParams.get("utm_id");
  const utmTerm = urlParams.get("utm_term");
  const utmContent = urlParams.get("utm_content");

  // UTM 파라미터가 하나라도 있으면 사용자 속성으로 설정
  if (utmSource || utmMedium || utmCampaign || utmId || utmTerm || utmContent) {
    const userProperties: Record<string, string> = {};

    if (utmSource) userProperties.utm_source = utmSource;
    if (utmMedium) userProperties.utm_medium = utmMedium;
    if (utmCampaign) userProperties.utm_campaign = utmCampaign;
    if (utmId) userProperties.utm_id = utmId;
    if (utmTerm) userProperties.utm_term = utmTerm;
    if (utmContent) userProperties.utm_content = utmContent;

    // 사용자 속성 설정
    window.gtag("set", {
      user_properties: userProperties,
    });

    // 설정 완료 표시 (세션 동안 유지)
    sessionStorage.setItem("utm_properties_set", "true");
  }
};

// 페이지뷰 추적 (UTM을 사용자 속성으로 설정)
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    // UTM 파라미터를 사용자 속성으로 설정 (첫 방문 시에만)
    setUtmUserProperties();

    // 기본 페이지뷰 설정
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });

    // 페이지뷰 이벤트 (UTM 정보는 사용자 속성으로 자동 연결됨)
    window.gtag("event", "page_view", {
      event_category: "engagement",
      event_label: "page_view",
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
};

// 이벤트 추적
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 커스텀 이벤트 함수들
export const trackButtonClick = (buttonName: string) => {
  event({
    action: "click",
    category: "engagement",
    label: buttonName,
  });
};

// 개선된 링크 클릭 추적 함수 (UTM 파라미터 제거, 사용자 속성으로 자동 연결됨)
export const trackLinkClick = ({
  linkUrl,
  linkText,
  brandPage,
  buttonType,
  destination,
}: {
  linkUrl: string;
  linkText: string;
  brandPage?: string;
  buttonType?: string;
  destination?: string;
}) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("event", "cta_click", {
      event_category: "engagement",
      event_label: linkText,
      brand_page: brandPage || "unknown",
      button_type: buttonType || "unknown",
      destination: destination || "external",
      click_url: linkUrl,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
};

// 기존 함수 호환성을 위한 래퍼 함수
export const trackLinkClickSimple = (linkUrl: string, linkText: string) => {
  trackLinkClick({
    linkUrl,
    linkText,
  });
};

export const trackFormSubmit = (formName: string) => {
  event({
    action: "submit",
    category: "form",
    label: formName,
  });
};

// smore form 클릭을 전환으로 추적
export const trackSMoreFormClick = ({
  brandPage,
  buttonType,
}: {
  brandPage: string;
  buttonType: string;
}) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    // 전환 이벤트 발송 (UTM은 사용자 속성으로 자동 연결됨)
    window.gtag("event", "conversion", {
      event_category: "conversion",
      event_label: "smore_form_click",
      brand_page: brandPage,
      button_type: buttonType,
      value: 1,
    });
  }
};
