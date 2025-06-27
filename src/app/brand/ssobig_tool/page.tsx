import Image from "next/image";

export const metadata = {
  title: "Design Your MEET - SSOBIG",
  description: "미팅의 모든 순간을 디자인하는 실시간 인터랙션 빌더",
};

export default function SsobigToolPage() {
  return (
    <>
      <div className="min-h-screen text-black font-sans relative flex flex-col items-center justify-start px-0">
        {/* 헤더 섹션 - 배경 이미지 */}
        <div className="w-full bg-gray-800 text-white relative">
          <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
          <div className="relative z-10 max-w-[1100px] mx-auto px-4 py-24 md:py-36 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Design Your MEET
            </h1>
            <p className="text-lg md:text-xl mb-12">
              미팅의 모든 순간을 디자인하는 실시간 인터랙션 빌더
            </p>
            <a
              href="https://about.ssobig.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black h-[56px] px-6 flex items-center justify-center rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              쏘빅에 입장하기
            </a>
          </div>
        </div>

        {/* 섹션 1: 실시간 인터랙션 */}
        <div className="w-full bg-white py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                모든 참석자의 마음을 실시간으로 읽고,
                <br />그 순간을 완벽하게 디자인하세요.
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <p>진행자가 제시하면 참여자 함께하는 실시간 참가</p>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <p>청중/참여자 피드백 실시간으로 수집하기</p>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <p>게임, 퀴즈, OX 투표로 참가자들에게 인터랙션 높이기</p>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <p>다양한 템플릿으로 상황에 맞게짐히 활용하기</p>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="relative">
                <Image
                  src="/ssobig_assets/이미지_실시간 제어.png"
                  alt="쏘빅 대시보드"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 2: 앱 없이도 웹으로 */}
        <div className="w-full bg-gray-100 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto px-4 flex flex-col">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                앱설치 없이 웹으로도 접속이 가능해
                <br />
                어느 모바일나 쉽게 적용이 가능합니다
              </h2>
              <p className="text-gray-600">
                간편하게는 인터넷 웹 링크로 바로 가능하고,
                <br />
                참가자들은 그 날만 접속하면서 스마트 폰으로 참여 보조 수 있는
                웹페이지 방식을 채택 하였습니다.
              </p>
            </div>
            <div className="flex justify-center items-center gap-10 mt-12 w-full">
              {/* 모바일 스크린샷 이미지들 */}
              <div className="w-[530px]">
                <Image
                  src="/ssobig_assets/어디서나 접속 1.png"
                  alt="모바일 화면 1"
                  width={530}
                  height={1060}
                  style={{ width: "100%", height: "auto" }}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="w-[530px]">
                <Image
                  src="/ssobig_assets/어디서나 접속 2.png"
                  alt="모바일 화면 2"
                  width={530}
                  height={1060}
                  style={{ width: "100%", height: "auto" }}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 3: 다양한 템플릿 */}
        <div className="w-full bg-white py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                한 번의 터치로 다중 컨텐츠를 자유롭게 변경하여
                <br />
                진행자의 편의성을 높입니다
              </h2>
              <p className="text-gray-600 mb-8">
                간결한 화면에 다양한 투표나 컨텐츠 기능까지 모두 담았습니다.
                <br />
                참가자들에게는 재미있고 참여감 있는 경험으로 온·오프라인 모임에
                모두 어울리는 도구로 완성했습니다.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-orange-300 rounded-lg p-4 bg-orange-50">
                  <div className="mb-2 font-bold text-orange-600">
                    다양한 처치
                  </div>
                  <div className="text-xs text-gray-600">
                    [투표], [퀴즈], [OX문항] 다양화
                  </div>
                </div>
                <div className="border border-orange-300 rounded-lg p-4 bg-orange-50">
                  <div className="mb-2 font-bold text-orange-600">
                    초점 아이템
                  </div>
                  <div className="text-xs text-gray-600">
                    [투표], [퀴즈], [주제] 강조
                  </div>
                </div>
                <div className="border border-orange-300 rounded-lg p-4 bg-orange-50">
                  <div className="mb-2 font-bold text-orange-600">
                    다양한 화면식
                  </div>
                  <div className="text-xs text-gray-600">
                    [투표], [결과], [랭킹] 다양화
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative aspect-video">
                <Image
                  src="/ssobig_assets/차별화된 전문성.png"
                  alt="다양한 템플릿"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 4: 다양한 기능 모듈 */}
        <div className="w-full bg-gray-100 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                다양한 기능 모듈을 조합하여
                <br />
                당신만의 오프라인 모임을 업그레이드하세요
              </h2>
              <p className="text-gray-600">
                실제로는 풍-뷴, 느리게하여 이동한 방으로 실시간 투표 모으기와
                함께 입니다.
                <br />각 고객분 접근 환경에 맞출수 있게끔 선택하실 가능성과
                자유롭게 도구로 제공해 드리겠습니다.
              </p>
            </div>

            {/* 기능 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6H4V18H20V6Z" />
                    <path d="M12 14V10" />
                    <path d="M12 14H16" />
                  </svg>
                </div>
                <div className="text-sm font-medium">투표</div>
                <div className="text-xs text-gray-500">빠른 진행</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                  </svg>
                </div>
                <div className="text-sm font-medium">실명/익명</div>
                <div className="text-xs text-gray-500">빠른 진행/투표</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">투표/결과</div>
                <div className="text-xs text-gray-500">챠트 디스플레이</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 18.5L9 13L4 11L9 9L12 3.5L15 9L20 11L15 13L12 18.5Z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">질문지</div>
                <div className="text-xs text-gray-500">
                  다양한 폼 타입별 제작
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">개념/퀴즈</div>
                <div className="text-xs text-gray-500">음악적 점수</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <div className="text-sm font-medium">엠티스/텍스트</div>
                <div className="text-xs text-gray-500">빠른 진행, 텍스트</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">챗팅</div>
                <div className="text-xs text-gray-500">지정 채널로 연결</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">채팅</div>
                <div className="text-xs text-gray-500">삼자 소통</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">영상</div>
                <div className="text-xs text-gray-500">컨텐츠 실험 예정</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <div className="text-sm font-medium">인증샷</div>
                <div className="text-xs text-gray-500">컨텐츠 공유</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">일정관리</div>
                <div className="text-xs text-gray-500">체크리스트 제공</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center text-gray-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">QR</div>
                <div className="text-xs text-gray-500">도메인별 제작</div>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="w-full bg-black text-white py-16">
          <div className="max-w-[1100px] mx-auto px-4 flex flex-col items-center">
            <div className="mb-8">
              <Image
                src="/ssobig_assets/ssobig-logo.png"
                alt="SSOBIG 로고"
                width={120}
                height={40}
              />
            </div>
            <p className="text-center mb-8">오늘 바로 쏘빅을 사용해 보세요</p>
            <a
              href="https://about.ssobig.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black h-[56px] px-6 flex items-center justify-center rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              쏘빅에 입장하기
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
