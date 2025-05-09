"use client";

import React from "react";
import Image from "next/image";

// Helper components for Icons (copied from src/app/page.tsx)
// Consider refactoring these into shared components
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
  description: string; // Can be multi-line with <br /> or \n in data, then handle in component
  linkText: string;
  linkHref: string;
  linkIconType: "link" | "instagram";
  hasImageArea?: boolean;
  cardBgClass?: string;
  titleClass?: string;
  descriptionClass?: string;
  linkTextClass?: string;
  fullImageCard?: boolean; // 전체 이미지 카드 여부를 나타내는 속성 추가
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
  cardBgClass = "bg-neutral-800", // Slightly lighter for card on dark bg
  titleClass = "text-neutral-100 font-bold",
  descriptionClass = "text-neutral-300",
  linkTextClass = "text-neutral-300 hover:text-white",
  fullImageCard = false, // 기본값은 false
}) =>
  fullImageCard ? (
    // 전체 이미지 카드 스타일
    <a
      href={linkHref}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className="rounded-[28px] shadow-lg overflow-hidden hover:shadow-xl flex flex-col w-full"
        style={{
          boxShadow: "0px 0px 20px 0px rgba(255, 255, 255, 0.50)",
          aspectRatio: "580/326.25",
        }}
      >
        <div
          className="flex-1"
          style={{
            ...imageAreaStyle,
            backgroundImage: imageAreaStyle?.backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="bg-white px-4 py-3 text-black">
          <h3 className="text-base font-bold mb-1">{title}</h3>
          <div className="flex items-center">
            <div className="text-xs text-neutral-600 group inline-flex items-center">
              {linkIconType === "link" && (
                <LinkIcon className="text-neutral-600" />
              )}
              {linkIconType === "instagram" && (
                <CssInstagramIcon className="text-neutral-600" />
              )}
              {linkText}
            </div>
          </div>
        </div>
      </div>
    </a>
  ) : (
    // 기존 카드 스타일
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
        {/* Use dangerouslySetInnerHTML or a similar method if description contains HTML for line breaks */}
        <p
          className={`text-xs sm:text-sm mb-3 leading-relaxed ${descriptionClass}`}
          dangerouslySetInnerHTML={{
            __html: description.replace(/\n/g, "<br />"),
          }}
        ></p>
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
    fullImageCard: true, // 전체 이미지 카드로 설정
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
    fullImageCard: true, // 전체 이미지 카드로 설정
  };

  return (
    <div
      className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start p-4 selection:bg-blue-500 selection:text-white"
      style={{
        backgroundImage: "url('/ssobig_assets/나우서울 배경.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-[1]"></div> {/* Overlay */}
      {/* Content takes higher z-index */}
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <header className="w-full max-w-[620px] mx-auto text-center pt-0">
          {/* 로고 이미지 */}
          <div className="mt-[92px] mb-4 w-full max-w-[400px] h-[150px] relative flex justify-center items-center mx-auto">
            <Image
              src="/ssobig_assets/brand logo=나우서울.png"
              alt="나우서울 로고"
              layout="fill"
              objectFit="contain"
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
                퇴근 후 다양한 분야의 전문가들이 모여 아이디어를 나누고, 협업의
                가능성을 발견하는 커뮤니티입니다.
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
        {/* 홈으로 돌아가는 링크 또는 푸터 등을 여기에 추가할 수 있습니다. */}
      </div>
    </div>
  );
}
