"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoveBuddiesApplyFlow from "@/components/day-nammae/apply/LoveBuddiesApplyFlow";
import { getDayNammeCouponSuffixFromSearchParam } from "@/features/day-nammae/coupon";
import { useDayNammeSchedule } from "@/features/day-nammae/useDayNammeSchedule";

export default function DayNammeApplyPage() {
  const searchParams = useSearchParams();
  const { scheduleData, isLoading } = useDayNammeSchedule();
  const initialCouponCode = getDayNammeCouponSuffixFromSearchParam(
    searchParams.get("coupon")
  );

  useEffect(() => {
    document.body.classList.add("day-nammae-apply-page");

    return () => {
      document.body.classList.remove("day-nammae-apply-page");
    };
  }, []);

  return (
    <LoveBuddiesApplyFlow
      mode="page"
      scheduleData={scheduleData}
      isLoadingSchedules={isLoading}
      initialCouponCode={initialCouponCode}
    />
  );
}
