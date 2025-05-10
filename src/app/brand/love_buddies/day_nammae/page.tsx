"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { HamburgerIcon } from "../../../../components/IconComponents";
import ActionButton from "../../../../components/ActionButton";

const DayNammaePage = () => {
  const backgroundImages = [
    "/images/dayNammae/일일남매_1.jpg",
    "/images/dayNammae/일일남매_2.jpg",
    "/images/dayNammae/일일남매_3.jpg",
    "/images/dayNammae/일일남매_4.jpg",
    "/images/dayNammae/일일남매_5.jpg",
  ];

  useEffect(() => {
    // 클라이언트 측에서 문서 제목 설정
    document.title = "Ssobig-Love Buddies-일일남매";
  }, []);

  return (
    <div className="relative h-screen overflow-y-auto snap-y snap-mandatory">
      {/* 각 배경 이미지 섹션 */}
      {backgroundImages.map((src, index) => (
        <section
          key={index}
          className="h-screen w-full flex flex-col items-center justify-center relative snap-start snap-always"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* <div className="absolute inset-0 bg-black/70 z-0"></div> */}

          {index === 0 && (
            <>
              {/* 첫 번째 섹션에만 로고와 콘텐츠 표시 */}
              <div className="z-10 flex flex-col items-center text-center max-w-[620px] w-full px-4 pt-0">
                {/* Logo Image */}
                <div className="mt-[92px] mb-4 w-full max-w-[400px] h-[150px] relative flex justify-center items-center">
                  <Image
                    src="/ssobig_assets/brand logo=러브버디즈.png"
                    alt="러브버디즈 로고"
                    fill
                    style={{ objectFit: "contain" }}
                    className="mx-auto"
                    priority
                  />
                </div>

                {/* 일일남매 콘텐츠 */}
                <div className="text-left w-full max-w-[580px] text-white">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                    일일남매
                  </h2>
                  <p className="text-md sm:text-lg text-neutral-200 mb-1 max-w-md">
                    하루 동안 서로의 매력을 탐색하는 특별한 만남
                  </p>
                  <p className="text-sm text-neutral-300 mb-10 max-w-md leading-relaxed">
                    일일남매는 서로를 깊이 이해하고 성장할 수 있는 특별한 경험을
                    제공합니다. 하루 동안 서로의 이야기를 나누고, 미션을 함께
                    수행하며 의미 있는 시간을 보내세요.
                  </p>
                </div>
              </div>
            </>
          )}
        </section>
      ))}

      {/* Hamburger Menu Icon - positioned top right (고정) */}
      <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-20">
        <button aria-label="메뉴 열기" className="p-2 text-white">
          <HamburgerIcon />
        </button>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-6 left-0 right-0 z-20 px-4 flex justify-center">
        <ActionButton href="https://smore.im/form/0j4u3szCcL">
          일일남매 참여하기 🙋🏻‍♀
        </ActionButton>
      </div>
    </div>
  );
};

export default DayNammaePage;
