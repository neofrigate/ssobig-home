"use client";

import Image from "next/image";
import Script from "next/script";
import Head from "next/head";
import LinkWithUtm from "../../../../components/LinkWithUtm";
import { useState, useEffect } from "react";

interface ScheduleItem {
  date: string;
  title: string;
  hasEarlyBird: boolean;
  applicants: {
    planner: number;
    marketer: number;
    developer: number;
    designer: number;
    other: number;
  };
  maxCapacity: number;
}

export default function RealGeniusPage() {
  const [scheduleData, setScheduleData] = useState([
    {
      date: "5/29 (목)",
      title: "AI & 업무 자동화",
      hasEarlyBird: true,
      applicants: {
        planner: 4,
        marketer: 2,
        developer: 2,
        designer: 2,
        other: 1,
      },
      maxCapacity: 20,
    },
    {
      date: "6/5 (목)",
      title: "생성형 AI와 콘텐츠 제작",
      hasEarlyBird: true,
      applicants: {
        planner: 2,
        marketer: 2,
        developer: 1,
        designer: 1,
        other: 1,
      },
      maxCapacity: 20,
    },
    {
      date: "6/12 (목)",
      title: "AI를 활용한 협업 프로세스 구축",
      hasEarlyBird: true,
      applicants: {
        planner: 1,
        marketer: 1,
        developer: 1,
        designer: 1,
        other: 1,
      },
      maxCapacity: 20,
    },
  ]);

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
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
        console.log("📡 요청 URL:", url);

        const response = await fetch(url);
        console.log("📥 응답 상태:", response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        console.log("📄 CSV 데이터 길이:", csvText.length);
        console.log("📄 CSV 데이터 미리보기:", csvText.substring(0, 500));

        // CSV 파싱
        const rows = csvText.split("\n").slice(1); // 헤더 제외
        console.log("📊 총 데이터 행 수:", rows.length);
        const updatedSchedule: ScheduleItem[] = [];

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const title = cols[1]?.replace(/"/g, "").trim(); // B열: 제목
            const isChecked = cols[2]?.replace(/"/g, "").trim() === "TRUE"; // C열: 노출 체크박스
            const maxCapacity = parseInt(cols[3]) || 20; // D열: 최대인원

            const planner = parseInt(cols[5]) || 0; // F열: 기획자
            const marketer = parseInt(cols[6]) || 0; // G열: 마케터
            const developer = parseInt(cols[7]) || 0; // H열: 개발자
            const designer = parseInt(cols[8]) || 0; // I열: 디자이너
            const other = parseInt(cols[9]) || 0; // J열: 기타

            console.log(
              `📋 행 파싱 - 제목: "${title}", 체크: ${isChecked}, 최대인원: ${maxCapacity}, 기획자: ${planner}, 마케터: ${marketer}, 개발자: ${developer}, 디자이너: ${designer}, 기타: ${other}`
            );

            // 체크박스가 체크되고 제목이 유효한 경우에만 표시
            const isVisible = isChecked && title && title !== "선택 항목";
            console.log(
              `✅ 표시 여부: ${isVisible} (체크: ${isChecked}, 제목 유효: ${
                title && title !== "선택 항목"
              })`
            );

            if (isVisible) {
              // 날짜 추출 (괄호 안의 날짜)
              const dateMatch = title.match(/\(([^)]+)\)/);
              const dateStr = dateMatch ? dateMatch[1] : "";

              updatedSchedule.push({
                date: dateStr,
                title: title.replace(/\([^)]*\)/, "").trim(),
                hasEarlyBird: true,
                applicants: {
                  planner,
                  marketer,
                  developer,
                  designer,
                  other,
                },
                maxCapacity,
              });
            }
          }
        });

        console.log(`📝 파싱 완료 - 총 ${updatedSchedule.length}개 일정 발견`);

        if (updatedSchedule.length > 0) {
          console.log("✨ 업데이트된 스케줄 데이터:", updatedSchedule);
          console.log("🔄 React state 업데이트 중...");
          setScheduleData(updatedSchedule);
          console.log("✅ 데이터 업데이트 완료!");
        } else {
          console.log(
            "⚠️ 표시할 데이터가 없습니다. 체크박스가 체크된 항목이 있는지 확인하세요."
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
      }
    };

    fetchSheetData();
  }, []);

  const jobColors = {
    planner: "#8851FF", // 기획자
    marketer: "#95BCF3", // 마케터
    developer: "#F3EB82", // 개발자
    designer: "#F09127", // 디자이너
    other: "#FFB4C3", // 기타
  };

  const jobLabels = {
    planner: "기획자",
    marketer: "마케터",
    developer: "개발자",
    designer: "디자이너",
    other: "기타",
  };

  type ApplicantData = {
    planner: number;
    marketer: number;
    developer: number;
    designer: number;
    other: number;
  };

  const ApplicantChart = ({
    applicants,
    maxCapacity,
  }: {
    applicants: ApplicantData;
    maxCapacity: number;
  }) => {
    // 누적 바 차트를 위한 데이터 준비
    const chartData = Object.entries(applicants).map(
      ([job, count]: [string, number]) => {
        const percentage = maxCapacity > 0 ? (count / maxCapacity) * 100 : 0;
        return {
          job,
          count,
          percentage,
          color: jobColors[job as keyof typeof jobColors],
          label: jobLabels[job as keyof typeof jobLabels],
        };
      }
    );

    return (
      <div className="p-2 bg-black/30 rounded-lg">
        {/* 누적 바 차트 */}
        <div className="flex h-4 bg-white/10 rounded-full overflow-hidden">
          {chartData.map((item) => (
            <div
              key={item.job}
              className="transition-all duration-700 ease-out"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
            />
          ))}
          {/* 빈 공간 표시 */}
          <div
            className="bg-white/5"
            style={{
              width: `${Math.max(
                0,
                100 - chartData.reduce((sum, item) => sum + item.percentage, 0)
              )}%`,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>N.O.W.seoul Meet UP</title>
        <meta
          name="description"
          content="다양한 직무의 실전형 전문가들이, 술 없이도 진짜로 성장하고 연결되는, 밀도 높은 평일 저녁 네트워킹 커뮤니티"
        />
      </Head>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel-now-seoul-meetup"
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
            fbq('init', '1409643070210008');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1409643070210008&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-purple-500 selection:text-white">
        {/* 배경 이미지 next/image 적용 - 고정 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/나우서울그라데이션배경.png"
            alt="나우서울 그라데이션 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
          {/* 배경 이미지 위에 그라데이션 오버레이 적용 */}
          <div className="fixed inset-0 bg-gradient-to-b from-black to-transparent"></div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
          {/* 메인 이미지 */}
          <div className="w-full h-auto mb-10">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/나우서울 상세 상단.jpg"
                alt="나우서울 Meet UP 포스터"
                width={1240}
                height={620}
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, 620px"
                className="rounded-none w-full h-auto"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* 나우서울 밋업 스케줄 박스 */}
          <div className="w-full mb-12 px-5">
            <div className="bg-black rounded-xl p-3 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-3">
                나우서울 밋업 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="bg-black/70 rounded-lg p-3 mb-3">
                <div className="flex flex-col space-y-4">
                  <div>
                    <div className="flex items-center flex-wrap">
                      <span className="text-white font-bold text-lg mr-2">
                        가격:
                      </span>
                      <span className="line-through text-gray-400 text-lg mr-2">
                        21,000원
                      </span>
                      <span className="text-[#FFAC3A] font-bold text-xl">
                        15,000원
                      </span>
                      <span className="bg-[#FFAC3A] text-black px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                        얼리버드
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      * 얼리버드 혜택은 선착순 마감됩니다
                    </p>
                  </div>
                  <div className="text-white font-bold text-lg">
                    매주 목요일 19:30~22:00
                    <span className="text-white"> (2.5시간)</span>
                  </div>
                </div>

                {/* 태그 형태 범례 */}
                <div className="flex flex-wrap gap-2 justify-end mt-6 mb-3">
                  {Object.entries(jobLabels).map(([job, label]) => (
                    <div
                      key={job}
                      className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-white/20"
                      style={{
                        backgroundColor: `${
                          jobColors[job as keyof typeof jobColors]
                        }20`,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            jobColors[job as keyof typeof jobColors],
                        }}
                      />
                      <span className="text-white/90">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 일정 목록 */}
              <div className="space-y-2">
                {scheduleData.map((schedule, index) => {
                  const total = Object.values(schedule.applicants).reduce(
                    (sum: number, count: number) => sum + count,
                    0
                  );
                  return (
                    <div
                      key={index}
                      className="rounded-lg bg-black/50 hover:bg-black/80 transition-colors"
                    >
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-[#F4F4F4] min-w-[80px]">
                            {schedule.date}
                          </span>
                          <span className="text-white font-bold">
                            {schedule.title}
                          </span>
                        </div>
                        <span className="text-[#FFAC3A] font-bold text-sm">
                          {total}/{schedule.maxCapacity}명
                        </span>
                      </div>
                      <ApplicantChart
                        applicants={schedule.applicants}
                        maxCapacity={schedule.maxCapacity}
                      />
                    </div>
                  );
                })}
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
            <div className="my-[60px] space-y-8">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-[#FFAC3A] mb-5 tracking-tight">
                  Night Off Work,
                  <br />
                  Turn ON Your
                  <span className="animate-pulse">____</span>
                </h3>

                <p className="text-lg md:text-xl leading-relaxed mx-auto max-w-[520px]">
                  퇴근 후 당신의 무엇이든 깨우는 시간이 되기를 바랍니다
                </p>

                <div className="mt-4 inline-block bg-gradient-to-r from-[#FFAC3A]/20 to-[#FFAC3A]/5 px-6 py-3 rounded-full">
                  <span className="text-[#FFAC3A] font-medium text-lg">
                    의미 있는 인연과 아이디어를 나누는
                    <br />
                    비즈니스 네트워킹
                  </span>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-inner border border-white/5">
                <h4 className="text-xl font-bold mb-5 text-center text-white">
                  혹시 이런 경험 있으신가요?
                </h4>

                <div className="space-y-5">
                  <div className="flex items-start">
                    <span className="text-[#FFAC3A] text-2xl mr-3">❝</span>
                    <p className="text-base md:text-lg text-white/90">
                      <span className="text-[#FFAC3A] font-medium">
                        네트워킹이라니, 어색하고 부담스럽지 않을까?
                      </span>
                      <br />
                      <span className="text-sm text-white/70 mt-1 block">
                        처음 만나는 사람들과의 대화가 부담스럽게 느껴지시나요?
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#FFAC3A] text-2xl mr-3">❝</span>
                    <p className="text-base md:text-lg text-white/90">
                      <span className="text-[#FFAC3A] font-medium">
                        술자리만 되어버리는 네트워킹 모임, 형식적인 만남
                      </span>
                      <br />
                      <span className="text-sm text-white/70 mt-1 block">
                        의미 있는 연결을 원하셨는데 기대에 미치지 못했던 경험이
                        있으신가요?
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#FFAC3A] text-2xl mr-3">❝</span>
                    <p className="text-base md:text-lg text-white/90">
                      <span className="text-[#FFAC3A] font-medium">
                        모임의 취지는 좋았는데 몰입하기 어려웠다
                      </span>
                      <br />
                      <span className="text-sm text-white/70 mt-1 block">
                        루즈한 진행과 불분명한 목적으로 시간이 아깝게 느껴진
                        적이 있으신가요?
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-lg font-bold text-white">
                    걱정 마세요, 나우서울은 다릅니다{" "}
                    <span className="text-xl">✨</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 이미지 및 설명 섹션 */}
            <div className="mb-16">
              {/* 술없이도 이미지 추가 */}
              <div className="text-center mt-6 text-xl font-bold p-0 rounded-xl">
                <div className="w-full mb-4 px-0 pt-[40px]">
                  <Image
                    src="/ssobig_assets/나우서울 예시 이미지.png"
                    alt="나우서울 밋업 현장"
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
                  &quot;의미 있는 네트워킹을 통한 전문가 커뮤니티&quot;
                  <br />
                  가치 있는 연결이 만들어지는 곳
                  <br />
                  <br />
                  &quot;진정한 연결과 성장&quot;이 우리의 가치입니다
                </p>
              </div>
            </div>

            {/* 포인트 1 섹션 */}
            <div className="mb-10 bg-[#101F50]/10 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                  Point.1
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                밀도 높은 네트워킹 설계
              </h4>
              <p className="mb-4">
                기존 비즈니스 모임의 얕은 대화, 제한된 네트워크, 술자리 중심
                문화에서 벗어나{" "}
                <span className="font-bold text-[#FFAC3A]">
                  진정한 네트워킹의 가치
                </span>
                에 집중합니다.
              </p>
              <p className="mb-4">
                자체 개발 앱으로 프로필 카드를 작성하고, 다양한 직무의
                참가자들과 효과적으로 만날 수 있도록 자리를 배치합니다. 관심사가
                비슷한 사람들을 쉽게 찾을 수 있어 의미 있는 연결이 가능합니다.
              </p>

              {/* 이미지 추가 - img 태그로 변경 */}
              <div className="w-full my-8">
                <Image
                  src="/ssobig_assets/나우서울 포인트.png"
                  alt="밀도 높은 네트워킹 설계"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              <p className="text-lg font-bold text-center text-[#FFAC3A] mt-6">
                &quot;내가 성장하고, 남도 성장시키는&quot;
                <br />
                밀도 높은 커뮤니티 🤝
              </p>
            </div>

            {/* 포인트 2 섹션 */}
            <div className="mb-10 bg-[#101F50]/10 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                  Point.2
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                체계적이고 디테일한 진행방식
              </h4>
              <p className="mb-4">
                <span className="font-bold text-[#FFAC3A]">30분 룰</span>을
                기반으로 대화에 몰입하면서도 다양한 참가자들과 교류할 수 있는
                시스템을 운영합니다. 대규모 네트워킹이지만{" "}
                <span className="font-bold text-[#FFAC3A]">
                  4~6명의 소수로 그룹핑
                </span>
                되어 밀도 있는 대화가 가능하며, 3번의 테이블 세션에서 30분마다
                자리를 바꿔 최대한 많은 사람들과 만날 수 있습니다.
              </p>

              <div className="space-y-3">
                {/* 시작 세션 - 수정 */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">환영 및 오리엔테이션</span>
                  <span className="text-purple-300">[15분]</span>
                </div>
                <p className="text-sm text-white/80 ml-3 mb-4">
                  참가자 소개 및 나우서울 네트워킹 진행 방식 안내
                </p>

                {/* 테이블 세션 강조 */}
                <div className="bg-[#FFAC3A]/20 p-4 rounded-xl border border-[#FFAC3A] shadow-lg mt-4">
                  <p className="flex justify-between items-center mb-3">
                    <span className="text-xl font-extrabold text-[#FFAC3A]">
                      테이블 세션
                    </span>
                    <span className="text-lg font-bold text-white bg-[#FFAC3A]/30 px-3 py-1 rounded-full">
                      [1시간 30분]
                    </span>
                  </p>

                  <div className="pl-3 border-l-2 border-[#FFAC3A]/50 ml-2 space-y-3 mt-4">
                    <p className="flex justify-between">
                      <span className="font-medium">Table Session 1</span>
                      <span className="text-purple-300">[30분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      서로 다른 직무의 참가자들과 첫 대화
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">Table Session 2</span>
                      <span className="text-purple-300">[30분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      새로운 그룹과 심화 주제 토론
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">Table Session 3</span>
                      <span className="text-purple-300">[30분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      실질적 고민과 협업 가능성 모색
                    </p>
                  </div>
                </div>

                {/* 스탠딩 세션 강조 */}
                <div className="bg-[#FFAC3A]/20 p-4 rounded-xl border border-[#FFAC3A] shadow-lg mt-4">
                  <p className="flex justify-between items-center mb-3">
                    <span className="text-xl font-extrabold text-[#FFAC3A]">
                      스탠딩 세션
                    </span>
                    <span className="text-lg font-bold text-white bg-[#FFAC3A]/30 px-3 py-1 rounded-full">
                      [30분]
                    </span>
                  </p>

                  <div className="pl-3 border-l-2 border-[#FFAC3A]/50 ml-2 space-y-3 mt-4">
                    <p className="flex justify-between">
                      <span className="font-medium text-white">
                        Standing Session
                      </span>
                      <span className="text-purple-300">[30분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      자유롭게 더 대화하고 싶은 사람들과 연결
                    </p>
                    <p className="text-sm text-white/80 ml-3 mt-3">
                      프로필 카드를 통해 참가자들의 정보를 확인하고,{" "}
                      <span className="font-bold text-[#FFAC3A]">
                        상호 관심이 있는 경우에만
                      </span>{" "}
                      연락처가 공유되는 안전한 시스템으로 운영됩니다.
                    </p>
                  </div>
                </div>

                {/* 네트워킹 시간 - 수정 */}
                <div className="flex justify-between items-center mt-4">
                  <span className="font-medium">
                    마무리 & 자유 네트워킹 타임
                  </span>
                  <span className="text-purple-300">[15분~]</span>
                </div>
                <p className="text-sm text-white/80 ml-3">
                  관심 있는 참가자들과의 추가 대화 및 연결 기회
                </p>
              </div>
            </div>

            {/* 포인트 3 섹션 */}
            <div className="mb-10 bg-[#101F50]/10 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                  Point.3
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                지속 가능한 커뮤니티
              </h4>
              <p className="mb-5">
                나우서울 Meet Up은 일회성 모임이 아닌, 지속적인 관계 형성을
                목표로 합니다. 첫 만남 이후에도 참가자들 간의 연결을 유지할 수
                있는 다양한 채널과 후속 이벤트를 제공합니다.
              </p>

              <div className="bg-white/5 p-5 rounded-xl mb-6">
                <h5 className="font-bold text-[#FFAC3A] mb-3">
                  네트워킹 후속 지원
                </h5>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FFAC3A] mr-2">•</span>
                    <span>참가자 연락처 공유 시스템 (선택적)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFAC3A] mr-2">•</span>
                    <span>커뮤니티 온라인 그룹 초대</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFAC3A] mr-2">•</span>
                    <span>다음 Meet Up 및 관련 이벤트 우선 알림</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg font-bold text-center text-[#FFAC3A] mt-6">
                &quot;한 번의 만남, 지속적인 연결, 함께하는 성장&quot;
              </p>
            </div>

            {/* 고객 후기 섹션 */}
            <div className="my-20">
              <h2 className="text-2xl font-bold text-center mb-12 text-white">
                나우서울 참가자분들이 남겨주신
                <br />
                소중한 후기입니다
              </h2>

              <div className="space-y-6">
                {/* 후기 1 */}
                <div className="bg-[#101F50]/20 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
                  <p className="text-white mb-4 leading-relaxed">
                    &quot;다양한 직무의 전문가들과 깊이 있는 대화를 나눌 수
                    있어서 정말 값진 시간이었어요. 마케팅 아이디어를 얻고 실제
                    협업까지 이어진 경험이 놀라웠습니다!&quot;
                  </p>
                  <p className="text-[#FFAC3A] text-right font-medium">
                    - 2년차 마케터 서지민
                  </p>
                </div>

                {/* 후기 2 */}
                <div className="bg-[#101F50]/20 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
                  <p className="text-white mb-4 leading-relaxed">
                    &quot;평일 저녁에 이렇게 의미 있는 커뮤니티를 만날 수 있다니
                    놀랐어요. 개발자로서 다른 직무와 인사이트를 얻을 수 있는
                    소중한 기회였습니다.&quot;
                  </p>
                  <p className="text-[#FFAC3A] text-right font-medium">
                    - 13년차 개발자 김도현
                  </p>
                </div>

                {/* 후기 3 */}
                <div className="bg-[#101F50]/20 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
                  <p className="text-white mb-4 leading-relaxed">
                    &quot;체계적인 네트워킹 시스템에 감동했어요. 디자이너로서
                    다양한 분야의 피드백을 한 자리에서 얻고 실제 프로젝트
                    의뢰까지 받았습니다!&quot;
                  </p>
                  <p className="text-[#FFAC3A] text-right font-medium">
                    - 5년차 디자이너 이혜원
                  </p>
                </div>
              </div>
            </div>

            {/* 마무리 섹션 */}
            <div className="text-center my-20">
              <h2 className="text-2xl font-bold mb-5">
                전문성은 나누고, 인사이트는 채우고!
                <br />
                진정한 네트워킹의 가치를 경험하세요!
              </h2>
              <p className="text-lg mb-8">
                이제 더 이상 형식적인 명함 교환에 그치지 마세요!
              </p>
              <p className="text-xl text-[#FFAC3A] font-bold">
                성장과 협업의 기회를 만들어 줄<br />
                &lt;나우서울 밋업&gt;이 당신을 기다립니다.
              </p>
            </div>

            {/* 연합어때 이미지 */}
            <div className="w-full my-24"></div>

            {/* FAQ 섹션 */}
            <div className="mb-16">
              {/* Single FAQ box for all questions */}
              <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-8">
                  자주 묻는 질문들
                </h2>

                <div className="space-y-8">
                  {/* Q1 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q1: 네트워킹이 너무 어색하지 않을까요? 처음인데
                      괜찮을까요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      걱정 마세요! 저희{" "}
                      <span className="font-bold">나우서울</span>의 모든 밋업은
                      &apos;자연스러운 연결&apos;을 모토로 설계되었습니다.
                      체계적인 세션 구성과 전문 퍼실리테이터의 가이드로 대화가
                      자연스럽게 이어집니다. 관심사와 직무 기반 테이블 매칭으로
                      공통 주제부터 대화를 시작할 수 있어 어색함이 빠르게
                      사라진답니다.
                    </p>
                  </div>

                  {/* Q2 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q2: 혼자 참여해도 괜찮을까요? 어색할 것 같아요.
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      물론입니다! 대부분의 참가자가 혼자 오십니다. 저희 밋업은
                      소규모 그룹(4~6명)으로 진행되어 모두가 균등하게 발언
                      기회를 갖고, 서로의 이야기에 귀 기울일 수 있는 환경을
                      제공합니다. 오히려 혼자 오시면 더 다양한 분들과 새로운
                      관계를 맺을 수 있어 네트워킹 효과가 극대화됩니다!
                    </p>
                  </div>

                  {/* Q3 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q3: 일반적인 비즈니스 미팅과는 어떤 차별점이 있나요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      일반 비즈니스 미팅은 종종 형식적이고 표면적인 관계에
                      그치지만,
                      <span className="font-bold"> 나우서울</span> 밋업은 진정성
                      있는 관계 형성에 중점을 둡니다. 30분 룰로 깊이 있는 대화와
                      다양한 관점을 경험할 수 있으며, 철저히 참가자 중심의
                      설계로 모든 분이 가치 있는 연결을 만들어갑니다. 실제
                      프로젝트 협업, 멘토링, 정보 교류까지 이어지는 실질적인
                      네트워킹이 이루어집니다.
                    </p>
                  </div>

                  {/* Q4 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q4: 어떤 사람들이 주로 참여하나요? 분위기는 어떤가요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      디자인, 개발, 마케팅, 기획, 비즈니스 등 다양한 분야의
                      전문가들이 참여합니다. 주니어부터 시니어까지 다양한 경력의
                      참가자들이 모이지만, 공통점은 성장과 협업에 대한 열린
                      태도를 가진 분들이라는 점입니다. 분위기는 진지하면서도
                      편안하고, 상호 존중하는 환경에서 유익한 대화가 오가는 것이
                      특징입니다. 평균적으로 25-40세 전문가들이 많이 참여하시며,
                      매 회 새로운 만남을 경험하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://form.ssobig.com/nowseoul"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#101F50] hover:bg-[#0A1838] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
              brandPage="now_seoul"
              buttonType="meetup_main_cta"
              destination="smore_form"
            >
              나우서울 참여하기
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
