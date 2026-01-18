"use client";

import Image from "next/image";
import Script from "next/script";
import { useState, useEffect } from "react";
import LinkWithUtm from "../../../components/LinkWithUtm";

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

// FAQ 아이템 컴포넌트
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-black/10 last:border-b-0">
      <button
        className="w-full py-4 text-left flex justify-between items-center transition-colors hover:bg-black/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base md:text-lg font-medium text-black pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-black transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
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
      {isOpen && (
        <div className="pb-4">
          <p
            className="text-sm md:text-base text-black/80 font-normal leading-relaxed"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  );
};

const ManitoPage = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("");

  // 초기 업데이트 시간 설정 (클라이언트에서만)
  useEffect(() => {
    const now = new Date();
    const updateTimeString = `UPDATE : ${now.getFullYear()}.${String(
      now.getMonth() + 1
    ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setLastUpdateTime(updateTimeString);
  }, []);

  // Google Sheets에서 데이터 가져오기
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const SHEET_ID = "1onzeBFDNKuJwWwgZG1fvdi_Ch-mTBTwvGsv2NO5Fac8";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1677579393`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const rows = csvText.split("\n").slice(1); // 헤더 제외
        const updatedSchedule: ScheduleItem[] = [];

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const title = cols[1]?.replace(/"/g, "").trim();
            const cColumnValue = cols[2]?.replace(/"/g, "").trim();
            const isChecked = cColumnValue === "TRUE";
            const maxCapacity = parseInt(cols[3]) || 40;
            const total = parseInt(cols[4]) || 0;
            const female = parseInt(cols[5]) || 0;
            const male = parseInt(cols[6]) || 0;

            if (
              isChecked &&
              title &&
              title.includes("마니또") &&
              title.length > 0
            ) {
              const dateMatch = title.match(/(\d+\/\d+~\d+\/\d+)/);
              const dateStr = dateMatch ? dateMatch[1] : "";

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
            }
          }
        });

        setScheduleData(updatedSchedule);
        setIsLoading(false);

        const now = new Date();
        const updateTimeString = `UPDATE : ${now.getFullYear()}.${String(
          now.getMonth() + 1
        ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setLastUpdateTime(updateTimeString);
      } catch (error) {
        console.error("❌ Google Sheets 데이터 가져오기 실패:", error);
        setIsLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  // 참가자 차트 컴포넌트 - 중앙 기준
  const ApplicantChart = ({
    applicants,
    maxCapacity,
    isCompleted = false,
  }: {
    applicants: { total: number; female: number; male: number };
    maxCapacity: number;
    isCompleted?: boolean;
  }) => {
    const halfCapacity = maxCapacity / 2;
    const femalePercentage =
      halfCapacity > 0 ? (applicants.female / halfCapacity) * 100 : 0;
    const malePercentage =
      halfCapacity > 0 ? (applicants.male / halfCapacity) * 100 : 0;
    const femaleEmpty = Math.max(0, 100 - femalePercentage);
    const maleEmpty = Math.max(0, 100 - malePercentage);

    return (
      <div className="flex h-2 md:h-3 bg-black/10 rounded-full overflow-hidden">
        {/* 왼쪽 절반 - 여자 */}
        <div className="flex w-1/2 flex-row-reverse">
          <div
            className={`transition-all duration-700 ease-out rounded-l-full ${
              isCompleted ? "bg-[#FF69B4]/30" : "bg-[#FF69B4]"
            }`}
            style={{ width: `${femalePercentage}%` }}
          />
          <div
            className="bg-transparent"
            style={{ width: `${femaleEmpty}%` }}
          />
        </div>
        {/* 오른쪽 절반 - 남자 */}
        <div className="flex w-1/2">
          <div
            className={`transition-all duration-700 ease-out rounded-r-full ${
              isCompleted ? "bg-[#4A90E2]/30" : "bg-[#4A90E2]"
            }`}
            style={{ width: `${malePercentage}%` }}
          />
          <div className="bg-transparent" style={{ width: `${maleEmpty}%` }} />
        </div>
      </div>
    );
  };

  // 스케줄 아이템 컴포넌트
  const ScheduleItem = ({ schedule }: { schedule: ScheduleItem }) => {
    const isCompleted = schedule.title.includes("전체마감");
    const textOpacity = isCompleted ? "opacity-30" : "";

    return (
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-4">
          <div className="flex items-center space-x-3 md:space-x-4 flex-grow">
            <span
              className={`font-medium md:font-semibold text-sm md:text-base text-black whitespace-nowrap ${textOpacity}`}
            >
              {schedule.date}
            </span>
            <span
              className={`font-bold text-sm md:text-base text-black ${textOpacity}`}
            >
              {schedule.title}
            </span>
          </div>
          <span
            className={`font-light text-xs md:text-sm text-black/70 ml-3 whitespace-nowrap ${textOpacity}`}
          >
            {schedule.applicants.total}/{schedule.maxCapacity}명
          </span>
        </div>
        <div className="px-3 md:px-4">
          <ApplicantChart
            applicants={schedule.applicants}
            maxCapacity={schedule.maxCapacity}
            isCompleted={isCompleted}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel-manito"
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
            fbq('init', '1541266446734040');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative">
        {/* 배경 이미지 next/image 적용 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/lovebuddies/hero-main.jpg"
            alt="알파 마니또 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
          {/* 배경 이미지 위에 블랙 오버레이 적용 (데스크톱에서만) */}
          <div className="fixed inset-0 bg-black/50 hidden md:block"></div>
          {/* 모바일 상단 GNB 영역 블랙 배경 */}
          <div className="fixed top-0 left-0 right-0 h-[88px] bg-black md:hidden z-0"></div>
        </div>

        {/* Content Area */}
        <main className="w-full md:max-w-[720px] flex flex-col items-center mx-auto pt-0 md:pt-6">
          {/* 상세 1 + 스케줄 + 상세 2 그룹 */}
          <div className="w-full md:rounded-3xl overflow-hidden md:shadow-lg">
            {/* Product Detail 1 */}
            <Image
              src="/ssobig_assets/lovebuddies/alpha/poster.jpg"
              alt="알파 마니또 상세 이미지 1"
              width={1920}
              height={1080}
              className="w-full h-auto block leading-[0]"
              priority
              style={{ display: "block", margin: 0, padding: 0 }}
            />

            {/* 알파 마니또 스케줄 박스 */}
            <div className="w-full">
              <div className="bg-[#F2F2F2] p-4 md:px-6 md:py-7">
                <h2 className="text-xl md:text-2xl font-bold text-center text-black mb-3 md:mb-4">
                  💌 알파 마니또 스케줄
                </h2>

                {/* 가격 및 범례 */}
                <div className="flex gap-2 md:gap-3 justify-between items-center mb-4 md:mb-6 px-3 md:px-4">
                  <div className="text-sm md:text-base font-semibold text-black">
                    참가비 : 30,000원 (온라인)
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <div className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm border border-black/10 bg-[#FF69B4]/15">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FF69B4]" />
                      <span className="text-black/80">여자</span>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm border border-black/10 bg-[#4A90E2]/15">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#4A90E2]" />
                      <span className="text-black/80">남자</span>
                    </div>
                  </div>
                </div>

                {/* 일정 목록 */}
                <div>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6 text-black/60 text-sm md:text-base">
                      📅 스케줄 정보를 불러오는 중...
                    </div>
                  ) : scheduleData.length === 0 ? (
                    <div className="flex items-center justify-center py-6 text-black/60 text-sm md:text-base">
                      📅 현재 예정된 스케줄이 없습니다
                    </div>
                  ) : (
                    scheduleData.map((schedule, index) => (
                      <ScheduleItem key={index} schedule={schedule} />
                    ))
                  )}
                </div>

                {/* 업데이트 시간 */}
                {lastUpdateTime && (
                  <div className="text-right mt-2 pr-2 text-black/60 text-xs">
                    {lastUpdateTime}
                  </div>
                )}
              </div>
            </div>

            {/* Product Detail 2 */}
            <Image
              src="/ssobig_assets/lovebuddies/alpha/gallery-01.webp"
              alt="알파 마니또 상세 이미지 2"
              width={1920}
              height={1080}
              className="w-full h-auto block leading-[0]"
              style={{ display: "block", margin: 0, padding: 0 }}
            />

            {/* Product Detail 3 */}
            <Image
              src="/ssobig_assets/lovebuddies/alpha/gallery-02.webp"
              alt="알파 마니또 상세 이미지 3"
              width={1920}
              height={1080}
              className="w-full h-auto block leading-[0]"
              style={{ display: "block", margin: 0, padding: 0 }}
            />

            {/* FAQ 섹션 */}
            <div className="w-full bg-[#EDEBF6] px-6 py-4 md:px-9 md:py-7 pb-24 md:pb-28">
              <h2 className="text-xl font-bold text-center text-black mb-4">
                💌 자주 묻는 질문
              </h2>

              <div className="space-y-0">
                {[
                  {
                    question: "[알파 마니또]는 어떻게 신청하나요?",
                    answer:
                      "페이지 하단의 <알파마니또 신청하기> 버튼을 클릭하고<br/>양식에 맞춰 답변을 제출해주시면 됩니다!<br/>신청 후 발송되는 안내 문자에 따라 결제까지 마쳐주셔야 최종 신청 완료이니,<br/><strong style='background-color: #FF69B4; color: white; padding: 2px 4px; border-radius: 4px;'>꼭 안내 문자 확인 후 결제 부탁드립니다!</strong>",
                  },
                  {
                    question: "[알파 마니또]는 무엇인가요?",
                    answer:
                      "알파 마니또는 일일남매 상위 TOP3만 참여 가능한 특별한 이벤트입니다.<br/>5일간 온라인으로 진행되며, 내 마니또와 설레이는 첫만남을 가질 수 있어요!<br/>일일남매에서 좋은 성과를 거둔 분들만 참여할 수 있는 프리미엄 이벤트입니다.",
                  },
                  {
                    question: "[알파 마니또] 참가 자격은 어떻게 되나요?",
                    answer:
                      "일일남매 상위 TOP3에 랭크된 분들만 참여 가능합니다.<br/>일일남매에서 좋은 성과를 거두신 분들께 제공되는 특별한 기회예요!",
                  },
                  {
                    question: "[알파 마니또] 지각시 참여가 어렵나요?",
                    answer:
                      "알파 마니또는 5일간 진행되는 프로그램입니다.<br/>시작일 이후에는 참여가 어려울 수 있으니<br/><strong style='background-color: #FF69B4; color: white; padding: 2px 4px; border-radius: 4px;'>시작일에 맞춰 참여 부탁드립니다!</strong>",
                  },
                  {
                    question: "모임 공지와 진행 방식은 어떻게 확인하나요?",
                    answer:
                      "알파 마니또는 전용 웹앱을 통해 진행됩니다.<br/>모임 전용 웹앱 링크에 접속하시면 공지 및 진행 방식을 확인하실 수 있으니<br/>꼭 접속 후 확인 부탁드립니다!<br/>모임 링크는 시작일 전날 일괄 전송드리고 있습니다 :)",
                  },
                ].map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[720px] md:max-w-[600px] mx-auto">
            <LinkWithUtm
              href="https://tool.ssobig.com/games/7b0a9b90"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#FF6B9F] hover:bg-[#e45a8b] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-base md:text-lg"
              brandPage="love_buddies"
              buttonType="alpha_main_cta"
              destination="smore_form"
            >
              알파마니또 신청하기 💌
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
};

export default ManitoPage;
