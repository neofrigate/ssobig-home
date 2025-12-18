"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";

interface OfflineCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  sizes: string;
  isMobile?: boolean;
  schedule?: string;
  href: string;
}

function OfflineCard({
  title,
  description,
  imageSrc,
  imageAlt,
  sizes,
  isMobile = false,
  schedule,
  href,
}: OfflineCardProps) {
  if (isMobile) {
    return (
      <Link
        href={href}
        className="flex flex-col items-center flex-shrink-0 w-[32%] sm:w-[40%] group"
      >
        <div className="relative w-full aspect-[3/4] mb-4 rounded-lg overflow-hidden transition-opacity group-hover:opacity-90">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: "cover" }}
            sizes={sizes}
            className="rounded-lg"
          />
        </div>
        {schedule && (
          <div className="mb-2 w-full text-left">
            <span className="inline-block px-2 sm:px-3 py-1 bg-white/20 text-white/90 rounded-full text-[10px] sm:text-xs font-medium">
              {schedule}
            </span>
          </div>
        )}
        <h2 className="text-white text-base sm:text-lg font-bold mb-2 w-full text-left group-hover:underline">
          {title}
        </h2>
        <p className="text-white/80 text-xs sm:text-sm text-left w-full whitespace-pre-wrap mb-2">
          {description}
        </p>
        <div className="text-right w-full">
          <span className="text-[10px] sm:text-xs text-white/60">
            자세히 보기 →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="flex flex-col items-center group">
      <div className="relative w-full aspect-[3/4] mb-4 rounded-lg overflow-hidden transition-opacity group-hover:opacity-90">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          style={{ objectFit: "cover" }}
          sizes={sizes}
          className="rounded-lg"
        />
      </div>
      {schedule && (
        <div className="mb-2 w-full text-left">
          <span className="inline-block px-2 sm:px-3 py-1 bg-white/20 text-white/90 rounded-full text-[10px] sm:text-xs md:text-xs lg:text-sm font-medium">
            {schedule}
          </span>
        </div>
      )}
      <h2 className="text-white text-base md:text-lg lg:text-xl font-bold mb-2 w-full text-left group-hover:underline">
        {title}
      </h2>
      <p className="text-white/80 text-xs md:text-sm lg:text-base text-left w-full whitespace-pre-wrap mb-2">
        {description}
      </p>
      <div className="text-right w-full">
        <span className="text-[10px] sm:text-xs text-white/60">
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}

export default function OfflinePage() {
  const [totalParticipants, setTotalParticipants] = useState<number | null>(
    null
  );

  // Google Sheets에서 총 신청자 수 가져오기
  useEffect(() => {
    const fetchTotalParticipants = async () => {
      try {
        const SHEET_ID = "1onzeBFDNKuJwWwgZG1fvdi_Ch-mTBTwvGsv2NO5Fac8";
        const GID = "1757320005";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const rows = csvText.split("\n");

        // A2 셀은 두 번째 행(인덱스 1)의 첫 번째 열
        if (rows.length > 1) {
          const secondRow = rows[1].split(",");
          const a2Value = secondRow[0]?.trim();

          if (a2Value && !isNaN(Number(a2Value))) {
            setTotalParticipants(Number(a2Value));
          }
        }
      } catch (error) {
        console.error("총 신청자 수를 가져오는 중 오류 발생:", error);
        // 에러 발생 시 기본값 유지
      }
    };

    fetchTotalParticipants();
  }, []);

  // 숫자 포맷팅 (천 단위 콤마)
  const formattedCount =
    totalParticipants !== null
      ? totalParticipants.toLocaleString("ko-KR")
      : "...";

  return (
    <div className="min-h-screen bg-black -mt-[88px] md:-mt-[60px]">
      {/* 히어로 섹션 */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-[120px] md:pt-[92px]">
        {/* 로고 */}
        <div className="mb-8 md:mb-10 flex flex-col items-center">
          <Image
            src="/ssobig_assets/offline/ssobig offline logo.png"
            alt="ssobig offline"
            width={200}
            height={200}
            className="h-auto w-[140px] sm:w-[180px] sm:h-[180px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px] max-w-[90vw] mb-6"
            unoptimized
          />

          {/* 인스타그램 아이콘 */}
          <a
            href="https://www.instagram.com/ssobig_offline/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            aria-label="인스타그램"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>

        {/* 브랜드 설명글 */}
        <div className="text-center space-y-2 animate-fade-in-up px-4 mb-16">
          {/* 모바일: 줄바꿈 포함 */}
          <h1 className="sm:hidden text-xl font-bold text-white break-keep">
            어디서도 경험하지 못한
            <br />
            특별한 콘텐츠로 가까워지는 곳
          </h1>
          {/* 작은 태블릿 + 데스크톱: 줄바꿈 없음 */}
          <h1 className="hidden sm:block text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white break-keep">
            어디서도 경험하지 못한 특별한 콘텐츠로 가까워지는 곳
          </h1>
          <p className="text-base md:text-lg text-gray-300 font-medium break-keep">
            지금까지{" "}
            <span className="animate-blink inline-block font-bold">
              {formattedCount}명
            </span>
            이 함께했어요
          </p>
        </div>

        {/* 카드 컨테이너 - 반응형 그리드 */}
        <div className="w-full max-w-[1200px] mx-auto px-5 md:px-8">
          {/* 모바일 + 작은 태블릿: 가로 스크롤 (< 768px) */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4 hide-scrollbar pb-20">
            <div className="flex gap-4 w-max">
              <OfflineCard
                title="일일남매"
                schedule="매주 금~일요일"
                description={`매력쟁이들 사이에 내 남매가?!\n'일일'남매와 혈육 케미 찐친 되기`}
                imageSrc="/ssobig_assets/socialing/poster_일일남매.png"
                imageAlt="일일남매 포스터"
                sizes="(max-width: 640px) 32vw, 40vw"
                isMobile={true}
                href="/offline/11namme"
              />
              <OfflineCard
                title="불면증마피아"
                schedule="매주 일요일"
                description={`빠니보틀도 한 대규모 마피아게임!\n피의 게임, 데블스플랜 좋아한다면?`}
                imageSrc="/ssobig_assets/socialing/poster_불면증마피아.png"
                imageAlt="불면증마피아 포스터"
                sizes="(max-width: 640px) 32vw, 40vw"
                isMobile={true}
                href="/offline/mafia"
              />
              <OfflineCard
                title="알파마니또"
                schedule="매달 둘째주"
                description={`일일남매 상위 TOP3만 참여 가능!\n내 마니또와 설레이는 첫만남!`}
                imageSrc="/ssobig_assets/socialing/poster_마니또.png"
                imageAlt="알파마니또 포스터"
                sizes="(max-width: 640px) 32vw, 40vw"
                isMobile={true}
                href="/offline/manito"
              />
            </div>
          </div>

          {/* 큰 태블릿 + 데스크톱: 3열 그리드 (>= 768px) */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 md:gap-12 pb-20 md:pb-32">
            <OfflineCard
              title="일일남매"
              schedule="매주 금~일요일"
              description={`매력쟁이들 사이에 내 남매가?!\n'일일'남매와 혈육 케미 찐친 되기`}
              imageSrc="/ssobig_assets/socialing/poster_일일남매.png"
              imageAlt="일일남매 포스터"
              sizes="33vw"
              href="/offline/11namme"
            />
            <OfflineCard
              title="불면증마피아"
              schedule="매주 일요일"
              description={`빠니보틀도 한 대규모 마피아게임!\n피의 게임, 데블스플랜 좋아한다면?`}
              imageSrc="/ssobig_assets/socialing/poster_불면증마피아.png"
              imageAlt="불면증마피아 포스터"
              sizes="33vw"
              href="/offline/social_genius"
            />
            <OfflineCard
              title="알파마니또"
              schedule="매달 둘째주"
              description={`일일남매 상위 TOP3만 참여 가능!\n내 마니또와 설레이는 첫만남!`}
              imageSrc="/ssobig_assets/socialing/poster_마니또.png"
              imageAlt="알파마니또 포스터"
              sizes="33vw"
              href="/offline/manito"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
