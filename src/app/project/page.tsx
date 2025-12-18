"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { NotionProject } from "@/types/notion";
import Footer from "../../components/Footer";

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
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // 카테고리 목록 생성
  const categories = [
    "전체",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  // 필터링된 프로젝트
  const filteredProjects =
    selectedCategory === "전체"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 섹션 */}
      <section className="pt-[100px] sm:pt-[110px] md:pt-[100px] pb-16 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          {/* 타이틀 */}
          <div className="mb-16 md:mb-20">
            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight max-w-4xl">
              <span className="md:hidden">
                쏘빅 SSOBIG은
                <br />
                {`'`}인터랙티브한 경험(IX){`'`}을 설계하고
                <br />
                실행하는 솔루션 기업입니다.
              </span>
              <span className="hidden md:inline">
                쏘빅 SSOBIG은 {`'`}인터랙티브한 경험(IX){`'`}을
                <br /> 설계하고 실행하는 솔루션 기업입니다.
              </span>
            </h1>
            <p className="text-[14px] sm:text-[15px] md:text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl">
              <span className="md:hidden">
                모임, 커뮤니티, 교육, 워크샵,
                <br />
                단체 행사, 영상 콘텐츠 등 포맷에 관계없이,
                <br />
                쏘빅은 클라이언트의 기획 의도를
                <br />
                {`'`}체계적인 게이미피케이션 시스템{`'`}과
                <br />
                {`'`}안정적인 기술 (쏘빅툴){`'`}, {`'`}빈틈없는 현장 운영{`'`}
                으로 구현합니다.
              </span>
              <span className="hidden md:inline">
                모임, 커뮤니티, 교육, 워크샵, 단체 행사, 영상 콘텐츠 등 포맷에
                관계없이,
                <br />
                쏘빅은 클라이언트의 기획 의도를 {`'`}체계적인 게이미피케이션
                시스템
                {`'`}과
                <br />
                {`'`}안정적인 기술 (쏘빅툴){`'`}, {`'`}빈틈없는 현장 운영{`'`}
                으로 구현합니다.
              </span>
            </p>
          </div>

          {/* 카테고리 필터 */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-[18px] sm:text-[22px] md:text-[26px] lg:text-[28px] font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
              진행한 프로젝트
            </h2>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-5 py-2 text-[13px] sm:text-sm md:text-base font-medium transition-all rounded-full ${
                    selectedCategory === category
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
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
              <p className="mt-4 text-sm sm:text-base text-gray-600">
                프로젝트를 불러오는 중...
              </p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-semibold mb-2">
                오류가 발생했습니다
              </p>
              <p className="text-red-500 text-sm">{error}</p>
              <p className="text-gray-600 text-sm mt-4">
                프로젝트 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
              </p>
            </div>
          )}

          {/* 프로젝트 그리드 */}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-sm sm:text-base md:text-lg text-gray-600">
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
                    <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-200 transition-all duration-300 group-hover:bg-gray-300">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-full object-cover"
                          unoptimized
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {project.category && <span>{project.category}</span>}
                        {project.year && (
                          <>
                            <span>•</span>
                            <span>{project.year}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 group-hover:underline">
                        {project.title}
                      </h3>
                      <p className="text-[13px] sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="text-right">
                        <span className="text-[10px] sm:text-xs text-gray-400">
                          자세히 보기 →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 md:py-24 border-t border-gray-200 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-[20px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
            함께 프로젝트를 만들어가고 싶으신가요?
          </h2>
          <p className="text-[14px] sm:text-base md:text-lg text-gray-600 mb-8 sm:mb-9 md:mb-10">
            쏘빅과 협업하거나 새로운 프로젝트를 시작해보세요
          </p>
          <a
            href="https://forms.gle/BjQMEKSvEruWxEuNA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-8 sm:px-9 md:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base font-semibold hover:bg-gray-800 transition-colors"
          >
            협업 문의하기
          </a>
        </div>
      </section>

      <Footer mode="light" />
    </div>
  );
}
