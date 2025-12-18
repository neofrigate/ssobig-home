"use client";

import Link from "next/link";
import { useState } from "react";

interface FooterProps {
  mode?: "dark" | "light";
}

const Footer = ({ mode = "dark" }: FooterProps) => {
  const [isFooterOpen, setIsFooterOpen] = useState(false);

  const isLight = mode === "light";

  return (
    <footer
      className={`${
        isLight
          ? "bg-white border-t border-gray-200"
          : "bg-black/80 border-t border-white/10"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6">
        <div
          className={`${
            isLight ? "text-gray-600" : "text-white/60"
          } text-xs leading-relaxed`}
        >
          {/* 상단: 회사명 + SNS 버튼들 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p
                className={`font-semibold text-base ${
                  isLight ? "text-gray-900" : "text-white/90"
                }`}
              >
                주식회사 쏘빅
              </p>
              <button
                onClick={() => setIsFooterOpen(!isFooterOpen)}
                className={`${
                  isLight
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-white/60 hover:text-white/80"
                } transition-colors`}
                aria-label="사업자 정보 토글"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isFooterOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {/* 인스타그램 */}
              <a
                href="https://www.instagram.com/ssobig_official/"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
                  isLight
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                aria-label="인스타그램"
              >
                <svg
                  className={`w-5 h-5 ${
                    isLight ? "text-gray-600" : "text-white/80"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* 유튜브 */}
              <a
                href="https://www.youtube.com/@ssobig"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
                  isLight
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                aria-label="유튜브"
              >
                <svg
                  className={`w-5 h-5 ${
                    isLight ? "text-gray-600" : "text-white/80"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 사업자 정보 - 토글 */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isFooterOpen ? "max-h-[300px] mb-3" : "max-h-0"
            }`}
          >
            <div
              className={`${
                isLight ? "text-gray-600" : "text-white/60"
              } text-xs leading-relaxed pt-2`}
            >
              <p className="mb-1">대표자 : 안민우, 조원철</p>
              <p className="mb-1">사업자등록번호 : 140-87-03096</p>
              <p className="mb-1">전화번호 : 02-2635-7942</p>
              <p className="mb-1">E-mail : ssobigstudio@gmail.com</p>
              <p className="mb-1">
                통신판매업신고번호 : 제2024-서울영등포-0816호
              </p>
              <p className="mb-3">
                주소 : 서울특별시 서초구 사평대로55길 37, (실란트로타워)지하2층
                (반포동)
              </p>
            </div>
          </div>

          {/* 약관 링크 */}
          <p className={`${isLight ? "text-gray-400" : "text-white/40"} pt-3`}>
            <Link
              href="https://about.ssobig.com/privacy_policy"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${
                isLight
                  ? "hover:text-gray-600"
                  : "hover:text-white/60"
              }`}
            >
              개인정보 처리방침
            </Link>
            <span className="mx-2">|</span>
            <Link
              href="https://about.ssobig.com/terms_of_service"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${
                isLight
                  ? "hover:text-gray-600"
                  : "hover:text-white/60"
              }`}
            >
              이용약관
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

