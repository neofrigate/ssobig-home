"use client";

import { useEffect, useState } from "react";
import {
  getDayNammeFallbackSchedule,
  getVisibleDayNammeSchedules,
  parseDayNammeSchedule,
} from "./schedule";
import { ScheduleItem } from "./types";
import { getPublicDayNammeSchedulesUrl } from "./upstream";

interface PublicDayNammeSchedulesResponse {
  generatedAt?: string;
  todayKst?: string;
  schedules?: {
    staffScheduleId?: string | null;
    staff_schedule_id?: string | null;
    scheduleDate?: string | null;
    schedule_date?: string | null;
    schedule: string;
    closeStatus: string;
    maxCapacity: number;
    exposedTotal: number;
    exposedFemale: number;
    exposedMale: number;
    waitlistAvailableFemale?: boolean;
    waitlistAvailableMale?: boolean;
    waitlistAlertFemale?: number;
    waitlistAlertMale?: number;
    waitlistAlertTotal?: number;
    ageRangeKey?: string | null;
    age_range_key?: string | null;
    ageMin?: number | null;
    ageMax?: number | null;
    birthYearMin?: number | null;
    birthYearMax?: number | null;
    ageRangeLabel?: string | null;
  }[];
}

function formatUpdateTime(rawDate?: string) {
  const now = rawDate ? new Date(rawDate) : new Date();

  if (Number.isNaN(now.getTime())) {
    return "";
  }

  return `UPDATE : ${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function useDayNammeSchedule() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState("");

  useEffect(() => {
    const fetchScheduleData = async () => {
      setLastUpdateTime(formatUpdateTime());

      try {
        const response = await fetch(getPublicDayNammeSchedulesUrl(), {
          cache: "default",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data =
          (await response.json()) as PublicDayNammeSchedulesResponse;
        const updatedSchedule = getVisibleDayNammeSchedules(
          parseDayNammeSchedule(data.schedules || []),
          data.todayKst
        );

        setScheduleData(updatedSchedule);
        setLastUpdateTime(formatUpdateTime(data.generatedAt));
      } catch (error) {
        console.error("스케줄 데이터 가져오기 실패, 폴백 사용:", error);
        setScheduleData(getDayNammeFallbackSchedule());
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  return {
    scheduleData,
    isLoading,
    lastUpdateTime,
  };
}
