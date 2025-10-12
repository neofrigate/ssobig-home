import Image from "next/image";
import Script from "next/script";
import LinkWithUtm from "../../../../components/LinkWithUtm";

export const metadata = {
  title: "일일남매 - Love Buddies",
  description: "일일남매에서 술 없이도 찐친과 특별한 경험을 만들어보세요",
};

export default function DayNammaePage() {
  const features = [
    {
      title: "🤝 찐친 매칭",
      description:
        "관심사와 취향이 맞는 이성과 페어로 매칭되어 신선하고 깊은 대화를 나눌 수 있어요.",
    },
    {
      title: "🎮 재미있는 액티비티",
      description:
        "지루할 틈 없이 다양한 미션과 게임으로 자연스럽게 서로를 알아갈 수 있는 기회가 가득!",
    },
    {
      title: "📸 추억 만들기",
      description:
        "특별한 세트장에서 찍는 인생샷부터 함께 만드는 추억까지, 잊지 못할 경험을 선사합니다.",
    },
    {
      title: "👫 새로운 관계",
      description:
        "일일남매로 시작해서 오래 가는 인연으로! 많은 참가자들이 소중한 관계를 이어가고 있어요.",
    },
  ];

  const reviews = [
    {
      text: "처음에는 걱정했는데, 생각보다 훨씬 자연스럽고 재밌었어요! 이렇게 금방 친해질 수 있다니 놀라웠어요!",
      author: "20대 후반 여성 참가자",
    },
    {
      text: "미션을 수행하면서 자연스럽게 이야기가 많아졌고, 오히려 술자리보다 서로에 대해 더 많이 알게 된 것 같아요.",
      author: "30대 초반 남성 참가자",
    },
    {
      text: "친구 소개팅은 부담스러웠는데, 이건 정말 편안했어요. 일일남매 덕분에 정말 좋은 인연을 만났어요!",
      author: "20대 중반 여성 참가자",
    },
  ];

  return (
    <>
      {/* Meta Pixel Code */}
      <Script id="facebook-pixel-day-nammae" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1541266446734040');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1541266446734040&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-pink-500 selection:text-white pt-[88px] md:pt-[60px]">
        {/* 배경 이미지 next/image 적용 */}
        <div className="absolute inset-0 -z-10 bg-black">
          <Image
            src="/ssobig_assets/러브버디즈 배경.jpg"
            alt="일일남매 배경"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.6,
            }}
            priority
            sizes="100vw"
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 pb-24 px-4">
          {/* 로고 이미지 */}
          <div className="w-full flex justify-center mt-6 mb-6">
            <div className="w-[300px] h-[100px] relative">
              <Image
                src="/ssobig_assets/brand logo=러브버디즈.png"
                alt="러브버디즈 로고"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          {/* 타이틀 */}
          <div className="text-center mb-8">
            <div className="text-[#FF6B9F] text-xl mb-2">
              💖 술 없이도 특별한 만남이 있다! 💖
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">일일남매</h1>
            <p className="text-xl text-pink-300">
              매주 토요일, 특별한 이성과
              <br />
              잊지 못할 하루를 만들어보세요! 💕
            </p>
          </div>

          {/* 메인 이미지 */}
          <div className="w-full h-auto mb-8">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
              <Image
                src="/images/dayNammae/일일남매_1.jpg"
                alt="일일남매 포스터"
                fill
                sizes="(max-width: 620px) 100vw, 620px"
                priority
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* 소개 섹션 */}
          <div className="mb-8 space-y-4">
            <p className="text-lg">
              <span className="text-[#FF6B9F] font-semibold">
                &quot;소개팅은 부담스럽고, 미팅은 술자리라 걱정되고...&quot;
              </span>
              <br />
              막상 새로운 사람을 만나고 싶어도 어떻게 시작해야 할지
              고민되시나요?
            </p>

            <p className="text-lg">
              혹시{" "}
              <span className="text-[#FF6B9F] font-semibold">
                &quot;술 없이도 재밌게 이성과 친해질 수 있는 방법이
                없을까?&quot;
              </span>{" "}
              하고 생각해보신 적 있으신가요?
            </p>

            <p className="text-lg">
              바로 그런 분들을 위해 준비한{" "}
              <span className="text-[#FF6B9F] font-semibold">일일남매</span>가
              있습니다!
            </p>
          </div>

          {/* 일일남매 특징 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-center mb-6">
              일일남매만의 특별함 ✨
            </h2>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/10 p-4 rounded-xl">
                  <h3 className="text-xl font-bold text-[#FF6B9F] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-200">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 후기 섹션 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-center mb-6">
              참가자들의 생생한 후기 💬
            </h2>

            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white/10 p-4 rounded-xl">
                  <p className="text-lg mb-2">&quot;{review.text}&quot;</p>
                  <p className="text-sm text-pink-300 text-right">
                    - {review.author}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 참여 방법 */}
          <div className="mb-10 bg-black/30 p-6 rounded-xl border-l-4 border-[#FF6B9F]">
            <h2 className="text-xl font-bold text-white mb-4">참여 방법</h2>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-[#FF6B9F] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  1
                </div>
                <p>
                  아래 &apos;일일남매 참여하기&apos; 버튼을 클릭해 참가 신청서를
                  작성해주세요.
                </p>
              </div>

              <div className="flex items-start">
                <div className="bg-[#FF6B9F] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  2
                </div>
                <p>신청 후 24시간 이내에 운영진의 확인 연락을 받게 됩니다.</p>
              </div>

              <div className="flex items-start">
                <div className="bg-[#FF6B9F] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  3
                </div>
                <p>
                  참가 확정 시 참가비 결제 안내를 받습니다. (참가비: 39,000원)
                </p>
              </div>

              <div className="flex items-start">
                <div className="bg-[#FF6B9F] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  4
                </div>
                <p>당일 행사장에서 특별한 만남을 즐겨보세요!</p>
              </div>
            </div>
          </div>

          {/* 마무리 섹션 */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">
              술 없이도 특별한 만남,
              <br />
              찐친과의 잊지 못할 하루!
            </h2>
            <p className="text-lg mb-6">더 이상 고민하지 마세요!</p>
            <p className="text-xl text-[#FF6B9F] font-bold">
              일일남매에서 새로운 인연을 만들고
              <br />
              특별한 추억을 만들어보세요.
            </p>
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://smore.im/form/0j4u3szCcL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#FF6B9F] hover:bg-[#e45a8b] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
              brandPage="love_buddies"
              buttonType="day_nammae_cta"
              destination="smore_form"
            >
              일일남매 참여하기 🙋🏻‍♀
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
