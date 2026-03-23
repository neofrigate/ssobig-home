import { DAY_NAMMAE_FALLBACK_SCHEDULE } from "./constants";
import { ScheduleItem } from "./types";

interface RawScheduleItem {
  schedule: string;
  closeStatus?: string;
  maxCapacity: number;
  exposedTotal: number;
  exposedFemale: number;
  exposedMale: number;
  status?: string;
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

export function isDayNammeScheduleSelectable(
  schedule: ScheduleItem,
  gender: "남" | "여" | ""
) {
  if (schedule.status === "전체마감") {
    return false;
  }

  if (gender === "여" && schedule.status === "여자마감") {
    return false;
  }

  if (gender === "남" && schedule.status === "남자마감") {
    return false;
  }

  return true;
}
