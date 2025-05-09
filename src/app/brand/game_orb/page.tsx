import React from "react";

// Helper components for Icons (copied from src/app/page.tsx)
// Consider refactoring these into shared components
const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656-5.656l-4-4a4 4 0 00-5.656 5.656l1.102 1.101"
    ></path>
  </svg>
);

const CssInstagramIcon = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="w-4 h-4 flex items-center justify-center" {...props}>
    <div
      className="w-full h-full rounded-[4px] flex items-center justify-center"
      style={{
        background:
          "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      }}
    >
      <div className="w-2 h-2 border-[1.5px] border-white rounded-full relative">
        <div className="w-[2px] h-[2px] bg-white rounded-full absolute top-[0.5px] right-[0.5px]"></div>
      </div>
    </div>
  </div>
);

interface CardProps {
  imagePlaceholderText?: string;
  imageAreaStyle?: React.CSSProperties;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  linkIconType: "link" | "instagram";
  hasImageArea?: boolean;
  cardBgClass?: string;
  titleClass?: string;
  descriptionClass?: string;
  linkTextClass?: string;
}

const Card: React.FC<CardProps> = ({
  imagePlaceholderText = "Image Area",
  imageAreaStyle,
  title,
  description,
  linkText,
  linkHref,
  linkIconType,
  hasImageArea = true,
  cardBgClass = "bg-neutral-700", // Adjusted for dark page
  titleClass = "text-neutral-100 font-bold", // Adjusted for dark card on dark page
  descriptionClass = "text-neutral-300", // Adjusted for dark card on dark page
  linkTextClass = "text-neutral-300 hover:text-white", // Adjusted for dark card on dark page
}) => (
  <div
    className={`rounded-xl shadow-lg flex flex-row overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBgClass}`}
  >
    {hasImageArea && (
      <div
        className="w-1/3 flex-shrink-0 bg-neutral-600/30 flex items-center justify-center p-3 self-stretch"
        style={imageAreaStyle} // Allows for backgroundImage
      >
        <span className="text-neutral-100 text-center text-xs">
          {imagePlaceholderText}
        </span>
      </div>
    )}
    <div
      className={`p-3 sm:p-4 flex-grow flex flex-col justify-center ${
        !hasImageArea ? "items-start" : ""
      }`}
    >
      <h3 className={`text-sm sm:text-base mb-1 ${titleClass}`}>{title}</h3>
      <p className={`text-xs mb-1.5 leading-snug ${descriptionClass}`}>
        {description}
      </p>
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-xs transition-colors duration-200 group inline-flex items-center mt-auto rounded px-1 py-0.5 hover:bg-black/10 active:bg-black/20 ${linkTextClass}`}
      >
        {linkIconType === "link" && (
          <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-current" />
        )}
        {linkIconType === "instagram" && (
          <CssInstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
        )}
        {linkText}
      </a>
    </div>
  </div>
);

export default function GameOrbPage() {
  const gameOrbCards: CardProps[] = [
    {
      title: "데블스플랜 같은 게임 예능 참여하기!",
      description: "흥미진진한 게임 예능에 지금 바로 참여하세요.",
      linkText: "about.ssobig.com",
      linkHref: "https://about.ssobig.com",
      linkIconType: "link",
      hasImageArea: true,
      imagePlaceholderText: "데블스플랜 참여",
      imageAreaStyle: {
        backgroundImage:
          "url('https://via.placeholder.com/300x200/2a2a2a/ffffff?Text=Hooded+Figure')", // 사용자: 이 URL을 실제 이미지로 교체하세요.
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#2a2a2a",
      },
    },
    {
      title: "게임오브 정모 신청",
      description: "커뮤니티 멤버들과 함께하는 정모에 참여하세요.",
      linkText: "about.ssobig.com",
      linkHref: "https://about.ssobig.com", // 이미지에 따르면 두 카드 모두 같은 링크를 사용합니다.
      linkIconType: "link",
      hasImageArea: true,
      imagePlaceholderText: "게임오브 정모",
      imageAreaStyle: {
        backgroundImage:
          "url('https://via.placeholder.com/300x200/2a2a2a/ffffff?Text=Group+Photo')", // 사용자: 이 URL을 실제 이미지로 교체하세요.
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#2a2a2a",
      },
    },
  ];

  return (
    <div
      className="min-h-screen text-white font-sans relative flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white"
      style={{ backgroundImage: "url('/ssobig_assets/게임오브 배경.jpg')" }}
    >
      {/* Optional: Main page와 유사한 배경 이미지 및 오버레이를 추가할 수 있습니다. */}
      {/* <div className="absolute inset-0 bg-black/80 z-[1]"></div> */}

      <div className="w-full max-w-2xl mx-auto z-10 relative text-center pt-12 pb-8">
        <h1
          className="text-5xl font-bold text-white mb-6"
          style={{ fontFamily: "'Playwrite US Trad', cursive" }}
        >
          GAME ORB
        </h1>
        <a
          href="https://www.instagram.com/game_orb/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-neutral-300 hover:text-white transition-colors group"
        >
          <CssInstagramIcon className="w-5 h-5 mr-2" />
          <span className="text-sm group-hover:underline">game_orb</span>
        </a>
      </div>

      <main className="w-full max-w-2xl mx-auto z-10 relative">
        <section className="mb-10 md:mb-12 text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">게임오브</h2>
          <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
            &apos;술 없이&apos; 매력있고 사랑스러운 &lt;찐친&gt;들 잔뜩 만드는
            곳!
            <br />
            [일일남매] [환승연애] 같은 러브버디즈의 모임은 매력적인 남녀들이
            모여 흥미진진하게 서로를 알아갈 수 있는 콘텐츠로 구성되어 있습니다.
          </p>
        </section>

        <section className="px-4 pb-12">
          <div className="space-y-5 sm:space-y-6">
            {gameOrbCards.map((item) => (
              <Card key={item.title} {...item} />
            ))}
          </div>
        </section>
      </main>
      {/* 홈으로 돌아가는 링크 등을 여기에 추가할 수 있습니다. */}
    </div>
  );
}
