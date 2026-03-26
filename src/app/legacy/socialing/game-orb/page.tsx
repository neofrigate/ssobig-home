"use client";

import React, { useState, useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

interface GameSchedule {
  [gameName: string]: { date: string; time: string }[];
}

export default function GameOrbPage() {
  const [gameSchedules, setGameSchedules] = useState<GameSchedule>({
    불면증마피아: [],
    캠퍼스라이프: [],
    이중스파이: [],
  });

  // Google Sheets에서 데이터 가져오기
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "page.lifecycle",
      message: "game-orb mounted",
      level: "info",
      data:
        typeof window === "undefined"
          ? undefined
          : { pathname: window.location.pathname },
    });

    const fetchSheetData = async () => {
      try {
        Sentry.addBreadcrumb({
          category: "game-orb.schedule",
          message: "schedule fetch started",
          level: "info",
        });

        const SHEET_ID = "1onzeBFDNKuJwWwgZG1fvdi_Ch-mTBTwvGsv2NO5Fac8";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1562356640`;

        const response = await fetch(url);
        if (!response.ok) return;

        const csvText = await response.text();
        const rows = csvText.split("\n").slice(1);

        const schedules: GameSchedule = {
          불면증마피아: [],
          캠퍼스라이프: [],
          이중스파이: [],
        };

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const title = cols[1]?.replace(/"/g, "").trim();
            const isChecked = cols[2]?.replace(/"/g, "").trim() === "TRUE";

            if (
              isChecked &&
              title &&
              title !== "선택 항목" &&
              title.length > 0
            ) {
              console.log("Processing title:", title);

              const dateMatch = title.match(/(\d+\/\d+\s*\([^)]+\))/);
              const dateStr = dateMatch ? dateMatch[1] : "";

              const timeMatch = title.match(/(\d+:\d+)/);
              const timeStr = timeMatch ? timeMatch[1] : "";

              if (dateStr) {
                const scheduleItem = { date: dateStr, time: timeStr };

                if (title.includes("불면증") || title.includes("마피아")) {
                  console.log("Added to 불면증마피아:", scheduleItem);
                  schedules.불면증마피아.push(scheduleItem);
                } else if (
                  title.includes("캠퍼스") ||
                  title.includes("라이프")
                ) {
                  console.log("Added to 캠퍼스라이프:", scheduleItem);
                  schedules.캠퍼스라이프.push(scheduleItem);
                } else if (title.includes("이중") || title.includes("스파이")) {
                  console.log("Added to 이중스파이:", scheduleItem);
                  schedules.이중스파이.push(scheduleItem);
                }
              }
            }
          }
        });

        console.log("Final schedules:", schedules);

        Sentry.addBreadcrumb({
          category: "game-orb.schedule",
          message: "schedule fetch succeeded",
          level: "info",
          data: {
            insomniaMafiaCount: schedules.불면증마피아.length,
            campusLifeCount: schedules.캠퍼스라이프.length,
            doubleSpyCount: schedules.이중스파이.length,
          },
        });

        setGameSchedules(schedules);
      } catch (error) {
        Sentry.addBreadcrumb({
          category: "game-orb.schedule",
          message: "schedule fetch failed",
          level: "error",
          data: {
            errorMessage:
              error instanceof Error ? error.message : "unknown error",
          },
        });
        console.error("Failed to fetch schedule data:", error);
      }
    };

    fetchSheetData();
  }, []);

  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '681386597924392');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* End Meta Pixel Code */}

      <div className="text-white font-sans relative flex flex-col items-center justify-start pb-[100px] px-0 selection:bg-purple-500 selection:text-white pt-[88px] md:pt-[60px]">
        {/* 배경 이미지 next/image 적용 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/gameorb/hero-main.jpg"
            alt="게임오브 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
          {/* 배경 이미지 위에 그라데이션 오버레이 적용 */}
          <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black/85"></div>
        </div>

        {/* 이미지 및 컨텐츠 영역 */}
        <div className="w-full md:max-w-[720px] mx-auto z-10 relative text-center px-5 pt-5 flex flex-col items-center gap-[30px]">
          {/* 로고 이미지 */}
          <div className="w-full max-w-[400px] h-[96px] sm:h-[150px] relative flex justify-center items-center mx-auto">
            <Image
              src="/ssobig_assets/gameorb/brand-logo.png"
              alt="게임오브 로고"
              fill
              style={{ objectFit: "contain" }}
              className="mx-auto"
              priority
              sizes="(max-width: 768px) 80vw, 400px"
            />
          </div>

          {/* 인스타그램 아이콘 */}
          <a
            href="https://www.instagram.com/game_orb/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-neutral-300 hover:text-white transition-colors group"
            aria-label="인스타그램으로 이동"
          >
            <div className="w-[24px] h-[24px]">
              <Image
                src="/ssobig_assets/home/icon-instagram-circle.png"
                alt="인스타그램 아이콘"
                width={24}
                height={24}
                className="w-full h-full filter brightness-0 invert"
              />
            </div>
          </a>

          {/* 텍스트 섹션 */}
          <div className="text-left w-full">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white mb-[12.26px]">
              Game Orb 게임오브
            </h2>
            <p className="text-[14px] sm:text-[16px] text-neutral-300 w-full leading-relaxed">
              TV 게임 예능 프로그램의 짜릿하고 지적인 게임들을 현실에서 더
              재밌게 구현해내는 곳!
              <br />
              &lt;더 지니어스&gt;, &lt;크라임씬&gt;, &lt;피의 게임&gt;,
              &lt;데블스 플랜&gt;을 보며 느꼈던 두근거림과 감동을 일상의 만남
              속에 불러와, 참가자들이 주인공이 되어보는 장을 만들고자 합니다.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="z-10 flex flex-col items-center md:max-w-[720px] w-full px-5 pb-0 mt-[30px]">
          {/* 소셜지니어스 섹션 */}
          <Link
            href="/socialing/game-orb/social_genius"
            className="group flex flex-row gap-3 sm:gap-4 w-full items-center mb-6 sm:mb-8"
          >
            {/* 포스터 */}
            <div className="relative w-[120px] sm:w-[190px] md:w-[228px] aspect-[3/4] rounded-lg overflow-hidden shadow-lg transition-transform group-hover:scale-105 group-hover:shadow-2xl flex-shrink-0">
              <Image
                src="/ssobig_assets/socialing/poster_소셜지니어스.png"
                alt="소셜지니어스 포스터"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 120px, (max-width: 768px) 190px, 228px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            {/* 설명 */}
            <div className="flex-1 text-left">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-300 transition-colors">
                🎮 소셜지니어스
              </h3>
              <p className="text-xs sm:text-base text-neutral-300 leading-relaxed">
                흥미진진한 게임 예능에 지금 바로 참여하세요
              </p>
              <div className="mt-2 sm:mt-3 inline-flex items-center text-white/80 group-hover:text-white transition-colors">
                <span className="text-xs sm:text-base">자세히 보기 →</span>
              </div>
            </div>
          </Link>

          {/* 카카오톡 오픈채팅 섹션 */}
          <a
            href="https://open.kakao.com/o/g9LIA56f"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-row gap-3 sm:gap-4 w-full items-center mb-0"
          >
            {/* 포스터 */}
            <div className="relative w-[120px] sm:w-[190px] md:w-[228px] aspect-[3/4] rounded-lg overflow-hidden shadow-lg transition-transform group-hover:scale-105 group-hover:shadow-2xl flex-shrink-0">
              <Image
                src="/ssobig_assets/socialing/poster_오픈카톡방.png"
                alt="게임오브 카톡방 포스터"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 120px, (max-width: 768px) 190px, 228px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            {/* 설명 */}
            <div className="flex-1 text-left">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-300 transition-colors">
                💬 게임오브 비밀 카톡방
              </h3>
              <p className="text-xs sm:text-base text-neutral-300 leading-relaxed">
                게임 애호가들과 함께하는 비밀 카톡방에 참여하세요
              </p>
              <div className="mt-2 sm:mt-3 inline-flex items-center text-white/80 group-hover:text-white transition-colors">
                <span className="text-xs sm:text-base">참여하기 →</span>
              </div>
            </div>
          </a>

          {/* 모집중인 게임 라인업 섹션 */}
          <div className="w-full mt-16 sm:mt-20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 text-center w-full">
              모집중인 게임 라인업
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
              {/* 불면증마피아 */}
              <div className="flex flex-col">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg mb-2 sm:mb-3">
                  <Image
                    src="/ssobig_assets/socialing/poster_불면증마피아.png"
                    alt="불면증마피아"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 200px, 220px"
                  />
                </div>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-1">
                  불면증마피아
                </h4>
                {gameSchedules.불면증마피아.length > 0 ? (
                  gameSchedules.불면증마피아
                    .slice(0, 2)
                    .map((schedule, idx) => (
                      <p
                        key={idx}
                        className="text-xs sm:text-sm text-neutral-300"
                      >
                        - {schedule.date} {schedule.time}
                      </p>
                    ))
                ) : (
                  <p className="text-xs sm:text-sm text-neutral-300">
                    - 일정 준비중
                  </p>
                )}
              </div>
              {/* 캠퍼스라이프 */}
              <div className="flex flex-col">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg mb-2 sm:mb-3">
                  <Image
                    src="/ssobig_assets/socialing/poster_캠퍼스라이프.jpg"
                    alt="캠퍼스라이프"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 200px, 220px"
                  />
                </div>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-1">
                  캠퍼스라이프
                </h4>
                {gameSchedules.캠퍼스라이프.length > 0 ? (
                  gameSchedules.캠퍼스라이프
                    .slice(0, 2)
                    .map((schedule, idx) => (
                      <p
                        key={idx}
                        className="text-xs sm:text-sm text-neutral-300"
                      >
                        - {schedule.date} {schedule.time}
                      </p>
                    ))
                ) : (
                  <p className="text-xs sm:text-sm text-neutral-300">
                    - 일정 준비중
                  </p>
                )}
              </div>
              {/* 이중스파이 */}
              <div className="flex flex-col">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg mb-2 sm:mb-3">
                  <Image
                    src="/ssobig_assets/socialing/poster_이중스파이.png"
                    alt="이중스파이"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 200px, 220px"
                  />
                </div>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-1">
                  이중스파이
                </h4>
                {gameSchedules.이중스파이.length > 0 ? (
                  gameSchedules.이중스파이.slice(0, 2).map((schedule, idx) => (
                    <p
                      key={idx}
                      className="text-xs sm:text-sm text-neutral-300"
                    >
                      - {schedule.date} {schedule.time}
                    </p>
                  ))
                ) : (
                  <p className="text-xs sm:text-sm text-neutral-300">
                    - 일정 준비중
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
