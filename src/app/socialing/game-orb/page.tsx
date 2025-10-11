"use client";

import React from "react";
import Image from "next/image";
import Card, { CardProps } from "../../../components/Card";
import Script from "next/script";

export default function GameOrbPage() {
  const gameOrbCards: CardProps[] = [
    {
      title: "SOCIAL GENIUS : 게임 예능 현실판 참여하기",
      description: "흥미진진한 게임 예능에 지금 바로 참여하세요.",
      linkText: "real_genius",
      linkHref: "/brand/game-orb/real_genius",
      linkIconType: "link",
      hasImageArea: true,
      imagePlaceholderText: "데블스플랜 참여",
      imageAreaStyle: {
        backgroundImage: "url('/ssobig_assets/소셜지니어스.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      fullImageCard: true,
      // 추적 정보 추가
      brandPage: "game_orb",
      buttonType: "social_genius_cta",
      destination: "internal_page",
    },
    // {
    //   title: "게임오브 정모 : 신작게임 데모데이",
    //   description: "커뮤니티 멤버들과 함께하는 정모에 참여하세요.",
    //   linkText: "demoday",
    //   linkHref: "/brand/game-orb/demoday",
    //   linkIconType: "link",
    //   hasImageArea: true,
    //   imagePlaceholderText: "게임오브 정모",
    //   imageAreaStyle: {
    //     backgroundImage: "url('/ssobig_assets/게임 정모 포스.png')",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //   },
    //   fullImageCard: true,
    //   // 추적 정보 추가
    //   brandPage: "game_orb",
    //   buttonType: "meetup_cta",
    //   destination: "internal_page",
    // },
    {
      title: "게임오브 비밀 카톡방 🎮",
      description: "게임 애호가들과 함께하는 비밀 카톡방에 참여하세요.",
      linkText: "kakao_chat",
      linkHref: "https://open.kakao.com/o/g9LIA56f",
      linkIconType: "link",
      hasImageArea: true,
      imagePlaceholderText: "게임오브 카톡방",
      imageAreaStyle: {
        backgroundImage: "url('/ssobig_assets/게임오브 단톡방.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      fullImageCard: true,
      // 추적 정보 추가
      brandPage: "game_orb",
      buttonType: "kakao_chat_cta",
      destination: "external_chat",
    },
  ];

  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel"
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
            fbq('init', '681386597924392');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start pb-4 px-0 selection:bg-purple-500 selection:text-white pt-[88px] md:pt-[60px]">
        {/* 배경 이미지 next/image 적용 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/게임오브 배경.jpg"
            alt="게임오브 배경"
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
              src="/ssobig_assets/brand logo=게임오브.png"
              alt="게임오브 로고"
              fill
              style={{ objectFit: "contain" }}
              className="mx-auto"
              priority
            />
          </div>

          {/* 인스타그램 아이콘 */}
          <a
            href="https://www.instagram.com/game_orb/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-neutral-300 hover:text-white transition-colors group"
            aria-label="인스타그램으로 이동"
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
              Game Orb 게임오브
            </h2>
            <p className="text-[14px] sm:text-[16px] text-neutral-300 w-full leading-relaxed">
              TV 게임 예능 프로그램의 짜릿하고 지적인 게임들을 현실에서 더
              재밌게 구현해내는 곳!
              <br />
              &lt;더 지니어스&gt;, &lt;크라임씬&gt;, &lt;피의 게임&gt;,
              &lt;데블스 플랜&gt;을 보며 느꼈던 두근거림과 감동을 일상의 만남
              속에 불러와, 참가자들이 주인공이 되어보는 장을 만들고자 합니다.
            </p>
          </div>
        </div>

        <main className="w-full max-w-[620px] mx-auto z-10 relative px-5 mt-[30px]">
          <section className="pb-12">
            {/* 신청 링크 섹션 */}
            <div className="w-full space-y-5 sm:space-y-6 max-w-[580px] mx-auto">
              {gameOrbCards.map((item) => (
                <Card key={item.title} {...item} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
