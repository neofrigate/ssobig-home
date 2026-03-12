"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import LinkWithUtm from "./LinkWithUtm";
import GlobalNav from "./GlobalNav";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  const pathname = usePathname();

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) {
      setPlatform("ios");
    } else if (/Android/i.test(ua)) {
      setPlatform("android");
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // 현재 경로와 링크 경로를 비교하여 액티브 상태 확인
  const isActive = (href: string) => {
    // 절대 URL은 pathname과 직접 비교할 수 없으므로 제외
    if (href.startsWith("http")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* GlobalNav 추가 */}
      <GlobalNav toggleSidebar={toggleSidebar} />

      {/* 사이드바 오버레이 - 열렸을 때만 표시 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* 사이드바 내용 */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-black z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="py-5 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10 px-5">
            <div className="text-white">
              <LinkWithUtm
                href="/"
                className="flex items-center"
                onClick={toggleSidebar}
              >
                <Image
                  src="/ssobig_assets/Logo/logo=ssobig, color=white.png"
                  alt="쏘빅"
                  width={80}
                  height={29}
                  priority
                  unoptimized
                  className="h-auto"
                />
              </LinkWithUtm>
            </div>
            <button
              aria-label="메뉴 닫기"
              className="p-2 text-white"
              onClick={toggleSidebar}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <nav className="text-white flex-grow overflow-y-auto">
            {/* HOME */}
            <div className="mb-2">
              <LinkWithUtm
                href="/"
                className={`block transition-all ${
                  isActive("/")
                    ? "bg-white/10 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                onClick={toggleSidebar}
                brandPage="sidebar"
                buttonType="navigation"
                destination="internal_page"
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <span className="text-white font-bold text-xl tracking-wide">
                    HOME
                  </span>
                </div>
              </LinkWithUtm>
            </div>

            {/* PLAYROOM */}
            <div className="mb-2">
              <LinkWithUtm
                href="/playroom"
                className={`block transition-all ${
                  isActive("/playroom")
                    ? "bg-white/10 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                onClick={toggleSidebar}
                brandPage="sidebar"
                buttonType="navigation"
                destination="internal_page"
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <span className="text-white font-bold text-xl tracking-wide">
                    PLAYROOM
                  </span>
                </div>
              </LinkWithUtm>
            </div>

            {/* OFFLINE */}
            <div className="mb-2">
              <LinkWithUtm
                href="/offline"
                className={`block transition-all ${
                  isActive("/offline")
                    ? "bg-white/10 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                onClick={toggleSidebar}
                brandPage="sidebar"
                buttonType="navigation"
                destination="internal_page"
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <span className="text-white font-bold text-xl tracking-wide">
                    OFFLINE
                  </span>
                </div>
              </LinkWithUtm>
            </div>

            {/* PROJECT */}
            <div className="mb-2">
              <LinkWithUtm
                href="/project"
                className={`block transition-all ${
                  isActive("/project")
                    ? "bg-white/10 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                onClick={toggleSidebar}
                brandPage="sidebar"
                buttonType="navigation"
                destination="internal_page"
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <span className="text-white font-bold text-xl tracking-wide">
                    PROJECT
                  </span>
                </div>
              </LinkWithUtm>
            </div>

          </nav>

          {/* 하단 버튼 영역 */}
          <div className="px-5 pb-8 flex flex-col gap-3">
            <a
              href="https://tool.ssobig.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-[48px] w-full rounded-lg bg-white text-black font-bold text-base hover:bg-gray-200 transition-colors"
              onClick={toggleSidebar}
            >
              쏘빅툴 바로가기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <button
              className="flex items-center justify-center gap-2 h-[48px] w-full rounded-lg bg-white/10 text-white font-bold text-base hover:bg-white/20 transition-colors"
              onClick={() => {
                if (platform === "android") {
                  window.open("https://play.google.com/store/apps/details?id=com.ssobig.ssobigtool&hl=ko", "_blank");
                } else {
                  window.open("https://apps.apple.com/kr/app/ssobig-tool/id6745536878", "_blank");
                }
                toggleSidebar();
              }}
            >
              {platform === "android" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.707l2.585 1.497a1 1 0 010 1.006l-2.585 1.497-2.537-2.537 2.537-2.463zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              )}
              {platform === "android" ? "Google Play에서 다운로드" : platform === "ios" ? "App Store에서 다운로드" : "앱 다운로드"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
