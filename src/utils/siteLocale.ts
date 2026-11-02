"use client";

import { usePathname, useRouter } from "next/navigation";
import { normalizePlayroomSiteLocale } from "@/app/playroom/playroomSiteLocale";
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
  document.cookie = `${STORAGE_KEY}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: locale }));
};

export const useSiteLocale = (): [SiteLocale, (locale: SiteLocale) => void] => {
  const router = useRouter();
  const pathname = usePathname();
  const playroomPath = pathname?.match(/^\/playroom\/([^/]+)(?:\/(?!review(?:\/|$))[^/]+)?\/?$/);
  const routeLocale = normalizePlayroomSiteLocale(playroomPath?.[1]);
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
    const target = next === "ko" ? "kr" : next;
    if (routeLocale && routeLocale !== target) {
      router.push(`/playroom/${target}${window.location.search}${window.location.hash}`);
    }
  }, [routeLocale, router]);

  return [routeLocale === "kr" ? "ko" : routeLocale ?? locale, setLocale];
};

export type LegalDoc = "privacy_policy" | "terms_of_service" | "refund_policy";

// 번역본은 scripts/generate-legal-pages.mjs가 public/legal/{locale}/에 만든다.
// 한국어 주소는 구글 OAuth·결제사에 등록돼 있어 그대로 둔다
export const getLegalUrl = (doc: LegalDoc, locale: SiteLocale) =>
  locale === "ko"
    ? `https://www.ssobig.com/${doc}.html`
    : `https://www.ssobig.com/legal/${locale}/${doc}.html`;

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
    company: "SsoBig Co., Ltd.",
    toolIntro: "About SsoBig Tool",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    refund: "Refund Policy",
    appDownload: "Download App",
    businessInfoToggle: "Toggle business information",
  },
  ja: {
    company: "株式会社SsoBig",
    toolIntro: "SsoBig Toolについて",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    refund: "返金ポリシー",
    appDownload: "アプリをダウンロード",
    businessInfoToggle: "事業者情報を表示",
  },
  zh: {
    company: "SsoBig股份有限公司",
    toolIntro: "关于SsoBig Tool",
    privacy: "隐私政策",
    terms: "服务条款",
    refund: "退款政策",
    appDownload: "下载应用",
    businessInfoToggle: "显示企业信息",
  },
};


export const NAV_COPY = {
  ko: { open: "메뉴 열기", close: "메뉴 닫기", tool: "쏘빅툴 바로가기", android: "Google Play에서 다운로드", ios: "App Store에서 다운로드" },
  ja: { open: "メニューを開く", close: "メニューを閉じる", tool: "ssobig toolを開く", android: "Google Playでダウンロード", ios: "App Storeでダウンロード" },
  en: { open: "Open menu", close: "Close menu", tool: "Open ssobig tool", android: "Get it on Google Play", ios: "Download on the App Store" },
  zh: { open: "打开菜单", close: "关闭菜单", tool: "打开 ssobig tool", android: "在 Google Play 下载", ios: "在 App Store 下载" },
} satisfies Record<SiteLocale, Record<string, string>>;
