"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  link: string;
  year: string;
  partner: string;
  date: string;
  selection: string[];
  content: string; // 페이지 본문
}

export default function ProjectDetailPage() {
  // useParams() 훅으로 params 가져오기
  const params = useParams();
  const id = params?.id as string | undefined;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // 유튜브 비디오 ID 추출 함수
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|img\.youtube\.com\/vi\/)([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1].split("/")[0];
      }
    }
    return null;
  };

  useEffect(() => {
    async function fetchProject() {
      if (!id) {
        setError("프로젝트 ID가 필요합니다.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        const response = await fetch(`/api/projects/${id}?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error("프로젝트를 불러오는데 실패했습니다.");
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setProject(data.project);
        setError(null);
      } catch (err) {
        console.error("프로젝트 로딩 오류:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // params는 Next.js 15에서 비동기이므로 dependency에 포함하지 않습니다.

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            프로젝트를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-[22px] md:text-2xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            오류가 발생했습니다
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-5 md:mb-6">
            {error}
          </p>
          <Link
            href="/project"
            className="inline-block bg-black text-white px-5 sm:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            프로젝트 목록으로
          </Link>
        </div>
      </div>
    );
  }

  // 마크다운 파싱 함수 (링크와 볼드 처리)
  const parseMarkdown = (text: string, lineIndex: number = 0) => {
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    let elementIndex = 0;

    // 모든 매치 찾기 (링크와 볼드)
    const matches: Array<{
      index: number;
      endIndex: number;
      type: "link" | "bold";
      text: string;
      url?: string;
    }> = [];

    // 링크 매치: [텍스트](URL)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        endIndex: match.index + match[0].length,
        type: "link",
        text: match[1],
        url: match[2],
      });
    }

    // 볼드 매치: **텍스트** (링크와 겹치지 않는 것만)
    const boldRegex = /\*\*(.*?)\*\*/g;
    while ((match = boldRegex.exec(text)) !== null) {
      const isInsideLink = matches.some(
        (m) => match!.index >= m.index && match!.index < m.endIndex
      );
      if (!isInsideLink) {
        matches.push({
          index: match.index,
          endIndex: match.index + match[0].length,
          type: "bold",
          text: match[1],
        });
      }
    }

    // 인덱스 순으로 정렬
    matches.sort((a, b) => a.index - b.index);

    // 겹치는 부분 제거 (먼저 나온 것이 우선)
    const filteredMatches: typeof matches = [];
    for (const m of matches) {
      const overlaps = filteredMatches.some(
        (f) =>
          (m.index >= f.index && m.index < f.endIndex) ||
          (m.endIndex > f.index && m.endIndex <= f.endIndex) ||
          (m.index <= f.index && m.endIndex >= f.endIndex)
      );
      if (!overlaps) {
        filteredMatches.push(m);
      }
    }

    // 파싱 실행
    for (const m of filteredMatches) {
      // 매치 전의 텍스트 추가
      if (m.index > lastIndex) {
        parts.push(text.substring(lastIndex, m.index));
      }
      // 매치된 요소 추가
      if (m.type === "link") {
        parts.push(
          <a
            key={`link-${lineIndex}-${elementIndex++}`}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 underline"
          >
            {m.text}
          </a>
        );
      } else if (m.type === "bold") {
        parts.push(
          <strong key={`bold-${lineIndex}-${elementIndex++}`}>{m.text}</strong>
        );
      }
      lastIndex = m.endIndex;
    }

    // 남은 텍스트 추가
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className="min-h-screen bg-white pt-0">
      {/* 메인 컨텐츠 */}
      <section className="pt-16 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          {/* 뒤로가기 버튼 */}
          <Link
            href="/project"
            className="inline-flex items-center text-gray-600 hover:text-black py-4 mb-0 transition-colors text-sm sm:text-base md:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            프로젝트 목록으로
          </Link>

          {/* 프로젝트 제목 */}
          <div className="mb-6 sm:mb-7 md:mb-8">
            <h1 className="text-[26px] sm:text-[36px] md:text-[44px] lg:text-[44px] font-bold text-gray-900 mt-4 mb-3 sm:mb-4 leading-tight">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-[15px] sm:text-[16px] md:text-[17px] lg:text-lg text-gray-600 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* 프로젝트 태그 */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-6 sm:mb-7 md:mb-8">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 이미지 갤러리 */}
          {project.images && project.images.length > 0 && (
            <div className="mb-12 -mx-5 lg:mx-0">
              {/* 모바일/태블릿: 가로 스크롤, 데스크톱: 그리드 */}
              <div className="flex lg:grid lg:grid-cols-2 gap-3 lg:gap-6 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 hide-scrollbar pl-5 pr-5 lg:pl-0 lg:pr-0">
                {project.images.map((imageSrc, index) => {
                  const videoId = extractYouTubeId(imageSrc);
                  const isPlaying = playingIndex === index;

                  return (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-[85vw] sm:w-[85vw] md:w-[90vw] lg:w-full aspect-video rounded-lg overflow-hidden bg-gray-100 group"
                    >
                      {videoId && isPlaying ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                          title={`${project.title} 영상 ${index + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <>
                          <Image
                            src={imageSrc}
                            alt={`${project.title} 이미지 ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 85vw, (max-width: 1024px) 90vw, 50vw"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                          {videoId && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
                              <button
                                onClick={() => setPlayingIndex(index)}
                                className="w-16 h-16 flex items-center justify-center bg-white/90 rounded-full shadow-xl transform transition-transform group-hover:scale-110 pointer-events-auto"
                              >
                                <svg
                                  className="w-8 h-8 text-black ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </button>
                              <a
                                href={`https://www.youtube.com/watch?v=${videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 px-4 py-1.5 bg-black/60 text-white text-xs rounded-full hover:bg-black/80 transition-colors pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                                유튜브에서 보기 ↗
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 프로젝트 정보 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* 기본 정보 */}
            <div className="md:col-span-2">
              {project.content && (
                <div className="text-gray-700 leading-relaxed text-[15px] sm:text-[16px] md:text-[17px] lg:text-lg">
                  {(() => {
                    // 앞뒤만 trim하고 줄 단위 분리 (중간의 빈 줄 유지)
                    const lines = project.content.trim().split("\n");

                    // 마크다운 파싱 로깅
                    console.log("=".repeat(80));
                    console.log("[마크다운 파싱 시작] 파일:", project.id);
                    console.log("총 라인 수:", lines.length);
                    console.log("=".repeat(80));

                    // 헤딩 추적용 배열
                    const headings: Array<{
                      line: number;
                      level: number;
                      text: string;
                    }> = [];

                    // 첫 번째 제목 추적용 변수
                    let isFirstHeading = true;

                    // 포맷팅 헬퍼 함수
                    const formatLineNumber = (num: number) =>
                      String(num).padStart(3, " ");

                    // 이미지 그룹 찾기: 연속된 이미지들을 그룹화 (빈 줄 무시)
                    const imageRegex = /^!\[([^\]]*)\]\(([^)]+)\)$/;
                    const imageGroups: Array<Array<number>> = [];
                    let currentGroup: number[] = [];

                    lines.forEach((line, index) => {
                      const trimmed = line.trim();
                      if (trimmed.match(imageRegex)) {
                        currentGroup.push(index);
                      } else if (trimmed !== "") {
                        // 빈 줄이 아닌 다른 내용이 나오면 그룹 종료
                        if (currentGroup.length > 0) {
                          imageGroups.push([...currentGroup]);
                          currentGroup = [];
                        }
                      }
                      // 빈 줄은 무시하고 계속 그룹에 포함
                    });
                    if (currentGroup.length > 0) {
                      imageGroups.push(currentGroup);
                    }

                    const parsedLines = lines.map((line, index) => {
                      const trimmed = line.trim();
                      // 실제 파일 라인 번호 (프론트매터 16줄 + 빈 줄 1줄 = 17줄부터 시작)
                      const actualLineNumber = 17 + index;
                      const lineType: string[] = [];

                      // 빈 줄 처리: 제목/인용문 다음 빈 줄은 높이 0, 그 외는 1.5rem (24px)
                      if (!trimmed) {
                        // 이전 라인이 제목인지 확인
                        const prevLine =
                          index > 0 ? lines[index - 1].trim() : "";
                        const isAfterHeading =
                          prevLine.startsWith("# ") ||
                          prevLine.startsWith("## ") ||
                          prevLine.startsWith("### ");
                        const isAfterBlockquote = prevLine.startsWith("> ");

                        lineType.push("EMPTY_LINE");
                        if (isAfterHeading) {
                          lineType.push("AFTER_HEADING");
                        }
                        if (isAfterBlockquote) {
                          lineType.push("AFTER_BLOCKQUOTE");
                        }
                        console.log(
                          `Line ${formatLineNumber(
                            actualLineNumber
                          )} (content index ${formatLineNumber(
                            index
                          )}): ${lineType.join(" | ")}`
                        );
                        // 제목/인용문 다음 빈 줄은 높이 0, 그 외는 h-6
                        return (
                          <div
                            key={index}
                            className={
                              isAfterHeading || isAfterBlockquote
                                ? "h-0"
                                : "h-6"
                            }
                          />
                        );
                      }

                      // 이미지 처리: ![alt](src)
                      const imageMatch = trimmed.match(imageRegex);
                      if (imageMatch) {
                        // 이 이미지가 속한 그룹 찾기
                        const groupIndex = imageGroups.findIndex((group) =>
                          group.includes(index)
                        );
                        const group =
                          groupIndex !== -1 ? imageGroups[groupIndex] : null;
                        const isGroupStart = group && group[0] === index;

                        lineType.push("IMAGE");
                        console.log(
                          `Line ${formatLineNumber(
                            actualLineNumber
                          )} (content index ${formatLineNumber(
                            index
                          )}): ${lineType.join(" | ")} | ${trimmed.substring(
                            0,
                            60
                          )}`
                        );

                        // 그룹이 있고 2개 이상의 이미지가 연속된 경우
                        if (group && group.length >= 2 && isGroupStart) {
                          return (
                            <div
                              key={index}
                              className="grid grid-cols-2 gap-2 sm:gap-3 my-6"
                            >
                              {group.map((imgIndex) => {
                                const imgLine = lines[imgIndex].trim();
                                const imgMatch = imgLine.match(imageRegex);
                                if (!imgMatch) return null;
                                return (
                                  <div
                                    key={imgIndex}
                                    className="relative w-full aspect-[4/3] rounded-lg overflow-hidden"
                                  >
                                    <Image
                                      src={imgMatch[2]}
                                      alt={imgMatch[1]}
                                      fill
                                      style={{ objectFit: "cover" }}
                                      className="rounded-lg"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }

                        // 그룹의 첫 번째가 아니면 렌더링하지 않음 (그룹의 첫 번째에서 이미 렌더링됨)
                        if (group && group.length >= 2 && !isGroupStart) {
                          return null;
                        }

                        // 단일 이미지 또는 그룹이 1개인 경우
                        // 실란트로 보고서 이미지만 contain으로 처리
                        const isSilantroReport =
                          imageMatch[2]?.includes("실란트로 보고서");
                        return (
                          <div
                            key={index}
                            className="relative w-full aspect-video rounded-lg overflow-hidden my-8"
                          >
                            <Image
                              src={imageMatch[2]}
                              alt={imageMatch[1]}
                              fill
                              style={{
                                objectFit: isSilantroReport
                                  ? "contain"
                                  : "cover",
                              }}
                              className="rounded-lg"
                            />
                          </div>
                        );
                      }

                      // 제목 처리
                      if (trimmed.startsWith("### ")) {
                        const text = trimmed.replace(/^###\s+/, "");
                        lineType.push("H3_HEADING");
                        headings.push({
                          line: actualLineNumber,
                          level: 3,
                          text,
                        });
                        console.log(
                          `Line ${formatLineNumber(
                            actualLineNumber
                          )} (content index ${formatLineNumber(
                            index
                          )}): ${lineType.join(" | ")} | "${text}"`
                        );
                        const marginTop = isFirstHeading ? "mt-0" : "mt-6";
                        isFirstHeading = false;
                        return (
                          <h3
                            key={index}
                            className={`text-base sm:text-[17px] md:text-lg lg:text-xl font-bold text-gray-900 ${marginTop} mb-2`}
                          >
                            {parseMarkdown(text, index)}
                          </h3>
                        );
                      }

                      if (trimmed.startsWith("## ")) {
                        const text = trimmed.replace(/^##\s+/, "");
                        lineType.push("H2_HEADING");
                        headings.push({
                          line: actualLineNumber,
                          level: 2,
                          text,
                        });
                        console.log(
                          `Line ${formatLineNumber(
                            actualLineNumber
                          )} (content index ${formatLineNumber(
                            index
                          )}): ${lineType.join(" | ")} | "${text}"`
                        );
                        const marginTop = isFirstHeading ? "mt-0" : "mt-8";
                        isFirstHeading = false;
                        return (
                          <h2
                            key={index}
                            className={`text-xl sm:text-[21px] md:text-[22px] lg:text-2xl font-bold text-gray-900 ${marginTop} mb-3`}
                          >
                            {parseMarkdown(text, index)}
                          </h2>
                        );
                      }

                      if (trimmed.startsWith("# ")) {
                        const text = trimmed.replace(/^#\s+/, "");
                        lineType.push("H1_HEADING");
                        headings.push({
                          line: actualLineNumber,
                          level: 1,
                          text,
                        });
                        console.log(
                          `Line ${formatLineNumber(
                            actualLineNumber
                          )} (content index ${formatLineNumber(
                            index
                          )}): ${lineType.join(" | ")} | "${text}"`
                        );
                        const marginTop = isFirstHeading ? "mt-0" : "mt-10";
                        isFirstHeading = false;
                        return (
                          <h1
                            key={index}
                            className={`text-[22px] sm:text-2xl md:text-[26px] lg:text-3xl font-bold text-gray-900 ${marginTop} mb-4`}
                          >
                            {parseMarkdown(text, index)}
                          </h1>
                        );
                      }

                      // 리스트 처리
                      if (
                        trimmed.startsWith("- ") ||
                        trimmed.startsWith("• ") ||
                        trimmed.startsWith("✓ ")
                      ) {
                        const text = trimmed.replace(/^[-•✓]\s+/, "");
                        if (trimmed.startsWith("✓ ")) {
                          lineType.push("CHECKLIST_ITEM");
                        } else {
                          lineType.push("UNORDERED_LIST");
                        }
                        console.log(
                          `Line ${formatLineNumber(
                            actualLineNumber
                          )} (content index ${formatLineNumber(
                            index
                          )}): ${lineType.join(" | ")} | ${trimmed.substring(
                            0,
                            60
                          )}`
                        );
                        return (
                          <div key={index} className="ml-4 flex items-start">
                            <span className="mr-2 mt-2.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0 block"></span>
                            <span>{parseMarkdown(text, index)}</span>
                          </div>
                        );
                      }

                      // 인용문 처리
                      if (trimmed.startsWith("> ")) {
                        const text = trimmed.replace(/^>\s+/, "");
                        lineType.push("BLOCKQUOTE");
                        console.log(
                          `Line ${formatLineNumber(
                            actualLineNumber
                          )} (content index ${formatLineNumber(
                            index
                          )}): ${lineType.join(" | ")} | ${trimmed.substring(
                            0,
                            60
                          )}`
                        );
                        return (
                          <blockquote
                            key={index}
                            className="border-l-4 border-purple-500 pl-3 sm:pl-4 italic text-gray-700 m-0 text-[15px] sm:text-[16px] md:text-[17px] lg:text-lg"
                          >
                            {parseMarkdown(text, index)}
                          </blockquote>
                        );
                      }

                      // 유튜브 링크 처리: [VIDEO]https://www.youtube.com/watch?v=...
                      if (
                        trimmed.startsWith("[VIDEO]") ||
                        trimmed.startsWith("[video]")
                      ) {
                        const url = trimmed.replace(/^\[VIDEO\]/i, "").trim();
                        lineType.push("YOUTUBE_VIDEO");

                        // 유튜브 비디오 ID 추출 함수
                        const extractYouTubeId = (
                          url: string
                        ): string | null => {
                          const patterns = [
                            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
                          ];

                          for (const pattern of patterns) {
                            const match = url.match(pattern);
                            if (match && match[1]) {
                              return match[1];
                            }
                          }
                          return null;
                        };

                        const videoId = extractYouTubeId(url);

                        console.log(
                          `Line ${formatLineNumber(
                            actualLineNumber
                          )} (content index ${formatLineNumber(
                            index
                          )}): ${lineType.join(" | ")} | ${videoId || url}`
                        );

                        if (videoId) {
                          return (
                            <div
                              key={index}
                              className="w-full my-6 rounded-lg overflow-hidden"
                              style={{ aspectRatio: "16/9" }}
                            >
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                              />
                            </div>
                          );
                        } else {
                          // 비디오 ID를 추출할 수 없는 경우 링크로 표시
                          return (
                            <div key={index} className="my-4">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 underline"
                              >
                                {url}
                              </a>
                            </div>
                          );
                        }
                      }

                      // 유튜브 링크가 포함된 일반 텍스트 처리
                      // [텍스트](유튜브URL) 형식 감지
                      const youtubeLinkRegex =
                        /\[([^\]]+)\]\((https?:\/\/[^)]+youtube[^)]+)\)/i;
                      const youtubeLinkMatch = trimmed.match(youtubeLinkRegex);

                      if (youtubeLinkMatch) {
                        const url = youtubeLinkMatch[2];

                        // 유튜브 비디오 ID 추출 함수
                        const extractYouTubeId = (
                          url: string
                        ): string | null => {
                          const patterns = [
                            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
                          ];

                          for (const pattern of patterns) {
                            const match = url.match(pattern);
                            if (match && match[1]) {
                              return match[1];
                            }
                          }
                          return null;
                        };

                        const videoId = extractYouTubeId(url);

                        if (videoId) {
                          lineType.push("YOUTUBE_VIDEO_INLINE");
                          console.log(
                            `Line ${formatLineNumber(
                              actualLineNumber
                            )} (content index ${formatLineNumber(
                              index
                            )}): ${lineType.join(" | ")} | ${videoId}`
                          );

                          return (
                            <div
                              key={index}
                              className="w-full my-6 rounded-lg overflow-hidden"
                              style={{ aspectRatio: "16/9" }}
                            >
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                              />
                            </div>
                          );
                        }
                      }

                      // 일반 텍스트: <p> 태그 사용
                      lineType.push("TEXT");
                      if (trimmed.includes("[") && trimmed.includes("](")) {
                        lineType.push("LINK");
                      }
                      console.log(
                        `Line ${formatLineNumber(
                          actualLineNumber
                        )} (content index ${formatLineNumber(
                          index
                        )}): ${lineType.join(" | ")} | ${trimmed.substring(
                          0,
                          60
                        )}${trimmed.length > 60 ? "..." : ""}`
                      );
                      return (
                        <p key={index} className="m-0">
                          {parseMarkdown(trimmed, index)}
                        </p>
                      );
                    });

                    // 헤딩 구조 요약 출력
                    console.log();
                    console.log("=".repeat(80));
                    console.log("[헤딩 구조 요약]");
                    console.log("=".repeat(80));
                    headings.forEach(({ line, level, text }) => {
                      const indent = "  ".repeat(level - 2);
                      console.log(
                        `${indent}Line ${formatLineNumber(
                          line
                        )}: H${level} | "${text}"`
                      );
                    });
                    console.log("=".repeat(80));

                    return parsedLines.filter((line) => line !== null);
                  })()}
                </div>
              )}
            </div>

            {/* 사이드바 정보 */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg md:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  프로젝트 정보
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-sm lg:text-base">
                  {project.partner && (
                    <div>
                      <span className="text-gray-500">파트너</span>
                      <p className="text-gray-900 font-medium">
                        {project.partner}
                      </p>
                    </div>
                  )}
                  {project.year && (
                    <div>
                      <span className="text-gray-500">연도</span>
                      <p className="text-gray-900 font-medium">
                        {project.year}
                      </p>
                    </div>
                  )}
                  {project.date && (
                    <div>
                      <span className="text-gray-500">날짜</span>
                      <p className="text-gray-900 font-medium">
                        {project.date}
                      </p>
                    </div>
                  )}
                  {project.category && (
                    <div>
                      <span className="text-gray-500">카테고리</span>
                      <p className="text-gray-900 font-medium">
                        {project.category}
                      </p>
                    </div>
                  )}
                  {project.link && project.link !== "#" && (
                    <div>
                      <span className="text-gray-500">관련 링크</span>
                      <p className="text-gray-900 font-medium">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 underline break-all"
                        >
                          {project.link.includes("youtube.com") ||
                          project.link.includes("youtu.be")
                            ? "유튜브 영상 보기 ↗"
                            : "프로젝트 링크 보기 ↗"}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 text-center">
          <h2 className="text-xl sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-gray-900 mb-3 sm:mb-4">
            다른 프로젝트도 둘러보세요
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[17px] lg:text-lg text-gray-600 mb-6 sm:mb-7 md:mb-8">
            쏘빅의 다양한 프로젝트를 만나보세요
          </p>
          <Link
            href="/project"
            className="inline-block bg-black text-white px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold hover:bg-gray-800 transition-colors rounded-full"
          >
            프로젝트 목록 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
