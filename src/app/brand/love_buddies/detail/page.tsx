import Image from "next/image";

export const metadata = {
  title: "러브버디즈 상세 - Love Buddies",
  description: "러브버디즈 상세 정보 페이지입니다",
};

export default function LoveBuddiesDetailPage() {
  return (
    <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-pink-500 selection:text-white">
      {/* 배경 이미지 - 스크롤에도 고정됨 */}
      <div className="fixed inset-0 -z-10 bg-black">
        <Image
          src="/ssobig_assets/러브버디즈 배경.jpg"
          alt="러브버디즈 배경"
          fill
          style={{ objectFit: "cover", objectPosition: "center", opacity: 0.6 }}
          priority
          sizes="100vw"
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
        {/* 상세 이미지 1 */}
        <div className="w-full h-auto">
          <div className="relative w-full">
            <Image
              src="/ssobig_assets/일일남매 상세1.jpg"
              alt="일일남매 상세 1"
              width={620}
              height={1200}
              style={{ width: "620px", height: "auto" }}
              priority
              className="rounded-none"
            />
          </div>
        </div>

        {/* 상세 이미지 2 */}
        <div className="w-full h-auto">
          <div className="relative w-full">
            <Image
              src="/ssobig_assets/일일남매 상세 2.png"
              alt="일일남매 상세 2"
              width={620}
              height={1200}
              style={{ width: "620px", height: "auto" }}
              priority
              className="rounded-none"
            />
          </div>
        </div>
      </div>

      {/* 하단 고정 CTA 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
        <div className="w-full max-w-[620px] mx-auto">
          <a
            href="https://dis.qa/ROM2"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[56px] bg-[#FF6B9F] hover:bg-[#e45a8b] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
          >
            러브버디즈 참여하기 🙋🏻‍♀
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
