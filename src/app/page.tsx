"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Footer from "../components/Footer";

const bestcutImages = [
  "DSC00476.webp",
  "DSC00696.webp",
  "DSC00735.webp",
  "DSC00749.webp",
  "DSC00797.webp",
  "DSC01102.webp",
  "DSC08866.webp",
  "DSC09371.webp",
  "DSC09461.webp",
  "P1110584.JPG의 사본.webp",
  "P1110690.JPG의 사본.webp",
  "P1110712.JPG의 사본.webp",
];

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container) return;

    // GPU 가속을 위한 will-change 설정
    slider.style.willChange = "transform";

    // 한 세트의 너비를 한 번만 계산
    let setWidth = 0;
    const calculateSetWidth = () => {
      const firstImage = slider.querySelector("div");
      if (firstImage) {
        const imageWidth = firstImage.offsetWidth;
        const gap =
          window.innerWidth >= 768 ? 16 : window.innerWidth >= 640 ? 12 : 8;
        setWidth = (imageWidth + gap) * bestcutImages.length;
      }
    };

    // 초기 계산
    calculateSetWidth();

    // 리사이즈 시 재계산
    const handleResize = () => {
      calculateSetWidth();
    };
    window.addEventListener("resize", handleResize);

    let baseOffset = 0;
    const speed = 0.8; // 애니메이션 속도 (픽셀/프레임)

    const animate = () => {
      if (!isUserScrollingRef.current && setWidth > 0) {
        baseOffset += speed;
        // 한 세트 너비만큼 이동하면 리셋
        if (baseOffset >= setWidth) {
          baseOffset = 0;
        }
      }

      // translate3d를 사용해 GPU 가속
      slider.style.transform = `translate3d(-${baseOffset}px, 0, 0)`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const deltaX = e.deltaX || e.deltaY;
      baseOffset += deltaX * 0.5;

      // 한 세트 너비를 넘어가면 리셋
      if (setWidth > 0) {
        while (baseOffset >= setWidth) {
          baseOffset -= setWidth;
        }
        while (baseOffset < 0) {
          baseOffset += setWidth;
        }
      }

      // 수동 스크롤 중 표시
      if (!isUserScrollingRef.current) {
        isUserScrollingRef.current = true;
      }

      // 스크롤이 멈춘 후 자동 스크롤 재개
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
    };

    // 터치 이벤트 처리 (모바일)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartOffset = 0;
    let isHorizontalScroll = false;
    let isFirstMove = true;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartOffset = baseOffset;
      isUserScrollingRef.current = true;
      isHorizontalScroll = false;
      isFirstMove = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchStartX - touchX;
      const diffY = touchStartY - touchY;

      if (isFirstMove) {
        // 첫 이동 시 수평 스크롤인지 수직 스크롤인지 판단
        if (Math.abs(diffX) > Math.abs(diffY)) {
          isHorizontalScroll = true;
        }
        isFirstMove = false;
      }

      if (isHorizontalScroll) {
        // 수평 스크롤일 때만 슬라이더 이동 및 기본 동작(수직 스크롤) 방지
        e.preventDefault();
        baseOffset = touchStartOffset + diffX;

        // 한 세트 너비를 넘어가면 리셋
        if (setWidth > 0) {
          while (baseOffset >= setWidth) {
            baseOffset -= setWidth;
            touchStartOffset -= setWidth;
          }
          while (baseOffset < 0) {
            baseOffset += setWidth;
            touchStartOffset += setWidth;
          }
        }
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // will-change 정리
      if (slider) {
        slider.style.willChange = "auto";
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white -mt-[88px] md:-mt-[60px] overflow-x-hidden">
      {/* 1. 히어로 섹션 - 전체 화면 (중앙 정렬 유지) - GNB와 겹침 */}
      <section className="relative h-[100svh] flex flex-col pt-[88px] md:pt-[60px]">
        {/* 중앙 컨텐츠 */}
        <div className="flex-1 flex items-center justify-center py-2 sm:py-3 md:py-4 lg:py-6 xl:py-8">
          <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl">
            <h1 className="text-[26px] sm:text-[34px] md:text-[36px] lg:text-[40px] xl:text-[52px] font-bold text-black mb-1 sm:mb-1.5 md:mb-2 lg:mb-2.5 leading-tight">
              2명의 소중한 시간부터
              <br />
              100명의 특별한 순간까지
            </h1>
            <p className="text-[13px] sm:text-[15px] md:text-base lg:text-lg text-black mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 xl:mb-5 leading-relaxed">
              핸드폰 하나로 시작하는 검증된 재미
              <br />
              언제 어디서나 함께 즐길 수 있는 특별한 콘텐츠
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 md:gap-3 lg:gap-3 justify-center">
              <Link
                href="/playroom"
                className="bg-black text-white px-5 sm:px-6 md:px-5 lg:px-6 xl:px-7 py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 text-[13px] sm:text-[15px] md:text-[15px] lg:text-base xl:text-lg font-semibold hover:bg-gray-800 transition-colors rounded-full"
              >
                친구들과 즐기기
              </Link>
              <Link
                href="/offline"
                className="border border-black text-black px-5 sm:px-6 md:px-5 lg:px-6 xl:px-7 py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 text-[13px] sm:text-[15px] md:text-[15px] lg:text-base xl:text-lg font-semibold hover:bg-black hover:text-white transition-colors rounded-full"
              >
                새로운 사람과 알아가기
              </Link>
            </div>
          </div>
        </div>

        {/* 이미지 슬라이더 - 하단에 배치 */}
        <div
          ref={containerRef}
          className="w-full overflow-hidden h-[28vh] sm:h-[32vh] md:h-[25vh] lg:h-[28vh] xl:h-[30vh] flex-shrink-0 mb-5"
        >
          <div
            ref={sliderRef}
            className="flex h-full"
            style={{ width: "max-content" }}
          >
            {/* 첫 번째 세트 */}
            {bestcutImages.map((image, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 h-full aspect-video mx-1 sm:mx-1.5 md:mx-2 rounded-lg overflow-hidden"
              >
                <Image
                  src={`/ssobig_assets/bestcut/optimized/${image}`}
                  alt={`Bestcut ${index + 1}`}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ))}
            {/* 두 번째 세트 (무한 스크롤을 위한 복제) */}
            {bestcutImages.map((image, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 h-full aspect-video mx-1 sm:mx-1.5 md:mx-2 rounded-lg overflow-hidden"
              >
                <Image
                  src={`/ssobig_assets/bestcut/optimized/${image}`}
                  alt={`Bestcut ${index + 1}`}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer mode="light" />
    </div>
  );
}
