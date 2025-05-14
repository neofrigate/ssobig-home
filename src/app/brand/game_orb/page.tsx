import Image from "next/image";
import Card, { CardProps } from "../../../components/Card";
import Script from "next/script";

export const metadata = {
  title: "Ssobig-Game Orb",
};

export default function GameOrbPage() {
  const gameOrbCards: CardProps[] = [
    {
      title: "REAL GENIUS : 게임 예능 참여하기",
      description: "흥미진진한 게임 예능에 지금 바로 참여하세요.",
      linkText: "참여하기",
      linkHref: "/brand/game_orb/devils-plan",
      linkIconType: "link",
      hasImageArea: true,
      imagePlaceholderText: "데블스플랜 참여",
      imageAreaStyle: {
        backgroundImage: "url('/ssobig_assets/devils_plan_hoodie.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      fullImageCard: true,
    },
    {
      title: "게임오브 정모 신청",
      description: "커뮤니티 멤버들과 함께하는 정모에 참여하세요.",
      linkText: "about.ssobig.com",
      linkHref: "https://about.ssobig.com",
      linkIconType: "link",
      hasImageArea: true,
      imagePlaceholderText: "게임오브 정모",
      imageAreaStyle: {
        backgroundImage: "url('/ssobig_assets/게임 정모 포스.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      fullImageCard: true,
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

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start pb-4 px-0 selection:bg-purple-500 selection:text-white pt-[72px]">
        {/* 배경 이미지 next/image 적용 */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/ssobig_assets/게임오브 배경.jpg"
            alt="게임오브 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
          {/* 배경 이미지 위에 그라데이션 오버레이 적용 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/40"></div>
        </div>

        <div className="w-full max-w-[620px] mx-auto z-10 relative text-center pt-4">
          {/* 로고 이미지 */}
          <div className="mt-4 mb-4 w-full max-w-[400px] h-[150px] relative flex justify-center items-center mx-auto">
            <Image
              src="/ssobig_assets/brand logo=게임오브.png"
              alt="게임오브 로고"
              fill
              style={{ objectFit: "contain" }}
              className="mx-auto"
              priority
            />
          </div>
          <a
            href="https://www.instagram.com/game_orb/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-neutral-300 hover:text-white transition-colors group mb-8"
            aria-label="인스타그램으로 이동"
          >
            <div className="w-6 h-6">
              <Image
                src="/ssobig_assets/instaBigIcon.png"
                alt="인스타그램 아이콘"
                width={30}
                height={30}
                className="w-full h-full filter brightness-0 invert"
              />
            </div>
          </a>
        </div>

        <main className="w-full max-w-[620px] mx-auto z-10 relative p-5">
          <section className="mb-10 md:mb-12">
            <div className="text-left w-full">
              <h2 className="text-[24px] sm:text-[28px] font-bold text-white mb-4">게임오브</h2>
              <p className="text-[14px] sm:text-[16px] text-neutral-300 w-full leading-relaxed">
                &apos;술 없이&apos; 매력있고 사랑스러운 &lt;찐친&gt;들 잔뜩
                만드는 곳!
                <br />
                [일일남매] [환승연애] 같은 러브버디즈의 모임은 매력적인 남녀들이
                모여 흥미진진하게 서로를 알아갈 수 있는 콘텐츠로 구성되어
                있습니다.
              </p>
            </div>
          </section>

          <section className="pb-12">
            {/* 참가후기 섹션 위의 여백 */}
            <div className="h-[25px]"></div>

            {/* 신청 링크 섹션 */}
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">
              게임오브 신청링크
            </h3>
            <div className="w-full mt-4 space-y-5 sm:space-y-6 max-w-[580px] mx-auto">
              {gameOrbCards.map((item) => (
                <Card key={item.title} {...item} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
