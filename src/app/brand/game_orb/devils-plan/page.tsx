import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export const metadata = {
  title: "REAL GENIUS - Game Orb",
  description: "리얼지니어스 게임 예능 프로그램에 참여하세요",
};

export default function RealGeniusPage() {
  return (
    <>
      {/* Meta Pixel Code */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
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
        `}
      </Script>
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=681386597924392&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 pt-0 selection:bg-purple-500 selection:text-white">
        {/* 배경 이미지 next/image 적용 */}
        <div className="absolute inset-0 -z-10 bg-black">
          <Image
            src="/ssobig_assets/devils_plan_hoodie.png"
            alt="리얼지니어스 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center", opacity: 0.6 }}
            priority
            sizes="100vw"
          />
        </div>

        {/* 상단 내비게이션 */}
        <div className="w-full bg-black/80 py-4 px-4 z-20 flex items-center">
          <Link href="/brand/game_orb" className="inline-flex items-center text-neutral-300 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            돌아가기
          </Link>
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 pb-24">
          {/* 로고 이미지 */}
          <div className="w-full flex justify-center my-8">
            <div className="w-[300px] h-[100px] relative">
              <Image
                src="/ssobig_assets/brand logo=게임오브.png"
                alt="REAL GENIUS"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
          
          {/* 타이틀 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">REAL GENIUS</h1>
            <p className="text-xl text-purple-300">리얼 지니어스에 도전하세요</p>
          </div>
          
          {/* 메인 이미지 */}
          <div className="w-full h-auto mb-8 px-4">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
              <Image
                src="/ssobig_assets/devils_plan_hoodie.png"
                alt="리얼지니어스 포스터"
                fill
                sizes="(max-width: 620px) 100vw, 620px"
                priority
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
          </div>
          
          {/* 설명 텍스트 */}
          <div className="px-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">두뇌가 천재인 당신이 필요합니다</h2>
            <p className="text-neutral-200 mb-4">
              리얼지니어스는 참가자들이 다양한 두뇌 게임과 전략적 도전에 맞서는 새로운 형태의 게임 예능입니다.
            </p>
            <p className="text-neutral-200">
              당신의 지능과 전략적 사고력을 발휘해 최종 우승자가 되어보세요!
            </p>
          </div>
          
          {/* 참여 혜택 */}
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 mx-4 mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">참여 혜택</h3>
            <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-200">
              <li>우승 상금 최대 1,000만원</li>
              <li>방송 출연 기회</li>
              <li>다양한 협찬 상품</li>
              <li>독특한 게임 경험</li>
            </ul>
          </div>
        </div>
        
        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <a 
              href="https://dis.qa/rse3db6" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center transition-colors text-lg"
            >
              지금 바로 참여하기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 