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
  host?: string; // 진행자
  staff?: string; // 스태프
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
  host?: string; // 진행자
  staff?: string; // 스태프
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
  type: "loveBuddies" | "nowSeoul" | "realGenius" | "gameOfDemo";
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
  host?: string; // 진행자
  staff?: string; // 스태프
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

export default function RealDataPage() {
  // 뷰 모드 상태 ('list' | 'calendar')
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");

  // 필터 상태
  const [filters, setFilters] = useState({
    loveBuddies: true,
    nowSeoul: true,
    realGenius: true,
    gameOfDemo: true,
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
    let startingDayOfWeek = firstDay.getDay();

    // 월요일 시작인 경우 요일 계산 조정 (일요일=0을 월요일=0으로 변경)
    if (startWithMonday) {
      startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    }

    const calendarDays: CalendarDay[] = [];

    // 이전 달의 날짜들
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        events: [],
      });
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendarDays.push({
        date,
        isCurrentMonth: true,
        events: [],
      });
    }

    // 다음 달의 날짜들 (6주 채우기)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        events: [],
      });
    }

    return calendarDays;
  };

  // 모든 이벤트를 캘린더용 데이터로 변환
  const getAllEventsForCalendar = (): CalendarEvent[] => {
    const allEvents: CalendarEvent[] = [];

    // 러브버디즈 이벤트
    loveBuddiesData.forEach((schedule) => {
      // 새로운 날짜 형식: "7/19 (토) 15:00"
      const dateMatch = schedule.date.match(/(\d+)\/(\d+)\s*\([^)]+\)/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        allEvents.push({
          date: new Date(schedule.year, month, day),
          type: "loveBuddies",
          title: schedule.title,
          applicants: schedule.applicants,
          maxCapacity: schedule.maxCapacity,
          color: "#FF69B4",
          host: schedule.host,
          staff: schedule.staff,
        });
      }
    });

    // 나우서울 이벤트
    nowSeoulData.forEach((schedule) => {
      // 나우서울은 date 필드에서 날짜를 파싱 (예: "12월 25일")
      const dateMatch = schedule.date.match(/(\d+)월\s*(\d+)일/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        const total = Object.values(schedule.applicants).reduce(
          (sum, count) => sum + count,
          0
        );
        allEvents.push({
          date: new Date(schedule.year, month, day),
          type: "nowSeoul",
          title: schedule.title,
          applicants: { total },
          maxCapacity: schedule.maxCapacity,
          color: "#FFAC3A",
        });
      }
    });

    // 리얼지니어스 이벤트
    realGeniusData.forEach((schedule) => {
      // 새로운 날짜 형식: "7/20 (일) 13:00"
      const dateMatch = schedule.date.match(/(\d+)\/(\d+)\s*\([^)]+\)/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        allEvents.push({
          date: new Date(schedule.year, month, day),
          type: "realGenius",
          title: schedule.title,
          applicants: schedule.applicants,
          maxCapacity: schedule.maxCapacity,
          color: "#9E4BED",
          host: schedule.host,
          staff: schedule.staff,
        });
      }
    });

    // 게임오브데모데이 이벤트
    gameOfDemoData.forEach((schedule) => {
      const dateMatch = schedule.date.match(/(\d+)월\s*(\d+)일/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        allEvents.push({
          date: new Date(schedule.year, month, day),
          type: "gameOfDemo",
          title: schedule.title,
          applicants: schedule.applicants,
          maxCapacity: schedule.maxCapacity,
          color: "#8B5CF6",
        });
      }
    });

    return allEvents;
  };

  // 현재 표시할 년월
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // 선택된 날짜와 모달 상태
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);

  // 캘린더 주 시작 설정 (true: 월요일 시작, false: 일요일 시작)
  const [startWithMonday, setStartWithMonday] = useState(false);

  // 통합 스프레드시트에서 러브버디즈 데이터 가져오기
  useEffect(() => {
    const fetchLoveBuddiesData = async () => {
      console.log("🔄 러브버디즈 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1zJIZf18VQxf1oeC6iwYoARVfT9S345RdjgI4dGDwoS4";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1029086244`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const allRows = csvText.split("\n");
        const headerRow = allRows[1]; // 2번째 줄이 실제 헤더
        const headers = headerRow
          .split(",")
          .map((h) => h.replace(/"/g, "").trim());
        const rows = allRows.slice(2); // 헤더 2줄 스킵
        const updatedSchedule: LoveBuddiesScheduleItem[] = [];

        console.log("📊 CSV 헤더 정보:", headers);
        console.log(
          "📊 각 컬럼별 제목:",
          headers.map((header, index) => `${index}: ${header}`)
        );
        console.log("🔍 CSV 데이터 로드됨:", {
          totalRows: rows.length,
          firstFewRows: rows.slice(0, 3),
        });

        // 헤더를 기준으로 컬럼 인덱스 찾기
        const getColumnIndex = (columnName: string) =>
          headers.findIndex((h) => h === columnName);

        const brandPageIndex = getColumnIndex("판매 페이지");
        const dateInfoIndex = getColumnIndex("모임일시");
        const contentNameIndex = getColumnIndex("컨텐츠");
        const femaleIndex = getColumnIndex("여자");
        const maleIndex = getColumnIndex("남자");
        const totalIndex = getColumnIndex("총합");
        const hostIndex = getColumnIndex("진행자");
        const staffIndex = getColumnIndex("스태프");

        console.log("📊 러브버디즈 컬럼 매핑:", {
          brandPageIndex,
          dateInfoIndex,
          contentNameIndex,
          femaleIndex,
          maleIndex,
          totalIndex,
          hostIndex,
          staffIndex,
        });

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const brandPage = cols[brandPageIndex]?.replace(/"/g, "").trim(); // 판매 페이지
            const dateInfo = cols[dateInfoIndex]?.replace(/"/g, "").trim(); // 모임일시
            const contentName = cols[contentNameIndex]
              ?.replace(/"/g, "")
              .trim(); // 컨텐츠
            const female = parseInt(cols[femaleIndex]) || 0; // 여자
            const male = parseInt(cols[maleIndex]) || 0; // 남자
            const total = parseInt(cols[totalIndex]) || 0; // 총합
            const host = cols[hostIndex]?.replace(/"/g, "").trim() || ""; // 진행자
            const staff = cols[staffIndex]?.replace(/"/g, "").trim() || ""; // 스태프

            // love buddies 브랜드인 모든 데이터 처리
            if (
              brandPage === "love buddies" &&
              dateInfo &&
              contentName &&
              dateInfo.length > 0
            ) {
              console.log("💕 러브버디즈 데이터:", {
                brandPage,
                dateInfo,
                contentName,
                female,
                male,
                total,
                host,
                staff,
              });
              // 날짜 파싱 (예: "7/19 (토) 15:00")
              const dateMatch = dateInfo.match(/(\d+)\/(\d+)\s*\([^)]+\)/);
              if (dateMatch) {
                // 현재는 모든 데이터를 2025년으로 처리 (캘린더와 맞춤)
                const year = 2025;

                const dateStr = dateInfo;

                // 시간 추출
                const timeMatch = dateInfo.match(/(\d+:\d+)/);
                const timeStr = timeMatch ? timeMatch[1] : "";

                const cleanTitle = timeStr
                  ? `${timeStr} ${contentName}`
                  : contentName;

                updatedSchedule.push({
                  date: dateStr,
                  year,
                  title: cleanTitle,
                  applicants: {
                    total,
                    female,
                    male,
                  },
                  maxCapacity: 40, // 러브버디즈 기본 정원
                  host,
                  staff,
                });
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
                  // 날짜 문자열 형식 맞추기 (예: "12월 25일")
                  const dateStr = `${month}월 ${day}일`;

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

  // 통합 스프레드시트에서 리얼지니어스(소셜지니어스) 데이터 가져오기
  useEffect(() => {
    const fetchRealGeniusData = async () => {
      console.log("🔄 리얼지니어스 Google Sheets 데이터 가져오기 시작...");
      try {
        const SHEET_ID = "1zJIZf18VQxf1oeC6iwYoARVfT9S345RdjgI4dGDwoS4";
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1029086244`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const allRows = csvText.split("\n");
        const headerRow = allRows[1]; // 2번째 줄이 실제 헤더
        const headers = headerRow
          .split(",")
          .map((h) => h.replace(/"/g, "").trim());
        const rows = allRows.slice(2); // 헤더 2줄 스킵
        const updatedSchedule: RealGeniusScheduleItem[] = [];

        console.log("🧠 소셜지니어스 CSV 헤더 정보:", headers);
        console.log(
          "🧠 각 컬럼별 제목:",
          headers.map((header, index) => `${index}: ${header}`)
        );

        // 헤더를 기준으로 컬럼 인덱스 찾기
        const getColumnIndex = (columnName: string) =>
          headers.findIndex((h) => h === columnName);

        const brandPageIndex = getColumnIndex("판매 페이지");
        const dateInfoIndex = getColumnIndex("모임일시");
        const contentNameIndex = getColumnIndex("컨텐츠");
        const femaleIndex = getColumnIndex("여자");
        const maleIndex = getColumnIndex("남자");
        const totalIndex = getColumnIndex("총합");
        const hostIndex = getColumnIndex("진행자");
        const staffIndex = getColumnIndex("스태프");

        console.log("🧠 소셜지니어스 컬럼 매핑:", {
          brandPageIndex,
          dateInfoIndex,
          contentNameIndex,
          femaleIndex,
          maleIndex,
          totalIndex,
          hostIndex,
          staffIndex,
        });

        rows.forEach((row) => {
          if (row.trim()) {
            const cols = row.split(",");
            const brandPage = cols[brandPageIndex]?.replace(/"/g, "").trim(); // 판매 페이지
            const dateInfo = cols[dateInfoIndex]?.replace(/"/g, "").trim(); // 모임일시
            const contentName = cols[contentNameIndex]
              ?.replace(/"/g, "")
              .trim(); // 컨텐츠
            const female = parseInt(cols[femaleIndex]) || 0; // 여자
            const male = parseInt(cols[maleIndex]) || 0; // 남자
            const total = parseInt(cols[totalIndex]) || 0; // 총합
            const host = cols[hostIndex]?.replace(/"/g, "").trim() || ""; // 진행자
            const staff = cols[staffIndex]?.replace(/"/g, "").trim() || ""; // 스태프

            // social genius 브랜드인 모든 데이터 처리
            if (
              brandPage === "social genius" &&
              dateInfo &&
              contentName &&
              dateInfo.length > 0
            ) {
              console.log("🧠 소셜지니어스 데이터:", {
                brandPage,
                dateInfo,
                contentName,
                female,
                male,
                total,
                host,
                staff,
              });
              // 날짜 파싱 (예: "7/20 (일) 13:00")
              const dateMatch = dateInfo.match(/(\d+)\/(\d+)\s*\([^)]+\)/);
              if (dateMatch) {
                // 현재는 모든 데이터를 2025년으로 처리 (캘린더와 맞춤)
                const year = 2025;

                const dateStr = dateInfo;

                // 시간 추출
                const timeMatch = dateInfo.match(/(\d+:\d+)/);
                const timeStr = timeMatch ? timeMatch[1] : "";

                const gameName = timeStr
                  ? `${timeStr} ${contentName}`
                  : contentName;

                // 난이도 설정
                let difficulty = "EASY";
                if (
                  contentName.includes("바이너리") ||
                  contentName.includes("이중스파이")
                ) {
                  difficulty = "MID";
                } else if (contentName.includes("??????")) {
                  difficulty = "HARD";
                }

                updatedSchedule.push({
                  date: dateStr,
                  year,
                  title: gameName,
                  difficulty,
                  applicants: {
                    total,
                    female,
                    male,
                  },
                  maxCapacity: 20, // 소셜지니어스 기본 정원
                  host,
                  staff,
                });
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

            if (title && title !== "선택 항목" && title.length > 0) {
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
                  const dateMatchFull = title.match(
                    /(\d+월\s*\d+일\s*[^0-9]*)/
                  );
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
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-full transition-all ${
                  viewMode === "list"
                    ? "bg-white text-black font-semibold"
                    : "text-white hover:bg-white/10"
                }`}
              >
                📋 리스트 뷰
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 rounded-full transition-all ${
                  viewMode === "calendar"
                    ? "bg-white text-black font-semibold"
                    : "text-white hover:bg-white/10"
                }`}
              >
                📅 캘린더 뷰
              </button>
            </div>
          </div>
        </div>

        {viewMode === "calendar" ? (
          // 캘린더 뷰
          <div className="max-w-7xl mx-auto px-2 md:px-0">
            <div className="bg-white/5 rounded-xl p-3 md:p-6 shadow-lg">
              {/* 필터 체크박스 */}
              <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-4 md:mb-6">
                <label className="flex items-center gap-1 md:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.loveBuddies}
                    onChange={(e) =>
                      setFilters({ ...filters, loveBuddies: e.target.checked })
                    }
                    className="w-3 h-3 md:w-4 md:h-4 rounded"
                  />
                  <div className="flex items-center gap-1 md:gap-2">
                    <div
                      className="w-3 h-3 md:w-4 md:h-4 rounded"
                      style={{ backgroundColor: "#FF69B4" }}
                    ></div>
                    <span className="text-xs md:text-base text-white">
                      러브버디즈
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-1 md:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.nowSeoul}
                    onChange={(e) =>
                      setFilters({ ...filters, nowSeoul: e.target.checked })
                    }
                    className="w-3 h-3 md:w-4 md:h-4 rounded"
                  />
                  <div className="flex items-center gap-1 md:gap-2">
                    <div
                      className="w-3 h-3 md:w-4 md:h-4 rounded"
                      style={{ backgroundColor: "#FFAC3A" }}
                    ></div>
                    <span className="text-xs md:text-base text-white">
                      나우서울
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-1 md:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.realGenius}
                    onChange={(e) =>
                      setFilters({ ...filters, realGenius: e.target.checked })
                    }
                    className="w-3 h-3 md:w-4 md:h-4 rounded"
                  />
                  <div className="flex items-center gap-1 md:gap-2">
                    <div
                      className="w-3 h-3 md:w-4 md:h-4 rounded"
                      style={{ backgroundColor: "#9E4BED" }}
                    ></div>
                    <span className="text-xs md:text-base text-white">
                      소셜지니어스
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-1 md:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.gameOfDemo}
                    onChange={(e) =>
                      setFilters({ ...filters, gameOfDemo: e.target.checked })
                    }
                    className="w-3 h-3 md:w-4 md:h-4 rounded"
                  />
                  <div className="flex items-center gap-1 md:gap-2">
                    <div
                      className="w-3 h-3 md:w-4 md:h-4 rounded"
                      style={{ backgroundColor: "#8B5CF6" }}
                    ></div>
                    <span className="text-xs md:text-base text-white">
                      게임오브데모데이
                    </span>
                  </div>
                </label>
              </div>

              {/* 캘린더 헤더 */}
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <button
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                  className="text-white hover:bg-white/10 p-1 md:p-2 rounded-lg transition-colors"
                >
                  ◀
                </button>
                <h2 className="text-lg md:text-2xl font-bold text-white">
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
                  className="text-white hover:bg-white/10 p-1 md:p-2 rounded-lg transition-colors"
                >
                  ▶
                </button>
              </div>

              {/* 주 시작 토글 */}
              <div className="flex justify-center mb-4">
                <div className="bg-white/10 rounded-full p-1 flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full transition-all ${
                      !startWithMonday
                        ? "bg-white text-black font-semibold"
                        : "text-white"
                    }`}
                  >
                    일부터
                  </span>
                  <button
                    onClick={() => setStartWithMonday(!startWithMonday)}
                    className="relative w-10 h-5 bg-white/20 rounded-full transition-colors duration-200 focus:outline-none"
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        startWithMonday ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-xs px-2 py-1 rounded-full transition-all ${
                      startWithMonday
                        ? "bg-white text-black font-semibold"
                        : "text-white"
                    }`}
                  >
                    월부터
                  </span>
                </div>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {(startWithMonday
                  ? ["월", "화", "수", "목", "금", "토", "일"]
                  : ["일", "월", "화", "수", "목", "금", "토"]
                ).map((day) => (
                  <div
                    key={day}
                    className={`text-center text-xs md:text-sm font-semibold py-1 md:py-2 ${
                      day === "일" ? "text-red-400" : "text-white/60"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 그리드 */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {(() => {
                  const calendarDays = getCalendarDays(
                    currentYear,
                    currentMonth
                  );
                  const allEvents = getAllEventsForCalendar();

                  // 필터링된 이벤트만 표시
                  const filteredEvents = allEvents.filter((event) => {
                    if (event.type === "loveBuddies" && !filters.loveBuddies)
                      return false;
                    if (event.type === "nowSeoul" && !filters.nowSeoul)
                      return false;
                    if (event.type === "realGenius" && !filters.realGenius)
                      return false;
                    if (event.type === "gameOfDemo" && !filters.gameOfDemo)
                      return false;
                    return true;
                  });

                  // 각 날짜에 이벤트 매핑
                  calendarDays.forEach((day) => {
                    day.events = filteredEvents.filter(
                      (event) =>
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
                        onClick={() => {
                          if (day.events.length > 0) {
                            setSelectedDate(day.date);
                            setSelectedEvents(day.events);
                          }
                        }}
                        className={`min-h-[80px] md:min-h-[150px] p-1 md:p-2 rounded-lg border transition-all overflow-hidden ${
                          day.events.length > 0 ? "cursor-pointer" : ""
                        } ${
                          day.isCurrentMonth
                            ? isToday
                              ? "bg-white/1 border-white"
                              : "bg-black/30 border-white/10 hover:bg-black/50"
                            : "bg-black/10 border-white/5"
                        } ${!isInRange && "opacity-30"}`}
                      >
                        <div
                          className={`text-xs md:text-sm font-semibold mb-1 md:mb-2 ${
                            isToday
                              ? "text-yellow-400"
                              : day.date.getDay() === 0
                              ? "text-red-400"
                              : day.isCurrentMonth
                              ? "text-white"
                              : "text-white/40"
                          }`}
                        >
                          {day.date.getDate()}
                        </div>

                        {/* 이벤트 표시 - 모바일에서는 간략하게 */}
                        <div className="space-y-0.5 md:space-y-1.5">
                          {/* 모바일: 점으로 표시, 데스크톱: 전체 표시 */}
                          <div className="md:hidden flex flex-wrap gap-1">
                            {day.events.map((event, eventIndex) => {
                              const getTooltipText = () => {
                                let tooltip = event.title;
                                if (event.host || event.staff) {
                                  tooltip += "\n";
                                  if (event.host)
                                    tooltip += `👑 진행자: ${event.host}`;
                                  if (event.host && event.staff)
                                    tooltip += " | ";
                                  if (event.staff)
                                    tooltip += `🛠️ 스태프: ${event.staff}`;
                                }
                                return tooltip;
                              };

                              return (
                                <div
                                  key={eventIndex}
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: event.color }}
                                  title={getTooltipText()}
                                />
                              );
                            })}
                          </div>

                          {/* 데스크톱 뷰 */}
                          <div className="hidden md:block space-y-1.5">
                            {day.events.map((event, eventIndex) => {
                              return (
                                <div
                                  key={eventIndex}
                                  className="text-xs p-1.5 rounded"
                                  style={{
                                    backgroundColor: event.color + "30",
                                    borderLeft: `3px solid ${event.color}`,
                                  }}
                                >
                                  <div className="font-medium text-white leading-relaxed">
                                    {event.title}
                                  </div>

                                  {/* 진행자 & 스태프 정보 (한 줄) */}
                                  {(event.host || event.staff) && (
                                    <div className="text-white/50 text-[9px] mt-0.5 leading-tight">
                                      {event.host && (
                                        <span className="mr-1">
                                          👑{event.host}
                                        </span>
                                      )}
                                      {event.staff && (
                                        <span>🛠️{event.staff}</span>
                                      )}
                                    </div>
                                  )}

                                  {/* 남녀 참가자 그래프 */}
                                  {event.applicants.female !== undefined &&
                                    event.applicants.male !== undefined && (
                                      <div className="mt-1 space-y-px">
                                        {/* 여자 참가자 바 */}
                                        <div className="flex items-center gap-1">
                                          <div className="flex-1 bg-white/10 h-1 rounded-sm overflow-hidden">
                                            <div
                                              className="h-full bg-pink-400 transition-all duration-300"
                                              style={{
                                                width: `${Math.min(
                                                  100,
                                                  (event.applicants.female /
                                                    20) *
                                                    100
                                                )}%`,
                                              }}
                                            />
                                          </div>
                                          <span className="text-[8px] text-pink-300 w-3 text-right">
                                            {event.applicants.female}
                                          </span>
                                        </div>

                                        {/* 남자 참가자 바 */}
                                        <div className="flex items-center gap-1">
                                          <div className="flex-1 bg-white/10 h-1 rounded-sm overflow-hidden">
                                            <div
                                              className="h-full bg-blue-400 transition-all duration-300"
                                              style={{
                                                width: `${Math.min(
                                                  100,
                                                  (event.applicants.male / 20) *
                                                    100
                                                )}%`,
                                              }}
                                            />
                                          </div>
                                          <span className="text-[8px] text-blue-300 w-3 text-right">
                                            {event.applicants.male}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* 날짜 상세 정보 모달 */}
              {selectedDate && selectedEvents.length > 0 && (
                <div
                  className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedDate(null)}
                >
                  <div
                    className="bg-black/95 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">
                        {selectedDate.getFullYear()}년{" "}
                        {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}
                        일 스케줄
                      </h3>
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="text-white/60 hover:text-white text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-4">
                      {selectedEvents.map((event, index) => {
                        const getBrandName = () => {
                          switch (event.type) {
                            case "loveBuddies":
                              return "러브버디즈";
                            case "nowSeoul":
                              return "나우서울";
                            case "realGenius":
                              return "소셜지니어스";
                            case "gameOfDemo":
                              return "게임오브데모데이";
                            default:
                              return "";
                          }
                        };

                        const getDetailedInfo = () => {
                          if (
                            event.applicants.female !== undefined &&
                            event.applicants.male !== undefined
                          ) {
                            return (
                              <div className="flex gap-4 text-sm">
                                <span className="text-pink-400">
                                  여성: {event.applicants.female}명
                                </span>
                                <span className="text-blue-400">
                                  남성: {event.applicants.male}명
                                </span>
                                <span className="text-white/60">
                                  총{" "}
                                  {event.applicants.female +
                                    event.applicants.male}
                                  /{event.maxCapacity}명
                                </span>
                              </div>
                            );
                          } else if (
                            event.applicants.participants !== undefined &&
                            event.applicants.creators !== undefined
                          ) {
                            return (
                              <div className="flex gap-4 text-sm">
                                <span className="text-purple-400">
                                  참가자: {event.applicants.participants}명
                                </span>
                                <span className="text-green-400">
                                  제작자: {event.applicants.creators}명
                                </span>
                                <span className="text-white/60">
                                  총{" "}
                                  {event.applicants.participants +
                                    event.applicants.creators}
                                  /{event.maxCapacity}명
                                </span>
                              </div>
                            );
                          } else if (event.applicants.total !== undefined) {
                            return (
                              <div className="text-sm">
                                <span className="text-white/60">
                                  총 {event.applicants.total}/
                                  {event.maxCapacity}명
                                </span>
                              </div>
                            );
                          }
                          return null;
                        };

                        return (
                          <div
                            key={index}
                            className="bg-white/5 rounded-lg p-4 border-l-4"
                            style={{ borderColor: event.color }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: event.color }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: event.color }}
                              >
                                {getBrandName()}
                              </span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">
                              {event.title}
                            </h4>
                            {getDetailedInfo()}

                            {/* 진행자 & 스태프 정보 */}
                            {(event.host || event.staff) && (
                              <div className="mt-3 p-2 bg-white/5 rounded text-sm">
                                <div className="flex flex-wrap gap-4">
                                  {event.host && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-yellow-400">
                                        👑 진행자:
                                      </span>
                                      <span className="text-white">
                                        {event.host}
                                      </span>
                                    </div>
                                  )}
                                  {event.staff && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-blue-400">
                                        🛠️ 스태프:
                                      </span>
                                      <span className="text-white">
                                        {event.staff}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* 참가율 표시 */}
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-white/60 mb-1">
                                <span>참가율</span>
                                <span>
                                  {Math.round(
                                    ((event.applicants.total ||
                                      (event.applicants.female ?? 0) +
                                        (event.applicants.male ?? 0) ||
                                      (event.applicants.participants ?? 0) +
                                        (event.applicants.creators ?? 0) ||
                                      0) /
                                      event.maxCapacity) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      ((event.applicants.total ||
                                        (event.applicants.female ?? 0) +
                                          (event.applicants.male ?? 0) ||
                                        (event.applicants.participants ?? 0) +
                                          (event.applicants.creators ?? 0) ||
                                        0) /
                                        event.maxCapacity) *
                                        100
                                    )}%`,
                                    backgroundColor: event.color,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // 리스트 뷰
          <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-2 md:px-4">
            {/* 러브버디즈 스케줄 박스 */}
            <div className="w-full">
              <div className="bg-white/5 p-3 md:p-4 shadow-lg rounded-xl">
                <h2 className="text-lg md:text-xl font-bold text-center text-white mb-3">
                  💕 러브버디즈 스케줄
                </h2>

                {/* 가격 및 시간 정보 */}
                <div className="rounded-lg p-2 md:p-3 mb-3 md:mb-4">
                  <div className="flex flex-col gap-2 text-sm md:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">
                        가격: <span className="text-[#FF6B9F]">35,000원</span>
                      </span>
                      <span className="text-white font-bold">3시간</span>
                    </div>
                  </div>

                  {/* 범례 */}
                  <div className="flex gap-2 justify-center mt-2 md:mt-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full text-xs border border-white/20 bg-[#FF69B4]/20">
                      <div className="w-2 h-2 rounded-full bg-[#FF69B4]" />
                      <span className="text-white/90">여자</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full text-xs border border-white/20 bg-[#4A90E2]/20">
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-2 md:px-3 py-2">
                          <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
                            <span className="font-medium text-[#F4F4F4] text-xs md:text-sm md:min-w-[100px]">
                              {schedule.year} {schedule.date}
                            </span>
                            <span className="text-white font-bold text-sm md:text-sm mt-1 md:mt-0">
                              {schedule.title}
                            </span>
                          </div>
                          <span className="text-[#FF6B9F] font-bold text-xs mt-1 md:mt-0">
                            {schedule.applicants.total}/{schedule.maxCapacity}명
                          </span>
                        </div>
                        <div className="px-2 md:px-3 pb-2">
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
            <div className="w-full">
              <div className="bg-white/5 rounded-xl p-3 md:p-6 shadow-lg">
                <h2 className="text-lg md:text-2xl font-bold text-center text-white mb-3 md:mb-4">
                  나우서울 밋업 스케줄
                </h2>

                {/* 가격 및 시간 정보 */}
                <div className="bg-black/70 rounded-lg p-3 md:p-4 mb-3 md:mb-5">
                  <div className="flex flex-col gap-2 md:gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm md:text-lg">
                          가격:
                        </span>
                        <span className="line-through text-gray-400 text-sm md:text-lg">
                          35,000원
                        </span>
                        <span className="text-[#FFAC3A] font-bold text-base md:text-xl">
                          25,000원
                        </span>
                      </div>
                      <span className="bg-[#FFAC3A] text-black px-2 py-0.5 rounded-full text-xs font-bold">
                        할인
                      </span>
                    </div>
                    <div className="text-white font-bold text-sm md:text-lg">
                      목요일 19:30~22:00
                      <span className="text-white"> (2.5시간)</span>
                    </div>
                  </div>

                  {/* 태그 형태 범례 */}
                  <div className="flex flex-wrap gap-1 md:gap-2 justify-center mt-3 md:mt-6 mb-2 md:mb-3">
                    {Object.entries(jobLabels).map(([job, label]) => (
                      <div
                        key={job}
                        className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs border border-white/20"
                        style={{
                          backgroundColor: `${
                            jobColors[job as keyof typeof jobColors]
                          }20`,
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
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
                <div className="space-y-3 md:space-y-6">
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
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between px-2 md:px-3 pt-2 md:pt-3 pb-1">
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                              <span className="font-medium text-[#F4F4F4] text-xs md:text-base md:min-w-[110px]">
                                {schedule.year} {schedule.date}
                              </span>
                              <span className="text-white font-bold text-sm md:text-base mt-1 md:mt-0">
                                {schedule.title}
                              </span>
                            </div>
                            <span className="text-[#FFAC3A] font-bold text-xs md:text-sm mt-1 md:mt-0">
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
            <div className="w-full">
              <div className="bg-white/5 rounded-xl p-3 md:p-6 shadow-lg">
                <h2 className="text-lg md:text-2xl font-bold text-center text-white mb-3 md:mb-4">
                  소셜지니어스 스케줄
                </h2>

                {/* 가격 및 시간 정보 */}
                <div className="rounded-lg p-2 md:p-4 mb-3 md:mb-5">
                  <div className="flex flex-col gap-2 text-sm md:text-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">
                        가격: <span className="text-[#9E4BED]">28,000원</span>
                      </span>
                      <span className="text-white font-bold">3시간</span>
                    </div>
                    <p className="text-white/80 text-xs md:text-base">
                      일요일 17:00~20:00
                    </p>
                  </div>

                  {/* 범례 */}
                  <div className="flex gap-2 justify-center mt-2 md:mt-6 mb-2 md:mb-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full text-xs border border-white/20 bg-[#FF69B4]/20">
                      <div className="w-2 h-2 rounded-full bg-[#FF69B4]" />
                      <span className="text-white/90">여자</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full text-xs border border-white/20 bg-[#4A90E2]/20">
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

                      return (
                        <div
                          key={index}
                          className="rounded-lg hover:bg-black/30 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-2 md:p-3">
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                              <span className="font-medium text-[#F4F4F4] text-xs md:text-base md:min-w-[100px]">
                                {schedule.year} {schedule.date}
                              </span>
                              <div className="flex items-center gap-2 mt-1 md:mt-0">
                                <span className="text-white font-bold text-sm md:text-base">
                                  {schedule.title}
                                </span>
                                <span
                                  className={`${getDifficultyColor(
                                    schedule.difficulty
                                  )} text-white px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold`}
                                >
                                  {schedule.difficulty}
                                </span>
                              </div>
                            </div>
                            <span className="text-[#9E4BED] font-bold text-xs md:text-sm mt-1 md:mt-0">
                              {schedule.applicants.total}/{schedule.maxCapacity}
                              명
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
            <div className="w-full">
              <div className="bg-white/5 rounded-xl p-3 md:p-6 shadow-lg">
                <h2 className="text-lg md:text-2xl font-bold text-center text-white mb-3 md:mb-4">
                  🎮 게임오브소셜링 데모데이
                </h2>

                {/* 가격 및 시간 정보 */}
                <div className="rounded-lg p-2 md:p-4 mb-3 md:mb-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <p className="text-white font-bold text-sm md:text-lg">
                          <span className="text-[#8B5CF6]">
                            플레이어 20,000원
                          </span>
                        </p>
                        <p className="text-[#10B981] font-bold text-xs md:text-sm">
                          출품자 무료 ✨
                        </p>
                      </div>
                      <p className="text-white font-bold text-sm md:text-lg">
                        일요일 13:00~18:00{" "}
                        <span className="text-white/80">(5시간)</span>
                      </p>
                    </div>
                  </div>

                  {/* 범례 */}
                  <div className="flex gap-2 justify-center mt-3 md:mt-6 mb-2 md:mb-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full text-xs border border-white/20 bg-[#7343F8]/20">
                      <div className="w-2 h-2 rounded-full bg-[#7343F8]" />
                      <span className="text-white/90">참가자</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full text-xs border border-white/20 bg-[#2BAE6C]/20">
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-2 md:p-3">
                          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                            <span className="font-medium text-[#F4F4F4] text-xs md:text-base md:min-w-[120px]">
                              {schedule.year}년 {schedule.date}
                            </span>
                            <span className="text-white font-bold text-sm md:text-base mt-1 md:mt-0">
                              {schedule.title}
                            </span>
                          </div>
                          <span className="text-[#8B5CF6] font-bold text-xs md:text-sm mt-1 md:mt-0">
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
            <div className="w-full mt-8 md:mt-12">
              <div className="bg-gray-800/50 rounded-xl p-3 md:p-4 border border-gray-600">
                <h3 className="text-base md:text-lg font-bold text-white mb-2">
                  📋 내부 참고사항
                </h3>
                <ul className="text-white/80 text-xs md:text-sm space-y-1">
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
