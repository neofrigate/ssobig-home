"use client";

import DayNammeApplyFlow from "@/components/day-nammae/DayNammeApplyFlow";
import { useDayNammeSchedule } from "@/features/day-nammae/useDayNammeSchedule";

export default function DayNammeApplyPage() {
  const { scheduleData, isLoading } = useDayNammeSchedule();

  return (
    <DayNammeApplyFlow
      mode="page"
      scheduleData={scheduleData}
      isLoadingSchedules={isLoading}
    />
  );
}
