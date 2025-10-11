"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SocialingPage() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const container = document.querySelector(".snap-container");
    if (!container) return;

    const handleScroll = () => {
      const sections = container.querySelectorAll("section");
      const scrollPosition = container.scrollTop;
      const windowHeight = window.innerHeight;

      sections.forEach((section, index) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;

        if (
          scrollPosition >= sectionTop - windowHeight / 2 &&
          scrollPosition < sectionTop + sectionHeight - windowHeight / 2
        ) {
          setActiveSection(index);
        }
      });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="snap-container h-[100svh] overflow-y-scroll snap-y snap-mandatory -mt-[88px] md:-mt-[60px]">
      {/* 페이지네이션 인디케이터 - 오른쪽 중간 (세로 버전) */}
      <div className="fixed right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => {
              const container = document.querySelector(".snap-container");
              const sections = container?.querySelectorAll("section");
              if (sections && sections[index]) {
                sections[index].scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`w-2 rounded-full transition-all duration-700 ${
              index === activeSection
                ? activeSection === 2
                  ? "bg-gray-900 h-8"
                  : "bg-white h-8"
                : activeSection === 2
                ? "bg-gray-900/50 h-2"
                : "bg-white/50 h-2"
            }`}
            aria-label={`${index + 1}번 섹션으로 이동`}
          />
        ))}
      </div>

      {/* 1. 러브버디즈 섹션 - 풀페이지 */}
      <section className="relative min-h-[100svh] snap-start flex items-center justify-center overflow-hidden pt-[88px] md:pt-[60px]">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ssobig_assets/background/배경_러브버디즈.png"
            alt="러브버디즈 배경"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            priority
            sizes="100vw"
            quality={100}
          />
        </div>

        {/* 오버레이 - 위에서 아래로 투명도 그라데이션 (80% → 50%) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/50 z-[1]"></div>

        {/* 컨텐츠 - 좌측 정렬 */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            러브버디즈
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 sm:mb-10 leading-relaxed">
            &apos;술&apos;없이 사람의 매력으로 알아가기
          </p>

          <div className="space-y-3 text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10">
            <p>명확한 컨셉으로 몰입도 UP!</p>
            <p>참가자간의 정보가 실시간으로 반영되는 인터랙티브 콘텐츠</p>
            <p className="font-semibold">누적 참가자 20K</p>
          </div>

          <Link
            href="/socialing/love-buddies"
            className="inline-block bg-white text-black px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors rounded-full"
          >
            러브버디즈 자세히 보기 →
          </Link>
        </div>

        {/* 스크롤 인디케이터 - 하단 중앙 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* 2. 게임오브 섹션 - 풀페이지 */}
      <section className="relative h-screen snap-start flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ssobig_assets/background/배경_게임오브.png"
            alt="게임오브 배경"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            sizes="100vw"
            quality={100}
          />
        </div>

        {/* 오버레이 - 위에서 아래로 투명도 그라데이션 (80% → 50%) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/50 z-[1]"></div>

        {/* 컨텐츠 - 좌측 정렬 */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            게임오브
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 sm:mb-10 leading-relaxed">
            무료한 일상은 그만! 게임으로 찐친 만들기
          </p>

          <div className="space-y-3 text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10">
            <p>뻔한 게임이 아닌 어디서도 못해본 독창적 콘텐츠</p>
            <p className="font-semibold">3명 중 1명은 재구매!</p>
            <p>100명+ 대규모 이벤트(출장, 행사 등) 진행</p>
          </div>

          <Link
            href="/socialing/game-orb"
            className="inline-block bg-white text-black px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors rounded-full"
          >
            게임오브 자세히 보기 →
          </Link>
        </div>
      </section>

      {/* 3. 쏘빅툴 섹션 - 화이트 배경 */}
      <section className="relative h-screen snap-start bg-white overflow-hidden">
        <div className="h-full flex flex-col justify-center py-20">
          {/* 타이틀 */}
          <div className="max-w-7xl mx-auto px-5 md:px-10 mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              쏘빅툴로 더 쉽게 즐기기
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
              핸드폰 하나로 시작하는 다양한 콘텐츠
            </p>
          </div>

          {/* 가로 스크롤 애니메이션 - 무한 반복 */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* 첫 번째 세트 */}
              <div className="flex gap-6 px-3">
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/일일남매 상세1.jpg"
                      alt="일일남매"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/불면증 마피아.png"
                      alt="불면증 마피아"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/소셜지니어스.png"
                      alt="소셜지니어스"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/알파남매 포스터.jpg"
                      alt="알파남매"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/이중스파이 포스터.png"
                      alt="이중스파이"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/wizard_frog.png"
                      alt="위저드 프로그"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* 두 번째 세트 (무한 스크롤을 위한 복제) */}
              <div className="flex gap-6 px-3">
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/일일남매 상세1.jpg"
                      alt="일일남매"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/불면증 마피아.png"
                      alt="불면증 마피아"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/소셜지니어스.png"
                      alt="소셜지니어스"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/알파남매 포스터.jpg"
                      alt="알파남매"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/이중스파이 포스터.png"
                      alt="이중스파이"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-[200px] md:w-[280px] flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/ssobig_assets/wizard_frog.png"
                      alt="위저드 프로그"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-7xl mx-auto px-5 md:px-10 mt-12">
            <a
              href="https://about.ssobig.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-gray-800 transition-colors rounded-full"
            >
              쏘빅툴 둘러보기 →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
