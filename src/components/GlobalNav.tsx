"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// 햄버거 아이콘 컴포넌트 (모바일용)
const HamburgerIcon = ({ isWhiteBg }: { isWhiteBg: boolean }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-6 h-6 transition-colors duration-700 ${
      isWhiteBg
        ? "text-gray-900 hover:text-gray-600"
        : "text-white hover:text-gray-200"
    }`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

type GlobalNavProps = {
  toggleSidebar: () => void;
};

const GlobalNav: React.FC<GlobalNavProps> = ({ toggleSidebar }) => {
  const pathname = usePathname();

  // 플레이룸 페이지 체크
  const isPlayroomPage = pathname === "/playroom";
  // 소셜링 페이지들 (투명 배경 유지)
  const isSocialingPage =
    pathname.startsWith("/socialing/love-buddies") ||
    pathname.startsWith("/socialing/game-orb");
  // 소셜링 메인 페이지 (스크롤에 따라 변경)
  const isSocialingMainPage = pathname === "/socialing";
  // 메인 홈 페이지
  const isHomePage = pathname === "/";

  // 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 초기 상태를 false로 설정하여 서버/클라이언트 hydration 일치
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [initialViewportHeight, setInitialViewportHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // 마운트 상태 설정
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 초기 viewport 높이 저장 (모바일 브라우저 주소창 문제 해결)
  useEffect(() => {
    if (!isMounted) return;

    // 페이지 로드 시와 경로 변경 시 viewport 높이 재설정
    const updateViewportHeight = () => {
      setInitialViewportHeight(window.innerHeight);
    };

    updateViewportHeight();

    // 소셜링 메인 페이지 진입 시 초기 상태를 1섹션(흰 배경)으로 설정
    if (isSocialingMainPage) {
      setIsScrolled(true);
    } else if (!isPlayroomPage && !isSocialingPage) {
      // 다른 페이지는 초기 상태를 false로
      setIsScrolled(false);
    }

    // orientationchange 이벤트도 처리 (태블릿 회전 대응)
    window.addEventListener("orientationchange", updateViewportHeight);
    return () =>
      window.removeEventListener("orientationchange", updateViewportHeight);
  }, [
    pathname,
    isSocialingMainPage,
    isPlayroomPage,
    isSocialingPage,
    isMounted,
  ]);

  // 스크롤 감지 + 방향 감지
  useEffect(() => {
    if (!isMounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          let currentScrollY = window.scrollY;

          // 소셜링 메인 페이지는 스냅 컨테이너의 스크롤 감지
          if (isSocialingMainPage) {
            const snapContainer = document.querySelector(".snap-container");
            if (snapContainer) {
              currentScrollY = snapContainer.scrollTop;
              // 1번째 섹션(화이트 배경)에 있는지 체크
              // 초기 viewport 높이를 사용하여 모바일 브라우저 주소창 영향 제거
              const viewportHeight =
                initialViewportHeight || window.innerHeight;
              // 1번 섹션(0 ~ 1 viewport)에 있으면 흰색 배경
              if (currentScrollY < viewportHeight * 0.95) {
                setIsScrolled(true);
              } else {
                setIsScrolled(false);
              }
            }
          } else if (isHomePage) {
            // 메인 홈 페이지: 히어로 섹션이 거의 끝날 때 흰색으로 전환
            const viewportHeight = initialViewportHeight || window.innerHeight;
            if (currentScrollY > viewportHeight * 0.85) {
              setIsScrolled(true);
            } else {
              setIsScrolled(false);
            }
          } else {
            // 배경 변경 감지
            if (currentScrollY > 50) {
              setIsScrolled(true);
            } else {
              setIsScrolled(false);
            }
          }

          // GNB 표시/숨김 로직 (모바일만, 브랜드 메인 페이지는 항상 표시)
          const isMobile = window.innerWidth < 768;

          if (isSocialingMainPage) {
            // 브랜드 메인 페이지는 항상 GNB 표시
            document.body.classList.remove("gnb-hidden");
          } else if (isMobile) {
            if (currentScrollY < 10) {
              // 최상단에서는 항상 표시
              document.body.classList.remove("gnb-hidden");
            } else if (currentScrollY < lastScrollY) {
              // 스크롤 업 (위로) - 표시
              document.body.classList.remove("gnb-hidden");
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
              // 스크롤 다운 (아래로) - 숨김
              document.body.classList.add("gnb-hidden");
            }
          } else {
            // 데스크탑에서는 항상 표시
            document.body.classList.remove("gnb-hidden");
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // 브랜드 메인 페이지는 스냅 컨테이너에 리스너 추가
    if (isSocialingMainPage) {
      const snapContainer = document.querySelector(".snap-container");
      if (snapContainer) {
        snapContainer.addEventListener("scroll", handleScroll, {
          passive: true,
        });
        return () => snapContainer.removeEventListener("scroll", handleScroll);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    lastScrollY,
    isSocialingMainPage,
    isHomePage,
    initialViewportHeight,
    isMounted,
  ]);

  // 브랜드 메인 페이지 초기 로드 시 GNB 표시
  useEffect(() => {
    if (!isMounted) return;

    if (isSocialingMainPage) {
      document.body.classList.remove("gnb-hidden");
    }
  }, [isSocialingMainPage, isMounted]);

  // iOS Safari 주소창/뷰포트 변화 대응 & 데스크탑 전환 시 GNB 복구
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const currentScrollY = Math.max(0, window.scrollY);

      // 브랜드 메인 페이지는 항상 표시
      if (isSocialingMainPage) {
        document.body.classList.remove("gnb-hidden");
      } else if (!isMobile) {
        // 데스크탑으로 전환되면 항상 GNB 표시
        document.body.classList.remove("gnb-hidden");
      } else if (currentScrollY < 10) {
        // 모바일에서 최상단이면 표시
        document.body.classList.remove("gnb-hidden");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSocialingMainPage, isMounted]);

  // 페이지 유형에 따른 네비게이션 모드 결정
  const navMode: "overlay" | "light" | "dark" = (() => {
    // 클라이언트가 마운트되기 전에는 안전한 기본 상태 사용
    if (!isMounted) {
      return "overlay";
    }
    if (isSocialingPage || isPlayroomPage) {
      return "overlay";
    }
    if (isSocialingMainPage) {
      return isScrolled ? "light" : "overlay";
    }
    if (isScrolled) {
      return "light";
    }
    return "overlay";
  })();

  const navBgClass = navMode === "light" ? "bg-white" : "";

  const useBlackText = navMode === "light";
  const useWhiteText = !useBlackText;
  const underlineColorClass = useBlackText ? "bg-gray-900" : "bg-white";
  const ctaStyleClass = useBlackText
    ? "bg-black text-white hover:bg-black/80"
    : "bg-white text-black hover:bg-gray-100";

  return (
    <nav
      className={`global-nav transition-colors duration-700 ${navBgClass} relative`}
      style={{
        // iOS Safari 오버스크롤 대응
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Overlay mode background layers - 모바일만 */}
      {navMode === "overlay" && (
        <>
          {/* 기본 블러 레이어 (5px) */}
          <div
            className="absolute inset-0 pointer-events-none md:hidden"
            style={{
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
            }}
          />
          {/* 추가 블러 레이어 (20px) - 그라데이션 마스크 적용 */}
          <div
            className="absolute inset-0 pointer-events-none md:hidden"
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
            }}
          />
          {/* 색상 오버레이 레이어 */}
          <div
            className="absolute inset-0 pointer-events-none md:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)",
            }}
          />
        </>
      )}
      {/* 모바일 버전 (md 미만) */}
      <div className="md:hidden relative z-10">
        {/* 1단: 로고 (52px) */}
        <div className="h-[52px] flex items-center justify-between px-5">
          <Link href="/" className="flex items-center relative">
            {/* 흰색 로고 */}
            <Image
              src="/ssobig_assets/Logo/logo=ssobig, color=white.png"
              alt="쏘빅"
              width={80}
              height={29}
              className="transition-opacity duration-700 h-auto"
              unoptimized
              style={{
                opacity: useWhiteText ? 1 : 0,
              }}
              suppressHydrationWarning
            />
            {/* 검은색 로고 */}
            <Image
              src="/ssobig_assets/Logo/logo=ssobig, color=black.png"
              alt="쏘빅"
              width={80}
              height={29}
              className="transition-opacity duration-700 absolute top-0 left-0 h-auto"
              unoptimized
              style={{
                opacity: useBlackText ? 1 : 0,
              }}
              suppressHydrationWarning
            />
          </Link>

          <button
            aria-label="메뉴 열기"
            className="p-2"
            onClick={toggleSidebar}
          >
            <HamburgerIcon isWhiteBg={useBlackText} />
          </button>
        </div>

        {/* 2단: 메뉴 (36px) */}
        <div className="h-[36px] relative flex items-center justify-start gap-4 px-5">
          <Link
            href="/playroom"
            className="relative h-full flex items-center font-medium text-sm"
          >
            <div className="relative">
              {/* 흰색 로고 */}
              <Image
                src="/ssobig_assets/Logo/logo=playroom, color=white.png"
                alt="PLAYROOm"
                width={82}
                height={26}
                className="transition-opacity duration-700 h-auto"
                unoptimized
                style={{
                  opacity: useWhiteText
                    ? pathname === "/playroom"
                      ? 1
                      : 0.4
                    : 0,
                }}
                suppressHydrationWarning
              />
              {/* 검은색 로고 */}
              <Image
                src="/ssobig_assets/Logo/logo=playroom, color=black.png"
                alt="PLAYROOm"
                width={82}
                height={26}
                className="transition-opacity duration-700 absolute top-0 left-0 h-auto"
                unoptimized
                style={{
                  opacity: useBlackText
                    ? pathname === "/playroom"
                      ? 1
                      : 0.4
                    : 0,
                }}
                suppressHydrationWarning
              />
            </div>
            {pathname === "/playroom" && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-[1px] transition-colors duration-700 ${underlineColorClass}`}
              />
            )}
          </Link>

          <Link
            href="/socialing"
            className="relative h-full flex items-center font-medium text-sm"
            onClick={(e) => {
              if (pathname === "/socialing") {
                e.preventDefault();
                const container = document.querySelector(".snap-container");
                if (container) {
                  container.scrollTop = 0;
                }
              }
            }}
          >
            <span
              className={`transition-all duration-700 ${
                useBlackText ? "text-gray-900" : "text-white"
              }`}
              style={{
                opacity:
                  isMounted &&
                  pathname.startsWith("/socialing") &&
                  pathname !== "/socialing/game-orb/event"
                    ? 1
                    : 0.4,
              }}
              suppressHydrationWarning
            >
              SOCIALING
            </span>
            {isMounted &&
              pathname.startsWith("/socialing") &&
              pathname !== "/socialing/game-orb/event" && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[1px] transition-colors duration-700 ${underlineColorClass}`}
                  suppressHydrationWarning
                />
              )}
          </Link>

          <Link
            href="/socialing/game-orb/event"
            className="relative h-full flex items-center font-medium text-sm"
          >
            <span
              className={`transition-all duration-700 ${
                useBlackText ? "text-gray-900" : "text-white"
              }`}
              style={{
                opacity:
                  isMounted && pathname === "/socialing/game-orb/event"
                    ? 1
                    : 0.4,
              }}
              suppressHydrationWarning
            >
              EVENT
            </span>
            {isMounted && pathname === "/socialing/game-orb/event" && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-[1px] transition-colors duration-700 ${underlineColorClass}`}
                suppressHydrationWarning
              />
            )}
          </Link>
        </div>
      </div>

      {/* 웹 버전 (md 이상) - 스크롤에 따라 변경 */}
      <div className="hidden md:flex items-center justify-between px-8 max-w-[1400px] mx-auto h-full relative z-10">
        {/* 로고 */}
        <Link href="/" className="flex items-center h-full">
          <Image
            src={
              useBlackText
                ? "/ssobig_assets/Logo/logo=ssobig, color=black.png"
                : "/ssobig_assets/Logo/logo=ssobig, color=white.png"
            }
            alt="쏘빅"
            width={120}
            height={44}
            unoptimized
            className="h-auto"
            suppressHydrationWarning
          />
        </Link>

        {/* 메뉴 */}
        <div className="flex items-center gap-6 h-full">
          <Link
            href="/playroom"
            className="relative flex items-center h-full transition-opacity hover:opacity-80"
          >
            <Image
              src={
                useBlackText
                  ? "/ssobig_assets/Logo/logo=playroom, color=black.png"
                  : "/ssobig_assets/Logo/logo=playroom, color=white.png"
              }
              alt="PLAYROOm"
              width={122}
              height={39}
              unoptimized
              className="h-auto"
              style={{
                opacity: pathname === "/playroom" ? 1 : 0.6,
              }}
              suppressHydrationWarning
            />
            {pathname === "/playroom" && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-[1px] ${underlineColorClass}`}
              />
            )}
          </Link>
          <div
            className="relative flex items-center h-full"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link
              href="/socialing"
              className="relative flex items-center h-full transition-opacity hover:opacity-80"
              onClick={(e) => {
                if (pathname === "/socialing") {
                  e.preventDefault();
                  const container = document.querySelector(".snap-container");
                  if (container) {
                    container.scrollTop = 0;
                  }
                }
              }}
            >
              <span
                className={`font-medium text-base transition-colors duration-700 ${
                  useBlackText ? "text-gray-900" : "text-white"
                }`}
                style={{
                  opacity:
                    isMounted &&
                    pathname.startsWith("/socialing") &&
                    pathname !== "/socialing/game-orb/event"
                      ? 1
                      : 0.6,
                }}
                suppressHydrationWarning
              >
                SOCIALING
              </span>
              {isMounted &&
                pathname.startsWith("/socialing") &&
                pathname !== "/socialing/game-orb/event" && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[1px] ${underlineColorClass}`}
                    suppressHydrationWarning
                  />
                )}
            </Link>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div
                className={`absolute top-full left-0 mt-0 w-36 z-50 transition-colors duration-700 rounded-xl overflow-hidden ${
                  useBlackText ? "bg-white/40" : "bg-black/40"
                }`}
                style={{
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: useBlackText
                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                    : "0 10px 25px -5px rgba(255, 255, 255, 0.4), 0 8px 10px -6px rgba(255, 255, 255, 0.3)",
                }}
              >
                <Link
                  href="/socialing/love-buddies"
                  className={`block px-4 py-3 text-sm transition-colors duration-700 ${
                    useBlackText
                      ? "text-gray-900 hover:bg-black/10"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  러브버디즈
                </Link>
                <Link
                  href="/socialing/game-orb"
                  className={`block px-4 py-3 text-sm transition-colors duration-700 ${
                    useBlackText
                      ? "text-gray-900 hover:bg-black/10"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  게임오브
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/socialing/game-orb/event"
            className="relative flex items-center h-full transition-opacity hover:opacity-80"
          >
            <span
              className={`font-medium text-base transition-colors duration-700 ${
                useBlackText ? "text-gray-900" : "text-white"
              }`}
              style={{
                opacity:
                  isMounted && pathname === "/socialing/game-orb/event"
                    ? 1
                    : 0.6,
              }}
              suppressHydrationWarning
            >
              EVENT
            </span>
            {isMounted && pathname === "/socialing/game-orb/event" && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-[1px] ${underlineColorClass}`}
                suppressHydrationWarning
              />
            )}
          </Link>
          <a
            href="https://tool.ssobig.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-6 py-2 rounded-full font-medium transition-all ${ctaStyleClass}`}
          >
            시작하기
          </a>
        </div>
      </div>
    </nav>
  );
};

export default GlobalNav;
