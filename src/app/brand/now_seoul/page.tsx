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
      "N.O.W.seoul\n매주 목요일 7:30PM\n지옥철 대신 만나는 새로운 인연과 아이디어",
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
    description: "N.O.W.seoul 커리어 클래스",
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
      <Script id="facebook-pixel-now-seoul" strategy="afterInteractive">
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

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start p-4 selection:bg-blue-500 selection:text-white">
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
        <div className="absolute inset-0 bg-black/60 z-[1]"></div>{" "}
        {/* Overlay */}
        {/* Content takes higher z-index */}
        <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <header className="w-full max-w-[620px] mx-auto text-center pt-0">
            {/* 로고 이미지 */}
            <div className="mt-[92px] mb-4 w-full max-w-[400px] h-[150px] relative flex justify-center items-center mx-auto">
              <Image
                src="/ssobig_assets/brand logo=나우서울.png"
                alt="나우서울 로고"
                fill
                style={{ objectFit: "contain" }}
                className="mx-auto"
                priority
              />
            </div>
            <a
              href="https://www.instagram.com/n.o.w.seoul/"
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
          </header>

          <main className="w-full max-w-[620px] mx-auto">
            <section className="mb-10 md:mb-12 px-2 sm:px-0">
              <div className="text-left w-full max-w-[580px]">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  N.O.W.seoul 나우서울
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 max-w-md leading-relaxed">
                  나우서울(N.O.W.seoul)은 &apos;Night Off Work&apos;의 줄임말로,
                  퇴근 후 다양한 분야의 전문가들이 모여 아이디어를 나누고,
                  협업의 가능성을 발견하는 커뮤니티입니다.
                </p>
              </div>
            </section>

            <section className="mb-10 md:mb-12 px-2 sm:px-0">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-6 text-left">
                나우서울 신청링크
              </h3>
              <div className="max-w-[580px] mx-auto">
                <Card {...nowSeoulCard} />
              </div>
            </section>

            <section className="mb-12 px-2 sm:px-0">
              <div className="max-w-[580px] mx-auto">
                <Card {...careerClassCard} />
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
