"use client";

import React, { useState, useEffect } from "react";

interface LoveBuddiesScheduleItem {
  date: string;
  title: string;
  applicants: {
    total: number;
    female: number;
    male: number;
  };
  maxCapacity: number;
}

interface NowSeoulScheduleItem {
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

interface RealGeniusScheduleItem {
  date: string;
  title: string;
  difficulty: string;
  applicants: {
    total: number;
    female: number;
    male: number;
  };
  maxCapacity: number;
}

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

export default function RealDataPage() {
  // 러브버디즈 상태
  const [loveBuddiesData, setLoveBuddiesData] = useState<
    LoveBuddiesScheduleItem[]
  >([]);
  const [loveBuddiesLoading, setLoveBuddiesLoading] = useState(true);
  const [loveBuddiesUpdateTime, setLoveBuddiesUpdateTime] =
    useState<string>("");

  // 나우서울 상태
  const [nowSeoulData, setNowSeoulData] = useState<NowSeoulScheduleItem[]>([]);
  const [nowSeoulLoading, setNowSeoulLoading] = useState(true);
  const [nowSeoulUpdateTime, setNowSeoulUpdateTime] = useState<string>("");

  // 리얼지니어스 상태
  const [realGeniusData, setRealGeniusData] = useState<
    RealGeniusScheduleItem[]
  >([]);
  const [realGeniusLoading, setRealGeniusLoading] = useState(true);
  const [realGeniusUpdateTime, setRealGeniusUpdateTime] = useState<string>("");

  // 게임오브데모데이 상태
  const [gameOfDemoData, setGameOfDemoData] = useState<
    GameOfDemoScheduleItem[]
  >([]);
  const [gameOfDemoLoading, setGameOfDemoLoading] = useState(true);
  const [gameOfDemoUpdateTime, setGameOfDemoUpdateTime] = useState<string>("");

  // 러브버디즈 데이터 가져오기
  useEffect(() => {
    const fetchLoveBuddiesData = async () => {
      console.log("🔄 러브버디즈 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1DNTbKynAke3kGJ50lJq-bHyC70oyZrapj4OLm18szfo";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1294659426`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const rows = csvText.split("\n").slice(1);
        const updatedSchedule: LoveBuddiesScheduleItem[] = [];

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
              title.includes("일일남매") &&
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

        setLoveBuddiesData(updatedSchedule);
        setLoveBuddiesLoading(false);

        const now = new Date();
        const updateTimeString = `UPDATE : ${now.getFullYear()}.${String(
          now.getMonth() + 1
        ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setLoveBuddiesUpdateTime(updateTimeString);
      } catch (error) {
        console.error("❌ 러브버디즈 데이터 가져오기 실패:", error);
        setLoveBuddiesLoading(false);
      }
    };

    fetchLoveBuddiesData();
  }, []);

  // 나우서울 데이터 가져오기
  useEffect(() => {
    const fetchNowSeoulData = async () => {
      console.log("🔄 나우서울 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1DNTbKynAke3kGJ50lJq-bHyC70oyZrapj4OLm18szfo";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const rows = csvText.split("\n").slice(1);
        const updatedSchedule: NowSeoulScheduleItem[] = [];

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const title = cols[1]?.replace(/"/g, "").trim();
            const isChecked = cols[2]?.replace(/"/g, "").trim() === "TRUE";
            const maxCapacity = parseInt(cols[3]) || 20;

            const planner = parseInt(cols[5]) || 0;
            const marketer = parseInt(cols[6]) || 0;
            const developer = parseInt(cols[7]) || 0;
            const designer = parseInt(cols[8]) || 0;
            const other = parseInt(cols[9]) || 0;

            const isVisible = isChecked && title && title !== "선택 항목";

            if (isVisible) {
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

        if (updatedSchedule.length > 0) {
          setNowSeoulData(updatedSchedule);
        }
        setNowSeoulLoading(false);

        const now = new Date();
        const updateTimeString = `UPDATE : ${now.getFullYear()}.${String(
          now.getMonth() + 1
        ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setNowSeoulUpdateTime(updateTimeString);
      } catch (error) {
        console.error("❌ 나우서울 데이터 가져오기 실패:", error);
        setNowSeoulLoading(false);
      }
    };

    fetchNowSeoulData();
  }, []);

  // 리얼지니어스 데이터 가져오기
  useEffect(() => {
    const fetchRealGeniusData = async () => {
      console.log("🔄 리얼지니어스 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1DNTbKynAke3kGJ50lJq-bHyC70oyZrapj4OLm18szfo";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1562356640`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const rows = csvText.split("\n").slice(1);
        const updatedSchedule: RealGeniusScheduleItem[] = [];

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

              const gameName = title
                .replace(/\d+\/\d+\s*\([^)]+\)\s*\d+:\d+\s*/, "")
                .trim();

              let difficulty = "EASY";
              if (
                gameName.includes("바이너리") ||
                gameName.includes("이중스파이")
              ) {
                difficulty = "MID";
              } else if (gameName.includes("??????")) {
                difficulty = "HARD";
              }

              updatedSchedule.push({
                date: dateStr,
                title: gameName,
                difficulty,
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

        setRealGeniusData(updatedSchedule);
        setRealGeniusLoading(false);

        const now = new Date();
        const updateTimeString = `UPDATE : ${now.getFullYear()}.${String(
          now.getMonth() + 1
        ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setRealGeniusUpdateTime(updateTimeString);
      } catch (error) {
        console.error("❌ 리얼지니어스 데이터 가져오기 실패:", error);
        setRealGeniusLoading(false);
      }
    };

    fetchRealGeniusData();
  }, []);

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

        const now = new Date();
        const updateTimeString = `UPDATE : ${now.getFullYear()}.${String(
          now.getMonth() + 1
        ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setGameOfDemoUpdateTime(updateTimeString);
      } catch (error) {
        console.error("❌ 게임오브데모데이 데이터 가져오기 실패:", error);
        setGameOfDemoLoading(false);
      }
    };

    fetchGameOfDemoData();
  }, []);

  // 러브버디즈 참가자 차트 컴포넌트
  const LoveBuddiesApplicantChart = ({
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
        <div className="flex h-2 bg-white/10 rounded-full overflow-hidden relative group">
          {applicants.female > 0 && (
            <div
              className="transition-all duration-700 ease-out bg-[#FF69B4] relative"
              style={{ width: `${femalePercentage}%` }}
              title={`여자: ${applicants.female}명`}
            />
          )}
          {applicants.male > 0 && (
            <div
              className="transition-all duration-700 ease-out bg-[#4A90E2] relative"
              style={{ width: `${malePercentage}%` }}
              title={`남자: ${applicants.male}명`}
            />
          )}
          <div
            className="bg-white/5"
            style={{ width: `${emptyPercentage}%` }}
          />

          {/* 호버 툴팁 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              여자: {applicants.female}명, 남자: {applicants.male}명
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 나우서울 참가자 차트 컴포넌트
  const jobColors = {
    planner: "#8851FF",
    marketer: "#95BCF3",
    developer: "#F3EB82",
    designer: "#F09127",
    other: "#FFB4C3",
  };

  const jobLabels = {
    planner: "기획자",
    marketer: "마케터",
    developer: "개발자",
    designer: "디자이너",
    other: "기타",
  };

  const NowSeoulApplicantChart = ({
    applicants,
    maxCapacity,
  }: {
    applicants: {
      planner: number;
      marketer: number;
      developer: number;
      designer: number;
      other: number;
    };
    maxCapacity: number;
  }) => {
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

    const tooltipText = chartData
      .filter((item) => item.count > 0)
      .map((item) => `${item.label}: ${item.count}명`)
      .join(", ");

    return (
      <div className="p-2 bg-black/30 rounded-lg">
        <div className="flex h-4 bg-white/10 rounded-full overflow-hidden relative group">
          {chartData.map(
            (item) =>
              item.count > 0 && (
                <div
                  key={item.job}
                  className="transition-all duration-700 ease-out"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.label}: ${item.count}명`}
                />
              )
          )}
          <div
            className="bg-white/5"
            style={{
              width: `${Math.max(
                0,
                100 - chartData.reduce((sum, item) => sum + item.percentage, 0)
              )}%`,
            }}
          />

          {/* 호버 툴팁 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap max-w-xs">
              {tooltipText}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 리얼지니어스 참가자 차트 컴포넌트
  const RealGeniusApplicantChart = ({
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
        <div className="flex h-2 bg-white/10 rounded-full overflow-hidden relative group">
          {applicants.female > 0 && (
            <div
              className="transition-all duration-700 ease-out bg-[#FF69B4]"
              style={{ width: `${femalePercentage}%` }}
              title={`여자: ${applicants.female}명`}
            />
          )}
          {applicants.male > 0 && (
            <div
              className="transition-all duration-700 ease-out bg-[#4A90E2]"
              style={{ width: `${malePercentage}%` }}
              title={`남자: ${applicants.male}명`}
            />
          )}
          <div
            className="bg-white/5"
            style={{ width: `${emptyPercentage}%` }}
          />

          {/* 호버 툴팁 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              여자: {applicants.female}명, 남자: {applicants.male}명
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 게임오브데모데이 참가자 차트 컴포넌트
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
      <div className="p-2 bg-black/30 rounded-lg">
        <div className="flex h-2 bg-white/10 rounded-full overflow-hidden relative group">
          {applicants.participants > 0 && (
            <div
              className="transition-all duration-700 ease-out bg-[#4A90E2]"
              style={{ width: `${participantsPercentage}%` }}
              title={`참가자: ${applicants.participants}명`}
            />
          )}
          {applicants.creators > 0 && (
            <div
              className="transition-all duration-700 ease-out bg-[#FF6B9F]"
              style={{ width: `${creatorsPercentage}%` }}
              title={`제작자: ${applicants.creators}명`}
            />
          )}
          <div
            className="bg-white/5"
            style={{ width: `${emptyPercentage}%` }}
          />

          {/* 호버 툴팁 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              참가자: {applicants.participants}명, 제작자: {applicants.creators}
              명
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 내부 스케줄 데이터
          </h1>
          <p className="text-white/80 text-lg">
            전체 브랜드 스케줄 현황 (내부용)
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {/* 러브버디즈 스케줄 박스 */}
          <div className="w-full">
            <div className="bg-white/5 p-4 shadow-lg">
              <h2 className="text-xl font-bold text-center text-white mb-3">
                💕 러브버디즈 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="rounded-lg p-3 mb-4">
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
                {loveBuddiesLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      📅 스케줄 정보를 불러오는 중...
                    </div>
                  </div>
                ) : loveBuddiesData.length === 0 ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      📅 현재 예정된 스케줄이 없습니다
                    </div>
                  </div>
                ) : (
                  loveBuddiesData.map((schedule, index) => (
                    <div
                      key={index}
                      className="rounded-lg hover:bg-black/30 transition-colors"
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
                        <LoveBuddiesApplicantChart
                          applicants={schedule.applicants}
                          maxCapacity={schedule.maxCapacity}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 업데이트 시간 표시 */}
              {loveBuddiesUpdateTime && (
                <div className="text-right mt-2 pr-2">
                  <span className="text-white/60 text-xs">
                    {loveBuddiesUpdateTime}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 나우서울 밋업 스케줄 박스 */}
          <div className="w-full mb-12">
            <div className="bg-white/5 rounded-xl p-3 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-3">
                나우서울 밋업 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="rounded-lg p-3 mb-3">
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
                {nowSeoulLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      📅 스케줄 정보를 불러오는 중...
                    </div>
                  </div>
                ) : nowSeoulData.length === 0 ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-white/60 text-sm">
                      📅 현재 예정된 스케줄이 없습니다
                    </div>
                  </div>
                ) : (
                  nowSeoulData.map((schedule, index) => {
                    const total = Object.values(schedule.applicants).reduce(
                      (sum: number, count: number) => sum + count,
                      0
                    );
                    return (
                      <div
                        key={index}
                        className="rounded-lg hover:bg-black/30 transition-colors"
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
                        <NowSeoulApplicantChart
                          applicants={schedule.applicants}
                          maxCapacity={schedule.maxCapacity}
                        />
                      </div>
                    );
                  })
                )}
              </div>

              {/* 업데이트 시간 표시 */}
              {nowSeoulUpdateTime && (
                <div className="text-right mt-3 pr-3">
                  <span className="text-white/60 text-xs">
                    {nowSeoulUpdateTime}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 소셜지니어스 스케줄 박스 */}
          <div className="w-full mb-12">
            <div className="bg-white/5 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-4">
                소셜지니어스 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="rounded-lg p-4 mb-5">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
                  <p className="text-white font-bold text-lg mb-2 sm:mb-0">
                    가격: <span className="text-white">28,000원</span>
                    <span className="text-[#9E4BED]">(오픈특가)</span>
                  </p>
                  <p className="text-white font-bold text-lg">
                    매주 일요일 17:00~20:00{" "}
                    <span className="text-white">(3시간)</span>
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
                {realGeniusLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-white/60 text-sm">
                      📅 스케줄 정보를 불러오는 중...
                    </div>
                  </div>
                ) : realGeniusData.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-white/60 text-sm">
                      📅 현재 예정된 스케줄이 없습니다
                    </div>
                  </div>
                ) : (
                  realGeniusData.map((schedule, index) => {
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

                    const getGameStyle = (title: string) => {
                      if (
                        title.includes("마피아") ||
                        title.includes("바이너리") ||
                        title.includes("스파이")
                      ) {
                        return "Mind";
                      } else if (title.includes("슈가빌리지")) {
                        return "Story";
                      }
                      return "";
                    };

                    return (
                      <div
                        key={index}
                        className="rounded-lg hover:bg-black/30 transition-colors"
                      >
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-[#F4F4F4] min-w-[80px]">
                              {schedule.date}
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
                            <span
                              className={`${getDifficultyColor(
                                schedule.difficulty
                              )} text-white px-2 py-0.5 rounded-full text-xs font-bold`}
                            >
                              {schedule.difficulty}
                            </span>
                          </div>
                          <span className="text-[#9E4BED] font-bold text-sm">
                            {schedule.applicants.total}/{schedule.maxCapacity}명
                          </span>
                        </div>
                        <RealGeniusApplicantChart
                          applicants={schedule.applicants}
                          maxCapacity={schedule.maxCapacity}
                        />
                      </div>
                    );
                  })
                )}
              </div>

              {/* 업데이트 시간 표시 */}
              {realGeniusUpdateTime && (
                <div className="text-right mt-3 pr-3">
                  <span className="text-white/60 text-xs">
                    {realGeniusUpdateTime}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 게임오브데모데이 스케줄 박스 */}
          <div className="w-full mb-12">
            <div className="bg-white/5 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-4">
                🎮 게임오브소셜링 데모데이
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="rounded-lg p-4 mb-5">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-white font-bold text-lg">
                      가격:{" "}
                      <span className="text-[#8B5CF6]">플레이어 10,000원</span>
                    </p>
                    <p className="text-[#10B981] font-bold text-sm">
                      출품자 무료 ✨
                    </p>
                  </div>
                  <p className="text-white font-bold text-lg">
                    일요일 13:00~18:00{" "}
                    <span className="text-white">(5시간)</span>
                  </p>
                </div>

                <div className="text-center mt-3 p-2 bg-black/20 rounded-lg">
                  <p className="text-white/90 text-sm">
                    📍 쏘빅 스튜디오 (신논현역 5분 거리)
                  </p>
                  <p className="text-white/90 text-sm mt-1">정원: 최대 50명</p>
                </div>

                {/* 범례 */}
                <div className="flex flex-wrap gap-2 justify-end mt-6 mb-3">
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-white/20 bg-[#4A90E2]/20">
                    <div className="w-2 h-2 rounded-full bg-[#4A90E2]" />
                    <span className="text-white/90">참가자</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-white/20 bg-[#FF6B9F]/20">
                    <div className="w-2 h-2 rounded-full bg-[#FF6B9F]" />
                    <span className="text-white/90">제작자</span>
                  </div>
                </div>
              </div>

              {/* 일정 목록 */}
              <div className="space-y-2">
                {gameOfDemoLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-white/60 text-sm">
                      📅 스케줄 정보를 불러오는 중...
                    </div>
                  </div>
                ) : gameOfDemoData.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-white/60 text-sm">
                      📅 현재 예정된 스케줄이 없습니다
                    </div>
                  </div>
                ) : (
                  gameOfDemoData.map((schedule, index) => (
                    <div
                      key={index}
                      className="rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-[#F4F4F4] min-w-[80px]">
                            {schedule.date}
                          </span>
                          <span className="text-white font-bold flex-grow">
                            {schedule.title}
                          </span>
                        </div>
                        <span className="text-[#8B5CF6] font-bold text-sm">
                          {schedule.applicants.total}/{schedule.maxCapacity}명
                        </span>
                      </div>
                      <GameOfDemoApplicantChart
                        applicants={schedule.applicants}
                        maxCapacity={schedule.maxCapacity}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* 업데이트 시간 표시 */}
              {gameOfDemoUpdateTime && (
                <div className="text-right mt-3 pr-3">
                  <span className="text-white/60 text-xs">
                    {gameOfDemoUpdateTime}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 내부용 정보 */}
          <div className="w-full mt-12">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
              <h3 className="text-lg font-bold text-white mb-2">
                📋 내부 참고사항
              </h3>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• 이 페이지는 내부 관리용입니다</li>
                <li>• 실시간 스케줄 현황을 확인할 수 있습니다</li>
                <li>
                  • 각 브랜드별 가격정책과 시간대를 한눈에 비교할 수 있습니다
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
