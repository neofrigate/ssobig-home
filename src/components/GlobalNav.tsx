"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

// 햄버거 아이콘 컴포넌트는 기존 Sidebar 컴포넌트에서 가져옴
const HamburgerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-100 hover:text-neutral-300 transition-colors"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

// 뒤로가기 아이콘 컴포넌트
const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-100 hover:text-neutral-300 transition-colors"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

type GlobalNavProps = {
  toggleSidebar: () => void;
};

const GlobalNav: React.FC<GlobalNavProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();

  // 홈 페이지에서는 뒤로가기 버튼 숨김
  const isHomePage = pathname === "/";

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-[72px] z-40">
      <div className="h-full flex items-center justify-between px-6">
        {!isHomePage ? (
          <button aria-label="뒤로 가기" className="p-2" onClick={handleBack}>
            <BackIcon />
          </button>
        ) : (
          <div className="w-12">
            {/* 홈페이지에서는 뒤로가기 버튼 공간만 확보 */}
          </div>
        )}

        <div className="flex-1"></div>

        <button aria-label="메뉴 열기" className="p-2" onClick={toggleSidebar}>
          <HamburgerIcon />
        </button>
      </div>
    </div>
  );
};

export default GlobalNav;
