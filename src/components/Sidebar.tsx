"use client";

import React, { useState } from "react";
import Image from "next/image";
import LinkWithUtm from "./LinkWithUtm";
import GlobalNav from "./GlobalNav";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // 현재 경로와 링크 경로를 비교하여 액티브 상태 확인
  const isActive = (href: string) => {
    // 절대 URL은 pathname과 직접 비교할 수 없으므로 제외
    if (href.startsWith('http')) return false;
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
              <LinkWithUtm href="/" className="flex items-center">
                <Image
                  src="/ssobig_assets/쏘빅 로고-흑백.png"
                  alt="쏘빅 로고"
                  width={51}
                  height={32}
                  className="w-[51px] h-[32px]"
                  priority
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
            <div className="mb-6">
              <div className="mb-2 text-sm text-gray-400 px-5">Solutions</div>
              <LinkWithUtm
                href="https://about.ssobig.com"
                className={`block hover:opacity-80 transition-all ${
                  isActive("https://about.ssobig.com") ? "bg-white/10" : ""
                }`}
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <Image
                    src="/ssobig_assets/brand logo 2=ssobigtool.png"
                    alt="ssobig tool"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </LinkWithUtm>
            </div>

            <div className="mb-6">
              <div className="mb-2 text-sm text-gray-400 px-5">Social Brands</div>
              <LinkWithUtm
                href="/brand/love_buddies"
                className={`block hover:opacity-80 transition-all ${
                  isActive("/brand/love_buddies") ? "bg-white/10" : ""
                }`}
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <Image
                    src="/ssobig_assets/brand logo 2=러브버디즈.png"
                    alt="Love Buddies"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </LinkWithUtm>
              <LinkWithUtm
                href="/brand/now_seoul"
                className={`block hover:opacity-80 transition-all ${
                  isActive("/brand/now_seoul") ? "bg-white/10" : ""
                }`}
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <Image
                    src="/ssobig_assets/brand logo 2=나우서울.png"
                    alt="N.O.W.seoul"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </LinkWithUtm>
              <LinkWithUtm
                href="/brand/game_orb"
                className={`block hover:opacity-80 transition-all ${
                  isActive("/brand/game_orb") ? "bg-white/10" : ""
                }`}
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <Image
                    src="/ssobig_assets/brand logo 2=게임오브.png"
                    alt="GAME ORB"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </LinkWithUtm>
            </div>

            <div className="mb-6">
              <div className="mb-2 text-sm text-gray-400 px-5">Community</div>
              <LinkWithUtm
                href="https://dis.qa/hKclNB"
                className={`block hover:opacity-80 transition-all ${
                  isActive("https://dis.qa/hKclNB") ? "bg-white/10" : ""
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="h-[60px] relative flex items-center px-5">
                  <Image
                    src="/ssobig_assets/brand logo 2=ssobigs.png"
                    alt="SSOBIGS"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </LinkWithUtm>
            </div>
          </nav>

          {/* 푸터 추가 */}
          <footer className="text-left text-neutral-400 text-xs px-5 py-6 mt-auto border-t border-neutral-700/50">
            <p className="footer_p">주식회사 쏘빅</p>
            <p className="footer_p mb-2">대표자 : 안민우, 조원철</p>
            <p className="footer_p">사업자등록번호 : 140-87-03096</p>
            <p className="footer_p">전화번호 : 02-2635-7942</p>
            <p className="footer_e-mail">E-mail : ssobigstudio@gmail.com</p>
            <p className="footer_p">
              통신판매업신고번호 : 제2024-서울영등포-0816호
            </p>
            <p className="footer_p mb-3">
              주소 : 서울특별시 서초구 사평대로55길 37, (실란트로타워)지하2층
              (반포동)
            </p>
            <p className="footer_p">
              <LinkWithUtm
                href="https://about.ssobig.com/privacy_policy"
                style={{ color: "inherit", textDecoration: "underline" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보 처리방침
              </LinkWithUtm>
              <span style={{ margin: "0 5px" }}>|</span>
              <LinkWithUtm
                href="https://about.ssobig.com/terms_of_service"
                style={{ color: "inherit", textDecoration: "underline" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                이용약관
              </LinkWithUtm>
              <span style={{ margin: "0 5px" }}>|</span>
              <LinkWithUtm
                href="https://about.ssobig.com/refund_policy"
                style={{ color: "inherit", textDecoration: "underline" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                환불정책
              </LinkWithUtm>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
