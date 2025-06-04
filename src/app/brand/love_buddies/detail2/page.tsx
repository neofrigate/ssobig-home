import Image from "next/image";
import Script from "next/script";
import LinkWithUtm from "../../../../components/LinkWithUtm";

export const metadata = {
  title: "일일남매 - 러브버디즈",
  description:
    "하루동안 남매가 되어 서로의 진친을 찾아가는, 술 없이도 즐겁고 편안하게 친해질 수 있는, 매력적인 소셜 개더링",
};

export default function LoveBuddiesPage() {
  const reviews = [
    {
      text: "술 없이도 이렇게 재밌게 사람들과 친해질 수 있다니 놀라웠어요! 다음에도 꼭 참가하고 싶습니다!",
      author: "20대 참가자 K님",
    },
    {
      text: "평소 모임에서 쉽게 친해지지 못했는데, 이런 콘텐츠로 진행되니 자연스럽게 대화가 이어져서 좋았어요.",
      author: "30대 초반 참가자 J님",
    },
    {
      text: "그래프로 소울메이트를 찾는 과정이 신선하고 재미있었어요. 정말 가치관이 비슷한 친구를 만날 수 있었습니다!",
      author: "20대 후반 참가자 L님",
    },
  ];

  return (
    <>
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
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-purple-500 selection:text-white">
        {/* 배경 이미지 next/image 적용 - 고정 */}
        <div className="fixed inset-0 -z-10 bg-black">
          <Image
            src="/ssobig_assets/러브버디즈 배경.jpg"
            alt="러브버디즈 배경"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.6,
              filter: "blur(8px)",
            }}
            priority
            sizes="100vw"
          />
          {/* 어두운 오버레이 추가 */}
          <div className="fixed inset-0 bg-black/50"></div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
          {/* 메인 이미지 */}
          <div className="w-full h-auto mb-10">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/상세 상단 공통 디자인_일일남매.png"
                alt="러브버디즈 포스터"
                width={1240}
                height={620}
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, 620px"
                className="rounded-none w-full h-auto"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* 러브버디즈 개더링 스케줄 박스 */}
          <div className="w-full mb-12 px-5">
            <div className="bg-black rounded-xl p-3 md:p-6 shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-4">
                러브버디즈 개더링 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="bg-black/70 rounded-lg p-3 mb-4">
                <div className="flex flex-col space-y-2">
                  <div>
                    <div className="flex items-center flex-wrap">
                      <span className="text-white font-bold text-base md:text-lg mr-2">
                        가격:
                      </span>
                      <span className="text-[#FF69B4] font-bold text-lg md:text-xl">
                        35,000원
                      </span>
                    </div>
                  </div>
                  <div className="text-white font-bold text-base md:text-lg">
                    약 2시간 30분 ~ 3시간
                    <span className="text-white"> (대상: 20~35세)</span>
                  </div>
                </div>
              </div>

              {/* 일정 목록 */}
              <div className="space-y-1">
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    5/24 (토) 15:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    5/30 (금) 19:30
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    5/31 (토) 15:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#A97C50] text-white px-2 py-0.5 rounded-full text-[11px] font-bold mr-2">
                    30~35 특집
                  </span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    5/31 (토) 19:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    6/3 (화) 15:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    6/6 (금) 15:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    6/7 (토) 15:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    6/7 (토) 19:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    6/14 (토) 15:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    6/21 (토) 15:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    6/28 (토) 19:30
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
                <div className="flex items-center py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-1 w-[160px] whitespace-nowrap text-sm md:text-base">
                    6/29 (일) 13:00
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    일일남매
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FF69B4] text-black px-2 py-0.5 rounded-full text-[11px] font-bold">
                    선착순
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 소개 섹션 및 나머지 콘텐츠 */}
          <div className="px-5">
            {/* 소개 섹션 */}
            <div className="my-[60px] space-y-8">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-[#FF69B4] mb-5 tracking-tight">
                  일일남매, 그게 뭐예요?
                </h3>

                <p className="text-lg md:text-xl leading-relaxed mx-auto max-w-[520px]">
                  나의 첫 남매 케미의 친구 만들기!
                </p>

                <div className="mt-4 inline-block bg-gradient-to-r from-[#FF69B4]/20 to-[#FF69B4]/5 px-6 py-3 rounded-full">
                  <span className="text-[#FF69B4] font-medium text-lg">
                    매력적인 사람들과 함께하는
                    <br />
                    특별한 소셜 개더링
                  </span>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-inner border border-white/5">
                <h4 className="text-xl font-bold mb-5 text-center text-white">
                  혹시 이런 경험 있으신가요?
                </h4>

                <div className="space-y-5">
                  <div className="flex items-start">
                    <span className="text-[#FF69B4] text-2xl mr-3">❝</span>
                    <p className="text-base md:text-lg text-white/90">
                      <span className="text-[#FF69B4] font-medium">
                        평범한 소개팅, 모임이 지겹지 않으신가요?
                      </span>
                      <br />
                      <span className="text-sm text-white/70 mt-1 block">
                        새롭고 색다른 방식으로 사람들과 연결되고 싶으신가요?
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#FF69B4] text-2xl mr-3">❝</span>
                    <p className="text-base md:text-lg text-white/90">
                      <span className="text-[#FF69B4] font-medium">
                        술자리에서만 사람들을 만나는 것이 불편하셨나요?
                      </span>
                      <br />
                      <span className="text-sm text-white/70 mt-1 block">
                        술 없이도 즐겁고 편안하게 친해질 수 있는 자리를 찾고
                        계신가요?
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#FF69B4] text-2xl mr-3">❝</span>
                    <p className="text-base md:text-lg text-white/90">
                      <span className="text-[#FF69B4] font-medium">
                        가치관이 맞는 사람을 만나고 싶으신가요?
                      </span>
                      <br />
                      <span className="text-sm text-white/70 mt-1 block">
                        진정한 친구 또는 그 이상의 관계를 찾고 계신가요?
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-lg font-bold text-white">
                    걱정 마세요, 러브버디즈는 다릅니다{" "}
                    <span className="text-xl">✨</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 후기 섹션 */}
            <div className="mb-16">
              <h2 className="text-xl font-bold text-center mb-6">
                러브버디즈 참가자분들이 남겨주신
                <br />
                소중한 후기입니다
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

              {/* 이미지 추가 */}
              <div className="text-center mt-6 text-xl font-bold p-0 rounded-xl">
                <div className="w-full mb-4 px-0 pt-[40px]">
                  <Image
                    src="/ssobig_assets/러브버디즈 예시 이미지.png"
                    alt="러브버디즈 개더링 현장"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full rounded-[12px]"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "50px",
                    }}
                  />
                </div>

                <p className="text-base font-bold pb-[40px] pt-[20px]">
                  &quot;개더링 단 한 번이면 바로 진친 + 연인 향기가 솔솔
                  🍀&quot;
                  <br />
                  술보다 사랑에 집중한 시간을 함께 보내봐요 😘
                  <br />
                  <br />
                  &quot;매력적인 사람은 그만큼 매력적인 콘텐츠에 와요&quot;
                </p>
              </div>
            </div>

            {/* 러브버디즈 이미지 갤러리 - 첫 번째 */}
            <div className="my-12 px-4">
              <h3 className="text-xl font-bold text-center mb-4">
                러브버디즈 둘러보기
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Image
                    src="/ssobig_assets/러브버디즈 둘러보기/image1.jpg"
                    alt="러브버디즈 현장 이미지"
                    width={500}
                    height={300}
                    className="w-full h-auto rounded-lg"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <Image
                    src="/ssobig_assets/러브버디즈 둘러보기/image2.jpg"
                    alt="러브버디즈 현장 이미지"
                    width={500}
                    height={300}
                    className="w-full h-auto rounded-lg"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>

            {/* 포인트 1 섹션 */}
            <div className="mb-10 bg-[#C9A27B]/20 backdrop-blur-[30px] p-6 rounded-xl border border-[#A97C50]">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#FF69B4]">
                  ❤️ Point.1
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                일일남매 케미 콘텐츠
              </h4>
              <p className="mb-4">
                기존 소개팅이나 미팅과는 달리, 하루 동안 남매가 되어 서로의
                진정한 친구를 찾아주는 특별한 경험을 제공합니다. 이를 통해{" "}
                <span className="font-bold text-[#FF69B4]">
                  자연스럽게 다양한 사람들과 교류하고 진정성 있는 관계를 형성
                </span>
                할 수 있습니다.
              </p>
              <p className="mb-4">
                나는 어떤 사람한테 끌리는지, 흥미로운 콘텐츠를 통해 인사이트를
                얻을 수 있으며, 가치관 그래프를 통해 나와 맞는 소울메이트를
                한눈에 찾을 수 있습니다.
              </p>

              {/* 이미지 추가 */}
              <div className="w-full my-8">
                <Image
                  src="/ssobig_assets/러브버디즈 포인트.png"
                  alt="일일남매 케미 콘텐츠"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              <p className="text-lg font-bold text-center text-[#FF69B4] mt-6">
                &quot;다양한 관점과 시각에 대해 함께 이해하다 보면&quot;
                <br />
                어느새 훈훈한 남사친·여사친이 내 옆에! 🤝
              </p>
            </div>

            {/* 러브버디즈 이미지 갤러리 - 두 번째 */}
            <div className="my-12">
              <div className="relative w-full h-[250px]">
                <Image
                  src="/ssobig_assets/러브버디즈 둘러보기/image3.jpg"
                  alt="러브버디즈 현장 이미지"
                  fill
                  className="rounded-lg"
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                  <p className="text-2xl font-bold text-white text-center px-4">
                    &quot;함께 소통하고 교감하는 특별한 시간&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* 포인트 2 섹션 */}
            <div className="mb-10 bg-[#C9A27B]/20 backdrop-blur-[30px] p-6 rounded-xl border border-[#A97C50]">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#FF69B4]">
                  ❤️ Point.2
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                체계적이고 재미있는 진행방식
              </h4>
              <p className="mb-4">
                <span className="font-bold text-[#FF69B4]">남매 시스템</span>을
                기반으로 서로에게 이상적인 친구나 연인을 찾아주는 과정을 통해
                자연스럽게 대화하고 소통할 수 있는 환경을 제공합니다.
              </p>

              <div className="space-y-3">
                {/* 진행 방식 강조 */}
                <div className="bg-[#FF69B4]/20 p-4 rounded-xl border border-[#FF69B4] shadow-lg mt-4">
                  <p className="flex justify-between items-center mb-3">
                    <span className="text-xl font-extrabold text-[#FF69B4]">
                      진행 순서
                    </span>
                  </p>

                  <div className="pl-3 border-l-2 border-[#FF69B4]/50 ml-2 space-y-3 mt-4">
                    <p className="flex justify-between">
                      <span className="font-medium">하하호호 답삭전</span>
                      <span className="text-purple-300">[15분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      자유로운 대화로 분위기 형성
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">
                        안내 + (일일) 남매 배정
                      </span>
                      <span className="text-purple-300">[20분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      일일남매 파트너 배정 및 게더링 규칙 안내
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">메인 콘텐츠 플레이</span>
                      <span className="text-purple-300">[2시간]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      서로 찾아줘야 할 이상형에 대한 정보 공유
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      흥미진진 연애 가치관 심리테스트 진행
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      중간중간 (일일)남매끼리 비밀대화
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      마지막 히든 미션
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">팀별 실제 자기소개</span>
                      <span className="text-purple-300">[15분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      그동안 알게 된 서로에 대한 정보 확인 및 소개
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">인근 맛집 오픈런</span>
                      <span className="text-purple-300">[선택]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      개더링 후 원하는 참가자들과 함께 식사 및 대화 이어가기
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 포인트 3 섹션 */}
            <div className="mb-10 bg-[#C9A27B]/20 backdrop-blur-[30px] p-6 rounded-xl border border-[#A97C50]">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#FF69B4]">
                  ❤️ Point.3
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                지속 가능한 인연
              </h4>
              <p className="mb-5">
                러브버디즈 개더링은 일회성 만남이 아닌, 지속적인 관계 형성을
                목표로 합니다. 단순 외모 중심의 만남이나 교제 목적의 모임이
                아닌, 매력적인 사람들과 안전하게 친해질 수 있는 플랫폼을
                제공합니다.
              </p>

              <div className="bg-white/5 p-5 rounded-xl mb-6">
                <h5 className="font-bold text-[#FF69B4] mb-3">
                  개더링 참가자들의 특별함
                </h5>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FF69B4] mr-2">•</span>
                    <span>20~35세 다양한 직무, 전공의 매력적인 사람들</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF69B4] mr-2">•</span>
                    <span>술 없이도 진정한 소통을 즐기는 사람들</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF69B4] mr-2">•</span>
                    <span>신선하고 의미 있는 관계를 원하는 사람들</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg font-bold text-center text-[#FF69B4] mt-6">
                &quot;저희 개더링에서 친해진 분들은 다음 n회차로 만나는 중
                🔥&quot;
              </p>
            </div>

            {/* 러브버디즈 이미지 갤러리 - 세 번째 */}
            <div className="my-12 px-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Image
                    src="/ssobig_assets/러브버디즈 둘러보기/image4.jpg"
                    alt="러브버디즈 현장 이미지"
                    width={300}
                    height={300}
                    className="w-full h-[150px] rounded-lg"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <Image
                    src="/ssobig_assets/러브버디즈 둘러보기/image5.jpg"
                    alt="러브버디즈 현장 이미지"
                    width={300}
                    height={300}
                    className="w-full h-[150px] rounded-lg"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <Image
                    src="/ssobig_assets/러브버디즈 둘러보기/image6.jpg"
                    alt="러브버디즈 현장 이미지"
                    width={300}
                    height={300}
                    className="w-full h-[150px] rounded-lg"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>

            {/* 마무리 섹션 */}
            <div className="text-center my-20">
              <h2 className="text-2xl font-bold mb-5">
                가치관을 공유하고, 진정한 친구를 만들고!
                <br />
                하루 남매, 평생 진친을 만들어보세요!
              </h2>
              <p className="text-lg mb-8">
                이제 더 이상 어색한 술자리에서 형식적인 대화는 그만!
              </p>
              <p className="text-xl text-[#FF69B4] font-bold">
                매력적인 사람들과 안전하게 친해질 수 있는
                <br />
                &lt;일일남매 개더링&gt;이 당신을 기다립니다.
              </p>
            </div>

            {/* 연합어때 이미지 */}
            <div className="w-full my-24"></div>

            {/* FAQ 섹션 */}
            <div className="mb-16">
              {/* Single FAQ box for all questions */}
              <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-8">
                  자주 묻는 질문들
                </h2>

                <div className="space-y-8">
                  {/* Q1 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q1: 일정이 몇 시간 지속되나요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      게더링은 2시간 30분 진행됩니다. 다만, 원하는 참석자에
                      따라서 더욱 길어질 수 있으며, 게더링 종료 시, 2차를 통해
                      가능한 소통하실 수 있습니다!
                    </p>
                  </div>

                  {/* Q2 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q2: 참여자 연령대가 주로 어떻게 되나요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      대부분 참석자들은 20대 초중반부터 30대 초중반까지 다양한
                      연령대, 직군, 전공을 가지고 있습니다. 참여자 구성은
                      20-35세입니다 :)
                    </p>
                  </div>

                  {/* Q3 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q3: 음식은 줄까요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      서로 만남 시간을 편하게 만들어 주는 다과와 음료를 함께
                      제공합니다! 음료와 더불어 동서양 음식 셀렉션이 개인 취향에
                      맞게 제공됩니다. 개인적으로 식사를 하고 오셔도 자유롭게
                      참여하셔도 됩니다 :)
                    </p>
                  </div>

                  {/* Q4 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q4: 어떤 옷차림이 적합한가요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      스타일은 자유롭게 개더링 참여에 적합한 복장이면
                      괜찮습니다. 드레스코드는 편하면서 개더링 진행 특 활동에
                      방해가 되지 않는 복장이면 됩니다. 가벼운 캐주얼이면
                      괜찮습니다! 게더링 진행 중 다양한 활동들이 있으니 활동하기
                      편한 복장을 추천합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 신청 전 최종 확인 내용 */}
            <div className="mb-16">
              <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 text-center">
                  신청 전 최종 확인 내용
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-[#FF69B4]">
                      참가자 지각
                    </span>
                    <span>
                      당일 지각 시간 정확히 게더링 서비스센터에 알림! 15분 지각
                      이후 입장 불가
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-[#FF69B4]">소요시간</span>
                    <span>2시간 30분 ~ 3시간</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-[#FF69B4]">제공사항</span>
                    <span>독특하고 매력적인 콘텐츠, 다과 및 음료</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-[#FF69B4]">준비물품</span>
                    <span>충전된 폰</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://form.ssobig.com/lovebuddies"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#FF69B4] hover:bg-[#FF5AA0] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
              brandPage="love_buddies"
              buttonType="detail2_main_cta"
              destination="smore_form"
            >
              참가 신청하기
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
