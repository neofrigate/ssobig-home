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
    <div className="border-b border-white/10 last:border-b-0">
      <button
        className="w-full py-4 text-left flex justify-between items-center transition-colors hover:bg-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base md:text-lg font-medium text-white pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-white transition-transform duration-200 flex-shrink-0 ${
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
            className="text-sm md:text-base text-white/80 font-normal leading-relaxed"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  );
};

const SocialGeniusPage = () => {
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
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1562356640`;

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
            const maxCapacity = parseInt(cols[3]) || 20;
            const total = parseInt(cols[4]) || 0;
            const female = parseInt(cols[5]) || 0;
            const male = parseInt(cols[6]) || 0;

            if (
              isChecked &&
              title &&
              title !== "선택 항목" &&
              title.length > 0
            ) {
              const dateMatch = title.match(/(\d+\/\d+\s*\([^)]+\))/);
              const dateStr = dateMatch ? dateMatch[1] : "";

              const timeMatch = title.match(/\d+:\d+/);
              const timeStr = timeMatch ? timeMatch[0] : "";

              const gameTitle = title
                .replace(/\d+\/\d+\s*\([^)]+\)\s*\d+:\d+\s*/, "")
                .trim();

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
    const timeMatch = schedule.title.match(/^(\d+:\d+)\s+(.+)$/);
    const time = timeMatch ? timeMatch[1] : "";
    const gameName = timeMatch ? timeMatch[2] : schedule.title;

    const textOpacity = isCompleted ? "opacity-30" : "";

    return (
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-4">
          <div className="flex items-center space-x-3 md:space-x-4 flex-grow">
            <span
              className={`font-medium md:font-semibold text-sm md:text-base text-white whitespace-nowrap ${textOpacity}`}
            >
              {schedule.date} {time}
            </span>
            <span
              className={`font-bold text-sm md:text-base text-white ${textOpacity}`}
            >
              {gameName}
            </span>
          </div>
          <span
            className={`font-light text-xs md:text-sm text-white/70 ml-3 whitespace-nowrap ${textOpacity}`}
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
        id="facebook-pixel-game-orb"
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

      <div className="min-h-screen text-white font-sans relative">
        {/* 배경 이미지 next/image 적용 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/gameorb/hero-main.jpg"
            alt="소셜지니어스 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
          {/* 배경 이미지 위에 그라데이션 오버레이 적용 */}
          <div className="fixed inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/55"></div>
          {/* 모바일 상단 GNB 영역 블랙 배경 */}
          <div className="fixed top-0 left-0 right-0 h-[88px] bg-black md:hidden z-0"></div>
        </div>

        {/* Content Area */}
        <main className="w-full md:max-w-[720px] flex flex-col items-center mx-auto pt-0 md:pt-6">
          {/* 상세 1 + 스케줄 + 상세 2 그룹 */}
          <div className="w-full md:rounded-3xl overflow-hidden md:shadow-lg">
            {/* Product Detail 1 */}
            <Image
              src="/ssobig_assets/offline/mafia/불면증마피아 1.jpg"
              alt="상세 이미지 1"
              width={1920}
              height={1080}
              className="w-full h-auto block leading-[0]"
              priority
              style={{ display: "block", margin: 0, padding: 0 }}
            />

            {/* 소셜지니어스 스케줄 박스 */}
            <div className="w-full -mt-1">
              <div className="bg-black p-4 md:px-6 md:py-7">
                <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-3 md:mb-4">
                  불면증마피아 스케줄
                </h2>

                {/* 참가비 및 범례 */}
                <div className="flex gap-2 md:gap-3 justify-between items-center mb-4 md:mb-6 px-3 md:px-4">
                  <div className="text-sm md:text-base font-semibold text-white">
                    참가비 : 30,000원 (오픈할인중)
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <div className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm border border-white/10 bg-[#FF69B4]/20">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FF69B4]" />
                      <span className="text-white/80">여자</span>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm border border-white/10 bg-[#4A90E2]/20">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#4A90E2]" />
                      <span className="text-white/80">남자</span>
                    </div>
                  </div>
                </div>

                {/* 일정 목록 */}
                <div>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6 text-white/60 text-sm md:text-base">
                      📅 스케줄 정보를 불러오는 중...
                    </div>
                  ) : scheduleData.length === 0 ? (
                    <div className="flex items-center justify-center py-6 text-white/60 text-sm md:text-base">
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
                  <div className="text-right mt-2 pr-2 text-white/60 text-xs">
                    {lastUpdateTime}
                  </div>
                )}
              </div>
            </div>

            {/* Product Detail 2 이미지 */}
            <Image
              src="/ssobig_assets/offline/mafia/불면증마피아2.webp"
              alt="상세 이미지 2"
              width={1920}
              height={1080}
              className="w-full h-auto block leading-[0]"
              style={{ display: "block", margin: 0, padding: 0 }}
            />

            {/* Product Detail 3 이미지 */}
            <Image
              src="/ssobig_assets/offline/mafia/불면증마피아 3.png"
              alt="상세 이미지 3"
              width={1920}
              height={1080}
              className="w-full h-auto block leading-[0]"
              style={{ display: "block", margin: 0, padding: 0 }}
            />

            {/* FAQ 섹션 */}
            <div className="w-full bg-[#141414] px-6 py-4 md:px-9 md:py-7 pb-24 md:pb-28">
              <h2 className="text-xl font-bold text-center text-white mb-4">
                🎮 자주 묻는 질문
              </h2>

              <div className="space-y-0">
                {[
                  {
                    question: "어떻게 신청하나요?",
                    answer:
                      "페이지 하단의 <지금 바로 참여하기> 버튼을 클릭하고<br/>양식에 맞춰 답변을 제출해주시면 됩니다!<br/>신청 후 발송되는 안내 문자에 따라 결제까지 마쳐주셔야 최종 신청 완료이니,<br/><strong style='background-color: #9E4BED; color: white; padding: 2px 4px; border-radius: 4px;'>꼭 안내 문자 확인 후 결제 부탁드립니다!</strong>",
                  },
                  {
                    question: "혼자 참여 가능한가요?",
                    answer:
                      "물론이죠!<br/>대부분 혼자 오시고, 오히려 새로운 사람들과 게임하다 보면 금방 친해지세요!<br/>익명성과 '함께 게임을 즐긴다'는 목표가 어색함을 눈 녹이듯 사라지게 할 거예요.<br/>새로운 찐친을 만들 절호의 기회!",
                  },
                  {
                    question: "어떤 분들이 참여하시나요?",
                    answer:
                      "정말 다양하고 매력적인 분들이 많이 찾아주세요!<br/>게임을 좋아하고, 새로운 사람들과의 즐거운 만남을 기대하는 긍정적이고 유쾌한 분들이 대부분입니다.<br/>분위기는 늘 화기애애하고 웃음이 넘쳐요! <br/>걱정 말고 오셔서 함께 즐겨요!",
                  },
                  {
                    question: "지각 시 참여가 어렵나요?",
                    answer:
                      "사전에 고지 드렸듯이 모임 15분 이후에는 참여가 매우 어렵습니다.<br/><br/>콘텐츠가 촘촘하게 구성되어 중간부터 참여하기가 어려운 구조입니다.<br/>다른 분들이 이미 현장에서 기다리고 계셔서 모임이 지연되는 걸 막고자<br/><strong style='background-color: #9E4BED; color: white; padding: 2px 4px; border-radius: 4px;'>최대 15분까지</strong> 진행 대기 후 모임을 시작하고 있습니다.<br/><strong style='background-color: #9E4BED; color: white; padding: 2px 4px; border-radius: 4px;'>지각의 경우 환불은 불가능</strong>하니 꼭 시간에 맞춰 현장에 도착 부탁드립니다 : )",
                  },
                  {
                    question: "방송처럼 경쟁이 너무 치열할까봐 걱정돼요!",
                    answer:
                      "TV 프로그램의 흥미로운 요소(전략, 심리)는 가져오지만,<br/>게임오브는 '소셜 활동'에 훨씬 더 큰 방점을 찍고 있어요!<br/><br/>물론 게임의 긴장감과 반전의 묘미는 살아있지만,<br/>모두가 함께 즐기고 좋은 관계를 형성하는 것이 저희의 최우선 목표입니다.<br/><br/>과도한 스트레스보다는 유쾌한 심리전과 빛나는 협동을 즐겨주세요!<br/>(맘 놓고 빡겜할 수 있는 '빡크게임'은 별도로 준비할 예정이에요!<br/>지금의 소셜지니어스에서는 '다 함께 재밌게' 즐기는 데 중점을 뒀습니다! 🔥⬅😊)",
                  },
                  {
                    question: "게임 잘 못하는데 괜찮을까요?",
                    answer:
                      "걱정 마세요!<br/>저희 게임오브의 모든 게임은 '쉽고 재미있게!'를 모토로 만들어졌습니다.<br/>게임 시작 전 충분한 설명과 연습 시간도 드리고,<br/>진행자가 친절하게 도와드릴 거예요. 핵심은 좋은 사람들과 재밌는 소통!",
                  },
                  {
                    question: "음식과 술을 제공하나요?",
                    answer:
                      "저희 모임은 서로를 알아가는 시간에 최대한 집중할 수 있도록<br/>콘텐츠에 많은 신경을 썼어요!<br/><br/>몰입을 위해 모임 중엔 음식이 따로 제공되지 않고<br/>모임이 끝난 뒤, 희망자에 한해 2차 장소로 이동해<br/>식사 및 주류를 즐기는 시간을 가져요 :)<br/><br/>가능하시다면 식사를 하고 오시는 걸 추천해요!<br/>(간단한 다과류와 물은 구비되어 있습니다😊)",
                  },
                  {
                    question: "정확한 종료시간에 끝나나요?",
                    answer:
                      "모임은 2시간 30분 정도 진행됩니다!<br/><br/>다만, 당일 상황에 따라 약간의 변동이 있을 수 있어요.<br/>모임 특성상 시간이 지날수록 점점 더 궁금한 사람이 많아지실 거예요!<br/>끝나고 2차에 많이 가시니까 스케줄에 참고해주시면 좋아요 : )",
                  },
                  {
                    question: "모임 공지와 장소는 어떻게 확인하나요?",
                    answer:
                      "모임은 전용 웹앱을 통해 진행됩니다.<br/>모임 전용 웹앱 링크에 접속하시면 장소 및 공지를 확인하실 수 있으니<br/>꼭 접속 후 확인 부탁드립니다!<br/>모임 링크는 모임 하루 전날 톡립톡으로 일괄 전송드리고 있습니다 : )",
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
              href="https://form.ssobig.com/realgenius"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#9E4BED] hover:bg-[#8341c9] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-base md:text-lg"
              brandPage="game_orb"
              buttonType="social_genius_main_cta"
              destination="smore_form"
            >
              지금 바로 참여하기 🎮
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

export default SocialGeniusPage;
