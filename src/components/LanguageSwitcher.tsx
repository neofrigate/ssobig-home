"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { trackGAEvent } from "@/utils/gtag";
import {
  SITE_LOCALES,
  getSiteLocaleInfo,
  useSiteLocale,
  type SiteLocale,
} from "@/utils/siteLocale";

type LanguageSwitcherProps = {
  // desktop: GNB 드롭다운, mobile: GNB 바텀시트, footer: 푸터 위로 열리는 드롭다운
  variant: "desktop" | "mobile" | "footer";
  // GNB·푸터가 흰 배경(검정 글자)인지
  isLight: boolean;
};

const GlobeIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const ChevronIcon = ({ isOpen, className }: { isOpen: boolean; className: string }) => (
  <svg
    className={`${className} transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-gray-900"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const LanguageOptions = ({
  current,
  onSelect,
  itemClassName,
}: {
  current: SiteLocale;
  onSelect: (locale: SiteLocale) => void;
  itemClassName: string;
}) => (
  <div aria-label="Language">
    {SITE_LOCALES.map((option) => {
      const isSelected = option.code === current;
      return (
        <button
          key={option.code}
          type="button"
          aria-pressed={isSelected}
          lang={option.htmlLang}
          onClick={() => onSelect(option.code)}
          className={`${itemClassName} w-full flex items-center justify-between rounded-lg px-4 text-left transition-colors ${
            isSelected
              ? "bg-gray-100 text-gray-900 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span>{option.label}</span>
          <span className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">
              {option.short}
            </span>
            {isSelected ? <CheckIcon /> : <span className="w-4 h-4" />}
          </span>
        </button>
      );
    })}
  </div>
);

const LanguageSwitcher = ({ variant, isLight }: LanguageSwitcherProps) => {
  const [locale, setLocale] = useSiteLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = getSiteLocaleInfo(locale);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 바깥 클릭·ESC로 닫기 (바텀시트는 딤 클릭으로도 닫힘)
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (variant === "mobile") return;
      if (containerRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, variant]);

  const handleSelect = (next: SiteLocale) => {
    setIsOpen(false);
    if (next === locale) return;
    trackGAEvent("language_change", {
      from_locale: locale,
      to_locale: next,
      switcher_location: variant,
    });
    setLocale(next);
  };

  const navToneClass = isLight
    ? isOpen
      ? "text-gray-900"
      : "text-gray-900/60 hover:text-gray-900"
    : isOpen
    ? "text-white"
    : "text-white/60 hover:text-white";

  if (variant === "footer") {
    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={`Language: ${current.label}`}
          onClick={() => setIsOpen((open) => !open)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            isLight
              ? "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <GlobeIcon className="w-4 h-4" />
          <span lang={current.htmlLang} suppressHydrationWarning>
            {current.label}
          </span>
          <ChevronIcon isOpen={isOpen} className="w-3.5 h-3.5" />
        </button>
        {isOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-[200px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50">
            <LanguageOptions
              current={locale}
              onSelect={handleSelect}
              itemClassName="h-10 text-sm"
            />
          </div>
        )}
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={`Language: ${current.label}`}
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-1 p-2 text-xs font-semibold transition-colors duration-700 ${navToneClass}`}
        >
          <GlobeIcon className="w-[18px] h-[18px]" />
          <span suppressHydrationWarning>{current.short}</span>
        </button>
        {/* GNB에 will-change: transform이 있어 fixed가 GNB 기준이 되므로 body로 포털 */}
        {isMounted &&
          isOpen &&
          createPortal(
            <div className="fixed inset-0 z-[1000] md:hidden">
              <button
                type="button"
                aria-label="닫기"
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="언어 선택 · Language"
                className="absolute inset-x-0 bottom-0 rounded-t-[20px] bg-white px-5 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))]"
              >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
                <p className="mb-2 text-lg font-bold text-gray-900">
                  언어 선택 · Language
                </p>
                <LanguageOptions
                  current={locale}
                  onSelect={handleSelect}
                  itemClassName="h-[52px] text-base"
                />
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative flex items-center h-full">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`Language: ${current.label}`}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors duration-700 ${navToneClass} ${
          isOpen ? (isLight ? "bg-gray-100" : "bg-white/10") : ""
        }`}
      >
        <GlobeIcon className="w-4 h-4" />
        <span suppressHydrationWarning>{current.short}</span>
        <ChevronIcon isOpen={isOpen} className="w-3.5 h-3.5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full -mt-2 w-[220px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50">
          <LanguageOptions
            current={locale}
            onSelect={handleSelect}
            itemClassName="h-11 text-[15px]"
          />
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
