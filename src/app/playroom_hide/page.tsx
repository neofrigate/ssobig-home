import Image from "next/image";

export default function PlayroomPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ssobig_assets/playroom/커밍쑨 배경.png"
          alt="배경"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
      </div>

      {/* 오버레이 그라디언트 */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* 콘텐츠 */}
      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* 메인 타이틀 */}
        <h1 className="text-[36px] sm:text-[44px] md:text-[52px] lg:text-[60px] font-bold text-white mb-8 leading-tight">
          COMING SOON
        </h1>

        {/* 본문 */}
        <div className="space-y-6 text-[16px] sm:text-[18px] md:text-[20px] text-gray-300 leading-relaxed">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            지금,{" "}
            <Image
              src="/ssobig_assets/Logo/logo=ssobig, color=white.png"
              alt="쏘빅"
              width={60}
              height={22}
              className="inline-block h-auto"
            />
            은 새로운{" "}
            <Image
              src="/ssobig_assets/Logo/logo=playroom, color=white.png"
              alt="플레이룸"
              width={90}
              height={29}
              className="inline-block h-auto"
            />
            을 준비하고 있어요.
          </p>

          <p>
            이제는 친구들과, 연인과, 동아리와 함께
            <br />
            어디서든 즐길 수 있는 콘텐츠를 만나보세요.
          </p>

          <p className="text-white font-semibold text-[18px] sm:text-[20px] md:text-[22px] pt-4">
            대규모 모임에서 검증된 쏘빅의 즐거움을
            <br />
            이제 당신의 작은 모임에서도.
          </p>
        </div>

        {/* 로딩 애니메이션 */}
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <div
              className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
