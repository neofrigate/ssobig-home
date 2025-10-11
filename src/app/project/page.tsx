"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProjectPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-black pt-[88px] md:pt-[60px]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl">
          <h1 className="text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold text-white mb-4 sm:mb-6 leading-tight">
            프로젝트
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 leading-relaxed">
            쏘빅의 다양한 프로젝트를 만나보세요
          </p>
        </div>
      </section>

      {/* 프로젝트 리스트 섹션 */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <h2 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] font-bold text-gray-900 mb-4 leading-tight">
              진행 중인 프로젝트
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed">
              쏘빅이 만들어가는 특별한 경험들을 소개합니다
            </p>
          </div>

          {/* 프로젝트 그리드 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* 프로젝트 카드 1 - 예시 */}
            <div className="group">
              <div className="relative h-64 md:h-80 mb-6 rounded-lg overflow-hidden bg-gray-100">
                {/* 프로젝트 이미지를 여기에 추가하세요 */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-lg">프로젝트 이미지</span>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                프로젝트 제목
              </h3>
              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                프로젝트에 대한 간단한 설명을 여기에 작성하세요.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  태그1
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  태그2
                </span>
              </div>
              <Link
                href="#"
                className="inline-flex items-center text-black font-semibold hover:underline"
              >
                자세히 보기 →
              </Link>
            </div>

            {/* 프로젝트 카드 2 - 예시 */}
            <div className="group">
              <div className="relative h-64 md:h-80 mb-6 rounded-lg overflow-hidden bg-gray-100">
                {/* 프로젝트 이미지를 여기에 추가하세요 */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-lg">프로젝트 이미지</span>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                프로젝트 제목
              </h3>
              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                프로젝트에 대한 간단한 설명을 여기에 작성하세요.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  태그1
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  태그2
                </span>
              </div>
              <Link
                href="#"
                className="inline-flex items-center text-black font-semibold hover:underline"
              >
                자세히 보기 →
              </Link>
            </div>
          </div>
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
          <Link
            href="/contact"
            className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors rounded-full"
          >
            문의하기
          </Link>
        </div>
      </section>
    </div>
  );
}
