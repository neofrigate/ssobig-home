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
    linkText: "form.ssobig.com/nowseoul",
    linkHref: "https://form.ssobig.com/nowseoul",
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
    linkText: "form.ssobig.com/nowclass",
    linkHref: "https://form.ssobig.com/nowclass",
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
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/나우서울 배경.jpg"
            alt="나우서울 배경"
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
              src="/ssobig_assets/brand logo=나우서울.png"
              alt="나우서울 로고"
              fill
              style={{ objectFit: "contain" }}
              className="mx-auto"
              priority
            />
          </div>

          {/* 인스타그램 아이콘 */}
          <a
            href="https://www.instagram.com/n.o.w.seoul/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-neutral-300 hover:text-white transition-colors group"
            aria-label="나우서울 인스타그램"
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
              N.O.W.seoul 나우서울
            </h2>
            <p className="text-[14px] sm:text-[16px] text-neutral-300 w-full leading-relaxed">
              나우서울(N.O.W.seoul)은 &apos;Night Off Work&apos;의 줄임말로,
              퇴근 후 다양한 분야의 전문가들이 모여 아이디어를 나누고, 협업의
              가능성을 발견하는 커뮤니티입니다.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <main className="w-full max-w-[620px] mx-auto z-10 relative px-5 mt-[30px]">
          <section className="pb-12">
            {/* 신청 링크 섹션 */}
            <div className="w-full space-y-5 sm:space-y-6 max-w-[580px] mx-auto">
              <Card {...nowSeoulCard} />
              <Card {...careerClassCard} />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
