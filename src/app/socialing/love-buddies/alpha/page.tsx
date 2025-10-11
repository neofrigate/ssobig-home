"use client";

import Image from "next/image";
import Script from "next/script";
import Head from "next/head";
import { useEffect, useState } from "react";
import LinkWithUtm from "../../../../components/LinkWithUtm";

interface ManittoScheduleItem {
  date: string;
  title: string;
  applicants: {
    total: number;
    female: number;
    male: number;
  };
  maxCapacity: number;
}

export default function LoveBuddiesAlphaPage() {
  const [scheduleData, setScheduleData] = useState<ManittoScheduleItem[]>([]);
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
      console.log("🔄 온라인 마니또 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1onzeBFDNKuJwWwgZG1fvdi_Ch-mTBTwvGsv2NO5Fac8";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1677579393`;
        console.log("📡 요청 URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "text/csv",
          },
        });

        console.log("📡 응답 상태:", response.status, response.statusText);
        console.log(
          "📡 응답 헤더:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ 응답 에러 내용:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${response.statusText}`
          );
        }

        const csvText = await response.text();
        console.log("📄 CSV 데이터:", csvText.substring(0, 500));
        const rows = csvText.split("\n").slice(1); // 헤더 제외
        console.log("📊 총 행 수:", rows.length);
        const updatedSchedule: ManittoScheduleItem[] = [];

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

            // C열이 정확히 TRUE이고 제목에 "마니또"가 포함된 경우에만 표시
            if (
              isChecked &&
              title &&
              title.includes("마니또") &&
              title.length > 0
            ) {
              console.log(`✅ 표시 대상으로 추가: ${title}`);

              // 온라인 마니또 날짜 추출 (예: "8/11~8/15 온라인 마니또")
              const dateMatch = title.match(/(\d+\/\d+~\d+\/\d+)/);
              const dateStr = dateMatch ? dateMatch[1] : "";

              // 마니또 제목 추출 (전체 제목 사용)
              const cleanTitle = title;

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

        console.log("✅ 파싱된 스케줄 데이터:", updatedSchedule);
        setScheduleData(updatedSchedule);

        // 업데이트 시간 설정
        const now = new Date();
        setLastUpdateTime(
          `UPDATE : ${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
            2,
            "0"
          )}.${String(now.getDate()).padStart(2, "0")} ${String(
            now.getHours()
          ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
        );
      } catch (error) {
        console.error("❌ 온라인 마니또 데이터 가져오기 실패:", error);
        console.error("❌ 에러 상세:", {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : "Unknown",
          stack: error instanceof Error ? error.stack : undefined,
        });

        // 네트워크 에러인지 확인
        if (
          error instanceof TypeError &&
          error.message.includes("Failed to fetch")
        ) {
          console.error(
            "🌐 네트워크 에러 감지: CORS 또는 네트워크 연결 문제일 수 있습니다"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheetData();
    // 5분마다 데이터 새로고침
    const interval = setInterval(fetchSheetData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 참가자 차트 컴포넌트
  const ApplicantChart = ({
    applicants,
    maxCapacity,
    isInProgress = false,
  }: {
    applicants: { total: number; female: number; male: number };
    maxCapacity: number;
    isInProgress?: boolean;
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
            className={`transition-all duration-700 ease-out ${
              isInProgress ? "bg-[#FF69B4]/30" : "bg-[#FF69B4]"
            }`}
            style={{ width: `${femalePercentage}%` }}
          />
          <div
            className={`transition-all duration-700 ease-out ${
              isInProgress ? "bg-[#4A90E2]/30" : "bg-[#4A90E2]"
            }`}
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
        <title>러브버디즈 알파 - Love Buddies</title>
        <meta name="description" content="러브버디즈 알파 정보 페이지입니다" />
      </Head>
      {/* Meta Pixel Code */}
      <Script id="facebook-pixel-alpha" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1541266446734040');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1541266446734040&ev=PageView&noscript=1"
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
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 pb-[88px]">
          {/* 알파남매 표지 */}
          <div className="w-full h-auto">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/알파남매 포스터.jpg"
                alt="알파남매 포스터"
                width={620}
                height={0}
                style={{ width: "100%", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>

          {/* 온라인 마니또 스케줄 박스 */}
          <div className="w-full">
            <div className="bg-black p-4 shadow-lg">
              <h2 className="text-xl font-bold text-center text-white mb-3">
                💌 온라인 마니또 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="bg-black/70 rounded-lg p-3 mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
                  <p className="text-white font-bold text-base mb-1 sm:mb-0">
                    가격: <span className="text-white">30,000원</span>
                    <span className="text-[#FF6B9F]">(온라인)</span>
                  </p>
                  <p className="text-white font-bold text-base">
                    온라인 <span className="text-white">(5일간)</span>
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
                  scheduleData.map((schedule, index) => {
                    // 시작 날짜 추출 및 진행 중 여부 확인
                    const getManittoStatus = (title: string) => {
                      // "9/15~9/19 온라인 마니또" 형태에서 시작 날짜(9/15) 추출
                      const dateMatch = title.match(/^(\d{1,2})\/(\d{1,2})~/);
                      if (dateMatch) {
                        const startMonth = parseInt(dateMatch[1]);
                        const startDay = parseInt(dateMatch[2]);
                        const currentDate = new Date();
                        const currentYear = currentDate.getFullYear();

                        // 시작 날짜 객체 생성
                        const startDate = new Date(
                          currentYear,
                          startMonth - 1,
                          startDay
                        );

                        // 현재 날짜와 비교 (시작 날짜가 지났으면 진행중)
                        return currentDate >= startDate;
                      }
                      return false;
                    };

                    const isInProgress = getManittoStatus(schedule.title);

                    return (
                      <div
                        key={index}
                        className="rounded-lg bg-black/50 hover:bg-black/80 transition-colors"
                      >
                        <div className="flex items-center justify-between px-3 py-2">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`font-bold flex-grow text-sm ${
                                isInProgress ? "text-white/30" : "text-white"
                              }`}
                            >
                              {schedule.title}
                            </span>
                          </div>
                          <span
                            className={`font-bold text-xs ${
                              isInProgress ? "text-[#FF6B9F]" : "text-[#FF6B9F]"
                            }`}
                          >
                            {isInProgress
                              ? "마니또 진행중"
                              : `${schedule.applicants.total}/${schedule.maxCapacity}명`}
                          </span>
                        </div>
                        <div className="px-3 pb-2">
                          <ApplicantChart
                            applicants={schedule.applicants}
                            maxCapacity={schedule.maxCapacity}
                            isInProgress={isInProgress}
                          />
                        </div>
                      </div>
                    );
                  })
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
                src="/ssobig_assets/알파남매 1.jpg"
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
                src="/ssobig_assets/알파남매 2.jpg"
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
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-black/80 to-transparent pt-6">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://smore.im/form/Mo8BwTVq8o"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#FF6B9F] hover:bg-[#e45a8b] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
              brandPage="love_buddies"
              buttonType="alpha_main_cta"
              destination="smore_form"
            >
              온라인마니또 신청하기
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
