import Image from "next/image";
import Script from "next/script";
import LinkWithUtm from "../../../../components/LinkWithUtm";

export const metadata = {
  title: "N.O.W.seoul Meet UP",
  description:
    "다양한 직무의 실전형 전문가들이, 술 없이도 진짜로 성장하고 연결되는, 밀도 높은 평일 저녁 네트워킹 커뮤니티",
};

export default function RealGeniusPage() {
  const reviews = [
    {
      text: "다양한 직무의 전문가들과 깊이 있는 대화를 나눌 수 있어서 정말 값진 시간이었어요. 마케팅 아이디어를 얻고 실제 협업까지 이어진 경험이 놀라웠습니다!",
      author: "2년차 마케터 서지민",
    },
    {
      text: "평일 저녁에 이렇게 의미 있는 커뮤니티를 만날 수 있다니 놀랐어요. 개발자로서 다른 시각과 인사이트를 얻을 수 있는 소중한 기회였습니다.",
      author: "13년차 개발자 김도현",
    },
    {
      text: "체계적인 네트워킹 시스템에 감동했어요. 디자이너로서 다양한 분야의 피드백을 한 자리에서 얻고 실제 프로젝트 의뢰까지 받았습니다!",
      author: "5년차 디자이너 이혜원",
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

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-purple-500 selection:text-white">
        {/* 배경 이미지 next/image 적용 - 고정 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/나우서울 배경.jpg"
            alt="나우서울 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
          {/* 배경 이미지 위에 그라데이션 오버레이 적용 */}
          <div className="fixed inset-0 bg-gradient-to-b from-black to-transparent"></div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
          {/* 메인 이미지 */}
          <div className="w-full h-auto mb-10">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/나우서울 상세 상단.jpg"
                alt="나우서울 Meet UP 포스터"
                width={1240}
                height={620}
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, 620px"
                className="rounded-none w-full h-auto"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* 나우서울 밋업 스케줄 박스 */}
          <div className="w-full mb-12">
            <div className="bg-black rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-4">
                나우서울 밋업 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="bg-black/70 rounded-lg p-4 mb-5">
                <div className="flex flex-col space-y-4">
                  <div>
                    <div className="flex items-center flex-wrap">
                      <span className="text-white font-bold text-lg mr-2">
                        가격:
                      </span>
                      <span className="line-through text-gray-400 text-lg mr-2">
                        21,000원
                      </span>
                      <span className="text-[#FFAC3A] font-bold text-xl">
                        15,000원
                      </span>
                      <span className="bg-[#FFAC3A] text-black px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                        얼리버드
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      * 얼리버드 혜택은 선착순 마감됩니다
                    </p>
                  </div>
                  <div className="text-white font-bold text-lg">
                    매주 수요일 19:30~22:00
                    <span className="text-white"> (2.5시간)</span>
                  </div>
                </div>
              </div>

              {/* 일정 목록 */}
              <div className="space-y-3">
                <div className="flex items-center p-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-2 w-[90px]">
                    5/22 (수)
                  </span>
                  <span className="text-white font-bold">
                    스몰 브랜드 사이드 프로젝트
                  </span>
                  <span className="flex-grow"></span>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-2 w-[90px]">
                    5/29 (수)
                  </span>
                  <span className="text-white font-bold">AI & 업무 자동화</span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FFAC3A] text-black px-2 py-0.5 rounded-full text-xs font-bold">
                    얼리버드
                  </span>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-2 w-[90px]">
                    6/5 (수)
                  </span>
                  <span className="text-white font-bold">
                    생성형 AI와 콘텐츠 제작
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FFAC3A] text-black px-2 py-0.5 rounded-full text-xs font-bold">
                    얼리버드
                  </span>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-2 w-[90px]">
                    6/12 (수)
                  </span>
                  <span className="text-white font-bold">
                    AI를 활용한 협업 프로세스 구축
                  </span>
                  <span className="flex-grow"></span>
                  <span className="bg-[#FFAC3A] text-black px-2 py-0.5 rounded-full text-xs font-bold">
                    얼리버드
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 소개 섹션 및 나머지 콘텐츠 */}
          <div className="px-5">
            {/* 소개 섹션 */}
            <div className="my-[50px] space-y-4 text-center">
              <p className="text-lg">
                <span className="text-[#FFAC3A] font-semibold">
                  &quot;대규모 비즈니스 모임&quot;, &quot;취업 박람회&quot;,
                  <br />
                  &quot;그냥 명함만 주고 받는 모임...
                </span>
                <br />
                기존의 네트워킹에 아쉬움을 느끼셨나요?
              </p>

              <p className="text-lg">
                혹시{" "}
                <span className="text-[#FFAC3A] font-semibold">
                  &quot;다양한 직군의 전문가들과 진정한 연결을 하고
                  싶은데!&quot;
                </span>
                <br />
                혹은{" "}
                <span className="text-[#FFAC3A] font-semibold">
                  &quot;성장과 협업의 기회를 찾고 있는데, 어디서 만나야 할지
                  모르겠어요.&quot;
                </span>
                <br />
                라고 생각하신 적 있으신가요?
              </p>

              <p className="text-lg">
                아니면,{" "}
                <span className="text-[#FFAC3A] font-semibold">
                  &quot;평일 저녁을 어떻게 보낼까?
                  <br />
                  의미 있는 관계와 인사이트를 얻고 싶은데!&quot;
                </span>
                <br />
                하고 생각하셨나요?
              </p>
            </div>

            {/* 걱정 해소 섹션 */}
            <div className="mb-10 bg-black/50 backdrop-blur-[30px] p-6 rounded-xl">
              <div className="mb-4 text-center">
                <p className="text-base text-[#FFffff] mb-1">
                  🤯 &quot;네트워킹이라니, 어색하고 부담스럽지 않을까?&quot;
                </p>
                <p className="text-base text-[#FFffff] mb-2">
                  🥳 &quot;처음인데... 혼자인데... 잘 어울릴 수 있을까?&quot;
                </p>
                <p className="text-lg font-bold">걱정 마세요! 🙌</p>
              </div>
            </div>

            {/* 후기 섹션 */}
            <div className="mb-16">
              <h2 className="text-xl font-bold text-center mb-6">
                나우서울 참가자분들이 남겨주신
                <br />
                소중한 후기입니다
              </h2>

              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-xl">
                    <p className="text-base mb-2">&quot;{review.text}&quot;</p>
                    <p className="text-xs text-purple-300 text-right">
                      - {review.author}
                    </p>
                  </div>
                ))}
              </div>

              {/* 술없이도 이미지 추가 */}
              <div className="text-center mt-6 text-xl font-bold p-0 rounded-xl">
                <div className="w-full mb-4 px-0 pt-[40px]">
                  <Image
                    src="/ssobig_assets/나우서울 예시 이미지.png"
                    alt="나우서울 밋업 현장"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full rounded-[12px]"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "50px",
                    }}
                  />
                </div>

                <p className="text-base font-bold pb-[40px] pt-[20px]">
                  &quot;의미 있는 네트워킹을 통한 전문가 커뮤니티&quot;
                  <br />
                  가치 있는 연결이 만들어지는 곳
                  <br />
                  <br />
                  &quot;진정한 연결과 성장&quot;이 우리의 가치입니다
                </p>
              </div>
            </div>

            {/* 포인트 1 섹션 */}
            <div className="mb-10 bg-[#101F50]/10 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                  Point.1
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                밀도 높은 네트워킹 설계
              </h4>
              <p className="mb-4">
                기존 비즈니스 모임의 얕은 대화, 제한된 네트워크, 술자리 중심
                문화에서 벗어나{" "}
                <span className="font-bold text-[#FFAC3A]">
                  진정한 네트워킹의 가치
                </span>
                에 집중합니다.
              </p>
              <p className="mb-4">
                자체 개발 앱으로 프로필 카드를 작성하고, 다양한 직무의
                참가자들과 효과적으로 만날 수 있도록 자리를 배치합니다. 관심사가
                비슷한 사람들을 쉽게 찾을 수 있어 의미 있는 연결이 가능합니다.
              </p>

              {/* 이미지 추가 - img 태그로 변경 */}
              <div className="w-full my-8">
                <Image
                  src="/ssobig_assets/나우서울 포인트.png"
                  alt="밀도 높은 네트워킹 설계"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              <p className="text-lg font-bold text-center text-[#FFAC3A] mt-6">
                &quot;내가 성장하고, 남도 성장시키는&quot; 밀도 높은 커뮤니티 🤝
              </p>
            </div>

            {/* 포인트 2 섹션 */}
            <div className="mb-10 bg-[#101F50]/10 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                  Point.2
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                체계적이고 디테일한 진행방식
              </h4>
              <p className="mb-4">
                <span className="font-bold text-[#FFAC3A]">30분 룰</span>을
                기반으로 대화에 몰입하면서도 다양한 참가자들과 교류할 수 있는
                시스템을 운영합니다. 대규모 네트워킹이지만{" "}
                <span className="font-bold text-[#FFAC3A]">
                  4~6명의 소수로 그룹핑
                </span>
                되어 밀도 있는 대화가 가능하며, 3번의 테이블 세션에서 30분마다
                자리를 바꿔 최대한 많은 사람들과 만날 수 있습니다.
              </p>

              <div className="space-y-3">
                {/* 시작 세션 - 수정 */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">환영 및 오리엔테이션</span>
                  <span className="text-purple-300">[15분]</span>
                </div>
                <p className="text-sm text-white/80 ml-3 mb-4">
                  참가자 소개 및 나우서울 네트워킹 진행 방식 안내
                </p>

                {/* 테이블 세션 강조 */}
                <div className="bg-[#FFAC3A]/20 p-4 rounded-xl border border-[#FFAC3A] shadow-lg mt-4">
                  <p className="flex justify-between items-center mb-3">
                    <span className="text-xl font-extrabold text-[#FFAC3A]">
                      테이블 세션
                    </span>
                    <span className="text-lg font-bold text-white bg-[#FFAC3A]/30 px-3 py-1 rounded-full">
                      [1시간 30분]
                    </span>
                  </p>

                  <div className="pl-3 border-l-2 border-[#FFAC3A]/50 ml-2 space-y-3 mt-4">
                    <p className="flex justify-between">
                      <span className="font-medium">Table Session 1</span>
                      <span className="text-purple-300">[30분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      서로 다른 직무의 참가자들과 첫 대화
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">Table Session 2</span>
                      <span className="text-purple-300">[30분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      새로운 그룹과 심화 주제 토론
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">Table Session 3</span>
                      <span className="text-purple-300">[30분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      실질적 고민과 협업 가능성 모색
                    </p>
                  </div>
                </div>

                {/* 스탠딩 세션 강조 */}
                <div className="bg-[#FFAC3A]/20 p-4 rounded-xl border border-[#FFAC3A] shadow-lg mt-4">
                  <p className="flex justify-between items-center mb-3">
                    <span className="text-xl font-extrabold text-[#FFAC3A]">
                      스탠딩 세션
                    </span>
                    <span className="text-lg font-bold text-white bg-[#FFAC3A]/30 px-3 py-1 rounded-full">
                      [30분]
                    </span>
                  </p>

                  <div className="pl-3 border-l-2 border-[#FFAC3A]/50 ml-2 space-y-3 mt-4">
                    <p className="flex justify-between">
                      <span className="font-medium text-white">
                        Standing Session
                      </span>
                      <span className="text-purple-300">[30분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      자유롭게 더 대화하고 싶은 사람들과 연결
                    </p>
                    <p className="text-sm text-white/80 ml-3 mt-3">
                      프로필 카드를 통해 참가자들의 정보를 확인하고,{" "}
                      <span className="font-bold text-[#FFAC3A]">
                        상호 관심이 있는 경우에만
                      </span>{" "}
                      연락처가 공유되는 안전한 시스템으로 운영됩니다.
                    </p>
                  </div>
                </div>

                {/* 네트워킹 시간 - 수정 */}
                <div className="flex justify-between items-center mt-4">
                  <span className="font-medium">
                    마무리 & 자유 네트워킹 타임
                  </span>
                  <span className="text-purple-300">[15분~]</span>
                </div>
                <p className="text-sm text-white/80 ml-3">
                  관심 있는 참가자들과의 추가 대화 및 연결 기회
                </p>
              </div>
            </div>

            {/* 포인트 3 섹션 */}
            <div className="mb-10 bg-[#101F50]/10 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                  Point.3
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                지속 가능한 커뮤니티
              </h4>
              <p className="mb-5">
                나우서울 Meet Up은 일회성 모임이 아닌, 지속적인 관계 형성을
                목표로 합니다. 첫 만남 이후에도 참가자들 간의 연결을 유지할 수
                있는 다양한 채널과 후속 이벤트를 제공합니다.
              </p>

              <div className="bg-white/5 p-5 rounded-xl mb-6">
                <h5 className="font-bold text-[#FFAC3A] mb-3">
                  네트워킹 후속 지원
                </h5>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FFAC3A] mr-2">•</span>
                    <span>참가자 연락처 공유 시스템 (선택적)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFAC3A] mr-2">•</span>
                    <span>커뮤니티 온라인 그룹 초대</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFAC3A] mr-2">•</span>
                    <span>다음 Meet Up 및 관련 이벤트 우선 알림</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg font-bold text-center text-[#FFAC3A] mt-6">
                &quot;한 번의 만남, 지속적인 연결, 함께하는 성장&quot;
              </p>
            </div>

            {/* 마무리 섹션 */}
            <div className="text-center my-20">
              <h2 className="text-2xl font-bold mb-5">
                전문성은 나누고, 인사이트는 채우고!
                <br />
                진정한 네트워킹의 가치를 경험하세요!
              </h2>
              <p className="text-lg mb-8">
                이제 더 이상 형식적인 명함 교환에 그치지 마세요!
              </p>
              <p className="text-xl text-[#FFAC3A] font-bold">
                성장과 협업의 기회를 만들어 줄<br />
                &lt;나우서울 밋업&gt;이 당신을 기다립니다.
              </p>
            </div>

            {/* 연합어때 이미지 */}
            <div className="w-full my-24"></div>

            {/* FAQ 섹션 */}
            <div className="mb-16">
              {/* Single FAQ box for all questions */}
              <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-8">
                  자주 묻는 질문들
                </h2>

                <div className="space-y-8">
                  {/* Q1 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q1: 네트워킹이 너무 어색하지 않을까요? 처음인데
                      괜찮을까요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      걱정 마세요! 저희{" "}
                      <span className="font-bold">나우서울</span>의 모든 밋업은
                      &apos;자연스러운 연결&apos;을 모토로 설계되었습니다.
                      체계적인 세션 구성과 전문 퍼실리테이터의 가이드로 대화가
                      자연스럽게 이어집니다. 관심사와 직무 기반 테이블 매칭으로
                      공통 주제부터 대화를 시작할 수 있어 어색함이 빠르게
                      사라진답니다.
                    </p>
                  </div>

                  {/* Q2 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q2: 혼자 참여해도 괜찮을까요? 어색할 것 같아요.
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      물론입니다! 대부분의 참가자가 혼자 오십니다. 저희 밋업은
                      소규모 그룹(4~6명)으로 진행되어 모두가 균등하게 발언
                      기회를 갖고, 서로의 이야기에 귀 기울일 수 있는 환경을
                      제공합니다. 오히려 혼자 오시면 더 다양한 분들과 새로운
                      관계를 맺을 수 있어 네트워킹 효과가 극대화됩니다!
                    </p>
                  </div>

                  {/* Q3 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q3: 일반적인 비즈니스 미팅과는 어떤 차별점이 있나요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      일반 비즈니스 미팅은 종종 형식적이고 표면적인 관계에
                      그치지만,
                      <span className="font-bold"> 나우서울</span> 밋업은 진정성
                      있는 관계 형성에 중점을 둡니다. 30분 룰로 깊이 있는 대화와
                      다양한 관점을 경험할 수 있으며, 철저히 참가자 중심의
                      설계로 모든 분이 가치 있는 연결을 만들어갑니다. 실제
                      프로젝트 협업, 멘토링, 정보 교류까지 이어지는 실질적인
                      네트워킹이 이루어집니다.
                    </p>
                  </div>

                  {/* Q4 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q4: 어떤 사람들이 주로 참여하나요? 분위기는 어떤가요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      디자인, 개발, 마케팅, 기획, 비즈니스 등 다양한 분야의
                      전문가들이 참여합니다. 주니어부터 시니어까지 다양한 경력의
                      참가자들이 모이지만, 공통점은 성장과 협업에 대한 열린
                      태도를 가진 분들이라는 점입니다. 분위기는 진지하면서도
                      편안하고, 상호 존중하는 환경에서 유익한 대화가 오가는 것이
                      특징입니다. 평균적으로 25-40세 전문가들이 많이 참여하시며,
                      매 회 새로운 만남을 경험하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://form.ssobig.com/nowseoul"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#101F50] hover:bg-[#0A1838] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
            >
              지금 바로 참여하기
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
            </LinkWithUtm>
          </div>
        </div>

        {/* 고정 상담 버튼 */}
        <div className="fixed bottom-[88px] right-4 md:right-8 z-30">
          <LinkWithUtm
            href="https://open.kakao.com/me/nowseoul"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[56px] h-[56px] bg-[#101F50]/50 hover:bg-[#0A1838]/60 border border-[#101F50] text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
            aria-label="카카오톡 상담하기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
            >
              <path
                fillRule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
                clipRule="evenodd"
              />
            </svg>
          </LinkWithUtm>
        </div>
      </div>
    </>
  );
}
