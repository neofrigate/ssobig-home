import Image from "next/image";
import Script from "next/script";
import LinkWithUtm from "../../../../components/LinkWithUtm";

export const metadata = {
  title: "러브버디즈 상세 - Love Buddies",
  description: "러브버디즈 상세 정보 페이지입니다",
};

export default function LoveBuddiesDetailPage() {
  return (
    <>
      {/* Meta Pixel Code */}
      <Script id="facebook-pixel-detail" strategy="afterInteractive">
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
                src="/ssobig_assets/상세 상단 공통 디자인_일일남매.png"
                alt="일일남매 상단 디자인"
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
                src="/ssobig_assets/일일남매 상세1.jpg"
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
                src="/ssobig_assets/일일남매 상세 2.png"
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
              href="https://form.ssobig.com/lovebuddies"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#FF6B9F] hover:bg-[#e45a8b] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
            >
              러브버디즈 참여하기 🙋🏻‍♀
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

        {/* 고정 상담 버튼 */}
        <div className="fixed bottom-[88px] right-4 md:right-8 z-30">
          <LinkWithUtm
            href="http://pf.kakao.com/_qUbTG/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[56px] h-[56px] bg-[#FF6B9F]/50 hover:bg-[#e45a8b]/60 border border-[#FF6B9F] text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
            aria-label="카카오톡 상담하기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
            >
              <path
                fillRule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
                clipRule="evenodd"
              />
            </svg>
          </LinkWithUtm>
        </div>
      </div>
    </>
  );
}
