"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const EventPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    // 이벤트 페이지에서는 팝업을 표시하지 않음
    if (pathname === "/socialing/game-orb/event") {
      return;
    }

    // localStorage에서 팝업 숨김 여부 확인
    const hideUntil = localStorage.getItem("eventPopupHideUntil");
    const now = new Date().getTime();

    if (!hideUntil || now > parseInt(hideUntil)) {
      // 팝업을 보여줄 수 있는 경우 (사이트 첫 방문 시에만)
      setIsVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleHideForADay = () => {
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 24시간을 밀리초로
    localStorage.setItem("eventPopupHideUntil", (now + oneDay).toString());
    setIsVisible(false);
  };

  // 서버 사이드 렌더링 중에는 아무것도 렌더링하지 않음
  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/70 z-[9998] animate-fadeIn"
        onClick={handleClose}
      />

      {/* 팝업 컨텐츠 */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-5 py-4 animate-scaleIn">
        <div className="relative bg-black rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[85vh] overflow-hidden">
          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-all"
            aria-label="팝업 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* 이벤트 이미지 - 클릭 시 이벤트 페이지로 이동 */}
          <Link
            href="/socialing/game-orb/event"
            onClick={handleClose}
            className="block cursor-pointer"
          >
            <div className="relative w-full aspect-[3/4]">
              <Image
                src="/ssobig_assets/gameorb/빠니와 불마 포스터.png"
                alt="빠니보틀 x 쏘빅 - 불면증 마피아 이벤트"
                fill
                style={{ objectFit: "contain" }}
                priority
                sizes="500px"
              />
            </div>
          </Link>

          {/* 하루동안 보지 않기 버튼 */}
          <div className="p-3 border-t border-gray-700">
            <button
              onClick={handleHideForADay}
              className="w-full py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              하루동안 보지 않기
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default EventPopup;
