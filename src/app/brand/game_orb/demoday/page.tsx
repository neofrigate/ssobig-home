"use client";

import Image from "next/image";
import Script from "next/script";
import Head from "next/head";
import LinkWithUtm from "../../../../components/LinkWithUtm";

export default function DemoDayPage() {
  const reviews = [
    {
      text: "게임 창작자로서 정말 유익한 피드백을 받을 수 있었어요! 이런 기회가 더 많았으면 좋겠네요.",
      author: "게임 개발자 A님",
    },
    {
      text: "새로운 게임들을 가장 먼저 체험할 수 있어서 너무 재미있었어요! 다음에도 꼭 참여하고 싶어요.",
      author: "게임 애호가 B님",
    },
    {
      text: "같은 취향의 사람들과 깊이 있는 대화를 나눌 수 있어서 좋았습니다. 네트워킹도 정말 유익했어요!",
      author: "플레이어 C님",
    },
  ];

  return (
    <>
      <Head>
        <title>DEMODAY - Game Orb</title>
        <meta
          name="description"
          content="게임 창작자와 플레이어가 만나는 특별한 데모데이 - 게임오브 소셜링"
        />
      </Head>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '681386597924392');
            fbq('track', 'PageView');
          `,
        }}
      />

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-purple-500 selection:text-white">
        {/* 배경 이미지 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/게임오브 배경.jpg"
            alt="게임오브 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
        </div>

        {/* 배경 오버레이들 */}
        <div className="fixed inset-0 -z-5 bg-gradient-to-b from-black to-transparent"></div>
        <div className="fixed inset-0 -z-5 bg-black/70"></div>

        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
          {/* 메인 이미지 */}
          <div className="w-full h-auto mb-10">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/상세 상단 공통 디자인_데모데이.png"
                alt="데모데이 포스터"
                width={620}
                height={0}
                style={{ width: "100%", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>

          {/* 데모데이 정보 박스 */}
          <div className="w-full mb-12">
            <div className="bg-black rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-4">
                게임오브 소셜링 데모데이
              </h2>

              {/* 일정 및 가격 정보 */}
              <div className="bg-black/70 rounded-lg p-4 mb-5">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
                  <p className="text-white font-bold text-lg mb-2 sm:mb-0">
                    가격: <span className="text-white">플레이어 10,000원</span>
                    <span className="text-[#9E4BED]"> / 출품자 무료</span>
                  </p>
                  <p className="text-white font-bold text-lg">
                    5월 18일(일) 13:00~18:00{" "}
                    <span className="text-white">(5시간)</span>
                  </p>
                </div>

                <div className="text-center mt-4">
                  <p className="text-white font-bold text-xl mb-2">
                    📍 쏘빅 스튜디오 (신논현역 5분 거리)
                  </p>
                  <p className="text-white font-bold text-lg">
                    정원: 최대 50명
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 소개 섹션 및 나머지 콘텐츠 */}
          <div className="px-5">
            {/* 도입부 섹션 */}
            <div className="my-[50px] space-y-4 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                혹시 이런 고민 해보셨나요?
              </h2>

              <div className="space-y-4 text-lg">
                <p className="text-[#95BE62] font-semibold">
                  &quot;내가 만든 게임이 정말 재미있는지 객관적으로 알고
                  싶은데...&quot;
                </p>

                <p className="text-[#95BE62] font-semibold">
                  &quot;양질의 피드백을 줄 수 있는 테스터들을 어디서 찾지?&quot;
                </p>

                <p className="text-[#95BE62] font-semibold">
                  &quot;게임 예능보다 재미있는 신작 게임들을 먼저 경험해보고
                  싶은데...&quot;
                </p>

                <p className="text-[#95BE62] font-semibold">
                  &quot;오프라인 게임 문화를 진심으로 사랑하는 사람들과 교류하고
                  싶어!&quot;
                </p>
              </div>
            </div>

            {/* 솔루션 섹션 */}
            <div className="mb-10 bg-black/50 backdrop-blur-[30px] p-6 rounded-xl">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  그래서 저희 게임오브 소셜링 데모데이가 탄생했습니다!
                </h2>
                <p className="text-lg text-white">
                  게임 창작자에게는 게임러버 테스터풀과 함께 건설적인 피드백을,
                  플레이어에게는 어디서도 경험할 수 없는 신작 게임들의 첫 경험을
                  제공합니다.
                </p>
                <p className="text-lg text-[#95BE62] font-bold mt-4">
                  단순한 테스트를 넘어서, 오프라인 게임 문화를 함께 만들어가는
                  의미있는 시간입니다.
                </p>
              </div>
            </div>

            {/* 후기 섹션 */}
            <div className="mb-16">
              <h2 className="text-xl font-bold text-center mb-6">
                &quot;정말 나에게도 도움이 될까?&quot; 아직 확신이 서지
                않으신다면,
                <br />
                실제 참가자들의 생생한 후기를 먼저 만나보세요!
              </h2>

              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-xl">
                    <p className="text-base mb-2">&quot;{review.text}&quot;</p>
                    <p className="text-xs text-purple-300 text-right">
                      - {review.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 진행 방식 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  📋 진행 방식
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-white">
                  • 당일 플레이할 게임은 인원 구성과 플레이어 취향에 맞게 투표로
                  선택
                </p>
                <p className="text-white">
                  • 게임별 피드백 세션을 통한 건설적인 개선 방안 논의
                </p>
                <p className="text-white">
                  • 자유로운 네트워킹을 위한 희망자 대상 2차 뒷풀이 진행
                </p>
              </div>
            </div>

            {/* 대상 추천 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  🎯 이런 분들께 특히 추천합니다!
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-white">
                  • 만든 게임의 객관적인 피드백이 절실한 게임 창작자
                </p>
                <p className="text-white">
                  • 더지니어스, 크라임씬, 머더미스터리 등을 좋아하는 게임 애호가
                </p>
                <p className="text-white">
                  • 새로운 게임을 가장 먼저 경험하고 싶은 얼리어답터
                </p>
                <p className="text-white">
                  • 오프라인 게임 문화 발전에 기여하고 싶은 씬메이커
                </p>
                <p className="text-white">
                  • 같은 취향의 사람들과 깊이 있는 교류를 원하는 분
                </p>
              </div>
            </div>

            {/* 기대 효과 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  ✨ 기대 효과/특장점
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-white">
                  <span className="font-bold text-[#95BE62]">창작자:</span> 50명
                  규모 테스터풀의 다각도 피드백으로 게임 완성도 대폭 향상
                </p>
                <p className="text-white">
                  <span className="font-bold text-[#95BE62]">플레이어:</span>{" "}
                  게임 예능 방송보다 재미있는 신작들을 가장 먼저 체험
                </p>
                <p className="text-white">
                  <span className="font-bold text-[#95BE62]">네트워킹:</span>{" "}
                  진심으로 게임을 사랑하는 사람들과의 의미있는 만남
                </p>
                <p className="text-white">
                  <span className="font-bold text-[#95BE62]">문화 기여:</span>{" "}
                  오프라인 게임 문화 발전에 직접 참여하는 보람
                </p>
              </div>
            </div>

            {/* 주최자 소개 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  👋 주최자 소개
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-white font-bold text-lg">
                  안녕하세요, 게임 기획자 평일입니다.
                </p>
                <p className="text-white">
                  보드게임카페와 동호회를 8년간 운영하며 보드게임 2종을 출판하여
                  일본까지 수출한 경험이 있습니다. 최근 2년간은 팀과 함께
                  지니어스류, 크라임씬류 게임을 기획하여 연 2억 정도의 매출을
                  달성했습니다.
                </p>
                <p className="text-[#95BE62] font-bold">
                  &quot;훌륭한 게임이 나왔으면 하는 마음&quot;에서 시작된 이
                  모임을 통해, 게임 문화를 사랑하는 창작자와 플레이어들이 서로
                  도움을 주고받으며 함께 성장할 수 있기를 바랍니다.
                </p>
              </div>
            </div>

            {/* FAQ 섹션 */}
            <div className="mb-16">
              <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-8">
                  자주 묻는 질문들
                </h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q1. 게임 초보자도 참여할 수 있나요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      물론입니다! 게임을 사랑하는 마음만 있다면 누구나
                      환영합니다. 현장에서 친절하게 안내해드려요.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q2. 혼자 가도 괜찮을까요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      대환영입니다! 같은 취향의 분들과 자연스럽게 어울릴 수
                      있도록 도와드리며, 많은 분들이 혼자 오셔서 좋은 인연을
                      만들어가고 계세요.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q3. 게임 룰을 미리 알아야 하나요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      아니요, 현장에서 설명해드립니다. 다만 미리 확인하고
                      싶으시다면 신청 링크에서 출품작 정보를 확인하실 수 있어요.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 신청 전 최종 확인 내용 */}
            <div className="mb-16">
              <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-8">
                  신청 전 최종 확인 내용
                </h2>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-white/10">
                    <span className="font-bold text-[#9E4BED] md:w-[120px] mb-2 md:mb-0">
                      일정
                    </span>
                    <span className="text-white">
                      5월 18일(일) 13:00-18:00 (5시간)
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-white/10">
                    <span className="font-bold text-[#9E4BED] md:w-[120px] mb-2 md:mb-0">
                      장소
                    </span>
                    <span className="text-white">
                      쏘빅 스튜디오 (신논현역 5분 거리)
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-white/10">
                    <span className="font-bold text-[#9E4BED] md:w-[120px] mb-2 md:mb-0">
                      정원
                    </span>
                    <span className="text-white">최대 50명</span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start py-3 border-b border-white/10">
                    <span className="font-bold text-[#9E4BED] md:w-[120px] mb-2 md:mb-0">
                      포함 내역
                    </span>
                    <span className="text-white">
                      5시간 게임 체험, 피드백 세션, 네트워킹 기회
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start py-3">
                    <span className="font-bold text-[#9E4BED] md:w-[120px] mb-2 md:mb-0">
                      미포함 내역
                    </span>
                    <span className="text-white">식사, 2차 모임비</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 마무리 섹션 */}
            <div className="text-center my-20">
              <h2 className="text-2xl font-bold mb-5">
                게임 예능 방송보다 재밌는 게임들을 더 많이 뿜어내는,
                <br />
                그런 소중하고 독특한 모임이 될 수 있도록 최선을 다하겠습니다!
              </h2>
              <p className="text-lg mb-8">
                여러분의 참여 하나하나가 오프라인 게임 문화 발전에 큰 기여가
                됩니다.
              </p>
              <p className="text-xl text-[#95BE62] font-bold">곧 뵙겠습니다!</p>
            </div>
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://form.ssobig.com/demoday"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#9E4BED] hover:bg-[#8341c9] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
              brandPage="game_orb"
              buttonType="demoday_main_cta"
              destination="smore_form"
            >
              지금 바로 참여하기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </LinkWithUtm>
          </div>
        </div>
      </div>
    </>
  );
}
