"use client";

import Image from "next/image";
import Script from "next/script";
import Head from "next/head";
import LinkWithUtm from "../../../../components/LinkWithUtm";
import { useState, useEffect } from "react";

interface ScheduleItem {
  date: string;
  title: string;
  applicants: {
    total: number;
    female: number;
    male: number;
  };
  maxCapacity: number;
}

export default function LoveBuddiesDetailPage() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(() => {
    const now = new Date();
    return `UPDATE : ${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  // Google Sheets에서 데이터 가져오기
  useEffect(() => {
    const fetchSheetData = async () => {
      console.log("🔄 러브버디즈 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1onzeBFDNKuJwWwgZG1fvdi_Ch-mTBTwvGsv2NO5Fac8";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1294659426`;
        console.log("📡 요청 URL:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        console.log("📄 CSV 데이터:", csvText.substring(0, 500));
        const rows = csvText.split("\n").slice(1); // 헤더 제외
        console.log("📊 총 행 수:", rows.length);
        const updatedSchedule: ScheduleItem[] = [];

        rows.forEach((row, index) => {
          if (row.trim()) {
            const cols = row.split(",");
            const status = cols[0]?.replace(/"/g, "").trim(); // A열: 상태
            const title = cols[1]?.replace(/"/g, "").trim(); // B열: 이벤트 제목
            const cColumnValue = cols[2]?.replace(/"/g, "").trim(); // C열: 노출 체크박스
            const isChecked = cColumnValue === "TRUE";
            const maxCapacity = parseInt(cols[3]) || 40; // D열: 최대인원
            const total = parseInt(cols[4]) || 0; // E열: 합계
            const female = parseInt(cols[5]) || 0; // F열: 여자
            const male = parseInt(cols[6]) || 0; // G열: 남자

            console.log(
              `📋 행 ${
                index + 1
              } - 상태: "${status}", 제목: "${title}", C열 원시값: "${cColumnValue}", 체크상태: ${isChecked}, 최대인원: ${maxCapacity}, 합계: ${total}, 여자: ${female}, 남자: ${male}`
            );

            // C열이 정확히 TRUE이고 제목이 유효한 경우에만 표시
            if (
              isChecked &&
              title &&
              title.includes("일일남매") &&
              title.length > 0
            ) {
              console.log(`✅ 표시 대상으로 추가: ${title}`);

              // 날짜 추출 (괄호 안의 날짜)
              const dateMatch = title.match(/(\d+\/\d+\s*\([^)]+\))/);
              const dateStr = dateMatch ? dateMatch[1] : "";

              // 시간 추출
              const timeMatch = title.match(/\d+:\d+/);
              const timeStr = timeMatch ? timeMatch[0] : "";

              // 게임명 추출 (날짜와 시간 부분 제거)
              const gameTitle = title
                .replace(/\d+\/\d+\s*\([^)]+\)\s*\d+:\d+\s*/, "")
                .trim();

              // 시간을 포함한 제목 생성
              const cleanTitle = timeStr
                ? `${timeStr} ${gameTitle}`
                : gameTitle;

              updatedSchedule.push({
                date: dateStr,
                title: cleanTitle,
                applicants: {
                  total,
                  female,
                  male,
                },
                maxCapacity,
              });
            } else {
              console.log(
                `❌ 제외된 항목: 상태="${status}", 제목="${title}", 체크상태=${isChecked}, C열값="${cColumnValue}"`
              );
            }
          }
        });

        console.log(`📝 파싱 완료 - 총 ${updatedSchedule.length}개 일정 발견`);
        console.log("✨ 업데이트된 스케줄 데이터:", updatedSchedule);

        console.log("🔄 React state 업데이트 중...");
        setScheduleData(updatedSchedule);
        setIsLoading(false);
        console.log("✅ 데이터 업데이트 완료!");

        if (updatedSchedule.length === 0) {
          console.log(
            "⚠️ 표시할 데이터가 없습니다. C열 체크박스가 체크된 항목이 있는지 확인하세요."
          );
        }

        // 업데이트 시간 설정
        const now = new Date();
        const updateTimeString = `UPDATE : ${now.getFullYear()}.${String(
          now.getMonth() + 1
        ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setLastUpdateTime(updateTimeString);
      } catch (error) {
        console.error("❌ Google Sheets 데이터 가져오기 실패:", error);
        console.error("🔍 에러 상세:", {
          message: error instanceof Error ? error.message : "알 수 없는 오류",
          timestamp: new Date().toISOString(),
        });
        setIsLoading(false); // 에러가 발생해도 로딩 상태 해제
      }
    };

    fetchSheetData();
  }, []);

  // 참가자 차트 컴포넌트
  const ApplicantChart = ({
    applicants,
    maxCapacity,
  }: {
    applicants: { total: number; female: number; male: number };
    maxCapacity: number;
  }) => {
    const femalePercentage =
      maxCapacity > 0 ? (applicants.female / maxCapacity) * 100 : 0;
    const malePercentage =
      maxCapacity > 0 ? (applicants.male / maxCapacity) * 100 : 0;
    const emptyPercentage = Math.max(
      0,
      100 - femalePercentage - malePercentage
    );

    return (
      <div className="p-1 bg-black/30 rounded-lg">
        {/* 누적 바 차트 */}
        <div className="flex h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="transition-all duration-700 ease-out bg-[#FF69B4]"
            style={{ width: `${femalePercentage}%` }}
          />
          <div
            className="transition-all duration-700 ease-out bg-[#4A90E2]"
            style={{ width: `${malePercentage}%` }}
          />
          <div
            className="bg-white/5"
            style={{ width: `${emptyPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>러브버디즈 상세 - Love Buddies</title>
        <meta name="description" content="러브버디즈 상세 정보 페이지입니다" />
      </Head>
      {/* Meta Pixel Code */}
      <Script id="facebook-pixel-detail" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2385974028469308');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2385974028469308&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-pink-500 selection:text-white">
        {/* 배경 이미지 - 스크롤에도 고정됨 */}
        <div className="fixed inset-0 -z-10 bg-black">
          <Image
            src="/ssobig_assets/러브버디즈 배경.jpg"
            alt="러브버디즈 배경"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.6,
            }}
            priority
            sizes="100vw"
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
          {/* 상단 공통 디자인 */}
          <div className="w-full h-auto">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/상세 상단 공통 디자인_일일남매.png"
                alt="일일남매 상단 디자인"
                width={620}
                height={0}
                style={{ width: "100%", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>

          {/* 러브버디즈 스케줄 박스 */}
          <div className="w-full">
            <div className="bg-black p-4 shadow-lg">
              <h2 className="text-xl font-bold text-center text-white mb-3">
                💕 러브버디즈 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="bg-black/70 rounded-lg p-3 mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
                  <p className="text-white font-bold text-base mb-1 sm:mb-0">
                    가격: <span className="text-white">35,000원</span>
                    <span className="text-[#FF6B9F]">(특가)</span>
                  </p>
                  <p className="text-white font-bold text-base">
                    평일/주말 다양한 시간대{" "}
                    <span className="text-white">(3시간)</span>
                  </p>
                </div>

                {/* 범례 */}
                <div className="flex flex-wrap gap-2 justify-end mt-3">
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-white/20 bg-[#FF69B4]/20">
                    <div className="w-2 h-2 rounded-full bg-[#FF69B4]" />
                    <span className="text-white/90">여자</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-white/20 bg-[#4A90E2]/20">
                    <div className="w-2 h-2 rounded-full bg-[#4A90E2]" />
                    <span className="text-white/90">남자</span>
                  </div>
                </div>
              </div>

              {/* 일정 목록 */}
              <div className="space-y-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      📅 스케줄 정보를 불러오는 중...
                    </div>
                  </div>
                ) : scheduleData.length === 0 ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      📅 현재 예정된 스케줄이 없습니다
                    </div>
                  </div>
                ) : (
                  scheduleData.map((schedule, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-black/50 hover:bg-black/80 transition-colors"
                    >
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-[#F4F4F4] min-w-[70px] text-sm">
                            {schedule.date}
                          </span>
                          <span className="text-white font-bold flex-grow text-sm">
                            {schedule.title}
                          </span>
                        </div>
                        <span className="text-[#FF6B9F] font-bold text-xs">
                          {schedule.applicants.total}/{schedule.maxCapacity}명
                        </span>
                      </div>
                      <div className="px-3 pb-2">
                        <ApplicantChart
                          applicants={schedule.applicants}
                          maxCapacity={schedule.maxCapacity}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 업데이트 시간 표시 */}
              {lastUpdateTime && (
                <div className="text-right mt-2 pr-2">
                  <span className="text-white/60 text-xs">
                    {lastUpdateTime}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 상세 이미지 1 */}
          <div className="w-full h-auto">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/일일남매 상세1.jpg"
                alt="일일남매 상세 1"
                width={620}
                height={1200}
                style={{ width: "620px", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>

          {/* 상세 이미지 2 */}
          <div className="w-full h-auto">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/일일남매 상세 2.png"
                alt="일일남매 상세 2"
                width={620}
                height={1200}
                style={{ width: "620px", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://form.ssobig.com/lovebuddies"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#FF6B9F] hover:bg-[#e45a8b] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
              brandPage="love_buddies"
              buttonType="detail_main_cta"
              destination="smore_form"
            >
              러브버디즈 참여하기 🙋🏻‍♀
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </LinkWithUtm>
          </div>
        </div>
      </div>
    </>
  );
}
