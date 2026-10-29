"use client";

import { useCallback, useEffect, useState } from "react";

// 사이트 언어 선택 (GNB·푸터 언어 메뉴, 약관 링크)
export type SiteLocale = "ko" | "en" | "ja" | "zh";

export const SITE_LOCALES: {
  code: SiteLocale;
  label: string;
  short: string;
  htmlLang: string;
}[] = [
  { code: "ko", label: "한국어", short: "KO", htmlLang: "ko" },
  { code: "en", label: "English", short: "EN", htmlLang: "en" },
  { code: "ja", label: "日本語", short: "JA", htmlLang: "ja" },
  { code: "zh", label: "简体中文", short: "ZH", htmlLang: "zh-Hans" },
];

// 정적 약관 페이지(public/*.html)의 언어 탭도 같은 키를 쓴다
const STORAGE_KEY = "ssobig_locale";
const CHANGE_EVENT = "ssobig:locale-change";

export const isSiteLocale = (value: unknown): value is SiteLocale =>
  SITE_LOCALES.some((locale) => locale.code === value);

export const getSiteLocaleInfo = (code: SiteLocale) =>
  SITE_LOCALES.find((locale) => locale.code === code) ?? SITE_LOCALES[0];

const readStoredLocale = (): SiteLocale | null => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isSiteLocale(value) ? value : null;
  } catch {
    return null;
  }
};

const storeLocale = (locale: SiteLocale) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // 저장이 막힌 브라우저에서는 이번 페이지에서만 적용
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: locale }));
};

// 서버 렌더와 첫 클라이언트 렌더는 항상 "ko"로 맞추고, 마운트 후 저장값을 반영한다
export const useSiteLocale = (): [SiteLocale, (locale: SiteLocale) => void] => {
  const [locale, setLocaleState] = useState<SiteLocale>("ko");

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocaleState(stored);

    const handleChange = (e: Event) => {
      const next = (e as CustomEvent).detail;
      if (isSiteLocale(next)) setLocaleState(next);
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && isSiteLocale(e.newValue)) {
        setLocaleState(e.newValue);
      }
    };

    window.addEventListener(CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setLocale = useCallback((next: SiteLocale) => {
    setLocaleState(next);
    storeLocale(next);
  }, []);

  return [locale, setLocale];
};

export type LegalDoc = "privacy_policy" | "terms_of_service" | "refund_policy";

// 한국어 주소는 구글 OAuth·결제사에 등록돼 있어 그대로 두고, 다른 언어는 /{locale}/ 아래에 둔다
export const getLegalUrl = (doc: LegalDoc, locale: SiteLocale) =>
  locale === "ko"
    ? `https://www.ssobig.com/${doc}.html`
    : `https://www.ssobig.com/${locale}/${doc}.html`;

export const FOOTER_COPY: Record<
  SiteLocale,
  {
    company: string;
    toolIntro: string;
    privacy: string;
    terms: string;
    refund: string;
    appDownload: string;
    businessInfoToggle: string;
  }
> = {
  ko: {
    company: "주식회사 쏘빅",
    toolIntro: "쏘빅툴 소개",
    privacy: "개인정보 처리방침",
    terms: "이용약관",
    refund: "환불 정책",
    appDownload: "앱 다운로드",
    businessInfoToggle: "사업자 정보 토글",
  },
  en: {
    company: "SSOBIG Inc.",
    toolIntro: "About SsoBig Tool",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    refund: "Refund Policy",
    appDownload: "Download App",
    businessInfoToggle: "Toggle business information",
  },
  ja: {
    company: "株式会社SSOBIG",
    toolIntro: "SsoBig Toolについて",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    refund: "返金ポリシー",
    appDownload: "アプリをダウンロード",
    businessInfoToggle: "事業者情報を表示",
  },
  zh: {
    company: "SSOBIG株式会社",
    toolIntro: "关于SsoBig Tool",
    privacy: "隐私政策",
    terms: "服务条款",
    refund: "退款政策",
    appDownload: "下载应用",
    businessInfoToggle: "显示企业信息",
  },
};
