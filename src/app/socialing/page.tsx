"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function SocialingPage() {
  const [activeSection, setActiveSection] = useState(0);
  const scrollDeltaRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 페이지 진입 시 1섹션으로 스크롤
  useEffect(() => {
    // 브라우저의 스크롤 복원 방지
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // DOM이 완전히 렌더링된 후 실행
    setTimeout(() => {
      const container = document.querySelector(".snap-container");
      if (container) {
        container.scrollTop = 0;
        setActiveSection(0);
      }
    }, 0);

    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);

  useEffect(() => {
    const container = document.querySelector(".snap-container");
    if (!container) return;

    const sections = container.querySelectorAll("section");
    const SCROLL_THRESHOLD = 10; // 100px 이상 스크롤해야 섹션 전환

    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) return;

      // 버튼, 링크 등 인터랙티브 요소에서는 스크롤 방지하지 않음
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']")
      ) {
        return;
      }

      e.preventDefault();
      scrollDeltaRef.current += e.deltaY;

      // 타임아웃 클리어
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 스크롤 델타가 임계값을 넘으면 섹션 이동
      if (Math.abs(scrollDeltaRef.current) >= SCROLL_THRESHOLD) {
        isScrollingRef.current = true;

        let newSection = activeSection;
        if (scrollDeltaRef.current > 0 && activeSection < sections.length - 1) {
          // 아래로 스크롤
          newSection = activeSection + 1;
        } else if (scrollDeltaRef.current < 0 && activeSection > 0) {
          // 위로 스크롤
          newSection = activeSection - 1;
        }

        if (newSection !== activeSection) {
          setActiveSection(newSection);
          sections[newSection].scrollIntoView({ behavior: "smooth" });
        }

        scrollDeltaRef.current = 0;

        // 스크롤 애니메이션 완료 후 다시 스크롤 가능하도록
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      } else {
        // 스크롤 멈춤 감지 (200ms 동안 스크롤 없으면 델타 리셋)
        scrollTimeoutRef.current = setTimeout(() => {
          scrollDeltaRef.current = 0;
        }, 200);
      }
    };

    // 터치 이벤트 처리 (모바일)
    let touchStartY = 0;
    let touchDeltaY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchDeltaY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      // 버튼, 링크 등 인터랙티브 요소에서는 스크롤 방지하지 않음
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']")
      ) {
        return;
      }

      const touchY = e.touches[0].clientY;
      touchDeltaY = touchStartY - touchY;

      if (Math.abs(touchDeltaY) >= SCROLL_THRESHOLD) {
        e.preventDefault();
        isScrollingRef.current = true;

        let newSection = activeSection;
        if (touchDeltaY > 0 && activeSection < sections.length - 1) {
          newSection = activeSection + 1;
        } else if (touchDeltaY < 0 && activeSection > 0) {
          newSection = activeSection - 1;
        }

        if (newSection !== activeSection) {
          setActiveSection(newSection);
          sections[newSection].scrollIntoView({ behavior: "smooth" });
        }

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      }
    };

    const handleTouchEnd = () => {
      touchDeltaY = 0;
    };

    container.addEventListener("wheel", handleWheel as EventListener, {
      passive: false,
    });
    container.addEventListener(
      "touchstart",
      handleTouchStart as EventListener,
      { passive: true }
    );
    container.addEventListener("touchmove", handleTouchMove as EventListener, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd as EventListener);

    return () => {
      container.removeEventListener("wheel", handleWheel as EventListener);
      container.removeEventListener(
        "touchstart",
        handleTouchStart as EventListener
      );
      container.removeEventListener(
        "touchmove",
        handleTouchMove as EventListener
      );
      container.removeEventListener(
        "touchend",
        handleTouchEnd as EventListener
      );
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeSection]);

  return (
    <div className="snap-container h-[100svh] overflow-hidden snap-y snap-mandatory -mt-[88px] md:-mt-[60px]">
      {/* 페이지네이션 인디케이터 - 오른쪽 중간 (세로 버전) */}
      <div className="fixed right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => {
              const container = document.querySelector(".snap-container");
              const sections = container?.querySelectorAll("section");
              if (sections && sections[index]) {
                sections[index].scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`w-2 rounded-full transition-all duration-700 ${
              index === activeSection
                ? activeSection === 0
                  ? "bg-gray-900 h-8"
                  : "bg-white h-8"
                : activeSection === 0
                ? "bg-gray-900/50 h-2"
                : "bg-white/50 h-2"
            }`}
            aria-label={`${index + 1}번 섹션으로 이동`}
          />
        ))}
      </div>

      {/* 1. 쏘빅툴 섹션 - 화이트 배경 */}
      <section className="relative min-h-[100svh] snap-start bg-white overflow-hidden flex flex-col justify-center pt-12 sm:pt-16 md:pt-20">
        <div className="w-full">
          {/* 타이틀 */}
          <div className="w-full md:max-w-[1000px] mx-auto px-5 mb-12 [@media(max-height:800px)]:mb-6">
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              독창적인 콘텐츠로 만드는
              <br />
              특별한 인연
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold mt-6 sm:mt-8 mb-2 sm:mb-3">
              쏘빅의 소셜링은
            </p>
            <ul className="space-y-0 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>
                  사람과 사람을 잇고,{" "}
                  <strong className="font-bold">진짜 관계를 만드는 경험</strong>
                  을 제공합니다.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>
                  모임을 위해 만든 전용 웹 프로그램을 통해,{" "}
                  <br className="sm:hidden" />
                  <strong className="font-bold">
                    전문 기획자들이 참가자 경험을 정교하게 설계
                  </strong>
                  합니다.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>
                  3년 동안 70개가 넘는 콘텐츠를 만들었고,{" "}
                  <br className="sm:hidden" />
                  수많은 테스트와 개선을 거친{" "}
                  <strong className="font-bold">
                    엄선된 콘텐츠들로만 운영
                  </strong>
                  됩니다.
                </span>
              </li>
            </ul>
          </div>

          {/* CTA - 2개 버튼 */}
          <div className="w-full md:max-w-[1000px] mx-auto px-5 mb-12">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/socialing/love-buddies"
                className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full transition-colors hover:bg-gray-900 hover:text-white"
              >
                연프 좋아하는 솔로 💕
              </Link>
              <Link
                href="/socialing/game-orb"
                className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full transition-colors hover:bg-gray-900 hover:text-white"
              >
                게임 예능 러버 🎮
              </Link>
            </div>
          </div>

          {/* 가로 스크롤 애니메이션 - 무한 반복 */}
          <div className="relative overflow-hidden [@media(max-height:800px)]:hidden">
            <div className="flex animate-scroll">
              {/* 첫 번째 세트 */}
              <div className="flex gap-3 sm:gap-4 md:gap-6 px-3 flex-shrink-0">
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_슈가빌리지.png"
                      alt="슈가빌리지"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_나우서울.png"
                      alt="나우서울"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_위클리톡.png"
                      alt="위클리톡"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_콘크리트주토피아.png"
                      alt="콘크리트주토피아"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_캠퍼스라이프.jpg"
                      alt="캠퍼스라이프"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_불면증마피아.png"
                      alt="불면증마피아"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_죄수의딜래마.png"
                      alt="죄수의딜래마"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_프로토타입.png"
                      alt="프로토타입"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_설령전.png"
                      alt="설령전"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_이중스파이.png"
                      alt="이중스파이"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_마니또.png"
                      alt="마니또"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_일일남매.png"
                      alt="일일남매"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_동아리내연애금지.png"
                      alt="동아리내연애금지"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_바이너리.png"
                      alt="바이너리"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
              </div>

              {/* 두 번째 세트 (무한 스크롤을 위한 복제) */}
              <div className="flex gap-3 sm:gap-4 md:gap-6 px-3 flex-shrink-0">
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_슈가빌리지.png"
                      alt="슈가빌리지"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_나우서울.png"
                      alt="나우서울"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_위클리톡.png"
                      alt="위클리톡"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_콘크리트주토피아.png"
                      alt="콘크리트주토피아"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_캠퍼스라이프.jpg"
                      alt="캠퍼스라이프"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_불면증마피아.png"
                      alt="불면증마피아"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_죄수의딜래마.png"
                      alt="죄수의딜래마"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_프로토타입.png"
                      alt="프로토타입"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_설령전.png"
                      alt="설령전"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_이중스파이.png"
                      alt="이중스파이"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_마니또.png"
                      alt="마니또"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_일일남매.png"
                      alt="일일남매"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_동아리내연애금지.png"
                      alt="동아리내연애금지"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
                <div className="w-[120px] sm:w-[160px] md:w-[220px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/socialing/poster_바이너리.png"
                      alt="바이너리"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 스크롤 인디케이터 - 하단 중앙 */}
        <button
          onClick={() => {
            setActiveSection(1);
            const container = document.querySelector(".snap-container");
            const sections = container?.querySelectorAll("section");
            if (sections && sections[1]) {
              sections[1].scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="다음 섹션으로 이동"
        >
          <svg
            className="w-6 h-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </section>

      {/* 2. 러브버디즈 섹션 - 풀페이지 */}
      <section className="relative min-h-[100svh] snap-start flex items-center justify-center overflow-hidden pt-[88px] md:pt-[60px]">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ssobig_assets/lovebuddies/hero-overlay.png"
            alt="러브버디즈 배경"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            priority
            sizes="100vw"
            quality={100}
          />
        </div>

        {/* 오버레이 - 위에서 아래로 투명도 그라데이션 (80% → 50%) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/50 z-[1]"></div>

        {/* 컨텐츠 - 좌측 정렬 */}
        <div className="relative z-10 w-full md:max-w-[1000px] mx-auto px-5 flex flex-col items-start gap-[20px] text-left">
          {/* 로고 이미지 */}
          <div className="w-full max-w-[240px] h-[60px] sm:h-[80px] relative flex items-center">
            <Image
              src="/ssobig_assets/Logo/logo=Lovebuddies, color=white.png"
              alt="러브버디즈 로고"
              fill
              style={{ objectFit: "contain", objectPosition: "left center" }}
              className="object-contain"
              priority
              sizes="(max-width: 768px) 60vw, 240px"
            />
          </div>

          {/* 텍스트 섹션 */}
          <div className="text-left w-full">
            <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white mb-3 sm:mb-4 leading-tight">
              러브버디즈
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 leading-relaxed">
              &apos;술 없이&apos; 매력있고 사랑스러운 &lt;찐친&gt;들 잔뜩 만드는
              곳!
            </p>
          </div>

          <Link
            href="/socialing/love-buddies"
            className="inline-flex items-center justify-center border border-white/80 text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full transition-colors hover:border-white hover:bg-white/10"
          >
            러브버디즈 자세히 보기 →
          </Link>
        </div>

        {/* 스크롤 인디케이터 - 하단 중앙 */}
        <button
          onClick={() => {
            setActiveSection(2);
            const container = document.querySelector(".snap-container");
            const sections = container?.querySelectorAll("section");
            if (sections && sections[2]) {
              sections[2].scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="다음 섹션으로 이동"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </section>

      {/* 3. 게임오브 섹션 - 풀페이지 */}
      <section className="relative h-screen snap-start flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ssobig_assets/gameorb/hero-overlay.png"
            alt="게임오브 배경"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            sizes="100vw"
            quality={100}
          />
        </div>

        {/* 오버레이 - 위에서 아래로 투명도 그라데이션 (검정과 보라의 중간색) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/85 via-[#0A0017]/70 to-[#0A0017]/55 z-[1]"></div>

        {/* 컨텐츠 - 좌측 정렬 */}
        <div className="relative z-10 w-full md:max-w-[1000px] mx-auto px-5 flex flex-col items-start gap-[20px]">
          {/* 로고 이미지 */}
          <div className="w-full max-w-[240px] h-[60px] sm:h-[80px] relative flex items-center">
            <Image
              src="/ssobig_assets/Logo/logo=gameorb, color=white.png"
              alt="게임오브 로고"
              fill
              style={{ objectFit: "contain", objectPosition: "left center" }}
              className="object-contain"
              priority
              sizes="(max-width: 768px) 60vw, 240px"
            />
          </div>

          {/* 텍스트 섹션 */}
          <div className="text-left w-full">
            <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white mb-3 sm:mb-4 leading-tight">
              게임오브
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 leading-relaxed">
              무료한 일상은 그만! 게임으로 찐친 만들기
            </p>
          </div>

          <Link
            href="/socialing/game-orb"
            className="inline-flex items-center justify-center border border-white/80 text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full transition-colors hover:border-white hover:bg-white/10"
          >
            게임오브 자세히 보기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
