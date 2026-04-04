"use client";

import { useEffect, useState } from "react";
import LoveBuddiesApplyFlow from "@/components/day-nammae/apply/LoveBuddiesApplyFlow";
import { getDayNammeCouponSuffixFromSearchParam } from "@/features/day-nammae/coupon";
import { useDayNammeSchedule } from "@/features/day-nammae/useDayNammeSchedule";
import { getSafeSearchParams } from "@/utils/utm";

export default function DayNammeApplyPage() {
  const { scheduleData, isLoading } = useDayNammeSchedule();
  const [initialCouponCode, setInitialCouponCode] = useState("");

  useEffect(() => {
    document.body.classList.add("day-nammae-apply-page");
    setInitialCouponCode(
      getDayNammeCouponSuffixFromSearchParam(
        getSafeSearchParams(window.location.search).get("coupon")
      )
    );

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
