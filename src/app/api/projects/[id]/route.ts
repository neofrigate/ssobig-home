import { NextResponse } from "next/server";
import { getProjectById } from "@/utils/markdown";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // params를 await로 unwrap
    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    if (!projectId) {
      return NextResponse.json(
        { error: "프로젝트 ID가 필요합니다." },
        { status: 400 }
      );
    }

    console.log("프로젝트 ID:", projectId);

    // MD 파일에서 프로젝트 데이터 가져오기
    const projectData = getProjectById(projectId);

    if (!projectData) {
      return NextResponse.json(
        { error: "프로젝트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 프론트엔드에서 사용하는 형식으로 변환
    const project = {
      id: projectData.id,
      title: projectData.title,
      description: projectData.description,
      category: projectData.category,
      tags: projectData.tags,
      images: projectData.images || [],
      link: projectData.link || "#",
      year: projectData.year,
      partner: projectData.partner || "",
      date: projectData.date || "",
      selection: projectData.selection || [],
      content: projectData.content,
    };

    console.log("MD 파일에서 로드된 프로젝트:", project.title);

    return NextResponse.json(
      { project },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
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
