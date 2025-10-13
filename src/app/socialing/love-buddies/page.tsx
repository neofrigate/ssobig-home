"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const LoveBuddiesPage = () => {
  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel-love-buddies"
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
            fbq('init', '1541266446734040');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* End Meta Pixel Code */}

      <div className="text-white font-sans relative flex flex-col items-center justify-start pb-[100px] px-0 selection:bg-pink-500 selection:text-white pt-[88px] md:pt-[60px]">
        {/* 배경 이미지 next/image 적용 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/lovebuddies/hero-main.jpg"
            alt="러브버디즈 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
          {/* 배경 이미지 위에 블랙 50% 투명도 오버레이 적용 */}
          <div className="fixed inset-0 bg-black/50"></div>
        </div>

        {/* 이미지 및 컨텐츠 영역 */}
        <div className="w-full md:max-w-[720px] mx-auto z-10 relative text-center px-5 pt-5 flex flex-col items-center gap-[30px]">
          {/* 로고 이미지 */}
          <div className="w-full max-w-[400px] h-[96px] sm:h-[150px] relative flex justify-center items-center mx-auto">
            <Image
              src="/ssobig_assets/lovebuddies/brand-logo.png"
              alt="러브버디즈 로고"
              fill
              style={{ objectFit: "contain" }}
              className="mx-auto"
              priority
              sizes="(max-width: 768px) 80vw, 400px"
            />
          </div>

          {/* 인스타그램 아이콘 */}
          <a
            href="https://www.instagram.com/love___buddies/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-neutral-300 hover:text-white transition-colors group"
            aria-label="Love Buddies Instagram"
          >
            <div className="w-[24px] h-[24px]">
              <Image
                src="/ssobig_assets/home/icon-instagram-circle.png"
                alt="인스타그램 아이콘"
                width={24}
                height={24}
                className="w-full h-full filter brightness-0 invert"
              />
            </div>
          </a>

          {/* 텍스트 섹션 */}
          <div className="text-left w-full">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white mb-[12.26px]">
              러브버디즈
            </h2>
            <p className="text-[14px] sm:text-[16px] text-neutral-300 w-full leading-relaxed">
              &apos;술 없이&apos; 매력있고 사랑스러운 &lt;찐친&gt;들 잔뜩 만드는
              곳!
              <br />
              [일일남매] [환승연애] 같은 러브버디즈의 모임은 매력적인 남녀들이
              모여 흥미진진하게 서로를 알아갈 수 있는 콘텐츠로 구성되어 있습니다
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="z-10 flex flex-col items-center md:max-w-[720px] w-full px-5 pb-0 mt-[30px]">
          {/* 일일남매 섹션 */}
          <Link
            href="/socialing/love-buddies/11namme"
            className="group flex flex-row gap-3 sm:gap-4 w-full items-center mb-6 sm:mb-8"
          >
            {/* 포스터 */}
            <div className="relative w-[120px] sm:w-[190px] md:w-[228px] aspect-[3/4] rounded-lg overflow-hidden shadow-lg transition-transform group-hover:scale-105 group-hover:shadow-2xl flex-shrink-0">
              <Image
                src="/ssobig_assets/socialing/poster_일일남매.png"
                alt="일일남매 포스터"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 120px, (max-width: 768px) 190px, 228px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            {/* 설명 */}
            <div className="flex-1 text-left">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-pink-300 transition-colors">
                🙋🏻‍♀️ 일일남매
              </h3>
              <p className="text-xs sm:text-base text-neutral-300 leading-relaxed">
                매력적인 남녀들이 모여 흥미진진하게 서로를 알아가는 콘텐츠
              </p>
              <div className="mt-2 sm:mt-3 inline-flex items-center text-white/80 group-hover:text-white transition-colors">
                <span className="text-xs sm:text-base">자세히 보기 →</span>
              </div>
            </div>
          </Link>

          {/* 알파남매 섹션 */}
          <Link
            href="/socialing/love-buddies/alpha"
            className="group flex flex-row gap-3 sm:gap-4 w-full items-center mb-6"
          >
            {/* 포스터 */}
            <div className="relative w-[120px] sm:w-[190px] md:w-[228px] aspect-[3/4] rounded-lg overflow-hidden shadow-lg transition-transform group-hover:scale-105 group-hover:shadow-2xl flex-shrink-0">
              <Image
                src="/ssobig_assets/socialing/poster_마니또.png"
                alt="알파남매 포스터"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 120px, (max-width: 768px) 190px, 228px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            {/* 설명 */}
            <div className="flex-1 text-left">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-pink-300 transition-colors">
                💌 알파남매
              </h3>
              <p className="text-xs sm:text-base text-neutral-300 leading-relaxed">
                Top3를 선정하는 특별한 온라인 마니또 콘텐츠
              </p>
              <div className="mt-2 sm:mt-3 inline-flex items-center text-white/80 group-hover:text-white transition-colors">
                <span className="text-xs sm:text-base">자세히 보기 →</span>
              </div>
            </div>
          </Link>

          {/* Reviews Section Title */}
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 text-center w-full">
            일일남매 둘러보기
          </h3>

          {/* YouTube 영상 */}
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/qC0arXdNOlI"
              title="일일남매 영상"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoveBuddiesPage;

// It might be beneficial to add a custom font for "Love Buddies" logo via layout.tsx or similar
// For example, google fonts: <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet">
