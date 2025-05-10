import Image from "next/image";
import { HamburgerIcon } from "../../../components/IconComponents";
import ActionButton from "../../../components/ActionButton";
import Head from "next/head";

export const metadata = {
  title: "Ssobig-Love Buddies",
};

const LoveBuddiesPage = () => {
  return (
    <>
      <Head>
        {/* Meta Pixel Code */}
        <script
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
      </Head>
      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start p-4 selection:bg-pink-500 selection:text-white">
        {/* 배경 이미지 next/image 적용 */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/ssobig_assets/러브버디즈 배경.jpg"
            alt="러브버디즈 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 z-0"></div>

        {/* Hamburger Menu Icon - positioned top right */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20">
          <button aria-label="메뉴 열기" className="p-2">
            <HamburgerIcon />
          </button>
        </div>

        {/* Content Area */}
        <main className="z-10 flex flex-col items-center text-center max-w-[620px] w-full px-4 pt-0">
          {/* Logo Image */}
          <div className="mt-[92px] mb-4 w-full max-w-[400px] h-[150px] relative flex justify-center items-center">
            <Image
              src="/ssobig_assets/brand logo=러브버디즈.png"
              alt="러브버디즈 로고"
              fill
              style={{ objectFit: "contain" }}
              className="mx-auto"
              priority
            />
          </div>

          {/* Instagram Icon Link */}
          <a
            href="https://www.instagram.com/love___buddies/"
            aria-label="Love Buddies Instagram"
            className="mb-8 transition-transform hover:scale-110 flex items-center gap-1"
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

          <div className="text-left w-full max-w-[580px]">
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              러브버디즈
            </h2>

            {/* Subtitle */}
            <p className="text-md sm:text-lg text-neutral-200 mb-1 max-w-md">
              &apos;술 없이&apos; 매력있고 사랑스러운 &lt;찐친&gt;들 잔뜩 만드는
              곳!
            </p>

            {/* Description */}
            <p className="text-sm text-neutral-300 mb-10 max-w-md leading-relaxed">
              [일일남매] [환승연애] 같은 러브버디즈의 모임은 매력적인 남녀들이
              모여 흥미진진하게 서로를 알아갈 수 있는 콘텐츠로 구성되어 있습니다
            </p>
          </div>

          {/* Main Action Button */}
          <ActionButton
            href="/brand/love_buddies/day_nammae"
            className="mb-6"
            target="_self"
            rel=""
          >
            러브버디즈 콘텐츠 참여하기 🙋🏻‍♀
          </ActionButton>

          {/* Reviews Section Title */}
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
            참가후기
          </h3>

          {/* Review Event Button */}
          <ActionButton
            href="https://smore.im/form/4gwuBM7ukA"
            className="mb-0"
          >
            [일일남매] 참가후기 이벤트 👀
          </ActionButton>
        </main>
      </div>
    </>
  );
};

export default LoveBuddiesPage;

// It might be beneficial to add a custom font for "Love Buddies" logo via layout.tsx or similar
// For example, google fonts: <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet">
