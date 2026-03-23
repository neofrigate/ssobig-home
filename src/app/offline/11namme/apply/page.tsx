"use client";

import Script from "next/script";
import LoveBuddiesApplyFlow from "@/components/day-nammae/apply/LoveBuddiesApplyFlow";
import { useDayNammeSchedule } from "@/features/day-nammae/useDayNammeSchedule";

export default function DayNammeApplyPage() {
  const { scheduleData, isLoading } = useDayNammeSchedule();

  return (
    <>
      <Script
        id="facebook-pixel-apply"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1541266446734040');
            fbq('track', 'PageView');
          `,
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
