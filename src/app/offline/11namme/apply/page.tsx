"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import LoveBuddiesApplyFlow from "@/components/day-nammae/apply/LoveBuddiesApplyFlow";
import { getDayNammeCouponSuffixFromSearchParam } from "@/features/day-nammae/coupon";
import { getVisibleDayNammeSchedules } from "@/features/day-nammae/schedule";
import { useDayNammeSchedule } from "@/features/day-nammae/useDayNammeSchedule";
import {
  buildMetaPixelPageViewScript,
  LOVE_BUDDIES_PIXEL_ID,
} from "@/utils/metaPixel";
import { getSafeSearchParams } from "@/utils/utm";

export default function DayNammeApplyPage() {
  const { scheduleData, isLoading } = useDayNammeSchedule();
  const visibleSchedules = getVisibleDayNammeSchedules(scheduleData);
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
    <>
      <Script
        id="facebook-pixel-apply"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: buildMetaPixelPageViewScript(LOVE_BUDDIES_PIXEL_ID),
        }}
      />
      <LoveBuddiesApplyFlow
        mode="page"
        scheduleData={visibleSchedules}
        isLoadingSchedules={isLoading}
        initialCouponCode={initialCouponCode}
      />
    </>
  );
}
