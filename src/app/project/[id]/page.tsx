"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

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

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        
        // params를 await로 unwrap
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setProjectId(id);
        
        const response = await fetch(`/api/projects/${id}`);
        
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
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/project"
            className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            프로젝트 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[60px]">
      {/* 메인 컨텐츠 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          {/* 뒤로가기 버튼 */}
          <Link
            href="/project"
            className="inline-flex items-center text-gray-600 hover:text-black mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
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
          <div className="mb-8">
            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-gray-900 mb-4 leading-tight">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {project.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              {project.category && (
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {project.category}
                </span>
              )}
              {project.year && (
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {project.year}
                </span>
              )}
            </div>
          </div>

          {/* 이미지 갤러리 */}
          {projectId && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">이미지 갤러리</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 썸네일 이미지 */}
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={`/api/notion-image?pageId=${projectId}&property=썸네일`}
                    alt={`${project.title} 썸네일`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                {/* 추가 이미지 */}
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={`/api/notion-image?pageId=${projectId}&property=이미지`}
                    alt={`${project.title} 이미지`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 프로젝트 정보 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* 기본 정보 */}
            <div className="md:col-span-2 space-y-8">
              {project.partner && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">파트너</h2>
                  <p className="text-gray-700 text-lg">{project.partner}</p>
                </div>
              )}

              {project.content && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">프로젝트 상세</h2>
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {project.content.split('\n').map((line, index) => {
                        // 헤딩 처리
                        if (line.startsWith('### ')) {
                          return (
                            <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                              {line.substring(4)}
                            </h3>
                          );
                        }
                        if (line.startsWith('## ')) {
                          return (
                            <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                              {line.substring(3)}
                            </h2>
                          );
                        }
                        if (line.startsWith('# ')) {
                          return (
                            <h1 key={index} className="text-3xl font-bold text-gray-900 mt-10 mb-5">
                              {line.substring(2)}
                            </h1>
                          );
                        }
                        // 리스트 처리
                        if (line.startsWith('• ') || line.startsWith('- ')) {
                          return (
                            <li key={index} className="ml-4 mb-2">
                              {line.substring(2)}
                            </li>
                          );
                        }
                        // 구분선
                        if (line === '---') {
                          return <hr key={index} className="my-6 border-gray-300" />;
                        }
                        // 비디오/Embed 처리 (유튜브 등)
                        if (line.startsWith('[VIDEO]') || line.startsWith('[EMBED]')) {
                          const url = line.substring(line.indexOf(']') + 1);
                          // 유튜브 URL인지 확인
                          const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                          if (youtubeMatch) {
                            const videoId = youtubeMatch[1];
                            return (
                              <div key={index} className="my-6">
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                  <iframe
                                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title="YouTube video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                              </div>
                            );
                          }
                          // 유튜브가 아닌 경우 링크로 표시
                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 underline block my-2"
                            >
                              {url}
                            </a>
                          );
                        }
                        // 링크/북마크 처리
                        if (line.startsWith('[LINK]')) {
                          const url = line.substring(6);
                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 underline block my-2"
                            >
                              {url}
                            </a>
                          );
                        }
                        // 일반 URL 처리
                        if (line.startsWith('http://') || line.startsWith('https://')) {
                          return (
                            <a
                              key={index}
                              href={line}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 underline block my-2"
                            >
                              {line}
                            </a>
                          );
                        }
                        // 일반 텍스트
                        if (line.trim()) {
                          return (
                            <p key={index} className="mb-3">
                              {line}
                            </p>
                          );
                        }
                        return <br key={index} />;
                      })}
                    </div>
                  </div>
                </div>
              )}

              {project.tags && project.tags.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">태그</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.selection && project.selection.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">선택 항목</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.selection.map((item) => (
                      <span
                        key={item}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 사이드바 정보 */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">프로젝트 정보</h3>
                <div className="space-y-3 text-sm">
                  {project.year && (
                    <div>
                      <span className="text-gray-500">연도</span>
                      <p className="text-gray-900 font-medium">{project.year}</p>
                    </div>
                  )}
                  {project.date && (
                    <div>
                      <span className="text-gray-500">날짜</span>
                      <p className="text-gray-900 font-medium">{project.date}</p>
                    </div>
                  )}
                  {project.category && (
                    <div>
                      <span className="text-gray-500">카테고리</span>
                      <p className="text-gray-900 font-medium">{project.category}</p>
                    </div>
                  )}
                </div>
              </div>

              {project.link && project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-black text-white text-center px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  외부 링크 방문 →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-bold text-gray-900 mb-4">
            다른 프로젝트도 둘러보세요
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            쏘빅의 다양한 프로젝트를 만나보세요
          </p>
          <Link
            href="/project"
            className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors rounded-full"
          >
            프로젝트 목록 보기
          </Link>
        </div>
      </section>
    </div>
  );
}

