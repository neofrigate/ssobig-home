import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export const metadata = {
  title: "REAL GENIUS - Game Orb",
  description: "당신이 주인공이 되는 게임예능 현실판 - 리얼 지니어스",
};

export default function RealGeniusPage() {
  const reviews = [
    {
      text: "드라마틱한 전개의 연속이라 시간 가는 줄 몰랐어요! 이렇게 흥미진진할 줄 몰랐네요!",
      author: "30대 직장인 K님"
    },
    {
      text: "전략 게임이라 어려울까봐 걱정했는데, 생각보다 쉽고 엄청 재미있었어요!",
      author: "20대 대학생 P님"
    },
    {
      text: "처음 본 사람들이랑 이렇게 빨리 친해질 수 있다니 놀라웠어요. 꼭 다시 참가하고 싶어요!",
      author: "30대 직장인 J님"
    }
  ];

  const gameLineup = [
    "더 스파이",
    "클래시 오브 마피아",
    "마블 챔피언십",
    "서바이벌 게임",
    "배틀로얄",
    "인생역전",
    "심장고동 어드벤처"
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

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-purple-500 selection:text-white pt-[72px]">
        {/* 배경 이미지 next/image 적용 - 고정 */}
        <div className="fixed inset-0 -z-10 bg-black">
          <Image
            src="/ssobig_assets/devils_plan_hoodie.png"
            alt="리얼지니어스 배경"
            fill
            style={{ objectFit: "cover", objectPosition: "center", opacity: 0.6 }}
            priority
            sizes="100vw"
          />
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="w-full max-w-[620px] mx-auto z-10 pb-24 px-4">
          {/* 로고 이미지 */}
          <div className="w-full flex justify-center mt-6 mb-6">
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
            <div className="text-[#95BE62] text-xl mb-2">😈 당신이 주인공이 되는 게임예능 현실판! 😈</div>
            <h1 className="text-4xl font-bold text-white mb-2">REAL GENIUS</h1>
            <p className="text-xl text-purple-300">매주 일요일, 스릴 넘치는 심리전 속에서<br />새로운 찐친들을 만나보세요! 😉</p>
          </div>
          
          {/* 메인 이미지 */}
          <div className="w-full h-auto mb-8">
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
          
          {/* 소개 섹션 */}
          <div className="mb-8 space-y-4">
            <p className="text-lg">
              <span className="text-[#95BE62] font-semibold">"데블스 플랜", "더 지니어스", "피의 게임"...</span><br />
              게임 예능 속 숨 막히는 전략과 반전에 열광하셨나요?
            </p>
            
            <p className="text-lg">
              혹시 <span className="text-[#95BE62] font-semibold">"나라면 저기서 저렇게 했을 텐데!"</span> 혹은 <span className="text-[#95BE62] font-semibold">"저 게임, 내가 하면 더 잘할 수 있을 것 같은데?"</span> 라고 외치신 적 있으신가요?
            </p>
            
            <p className="text-lg">
              아니면, <span className="text-[#95BE62] font-semibold">"주말에 뭐하지? 새로운 사람들과 재밌게 놀고 싶은데!"</span> 하고 생각하셨나요?
            </p>
          </div>
          
          {/* 걱정 해소 섹션 */}
          <div className="mb-10 bg-black/50 backdrop-blur-[30px] p-6 rounded-xl">
            <div className="mb-4 text-center">
              <p className="text-lg text-[#95BE62] mb-1">🤯 "게임예능이라니, 너무 어렵진 않을까?"</p>
              <p className="text-lg text-[#95BE62] mb-2">🥳 "처음인데... 혼자인데... 잘 어울릴 수 있을까?"</p>
              <p className="text-xl font-bold">걱정 마세요! 🙌</p>
            </div>
          </div>
          
          {/* 후기 섹션 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-center mb-6">참가자분들이 남겨주신<br />생생한 찐 후기 모음🤩</h2>
            
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white/10 p-4 rounded-xl">
                  <p className="text-lg mb-2">"{review.text}"</p>
                  <p className="text-sm text-purple-300 text-right">- {review.author}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-6 text-xl font-bold bg-black/50 backdrop-blur-[30px] p-6 rounded-xl">
              😎 "술 없이도 이렇게 재밌게 친해질 수 있다고?"<br />
              네, 신기할걸요? 🙌<br /><br />
              "게임으로 즐겁게 친해진다!"가 우리의 모토! 🙌
            </div>
          </div>
          
          {/* 포인트 1 섹션 */}
          <div className="mb-10 bg-black/50 backdrop-blur-[30px] p-6 rounded-xl border-l-4 border-[#95BE62]">
            <div className="bg-[#95BE62]/10 rounded-lg p-3 mb-4 inline-block">
              <h3 className="text-xl font-extrabold text-[#95BE62]">[Point 1]</h3>
            </div>
            <h4 className="text-xl font-bold text-white mb-4">차별화된 전문성</h4>
            <p className="mb-4">
              저희는, 방송보다 더 재밌는 경험을 만들어드리는 걸 핵심 가치로 삼고 있어요!
            </p>
            <p className="mb-4">
              방송과 똑같이 따라하기? <span className="font-bold">X</span>
              <br /><br />
              게임오브만의 독창적인 아이디어와 기술로 재해석하고, 시청자보다 '참가자' 위주로 디자인한 자체 제작 게임들로 채워집니다.
            </p>
            
            {/* 이미지 추가 - img 태그로 변경 */}
            <div className="w-full my-6">
              <img 
                src="/ssobig_assets/차별화된 전문성.png" 
                alt="차별화된 전문성" 
                className="w-full rounded-lg"
              />
            </div>
            
            <p className="text-lg font-bold text-center text-[#95BE62]">
              뇌지컬 풀가동! 심장은 쫄깃, 웃음은 빵빵! 🤣
            </p>
          </div>
          
          {/* 포인트 2 섹션 */}
          <div className="mb-10 bg-black/50 backdrop-blur-[30px] p-6 rounded-xl border-l-4 border-[#95BE62]">
            <div className="bg-[#95BE62]/10 rounded-lg p-3 mb-4 inline-block">
              <h3 className="text-xl font-extrabold text-[#95BE62]">[Point 2]</h3>
            </div>
            <h4 className="text-xl font-bold text-white mb-4">게임을 가장 잘 즐길 수 있는 진행방식</h4>
            
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
                  <span className="text-xl font-extrabold text-[#95BE62]">메인 매치</span>
                  <span className="text-lg font-bold text-white bg-[#95BE62]/30 px-3 py-1 rounded-full">[2시간]</span>
                </p>
                
                <div className="pl-3 border-l-2 border-[#95BE62]/50 ml-2 space-y-3 mt-4">
                  <p className="flex justify-between">
                    <span className="font-medium">전반전</span>
                    <span className="text-purple-300">[50분]</span>
                  </p>
                  <p className="text-sm text-white/80 ml-3">승리 플레이어에게 후반전 베네핏 제공</p>
                  
                  <p className="flex justify-between">
                    <span className="font-medium">비밀 규칙 공개 + 전략회의</span>
                    <span className="text-purple-300">[20분]</span>
                  </p>
                  <p className="text-sm text-white/80 ml-3">새로운 전략과 새로운 연합 등장</p>
                  
                  <p className="flex justify-between">
                    <span className="font-medium">후반전</span>
                    <span className="text-purple-300">[50분]</span>
                  </p>
                  <p className="text-sm text-white/80 ml-3">후반전에서 '생존'해야 최종 승리</p>
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
          <div className="mb-10 bg-black/50 backdrop-blur-[30px] p-6 rounded-xl border-l-4 border-[#95BE62]">
            <div className="bg-[#95BE62]/10 rounded-lg p-3 mb-4 inline-block">
              <h3 className="text-xl font-extrabold text-[#95BE62]">[Point 3]</h3>
            </div>
            <h4 className="text-xl font-bold text-white mb-4">방대한 라인업</h4>
            <p className="mb-5">
              전문가들이 세심하게 설계한,<br />
              누구나 쉽고 재밌게 즐길 수 있는<br />
              자체 제작 게임들로 가득하죠.
            </p>
            
            <div className="space-y-6">
              {/* 불면증 마피아 */}
              <div className="bg-white/5 rounded-xl overflow-hidden border border-orange-500/30">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 aspect-square md:aspect-auto bg-gradient-to-br from-orange-900/80 to-purple-900/80 p-4 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-center">불면증 마피아</h3>
                  </div>
                  <div className="w-full md:w-2/3 p-4">
                    <p className="text-lg mb-3">
                      밤이 돼도 못 자...? 모두 눈을 뜬 채 능력을 쓰대! 분명 죽었는데 죽지 않는 마피아라니... 서로의 정체는 끝까지 모르니 긴장감 MAX!
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-orange-500/80 text-white px-3 py-1 rounded-full text-sm">난이도 : 쉬움</span>
                      <span className="text-white font-bold">12~30 명</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">복잡성</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} 
                                className={`w-3 h-3 rounded-full ${i === 3 ? "bg-orange-500" : "bg-white/20"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">전략성</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} 
                                className={`w-3 h-3 rounded-full ${i === 3 ? "bg-orange-500" : "bg-white/20"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 바이너리 */}
              <div className="bg-white/5 rounded-xl overflow-hidden border border-teal-500/30">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 aspect-square md:aspect-auto bg-gradient-to-br from-teal-900/80 to-slate-900/80 p-4 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-center">(출시 예정작)<br />바이너리</h3>
                  </div>
                  <div className="w-full md:w-2/3 p-4">
                    <p className="text-lg mb-3">
                      이진법을 결합한 단체 심리전 투표게임?! 시드 숫자를 랜덤으로 받아, 동맹이 시시각각 바뀐다! 모두의 심리를 예측하라! 🔮
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-teal-500/80 text-white px-3 py-1 rounded-full text-sm">난이도 : 중간</span>
                      <span className="text-white font-bold">20~100 명</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">복잡성</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} 
                                className={`w-3 h-3 rounded-full ${i === 3 ? "bg-teal-500" : "bg-white/20"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">전략성</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} 
                                className={`w-3 h-3 rounded-full ${i === 3 ? "bg-teal-500" : "bg-white/20"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 이중 스파이 */}
              <div className="bg-white/5 rounded-xl overflow-hidden border border-blue-500/30">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 aspect-square md:aspect-auto bg-gradient-to-br from-blue-900/80 to-red-900/80 p-4 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-center">(출시 예정작)<br />이중 스파이</h3>
                  </div>
                  <div className="w-full md:w-2/3 p-4">
                    <p className="text-lg mb-3">
                      다양한 능력을 쓸 수 있는 심도 있는 팀전 세력전! 흑막으로 상대 조직의 보스가 지목 되다면 공들이 카치노는 우리 조직 차지✌️
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm">난이도 : 어려움</span>
                      <span className="text-white font-bold">12~40 명</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">복잡성</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} 
                                className={`w-3 h-3 rounded-full ${i === 3 ? "bg-blue-500" : "bg-white/20"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">전략성</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} 
                                className={`w-3 h-3 rounded-full ${i === 5 ? "bg-blue-500" : "bg-white/20"}`}
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
          </div>
          
          {/* 마무리 섹션 */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">머리는 짜릿하게, 마음은 즐겁게!<br />게임으로 만나 찐친되는 마법!</h2>
            <p className="text-lg mb-6">
              이제 더 이상 화면 밖에서 구경만 하지 마세요!
            </p>
            <p className="text-xl text-[#95BE62] font-bold">
              흥미로운 게임과 새로운 찐친을 만들어 줄<br />
              &lt;게임예능현실판&gt;이 당신을 기다립니다.
            </p>
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