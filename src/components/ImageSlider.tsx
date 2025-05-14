"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageSliderProps {
  images: string[];
  altTexts?: string[];
}

const ImageSlider = ({ images, altTexts }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [centerItemIndex, setCenterItemIndex] = useState<number | null>(null);

  // 아이템 배열을 확장하여 무한 슬라이드 효과 생성
  const extendedImages = [
    ...images.slice(-2),
    ...images,
    ...images.slice(0, 2),
  ];

  // 중앙으로 스크롤
  const scrollToCenter = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const items = container.querySelectorAll(".slide-item");
    if (items.length <= index) return;

    const targetItem = items[index] as HTMLElement;
    const containerWidth = container.offsetWidth;
    const itemWidth = targetItem.offsetWidth;

    // 타겟 아이템이 중앙에 오도록 스크롤 위치 계산
    const scrollLeft =
      targetItem.offsetLeft - containerWidth / 2 + itemWidth / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });

    setCenterItemIndex(index);
  }, []);

  // 다음 이미지로 이동
  const handleNext = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);

    // 중앙 이미지로 부드럽게 스크롤
    scrollToCenter(newIndex + 2); // +2는 앞에 추가된 이미지 때문
  }, [currentIndex, images.length, scrollToCenter]);

  // 이전 이미지로 이동
  const handlePrev = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);

    // 중앙 이미지로 부드럽게 스크롤
    scrollToCenter(newIndex + 2);
  }, [currentIndex, images.length, scrollToCenter]);

  // 특정 이미지로 이동
  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      scrollToCenter(index + 2);
    },
    [scrollToCenter]
  );

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 2000);
    return () => clearInterval(interval);
  }, [handleNext]);

  // 스크롤 이벤트 감지하여 중앙 아이템 계산
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const centerX = scrollLeft + containerWidth / 2;

      // 가장 중앙에 가까운 아이템 찾기
      const items = container.querySelectorAll(".slide-item");
      let closestItem = null;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const itemElement = item as HTMLElement;
        const itemLeft = itemElement.offsetLeft;
        const itemWidth = itemElement.offsetWidth;
        const itemCenter = itemLeft + itemWidth / 2;
        const distance = Math.abs(itemCenter - centerX);

        if (distance < minDistance) {
          minDistance = distance;
          closestItem = index;
        }
      });

      setCenterItemIndex(closestItem);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // 컴포넌트 마운트 시 중앙 이미지로 스크롤
  useEffect(() => {
    if (scrollContainerRef.current) {
      // 초기 렌더링 후 약간의 지연 후 스크롤 설정
      setTimeout(() => {
        scrollToCenter(currentIndex + 2);
      }, 100);
    }
  }, [currentIndex, scrollToCenter]);

  // 터치 이벤트 처리
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // 오른쪽으로 스와이프 (이전 이미지)
    if (diff < -50) {
      handlePrev();
      touchStartX.current = null;
    }
    // 왼쪽으로 스와이프 (다음 이미지)
    else if (diff > 50) {
      handleNext();
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  return (
    <div className="w-full">
      <div
        className="relative overflow-hidden"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center relative">
          <button
            onClick={handlePrev}
            className="absolute left-2 z-10 bg-black/40 rounded-full p-2 text-white hover:bg-black/60"
            aria-label="이전 이미지"
          >
            &#10094;
          </button>

          <div
            ref={scrollContainerRef}
            className="flex w-full overflow-x-scroll no-scrollbar snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {extendedImages.map((image, i) => {
              // 원본 배열에서의 인덱스 계산
              const originalIndex = (i - 2 + images.length) % images.length;
              const isCentered = centerItemIndex === i;

              return (
                <div
                  key={i}
                  className="slide-item min-w-[calc(40%-12px)] sm:min-w-[calc(33.333%-12px)] md:min-w-[calc(40%-12px)] flex-shrink-0 p-[6px] snap-center"
                >
                  <div
                    className={`w-full relative rounded-md overflow-hidden transition-all duration-800 
                      ${
                        isCentered
                          ? "ring-2 ring-white/20 scale-[1.02]"
                          : "scale-100"
                      }`}
                    style={{ paddingBottom: "133.33%" }}
                  >
                    <Image
                      src={image}
                      alt={
                        altTexts?.[originalIndex] ||
                        `슬라이드 이미지 ${originalIndex + 1}`
                      }
                      fill
                      sizes="(max-width: 640px) 40vw, (max-width: 768px) 33.333vw, 40vw"
                      style={{
                        objectFit: "cover",
                      }}
                      className={`transition-all duration-800 ${
                        isCentered ? "brightness-110" : "brightness-90"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-2 z-10 bg-black/40 rounded-full p-2 text-white hover:bg-black/60"
            aria-label="다음 이미지"
          >
            &#10095;
          </button>
        </div>

        {/* 인디케이터 점 */}
        <div className="flex justify-center mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full mx-1 ${
                currentIndex === index ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`${index + 1}번 슬라이드로 이동`}
            />
          ))}
        </div>
      </div>

      {/* 스타일 추가 */}
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ImageSlider;
