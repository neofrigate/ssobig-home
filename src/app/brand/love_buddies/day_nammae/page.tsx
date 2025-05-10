import Image from "next/image";
import { HamburgerIcon } from "../../../../components/IconComponents";
import ActionButton from "../../../../components/ActionButton";

export const metadata = {
  title: "Ssobig-Love Buddies-일일남매",
};

const backgroundImages = [
  "/images/dayNammae/일일남매_1.jpg",
  "/images/dayNammae/일일남매_2.jpg",
  "/images/dayNammae/일일남매_3.jpg",
  "/images/dayNammae/일일남매_4.jpg",
  "/images/dayNammae/일일남매_5.jpg",
];

const DayNammaePage = () => {
  return (
    <div className="relative h-screen overflow-y-auto">
      {/* 각 배경 이미지 섹션 */}
      {backgroundImages.map((src, index) => (
        <section
          key={index}
          className="w-full relative flex flex-col items-center m-0 p-0"
        >
          {/* 이미지 컨테이너: 모든 margin 제거 (m-0 추가) */}
          <div className="w-full max-w-[620px] mx-auto m-0">
            <Image
              src={src}
              alt={`일일남매 배경 ${index + 1}`}
              width={0}
              height={0}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                objectPosition: "center",
                margin: 0,
                padding: 0,
                display: "block", // block으로 설정하여 이미지 사이 기본 간격 제거
              }}
              priority={index === 0}
              sizes="(max-width: 620px) 100vw, 620px"
            />
          </div>

          {index === 0 && (
            <>
              {/* 첫 번째 섹션에만 로고와 콘텐츠 표시 - mt-4 제거 */}
              <div className="z-10 flex flex-col items-center text-center max-w-[620px] w-full px-4 pt-0">
                {/* Logo Image 제거*/}
                {/* 일일남매 콘텐츠 제거 */}
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
