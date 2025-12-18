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
  cardSize?: "large" | "small";
}

function ContentCard({
  image,
  title,
  description,
  players,
  price,
  link,
  cardSize = "large",
}: ContentCardProps) {
  // 모바일/태블릿 너비 계산 (< md)
  // Large: 2.5개 (gap 16px 기준) -> 모바일: calc(40vw - 22px), 태블릿: calc(32vw - 14px)
  // Small: 3.2개 (gap 12px 기준) -> 모바일: calc(31.25vw - 18px), 태블릿: calc(24vw - 10px)
  const mobileClass = 
    cardSize === "large" 
      ? "w-[calc(40vw-22px)] sm:w-[calc(32vw-14px)]" 
      : "w-[calc(31.25vw-18px)] sm:w-[calc(24vw-10px)]";

  // 데스크톱 너비 계산 (>= md)
  // Large: 4개 (gap 20px/24px) -> MD: calc(25% - 15px), LG: calc(25% - 18px)
  // Small: 5개 (gap 18px/22px) -> MD: calc(20% - 14px), LG: calc(20% - 17px)
  const desktopClass = 
    cardSize === "large"
      ? "md:w-[calc(25%-15px)] lg:w-[calc(25%-18px)]"
      : "md:w-[calc(20%-14px)] lg:w-[calc(20%-17px)]";

  return (
    <>
      {/* 모바일 버전 - 오프라인 스타일 */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`md:hidden flex flex-col items-center flex-shrink-0 group ${mobileClass}`}
      >
        <div className="relative w-full aspect-[3/4] mb-4 rounded-lg overflow-hidden transition-opacity group-hover:opacity-90 bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 40vw, 30vw"
            className="rounded-lg"
          />
        </div>
        {price && players && (
          <div className="mb-2 w-full text-left flex flex-wrap gap-1">
            {players.split(", ").map((player, index) => (
              <span key={index} className="inline-block px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-[10px] sm:text-xs font-medium">
                {player}
              </span>
            ))}
            <span className="inline-block px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-[10px] sm:text-xs font-medium">
              {price === "무료" ? "무료" : price === "문의" ? "문의" : price === "펀딩 진행중" ? "펀딩 진행중" : price.replace("토큰", "") + "토큰"}
            </span>
          </div>
        )}
        <h3 className="text-gray-900 text-base sm:text-lg font-bold mb-1 w-full text-left group-hover:underline">
          {title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm text-left w-full whitespace-pre-wrap mb-2 line-clamp-2">
          {description}
        </p>
      </a>

      {/* 태블릿/데스크톱 버전 - 기존 스타일 */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`hidden md:block group flex-shrink-0 cursor-pointer ${desktopClass}`}
      >
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes={cardSize === "large" ? "(min-width: 1024px) 25vw, 33vw" : "(min-width: 1024px) 20vw, 25vw"}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        {price && players && (
          <div className="mb-2 flex flex-wrap gap-1">
            {players.split(", ").map((player, index) => (
              <span key={index} className="inline-block px-2 md:px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-[10px] md:text-xs font-medium">
                {player}
              </span>
            ))}
            <span className="inline-block px-2 md:px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-[10px] md:text-xs font-medium">
              {price === "무료" ? "무료" : price === "문의" ? "문의" : price === "펀딩 진행중" ? "펀딩 진행중" : price.replace("토큰", "") + "토큰"}
            </span>
          </div>
        )}
        <h3 className="text-gray-900 font-bold text-base md:text-lg lg:text-xl mb-1 truncate">
          {title}
        </h3>
        <div className="text-xs md:text-sm lg:text-base">
          <p className="text-gray-600 line-clamp-2 whitespace-pre-wrap">{description}</p>
        </div>
      </a>
    </>
  );
}

// 컨텐츠 로우 컴포넌트
interface ContentRowProps {
  title: string;
  description?: string;
  items: ContentCardProps[];
  cardSize?: "large" | "small";
  mobileGap?: number; // 모바일 gap (px)
}

function ContentRow({ title, description, items, cardSize = "large", mobileGap = 16 }: ContentRowProps) {
  return (
    <section className="py-6 md:py-8">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <h2 className="text-gray-900 text-[18px] sm:text-[22px] md:text-[26px] lg:text-[28px] font-bold mb-4 md:mb-6">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-4 md:mb-6">
            {description}
          </p>
        )}
        {/* 모바일: 가로 확장된 뷰 */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4 hide-scrollbar pb-4">
          <div className="flex w-max" style={{ gap: `${mobileGap}px` }}>
            {items.map((item, index) => (
              <ContentCard 
                key={index}
                image={item.image}
                title={item.title}
                description={item.description}
                players={item.players}
                price={item.price}
                link={item.link}
                cardSize={cardSize}
              />
            ))}
          </div>
        </div>
        {/* 태블릿/데스크톱: 기존 스타일 - 스크롤 가능 표시 */}
        <div className="hidden md:block overflow-x-auto -mx-5 md:-mx-8 px-5 md:px-8 pb-4 hide-scrollbar">
          <div className={`flex w-full ${cardSize === "small" ? "gap-[18px] lg:gap-[22px]" : "gap-5 lg:gap-6"}`}>
            {items.map((item, index) => (
              <ContentCard 
                key={index}
                image={item.image}
                title={item.title}
                description={item.description}
                players={item.players}
                price={item.price}
                link={item.link}
                cardSize={cardSize}
              />
            ))}
          </div>
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
  mobileImage?: string;
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
      title1: "당신의 선택으로 완성되는",
      title2: "커플 전용 미스터리 게임",
      subtitle: "텀블벅 165% 달성! 기억 속의 너 펀딩 진행중",
      bgImage: "/ssobig_assets/playroom/히어로_기억 속의 너_데스크톱.jpg",
      mobileImage: "/ssobig_assets/playroom/히어로_기억 속의 너_모바일.jpg",
      bgGradient: "from-blue-600 to-cyan-600",
      link: "https://tumblbug.com/ssobig001",
    },
    {
      title1: "우주선에 선장이 죽었다",
      title2: "똑같이 생긴 당신은 누구?",
      subtitle: "323% 달성! 4인용 머더 미스터리 도플갱어",
      bgImage: "/ssobig_assets/playroom/히어로_도플갱어_데스크톱.jpg",
      mobileImage: "/ssobig_assets/playroom/히어로_도플갱어_모바일.jpg",
      bgGradient: "from-indigo-600 to-purple-600",
      link: "https://tumblbug.com/ssobig002",
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
    }, 7000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* 배너 섹션 - 슬라이드 */}
      <section className="pt-4 md:pt-6 pb-8 md:pb-12">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <div
            className="relative h-[350px] sm:h-[375px] md:h-[400px] lg:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden"
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
                <div className="relative h-full">
                  {/* 배경 이미지 */}
                  <div className="absolute inset-0 z-0">
                    {/* 모바일 전용 이미지 */}
                    {banner.mobileImage && (
                      <Image
                        src={banner.mobileImage}
                        alt={banner.title1}
                        fill
                        className="object-cover sm:hidden"
                        priority={index === 0}
                        sizes="100vw"
                      />
                    )}
                    {/* 태블릿 이상 데스크톱 이미지 */}
                    <Image
                      src={banner.bgImage}
                      alt={banner.title1}
                      fill
                      className={`object-cover ${banner.mobileImage ? 'hidden sm:block' : ''}`}
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
                      <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-bold text-white leading-tight">
                        {banner.title1}
                      </h2>
                      <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-bold text-white mb-3 md:mb-4 leading-tight">
                        {banner.title2}
                      </h2>
                      <p className="text-[14px] sm:text-[15px] md:text-base lg:text-lg text-white/80">
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

      {/* 스토리 추리게임 */}
      <ContentRow
        title="스토리 추리게임"
        items={[
          {
            image: "/ssobig_assets/playroom/백설공주와 독사과.png",
            title: "백설공주와 독사과",
            description: "백설공주에게 독사과를 건넨자는?\n동화 다시 읽기",
            players: "2인, 60분",
            price: "무료",
            link: "https://tool.ssobig.com/templates/c2439b65",
          },
          {
            image: "/ssobig_assets/playroom/기억 속의 너.png",
            title: "기억 속의 너",
            description: "커플 전용 선택형 스토리 게임",
            players: "2인, 90분",
            price: "펀딩 진행중",
            link: "https://tumblbug.com/ssobig001",
          },
          {
            image: "/ssobig_assets/playroom/도플갱어.png",
            title: "도플갱어",
            description: "우주선에 선장이 죽었다.\n그런데 나와 똑같이 생긴 넌 누구야",
            players: "4인, 120분",
            price: "펀딩 진행중",
            link: "https://tumblbug.com/ssobig002",
          },
        ]}
      />

      {/* 친구들과 함께 즐기기 */}
      <ContentRow
        title="친구들과 함께 즐기기"
        cardSize="small"
        mobileGap={12}
        items={[
          {
            image: "/ssobig_assets/playroom/퀴즈메이커.png",
            title: "퀴즈메이커",
            description: "나만의 퀴즈를 만들어\n친구들과 함께 즐기기",
            players: "2~100인",
            price: "무료",
            link: "https://tool.ssobig.com/templates/b2e1cf64",
          },
          {
            image: "/ssobig_assets/playroom/나몰라퀴즈.jpg",
            title: "나몰라퀴즈",
            description: "서로에 대해 얼마나\n알고 있는지 확인하기",
            players: "2~20인",
            price: "무료",
            link: "https://tool.ssobig.com/templates/3f97c82b",
          },
          {
            image: "/ssobig_assets/playroom/사랑의 징검다리.jpg",
            title: "사랑의 징검다리",
            description: "커플을 위한\n관계 테스트 게임",
            players: "2인",
            price: "무료",
            link: "https://tool.ssobig.com/templates/3df2320f",
          },
          {
            image: "/ssobig_assets/playroom/우정의 징검다리.jpg",
            title: "우정의 징검다리",
            description: "친구들과의 우정을\n테스트하는 게임",
            players: "2~10인",
            price: "무료",
            link: "https://tool.ssobig.com/templates/93fa153c",
          },
        ]}
      />

      {/* 쏘빅툴 체험해보기 */}
      <ContentRow
        title="쏘빅툴 체험해보기"
        cardSize="small"
        mobileGap={12}
        items={[
          {
            image: "/ssobig_assets/playroom/생산성_자리배치.png",
            title: "자리배치",
            description: "공정하고 효율적인\n팀 나누기 도구",
            players: "2~100인",
            price: "무료",
            link: "https://tool.ssobig.com/templates/af3a987f",
          },
          {
            image: "/ssobig_assets/playroom/생산성_투표-1.png",
            title: "즉석 투표하기",
            description: "빠르고 간편한\n실시간 투표 도구",
            players: "무제한",
            price: "무료",
            link: "https://tool.ssobig.com/templates/248df6bf",
          },
          {
            image: "/ssobig_assets/playroom/생산성_투표.png",
            title: "가중치 투표",
            description: "중요도를 반영한\n스마트 투표 시스템",
            players: "무제한",
            price: "무료",
            link: "https://tool.ssobig.com/templates/d2e0b7ac",
          },
        ]}
      />

      {/* 푸터 */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
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
