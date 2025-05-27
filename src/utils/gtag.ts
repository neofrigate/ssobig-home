// Google Analytics 이벤트 추적 함수들

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "consent",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-RN7MB0CJZS";

// 페이지뷰 추적 (UTM 파라미터 포함)
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    // UTM 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source") || "direct";
    const utmMedium = urlParams.get("utm_medium") || "none";
    const utmCampaign = urlParams.get("utm_campaign") || "none";
    const utmId = urlParams.get("utm_id") || "none";
    const utmTerm = urlParams.get("utm_term") || "none";
    const utmContent = urlParams.get("utm_content") || "none";

    // 기본 페이지뷰 설정
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });

    // UTM 파라미터가 있는 경우 별도 이벤트로 기록
    window.gtag("event", "page_view", {
      event_category: "engagement",
      event_label: "page_view_with_utm",
      page_path: url,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_id: utmId,
      utm_term: utmTerm,
      utm_content: utmContent,
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

// 개선된 링크 클릭 추적 함수
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
    // UTM 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source") || "direct";
    const utmMedium = urlParams.get("utm_medium") || "none";
    const utmCampaign = urlParams.get("utm_campaign") || "none";
    const utmId = urlParams.get("utm_id") || "none";

    window.gtag("event", "cta_click", {
      event_category: "engagement",
      event_label: linkText,
      brand_page: brandPage || "unknown",
      button_type: buttonType || "unknown",
      destination: destination || "external",
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_id: utmId,
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
  utmSource,
}: {
  brandPage: string;
  buttonType: string;
  utmSource?: string;
}) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    // 전환 이벤트 발송
    window.gtag("event", "conversion", {
      event_category: "conversion",
      event_label: "smore_form_click",
      brand_page: brandPage,
      button_type: buttonType,
      utm_source: utmSource || "direct",
      value: 1,
    });
  }
};
