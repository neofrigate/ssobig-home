"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { NotionProject } from "@/types/notion";

export default function ProjectPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [projects, setProjects] = useState<NotionProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notion API에서 프로젝트 데이터 가져오기
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        
        if (!response.ok) {
          throw new Error("프로젝트를 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setProjects(data.projects || []);
        setError(null);
      } catch (err) {
        console.error("프로젝트 로딩 오류:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // 카테고리 목록 생성
  const categories = ["전체", ...Array.from(new Set(projects.map((p) => p.category)))];

  // 필터링된 프로젝트
  const filteredProjects =
    selectedCategory === "전체"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-black pt-[88px] md:pt-[60px]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl">
          <h1 className="text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold text-white mb-4 sm:mb-6 leading-tight">
            프로젝트 포트폴리오
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 leading-relaxed">
            쏘빅이 만들어온 다양한 프로젝트와 성과를 소개합니다
          </p>
        </div>
      </section>

      {/* 소개 섹션 */}
      <section className="py-12 md:py-16 lg:py-20 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                50+
              </div>
              <p className="text-base md:text-lg text-gray-600">진행한 프로젝트</p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                10,000+
              </div>
              <p className="text-base md:text-lg text-gray-600">참여한 사람들</p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                97%
              </div>
              <p className="text-base md:text-lg text-gray-600">평균 만족도</p>
            </div>
          </div>
        </div>
      </section>

      {/* 프로젝트 리스트 섹션 */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          {/* 타이틀 및 필터 */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] font-bold text-gray-900 mb-4 leading-tight">
              우리의 프로젝트
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-3xl leading-relaxed">
              쏘빅이 만들어가는 특별한 경험들을 소개합니다
            </p>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">프로젝트를 불러오는 중...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-semibold mb-2">오류가 발생했습니다</p>
              <p className="text-red-500 text-sm">{error}</p>
              <p className="text-gray-600 text-sm mt-4">
                .env.local 파일에 NOTION_API_KEY와 NOTION_DATABASE_ID가 설정되어 있는지 확인해주세요.
              </p>
            </div>
          )}

          {/* 프로젝트 그리드 */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg">
                    해당 카테고리에 프로젝트가 없습니다.
                  </p>
                </div>
              ) : (
                filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group block"
              >
                <div className="relative h-64 md:h-72 mb-6 rounded-lg overflow-hidden bg-gray-100">
                  {project.id ? (
                    <Image
                      src={`/api/notion-image?pageId=${project.id}&property=썸네일`}
                      alt={project.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                      onError={(e) => {
                        // Fallback to placeholder on error
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                      <span className="text-gray-400 text-lg font-semibold">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  {/* 연도 배지 */}
                  {project.year && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                      {project.year}
                    </div>
                  )}
                </div>
                {project.category && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs md:text-sm rounded-full font-medium">
                      {project.category}
                    </span>
                  </div>
                )}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-base text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <span className="inline-flex items-center text-black font-semibold group-hover:underline">
                  자세히 보기 →
                </span>
              </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-bold text-gray-900 mb-4">
            함께 프로젝트를 만들어가고 싶으신가요?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            쏘빅과 협업하거나 새로운 프로젝트를 시작해보세요
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScgHycMgGfhps6DjY_TvZPoYu-kgAeD0crK9n_sFoDeDMgX8g/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors rounded-full"
          >
            협업 문의하기
          </a>
        </div>
      </section>
    </div>
  );
}
