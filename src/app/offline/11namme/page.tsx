"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import LoveBuddiesApplyFlow from "@/components/day-nammae/apply/LoveBuddiesApplyFlow";
import { getDayNammeCouponSuffixFromSearchParam } from "@/features/day-nammae/coupon";
import { getVisibleDayNammeSchedules } from "@/features/day-nammae/schedule";
import { useDayNammeSchedule } from "@/features/day-nammae/useDayNammeSchedule";
import { ScheduleItem } from "@/features/day-nammae/types";
import {
  buildMetaPixelPageViewScript,
  LOVE_BUDDIES_PIXEL_ID,
} from "@/utils/metaPixel";
import { getSafeSearchParams } from "@/utils/utm";

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

const ElevenNammePage = () => {
  const router = useRouter();
  const { scheduleData, isLoading, lastUpdateTime } = useDayNammeSchedule();
  const visibleScheduleData = useMemo(
    () => getVisibleDayNammeSchedules(scheduleData),
    [scheduleData]
  );
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isCouponNoticeOpen, setIsCouponNoticeOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // 참가자 차트 컴포넌트 - 중앙 기준
  const ApplicantChart = ({
    applicants,
    maxCapacity,
  }: {
    applicants: { total: number; female: number; male: number };
    maxCapacity: number;
  }) => {
    const halfCapacity = maxCapacity / 2;
    const femalePercentage =
      halfCapacity > 0 ? Math.min(100, (applicants.female / halfCapacity) * 100) : 0;
    const malePercentage =
      halfCapacity > 0 ? Math.min(100, (applicants.male / halfCapacity) * 100) : 0;
    const femaleEmpty = Math.max(0, 100 - femalePercentage);
    const maleEmpty = Math.max(0, 100 - malePercentage);

    return (
      <div className="flex h-2 md:h-3 bg-black/10 rounded-full overflow-hidden">
        {/* 왼쪽 절반 - 여자 */}
        <div className="flex w-1/2 flex-row-reverse">
          <div
            className="transition-all duration-700 ease-out rounded-l-full bg-[#FF69B4]"
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
            className="transition-all duration-700 ease-out rounded-r-full bg-[#4A90E2]"
            style={{ width: `${malePercentage}%` }}
          />
          <div className="bg-transparent" style={{ width: `${maleEmpty}%` }} />
        </div>
      </div>
    );
  };

  // 스케줄 아이템 컴포넌트
  useEffect(() => {
    setCouponCode(
      getDayNammeCouponSuffixFromSearchParam(
        getSafeSearchParams(window.location.search).get("coupon")
      )
    );
  }, []);

  useEffect(() => {
    if (!isApplyOpen && !isCouponNoticeOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isApplyOpen) {
          setIsApplyOpen(false);
          return;
        }

        setIsCouponNoticeOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isApplyOpen, isCouponNoticeOpen]);

  useEffect(() => {
    setIsCouponNoticeOpen(Boolean(couponCode));
  }, [couponCode]);

  const handleApplyClick = () => {
    setIsCouponNoticeOpen(false);

    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsApplyOpen(true);
      return;
    }

    router.push(`/offline/11namme/apply${window.location.search}`);
  };

  const ScheduleRow = ({ schedule }: { schedule: ScheduleItem }) => {
    const timeMatch = schedule.title.match(/^(\d+:\d+)\s+(.+)$/);
    const time = timeMatch ? timeMatch[1] : "";
    const gameName = timeMatch ? timeMatch[2] : schedule.title;

    const statusConfig: Record<string, { bg: string; text: string }> = {
      전체마감: { bg: "bg-[#F6C66A]/18", text: "text-[#8A5A00]" },
      여자마감: { bg: "bg-[#FF69B4]/15", text: "text-[#FF69B4]" },
      남자마감: { bg: "bg-[#4A90E2]/15", text: "text-[#4A90E2]" },
      임박: { bg: "bg-orange-100", text: "text-orange-500" },
      여유: { bg: "bg-green-100", text: "text-green-600" },
    };
    const statusStyle = statusConfig[schedule.status];

    return (
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-4">
          <div className="flex items-center space-x-2 md:space-x-3 flex-grow flex-wrap">
            <span className="font-medium md:font-semibold text-sm md:text-base text-black whitespace-nowrap">
              {schedule.date} {time}
            </span>
            <span className="font-bold text-sm md:text-base text-black">
              {gameName}
            </span>
            {statusStyle && schedule.status !== "여유" && schedule.status !== "임박" && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${statusStyle.bg} ${statusStyle.text}`}
                >
                  {schedule.status === "전체마감" ? `🔒 ${schedule.status}` : schedule.status}
                </span>
                {schedule.waitlistAlerts.total > 0 && (
                  <span className="text-xs font-semibold text-[#8A5A00] whitespace-nowrap">
                    예약대기 {schedule.waitlistAlerts.total}명
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="font-light text-xs md:text-sm text-black/70 ml-3 whitespace-nowrap">
            {schedule.applicants.total}/{schedule.maxCapacity}명
          </span>
        </div>
        <div className="px-3 md:px-4">
          <ApplicantChart
            applicants={schedule.applicants}
            maxCapacity={schedule.maxCapacity}
          />
        </div>
      </div>
    );
  };

  const upcomingCalendar = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const searchEnd = new Date(start);
    searchEnd.setMonth(searchEnd.getMonth() + 1);
    searchEnd.setHours(23, 59, 59, 999);

    const itemsByDay = new Map<
      string,
      {
        schedule: ScheduleItem;
        date: Date;
        stateLabel: string;
      }[]
    >();
    scheduleData.forEach((schedule) => {
      const source = schedule.fullLabel || `${schedule.date} ${schedule.title}`;
      const match = source.match(/(\d+)\/(\d+)\s*\([^)]+\)\s*(\d+):(\d+)/);

      if (!match) {
        return;
      }

      const candidate = new Date(
        start.getFullYear(),
        Number(match[1]) - 1,
        Number(match[2]),
        Number(match[3]),
        Number(match[4])
      );

      if (
        Number.isNaN(candidate.getTime()) ||
        candidate < start ||
        candidate > searchEnd
      ) {
        return;
      }

      const dayKey = `${candidate.getFullYear()}-${String(
        candidate.getMonth() + 1
      ).padStart(2, "0")}-${String(candidate.getDate()).padStart(2, "0")}`;

      const isTodaySchedule =
        candidate.getFullYear() === start.getFullYear() &&
        candidate.getMonth() === start.getMonth() &&
        candidate.getDate() === start.getDate();

      const stateLabel = schedule.recruitClosed
        ? "모집마감"
        : isTodaySchedule
        ? "마감(대기가능)"
        : schedule.status === "전체마감" ||
            schedule.status === "여자마감" ||
            schedule.status === "남자마감"
          ? "마감(대기가능)"
          : "신청가능";

      const bucket = itemsByDay.get(dayKey) || [];
      bucket.push({ schedule, date: candidate, stateLabel });
      bucket.sort((a, b) => a.date.getTime() - b.date.getTime());
      itemsByDay.set(dayKey, bucket);

    });

    const gridStart = new Date(start);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());
    const gridEnd = new Date(gridStart);
    gridEnd.setDate(gridEnd.getDate() + 27);
    gridEnd.setHours(23, 59, 59, 999);

    const days = [];
    for (
      const cursor = new Date(gridStart);
      cursor <= gridEnd;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const current = new Date(cursor);
      const dayKey = `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

      days.push({
        key: dayKey,
        date: current,
        isToday: current.getTime() === start.getTime(),
        inRange: current >= gridStart && current <= gridEnd,
        items: itemsByDay.get(dayKey) || [],
      });
    }

    return {
      label: `${start.getFullYear()}.${String(start.getMonth() + 1).padStart(
        2,
        "0"
      )} - ${String(gridEnd.getMonth() + 1).padStart(2, "0")}`,
      days,
    };
  }, [scheduleData]);

  const CalendarSection = () => {
    const weekLabels = ["일", "월", "화", "수", "목", "금", "토"];
    const mobileDays = upcomingCalendar.days.filter(
      (day) => day.inRange && day.items.length > 0
    );

    return (
      <div className="mt-[100px]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-black/40">
            CALENDAR
          </p>
          <p className="text-xs font-medium text-black/45 md:text-sm">
            {upcomingCalendar.label}
          </p>
        </div>

        <div className="mt-4 space-y-3 md:hidden">
          {mobileDays.map((day) => (
            <div
              key={day.key}
              className={`rounded-2xl border px-3 py-3 ${
                day.isToday
                  ? "border-[#FF6B9F]/35 bg-[#FFF2F7]"
                  : "border-black/10 bg-white/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-black">
                  {day.date.getMonth() + 1}/{day.date.getDate()} (
                  {weekLabels[day.date.getDay()]})
                </p>
                {day.isToday && (
                  <span className="rounded-full bg-[#FF6B9F]/12 px-2 py-0.5 text-[10px] font-semibold text-[#D9487D]">
                    오늘
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-2">
                {day.items.map((item) => {
                  const chipClass =
                    item.stateLabel === "모집마감"
                      ? "border-[#7048E8]/28 bg-[#7048E8]/10 text-[#5F3DC4]"
                      : item.stateLabel === "마감(대기가능)"
                      ? "border-[#F6C66A]/35 bg-[#F6C66A]/16 text-[#8A5A00]"
                      : "border-[#FF6B9F]/20 bg-[#FF6B9F]/10 text-[#C73F72]";

                  return (
                    <div
                      key={`${item.schedule.fullLabel}-${item.date.getTime()}-mobile`}
                      className={`rounded-xl border px-3 py-2 ${chipClass}`}
                    >
                      <p className="text-xs font-bold">
                        {String(item.date.getHours()).padStart(2, "0")}:
                        {String(item.date.getMinutes()).padStart(2, "0")}{" "}
                        {item.schedule.title.replace(/^\d+:\d+\s+/, "")}
                      </p>
                      <p className="mt-1 whitespace-nowrap text-[11px] font-medium leading-tight">
                        {item.stateLabel}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden grid-cols-7 gap-2 md:grid">
          {weekLabels.map((label) => (
            <div
              key={label}
              className="text-center text-[11px] font-semibold text-black/45"
            >
              {label}
            </div>
          ))}

          {upcomingCalendar.days.map((day) => (
            <div
              key={day.key}
              className={`min-h-[86px] rounded-2xl border px-2 py-2 md:min-h-[110px] md:px-3 ${
                day.inRange
                  ? "border-black/10 bg-white/80"
                  : "border-black/5 bg-black/[0.02]"
              } ${day.isToday ? "ring-2 ring-[#FF6B9F]/35" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-bold ${
                      day.inRange ? "text-black/80" : "text-black/25"
                    }`}
                  >
                    {day.date.getDate()}
                  </span>
                  {day.date.getDate() === 1 && (
                    <span className="rounded-full bg-[#FFE3F0] px-1.5 py-0.5 text-[9px] font-semibold text-[#D9487D]">
                      {day.date.getMonth() + 1}월-
                    </span>
                  )}
                </div>
                {day.isToday && (
                  <span className="rounded-full bg-[#FF6B9F]/12 px-1.5 py-0.5 text-[10px] font-semibold text-[#D9487D]">
                    오늘
                  </span>
                )}
              </div>

              <div className="mt-2 space-y-1.5">
                {day.items.map((item) => {
                  const chipClass =
                    item.stateLabel === "모집마감"
                      ? "border-[#7048E8]/28 bg-[#7048E8]/10 text-[#5F3DC4]"
                      : item.stateLabel === "마감(대기가능)"
                      ? "border-[#F6C66A]/35 bg-[#F6C66A]/16 text-[#8A5A00]"
                      : "border-[#FF6B9F]/20 bg-[#FF6B9F]/10 text-[#C73F72]";

                  return (
                    <div
                      key={`${item.schedule.fullLabel}-${item.date.getTime()}`}
                      className={`rounded-xl border px-2 py-1.5 ${chipClass}`}
                    >
                      <p className="text-[10px] font-bold leading-none md:text-[11px]">
                        {String(item.date.getHours()).padStart(2, "0")}:
                        {String(item.date.getMinutes()).padStart(2, "0")}
                      </p>
                      <p className="mt-1 whitespace-nowrap text-[9px] font-medium leading-tight md:text-[10px]">
                        {item.stateLabel}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ScheduleLoadingSkeleton = () => {
    const weekLabels = ["일", "월", "화", "수", "목", "금", "토"];

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={`schedule-skeleton-${index}`} className="mb-4 md:mb-6">
              <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-4">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <div className="h-5 w-28 animate-pulse rounded-full bg-black/8" />
                  <div className="h-5 w-24 animate-pulse rounded-full bg-black/8" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-black/8" />
                </div>
                <div className="h-4 w-12 animate-pulse rounded-full bg-black/8" />
              </div>
              <div className="px-3 md:px-4">
                <div className="h-2 md:h-3 animate-pulse rounded-full bg-black/8" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[100px]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-black/40">
              CALENDAR
            </p>
            <p className="text-xs font-medium text-black/45 md:text-sm">
              로딩 중
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center rounded-2xl border border-dashed border-black/10 bg-black/[0.02] px-4 py-3 text-xs font-medium text-black/45 md:hidden">
            일정을 불러오는 중입니다...
          </div>

          <div className="mt-4 hidden grid-cols-7 gap-2 md:grid">
            {weekLabels.map((label) => (
              <div
                key={`calendar-label-skeleton-${label}`}
                className="text-center text-[11px] font-semibold text-black/45"
              >
                {label}
              </div>
            ))}

            {Array.from({ length: 28 }).map((_, index) => (
              <div
                key={`calendar-skeleton-${index}`}
                className="min-h-[110px] rounded-2xl border border-black/8 bg-white/80 px-3 py-2"
              >
                <div className="h-3 w-5 animate-pulse rounded-full bg-black/8" />
                <div className="mt-3 space-y-2">
                  <div className="h-10 animate-pulse rounded-xl bg-black/6" />
                  {index % 5 === 0 && (
                    <div className="h-10 animate-pulse rounded-xl bg-black/6" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel-love-buddies"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: buildMetaPixelPageViewScript(LOVE_BUDDIES_PIXEL_ID),
        }}
      />
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative">
        {/* 배경 이미지 next/image 적용 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/lovebuddies/hero-main.jpg"
            alt="일일남매 배경"
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
              src="/ssobig_assets/lovebuddies/product-detail 1.png"
              alt="상세 이미지 1"
              width={1920}
              height={1080}
              className="w-full h-auto block"
              priority
            />

            {/* 일일남매 스케줄 박스 */}
            <div className="w-full">
              <div className="bg-[#F2F2F2] p-4 md:px-6 md:py-7">
                <h2 className="text-xl md:text-2xl font-bold text-center text-black mb-3 md:mb-4">
                  💕 일일남매 스케줄
                </h2>

                {/* 가격 및 범례 */}
                <div className="flex gap-2 md:gap-3 justify-between items-center mb-4 md:mb-6 px-3 md:px-4">
                  <div className="text-sm md:text-base font-semibold text-black">
                    참가비 : 35,000원
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
                    <ScheduleLoadingSkeleton />
                  ) : visibleScheduleData.length === 0 ? (
                    <div className="flex items-center justify-center py-6 text-black/60 text-sm md:text-base">
                      📅 참여하기 버튼을 눌러주세요
                    </div>
                ) : (
                  visibleScheduleData.map((schedule, index) => (
                    <ScheduleRow key={index} schedule={schedule} />
                  ))
                )}
              </div>

              {!isLoading && scheduleData.length > 0 && <CalendarSection />}

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
              src="/ssobig_assets/lovebuddies/product-detail2.webp"
              alt="상세 이미지 2"
              width={1920}
              height={1080}
              className="w-full h-auto block"
            />

            {/* 사전 안내 공지 + 신청 전 최종 확인 */}
            <div className="w-full bg-gradient-to-b from-[#C8D6F0] to-[#D8DEF0] px-5 py-10 md:px-10 md:py-16">
              {/* 사전 안내 공지 헤더 */}
              <p className="text-center text-sm md:text-base text-[#4A7BD4] font-semibold mb-1">개더링 무드와 약속</p>
              <h2 className="text-center text-2xl md:text-4xl font-extrabold text-[#1A1A2E] mb-6 md:mb-10">사전 안내 공지</h2>

              {/* 카드 1: 시간 안내 */}
              <div className="bg-white rounded-2xl p-5 md:p-7 mb-4 md:mb-6 shadow-sm">
                <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                  <span className="text-lg md:text-2xl">🕐</span>
                  <span className="font-bold text-[#1A1A2E] text-[15px] md:text-lg">원활한 진행을 위해 시간을 꼭 지켜주세요!</span>
                </div>
                <ul className="space-y-1.5 md:space-y-2.5 text-sm md:text-base text-[#333] leading-relaxed">
                  <li className="flex items-start gap-1"><span>•</span><span>입장가능 시간은 정확히 개더링 시작시간에 맞춰서!<br /><span className="text-[#4A7BD4]">👉</span> 늦게 오시는 분을 위해 15분 대기 후 시작해요.</span></li>
                  <li className="flex items-start gap-1"><span>•</span><span>알찬 콘텐츠와 매력적인 게스트들이 기다리고 있어요!</span></li>
                </ul>
                <p className="mt-2 md:mt-4 text-sm md:text-base font-bold text-[#E53E3E]">※ 당일 15분 이상 지각 시 개더링 참여가 <span className="underline">불가</span>합니다.</p>
              </div>

              {/* 카드 2: 안전 안내 */}
              <div className="bg-white rounded-2xl p-5 md:p-7 mb-4 md:mb-6 shadow-sm">
                <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                  <span className="text-lg md:text-2xl">🛡️</span>
                  <span className="font-bold text-[#1A1A2E] text-[15px] md:text-lg">어떤 상황이든 안전이 최우선!</span>
                </div>
                <ul className="space-y-1.5 md:space-y-2.5 text-sm md:text-base text-[#333] leading-relaxed">
                  <li className="flex items-start gap-1"><span>•</span><span>게더링 중 발생한 안전사고에 대한 책임은 본인에게 있으며, 기물 파손 시 동일 금액으로 원 주인에게 배상해야 합니다.</span></li>
                  <li className="flex items-start gap-1"><span>•</span><span>빌런에겐 강경대응! 블랙리스트를 관리하고 있어요.</span></li>
                </ul>
              </div>

              {/* 카드 3: 승인 안내 */}
              <div className="bg-white rounded-2xl p-5 md:p-7 shadow-sm">
                <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                  <span className="text-lg md:text-2xl">✅</span>
                  <span className="font-bold text-[#1A1A2E] text-[15px] md:text-lg">사전 신청 내용을 꼼꼼히 보고 승인해요!</span>
                </div>
                <ul className="space-y-1.5 md:space-y-2.5 text-sm md:text-base text-[#333] leading-relaxed">
                  <li className="flex items-start gap-1"><span>•</span><span>소통을 위해 &apos;가급적&apos; 성비·연령대를 맞춰요!</span></li>
                  <li className="flex items-start gap-1"><span>•</span><span>인스타를 보고 특히 잘 맞을 것 같은 분 위주로 수락!</span></li>
                  <li className="flex items-start gap-1"><span>•</span><span>세심히 고려하느라 수락에 시간이 걸릴 수 있어요!</span></li>
                  <li className="flex items-start gap-1"><span>•</span><span>팔로워를 우선 승인드리는 점 양해 부탁드려요😉</span></li>
                </ul>
              </div>
            </div>

            {/* 신청 전 최종 확인 */}
            <div className="w-full bg-[#EAECF5] px-5 py-10 md:px-10 md:py-16">
              <h2 className="text-center text-2xl md:text-4xl font-extrabold text-[#1A1A2E] mb-4 md:mb-6">신청 전 최종 확인!</h2>

              {/* 개더링 CHECK LIST 말풍선 */}
              <div className="flex justify-center mb-5 md:mb-8">
                <div className="relative bg-[#1A1A2E] text-white text-sm md:text-base font-bold px-5 md:px-7 py-2 md:py-2.5 rounded-full">
                  개더링 CHECK LIST
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#1A1A2E]" />
                </div>
              </div>

              {/* 체크리스트 카드 */}
              <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm max-w-[480px] mx-auto">
                {/* 오시는 길 */}
                <div className="mb-5 md:mb-6">
                  <span className="inline-block bg-[#4A9EE8] text-white text-xs md:text-sm font-bold px-3 md:px-4 py-1 md:py-1.5 rounded-full mb-2 md:mb-3">오시는 길</span>
                  <div className="flex items-start gap-2.5 md:gap-3">
                    <span className="text-[#4A9EE8] text-xl md:text-2xl mt-0.5">✔</span>
                    <div className="text-sm md:text-base text-[#333] leading-relaxed">
                      <p className="font-semibold">신논현역 도보 5분거리</p>
                      <p className="text-[#666]">(상세 주소는 모임 전날 안내됩니다!)</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#D0D0D0] mb-5 md:mb-6" />

                {/* 소요시간 */}
                <div className="mb-5 md:mb-6">
                  <span className="inline-block bg-[#4A9EE8] text-white text-xs md:text-sm font-bold px-3 md:px-4 py-1 md:py-1.5 rounded-full mb-2 md:mb-3">소요시간</span>
                  <div className="flex items-start gap-2.5 md:gap-3">
                    <span className="text-[#4A9EE8] text-xl md:text-2xl mt-0.5">✔</span>
                    <div className="text-sm md:text-base text-[#333] leading-relaxed">
                      <p className="font-semibold">2시간 30분 ~ 3시간</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#D0D0D0] mb-5 md:mb-6" />

                {/* 제공사항 */}
                <div className="mb-5 md:mb-6">
                  <span className="inline-block bg-[#4A9EE8] text-white text-xs md:text-sm font-bold px-3 md:px-4 py-1 md:py-1.5 rounded-full mb-2 md:mb-3">제공사항</span>
                  <div className="flex items-start gap-2.5 md:gap-3">
                    <span className="text-[#4A9EE8] text-xl md:text-2xl mt-0.5">✔</span>
                    <div className="text-sm md:text-base text-[#333] leading-relaxed">
                      <p className="font-semibold">독보적인 콘텐츠와 매력적인 친구들 💌</p>
                      <p>+ 간단한 다과 및 음료</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#D0D0D0] mb-5 md:mb-6" />

                {/* 준비물품 */}
                <div>
                  <span className="inline-block bg-[#4A9EE8] text-white text-xs md:text-sm font-bold px-3 md:px-4 py-1 md:py-1.5 rounded-full mb-2 md:mb-3">준비물품</span>
                  <div className="flex items-start gap-2.5 md:gap-3">
                    <span className="text-[#4A9EE8] text-xl md:text-2xl mt-0.5">✔</span>
                    <div className="text-sm md:text-base text-[#333] leading-relaxed">
                      <p className="font-semibold">풀충전한 폰(폰 사용 많음!)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ 섹션 */}
            <div className="w-full bg-[#EDEBF6] px-6 py-4 md:px-9 md:py-7 pb-24 md:pb-28">
              <h2 className="text-xl font-bold text-center text-black mb-4">
                💕 자주 묻는 질문
              </h2>

              <div className="space-y-0">
                {[
                  {
                    question: "[일일남매]는 어떻게 신청하나요?",
                    answer:
                      "페이지 하단의 <일일남매 참여하기> 버튼을 클릭하고<br/>양식에 맞춰 답변을 제출해주시면 됩니다!<br/>신청 후 발송되는 안내 문자에 따라 결제까지 마쳐주셔야 최종 신청 완료이니,<br/><strong style='background-color: #FF69B4; color: white; padding: 2px 4px; border-radius: 4px;'>꼭 안내 문자 확인 후 결제 부탁드립니다!</strong>",
                  },
                  {
                    question: "[일일남매] 참가자 무드가 궁금해요!",
                    answer:
                      '<strong>"다정한 사람들과 함께 행복해지기"</strong><br/><br/>저희의 꿈을 실현하기 위해 일일남매의 모든 콘텐츠는 승인제로 운영됩니다.<br/><br/>참가하시는 분께서 신청해주실 때 사전 질문에 대한 답변과 매력이 드러난 사진을 보내주시게 되요.<br/><br/>저희는 24시간 내로 세심하게 꼼꼼히 읽어보고,<br/>일일남매와 결이 맞는 분들만 모실 수 있도록 최선을 다해요.<br/><br/>앞으로도,여러분의 소중한 시간과 마음을 위해 믿고 올 수 있는 모임을 만들게요 : )',
                  },
                  {
                    question: "[일일남매] 지각시 참여가 어렵나요?",
                    answer:
                      "사전에 고지 드렸듯이 모임 15분 이후에는 참여가 매우 어렵습니다.<br/><br/>콘텐츠가 촘촘하게 구성되어 중간부터 참여하기가 어려운 구조입니다.<br/>다른 분들이 이미 현장에서 기다리고 계셔서 모임이 지연되는 걸 막고자<br/><strong style='background-color: #FF69B4; color: white; padding: 2px 4px; border-radius: 4px;'>최대 15분까지</strong> 진행 대기 후 모임을 시작하고 있습니다.<br/><strong style='background-color: #FF69B4; color: white; padding: 2px 4px; border-radius: 4px;'>지각의 경우 환불은 불가능</strong>하니 꼭 시간에 맞춰 현장에 도착 부탁드립니다 : )",
                  },
                  {
                    question:
                      "[일일남매] 다른 참가자 연락처가 궁금해요! or 연락처 전달이 가능한가요?",
                    answer:
                      "모임 중 서로 호감투표를 하여 매칭된 경우에 한해<br/>모임 종료 후 자동으로 연락처가 전달됩니다.<br/><br/>그 외에는 모임이 완료되면 참가자분들이 신청 시 제출한 데이터 중<br/>필수 데이터(성함, 전화번호)를 제외한 모든 정보가 폐기처리되어<br/>따로 식별할 수 있는 방법이 없습니다ㅠㅠ.<br/><br/>또한 개인정보 문제상 다른 참가자분들의 정보를 임의로 전달해드리는<br/>어려운 점 양해 부탁드립니다.",
                  },
                  {
                    question: "모임 공지와 장소는 어떻게 확인하나요?",
                    answer:
                      "모임에 승인되시면 모임일 하루 전에 알림톡을 전달드리고 있습니다.<br/>알림톡을 통해 모임입장 티켓을 전달해드리며,<br/>장소 및 공지도 해당 링크에서 확인하실 수 있으니<br/>꼭 접속 후 확인 부탁드립니다!",
                  },
                  {
                    question: "음식과 술을 주나요?",
                    answer:
                      "저희 모임은 서로를 알아가는 시간에 최대한 집중할 수 있도록<br/>콘텐츠에 많은 신경을 썼어요!<br/><br/>몰입을 위해 모임 중엔 음식이 따로 제공되지 않고,<br/>현재 2차는 별도로 준비해드리고 있지 않습니다. (26/3/27 부터)<br/><br/>가능하시면 식사를 하고 오시는 걸 추천해요!<br/>(간단한 다과류와 물은 구비되어 있습니다😊)",
                  },
                  {
                    question: "정확히 종료시간에 끝나나요?",
                    answer:
                      "모임은 2시간 30분 정도 진행합니다!<br/><br/>다만, 당일 상황에 따라 약간의 변동이 있을 수 있어요.<br/>모임 특성상 시간이 지날수록 점점 더 궁금한 사람이 많아지실 거예요!",
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
            <button
              type="button"
              onClick={handleApplyClick}
              className="w-full h-[56px] bg-[#FF6B9F] hover:bg-[#e45a8b] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-base md:text-lg"
            >
              일일남매 참여하기 🙋🏻‍♀️
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
            </button>
          </div>
        </div>

        {isApplyOpen && (
          <div className="fixed inset-0 z-50 hidden items-center justify-center p-6 md:flex">
            <button
              type="button"
              onClick={() => setIsApplyOpen(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              aria-label="신청 창 닫기"
            />
            <LoveBuddiesApplyFlow
              mode="modal"
              scheduleData={visibleScheduleData}
              isLoadingSchedules={isLoading}
              initialCouponCode={couponCode}
              onClose={() => setIsApplyOpen(false)}
            />
          </div>
        )}

        {isCouponNoticeOpen && couponCode && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">
            <button
              type="button"
              onClick={() => setIsCouponNoticeOpen(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              aria-label="쿠폰 안내 닫기"
            />
            <div className="relative w-full max-w-[360px] rounded-[28px] bg-[#171113] px-6 py-7 text-center shadow-2xl">
              <button
                type="button"
                onClick={() => setIsCouponNoticeOpen(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/60"
                aria-label="쿠폰 안내 닫기"
              >
                ×
              </button>
              <div className="mx-auto inline-flex rounded-full bg-[#FF6B9F]/15 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-[#FFB1D4]">
                COUPON
              </div>
              <h2 className="mt-4 text-2xl font-black text-white">
                쿠폰이 적용돼요
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                지금 일일남매 신청하시면 쿠폰이 적용됩니다.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-white/35">
                  SSOBIG-
                </p>
                <p className="mt-2 text-xl font-black tracking-[0.16em] text-white">
                  {couponCode}
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCouponNoticeOpen(false)}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-white/65"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-[#FF6B9F] text-sm font-bold text-white"
                >
                  지금 신청
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ElevenNammePage;
