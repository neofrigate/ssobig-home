"use client";

import Image from "next/image";
import Script from "next/script";
import Head from "next/head";
import LinkWithUtm from "../../../../components/LinkWithUtm";
import React, { useState, useEffect } from "react";

interface GameOfDemoScheduleItem {
  date: string;
  title: string;
  applicants: {
    total: number;
    participants: number;
    creators: number;
  };
  maxCapacity: number;
}

interface GameSubmissionItem {
  round: string;
  gameName: string;
  author: string;
  minPlayers: number;
  maxPlayers: number;
  duration: string;
  genre: string;
}

interface GroupedSubmissions {
  [key: string]: GameSubmissionItem[];
}

export default function DemoDayPage() {
  // 게임오브데모데이 상태
  const [gameOfDemoData, setGameOfDemoData] = useState<
    GameOfDemoScheduleItem[]
  >([]);
  const [gameOfDemoLoading, setGameOfDemoLoading] = useState(true);

  // 출품작 데이터 상태
  const [submissionsData, setSubmissionsData] = useState<GroupedSubmissions>(
    {}
  );
  const [submissionsLoading, setSubmissionsLoading] = useState(true);

  // 게임오브데모데이 데이터 가져오기
  useEffect(() => {
    const fetchGameOfDemoData = async () => {
      console.log("🔄 게임오브데모데이 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1onzeBFDNKuJwWwgZG1fvdi_Ch-mTBTwvGsv2NO5Fac8";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=265032622`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const rows = csvText.split("\n").slice(1);
        const updatedSchedule: GameOfDemoScheduleItem[] = [];

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const title = cols[1]?.replace(/"/g, "").trim();
            const cColumnValue = cols[2]?.replace(/"/g, "").trim();
            const isChecked = cColumnValue === "TRUE";
            const maxCapacity = parseInt(cols[3]) || 50;
            const total = parseInt(cols[4]) || 0;
            const participants = parseInt(cols[5]) || 0;
            const creators = parseInt(cols[6]) || 0;

            if (
              isChecked &&
              title &&
              title !== "선택 항목" &&
              title.length > 0
            ) {
              // 제목에서 날짜 추출 (예: [12회] 6월 28일 토요일 13시~18시)
              const dateMatch = title.match(/(\d+월\s*\d+일\s*[^0-9]*)/);
              const dateStr = dateMatch ? dateMatch[1].trim() : "";

              updatedSchedule.push({
                date: dateStr,
                title: title,
                applicants: {
                  total,
                  participants,
                  creators,
                },
                maxCapacity,
              });
            }
          }
        });

        setGameOfDemoData(updatedSchedule);
        setGameOfDemoLoading(false);
      } catch (error) {
        console.error("❌ 게임오브데모데이 데이터 가져오기 실패:", error);
        setGameOfDemoLoading(false);
      }
    };

    fetchGameOfDemoData();
  }, []);

  // 출품작 데이터 가져오기
  useEffect(() => {
    const fetchSubmissionsData = async () => {
      console.log("🔄 출품작 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1onzeBFDNKuJwWwgZG1fvdi_Ch-mTBTwvGsv2NO5Fac8";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1631169733`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        console.log(
          "📄 출품작 CSV 원본 데이터 (첫 1000자):",
          csvText.substring(0, 1000)
        );
        const rows = csvText.split("\n").slice(1); // 헤더 제외
        console.log("📊 출품작 총 행 수:", rows.length);
        const groupedData: GroupedSubmissions = {};

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const roundInfo = cols[0]?.replace(/"/g, "").trim(); // A열: 회차 정보
            const gameName = cols[1]?.replace(/"/g, "").trim(); // B열: 게임명
            const author = cols[2]?.replace(/"/g, "").trim(); // C열: 작가명
            const checkValue = cols[3]?.replace(/"/g, "").trim(); // D열: ✅확인 완료 체크박스
            const isChecked =
              checkValue === "TRUE" ||
              checkValue === "✓" ||
              checkValue === "true" ||
              checkValue === "1"; // 여러 체크 값 처리
            const minPlayers = parseInt(cols[4]) || 0; // E열: 최소 인원
            const maxPlayers = parseInt(cols[5]) || 0; // F열: 최대 인원
            const duration = cols[6]?.replace(/"/g, "").trim(); // G열: 시간
            const genre = cols[7]?.replace(/"/g, "").trim(); // H열: 장르

            console.log(`📋 출품작 행 분석:`, {
              roundInfo,
              gameName,
              author,
              checkValue,
              isChecked,
              minPlayers,
              maxPlayers,
              duration,
              genre,
              fullRow: cols,
            });

            // 체크된 항목이고 게임명이 있고 회차 정보가 포함된 경우에만 처리
            if (
              isChecked &&
              gameName &&
              gameName.length > 0 &&
              roundInfo &&
              roundInfo.includes("[") &&
              roundInfo.includes("회]")
            ) {
              // 회차 정보 추출 (예: [11회], [12회])
              const roundMatch = roundInfo.match(/\[(\d+회)\]/);
              const round = roundMatch ? roundMatch[1] : "";

              console.log(`✅ 출품작 추가:`, { round, gameName, author });

              if (round) {
                if (!groupedData[round]) {
                  groupedData[round] = [];
                }

                groupedData[round].push({
                  round,
                  gameName,
                  author,
                  minPlayers,
                  maxPlayers,
                  duration,
                  genre,
                });
              }
            } else {
              console.log(`❌ 출품작 제외:`, {
                isChecked,
                hasGameName: !!gameName,
                gameNameLength: gameName?.length,
                hasRoundInfo:
                  roundInfo &&
                  roundInfo.includes("[") &&
                  roundInfo.includes("회]"),
                roundInfo,
                checkValue,
              });
            }
          }
        });

        console.log(`📝 최종 그룹화된 데이터:`, groupedData);

        setSubmissionsData(groupedData);
        setSubmissionsLoading(false);
        console.log("✅ 출품작 데이터 업데이트 완료!");
      } catch (error) {
        console.error("❌ 출품작 데이터 가져오기 실패:", error);
        setSubmissionsLoading(false);
      }
    };

    fetchSubmissionsData();
  }, []);

  // 차트 컴포넌트
  const GameOfDemoApplicantChart = ({
    applicants,
    maxCapacity,
  }: {
    applicants: { total: number; participants: number; creators: number };
    maxCapacity: number;
  }) => {
    const participantsPercentage =
      maxCapacity > 0 ? (applicants.participants / maxCapacity) * 100 : 0;
    const creatorsPercentage =
      maxCapacity > 0 ? (applicants.creators / maxCapacity) * 100 : 0;
    const emptyPercentage = Math.max(
      0,
      100 - participantsPercentage - creatorsPercentage
    );

    return (
      <div className="p-1 bg-black/30 rounded-lg">
        {/* 누적 바 차트 */}
        <div className="flex h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="transition-all duration-700 ease-out bg-[#7343F8]"
            style={{ width: `${participantsPercentage}%` }}
          />
          <div
            className="transition-all duration-700 ease-out bg-[#2BAE6C]"
            style={{ width: `${creatorsPercentage}%` }}
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
      text: "게임 창작자로서 정말 유익한 피드백을 받을 수 있었어요! 이런 기회가 더 많았으면 좋겠네요.",
      author: "게임 개발자 A님",
    },
    {
      text: "새로운 게임들을 가장 먼저 체험할 수 있어서 너무 재미있었어요! 다음에도 꼭 참여하고 싶어요.",
      author: "게임 애호가 B님",
    },
    {
      text: "같은 취향의 사람들과 깊이 있는 대화를 나눌 수 있어서 좋았습니다. 네트워킹도 정말 유익했어요!",
      author: "플레이어 C님",
    },
  ];

  return (
    <>
      <Head>
        <title>DEMODAY - Game Orb</title>
        <meta
          name="description"
          content="게임 창작자와 플레이어가 만나는 특별한 데모데이 - 게임오브 소셜링"
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

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-purple-500 selection:text-white">
        {/* 배경 이미지 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/게임오브 배경.jpg"
            alt="게임오브 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
        </div>

        {/* 배경 오버레이들 */}
        <div className="fixed inset-0 -z-5 bg-gradient-to-b from-black to-transparent"></div>
        <div className="fixed inset-0 -z-5 bg-black/70"></div>

        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
          {/* 메인 이미지 */}
          <div className="w-full h-auto mb-0">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/상세 상단 공통 디자인_데모데이.png"
                alt="데모데이 포스터"
                width={620}
                height={0}
                style={{ width: "100%", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>

          {/* 데모데이 정보 박스 */}
          <div className="w-full mb-12">
            <div className="bg-black rounded-none p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-4">
                게임오브 소셜링 데모데이
              </h2>

              {/* 가격 및 시간 정보 */}
              <div
                className="bg-black/70 rounded-lg p-6
               mb-0"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
                  <p className="text-white font-bold text-lg mb-2 sm:mb-0">
                    가격: <span className="text-white">플레이어 20,000원</span>
                    <span className="text-[#2BAE6C]"> / 출품자 무료</span>
                  </p>
                  <p className="text-white font-bold text-lg">
                    매월 마지막 주말 <span className="text-white">(5시간)</span>
                  </p>
                </div>

                {/* 범례 */}
                <div className="flex flex-wrap gap-2 justify-end mt-3">
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-white/20 bg-[#7343F8]/20">
                    <div className="w-2 h-2 rounded-full bg-[#7343F8]" />
                    <span className="text-white/90">참가자</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-white/20 bg-[#2BAE6C]/20">
                    <div className="w-2 h-2 rounded-full bg-[#2BAE6C]" />
                    <span className="text-white/90">출품자</span>
                  </div>
                </div>
              </div>

              {/* 일정 목록 */}
              <div className="space-y-1">
                {gameOfDemoLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      📅 스케줄 정보를 불러오는 중...
                    </div>
                  </div>
                ) : gameOfDemoData.length === 0 ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      📅 다음 스케줄이 곧 공개됩니다!
                    </div>
                  </div>
                ) : (
                  gameOfDemoData.map((schedule, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-black/50 hover:bg-black/80 transition-colors"
                    >
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-normal flex-grow text-s">
                            {schedule.title}
                          </span>
                        </div>
                        <span className="text-[#9E4BED] font-normal text-s">
                          {schedule.applicants.total}/{schedule.maxCapacity}명
                        </span>
                      </div>
                      <div className="px-3 pb-2">
                        <GameOfDemoApplicantChart
                          applicants={schedule.applicants}
                          maxCapacity={schedule.maxCapacity}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 출품작 리스트 */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-xl font-bold text-center text-white mb-4">
                  🎮 출품작 리스트
                </h3>

                {submissionsLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      🎮 출품작 정보를 불러오는 중...
                    </div>
                  </div>
                ) : Object.keys(submissionsData).length === 0 ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      🎮 현재 등록된 출품작이 없습니다
                    </div>
                  </div>
                ) : (
                  Object.keys(submissionsData)
                    .sort()
                    .map((round) => (
                      <div key={round} className="mb-6">
                        <h4 className="text-lg font-bold text-[#2BAE6C] mb-3">
                          [{round}] 출품작
                        </h4>
                        <div className="space-y-1">
                          {submissionsData[round].map((submission, index) => (
                            <div
                              key={index}
                              className="bg-black/30 rounded-lg p-2.5"
                            >
                              <div className="text-white font-medium text-base mb-1">
                                {submission.gameName}
                              </div>
                              <div className="text-white/70 text-sm">
                                {submission.author} (
                                {submission.minPlayers === submission.maxPlayers
                                  ? `${submission.minPlayers}명`
                                  : `${submission.minPlayers}~${submission.maxPlayers}명`}
                                , {submission.duration}, {submission.genre})
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* 소개 섹션 및 나머지 콘텐츠 */}
          <div className="px-5">
            {/* 도입부 섹션 */}
            <div className="my-[50px] space-y-4 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                혹시 이런 고민 해보셨나요?
              </h2>

              <div className="space-y-4 text-lg">
                <p className="text-[#95BE62] font-semibold">
                  &quot;내가 만든 게임이 정말 재미있는지 객관적으로 알고
                  싶은데...&quot;
                </p>

                <p className="text-[#95BE62] font-semibold">
                  &quot;양질의 피드백을 줄 수 있는 테스터들을 어디서 찾지?&quot;
                </p>

                <p className="text-[#95BE62] font-semibold">
                  &quot;게임 예능보다 재미있는 신작 게임들을 먼저 경험해보고
                  싶은데...&quot;
                </p>

                <p className="text-[#95BE62] font-semibold">
                  &quot;오프라인 게임 문화를 진심으로 사랑하는 사람들과 교류하고
                  싶어!&quot;
                </p>
              </div>
            </div>

            {/* 솔루션 섹션 */}
            <div className="mb-10 bg-black/50 backdrop-blur-[30px] p-6 rounded-xl">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  그래서 저희 게임오브 소셜링 데모데이가 탄생했습니다!
                </h2>
                <p className="text-lg text-white">
                  게임 창작자에게는 게임러버 테스터풀과 함께 건설적인 피드백을,
                  플레이어에게는 어디서도 경험할 수 없는 신작 게임들의 첫 경험을
                  제공합니다.
                </p>
                <p className="text-lg text-[#95BE62] font-bold mt-4">
                  단순한 테스트를 넘어서, 오프라인 게임 문화를 함께 만들어가는
                  의미있는 시간입니다.
                </p>
              </div>
            </div>

            {/* 후기 섹션 */}
            <div className="mb-16">
              <h2 className="text-xl font-bold text-center mb-6">
                &quot;정말 나에게도 도움이 될까?&quot; 아직 확신이 서지
                않으신다면,
                <br />
                실제 참가자들의 생생한 후기를 먼저 만나보세요!
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
            </div>

            {/* 진행 방식 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  📋 진행 방식
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-white">
                  • 당일 플레이할 게임은 인원 구성과 플레이어 취향에 맞게 투표로
                  선택
                </p>
                <p className="text-white">
                  • 게임별 피드백 세션을 통한 건설적인 개선 방안 논의
                </p>
                <p className="text-white">
                  • 자유로운 네트워킹을 위한 희망자 대상 2차 뒷풀이 진행
                </p>
              </div>
            </div>

            {/* FAQ 섹션 */}
            <div className="mb-16">
              <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-8">
                  자주 묻는 질문들
                </h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q1. 게임 초보자도 참여할 수 있나요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      물론입니다! 게임을 사랑하는 마음만 있다면 누구나
                      환영합니다. 현장에서 친절하게 안내해드려요.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q2. 혼자 가도 괜찮을까요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      대환영입니다! 같은 취향의 분들과 자연스럽게 어울릴 수
                      있도록 도와드리며, 많은 분들이 혼자 오셔서 좋은 인연을
                      만들어가고 계세요.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q3. 게임 룰을 미리 알아야 하나요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      아니요, 현장에서 설명해드립니다. 다만 미리 확인하고
                      싶으시다면 신청 링크에서 출품작 정보를 확인하실 수 있어요.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 신청 전 최종 확인 내용 */}
            <div className="mb-16">
              <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-8">
                  신청 전 최종 확인 내용
                </h2>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-white/10">
                    <span className="font-bold text-[#9E4BED] md:w-[120px] mb-2 md:mb-0">
                      장소
                    </span>
                    <span className="text-white">
                      쏘빅 스튜디오 (신논현역 5분 거리)
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-white/10">
                    <span className="font-bold text-[#9E4BED] md:w-[120px] mb-2 md:mb-0">
                      정원
                    </span>
                    <span className="text-white">최대 50명</span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start py-3 border-b border-white/10">
                    <span className="font-bold text-[#9E4BED] md:w-[120px] mb-2 md:mb-0">
                      포함 내역
                    </span>
                    <span className="text-white">
                      5시간 게임 체험, 피드백 세션, 네트워킹 기회
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start py-3">
                    <span className="font-bold text-[#9E4BED] md:w-[120px] mb-2 md:mb-0">
                      미포함 내역
                    </span>
                    <span className="text-white">식사, 2차 모임비</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 마무리 섹션 */}
            <div className="text-center my-20">
              <h2 className="text-2xl font-bold mb-5">
                게임 예능 방송보다
                <br />
                재밌는 게임들을 더 많이 뿜어내는,
                <br />
                그런 소중하고 독특한 모임이 될 수 있도록
                <br />
                최선을 다하겠습니다!
              </h2>
              <p className="text-lg mb-8">
                여러분의 참여 하나하나가
                <br />
                오프라인 게임 문화 발전에 큰 기여가 됩니다.
              </p>
              <p className="text-xl text-[#95BE62] font-bold">곧 뵙겠습니다!</p>
            </div>
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <div className="flex gap-2">
              <LinkWithUtm
                href="https://form.ssobig.com/gameorb3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-[56px] bg-[#2BAE6C] hover:bg-[#239456] text-white font-bold px-4 rounded-[100px] flex items-center justify-center transition-colors text-base"
                brandPage="game_orb"
                buttonType="demoday_submit_cta"
                destination="smore_form"
              >
                게임 출품하기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
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
              <LinkWithUtm
                href="https://form.ssobig.com/gameorb2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-[56px] bg-[#9E4BED] hover:bg-[#8341c9] text-white font-bold px-4 rounded-[100px] flex items-center justify-center transition-colors text-base"
                brandPage="game_orb"
                buttonType="demoday_participate_cta"
                destination="smore_form"
              >
                일반 참가하기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
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
      </div>
    </>
  );
}
