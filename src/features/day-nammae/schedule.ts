import { DAY_NAMMAE_FALLBACK_SCHEDULE } from "./constants";
import { DayNammeApplicationMode, ScheduleItem } from "./types";

interface RawScheduleItem {
  schedule: string;
  closeStatus?: string;
  maxCapacity: number;
  exposedTotal: number;
  exposedFemale: number;
  exposedMale: number;
  status?: string;
  waitlistAvailableFemale?: boolean;
  waitlistAvailableMale?: boolean;
}

export function parseDayNammeSchedule(data: RawScheduleItem[]): ScheduleItem[] {
  return data
    .map((item) => {
      const title = item.schedule?.trim();
      if (!title) {
        return null;
      }

      const dateMatch = title.match(/(\d+\/\d+\s*\([^)]+\))/);
      const dateStr = dateMatch ? dateMatch[1] : "";

      const timeMatch = title.match(/\d+:\d+/);
      const timeStr = timeMatch ? timeMatch[0] : "";

      const gameTitle = title.replace(/\d+\/\d+\s*\([^)]+\)\s*\d+:\d+\s*/, "").trim();
      const cleanTitle = timeStr ? `${timeStr} ${gameTitle}` : gameTitle;

      return {
        date: dateStr,
        title: cleanTitle,
        applicants: {
          total: item.exposedTotal || 0,
          female: item.exposedFemale || 0,
          male: item.exposedMale || 0,
        },
        maxCapacity: item.maxCapacity || 40,
        status: item.closeStatus || item.status || "",
        waitlistAvailableFemale: Boolean(item.waitlistAvailableFemale),
        waitlistAvailableMale: Boolean(item.waitlistAvailableMale),
      };
    })
    .filter((item): item is ScheduleItem => item !== null)
    .sort((a, b) => {
      const parseDate = (item: ScheduleItem) => {
        const dateMatch = item.date.match(/(\d+)\/(\d+)/);
        const timeMatch = item.title.match(/^(\d+):(\d+)/);
        const month = dateMatch ? parseInt(dateMatch[1], 10) : 0;
        const day = dateMatch ? parseInt(dateMatch[2], 10) : 0;
        const hour = timeMatch ? parseInt(timeMatch[1], 10) : 0;
        const minute = timeMatch ? parseInt(timeMatch[2], 10) : 0;
        return month * 100000 + day * 1000 + hour * 60 + minute;
      };

      return parseDate(a) - parseDate(b);
    });
}

export function getDayNammeFallbackSchedule(): ScheduleItem[] {
  return parseDayNammeSchedule(DAY_NAMMAE_FALLBACK_SCHEDULE);
}

export function getDayNammeScheduleLabel(schedule: ScheduleItem) {
  return `${schedule.date} ${schedule.title}`.trim();
}

export function isDayNammeScheduleWaitlistSelectable(
  schedule: ScheduleItem,
  gender: "남" | "여" | ""
) {
  if (schedule.status === "전체마감") {
    if (gender === "여") return schedule.waitlistAvailableFemale;
    if (gender === "남") return schedule.waitlistAvailableMale;
    return schedule.waitlistAvailableFemale || schedule.waitlistAvailableMale;
  }

  if (gender === "여" && schedule.status === "여자마감") {
    return schedule.waitlistAvailableFemale;
  }

  if (gender === "남" && schedule.status === "남자마감") {
    return schedule.waitlistAvailableMale;
  }

  return false;
}

export function isDayNammeScheduleSelectable(
  schedule: ScheduleItem,
  gender: "남" | "여" | ""
) {
  return (
    schedule.status !== "전체마감" &&
    !(gender === "여" && schedule.status === "여자마감") &&
    !(gender === "남" && schedule.status === "남자마감")
  ) || isDayNammeScheduleWaitlistSelectable(schedule, gender);
}

export function getDayNammeScheduleApplicationMode(
  schedule: ScheduleItem,
  gender: "남" | "여" | ""
): DayNammeApplicationMode {
  return isDayNammeScheduleWaitlistSelectable(schedule, gender)
    ? "waitlist"
    : "normal";
}

export function getDayNammeScheduleHelperText(
  schedule: ScheduleItem,
  gender: "남" | "여" | ""
) {
  if (isDayNammeScheduleWaitlistSelectable(schedule, gender)) {
    return "예약대기 가능";
  }

  if (schedule.status === "전체마감") return "전체 마감";
  if (gender === "여" && schedule.status === "여자마감") return "여성 마감";
  if (gender === "남" && schedule.status === "남자마감") return "남성 마감";
  if (
    !gender &&
    (schedule.status === "여자마감" || schedule.status === "남자마감")
  ) {
    return "성별 선택 후 확인";
  }

  return schedule.status || "신청 가능";
}

export function getDayNammeScheduleHelperDescription(
  schedule: ScheduleItem,
  gender: "남" | "여" | ""
) {
  if (isDayNammeScheduleWaitlistSelectable(schedule, gender)) {
    return "마감 일정이지만 자리가 생기면 결제 후 확정할 수 있어요.";
  }

  if (!gender && (schedule.status === "여자마감" || schedule.status === "남자마감")) {
    return "성별에 따라 신청 가능 여부가 달라져요.";
  }

  return `현재 ${schedule.applicants.total}/${schedule.maxCapacity}명 신청`;
}
