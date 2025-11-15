"use client";

import Image from "next/image";
import Script from "next/script";

const SocialGeniusPage = () => {
  // const FORM_URL =
  //   "https://docs.google.com/forms/d/e/1FAIpQLSefYgNol9q9mYGzCcUs1SxoHaO3ECDb9LCAhMAv8oskvUuixw/viewform?usp=header";
  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel-game-orb"
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

      <div className="min-h-screen text-white font-sans relative">
        {/* 배경 이미지 next/image 적용 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/gameorb/hero-main.jpg"
            alt="소셜지니어스 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
          {/* 배경 이미지 위에 그라데이션 오버레이 적용 */}
          <div className="fixed inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/55"></div>
          {/* 모바일 상단 GNB 영역 블랙 배경 */}
          <div className="fixed top-0 left-0 right-0 h-[88px] bg-black md:hidden z-0"></div>
        </div>

        {/* Content Area */}
        <main className="w-full md:max-w-[720px] flex flex-col items-center mx-auto pt-0 md:pt-6 pb-24 bg-black md:bg-transparent">
          {/* 포스터 이미지 */}
          <div className="w-full md:rounded-3xl overflow-hidden md:shadow-lg">
            <Image
              src="/ssobig_assets/gameorb/빠니와 불마.png"
              alt="빠니보틀과 함께하는 불면증 마피아"
              width={1080}
              height={1920}
              className="w-full h-auto block leading-[0]"
              priority
              style={{ display: "block", margin: 0, padding: 0 }}
            />
          </div>
        </main>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-black via-black to-transparent md:bg-none">
          <div className="w-full max-w-[720px] md:max-w-[600px] mx-auto">
            <button
              disabled
              className="w-full h-[56px] bg-gray-500 text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-all duration-300 text-base md:text-lg shadow-lg cursor-not-allowed opacity-70"
            >
              신청 마감
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialGeniusPage;
