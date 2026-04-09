import type { Metadata } from "next";
import SurveyPageClient from "./SurveyPageClient";

export const metadata: Metadata = {
  title: "일일남매 설문조사",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: Promise<{
    applicationId: string;
  }>;
};

export default async function DayNammeSurveyPage({ params }: PageProps) {
  const { applicationId } = await params;

  return <SurveyPageClient applicationId={applicationId} />;
}
