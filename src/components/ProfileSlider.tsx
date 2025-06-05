"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface ProfileCardProps {
  name: string;
  role: string;
  company: string;
  description: string;
  imageUrl?: string;
}

interface ProfileSliderProps {
  profiles: ProfileCardProps[];
}

const ProfileSlider = ({ profiles }: ProfileSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // 아이템 배열을 확장하여 무한 슬라이드 효과 생성
  const extendedProfiles = [
    ...profiles.slice(-2),
    ...profiles,
    ...profiles.slice(0, 2),
  ];

  // 중앙으로 스크롤
  const scrollToCenter = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const items = container.querySelectorAll(".profile-slide-item");
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
  }, []);

  // 다음 프로필로 이동
  const handleNext = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const newIndex = (currentIndex + 1) % profiles.length;
    setCurrentIndex(newIndex);

    // 중앙 프로필로 부드럽게 스크롤
    scrollToCenter(newIndex + 2); // +2는 앞에 추가된 프로필 때문
  }, [currentIndex, profiles.length, scrollToCenter]);

  // 이전 프로필로 이동
  const handlePrev = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const newIndex =
      currentIndex === 0 ? profiles.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);

    // 중앙 프로필로 부드럽게 스크롤
    scrollToCenter(newIndex + 2);
  }, [currentIndex, profiles.length, scrollToCenter]);

  // 특정 프로필로 이동
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
    }, 4000); // 4초마다 자동 슬라이드
    return () => clearInterval(interval);
  }, [handleNext]);

  // 컴포넌트 마운트 시 중앙 프로필로 스크롤
  useEffect(() => {
    if (scrollContainerRef.current) {
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

    // 오른쪽으로 스와이프 (이전 프로필)
    if (diff < -50) {
      handlePrev();
      touchStartX.current = null;
    }
    // 왼쪽으로 스와이프 (다음 프로필)
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
        className="relative overflow-hidden py-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center relative">
          <button
            onClick={handlePrev}
            className="absolute left-2 z-10 bg-black/40 rounded-full p-2 text-white hover:bg-black/60 transition-colors"
            aria-label="이전 프로필"
          >
            &#10094;
          </button>

          <div
            ref={scrollContainerRef}
            className="flex w-full overflow-x-scroll no-scrollbar snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {extendedProfiles.map((profile, i) => {
              return (
                <div
                  key={`${profile.name}-${i}`}
                  className="profile-slide-item w-[230px] flex-shrink-0 px-2 snap-center"
                >
                  <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 border border-white/20 hover:bg-white/15 min-h-[180px] flex flex-col justify-center">
                    {/* 프로필 정보 - 이름과 이미지 제거 */}
                    <div className="text-center">
                      <p className="text-blue-200 text-base font-bold mb-2">
                        {profile.role}
                      </p>
                      <p className="text-neutral-300 text-sm mb-4 font-medium">
                        {profile.company}
                      </p>
                      <p
                        className="text-neutral-200 text-sm leading-relaxed overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {profile.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-2 z-10 bg-black/40 rounded-full p-2 text-white hover:bg-black/60 transition-colors"
            aria-label="다음 프로필"
          >
            &#10095;
          </button>
        </div>

        {/* 인디케이터 점 */}
        <div className="flex justify-center mt-4">
          {profiles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full mx-1 transition-colors ${
                currentIndex === index ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`${index + 1}번 프로필로 이동`}
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

export default ProfileSlider;
