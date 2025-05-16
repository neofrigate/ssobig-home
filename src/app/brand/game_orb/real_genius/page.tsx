import Image from "next/image";
import Script from "next/script";

export const metadata = {
  title: "REAL GENIUS - Game Orb",
  description: "당신이 주인공이 되는 게임예능 현실판 - 리얼 지니어스",
};

export default function RealGeniusPage() {
  const reviews = [
    {
      text: "드라마틱한 전개의 연속이라 시간 가는 줄 몰랐어요! 이렇게 흥미진진할 줄 몰랐네요!",
      author: "30대 직장인 K님",
    },
    {
      text: "전략 게임이라 어려울까봐 걱정했는데, 생각보다 쉽고 엄청 재미있었어요!",
      author: "20대 대학생 P님",
    },
    {
      text: "처음 본 사람들이랑 이렇게 빨리 친해질 수 있다니 놀라웠어요. 꼭 다시 참가하고 싶어요!",
      author: "30대 직장인 J님",
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
        <div className="fixed inset-0 -z-10 bg-black">
          <Image
            src="/ssobig_assets/devils_plan_hoodie.png"
            alt="리얼지니어스 배경"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.2,
            }}
            priority
            sizes="100vw"
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 px-0 mb-[72px]">
          {/* 메인 이미지 */}
          <div className="w-full h-auto">
            <div className="relative w-full">
              <Image
                src="/ssobig_assets/상세 상단 공통 디자인_리얼지니어스.png"
                alt="리얼지니어스 포스터"
                width={620}
                height={0}
                style={{ width: "100%", height: "auto" }}
                priority
                className="rounded-none"
              />
            </div>
          </div>

          {/* 리얼지니어스 스케줄 박스 */}
          <div className="w-full mb-8">
            <div className="bg-black rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-white mb-4">
                리얼지니어스 스케줄
              </h2>

              {/* 가격 및 시간 정보 */}
              <div className="bg-black/70 rounded-lg p-4 mb-5">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
                  <p className="text-white font-bold text-lg mb-2 sm:mb-0">
                    가격: <span className="text-white">28,000원</span>
                    <span className="text-[#9E4BED]">(오픈특가)</span>
                  </p>
                  <p className="text-white font-bold text-lg">
                    매주 일요일 17:00~20:00{" "}
                    <span className="text-white">(3시간)</span>
                  </p>
                </div>
              </div>

              {/* 일정 목록 */}
              <div className="space-y-3">
                <div className="flex items-center p-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-2 w-[90px]">
                    5/25 (일)
                  </span>
                  <span className="text-white font-bold flex-grow">
                    불면증 마피아
                  </span>
                  <div className="flex gap-1">
                    <span className="bg-yellow-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                      EASY
                    </span>
                    <span className="bg-purple-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                      MIDDLE
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-2 w-[90px]">
                    6/1 (일)
                  </span>
                  <span className="text-white font-bold flex-grow">
                    불면증 마피아
                  </span>
                  <div className="flex gap-1">
                    <span className="bg-yellow-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                      EASY
                    </span>
                    <span className="bg-purple-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                      MIDDLE
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-2 w-[90px]">
                    6/8 (일)
                  </span>
                  <span className="text-white font-bold flex-grow">
                    이중 스파이
                  </span>
                  <div className="flex gap-1">
                    <span className="bg-purple-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                      MIDDLE
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-2 w-[90px]">
                    6/15 (일)
                  </span>
                  <span className="text-white font-bold flex-grow">
                    바이너리
                  </span>
                  <div className="flex gap-1">
                    <span className="bg-yellow-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                      EASY
                    </span>
                    <span className="bg-purple-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                      MIDDLE
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-black/50 hover:bg-black/80 transition-colors">
                  <span className="font-medium text-[#F4F4F4] mr-2 w-[90px]">
                    6/22 (일)
                  </span>
                  <span className="text-white font-bold flex-grow">??????</span>
                  <div className="flex gap-1">
                    <span className="bg-orange-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                      HARD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 소개 섹션 및 나머지 콘텐츠 */}
          <div className="px-5">
            {/* 소개 섹션 */}
            <div className="my-[50px] space-y-4">
              <p className="text-lg">
                <span className="text-[#95BE62] font-semibold">
                  &quot;데블스 플랜&quot;, &quot;더 지니어스&quot;, &quot;피의
                  게임&quot;...
                </span>
                <br />
                게임 예능 속 숨 막히는 전략과 반전에 열광하셨나요?
              </p>

              <p className="text-lg">
                혹시{" "}
                <span className="text-[#95BE62] font-semibold">
                  &quot;나라면 저기서 저렇게 했을 텐데!&quot;
                </span>{" "}
                혹은{" "}
                <span className="text-[#95BE62] font-semibold">
                  &quot;저 게임, 내가 하면 더 잘할 수 있을 것 같은데?&quot;
                </span>{" "}
                라고 외치신 적 있으신가요?
              </p>

              <p className="text-lg">
                아니면,{" "}
                <span className="text-[#95BE62] font-semibold">
                  &quot;주말에 뭐하지? 새로운 사람들과 재밌게 놀고 싶은데!&quot;
                </span>{" "}
                하고 생각하셨나요?
              </p>
            </div>

            {/* 걱정 해소 섹션 */}
            <div className="mb-10 bg-black/50 backdrop-blur-[30px] p-6 rounded-xl">
              <div className="mb-4 text-center">
                <p className="text-base text-[#95BE62] mb-1">
                  🤯 &quot;게임예능이라니, 너무 어렵진 않을까?&quot;
                </p>
                <p className="text-base text-[#95BE62] mb-2">
                  🥳 &quot;처음인데... 혼자인데... 잘 어울릴 수 있을까?&quot;
                </p>
                <p className="text-lg font-bold">걱정 마세요! 🙌</p>
              </div>
            </div>

            {/* 후기 섹션 */}
            <div className="mb-16">
              <h2 className="text-xl font-bold text-center mb-6">
                참가자분들이 남겨주신
                <br />
                생생한 찐 후기모음🤩
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
                    src="/ssobig_assets/술없이도2.png"
                    alt="술없이도 이미지"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full rounded-[12px]"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "30px",
                    }}
                  />
                </div>

                <p className="text-base font-bold pb-[40px]">
                  😎 &quot;술 없이도 이렇게 재밌게 친해질 수 있다고?&quot;
                  <br />
                  네, 신기할걸요? 🙌
                  <br />
                  <br />
                  &quot;게임으로 즐겁게 친해진다!&quot;가 우리의 모토! 🙌
                </p>
              </div>
            </div>

            {/* 포인트 1 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  🔮Point.1
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                차별화된 전문성
              </h4>
              <p className="mb-4">
                저희는, 방송보다 더 재밌는 경험을 만들어드리는 걸 핵심 가치로
                삼고 있어요!
              </p>
              <p className="mb-4">
                방송과 똑같이 따라하기? <span className="font-bold">X</span>
                <br />
                <br />
                게임오브만의 독창적인 아이디어와 기술로 재해석하고, 시청자보다
                &apos;참가자&apos; 위주로 디자인한 자체 제작 게임들로
                채워집니다.
              </p>

              {/* 이미지 추가 - img 태그로 변경 */}
              <div className="w-full my-6">
                <Image
                  src="/ssobig_assets/차별화된 전문성.png"
                  alt="차별화된 전문성"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              <p className="text-lg font-bold text-center text-[#95BE62]">
                뇌지컬 풀가동! 심장은 쫄깃, 웃음은 빵빵! 🤣
              </p>
            </div>

            {/* 포인트 2 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  🔮Point.2
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                게임을 가장 잘 즐길 수 있는 진행방식
              </h4>

              <div className="space-y-3">
                <p className="flex justify-between">
                  <span>자유 탐색전 + 대화</span>
                  <span className="text-purple-300">[15분]</span>
                </p>
                <p className="flex justify-between">
                  <span>안내 + 튜토리얼</span>
                  <span className="text-purple-300">[20분]</span>
                </p>

                {/* 메인 매치 강조 */}
                <div className="bg-[#95BE62]/20 p-4 rounded-xl border border-[#95BE62] shadow-lg mt-4">
                  <p className="flex justify-between items-center mb-3">
                    <span className="text-xl font-extrabold text-[#95BE62]">
                      메인 매치
                    </span>
                    <span className="text-lg font-bold text-white bg-[#95BE62]/30 px-3 py-1 rounded-full">
                      [2시간]
                    </span>
                  </p>

                  <div className="pl-3 border-l-2 border-[#95BE62]/50 ml-2 space-y-3 mt-4">
                    <p className="flex justify-between">
                      <span className="font-medium">전반전</span>
                      <span className="text-purple-300">[50분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      승리 플레이어에게 후반전 베네핏 제공
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">
                        비밀 규칙 공개 + 전략회의
                      </span>
                      <span className="text-purple-300">[20분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      새로운 전략과 새로운 연합 등장
                    </p>

                    <p className="flex justify-between">
                      <span className="font-medium">후반전</span>
                      <span className="text-purple-300">[50분]</span>
                    </p>
                    <p className="text-sm text-white/80 ml-3">
                      후반전에서 &apos;생존&apos;해야 최종 승리
                    </p>
                  </div>
                </div>

                <p className="flex justify-between mt-4">
                  <span>후일담 나누기</span>
                  <span className="text-purple-300">[25분]</span>
                </p>
                <p>+ 인근 찐맛집 오픈런 2차</p>
              </div>
            </div>

            {/* 포인트 3 섹션 */}
            <div className="mb-10 bg-purple-500/10 backdrop-blur-[30px] p-6 rounded-xl border border-purple-500/50">
              <div className="mb-4 inline-block">
                <h3 className="text-xl font-extrabold text-[#9E4BED]">
                  🔮Point.3
                </h3>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                방대한 라인업
              </h4>
              <p className="mb-5">
                전문가들이 세심하게 설계한,
                <br />
                누구나 쉽고 재밌게 즐길 수 있는
                <br />
                자체 제작 게임들로 가득하죠.
              </p>

              {/* 가로 스크롤 카드 레이아웃 */}
              <div className="relative w-full pb-4 overflow-x-auto hide-scrollbar">
                <div className="inline-flex space-x-4 px-2 py-4">
                  {/* 불면증 마피아 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-orange-500/30">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/불면증 마피아.png"
                        alt="불면증 마피아 포스터"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-orange-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                          난이도 : 쉬움
                        </span>
                        <span className="text-white text-sm font-bold">
                          12~30명
                        </span>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        밤이 돼도 못 자...? 모두 눈을 뜬 채 능력을 쓰대! 서로의
                        정체는 끝까지 모르니 긴장감 MAX!
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span>복잡성</span>
                          <div className="flex items-center space-x-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i === 3 ? "bg-orange-500" : "bg-white/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <span>전략성</span>
                          <div className="flex items-center space-x-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i === 3 ? "bg-orange-500" : "bg-white/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 바이너리 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-teal-500/30">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/바이너리.png"
                        alt="바이너리 포스터"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-teal-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                          난이도 : 중간
                        </span>
                        <span className="text-white text-sm font-bold">
                          20~100명
                        </span>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        이진법을 결합한 단체 심리전 투표게임?! 시드 숫자를
                        랜덤으로 받아, 동맹이 시시각각 바뀐다!
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span>복잡성</span>
                          <div className="flex items-center space-x-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i === 3 ? "bg-teal-500" : "bg-white/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <span>전략성</span>
                          <div className="flex items-center space-x-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i === 3 ? "bg-teal-500" : "bg-white/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 이중 스파이 카드 */}
                  <div className="w-[220px] flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-blue-500/30">
                    {/* 3:4 비율 포스터 이미지 영역 */}
                    <div className="w-full aspect-[3/4] relative">
                      <Image
                        src="/ssobig_assets/이중 스파이.png"
                        alt="이중 스파이 포스터"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* 카드 내용 영역 */}
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-blue-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                          난이도 : 어려움
                        </span>
                        <span className="text-white text-sm font-bold">
                          12~40명
                        </span>
                      </div>
                      <p className="text-xs text-[#F4F4F4] mb-2 line-clamp-3">
                        다양한 능력을 쓸 수 있는 심도 있는 팀전 세력전! 흑막으로
                        상대 조직의 보스가 지목 되다면!
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span>복잡성</span>
                          <div className="flex items-center space-x-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i === 3 ? "bg-blue-500" : "bg-white/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <span>전략성</span>
                          <div className="flex items-center space-x-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i === 5 ? "bg-blue-500" : "bg-white/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 마무리 섹션 */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-3">
                머리는 짜릿하게, 마음은 즐겁게!
                <br />
                게임으로 만나 찐친되는 마법!
              </h2>
              <p className="text-lg mb-6">
                이제 더 이상 화면 밖에서 구경만 하지 마세요!
              </p>
              <p className="text-xl text-[#95BE62] font-bold">
                흥미로운 게임과 새로운 찐친을 만들어 줄<br />
                &lt;게임예능현실판&gt;이 당신을 기다립니다.
              </p>
            </div>

            {/* 연합어때 이미지 */}
            <div className="w-full my-20">
              <Image
                src="/ssobig_assets/차별화된 전문성.png"
                alt="차별화된 전문성"
                width={620}
                height={0}
                sizes="100vw"
                className="w-full rounded-[12px]"
                style={{ width: "100%", height: "auto" }}
                priority
              />
            </div>

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
                      Q1: 게임이 너무 어렵지 않을까요? 처음인데 괜찮을까요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      걱정 마세요! 저희{" "}
                      <span className="font-bold">게임오브</span>의 모든 게임은
                      &apos;쉽고 재미있게!&apos;를 모토로 만들어졌습니다. 게임
                      시작 전 충분한 설명과 연습 시간도 드리고, 호스트가
                      친절하게 도와드릴 거예요. 핵심은 두뇌 풀가동과 즐거운
                      소통!
                    </p>
                  </div>

                  {/* Q2 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q2: 혼자 참여해도 괜찮을까요? 어색할 것 같아요.
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      물론이죠! 대부분 혼자 오시고, 오히려 새로운 사람들과 팀도
                      되고 게임하다 보면 금방 친해지세요! 익명성과 &apos;함께
                      게임을 즐긴다&apos;는 공통의 목표가 어색함을 눈 녹이듯
                      사라지게 할 거예요. 새로운 찐친을 만들 절호의 기회!
                    </p>
                  </div>

                  {/* Q3 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q3: &apos;데블스 플랜&apos;처럼 경쟁이 너무 치열하고
                      배신이 중요할까요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      TV 프로그램의 흥미로운 요소(전략, 심리)는 가져오지만,{" "}
                      <span className="font-bold">게임오브</span>는
                      &apos;소셜링&apos;에 훨씬 더 큰 방점을 찍고 있어요! 물론
                      게임의 긴장감과 반전의 묘미는 살아있지만, 모두가 함께
                      즐기고 좋은 관계를 형성하는 것이 저희의 최우선 목표입니다.
                      과도한 스트레스보다는 유쾌한 심리전과 빛나는 협동을
                      즐겨주세요! (가끔은 &quot;맘놓고빡겜&quot; 모드가 있을
                      수도 있지만, 기본은 &quot;다 함께 즐겁게&quot;랍니다!
                      🔥➡️😊)
                    </p>
                  </div>

                  {/* Q4 */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Q4: 어떤 사람들이 주로 오나요? 분위기는 어떤가요?
                    </h3>
                    <p className="text-sm md:text-base text-[#F4F4F4] font-light">
                      정말 다양하고 매력적인 분들이 많이 찾아주세요! 게임을
                      좋아하고, 새로운 사람들과의 즐거운 만남을 기대하는
                      긍정적이고 유쾌한 분들이 대부분입니다. 분위기는 늘
                      화기애애하고 웃음이 넘쳐요! 걱정 말고 오셔서 함께 즐겨요!
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
            <a
              href="https://dis.qa/rse3db6"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#9E4BED] hover:bg-[#8341c9] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg"
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
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
