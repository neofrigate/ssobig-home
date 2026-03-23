"use client";

import { useEffect } from "react";
import Script from "next/script";
import LoveBuddiesApplyFlow from "@/components/day-nammae/apply/LoveBuddiesApplyFlow";
import { useDayNammeSchedule } from "@/features/day-nammae/useDayNammeSchedule";
import {
  buildMetaPixelPageViewScript,
  LOVE_BUDDIES_PIXEL_ID,
} from "@/utils/metaPixel";

export default function DayNammeApplyPage() {
  const { scheduleData, isLoading } = useDayNammeSchedule();

  useEffect(() => {
    document.body.classList.add("day-nammae-apply-page");

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
        scheduleData={scheduleData}
        isLoadingSchedules={isLoading}
      />
    </>
  );
}
