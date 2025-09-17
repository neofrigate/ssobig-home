import Image from "next/image";
import Card, { CardProps } from "../../../components/Card";
import ProfileSlider, {
  ProfileCardProps,
} from "../../../components/ProfileSlider";
import Script from "next/script";

export const metadata = {
  title: "Ssobig-N.O.W.seoul 나우서울",
};

export default function NowSeoulPage() {
  const nowSeoulCard: CardProps = {
    title: "[Meet Up] 목요일 저녁 7시 참여하기",
    description:
      "N.O.W.seoul · 매주 목요일 7:30PM · 지옥철 대신 만나는 새로운 인연과 아이디어",
    linkText: "meet-up",
    linkHref: "/brand/now_seoul/meet-up",
    linkIconType: "link",
    hasImageArea: true,
    imagePlaceholderText: "N.O.W.seoul Meetup",
    imageAreaStyle: {
      backgroundImage: "url('/ssobig_assets/now_seoul_regular.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    fullImageCard: true,
    // 추적 정보 추가
    brandPage: "now_seoul",
    buttonType: "meetup_cta",
    destination: "internal_page",
  };

  const participantProfiles: ProfileCardProps[] = [
    {
      name: "김민수",
      role: "UX 디자이너",
      company: "스타트업 A",
      description:
        "새로운 아이디어와 인사이트를 얻고, 다양한 분야의 전문가들과 네트워킹할 수 있어서 정말 만족스러워요!",
    },
    {
      name: "박지영",
      role: "프로덕트 매니저",
      company: "테크 기업 B",
      description:
        "퇴근 후 의미있는 시간을 보낼 수 있고, 업계 트렌드와 실무 노하우를 공유받아서 많은 도움이 되고 있습니다.",
    },
    {
      name: "이준호",
      role: "마케팅 디렉터",
      company: "광고 에이전시 C",
      description:
        "비슷한 고민을 가진 동료들과 만나서 서로의 경험을 나누고, 새로운 관점을 얻을 수 있는 소중한 시간이에요.",
    },
    {
      name: "최서연",
      role: "데이터 분석가",
      company: "핀테크 D",
      description:
        "업무에서는 만날 수 없는 다양한 직군의 사람들과 교류하며, 시야를 넓힐 수 있어서 참여하게 되었습니다.",
    },
    {
      name: "정태현",
      role: "개발자",
      company: "IT 스타트업 E",
      description:
        "실무진들과의 솔직한 대화와 networking이 가능해서 개인적, 전문적 성장에 큰 도움이 되고 있어요.",
    },
    {
      name: "한지민",
      role: "브랜드 매니저",
      company: "소비재 기업 F",
      description:
        "업계 선배님들의 조언을 듣고, 커리어 방향성에 대해 고민해볼 수 있는 좋은 기회라고 생각합니다.",
    },
  ];

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
            fbq('init', '1409643070210008');
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
          {/* 신청 링크 섹션 - 숨김 처리 */}
          {/* <section className="pb-12">
            <div className="w-full space-y-5 sm:space-y-6 max-w-[580px] mx-auto">
              <Card {...nowSeoulCard} />
            </div>
          </section> */}

          {/* 참여자 프로필 섹션 */}
          <section className="pb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                이런분들이 참여해요
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base">
                다양한 분야의 전문가들이 함께하는 N.O.W.seoul
              </p>
            </div>
            <div className="w-full">
              <ProfileSlider profiles={participantProfiles} />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
