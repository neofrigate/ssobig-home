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
    <div className="relative h-screen overflow-y-auto snap-y snap-mandatory">
      {/* 각 배경 이미지 섹션 */}
      {backgroundImages.map((src, index) => (
        <section
          key={index}
          className="h-screen w-full flex flex-col items-center justify-center relative snap-start snap-always"
        >
          {/* next/image로 배경 이미지 처리 */}
          <div className="absolute inset-0 w-full h-full -z-10">
            <Image
              src={src}
              alt={`일일남매 배경 ${index + 1}`}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={index === 0}
              sizes="100vw"
            />
          </div>

          {index === 0 && (
            <>
              {/* 첫 번째 섹션에만 로고와 콘텐츠 표시 */}
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
