"use client";

import { Suspense } from "react";
import useGoogleAnalytics from "../hooks/useGoogleAnalytics";

function PageViewTrackerInner() {
  useGoogleAnalytics();
  return null;
}

export default function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  );
}
