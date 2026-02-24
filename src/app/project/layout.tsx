import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로젝트",
  description:
    "쏘빅이 진행하는 다양한 프로젝트를 확인해보세요. 소셜링, 이벤트, 콘텐츠 등 쏘빅의 활동을 소개합니다.",
  openGraph: {
    title: "프로젝트 | 쏘빅 SSOBIG",
    description: "쏘빅이 진행하는 다양한 프로젝트를 확인해보세요.",
    url: "https://www.ssobig.com/project",
  },
  alternates: {
    canonical: "https://www.ssobig.com/project",
  },
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
