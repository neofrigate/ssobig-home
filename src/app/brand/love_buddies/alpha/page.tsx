"use client";

import Image from "next/image";
import Script from "next/script";
import Head from "next/head";
import LinkWithUtm from "../../../../components/LinkWithUtm";

export default function LoveBuddiesAlphaPage() {
  return (
    <>
      <Head>
        <title>러브버디즈 알파 - Love Buddies</title>
        <meta name="description" content="러브버디즈 알파 정보 페이지입니다" />
      </Head>
      {/* Meta Pixel Code */}
      <Script id="facebook-pixel-alpha" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2385974028469308');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2385974028469308&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-pink-500 selection:text-white">
        {/* 배경 이미지 - 스크롤에도 고정됨 */}
        <div className="fixed inset-0 -z-10 bg-black">
          <Image
            src="/ssobig_assets/러브버디즈 배경.jpg"
            alt="러브버디즈 배경"
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
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
          {/* 상단 공통 디자인 */}
          <div className="w-full h-auto">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/알파남매 포스터.jpg"
                alt="알파남매 포스터"
                width={620}
                height={0}
                style={{ width: "100%", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>

          {/* 상세 이미지 1 */}
          <div className="w-full h-auto">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/알파남매 1.jpg"
                alt="일일남매 상세 1"
                width={620}
                height={1200}
                style={{ width: "620px", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>

          {/* 상세 이미지 2 */}
          <div className="w-full h-auto">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/알파남매 2.jpg"
                alt="일일남매 상세 2"
                width={620}
                height={1200}
                style={{ width: "620px", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://smore.im/form/J1P3y5d52F"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#FF6B9F] hover:bg-[#e45a8b] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
              brandPage="love_buddies"
              buttonType="alpha_main_cta"
              destination="smore_form"
            >
              온라인 마니또 사전신청하기
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
