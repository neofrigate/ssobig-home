"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// 햄버거 아이콘 컴포넌트
const HamburgerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8 text-neutral-100 hover:text-neutral-300 transition-colors"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 햄버거 버튼 - 항상 표시 */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <button aria-label="메뉴 열기" className="p-2" onClick={toggleSidebar}>
          <HamburgerIcon />
        </button>
      </div>

      {/* 사이드바 오버레이 - 열렸을 때만 표시 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* 사이드바 내용 */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-10">
            <div className="text-white">
              <Link href="/" className="flex items-center">
                <Image
                  src="/ssobig_assets/쏘빅 로고-흑백.png"
                  alt="쏘빅 로고"
                  width={51}
                  height={32}
                  className="w-[51px] h-[32px]"
                  priority
                />
              </Link>
            </div>
          </div>

          <nav className="text-white">
            <div className="mb-6">
              <div className="mb-2 text-sm text-gray-400">Solutions</div>
              <Link
                href="https://about.ssobig.com"
                className="block py-2 hover:opacity-80 transition-opacity"
              >
                <div className="h-[30px] relative">
                  <Image
                    src="/ssobig_assets/brand logo 2=ssobigtool.png"
                    alt="ssobig tool"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            <div className="mb-6">
              <div className="mb-2 text-sm text-gray-400">Social Brands</div>
              <Link
                href="/brand/love_buddies"
                className="block py-2 hover:opacity-80 transition-opacity"
              >
                <div className="h-[30px] relative">
                  <Image
                    src="/ssobig_assets/brand logo 2=러브버디즈.png"
                    alt="Love Buddies"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </Link>
              <Link
                href="/brand/now_seoul"
                className="block py-2 hover:opacity-80 transition-opacity"
              >
                <div className="h-[30px] relative">
                  <Image
                    src="/ssobig_assets/brand logo 2=나우서울.png"
                    alt="N.O.W.seoul"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </Link>
              <Link
                href="/brand/game_orb"
                className="block py-2 hover:opacity-80 transition-opacity"
              >
                <div className="h-[30px] relative">
                  <Image
                    src="/ssobig_assets/brand logo 2=게임오브.png"
                    alt="GAME ORB"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            <div className="mb-6">
              <div className="mb-2 text-sm text-gray-400">Community</div>
              <Link
                href="https://dis.qa/hKclNB"
                className="block py-2 hover:opacity-80 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="h-[30px] relative">
                  <Image
                    src="/ssobig_assets/brand logo 2=ssobigs.png"
                    alt="SSOBIGS"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
