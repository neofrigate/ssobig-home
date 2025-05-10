"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { HamburgerIcon } from "../../../components/IconComponents";

// LinkIcon 컴포넌트를 실제 이미지로 변경

// Instagram 아이콘을 실제 이미지로 변경

const LoveBuddiesPage = () => {
  // Placeholder background image URL, replace with actual image
  // const backgroundImageUrl = "/ssobig_assets/러브버디즈 배경.png"; // Example image

  useEffect(() => {
    // 클라이언트 측에서 문서 제목 설정
    document.title = "Ssobig-Love Buddies";
  }, []);

  return (
    <div
      className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start p-4 selection:bg-pink-500 selection:text-white"
      style={{
        backgroundImage: "url('/ssobig_assets/러브버디즈 배경.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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
            src="/ssobig_assets/brand logo=러브버디즈.png" // 이미지 경로를 확인해주세요.
            alt="러브버디즈 로고"
            layout="fill"
            objectFit="contain" // fill과 유사하게 동작하도록 contain 또는 cover를 사용합니다. fill은 layout="fill"과 함께 사용될 때 부모 요소를 채웁니다.
            className="mx-auto" // 이미지 자체에도 중앙 정렬 클래스 추가
            priority // LCP 이미지일 경우 로딩 우선순위를 높입니다.
          />
        </div>

        {/* Instagram Icon Link */}
        <a
          href="https://www.instagram.com/love___buddies/" // Actual Instagram link
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
        <a
          href="https://smore.im/form/0j4u3szCcL"
          target="_blank"
          rel="noopener noreferrer"
          className="flex p-4 justify-center items-center gap-4 w-full max-w-[580px] rounded-full bg-[#FF7EF7] text-white font-semibold text-lg sm:text-xl shadow-[0px_0px_20px_0px_rgba(255,255,255,0.50)] transform transition-all hover:scale-105 duration-300 ease-in-out mb-6 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 aspect-[145/14]"
        >
          러브버디즈 콘텐츠 참여하기 🙋🏻‍♀
        </a>

        {/* Reviews Section Title */}
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
          참가후기
        </h3>

        {/* Review Event Button */}
        <a
          href="https://smore.im/form/4gwuBM7ukA"
          target="_blank"
          rel="noopener noreferrer"
          className="flex p-4 justify-center items-center gap-4 w-full max-w-[580px] rounded-full bg-[#FF7EF7] text-white font-semibold text-lg sm:text-xl shadow-[0px_0px_20px_0px_rgba(255,255,255,0.50)] transform transition-all hover:scale-105 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 aspect-[145/14]"
        >
          [일일남매] 참가후기 이벤트 👀
        </a>
      </main>
    </div>
  );
};

export default LoveBuddiesPage;

// It might be beneficial to add a custom font for "Love Buddies" logo via layout.tsx or similar
// For example, google fonts: <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet">
