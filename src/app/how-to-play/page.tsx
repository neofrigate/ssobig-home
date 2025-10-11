import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "How to Play - Ssobig Tool 이용 가이드",
  description:
    "쏘빅툴 템플릿 플레이 방법을 알아보세요. 누구나 쉽게 시작할 수 있습니다.",
};

export default function HowToPlayPage() {
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
            🎮 How to Play
          </h1>
          <p className="text-xl text-neutral-300 leading-relaxed">
            쏘빅툴 템플릿 플레이 방법 완벽 가이드
          </p>
        </header>

        {/* Step by Step 가이드 */}
        <section className="space-y-8 mb-16">
          {/* Step 1 */}
          <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  템플릿 선택하기
                </h2>
                <p className="text-lg text-neutral-300 mb-4 leading-relaxed">
                  <a
                    href="https://about.ssobig.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline"
                  >
                    about.ssobig.com
                  </a>
                  에서 원하는 템플릿을 선택하세요.
                  <br />
                  다양한 테마의 템플릿이 준비되어 있습니다.
                </p>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>아이스브레이킹 템플릿 (첫 만남에 최적)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>팀빌딩 게임 (협업과 친밀도 향상)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>심리 게임 (깊은 대화와 이해)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>파티 게임 (즐거운 분위기 조성)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  방 만들기
                </h2>
                <p className="text-lg text-neutral-300 mb-4 leading-relaxed">
                  템플릿을 선택하면 자동으로 방이 생성됩니다.
                  <br />방 링크를 참여자들에게 공유하세요.
                </p>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <p className="text-sm text-neutral-400 mb-2">💡 Tip</p>
                  <p className="text-neutral-300">
                    방 링크는 카카오톡, 문자, 이메일 등 어떤 방법으로든 공유할
                    수 있습니다. QR코드로도 제공되어 현장에서 바로 접속
                    가능합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  참여자 입장
                </h2>
                <p className="text-lg text-neutral-300 mb-4 leading-relaxed">
                  참여자들은 링크를 클릭하기만 하면 바로 입장!
                  <br />앱 설치나 회원가입 없이 즉시 참여 가능합니다.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-2">📱</div>
                    <h3 className="text-white font-semibold mb-1">
                      모바일 접속
                    </h3>
                    <p className="text-sm text-neutral-400">
                      스마트폰으로 간편하게
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-2">💻</div>
                    <h3 className="text-white font-semibold mb-1">PC 접속</h3>
                    <p className="text-sm text-neutral-400">
                      큰 화면으로 편하게
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  게임 진행
                </h2>
                <p className="text-lg text-neutral-300 mb-4 leading-relaxed">
                  호스트가 게임을 시작하면 모든 참여자의 화면이 동시에
                  진행됩니다.
                  <br />
                  실시간으로 반응을 확인하고 함께 즐기세요!
                </p>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">✓</span>
                    <span>실시간 반응 확인</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">✓</span>
                    <span>참여자 답변 즉시 공유</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">✓</span>
                    <span>자동 타이머 및 결과 집계</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  결과 확인 & 마무리
                </h2>
                <p className="text-lg text-neutral-300 mb-4 leading-relaxed">
                  게임이 끝나면 결과를 확인하고 저장할 수 있습니다.
                  <br />
                  참여자들과 특별한 추억을 만들어보세요!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 특징 섹션 */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            왜 쏘빅툴인가요?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">빠른 시작</h3>
              <p className="text-neutral-300">
                복잡한 준비 없이 5분 안에 시작 가능
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">
                검증된 템플릿
              </h3>
              <p className="text-neutral-300">
                500회 이상 사용된 검증된 콘텐츠
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-white mb-2">
                실시간 동기화
              </h3>
              <p className="text-neutral-300">모든 참여자가 동시에 경험</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-2">
                모든 기기 지원
              </h3>
              <p className="text-neutral-300">PC, 모바일, 태블릿 모두 OK</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-2">
                다양한 템플릿
              </h3>
              <p className="text-neutral-300">상황별 맞춤 템플릿 제공</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">실시간 지원</h3>
              <p className="text-neutral-300">문제 발생 시 즉시 지원</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-orange-600/20 to-orange-500/10 rounded-3xl p-10 border border-orange-500/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 시작해보세요!
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              템플릿을 선택하고 5분 안에 첫 모임을 시작하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://about.ssobig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-center hover:bg-orange-600 transition-all hover:scale-105"
              >
                템플릿 둘러보기 →
              </a>
              <Link
                href="/contact"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-center hover:bg-white/20 transition-all border border-white/20"
              >
                맞춤 제작 문의하기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
