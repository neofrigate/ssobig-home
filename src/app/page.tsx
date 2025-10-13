"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black -mt-[88px] md:-mt-[60px]">
      {/* 1. 히어로 섹션 - 전체 화면 (중앙 정렬 유지) - GNB와 겹침 */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-[88px] md:pt-[60px]">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ssobig_assets/lovebuddies/hero-main.jpg"
            alt="쏘빅 배경"
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

        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>

        {/* 중앙 컨텐츠 */}
        <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl">
          <h1 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-bold text-white mb-4 sm:mb-6 leading-tight">
            5명의 소중한 시간부터
            <br />
            100명의 특별한 순간까지
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 md:mb-12 leading-relaxed">
            핸드폰 하나로 시작하는 검증된 재미
            <br />
            언제 어디서나 함께 즐길 수 있는 특별한 콘텐츠
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/playroom"
              className="bg-white text-black px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold hover:bg-gray-100 transition-colors rounded-full"
            >
              친구들과 즐기기
            </Link>
            <Link
              href="/socialing"
              className="bg-black text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold hover:bg-black/80 transition-colors rounded-full"
            >
              새로운 사람과 알아가기
            </Link>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
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

      {/* 나머지 섹션들 - 좌측 정렬 */}
      <div className="bg-white relative">
        {/* 2. 쏘빅툴 소개 - 좌측 정렬 */}
        <section className="py-12 md:py-16 lg:py-20 border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
            {/* 타이틀 영역 - 좌측 정렬 */}
            <div className="mb-12 md:mb-16">
              <div className="mb-6">
                <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold text-gray-900 leading-tight">
                  SSOBIG TOOL
                </h2>
              </div>
              <h3 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-gray-900 mb-4 leading-tight">
                핸드폰만 있으면, 언제 어디서나 바로 시작
              </h3>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed">
                친구들과 카페에서? 연인과 집에서? 동아리 MT에서?
                <br />
                어떤 상황이든 모바일 하나로 함께 즐길 수 있는 검증된 템플릿을
                만나보세요
              </p>
            </div>

            {/* 4가지 강점 - 좌측 정렬 그리드 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
              <div>
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">📱</div>
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  언제 어디서나
                </h4>
                <p className="text-gray-600 text-sm md:text-base">
                  모바일 플랫폼으로 즉시 접근 가능
                </p>
              </div>

              <div>
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">👥</div>
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  함께하는 재미
                </h4>
                <p className="text-gray-600 text-sm md:text-base">
                  80% 이상이 멀티플레이 긍정평가
                </p>
              </div>

              <div>
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">⚡</div>
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  검증된 콘텐츠
                </h4>
                <p className="text-gray-600 text-sm md:text-base">
                  오프라인 검증된 97% 만족도
                </p>
              </div>

              <div>
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">🎯</div>
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  다양한 상황
                </h4>
                <p className="text-gray-600 text-sm md:text-base">
                  2명부터 100명까지 모든 상황 대응
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/playroom"
                className="border border-black text-black px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold hover:bg-black hover:text-white transition-colors rounded-full"
              >
                템플릿 둘러보기
              </Link>
            </div>
          </div>
        </section>

        {/* 3. 소셜링 소개 - 좌측 정렬 */}
        <section className="py-12 md:py-16 lg:py-20 border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
            {/* 타이틀 */}
            <div className="mb-12 md:mb-16">
              <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold text-gray-900 mb-4 leading-tight">
                같이 즐길 사람이 없다고? 걱정 마세요
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed">
                혼자 오셔도 괜찮아요. 새로운 사람들과 대규모로 함께 즐길 수 있는
                특별한 소셜링도 운영 중입니다
              </p>
            </div>

            {/* 소셜링 리스트 */}
            <div className="space-y-12">
              {/* 러브버디즈 */}
              <Link href="/socialing/love-buddies" className="group block">
                <div className="grid md:grid-cols-2 gap-8 items-center pb-12 border-b border-gray-200">
                  <div className="relative h-64 md:h-80">
                    <Image
                      src="/ssobig_assets/lovebuddies/thumb-main.png"
                      alt="러브버디즈"
                      fill
                      style={{ objectFit: "contain", objectPosition: "left" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                      💕 러브버디즈
                    </h3>
                    <p className="text-base md:text-lg text-gray-600 mb-3 md:mb-4">
                      술 없이도 친해지는 소셜 개더링
                    </p>
                    <ul className="space-y-2 mb-6 text-gray-600">
                      <li>· 관계 형성 특화 콘텐츠</li>
                      <li>· 2.5-3시간 | 97% 만족도</li>
                      <li>· 일일남매 시스템으로 자연스러운 만남</li>
                    </ul>
                    <span className="text-black font-semibold group-hover:underline">
                      자세히 보기 →
                    </span>
                  </div>
                </div>
              </Link>

              {/* 게임오브 */}
              <Link href="/socialing/game-orb" className="group block">
                <div className="grid md:grid-cols-2 gap-8 items-center pb-12 border-b border-gray-200">
                  <div className="relative h-64 md:h-80">
                    <Image
                      src="/ssobig_assets/gameorb/thumb-main.png"
                      alt="게임오브"
                      fill
                      style={{ objectFit: "contain", objectPosition: "left" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                      🎲 게임오브
                    </h3>
                    <p className="text-base md:text-lg text-gray-600 mb-3 md:mb-4">
                      당신이 주인공인 게임 예능 현실판
                    </p>
                    <ul className="space-y-2 mb-6 text-gray-600">
                      <li>· 대규모 이벤트 운영 (최대 100명+)</li>
                      <li>· 3시간 | 97% 만족도</li>
                      <li>· 자체 제작 독창적 게임</li>
                    </ul>
                    <span className="text-black font-semibold group-hover:underline">
                      자세히 보기 →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-12">
              <Link
                href="/socialing"
                className="inline-block border border-black text-black px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold hover:bg-black hover:text-white transition-colors rounded-full"
              >
                소셜링 자세히 보기
              </Link>
            </div>
          </div>
        </section>

        {/* 4. 협업 실적 - 좌측 정렬 */}
        <section className="py-12 md:py-16 lg:py-20 border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
            {/* 타이틀 */}
            <div className="mb-12 md:mb-16">
              <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold text-gray-900 mb-4 leading-tight">
                다양한 파트너들과 함께하고 있습니다
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mb-2 leading-relaxed">
                맞춤형 오프라인 콘텐츠 설계부터 제작, 대규모 행사 운영까지
              </p>
              <p className="text-base text-gray-900 font-semibold">
                10명부터 100명 이상까지, 모든 규모의 행사를 완벽하게 소화합니다
              </p>
            </div>

            {/* 협업 타입 - 그리드 */}
            <div className="grid sm:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
              <div>
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">🎥</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                  유튜브 협업
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  대형 크리에이터와 콘텐츠 협업
                  <br />
                  기획부터 제작까지 원스톱
                </p>
              </div>

              <div>
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">🏢</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                  B2B/B2G 행사
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  정부·지자체 & 기업 행사 전문
                  <br />
                  맞춤형 워크숍 & 팀 빌딩
                </p>
              </div>

              <div>
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">🎪</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                  축제/이벤트
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  대학 축제부터 지역 축제까지
                  <br />
                  특별 프로그램 제공
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 최종 CTA - 좌측 정렬 */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-10 md:mb-12">
              <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold text-gray-900 mb-4 leading-tight">
                함께 시작할 준비 되셨나요?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                쏘빅과 함께 특별한 경험을 만들어보세요
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              <Link href="/playroom" className="group">
                <div className="pb-6 md:pb-8 border-b border-gray-200 group-hover:border-black transition-colors">
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">🎯</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    템플릿 사용하기
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                    쏘빅툴로 바로 시작
                  </p>
                  <span className="text-sm md:text-base text-black font-semibold group-hover:underline">
                    시작하기 →
                  </span>
                </div>
              </Link>

              <Link href="/socialing" className="group">
                <div className="pb-6 md:pb-8 border-b border-gray-200 group-hover:border-black transition-colors">
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">💝</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    소셜링 참여하기
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                    러브버디즈, 게임오브
                  </p>
                  <span className="text-sm md:text-base text-black font-semibold group-hover:underline">
                    신청하기 →
                  </span>
                </div>
              </Link>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScgHycMgGfhps6DjY_TvZPoYu-kgAeD0crK9n_sFoDeDMgX8g/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="pb-6 md:pb-8 border-b border-gray-200 group-hover:border-black transition-colors">
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">🤝</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    협업 문의하기
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                    B2B/B2G 파트너십
                  </p>
                  <span className="text-sm md:text-base text-black font-semibold group-hover:underline">
                    문의하기 →
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="text-gray-500 text-xs leading-relaxed">
            {/* 상단: 회사명 + SNS 버튼들 */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-700 text-base">
                주식회사 쏘빅
              </p>
              <div className="flex items-center gap-2">
                {/* 인스타그램 */}
                <a
                  href="https://www.instagram.com/ssobig_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                  aria-label="인스타그램"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* 유튜브 */}
                <a
                  href="https://www.youtube.com/@ssobig"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                  aria-label="유튜브"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* 사업자 정보 토글 */}
            <button
              onClick={() => setIsFooterOpen(!isFooterOpen)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
            >
              <span className="text-xs font-medium">사업자 정보</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  isFooterOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* 펼쳐지는 상세 정보 */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isFooterOpen ? "max-h-[300px] mb-4" : "max-h-0"
              }`}
            >
              <div className="pt-2 pb-3">
                <p className="mb-1">대표자 : 안민우, 조원철</p>
                <p className="mb-1">사업자등록번호 : 140-87-03096</p>
                <p className="mb-1">전화번호 : 02-2635-7942</p>
                <p className="mb-1">E-mail : ssobigstudio@gmail.com</p>
                <p className="mb-1">
                  통신판매업신고번호 : 제2024-서울영등포-0816호
                </p>
                <p>
                  주소 : 서울특별시 서초구 사평대로55길 37,
                  (실란트로타워)지하2층 (반포동)
                </p>
              </div>
            </div>

            {/* 약관 링크 - 항상 표시 */}
            <p className="text-gray-400 pt-3">
              <Link
                href="https://about.ssobig.com/privacy_policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600 underline"
              >
                개인정보 처리방침
              </Link>
              <span className="mx-2">|</span>
              <Link
                href="https://about.ssobig.com/terms_of_service"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600 underline"
              >
                이용약관
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
