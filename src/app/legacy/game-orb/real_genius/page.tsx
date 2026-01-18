"use client";

import Image from "next/image";
import Script from "next/script";
import Head from "next/head";
import LinkWithUtm from "../../../../components/LinkWithUtm";
import { FAQSection } from "../../../../components/FAQ";
import { useState, useEffect } from "react";

interface ScheduleItem {
  date: string;
  time: string;
  title: string;
  difficulty: string[];
  applicants: {
    total: number;
    female: number;
    male: number;
  };
  maxCapacity: number;
}

// FAQ 질문 데이터
const faqQuestions: Array<{
  question: string;
  answer: string | string[];
}> = [
  {
    question: "어떻게 신청하나요?",
    answer: [
      "페이지 하단의 <지금 바로 참여하기> 버튼을 클릭하고 양식에 맞춰 답변을 제출해주시면 됩니다!",
      "신청 후 발송되는 안내 문자에 따라 결제까지 마쳐주셔야 최종 신청 완료이니, 꼭 안내 문자 확인 후 결제 부탁드립니다!",
    ],
  },
  {
    question: "혼자 참여 가능한가요?",
    answer: [
      "물론이죠!",
      "대부분 혼자 오시고, 오히려 새로운 사람들과 게임하다 보면 금방 친해지세요!",
      "익명성과 '함께 게임을 즐긴다'는 목표가 어색함을 눈 녹이듯 사라지게 할 거예요.",
      "새로운 찐친을 만들 절호의 기회!",
    ],
  },
  {
    question: "어떤 분들이 참여하시나요?",
    answer: [
      "정말 다양하고 매력적인 분들이 많이 찾아주세요!",
      "게임을 좋아하고, 새로운 사람들과의 즐거운 만남을 기대하는 긍정적이고 유쾌한 분들이 대부분입니다.",
      "분위기는 늘 화기애애하고 웃음이 넘쳐요!",
      "걱정 말고 오셔서 함께 즐겨요!",
    ],
  },
  {
    question: "지각 시 참여가 어려나요?",
    answer: [
      "사전에 고지 드렸듯이 모임 15분 이후에는 참여가 매우 어렵습니다.",
      "",
      "콘텐츠가 촘촘하게 구성되어 중간부터 참여하기가 어려운 구조입니다.",
      "다른 분들이 이미 현장에서 기다리고 계셔 모임이 지연되는걸 막고자",
      "<strong style='background-color: #9E4BED; color: white; padding: 2px 4px; border-radius: 4px;'>최대 15분까지</strong> 진행 대기 후 모임을 시작하고 있습니다.",
      "<strong style='background-color: #9E4BED; color: white; padding: 2px 4px; border-radius: 4px;'>지각의 경우 환불은 불가능</strong>하니 꼭 시간에 맞춰 현장에 도착 부탁드립니다 : )",
    ],
  },
  {
    question: "방송처럼 경쟁이 너무 치열할까봐 걱정돼요!",
    answer: [
      "TV 프로그램의 흥미로운 요소(전략, 심리)는 가져오지만, 게임오브는 '소셜 활동'에 훨씬 더 큰 방점을 찍고 있어요!",
      "",
      "물론 게임의 긴장감과 반전의 묘미는 살아있지만,",
      "모두가 함께 즐기고 좋은 관계를 형성하는 것이 저희의 최우선 목표입니다.",
      "",
      "과도한 스트레스보다는 유쾌한 심리전과 빛나는 협동을 즐겨주세요!",
      "(맘 놓고 빡겜할 수 있는 '빡크게임'은 별도로 준비할 예정이에요! 지금의 소셜지니어스에서는 '다 함께 재밌게' 즐기는 데 중점을 뒀습니다! 🔥⬅😊)",
    ],
  },
  {
    question: "게임 잘 못하는데 괜찮을까요?",
    answer: [
      "걱정 마세요!",
      "저희 게임오브의 모든 게임은 '쉽고 재미있게!'를 모토로 만들어졌습니다.",
      "게임 시작 전 충분한 설명과 연습 시간도 드리고,",
      "진행자가 친절하게 도와드릴 거예요. 핵심은 좋은 사람들과 재밌는 소통!",
    ],
  },
  {
    question: "음식과 술을 제공하나요?",
    answer: [
      "저희 모임은 서로를 알아가는 시간에 최대한 집중할 수 있도록 콘텐츠에 많은 신경을 썼어요!",
      "",
      "몰입을 위해 모임 중엔 음식이 따로 제공되지 않고",
      "모임이 끝난 뒤, 희망자에 한해 2차 장소로 이동해 식사 및 주류를 즐기는 시간을 가져요 :)",
      "",
      "가능하시다면 식사를 하고 오시는 걸 추천해요!",
      "(간단한 다과류와 물은 구비되어 있습니다😊)",
    ],
  },
  {
    question: "정확한 종료시간에 끝나나요?",
    answer: [
      "모임은 2시간 30분 정도 진행됩니다!",
      "",
      "다만, 당일 상황에 따라 약간의 변동이 있을 수 있어요.",
      "모임 특성상 시간이 지날수록 점점 더 궁금한 사람이 많아지실 거예요!",
      "끝나고 2차에 많이 가시니까 스케줄에 참고해주시면 좋아요 :)",
    ],
  },
  {
    question: "모임 공지와 장소는 어떻게 확인하나요?",
    answer: [
      "모임은 전용 웹앱을 통해 진행됩니다.",
      "모임 전용 웹앱 링크에 접속하시면 장소 및 공지를 확인하실 수 있으니 꼭 접속 후 확인 부탁드립니다!",
      "모임 링크는 모임 하루 전날 톡립톡으로 일괄 전송드리고 있습니다 :)",
    ],
  },
];

export default function RealGeniusPage() {
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
      console.log("🔄 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1onzeBFDNKuJwWwgZG1fvdi_Ch-mTBTwvGsv2NO5Fac8";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1562356640`;
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
            const title = cols[1]?.replace(/"/g, "").trim(); // B열: 선택 항목
            const cColumnValue = cols[2]?.replace(/"/g, "").trim(); // C열: 노출 체크박스 원시값
            const isChecked = cColumnValue === "TRUE"; // 정확한 TRUE 문자열 체크
            const maxCapacity = parseInt(cols[3]) || 20; // D열: 최대인원
            const total = parseInt(cols[4]) || 0; // E열: 합계
            const female = parseInt(cols[5]) || 0; // F열: 여자
            const male = parseInt(cols[6]) || 0; // G열: 남자

            console.log(
              `📋 행 ${
                index + 1
              } - 제목: "${title}", C열 원시값: "${cColumnValue}", 체크상태: ${isChecked}, 최대인원: ${maxCapacity}, 합계: ${total}, 여자: ${female}, 남자: ${male}`
            );

            // 날짜 추출 (괄호 안의 날짜)
            const dateMatch = title.match(/(\d+\/\d+\s*\([^)]+\))/);
            const dateStr = dateMatch ? dateMatch[1] : "";
            // 시간 추출 (예: 17:00)
            const timeMatch = title.match(/(\d{1,2}:\d{2})/);
            const timeStr = timeMatch ? timeMatch[1] : "";

            // 게임명 추출
            const gameName = title
              .replace(/\d+\/\d+\s*\([^)]+\)\s*\d+:\d+\s*/, "")
              .trim();

            // 난이도 추정 (게임명에 따라)
            let difficulty: string[] = ["EASY"];
            if (gameName.includes("바이너리")) {
              difficulty = ["MID"];
            } else if (gameName.includes("이중스파이")) {
              difficulty = ["HARD"];
            } else if (gameName.includes("캠퍼스")) {
              difficulty = ["EASY", "MID"];
            } else if (gameName.includes("죄수의 딜레마")) {
              difficulty = ["EASY", "MID"];
            } else if (gameName.includes("마피아")) {
              difficulty = ["EASY", "MID"];
            } else if (gameName.includes("??????")) {
              difficulty = ["HARD"];
            }

            if (
              isChecked &&
              title &&
              title !== "선택 항목" &&
              title.length > 0
            ) {
              console.log(`✅ 표시 대상으로 추가: ${title}`);

              updatedSchedule.push({
                date: dateStr,
                time: timeStr,
                title: gameName,
                difficulty,
                applicants: {
                  total,
                  female,
                  male,
                },
                maxCapacity,
              });
            } else {
              console.log(
                `❌ 제외된 항목: 제목="${title}", 체크상태=${isChecked}, C열값="${cColumnValue}"`
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
      <div className="p-2 bg-black/30 rounded-lg">
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
  const reviews = [
    {
      text: "드라마틱한 전개의 연속이라 시간 가는 줄 몰랐어요! 이렇게 흥미진진할 줄 몰랐네요!",
      author: "30대 직장인 K님",
    },
    {
      text: "전략 게임이라 어려울까봐 걱정했는데, 생각보다 쉽고 엄청 재미있었어요!",
      author: "20대 대학생 P님",
    },
    {
      text: "처음 본 사람들이랑 이렇게 빨리 친해질 수 있다니 놀라웠어요. 꼭 다시 참가하고 싶어요!",
      author: "30대 직장인 J님",
    },
  ];

  return (
    <>
      <Head>
        <title>REAL GENIUS - Game Orb</title>
        <meta
          name="description"
          content="당신이 주인공이 되는 게임예능 현실판 - 소셜 지니어스"
        />
      </Head>
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

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-purple-500 selection:text-white">
        {/* 배경 이미지 next/image 적용 - 고정 */}
        <div className="fixed inset-0 -z-10 bg-black">
          <Image
            src="/ssobig_assets/devils_plan_hoodie.png"
            alt="리얼지니어스 배경"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.2,
            }}
            priority
            sizes="100vw"
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
          {/* 메인 이미지 */}
          <div className="w-full h-auto mb-10">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/상세 상단 공통 디자인_리얼지니어스.png"
                alt="리얼지니어스 포스터"
                width={620}
                height={0}
                style={{ width: "100%", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>

          {/* 리얼지니어스 스케줄 박스 */}
          <div className="w-full mb-12">
            <div className="bg-black rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-4">
                소셜지니어스 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="bg-black/70 rounded-lg p-4 mb-5">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
                  <p className="text-white font-bold text-lg mb-2 sm:mb-0">
                    가격: <span className="text-white">28,000원</span>
                    <span className="text-[#9E4BED]">(오픈특가)</span>
                  </p>
                  <p className="text-white font-bold text-lg">
                    매주 일요일 <span className="text-white">(3시간)</span>
                  </p>
                </div>

                {/* 범례 */}
                <div className="flex flex-wrap gap-2 justify-end mt-6 mb-3">
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
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-white/60 text-sm">
                      📅 스케줄 정보를 불러오는 중...
                    </div>
                  </div>
                ) : scheduleData.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-white/60 text-sm">
                      📅 현재 예정된 스케줄이 없습니다
                    </div>
                  </div>
                ) : (
                  scheduleData.map((schedule, index) => {
                    const getDifficultyColor = (difficulty: string) => {
                      switch (difficulty) {
                        case "EASY":
                          return "bg-yellow-500/80";
                        case "MID":
                          return "bg-purple-500/80";
                        case "HARD":
                          return "bg-red-500/80";
                        default:
                          return "bg-gray-500/80";
                      }
                    };

                    // 게임별 스타일 텍스트 설정
                    const getGameStyle = (title: string) => {
                      if (
                        title.includes("마피아") ||
                        title.includes("바이너리") ||
                        title.includes("스파이") ||
                        title.includes("설령전") ||
                        title.includes("죄수의 딜레마")
                      ) {
                        return "Mind";
                      } else if (
                        title.includes("슈가빌리지") ||
                        title.includes("캠퍼스")
                      ) {
                        return "Story";
                      }
                      return "";
                    };

                    return (
                      <div
                        key={index}
                        className="rounded-lg bg-black/50 hover:bg-black/80 transition-colors"
                      >
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-[#F4F4F4] min-w-[80px]">
                              {schedule.date} {schedule.time}
                            </span>
                            <span className="text-white font-bold flex-grow">
                              {schedule.title}{" "}
                              {getGameStyle(schedule.title) && (
                                <span
                                  className="font-serif italic text-sm text-[#9E4BED] transform -rotate-2 font-thin"
                                  style={{ fontFamily: "cursive" }}
                                >
                                  {getGameStyle(schedule.title)}
                                </span>
                              )}
                            </span>
                            <div className="flex gap-1">
                              {schedule.difficulty.map((diff, idx) => (
                                <span
                                  key={idx}
                                  className={`${getDifficultyColor(
                                    diff
                                  )} text-white px-2 py-0.5 rounded-full text-xs font-bold`}
                                >
                                  {diff}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-[#9E4BED] font-bold text-sm">
                            {schedule.applicants.total}/{schedule.maxCapacity}명
                          </span>
                        </div>
                        <ApplicantChart
                          applicants={schedule.applicants}
                          maxCapacity={schedule.maxCapacity}
                        />
                      </div>
                    );
                  })
                )}
              </div>

              {/* 업데이트 시간 표시 */}
              {lastUpdateTime && (
                <div className="text-right mt-3 pr-3">
                  <span className="text-white/60 text-xs">
                    {lastUpdateTime}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 소개 섹션 및 나머지 콘텐츠 */}
          <div className="px-5">
            {/* 소개 섹션 */}
            <div className="my-[50px] space-y-4 text-center">
              <p className="text-lg">
                <span className="text-[#95BE62] font-semibold">
                  &quot;데블스 플랜&quot;, &quot;더 지니어스&quot;,
                  <br />
                  &quot;피의 게임&quot;...
                </span>
                <br />
                게임 예능 속 숨 막히는 전략과 반전에 열광하셨나요?
              </p>

              <p className="text-lg">
                혹시{" "}
                <span className="text-[#95BE62] font-semibold">
                  &quot;나라면 저기서 저렇게 했을 텐데!&quot;
                </span>
                <br />
                혹은{" "}
                <span className="text-[#95BE62] font-semibold">
                  &quot;저 게임, 내가 하면 더 잘할 수 있을 것 같은데?&quot;
                </span>
                <br />
                라고 외치신 적 있으신가요?
              </p>

              <p className="text-lg">
                아니면,{" "}
                <span className="text-[#95BE62] font-semibold">
                  &quot;주말에 뭐하지?
                  <br />
                  새로운 사람들과 재밌게 놀고 싶은데!&quot;
                </span>
                <br />
                하고 생각하셨나요?
              </p>
            </div>

            {/* 걱정 해소 섹션 */}
            <div className="mb-10 bg-black/50 backdrop-blur-[30px] p-6 rounded-xl">
              <div className="mb-4 text-center">
                <p className="text-base text-[#95BE62] mb-1">
                  🤯 &quot;게임예능이라니, 너무 어렵진 않을까?&quot;
                </p>
                <p className="text-base text-[#95BE62] mb-2">
                  🥳 &quot;처음인데... 혼자인데... 잘 어울릴 수 있을까?&quot;
                </p>
                <p className="text-lg font-bold">걱정 마세요! 🙌</p>
              </div>
            </div>

            {/* 후기 섹션 */}
            <div className="mb-16">
              <h2 className="text-xl font-bold text-center mb-6">
                참가자분들이 남겨주신
                <br />
                생생한 찐 후기모음🤩
              </h2>

              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-xl">
                    <p className="text-base mb-2">&quot;{review.text}&quot;</p>
                    <p className="text-xs text-purple-300 text-right">
                      - {review.author}
                    </p>
                  </div>
                ))}
              </div>

              {/* 술없이도 이미지 추가 */}
              <div className="text-center mt-6 text-xl font-bold p-0 rounded-xl">
                <div className="w-full mb-4 px-0 pt-[40px]">
                  <Image
                    src="/ssobig_assets/술없이도2.png"
                    alt="술없이도 이미지"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full rounded-[12px]"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "50px",
                    }}
                  />
                </div>

                <p className="text-base font-bold pb-[40px] pt-[20px]">
                  😎 &quot;술 없이도 이렇게 재밌게 친해질 수 있다고?&quot;
                  <br />
                  네, 신기할걸요? 🙌
                  <br />
                  <br />
                  &quot;게임으로 즐겁게 친해진다!&quot;가 우리의 모토! 🙌
                </p>
              </div>
            </div>

            {/* 포인트 1 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  🔮Point.1
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                차별화된 전문성
              </h4>
              <p className="mb-4">
                저희는, 방송보다 더 재밌는 경험을 만들어드리는 걸 핵심 가치로
                삼고 있어요!
              </p>
              <p className="mb-4">
                방송과 똑같이 따라하기? <span className="font-bold">X</span>
                <br />
                <br />
                게임오브만의 독창적인 아이디어와 기술로 재해석하고, 시청자보다
                &apos;참가자&apos; 위주로 디자인한 자체 제작 게임들로
                채워집니다.
              </p>

              {/* 이미지 추가 - img 태그로 변경 */}
              <div className="w-full my-8">
                <Image
                  src="/ssobig_assets/차별화된 전문성.png"
                  alt="차별화된 전문성"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              <p className="text-lg font-bold text-center text-[#95BE62] mt-6">
                뇌지컬 풀가동! 심장은 쫄깃, 웃음은 빵빵! 🤣
              </p>
            </div>

            {/* 포인트 2 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  🔮Point.2
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                게임을 가장 잘 즐길 수 있는 진행방식
              </h4>

              <div className="space-y-3">
                <p className="flex justify-between">
                  <span>자유 탐색전 + 대화</span>
                  <span className="text-purple-300">[15분]</span>
                </p>
                <p className="flex justify-between">
                  <span>안내 + 튜토리얼</span>
                  <span className="text-purple-300">[20분]</span>
                </p>

                {/* 메인 매치 강조 */}
                <div className="bg-[#95BE62]/20 p-4 rounded-xl border border-[#95BE62] shadow-lg mt-4">
                  <p className="flex justify-between items-center mb-3">
                    <span className="text-xl font-extrabold text-[#95BE62]">
                      메인 매치
                    </span>
                    <span className="text-lg font-bold text-white bg-[#95BE62]/30 px-3 py-1 rounded-full">
                      [2시간]
                    </span>
                  </p>

                  <div className="pl-3 border-l-2 border-[#95BE62]/50 ml-2 space-y-3 mt-4">
                    <p className="flex justify-between">
                      <span className="font-medium">전반전</span>
                      <span className="text-purple-300">[50분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      승리 플레이어에게 후반전 베네핏 제공
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">
                        비밀 규칙 공개 + 전략회의
                      </span>
                      <span className="text-purple-300">[20분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      새로운 전략과 새로운 연합 등장
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">후반전</span>
                      <span className="text-purple-300">[50분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      후반전에서 &apos;생존&apos;해야 최종 승리
                    </p>
                  </div>
                </div>

                <p className="flex justify-between mt-4">
                  <span>후일담 나누기</span>
                  <span className="text-purple-300">[25분]</span>
                </p>
                <p>+ 인근 찐맛집 오픈런 2차</p>
              </div>
            </div>

            {/* 포인트 3 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  🔮Point.3
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                방대한 라인업
              </h4>
              <p className="mb-5">
                전문가들이 세심하게 설계한,
                <br />
                누구나 쉽고 재밌게 즐길 수 있는
                <br />
                자체 제작 게임들로 가득하죠.
              </p>

              {/* 가로 스크롤 카드 레이아웃 */}
              <div className="relative w-full pb-6 overflow-x-auto hide-scrollbar">
                <div className="inline-flex space-x-6 px-2 py-6">
                  {/* 설령전 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-yellow-500/50">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/설령전 포스터.png"
                        alt="설령전"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-4 pt-5 flex flex-col h-[155px]">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-white">설령전</span>
                          <span
                            className="font-serif italic text-sm text-yellow-500 transform -rotate-2 font-thin ml-1"
                            style={{ fontFamily: "cursive" }}
                          >
                            Mind
                          </span>
                        </div>
                        <div className="flex gap-1 justify-end">
                          <span className="bg-yellow-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            EASY
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        천년동안 구미호의 지배 아래 음기로 가득 찬 나라. 신수
                        &apos;해태&apos;의 부름을 받아 구미호와 그 세력을
                        물리치고 양의 기운으로 세상의 균형을 되찾아야 합니다.
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex gap-4">
                            <div>
                              <span>복잡성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 2 ? "bg-yellow-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <span>전략성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 2 ? "bg-yellow-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 text-right">
                            <span>12~30명</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 자세히 보기 버튼 */}
                    <LinkWithUtm
                      href="https://www.instagram.com/p/DMSNNtivJyV/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-[#3d2f26] hover:bg-[#4a3a31] text-yellow-400 text-center text-sm font-medium transition-colors"
                      brandPage="game_orb"
                      buttonType="seolryeong_cta"
                      destination="instagram"
                    >
                      자세히 보기
                    </LinkWithUtm>
                  </div>

                  {/* 캠퍼스 라이프 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-yellow-500/50">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/캠퍼스 라이프.png"
                        alt="캠퍼스 라이프"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-4 pt-5 flex flex-col h-[155px]">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-white">
                            캠퍼스 라이프
                          </span>
                        </div>
                        <div className="flex gap-1 justify-end">
                          <span className="bg-yellow-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            EASY
                          </span>
                          <span className="bg-purple-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            MID
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        2025년 8월, 캠퍼스에서 벌어지는 흥미진진한 이야기! 학교
                        생활 포인트 시스템과 함께 펼쳐지는 대학생활 시뮬레이션
                        게임입니다.
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex gap-4">
                            <div>
                              <span>복잡성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 2 ? "bg-yellow-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <span>전략성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 3 ? "bg-yellow-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 text-right">
                            <span>12~30명</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 자세히 보기 버튼 - 카드 외부에 배치 */}
                    <LinkWithUtm
                      href="https://www.instagram.com/p/DMMqr8aPuYb/?igsh=MW82MW50NDk4NjB0bg=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-[#3d2f26] hover:bg-[#4a3a31] text-yellow-400 text-center text-sm font-medium transition-colors"
                    >
                      자세히 보기
                    </LinkWithUtm>
                  </div>

                  {/* 죄수의 딜레마 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-purple-500/50">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/죄수의 딜레마.png"
                        alt="죄수의 딜레마"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-4 pt-5 flex flex-col h-[155px]">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-white">
                            죄수의 딜레마
                          </span>
                        </div>
                        <div className="flex gap-1 justify-end">
                          <span className="bg-yellow-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            EASY
                          </span>
                          <span className="bg-purple-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            MID
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        여러분은 같은 사건에 연루된 공범들입니다. 지금부터 침묵,
                        고발, 자백 중 하나의 행동을 선택하세요. 형량을 가장 많이
                        감형받은 자만이 자유를 되찾을 수 있습니다.
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex gap-4">
                            <div>
                              <span>복잡성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 3 ? "bg-purple-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <span>전략성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 4 ? "bg-purple-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 text-right">
                            <span>10~30명</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 자세히 보기 버튼 - 카드 외부에 배치 */}
                    <LinkWithUtm
                      href="https://www.instagram.com/p/DL9nk0SPVu6/?igsh=cGR5dmxoYXc0YmJq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-[#3d2f26] hover:bg-[#4a3a31] text-purple-400 text-center text-sm font-medium transition-colors"
                    >
                      자세히 보기
                    </LinkWithUtm>
                  </div>

                  {/* 불면증 마피아 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-yellow-500/50">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/불면증 마피아.png"
                        alt="불면증 마피아"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-4 pt-5 flex flex-col h-[155px]">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-white">
                            불면증 마피아
                          </span>
                        </div>
                        <div className="flex gap-1 justify-end">
                          <span className="bg-yellow-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            EASY
                          </span>
                          <span className="bg-purple-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            MID
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        밤이 돼도 못 자...? 모두 눈을 뜬 채 능력을 쓰대! 서로의
                        정체는 끝까지 모르니 긴장감 MAX!
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex gap-4">
                            <div>
                              <span>복잡성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 3 ? "bg-yellow-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <span>전략성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 1 ? "bg-yellow-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 text-right">
                            <span>12~24명</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 자세히 보기 버튼 - 카드 외부에 배치 */}
                    <LinkWithUtm
                      href="https://www.instagram.com/p/DKB9qCYv5q7/?img_index=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-[#3d2f26] hover:bg-[#4a3a31] text-yellow-400 text-center text-sm font-medium transition-colors"
                    >
                      자세히 보기
                    </LinkWithUtm>
                  </div>

                  {/* 이중 스파이 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-purple-500/50">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/이중스파이 포스터.png"
                        alt="이중 스파이"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-4 pt-5 flex flex-col h-[155px]">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-white">
                            이중 스파이
                          </span>
                        </div>
                        <div className="flex gap-1 justify-end">
                          <span className="bg-red-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            HARD
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        다양한 능력을 쓸 수 있는 심도 있는 팀전 세력전! 흑막으로
                        상대 조직의 보스가 지목 되다면!
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex gap-4">
                            <div>
                              <span>복잡성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 3 ? "bg-purple-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <span>전략성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 5 ? "bg-purple-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 text-right">
                            <span>12~40명</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 자세히 보기 버튼 - 카드 외부에 배치 */}
                    <LinkWithUtm
                      href="https://www.instagram.com/p/DLTwW3FP3pB/?igsh=MTRpOW5vYnFvOGJw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-[#3d2f26] hover:bg-[#4a3a31] text-purple-400 text-center text-sm font-medium transition-colors"
                    >
                      자세히 보기
                    </LinkWithUtm>
                  </div>

                  {/* 바이너리 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-purple-500/50">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/바이너리_compressed.png"
                        alt="바이너리"
                        fill
                        style={{ objectFit: "cover" }}
                        priority={false}
                        loading="lazy"
                        sizes="220px"
                        onError={(e) => {
                          console.error("바이너리 이미지 로드 실패:", e);
                          // 이미지 로드 실패 시 fallback 처리
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.parentElement?.querySelector(
                            ".image-fallback"
                          ) as HTMLElement;
                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                      {/* Fallback 텍스트 */}
                      <div
                        className="image-fallback absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg"
                        style={{ display: "none" }}
                      >
                        바이너리
                      </div>
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-4 pt-5 flex flex-col h-[155px]">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-white">바이너리</span>
                        </div>
                        <div className="flex gap-1 justify-end">
                          <span className="bg-purple-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            MID
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        이진법을 결합한 단체 심리전 투표게임?! 시드 숫자를
                        랜덤으로 받아, 동맹이 시시각각 바뀐다!
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex gap-4">
                            <div>
                              <span>복잡성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 3 ? "bg-purple-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <span>전략성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 3 ? "bg-purple-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 text-right">
                            <span>20~100명</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 자세히 보기 버튼 - 카드 외부에 배치 */}
                    <LinkWithUtm
                      href="https://www.instagram.com/p/DKl3Ev6PqzK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-[#3d2f26] hover:bg-[#4a3a31] text-purple-400 text-center text-sm font-medium transition-colors"
                    >
                      자세히 보기
                    </LinkWithUtm>
                  </div>

                  {/* 슈가빌리지 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-yellow-500/50">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/슈가빌리지 포스터.png"
                        alt="슈가빌리지"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-4 pt-5 flex flex-col h-[155px]">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-white">
                            슈가빌리지
                          </span>
                        </div>
                        <div className="flex gap-1 justify-end">
                          <span className="bg-yellow-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                            EASY
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        캔디로 유명한 슈가빌리지에 첫 가게를 차리게 된 찰리!
                        사탕에 독을 탄 사람은 도대체 누구? 내가 주인공이 되는
                        스토리 게임!
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex gap-4">
                            <div>
                              <span>복잡성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 2 ? "bg-yellow-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <span>전략성</span>
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i === 1 ? "bg-yellow-500" : "bg-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 text-right">
                            <span>8~32명</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 자세히 보기 버튼 - 카드 외부에 배치 */}
                    <LinkWithUtm
                      href="https://www.instagram.com/p/DKB-DzTPSjf/?img_index=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-[#3d2f26] hover:bg-[#4a3a31] text-yellow-400 text-center text-sm font-medium transition-colors"
                    >
                      자세히 보기
                    </LinkWithUtm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="w-full max-w-[620px] mx-auto px-5 py-1 pb-10">
          <FAQSection questions={faqQuestions} />
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://tool.ssobig.com/games/ee200ae0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#9E4BED] hover:bg-[#8341c9] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
              brandPage="game_orb"
              buttonType="real_genius_main_cta"
              destination="smore_form"
            >
              지금 바로 참여하기
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
