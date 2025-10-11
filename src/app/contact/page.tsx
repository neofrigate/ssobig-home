import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Contact - Ssobig 협업 문의",
  description:
    "B2B/B2G 협업 문의를 환영합니다. 쏘빅과 함께 특별한 경험을 만들어보세요.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen text-neutral-100 font-sans relative flex flex-col items-center pt-[72px] selection:bg-orange-500 selection:text-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/ssobig_assets/러브버디즈 배경.jpg"
          alt="배경"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
          sizes="100vw"
          className="fixed"
        />
      </div>

      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/90 z-[1]"></div>

      {/* 콘텐츠 */}
      <main className="w-full max-w-4xl mx-auto z-10 relative px-5 py-10">
        {/* 헤더 */}
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            🤝 Contact Us
          </h1>
          <p className="text-xl text-neutral-300 leading-relaxed">
            B2B / B2G 협업 문의를 환영합니다
          </p>
        </header>

        {/* 협업 사례 */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            이런 분들과 함께합니다
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-xl font-bold text-white mb-2">기업</h3>
              <p className="text-neutral-300 text-sm">
                임직원 워크샵, 팀빌딩, 신입사원 교육, 네트워킹 이벤트
              </p>
            </div>

            <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-xl font-bold text-white mb-2">대학교</h3>
              <p className="text-neutral-300 text-sm">
                신입생 OT, 학과 행사, 동아리 모임, 축제 부스
              </p>
            </div>

            <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="text-xl font-bold text-white mb-2">공공기관</h3>
              <p className="text-neutral-300 text-sm">
                청년 프로그램, 지역 축제, 주민 화합 행사
              </p>
            </div>

            <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-3">🎪</div>
              <h3 className="text-xl font-bold text-white mb-2">행사 기획사</h3>
              <p className="text-neutral-300 text-sm">
                이벤트 콘텐츠, 참여형 프로그램, 게임화 솔루션
              </p>
            </div>

            <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-3">🏨</div>
              <h3 className="text-xl font-bold text-white mb-2">숙박/공간</h3>
              <p className="text-neutral-300 text-sm">
                게스트하우스, 리조트, 캠핑장 등의 프로그램 운영
              </p>
            </div>

            <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-xl font-bold text-white mb-2">기타</h3>
              <p className="text-neutral-300 text-sm">
                특별한 아이디어가 있다면 언제든 연락주세요
              </p>
            </div>
          </div>
        </section>

        {/* 제공 서비스 */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            제공 서비스
          </h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-900/30 to-black/90 rounded-2xl p-8 border border-orange-500/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl">
                  🛠️
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    쏘빅툴 제공
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    템플릿 기반 소셜링 플랫폼을 활용한 맞춤형 프로그램 제공
                    <br />
                    - 기존 템플릿 커스터마이징
                    <br />
                    - 브랜드 맞춤 콘텐츠 개발
                    <br />- 실시간 운영 지원
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-900/30 to-black/90 rounded-2xl p-8 border border-pink-500/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-2xl">
                  💝
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    러브버디즈 협업
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    매칭/소셜링 이벤트 기획 및 운영
                    <br />
                    - 기업 대상 소셜 네트워킹
                    <br />
                    - 대학 연합 소셜링
                    <br />- 지역 기반 만남 프로그램
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-black/90 rounded-2xl p-8 border border-purple-500/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl">
                  🎮
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    게임오브 협업
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    TV 예능 스타일 게임 이벤트
                    <br />
                    - 팀빌딩 게임 프로그램
                    <br />
                    - 사내 게임 대회
                    <br />- 특별 이벤트 기획
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                  🎨
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    맞춤 제작
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    특별한 요구사항에 맞춘 완전 커스텀 솔루션
                    <br />
                    - 콘텐츠 기획부터 개발까지
                    <br />
                    - 브랜드 아이덴티티 반영
                    <br />- 현장 운영 지원
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 실적 */}
        <section className="mb-16">
          <div className="bg-neutral-900/60 rounded-3xl p-8 md:p-12 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              함께한 실적
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                  500+
                </div>
                <p className="text-neutral-300">누적 이벤트</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                  10,000+
                </div>
                <p className="text-neutral-300">누적 참여자</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                  50+
                </div>
                <p className="text-neutral-300">파트너 기업/기관</p>
              </div>
            </div>
            <p className="text-center text-neutral-400">
              서울대, 연세대, 고려대, 카카오, 네이버, 서울시 등과 함께했습니다
            </p>
          </div>
        </section>

        {/* 문의 방법 */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-orange-600/20 to-orange-500/10 rounded-3xl p-10 border border-orange-500/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              문의 방법
            </h2>

            <div className="space-y-6 mb-8">
              <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📧</span>
                  <h3 className="text-xl font-bold text-white">이메일</h3>
                </div>
                <a
                  href="mailto:ssobigstudio@gmail.com"
                  className="text-orange-400 hover:text-orange-300 text-lg font-mono"
                >
                  ssobigstudio@gmail.com
                </a>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📞</span>
                  <h3 className="text-xl font-bold text-white">전화</h3>
                </div>
                <a
                  href="tel:02-2635-7942"
                  className="text-orange-400 hover:text-orange-300 text-lg font-mono"
                >
                  02-2635-7942
                </a>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💬</span>
                  <h3 className="text-xl font-bold text-white">
                    카카오톡 채널
                  </h3>
                </div>
                <p className="text-neutral-300 mb-3">
                  우측 하단의 채널톡을 통해 실시간 상담 가능합니다
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-neutral-300 text-center leading-relaxed">
                <span className="text-white font-semibold">
                  💡 빠른 답변을 위한 팁
                </span>
                <br />
                <br />
                문의 시 아래 내용을 포함해주시면 더 빠른 답변이 가능합니다:
                <br />
                • 기관/기업명 및 담당자 정보
                <br />
                • 예상 참여 인원 및 일정
                <br />
                • 원하시는 프로그램 유형
                <br />• 예산 범위 (선택사항)
              </p>
            </div>
          </div>
        </section>

        {/* 하단 링크 */}
        <section className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-center hover:bg-white/20 transition-all border border-white/20"
            >
              홈으로 돌아가기
            </Link>
            <Link
              href="/how-to-play"
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-center hover:bg-white/20 transition-all border border-white/20"
            >
              이용 가이드 보기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
