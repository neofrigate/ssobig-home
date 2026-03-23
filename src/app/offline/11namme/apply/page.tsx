"use client";

import LoveBuddiesApplyFlow from "@/components/day-nammae/apply/LoveBuddiesApplyFlow";
import { useDayNammeSchedule } from "@/features/day-nammae/useDayNammeSchedule";

export default function DayNammeApplyPage() {
  const { scheduleData, isLoading } = useDayNammeSchedule();

  return (
    <LoveBuddiesApplyFlow
      mode="page"
      scheduleData={scheduleData}
      isLoadingSchedules={isLoading}
    />
  );
}
