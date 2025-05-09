"use client";

import React from "react";
import Image from "next/image";

// LinkIcon 컴포넌트를 실제 이미지로 변경
const LinkIcon = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 ${props.className}`}>
    <Image
      src="/ssobig_assets/linkIcon.png"
      alt="링크 아이콘"
      width={16}
      height={16}
      className="w-full h-full"
    />
  </div>
);

// Instagram 아이콘을 실제 이미지로 변경
const CssInstagramIcon = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 ${props.className}`}>
    <Image
      src="/ssobig_assets/instaIcon.png"
      alt="인스타그램 아이콘"
      width={16}
      height={16}
      className="w-full h-full"
    />
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
  cardBgClass = "bg-neutral-900", // Near black for card
  titleClass = "text-neutral-100 font-bold",
  descriptionClass = "text-neutral-300",
  linkTextClass = "text-neutral-300 hover:text-white",
}) => (
  <div
    className={`rounded-xl shadow-lg flex flex-col sm:flex-row overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBgClass}`}
  >
    {hasImageArea && (
      <div
        className="w-full sm:w-1/3 h-48 sm:h-auto flex-shrink-0 bg-neutral-700/50 flex items-center justify-center p-3 self-stretch"
        style={imageAreaStyle} // Allows for backgroundImage
      >
        {/* If imageAreaStyle.backgroundImage is set, placeholder text might be hidden or styled to be an overlay */}
        {!imageAreaStyle?.backgroundImage && (
          <span className="text-neutral-100 text-center text-xs">
            {imagePlaceholderText}
          </span>
        )}
      </div>
    )}
    <div
      className={`p-4 flex-grow flex flex-col justify-center ${
        !hasImageArea ? "items-start" : ""
      }`}
    >
      <h3 className={`text-base sm:text-lg mb-2 ${titleClass}`}>{title}</h3>
      <p
        className={`text-xs sm:text-sm mb-3 leading-relaxed ${descriptionClass}`}
      >
        {description}
      </p>
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-xs transition-colors duration-200 group inline-flex items-center mt-auto rounded px-1 py-0.5 hover:bg-white/10 active:bg-white/20 ${linkTextClass}`}
      >
        {linkIconType === "link" && <LinkIcon />}
        {linkIconType === "instagram" && <CssInstagramIcon />}
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
