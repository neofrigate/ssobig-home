import { NextResponse } from "next/server";
import { getAllProjects } from "@/utils/markdown";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // MD 파일에서 프로젝트 목록 가져오기
    const projectsData = getAllProjects();

    // 프론트엔드에서 사용하는 형식으로 변환
    const projects = projectsData.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags,
      image: project.thumbnail || "",
      link: project.link || "#",
      year: project.year,
    }));

    console.log("MD 파일에서 로드된 프로젝트 수:", projects.length);

    return NextResponse.json({ projects });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";

    console.error("프로젝트 로딩 오류:", error);
    console.error("오류 메시지:", errorMessage);

    return NextResponse.json(
      {
        error: "프로젝트를 가져오는 중 오류가 발생했습니다.",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
