import Image from "next/image";
import Card, { CardProps } from "../../../components/Card";
import Script from "next/script";

export const metadata = {
  title: "Ssobig-N.O.W.seoul 나우서울",
};

export default function NowSeoulPage() {
  const nowSeoulCard: CardProps = {
    title: "[Meet Up] 목요일 저녁 7시 참여하기",
    description:
      "N.O.W.seoul · 매주 목요일 7:30PM · 지옥철 대신 만나는 새로운 인연과 아이디어",
    linkText: "smore.im/form/F0P6EWOhoW",
    linkHref: "https://smore.im/form/F0P6EWOhoW",
    linkIconType: "link",
    hasImageArea: true,
    imagePlaceholderText: "N.O.W.seoul Meetup",
    imageAreaStyle: {
      backgroundImage: "url('/ssobig_assets/now_seoul_regular.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    fullImageCard: true,
  };

  const careerClassCard: CardProps = {
    title: "[Class] 토요일 오후 3시 수강신청",
    description: "N.O.W.seoul · 커리어 클래스 · 전문가들의 실전 노하우 공유",
    linkText: "smore.im/form/I2qQSKCTHm",
    linkHref: "https://smore.im/form/I2qQSKCTHm",
    linkIconType: "link",
    hasImageArea: true,
    imagePlaceholderText: "N.O.W.seoul Career Class",
    imageAreaStyle: {
      backgroundImage: "url('/ssobig_assets/career_class.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    fullImageCard: true,
  };

  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel-now-seoul"
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
            fbq('init', '2385974028469308');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start pb-4 px-0 selection:bg-blue-500 selection:text-white pt-[72px]">
        {/* 배경 이미지 next/image 적용 */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/ssobig_assets/나우서울 배경.jpg"
            alt="나우서울 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
        </div>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
        {/* Content Area */}
        <main className="z-10 flex flex-col items-center text-center max-w-[620px] w-full p-5">
          {/* Logo Image */}
          <div className="mt-4 mb-4 w-full max-w-[400px] h-[150px] relative flex justify-center items-center">
            <Image
              src="/ssobig_assets/brand logo=나우서울.png"
              alt="나우서울 로고"
              fill
              style={{ objectFit: "contain" }}
              className="mx-auto"
              priority
            />
          </div>
          
          {/* Instagram Icon Link */}
          <a
            href="https://www.instagram.com/n.o.w.seoul/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 transition-transform hover:scale-110 flex items-center gap-1"
            aria-label="나우서울 인스타그램"
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

          <div className="text-left w-full">
            {/* Title */}
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white mb-3">
              N.O.W.seoul 나우서울
            </h2>

            {/* Description */}
            <p className="text-[14px] sm:text-[16px] text-neutral-300 mb-10 w-full leading-relaxed">
              나우서울(N.O.W.seoul)은 &apos;Night Off Work&apos;의 줄임말로,
              퇴근 후 다양한 분야의 전문가들이 모여 아이디어를 나누고,
              협업의 가능성을 발견하는 커뮤니티입니다.
            </p>
          </div>

          {/* 참가후기 섹션 위의 여백 */}
          <div className="h-[25px]"></div>

          {/* 신청 링크 섹션 */}
          <div className="w-full mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">
              나우서울 신청링크
            </h3>
            <div className="w-full mt-4">
              <Card {...nowSeoulCard} />
            </div>
          </div>
          
          {/* 커리어 클래스 카드 */}
          <div className="w-full mb-12">
            <Card {...careerClassCard} />
          </div>
        </main>
      </div>
    </>
  );
}
