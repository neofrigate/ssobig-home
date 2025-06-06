import Image from "next/image";
import MainCard, { MainCardProps } from "../components/MainCard";
import CardWrapper from "../components/CardWrapper";

export const metadata = {
  title: "Ssobig Home",
  description:
    "인터렉션과 소통, 게임화를 통해 사람들을 연결하는 플랫폼 쏘빅입니다.",
};

export default function Home() {
  const solutionItems: MainCardProps[] = [
    {
      title: "Ssobig tool",
      description: "인터렉션 소통, 게임화 제작 툴",
      linkText: "about.ssobig.com",
      linkHref: "https://about.ssobig.com",
      linkIconType: "link",
      imageUrl: "/ssobig_assets/쏘빅카드로고.png",
      imageAreaStyle: { backgroundColor: "#000000" },
    },
  ];

  const brandItems: MainCardProps[] = [
    {
      title: "러브버디즈",
      description: "매력있고 사람스러운 찐친 만드는 곳",
      linkText: "love_buddies",
      linkHref: "/brand/love_buddies",
      linkIconType: "link",
      imageUrl: "/ssobig_assets/러브버디즈.png",
      imageAreaStyle: { backgroundColor: "#000000" },
    },
    {
      title: "N.O.W.seoul 나우서울",
      description: "퇴근 후 만나는 전문직 비즈니스 네트워킹 모임",
      linkText: "now_seoul",
      linkHref: "/brand/now_seoul",
      linkIconType: "link",
      imageUrl: "/ssobig_assets/나우서울.png",
      imageAreaStyle: {},
    },
    {
      title: "게임오브",
      description: "TV속 게임을 만들고 플레이하는 커뮤니티",
      linkText: "game_orb",
      linkHref: "/brand/game_orb",
      linkIconType: "link",
      imageUrl: "/ssobig_assets/게임오브.png",
      imageAreaStyle: {},
    },
  ];

  const communityItems: MainCardProps[] = [
    {
      title: "쏘빅 커뮤니티",
      description: "쏘빅 커뮤니티",
      linkText: "슬랙링크",
      linkHref: "https://dis.qa/hKclNB",
      linkIconType: "link",
      hasImageArea: false,
      cardBgClass: "bg-neutral-200",
      titleClass: "text-neutral-900 font-bold",
      descriptionClass: "text-neutral-700",
      linkTextClass: "text-neutral-700",
    },
  ];

  return (
    <div className="min-h-screen text-neutral-100 font-sans relative flex flex-col items-center pt-[72px] px-5 selection:bg-orange-500 selection:text-white">
      {/* 배경 이미지 next/image 적용 */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/ssobig_assets/러브버디즈 배경.jpg"
          alt="쏘빅 배경"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
          sizes="100vw"
          className="fixed"
        />
      </div>

      {/* 배경에 오버레이 적용 */}
      <div className="absolute inset-0 bg-black/80 z-[1]"></div>

      {/* 콘텐츠 컨테이너 */}
      <main className="w-full max-w-2xl mx-auto z-10 relative">
        {/* 프로필 섹션 */}
        <header className="text-center mb-8 md:mb-10 mt-6">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-full mx-auto mb-5 flex items-center justify-center shadow-lg border border-black overflow-hidden">
            {/* 쏘빅 로고 이미지 */}
            <Image
              src="/ssobig_assets/쏘빅 로고.png"
              alt="쏘빅 로고"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            ssobig 쏘빅
          </h1>
          <p className="text-sm sm:text-base text-neutral-300/90 max-w-md mx-auto leading-relaxed">
            인터렉션과 소통, 게임화를 통해
            <br />
            사람들을 연결하는 플랫폼 쏘빅입니다.
          </p>
        </header>

        {/* Brands 섹션 */}
        <section className="mb-10 md:mb-12">
          <div className="flex items-center gap-4 sm:gap-5 text-center mb-5 sm:mb-6">
            <hr className="flex-grow border-t border-neutral-500/80" />
            <h2
              className="text-lg sm:text-xl font-normal text-white shrink-0 px-2"
              style={{ fontFamily: "'Playwrite US Trad', cursive" }}
            >
              Brands
            </h2>
            <hr className="flex-grow border-t border-neutral-500/80" />
          </div>
          <div className="space-y-4 sm:space-y-5">
            {brandItems.map((item) => (
              <CardWrapper key={item.title} href={item.linkHref}>
                <MainCard {...item} />
              </CardWrapper>
            ))}
          </div>
        </section>

        {/* Solutions 섹션 */}
        <section className="mb-10 md:mb-12">
          <div className="flex items-center gap-4 sm:gap-5 text-center mb-5 sm:mb-6">
            <hr className="flex-grow border-t border-neutral-500/80" />
            <h2
              className="text-lg sm:text-xl font-normal text-white shrink-0 px-2"
              style={{ fontFamily: "'Playwrite US Trad', cursive" }}
            >
              Solutions
            </h2>
            <hr className="flex-grow border-t border-neutral-500/80" />
          </div>
          <div className="space-y-4 sm:space-y-5">
            {solutionItems.map((item) => (
              <CardWrapper key={item.title} href={item.linkHref}>
                <MainCard {...item} />
              </CardWrapper>
            ))}
          </div>
        </section>

        {/* Community 섹션 */}
        <section className="mb-14 md:mb-20">
          <div className="flex items-center gap-4 sm:gap-5 text-center mb-5 sm:mb-6">
            <hr className="flex-grow border-t border-neutral-500/80" />
            <h2
              className="text-lg sm:text-xl font-normal text-white shrink-0 px-2"
              style={{ fontFamily: "'Playwrite US Trad', cursive" }}
            >
              Community
            </h2>
            <hr className="flex-grow border-t border-neutral-500/80" />
          </div>
          <div className="space-y-4 sm:space-y-5">
            {communityItems.map((item) => (
              <CardWrapper key={item.title} href={item.linkHref}>
                <MainCard {...item} />
              </CardWrapper>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
