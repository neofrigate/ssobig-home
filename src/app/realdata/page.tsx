"use client";

import React, { useState, useEffect } from "react";

interface LoveBuddiesScheduleItem {
  date: string;
  year: number;
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
  year: number;
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
  year: number;
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
  year: number;
  title: string;
  applicants: {
    total: number;
    participants: number;
    creators: number;
  };
  maxCapacity: number;
}

interface CalendarEvent {
  date: Date;
  type: 'loveBuddies' | 'nowSeoul' | 'realGenius' | 'gameOfDemo';
  title: string;
  applicants: {
    total?: number;
    female?: number;
    male?: number;
    participants?: number;
    creators?: number;
  };
  maxCapacity: number;
  color: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

export default function RealDataPage() {
  // 뷰 모드 상태 ('list' | 'calendar')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // 필터 상태
  const [filters, setFilters] = useState({
    loveBuddies: true,
    nowSeoul: true,
    realGenius: true,
    gameOfDemo: true
  });
  
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

  // 날짜 필터링 헬퍼 함수
  const isDateInRange = (date: Date) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    return date >= sevenDaysAgo;
  };

  // 캘린더 관련 함수들
  const getCalendarDays = (year: number, month: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendarDays: CalendarDay[] = [];
    
    // 이전 달의 날짜들
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        events: []
      });
    }
    
    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendarDays.push({
        date,
        isCurrentMonth: true,
        events: []
      });
    }
    
    // 다음 달의 날짜들 (6주 채우기)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        events: []
      });
    }
    
    return calendarDays;
  };

  // 모든 이벤트를 캘린더용 데이터로 변환
  const getAllEventsForCalendar = (): CalendarEvent[] => {
    const allEvents: CalendarEvent[] = [];
    
    // 러브버디즈 이벤트
    loveBuddiesData.forEach(schedule => {
      const dateMatch = schedule.date.match(/(\d+)\/(\d+)/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        allEvents.push({
          date: new Date(schedule.year, month, day),
          type: 'loveBuddies',
          title: schedule.title,
          applicants: schedule.applicants,
          maxCapacity: schedule.maxCapacity,
          color: '#FF69B4'
        });
      }
    });
    
    // 나우서울 이벤트
    nowSeoulData.forEach(schedule => {
      // 나우서울은 제목에서 날짜를 파싱해야 함
      const dateMatch = schedule.title.match(/(\d+)월\s*(\d+)일/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        const total = Object.values(schedule.applicants).reduce((sum, count) => sum + count, 0);
        allEvents.push({
          date: new Date(schedule.year, month, day),
          type: 'nowSeoul',
          title: schedule.title,
          applicants: { total },
          maxCapacity: schedule.maxCapacity,
          color: '#FFAC3A'
        });
      }
    });
    
    // 리얼지니어스 이벤트
    realGeniusData.forEach(schedule => {
      const dateMatch = schedule.date.match(/(\d+)\/(\d+)/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        allEvents.push({
          date: new Date(schedule.year, month, day),
          type: 'realGenius',
          title: schedule.title,
          applicants: schedule.applicants,
          maxCapacity: schedule.maxCapacity,
          color: '#9E4BED'
        });
      }
    });
    
    // 게임오브데모데이 이벤트
    gameOfDemoData.forEach(schedule => {
      const dateMatch = schedule.date.match(/(\d+)월\s*(\d+)일/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        allEvents.push({
          date: new Date(schedule.year, month, day),
          type: 'gameOfDemo',
          title: schedule.title,
          applicants: schedule.applicants,
          maxCapacity: schedule.maxCapacity,
          color: '#8B5CF6'
        });
      }
    });
    
    return allEvents;
  };

  // 현재 표시할 년월
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

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

        let currentYear = 2025;
        let lastMonth = 0;

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const title = cols[1]?.replace(/"/g, "").trim();
            const maxCapacity = parseInt(cols[3]) || 40;
            const total = parseInt(cols[4]) || 0;
            const female = parseInt(cols[5]) || 0;
            const male = parseInt(cols[6]) || 0;

            if (
              title &&
              title.includes("일일남매") &&
              title.length > 0
            ) {
              const dateMatch = title.match(/(\d+)\/(\d+)\s*\([^)]+\)/);
              if (dateMatch) {
                const month = parseInt(dateMatch[1]);
                const day = parseInt(dateMatch[2]);
                
                // 월이 이전보다 작아지면 연도가 바뀐 것으로 판단
                if (lastMonth > 0 && month < lastMonth) {
                  currentYear++;
                }
                lastMonth = month;
                
                const fullDate = new Date(currentYear, month - 1, day);
                
                // 날짜 필터링 적용
                if (isDateInRange(fullDate)) {
                  const dateStr = dateMatch[0];
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
                    year: currentYear,
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

        let currentYear = 2025;
        let lastMonth = 0;

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const title = cols[1]?.replace(/"/g, "").trim();
            const maxCapacity = parseInt(cols[3]) || 20;

            const planner = parseInt(cols[5]) || 0;
            const marketer = parseInt(cols[6]) || 0;
            const developer = parseInt(cols[7]) || 0;
            const designer = parseInt(cols[8]) || 0;
            const other = parseInt(cols[9]) || 0;

            if (title && title !== "선택 항목") {
              // 나우서울은 날짜 정보가 제한적이므로 제목에서 날짜 추출 시도
              const dateMatch = title.match(/(\d+)월\s*(\d+)일/);
              if (dateMatch) {
                const month = parseInt(dateMatch[1]);
                const day = parseInt(dateMatch[2]);
                
                // 월이 이전보다 작아지면 연도가 바뀐 것으로 판단
                if (lastMonth > 0 && month < lastMonth) {
                  currentYear++;
                }
                lastMonth = month;
                
                const fullDate = new Date(currentYear, month - 1, day);
                
                // 날짜 필터링 적용
                if (isDateInRange(fullDate)) {
                  const dayOfWeekMatch = title.match(/\(([^)]+)\)/);
                  const dateStr = dayOfWeekMatch ? dayOfWeekMatch[1] : "";

                  updatedSchedule.push({
                    date: dateStr,
                    year: currentYear,
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

        let currentYear = 2025;
        let lastMonth = 0;

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const title = cols[1]?.replace(/"/g, "").trim();
            const maxCapacity = parseInt(cols[3]) || 20;
            const total = parseInt(cols[4]) || 0;
            const female = parseInt(cols[5]) || 0;
            const male = parseInt(cols[6]) || 0;

            if (
              title &&
              title !== "선택 항목" &&
              title.length > 0
            ) {
              const dateMatch = title.match(/(\d+)\/(\d+)\s*\([^)]+\)/);
              if (dateMatch) {
                const month = parseInt(dateMatch[1]);
                const day = parseInt(dateMatch[2]);
                
                // 월이 이전보다 작아지면 연도가 바뀐 것으로 판단
                if (lastMonth > 0 && month < lastMonth) {
                  currentYear++;
                }
                lastMonth = month;
                
                const fullDate = new Date(currentYear, month - 1, day);
                
                // 날짜 필터링 적용
                if (isDateInRange(fullDate)) {
                  const dateStr = dateMatch[0];

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
                    year: currentYear,
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

        let currentYear = 2025;
        let lastMonth = 0;

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const title = cols[1]?.replace(/"/g, "").trim();
            const maxCapacity = parseInt(cols[3]) || 50;
            const total = parseInt(cols[4]) || 0;
            const participants = parseInt(cols[5]) || 0;
            const creators = parseInt(cols[6]) || 0;

            if (
              title &&
              title !== "선택 항목" &&
              title.length > 0
            ) {
              // 제목에서 날짜 추출 (예: [12회] 6월 28일 토요일 13시~18시)
              const dateMatch = title.match(/(\d+)월\s*(\d+)일/);
              if (dateMatch) {
                const month = parseInt(dateMatch[1]);
                const day = parseInt(dateMatch[2]);
                
                // 월이 이전보다 작아지면 연도가 바뀐 것으로 판단
                if (lastMonth > 0 && month < lastMonth) {
                  currentYear++;
                }
                lastMonth = month;
                
                const fullDate = new Date(currentYear, month - 1, day);
                
                // 날짜 필터링 적용
                if (isDateInRange(fullDate)) {
                  const dateMatchFull = title.match(/(\d+월\s*\d+일\s*[^0-9]*)/);
                  const dateStr = dateMatchFull ? dateMatchFull[1].trim() : "";

                  updatedSchedule.push({
                    date: dateStr,
                    year: currentYear,
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

    return (
      <div className="px-3 py-2 bg-black/30 rounded-none">
        {/* 누적 바 차트 */}
        <div className="flex h-2 bg-white/10 rounded-full overflow-hidden">
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
              className="transition-all duration-700 ease-out bg-[#7343F8]"
              style={{ width: `${participantsPercentage}%` }}
              title={`참가자: ${applicants.participants}명`}
            />
          )}
          {applicants.creators > 0 && (
            <div
              className="transition-all duration-700 ease-out bg-[#2BAE6C]"
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
          <p className="text-white/80 text-lg mb-6">
            전체 브랜드 스케줄 현황 (내부용)
          </p>
          
          {/* 뷰 모드 토글 */}
          <div className="flex justify-center">
            <div className="bg-white/10 rounded-full p-1 flex gap-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-full transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-black font-semibold'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                📋 리스트 뷰
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-full transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-white text-black font-semibold'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                📅 캘린더 뷰
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          // 캘린더 뷰
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 rounded-xl p-6 shadow-lg">
              {/* 필터 체크박스 */}
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.loveBuddies}
                    onChange={(e) => setFilters({...filters, loveBuddies: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FF69B4' }}></div>
                    <span className="text-white">러브버디즈</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.nowSeoul}
                    onChange={(e) => setFilters({...filters, nowSeoul: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFAC3A' }}></div>
                    <span className="text-white">나우서울</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.realGenius}
                    onChange={(e) => setFilters({...filters, realGenius: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9E4BED' }}></div>
                    <span className="text-white">소셜지니어스</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.gameOfDemo}
                    onChange={(e) => setFilters({...filters, gameOfDemo: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8B5CF6' }}></div>
                    <span className="text-white">게임오브데모데이</span>
                  </div>
                </label>
              </div>

              {/* 캘린더 헤더 */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  ◀
                </button>
                <h2 className="text-2xl font-bold text-white">
                  {currentYear}년 {currentMonth + 1}월
                </h2>
                <button
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  ▶
                </button>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                  <div key={day} className="text-center text-white/60 text-sm font-semibold py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 그리드 */}
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const calendarDays = getCalendarDays(currentYear, currentMonth);
                  const allEvents = getAllEventsForCalendar();
                  
                  // 필터링된 이벤트만 표시
                  const filteredEvents = allEvents.filter(event => {
                    if (event.type === 'loveBuddies' && !filters.loveBuddies) return false;
                    if (event.type === 'nowSeoul' && !filters.nowSeoul) return false;
                    if (event.type === 'realGenius' && !filters.realGenius) return false;
                    if (event.type === 'gameOfDemo' && !filters.gameOfDemo) return false;
                    return true;
                  });
                  
                  // 각 날짜에 이벤트 매핑
                  calendarDays.forEach(day => {
                    day.events = filteredEvents.filter(event => 
                      event.date.getFullYear() === day.date.getFullYear() &&
                      event.date.getMonth() === day.date.getMonth() &&
                      event.date.getDate() === day.date.getDate()
                    );
                  });
                  
                  return calendarDays.map((day, index) => {
                    const isToday = 
                      day.date.toDateString() === new Date().toDateString();
                    const isInRange = isDateInRange(day.date);
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[150px] p-2 rounded-lg border transition-all ${
                          day.isCurrentMonth
                            ? isToday
                              ? 'bg-white/20 border-white'
                              : 'bg-black/30 border-white/10 hover:bg-black/50'
                            : 'bg-black/10 border-white/5'
                        } ${!isInRange && 'opacity-30'}`}
                      >
                        <div className={`text-sm font-semibold mb-2 ${
                          day.isCurrentMonth ? 'text-white' : 'text-white/40'
                        } ${isToday && 'text-yellow-400'}`}>
                          {day.date.getDate()}
                        </div>
                        
                        {/* 이벤트 표시 */}
                        <div className="space-y-1.5">
                          {day.events.map((event, eventIndex) => {
                            const getApplicantInfo = () => {
                              if (event.applicants.female !== undefined && event.applicants.male !== undefined) {
                                return `여${event.applicants.female} 남${event.applicants.male}`;
                              } else if (event.applicants.participants !== undefined && event.applicants.creators !== undefined) {
                                return `참${event.applicants.participants} 제${event.applicants.creators}`;
                              } else if (event.applicants.total !== undefined) {
                                return `총${event.applicants.total}명`;
                              }
                              return '';
                            };
                            
                            return (
                              <div
                                key={eventIndex}
                                className="text-xs p-1.5 rounded"
                                style={{ backgroundColor: event.color + '30', borderLeft: `3px solid ${event.color}` }}
                              >
                                <div className="font-medium text-white leading-relaxed">
                                  {event.title}
                                </div>
                                <div className="text-white/70 text-[10px] mt-0.5">
                                  {getApplicantInfo()} / {event.maxCapacity}명
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

            </div>
          </div>
        ) : (
          // 리스트 뷰
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
                          <span className="font-medium text-[#F4F4F4] min-w-[100px] text-sm">
                            {schedule.year} {schedule.date}
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
            <div className="bg-white/5 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-4">
                나우서울 밋업 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="bg-black/70 rounded-lg p-4 mb-5">
                <div className="flex flex-col space-y-4">
                  <div>
                    <div className="flex items-center flex-wrap">
                      <span className="text-white font-bold text-lg mr-2">
                        가격:
                      </span>
                      <span className="line-through text-gray-400 text-lg mr-2">
                        35,000원
                      </span>
                      <span className="text-[#FFAC3A] font-bold text-xl">
                        25,000원
                      </span>
                      <span className="bg-[#FFAC3A] text-black px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                        할인
                      </span>
                    </div>
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
              <div className="space-y-6">
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
                        className="rounded-none bg-black/50 hover:bg-black/80 transition-colors"
                      >
                        <div className="flex items-center justify-between px-3 pt-3 pb-1">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-[#F4F4F4] min-w-[110px]">
                              {schedule.year} {schedule.date} (목)
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
                <div className="text-right mt-3 pr-6 pb-3">
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
                            <span className="font-medium text-[#F4F4F4] min-w-[100px]">
                              {schedule.year} {schedule.date}
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
                      <span className="text-[#8B5CF6]">플레이어 20,000원</span>
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

                {/* 범례 */}
                <div className="flex flex-wrap gap-2 justify-end mt-6 mb-3">
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-white/20 bg-[#7343F8]/20">
                    <div className="w-2 h-2 rounded-full bg-[#7343F8]" />
                    <span className="text-white/90">참가자</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-white/20 bg-[#2BAE6C]/20">
                    <div className="w-2 h-2 rounded-full bg-[#2BAE6C]" />
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
                          <span className="font-medium text-[#F4F4F4] min-w-[120px]">
                            {schedule.year}년 {schedule.date}
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
        )}
      </div>
    </div>
  );
}
