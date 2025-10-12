"use client";

import React, { useState } from "react";
import Image from "next/image";
import LinkWithUtm from "./LinkWithUtm";
import GlobalNav from "./GlobalNav";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
                  <Image
                    src="/ssobig_assets/Logo/logo=playroom, color=white.png"
                    alt="PLAYROOm"
                    width={125}
                    height={40}
                    unoptimized
                    className="h-auto"
                  />
                </div>
              </LinkWithUtm>
            </div>

            {/* SOCIALING */}
            <div className="mb-2">
              <LinkWithUtm
                href="/socialing"
                className={`block transition-all ${
                  isActive("/socialing") && pathname === "/socialing"
                    ? "bg-white/10 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                onClick={() => {
                  if (pathname.startsWith("/socialing")) {
                    const container = document.querySelector(".snap-container");
                    if (container) {
                      container.scrollTop = 0;
                    }
                  }
                  toggleSidebar();
                }}
                brandPage="sidebar"
                buttonType="navigation"
                destination="internal_page"
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <span className="text-white font-bold text-xl tracking-wide">
                    SOCIALING
                  </span>
                </div>
              </LinkWithUtm>

              {/* 서브 메뉴 */}
              <LinkWithUtm
                href="/socialing/love-buddies"
                className={`block transition-all ${
                  isActive("/socialing/love-buddies")
                    ? "bg-white/10 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                onClick={toggleSidebar}
                brandPage="sidebar"
                buttonType="navigation"
                destination="internal_page"
              >
                <div className="h-[50px] relative flex items-center px-5 pl-10">
                  <span className="text-white font-medium text-base">
                    러브버디즈
                  </span>
                </div>
              </LinkWithUtm>
              <LinkWithUtm
                href="/socialing/game-orb"
                className={`block transition-all ${
                  isActive("/socialing/game-orb")
                    ? "bg-white/10 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                onClick={toggleSidebar}
                brandPage="sidebar"
                buttonType="navigation"
                destination="internal_page"
              >
                <div className="h-[50px] relative flex items-center px-5 pl-10">
                  <span className="text-white font-medium text-base">
                    게임오브
                  </span>
                </div>
              </LinkWithUtm>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
