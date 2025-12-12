"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "../utils/gtag";

export default function useGoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      // window.location을 직접 사용하여 searchParams 열거 방지
      // pathname과 window.location.search를 결합하여 전체 URL 생성
      const url = pathname + window.location.search;
      pageview(url);
    }
  }, [pathname]);
}
