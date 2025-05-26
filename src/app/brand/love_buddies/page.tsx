import Image from "next/image";
import ActionButton from "../../../components/ActionButton";
import Script from "next/script";
import ImageSlider from "../../../components/ImageSlider";

export const metadata = {
  title: "Ssobig-Love Buddies",
};

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

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start pb-4 px-0 selection:bg-pink-500 selection:text-white pt-[72px]">
        {/* 배경 이미지 next/image 적용 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/러브버디즈 배경.jpg"
            alt="러브버디즈 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
          {/* 배경 이미지 위에 그라데이션 오버레이 적용 */}
          <div className="fixed inset-0 bg-gradient-to-b from-black to-transparent"></div>
        </div>

        {/* 이미지 및 컨텐츠 영역 */}
        <div className="w-full max-w-[620px] mx-auto z-10 relative text-center px-5 pt-5 flex flex-col items-center gap-[30px]">
          {/* 로고 이미지 */}
          <div className="w-full max-w-[400px] h-[96px] sm:h-[150px] relative flex justify-center items-center mx-auto">
            <Image
              src="/ssobig_assets/brand logo=러브버디즈.png"
              alt="러브버디즈 로고"
              fill
              style={{ objectFit: "contain" }}
              className="mx-auto"
              priority
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
                src="/ssobig_assets/instaBigIcon.png"
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
        <main className="z-10 flex flex-col items-center text-center max-w-[620px] w-full p-5 mt-[30px]">
          {/* 상세 페이지 버튼 */}
          <ActionButton
            href="/brand/love_buddies/detail"
            className="mb-6"
            target="_self"
            rel=""
            brandPage="love_buddies"
            buttonType="main_cta"
            destination="internal_page"
          >
            러브버디즈 콘텐츠 참여하기 🙋🏻‍♀
          </ActionButton>

          {/* 참가후기 섹션 위의 여백 */}
          <div className="h-[50px]"></div>

          {/* Reviews Section Title */}
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            일일남매 둘러보기
          </h3>

          {/* 이미지 슬라이더 추가 */}
          <div className="w-full mt-2 mb-10">
            <ImageSlider
              images={[
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_14.png",
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_15.png",
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_17.png",
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_18.png",
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_19.png",
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_20.png",
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_22.png",
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_23.png",
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_24.png",
                "/ssobig_assets/러브버디즈 둘러보기/일일남매_25.png",
              ]}
              altTexts={[
                "일일남매 활동 사진 1",
                "일일남매 활동 사진 2",
                "일일남매 활동 사진 3",
                "일일남매 활동 사진 4",
                "일일남매 활동 사진 5",
                "일일남매 활동 사진 6",
                "일일남매 활동 사진 7",
                "일일남매 활동 사진 8",
                "일일남매 활동 사진 9",
                "일일남매 활동 사진 10",
              ]}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default LoveBuddiesPage;

// It might be beneficial to add a custom font for "Love Buddies" logo via layout.tsx or similar
// For example, google fonts: <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet">
