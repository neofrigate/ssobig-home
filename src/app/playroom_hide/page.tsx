"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// 컨텐츠 카드 컴포넌트
interface ContentCardProps {
  image: string;
  title: string;
  description: string;
  players?: string;
  price?: string;
  link: string;
}

function ContentCard({
  image,
  title,
  description,
  players,
  price,
  link,
}: ContentCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-[152px] sm:w-[190px] md:w-[228px] cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 152px, (max-width: 768px) 190px, 228px"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <h3 className="text-gray-900 font-bold text-[15px] md:text-[17px] mb-1 truncate">
        {title}
      </h3>
      <div className="text-[13px] md:text-[14px]">
        <p className="text-gray-600 truncate">{description}</p>
        {players && price && (
          <div className="flex items-center gap-1 text-gray-500 truncate">
            {price === "무료" ? (
              <span>무료</span>
            ) : price === "문의" ? (
              <span>문의</span>
            ) : (
              <div className="flex items-center gap-[3px]">
                <Image
                  src="/ssobig_assets/playroom/icon-token.svg"
                  alt="토큰"
                  width={16}
                  height={16}
                  className="object-contain"
                />
                <span>{price.replace("토큰", "")}</span>
              </div>
            )}
            <span className="text-gray-400">|</span>
            <span>{players}</span>
          </div>
        )}
      </div>
    </a>
  );
}

// 컨텐츠 로우 컴포넌트
interface ContentRowProps {
  title: string;
  items: ContentCardProps[];
}

function ContentRow({ title, items }: ContentRowProps) {
  return (
    <section className="py-6 md:py-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-gray-900 text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold mb-4 md:mb-6">
          {title}
        </h2>
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {items.map((item, index) => (
            <ContentCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 배너 데이터 타입
interface BannerData {
  title1: string;
  title2: string;
  subtitle: string;
  bgImage: string;
  bgGradient: string;
  link: string;
}

export default function PlayroomPage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isFooterOpen, setIsFooterOpen] = useState(false);

  // 배너 데이터
  const banners: BannerData[] = [
    {
      title1: "추석에도 쏘빅에서",
      title2: "친구들과 마피아 즐기기",
      subtitle: "불면증 마피아가 궁금하다면?",
      bgImage: "/ssobig_assets/gameorb/insomnia-mafia.png",
      bgGradient: "from-purple-600 to-blue-600",
      link: "https://tool.ssobig.com",
    },
    {
      title1: "OTT보다 재밌다는",
      title2: "화제의 스토리게임",
      subtitle: "기억 속의 너 -쏘빅-",
      bgImage: "/ssobig_assets/gameorb/social-genius.png",
      bgGradient: "from-blue-600 to-cyan-600",
      link: "https://tool.ssobig.com",
    },
    {
      title1: "친구들과 함께하는",
      title2: "특별한 시간",
      subtitle: "100가지 이상의 템플릿",
      bgImage: "/ssobig_assets/gameorb/hero-main.jpg",
      bgGradient: "from-indigo-600 to-purple-600",
      link: "https://tool.ssobig.com",
    },
  ];

  // 스와이프 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // 왼쪽으로 스와이프 (다음)
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }

    if (touchStart - touchEnd < -50) {
      // 오른쪽으로 스와이프 (이전)
      setCurrentBannerIndex((prev) =>
        prev === 0 ? banners.length - 1 : prev - 1
      );
    }
  };

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* 배너 섹션 - 슬라이드 */}
      <section className="pt-4 md:pt-6">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div
            className="relative h-[400px] md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {banners.map((banner, index) => (
              <a
                key={index}
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${
                  index === currentBannerIndex
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div
                  className={`relative h-full bg-gradient-to-r ${banner.bgGradient}`}
                >
                  {/* 배경 이미지 */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={banner.bgImage}
                      alt={banner.title1}
                      fill
                      className="object-cover opacity-40"
                      priority={index === 0}
                      sizes="100vw"
                    />
                  </div>

                  {/* 배너 콘텐츠 - 텍스트 애니메이션 */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12">
                    <div
                      className={`max-w-2xl mb-2 md:mb-0 transition-all duration-700 ${
                        index === currentBannerIndex
                          ? "opacity-100 translate-y-0 delay-200"
                          : "opacity-0 translate-y-4"
                      }`}
                    >
                      <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold text-white leading-tight">
                        {banner.title1}
                      </h2>
                      <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold text-white mb-3 md:mb-4 leading-tight">
                        {banner.title2}
                      </h2>
                      <p className="text-[15px] md:text-base lg:text-lg text-white/80">
                        {banner.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}

            {/* 인디케이터 */}
            <div className="absolute bottom-4 md:bottom-6 right-6 md:right-12 z-20 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentBannerIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentBannerIndex
                      ? "bg-white w-8"
                      : "bg-white/50 w-2"
                  }`}
                  aria-label={`${index + 1}번 배너로 이동`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 쏘빅 랭킹 섹션 */}
      <section className="py-8 md:py-12 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          {/* 타이틀 */}
          <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-gray-900 mb-4">
            쏘빅 랭킹
          </h2>

          {/* 카테고리 필터 - 둥근 라인 스타일 (작고 흐리게) */}
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar mb-6">
            <button className="px-3 md:px-4 py-1 border border-gray-900 bg-gray-900 text-white rounded-full font-normal whitespace-nowrap hover:bg-gray-800 transition-colors text-[13px] md:text-[14px]">
              전체
            </button>
            <button className="px-3 md:px-4 py-1 border border-gray-300 bg-white text-gray-500 rounded-full font-normal whitespace-nowrap hover:border-gray-400 hover:text-gray-700 transition-colors text-[13px] md:text-[14px]">
              1인
            </button>
            <button className="px-3 md:px-4 py-1 border border-gray-300 bg-white text-gray-500 rounded-full font-normal whitespace-nowrap hover:border-gray-400 hover:text-gray-700 transition-colors text-[13px] md:text-[14px]">
              2인
            </button>
            <button className="px-3 md:px-4 py-1 border border-gray-300 bg-white text-gray-500 rounded-full font-normal whitespace-nowrap hover:border-gray-400 hover:text-gray-700 transition-colors text-[13px] md:text-[14px]">
              3-12인
            </button>
            <button className="px-3 md:px-4 py-1 border border-gray-300 bg-white text-gray-500 rounded-full font-normal whitespace-nowrap hover:border-gray-400 hover:text-gray-700 transition-colors text-[13px] md:text-[14px]">
              10인 이상
            </button>
          </div>

          {/* 랭킹 리스트 - 가로 스크롤 */}
          <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
            {/* 첫 번째 컬럼 (1-3위) */}
            <div className="flex-shrink-0 w-[320px] md:w-[420px] space-y-4">
              {/* 1위 */}
              <a
                href="https://tool.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer"
              >
                <div className="relative w-[80px] md:w-[120px] h-[107px] md:h-[160px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/ssobig_assets/gameorb/social-genius.png"
                    alt="소셜 지니어스"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                  />
                  {/* 순위 표시 - 포스터 왼쪽 하단 */}
                  <div className="absolute bottom-1 left-1">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      1
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-1 truncate group-hover:text-black">
                    소셜 지니어스
                  </h3>
                  <div className="text-[13px] md:text-[14px]">
                    <p className="text-gray-600 truncate">데블스플랜 현실판</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="flex items-center gap-[3px]">
                        <Image
                          src="/ssobig_assets/playroom/icon-token.svg"
                          alt="토큰"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        <span>3</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span>6~12인</span>
                    </div>
                  </div>
                </div>
              </a>

              {/* 2위 */}
              <a
                href="https://tool.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer"
              >
                <div className="relative w-[80px] md:w-[120px] h-[107px] md:h-[160px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/ssobig_assets/gameorb/insomnia-mafia.png"
                    alt="마피아 게임"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                  />
                  <div className="absolute bottom-1 left-1">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      2
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-1 truncate group-hover:text-black">
                    마피아 게임
                  </h3>
                  <div className="text-[13px] md:text-[14px]">
                    <p className="text-gray-600 truncate">클래식 추리 게임</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <span>무료</span>
                      <span className="text-gray-400">|</span>
                      <span>6~12인</span>
                    </div>
                  </div>
                </div>
              </a>

              {/* 3위 */}
              <a
                href="https://tool.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer"
              >
                <div className="relative w-[80px] md:w-[120px] h-[107px] md:h-[160px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/ssobig_assets/gameorb/insomnia-button.png"
                    alt="밸런스 게임"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                  />
                  <div className="absolute bottom-1 left-1">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      3
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-1 truncate group-hover:text-black">
                    밸런스 게임
                  </h3>
                  <div className="text-[13px] md:text-[14px]">
                    <p className="text-gray-600 truncate">2택1 선택 게임</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <span>무료</span>
                      <span className="text-gray-400">|</span>
                      <span>2~100인</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* 두 번째 컬럼 (4-6위) */}
            <div className="flex-shrink-0 w-[320px] md:w-[420px] space-y-4">
              {/* 4위 */}
              <a
                href="https://tool.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer"
              >
                <div className="relative w-[80px] md:w-[120px] h-[107px] md:h-[160px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/ssobig_assets/gameorb/prisoners-dilemma.png"
                    alt="죄수의 딜레마"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                  />
                  <div className="absolute bottom-1 left-1">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      4
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-1 truncate group-hover:text-black">
                    죄수의 딜레마
                  </h3>
                  <div className="text-[13px] md:text-[14px]">
                    <p className="text-gray-600 truncate">심리 게임</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="flex items-center gap-[3px]">
                        <Image
                          src="/ssobig_assets/playroom/icon-token.svg"
                          alt="토큰"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        <span>2</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span>2~12인</span>
                    </div>
                  </div>
                </div>
              </a>

              {/* 5위 */}
              <a
                href="https://tool.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer"
              >
                <div className="relative w-[80px] md:w-[120px] h-[107px] md:h-[160px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/ssobig_assets/gameorb/double-spy-poster.png"
                    alt="이중 스파이"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                  />
                  <div className="absolute bottom-1 left-1">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      5
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-1 truncate group-hover:text-black">
                    이중 스파이
                  </h3>
                  <div className="text-[13px] md:text-[14px]">
                    <p className="text-gray-600 truncate">팀 배신 게임</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="flex items-center gap-[3px]">
                        <Image
                          src="/ssobig_assets/playroom/icon-token.svg"
                          alt="토큰"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        <span>2</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span>6~12인</span>
                    </div>
                  </div>
                </div>
              </a>

              {/* 6위 */}
              <a
                href="https://tool.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer"
              >
                <div className="relative w-[80px] md:w-[120px] h-[107px] md:h-[160px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/ssobig_assets/gameorb/wizard-frog.png"
                    alt="위저드 프로그"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                  />
                  <div className="absolute bottom-1 left-1">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      6
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-1 truncate group-hover:text-black">
                    위저드 프로그
                  </h3>
                  <div className="text-[13px] md:text-[14px]">
                    <p className="text-gray-600 truncate">심리 게임</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="flex items-center gap-[3px]">
                        <Image
                          src="/ssobig_assets/playroom/icon-token.svg"
                          alt="토큰"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        <span>2</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span>3~6인</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* 세 번째 컬럼 (7-9위) */}
            <div className="flex-shrink-0 w-[320px] md:w-[420px] space-y-4">
              {/* 7위 */}
              <a
                href="https://tool.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer"
              >
                <div className="relative w-[80px] md:w-[120px] h-[107px] md:h-[160px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/ssobig_assets/gameorb/evil-phobe.png"
                    alt="사악한 포브"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                  />
                  <div className="absolute bottom-1 left-1">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      7
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-1 truncate group-hover:text-black">
                    사악한 포브
                  </h3>
                  <div className="text-[13px] md:text-[14px]">
                    <p className="text-gray-600 truncate">배신 게임</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="flex items-center gap-[3px]">
                        <Image
                          src="/ssobig_assets/playroom/icon-token.svg"
                          alt="토큰"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        <span>1</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span>3~6인</span>
                    </div>
                  </div>
                </div>
              </a>

              {/* 8위 */}
              <a
                href="https://tool.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer"
              >
                <div className="relative w-[80px] md:w-[120px] h-[107px] md:h-[160px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/ssobig_assets/gameorb/counseling-phobe.png"
                    alt="상담 포브"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                  />
                  <div className="absolute bottom-1 left-1">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      8
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-1 truncate group-hover:text-black">
                    상담 포브
                  </h3>
                  <div className="text-[13px] md:text-[14px]">
                    <p className="text-gray-600 truncate">소통 게임</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="flex items-center gap-[3px]">
                        <Image
                          src="/ssobig_assets/playroom/icon-token.svg"
                          alt="토큰"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        <span>1</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span>3~6인</span>
                    </div>
                  </div>
                </div>
              </a>

              {/* 9위 */}
              <a
                href="https://tool.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer"
              >
                <div className="relative w-[80px] md:w-[120px] h-[107px] md:h-[160px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/ssobig_assets/gameorb/binary.png"
                    alt="바이너리"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                  />
                  <div className="absolute bottom-1 left-1">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      9
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-1 truncate group-hover:text-black">
                    바이너리
                  </h3>
                  <div className="text-[13px] md:text-[14px]">
                    <p className="text-gray-600 truncate">논리 게임</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="flex items-center gap-[3px]">
                        <Image
                          src="/ssobig_assets/playroom/icon-token.svg"
                          alt="토큰"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        <span>2</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span>2~6인</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 연인을 위한 템플릿 */}
      <ContentRow
        title="💕 연인과 함께"
        items={[
          {
            image: "/ssobig_assets/lovebuddies/thumb-main.png",
            title: "러브 밸런스",
            description: "연인 취향 테스트",
            players: "2인",
            price: "무료",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/lovebuddies/detail-dailynammae-01.jpg",
            title: "데이트 룰렛",
            description: "데이트 장소 추천",
            players: "2인",
            price: "1토큰",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/lovebuddies/alpha/gallery-01.jpg",
            title: "커플 퀴즈",
            description: "서로를 알아가는 시간",
            players: "2인",
            price: "무료",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/lovebuddies/detail-overview-01.jpg",
            title: "기념일 게임",
            description: "특별한 날을 위한",
            players: "2인",
            price: "1토큰",
            link: "https://tool.ssobig.com",
          },
        ]}
      />

      {/* 친구들과 함께 */}
      <ContentRow
        title="👥 친구들과 함께"
        items={[
          {
            image: "/ssobig_assets/gameorb/community-chat.png",
            title: "아이스브레이킹",
            description: "첫 만남을 위한",
            players: "3~20인",
            price: "무료",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/gameorb/insomnia-mafia.png",
            title: "불면증 마피아",
            description: "밤샘 파티 게임",
            players: "6~12인",
            price: "무료",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/playroom/game-meetup.png",
            title: "파티 게임 팩",
            description: "다양한 미니게임",
            players: "4~12인",
            price: "2토큰",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/gameorb/campus-life.png",
            title: "캠퍼스 라이프",
            description: "대학생 특화",
            players: "4~20인",
            price: "1토큰",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/playroom/no-alcohol.png",
            title: "술 없이도",
            description: "건전한 놀이문화",
            players: "4~20인",
            price: "무료",
            link: "https://tool.ssobig.com",
          },
        ]}
      />

      {/* 동아리/모임 */}
      <ContentRow
        title="🎯 동아리·모임"
        items={[
          {
            image: "/ssobig_assets/gameorb/devils-plan-hoodie.png",
            title: "팀 빌딩 게임",
            description: "협력과 경쟁",
            players: "6~20인",
            price: "3토큰",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/gameorb/seolryeongjeon-poster.png",
            title: "설령전",
            description: "MT 필수 게임",
            players: "20~100인",
            price: "5토큰",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/playroom/union-event.png",
            title: "연합어때",
            description: "동아리 연합 행사",
            players: "30~100인",
            price: "5토큰",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/playroom/career-class.png",
            title: "워크숍 패키지",
            description: "교육·워크숍용",
            players: "10~30인",
            price: "3토큰",
            link: "https://tool.ssobig.com",
          },
        ]}
      />

      {/* 대규모 행사 */}
      <ContentRow
        title="🎪 대규모 행사"
        items={[
          {
            image: "/ssobig_assets/lovebuddies/alpha/poster.jpg",
            title: "축제 부스",
            description: "대학 축제 특화",
            players: "50~200인",
            price: "문의",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/gameorb/sugar-village-poster.png",
            title: "슈가빌리지",
            description: "100명 이상 행사",
            players: "100~500인",
            price: "문의",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/playroom/now-seoul.png",
            title: "나우서울",
            description: "지역 축제",
            players: "100~500인",
            price: "문의",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/gameorb/thumb-main.png",
            title: "게임오브",
            description: "게임 예능 현실판",
            players: "30~100인",
            price: "문의",
            link: "https://tool.ssobig.com",
          },
        ]}
      />

      {/* 새로운 템플릿 */}
      <ContentRow
        title="🆕 새로운 템플릿"
        items={[
          {
            image: "/ssobig_assets/gameorb/wizard-frog.png",
            title: "위저드 프로그",
            description: "NEW 심리 게임",
            players: "3~6인",
            price: "2토큰",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/gameorb/evil-phobe.png",
            title: "사악한 포브",
            description: "NEW 배신 게임",
            players: "3~6인",
            price: "1토큰",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/gameorb/counseling-phobe.png",
            title: "상담 포브",
            description: "NEW 소통 게임",
            players: "3~6인",
            price: "1토큰",
            link: "https://tool.ssobig.com",
          },
          {
            image: "/ssobig_assets/gameorb/binary.png",
            title: "바이너리",
            description: "NEW 논리 게임",
            players: "2~6인",
            price: "2토큰",
            link: "https://tool.ssobig.com",
          },
        ]}
      />

      {/* 앱 다운로드 배너 */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl py-12 md:py-16 px-6">
            <div className="text-center text-white">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                지금 바로 시작해보세요
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-8">
                템플릿을 선택하고 5분 안에 첫 모임을 시작하세요
              </p>
              <div className="flex flex-row items-center justify-center gap-3 md:gap-4">
                {/* Google Play 다운로드 */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.ssobig.ssobigtool&hl=ko"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-6 md:px-8 py-3 rounded-xl transition-colors"
                >
                  Google Play
                </a>

                {/* App Store 다운로드 */}
                <a
                  href="https://apps.apple.com/kr/app/ssobig-tool/id6745536878"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 md:px-8 py-3 rounded-xl transition-colors border border-white/30"
                >
                  App Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="text-gray-500 text-xs leading-relaxed">
            {/* 상단: 회사명 + SNS 버튼들 */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-700 text-base">
                주식회사 쏘빅
              </p>
              <div className="flex items-center gap-2">
                {/* 인스타그램 */}
                <a
                  href="https://www.instagram.com/ssobig_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                  aria-label="인스타그램"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                  aria-label="유튜브"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* 사업자 정보 토글 */}
            <button
              onClick={() => setIsFooterOpen(!isFooterOpen)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
            >
              <span className="text-xs font-medium">사업자 정보</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
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

            {/* 펼쳐지는 상세 정보 */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isFooterOpen ? "max-h-[300px] mb-4" : "max-h-0"
              }`}
            >
              <div className="pt-2 pb-3">
                <p className="mb-1">대표자 : 안민우, 조원철</p>
                <p className="mb-1">사업자등록번호 : 140-87-03096</p>
                <p className="mb-1">전화번호 : 02-2635-7942</p>
                <p className="mb-1">E-mail : ssobigstudio@gmail.com</p>
                <p className="mb-1">
                  통신판매업신고번호 : 제2024-서울영등포-0816호
                </p>
                <p>
                  주소 : 서울특별시 서초구 사평대로55길 37,
                  (실란트로타워)지하2층 (반포동)
                </p>
              </div>
            </div>

            {/* 약관 링크 - 항상 표시 */}
            <p className="text-gray-400 pt-3">
              <Link
                href="https://about.ssobig.com/privacy_policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600 underline"
              >
                개인정보 처리방침
              </Link>
              <span className="mx-2">|</span>
              <Link
                href="https://about.ssobig.com/terms_of_service"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600 underline"
              >
                이용약관
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
