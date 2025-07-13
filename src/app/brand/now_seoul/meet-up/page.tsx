"use client";

import Image from "next/image";
import Script from "next/script";
import Head from "next/head";
import LinkWithUtm from "../../../../components/LinkWithUtm";
import { FAQSection } from "../../../../components/FAQ";

// FAQ 질문 데이터
const faqQuestions = [
  {
    question: "네트워킹이 너무 어색하지 않을까요? 처음인데 괜찮을까요?",
    answer:
      "걱정 마세요! 저희 **나우서울**의 모든 밋업은 '자연스러운 연결'을 모토로 설계되었습니다. 체계적인 세션 구성과 전문 퍼실리테이터의 가이드로 대화가 자연스럽게 이어집니다. 관심사와 직무 기반 테이블 매칭으로 공통 주제부터 대화를 시작할 수 있어 어색함이 빠르게 사라진답니다.",
  },
  {
    question: "혼자 참여해도 괜찮을까요? 어색할 것 같아요.",
    answer:
      "물론입니다! 대부분의 참가자가 혼자 오십니다. 저희 밋업은 소규모 그룹(4~6명)으로 진행되어 모두가 균등하게 발언 기회를 갖고, 서로의 이야기에 귀 기울일 수 있는 환경을 제공합니다. 오히려 혼자 오시면 더 다양한 분들과 새로운 관계를 맺을 수 있어 네트워킹 효과가 극대화됩니다!",
  },
  {
    question: "일반적인 비즈니스 미팅과는 어떤 차별점이 있나요?",
    answer:
      "일반 비즈니스 미팅은 종종 형식적이고 표면적인 관계에 그치지만, **나우서울** 밋업은 진정성 있는 관계 형성에 중점을 둡니다. 30분 룰로 깊이 있는 대화와 다양한 관점을 경험할 수 있으며, 철저히 참가자 중심의 설계로 모든 분이 가치 있는 연결을 만들어갑니다. 실제 프로젝트 협업, 멘토링, 정보 교류까지 이어지는 실질적인 네트워킹이 이루어집니다.",
  },
  {
    question: "어떤 사람들이 주로 참여하나요? 분위기는 어떤가요?",
    answer:
      "디자인, 개발, 마케팅, 기획, 비즈니스 등 다양한 분야의 전문가들이 참여합니다. 주니어부터 시니어까지 다양한 경력의 참가자들이 모이지만, 공통점은 성장과 협업에 대한 열린 태도를 가진 분들이라는 점입니다.<br/><br/>분위기는 진지하면서도 편안하고, 상호 존중하는 환경에서 유익한 대화가 오가는 것이 특징입니다. 평균적으로 25-40세 전문가들이 많이 참여하시며, 매 회 새로운 만남을 경험하실 수 있습니다.",
  },
  {
    question: "[나우서울]은 어떻게 신청하나요?",
    answer:
      "페이지 하단의 <지금 기회 잡기> 버튼을 클릭하고<br/>양식에 맞춰 답변을 제출해주시면 됩니다!<br/>신청 후 발송되는 안내 문자에 따라 결제까지 마쳐주셔야 최종 신청 완료이니,<br/>꼭 안내 문자 확인 후 결제 부탁드립니다!",
  },
  {
    question: "지각 시 참여가 어려나요?",
    answer:
      "사전에 고지 드렸듯이 모임 15분 이후에는 참여가 매우 어렵습니다.<br/><br/>콘텐츠가 촘촘하게 구성되어 중간부터 참여하기가 어려운 구조입니다.<br/>다른 분들이 이미 현장에서 기다리고 계셔 모임이 지연되는걸 막고자<br/><strong style='background-color: #FFAC3A; color: black; padding: 2px 4px; border-radius: 4px;'>최대 15분까지</strong> 진행 대기 후 모임을 시작하고 있습니다.<br/><strong style='background-color: #FFAC3A; color: black; padding: 2px 4px; border-radius: 4px;'>지각의 경우 환불은 불가능</strong>하니 꼭 시간에 맞춰 현장에 도착 부탁드립니다 : )",
  },
  {
    question: "음식과 술을 제공하나요?",
    answer:
      "간단한 다과와 음료만 제공됩니다.<br/>술과 음식보다 훨씬 가치 있는 사람들과, 그들에게 집중할 수 있는 콘텐츠를 준비했습니다.<br/><br/>몰입을 위해 모임 중엔 음식이 따로 제공되지 않고<br/>모임이 끝난 뒤, 희망자에 한해 2차 장소로 이동해<br/>식사 및 주류를 즐기는 시간을 가져요 :)<br/><br/>깊이 알아가는 이야기 꽃을 피울 텐데, 인근 찐 맛집으로 이야기 더 나누러 가시죠! 😊",
  },
  {
    question: "정확한 종료시간에 끝나나요?",
    answer:
      "모임은 2시간 30분 정도 진행됩니다!<br/><br/>다만, 당일 상황에 따라 약간의 변동이 있을 수 있어요.<br/>모임 특성상 시간이 지날수록 점점 더 궁금한 사람이 많아지실 거예요!<br/>끝나고 2차에 많이 가시니까 스케줄에 참고해주시면 좋아요 :)",
  },
  {
    question: "모임 공지와 장소는 어떻게 확인하나요?",
    answer:
      "모임은 전용 웹앱을 통해 진행됩니다.<br/>모임 전용 웹앱 링크에 접속하시면 장소 및 공지를 확인하실 수 있으니<br/>꼭 접속 후 확인 부탁드립니다!<br/>모임 링크는 모임 하루 전날 카카오톡으로 일괄 전송드리고 있습니다 :)",
  },
];

export default function RealGeniusPage() {
  return (
    <>
      <Head>
        <title>N.O.W.seoul Meet UP</title>
        <meta
          name="description"
          content="다양한 직무의 실전형 전문가들이, 술 없이도 진짜로 성장하고 연결되는, 밀도 높은 평일 저녁 네트워킹 커뮤니티"
        />
      </Head>
      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel-now-seoul-meetup"
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
            fbq('init', '1409643070210008');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1409643070210008&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}

      <div className="min-h-screen text-white font-sans relative flex flex-col items-center justify-start px-0 selection:bg-purple-500 selection:text-white">
        {/* 배경 이미지 next/image 적용 - 고정 */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssobig_assets/나우서울그라데이션배경.png"
            alt="나우서울 그라데이션 배경"
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
          <div className="w-full h-auto mb-0">
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

          {/* 나우서울 9월 재개 안내 */}
          <div className="w-full mb-12 px-0">
            <div className="bg-black rounded-none p-0 shadow-lg">
              <div className="bg-gradient-to-br from-[#FFAC3A]/15 via-[#101F50]/10 to-black/60 backdrop-blur-[30px] p-8 rounded-xl border border-[#FFAC3A]/30 mx-3 my-8">
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                  나우서울 9월에 다시 만나요
                </h2>

                <div className="text-center space-y-4">
                  <p className="text-lg text-white/90">
                    더욱 알찬 콘텐츠와 시스템으로 준비하여
                  </p>
                  <p className="text-xl font-bold text-[#FFAC3A]">
                    9월에 다시 돌아오겠습니다!
                  </p>

                  <div className="bg-black/30 p-4 rounded-xl mt-6">
                    <p className="text-white/80 text-sm">
                      잠시 재정비 시간을 가지며,
                      <br />더 나은 네트워킹 경험을 위해 준비하고 있습니다.
                    </p>
                  </div>

                  <div className="text-center mt-6">
                    <span className="text-[#FFAC3A] text-sm font-medium bg-[#FFAC3A]/10 px-4 py-2 rounded-full">
                      9월 재개 소식을 가장 먼저 받고 싶다면? 👇
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 소개 섹션 */}
          <div className="px-5">
            {/* 메인 카피 */}
            <div className="my-[60px] text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                Night Off Work,
                <br />
                <span className="text-[#FFAC3A]">Turn ON Your____</span>
              </h1>
              <p className="text-xl md:text-2xl font-bold text-[#FFAC3A] mb-8">
                인간관계 디자인을 위한, 비즈니스 네트워킹
              </p>

              {/* 후킹 카피 */}
              <div className="bg-gradient-to-br from-[#FFAC3A]/10 via-black/40 to-black/60 backdrop-blur-md p-6 rounded-2xl shadow-inner border border-[#FFAC3A]/20 mb-8">
                <p className="text-lg md:text-xl font-bold text-white mb-4">
                  &quot;그냥 아는 사람 100명 말고,
                  <br />
                  도움 주고 받을 3명 필요한 사람?&quot;
                </p>
                <p className="text-base text-white/90">
                  대놓고 인맥 쌓으러 올 사람 있어?
                  <br />
                  기버(giver)만 있는 모임이 있다구요!
                </p>
              </div>
            </div>

            {/* 이런 경험 있으시죠? 섹션 */}
            <div className="my-[80px]">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
                😢 이런 경험 있으시죠?
              </h2>

              <div className="space-y-6">
                {/* 경험 1 */}
                <div className="bg-gradient-to-br from-red-500/10 via-black/40 to-black/60 backdrop-blur-md p-6 rounded-2xl border border-red-500/20">
                  <h3 className="text-lg font-bold text-red-400 mb-3">
                    비즈니스 네트워킹 하러 갔는데, 병풍처럼 앉아만 있다 온
                    경험이 있나요?
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    한 사람이 일방적으로 발표하고, 목소리 큰 몇 명이 분위기를
                    주도해서 기만 빨리다가 오셨나요?
                    <br />
                    케이스스터디, 사업 자랑, ... 실제 협업으로 연결되지 못하고
                    또 앉아서 &apos;공부&apos;만 하다 오셨죠?
                  </p>
                </div>

                {/* 경험 2 */}
                <div className="bg-gradient-to-br from-red-500/10 via-black/40 to-black/60 backdrop-blur-md p-6 rounded-2xl border border-red-500/20">
                  <h3 className="text-lg font-bold text-red-400 mb-3">
                    혹시 모를 기회가 생길 것 같았는데...명함만 교환하다
                    오셨나요?
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    20명을 만나긴 했는데... 실질적으로 &apos;비즈니스&apos;로
                    연결되는 사람은 0명이죠?
                    <br />
                    아이러니하게 모임을 자주 다닐 수록 마음만 공허해집니다.
                  </p>
                </div>

                {/* 경험 3 */}
                <div className="bg-gradient-to-br from-red-500/10 via-black/40 to-black/60 backdrop-blur-md p-6 rounded-2xl border border-red-500/20">
                  <h3 className="text-lg font-bold text-red-400 mb-3">
                    우리 이제 솔직해져요. 모임 갔더니 수준 맞는 사람... 얼마나
                    있었나요?
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    적어도 &apos;나만큼&apos; 퍼포먼스 내는 사람이 있을 줄
                    알았어요.
                    <br />
                    하지만 일에 진심인 나와 달리, 술 마시러 온 사람이
                    대부분이었어요.
                  </p>
                </div>
              </div>

              <div className="text-center mt-8 bg-gradient-to-r from-[#FFAC3A]/20 to-[#FFAC3A]/10 px-6 py-4 rounded-full border border-[#FFAC3A]/30">
                <p className="text-xl font-bold text-[#FFAC3A]">
                  더이상 걱정 마세요, 나우서울은 다릅니다 ✨
                </p>
              </div>
            </div>

            {/* 🔑 핵심 포인트 섹션 */}
            <div className="my-[80px]">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">
                🔑 핵심 포인트
              </h2>

              {/* Point 1: 전문가들의 협업 네트워킹 */}
              <div className="mb-12 bg-gradient-to-br from-[#FFAC3A]/15 via-[#101F50]/10 to-black/60 backdrop-blur-[30px] p-6 rounded-xl border border-[#FFAC3A]/30">
                <div className="mb-4 inline-block">
                  <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                    ✅ Point 1.
                  </h3>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">
                  전문가들의 협업 네트워킹
                </h4>
                <p className="text-white/90 leading-relaxed mb-4">
                  <span className="font-bold text-[#FFAC3A]">
                    최소 &apos;3년차 이상&apos; 전문가가 만나야 서로 밀어주고
                    끌어주는 관계가 가능합니다.
                  </span>
                </p>
                <p className="text-white/90 leading-relaxed mb-4">
                  기획, 개발, 디자인, 마케팅 전문가가 함께 만나면 아이디어가
                  현실이 됩니다.
                </p>
                <p className="text-white/90 leading-relaxed">
                  직장인, 창업가, 전문가, 창작자, 창업 예정자 등{" "}
                  <span className="font-bold text-[#FFAC3A]">
                    &apos;선별된&apos; 전문가로 구성된 비즈니스 네트워킹 환경
                  </span>
                  을 제공합니다.
                </p>
              </div>

              {/* Point 2: 기버(Giver) 네트워킹 */}
              <div className="mb-12 bg-gradient-to-br from-[#FFAC3A]/15 via-[#101F50]/10 to-black/60 backdrop-blur-[30px] p-6 rounded-xl border border-[#FFAC3A]/30">
                <div className="mb-4 inline-block">
                  <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                    ✅ Point 2.
                  </h3>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">
                  기버(Giver) 네트워킹
                </h4>
                <p className="text-white/90 leading-relaxed mb-4">
                  <span className="font-bold text-[#FFAC3A]">
                    세상에는 세 종류의 사람이 있습니다:
                  </span>
                </p>
                <div className="pl-4 space-y-2 mb-4">
                  <p className="text-white/90">
                    •{" "}
                    <span className="font-bold text-[#FFAC3A]">
                      기버(Giver):
                    </span>{" "}
                    손익을 따지지 않고 베푸는 사람
                  </p>
                  <p className="text-white/90">
                    •{" "}
                    <span className="font-bold text-red-400">
                      테이커(Taker):
                    </span>{" "}
                    상대로부터 이득을 취하기만 하려는 사람
                  </p>
                  <p className="text-white/90">
                    •{" "}
                    <span className="font-bold text-yellow-400">
                      매처(Matcher):
                    </span>{" "}
                    딱 준 만큼 받아야만 하는 사람
                  </p>
                </div>
                <p className="text-white/90 leading-relaxed mb-4">
                  <span className="font-bold text-[#FFAC3A]">
                    여러분은 기버(Giver)인가요? 테이커(Taker)인가요?
                  </span>
                </p>
                <p className="text-white/90 leading-relaxed mb-4">
                  기버는 시간, 노력, 지식, 기술, 아이디어 그리고 인간관계를
                  총동원하여 누군가를 돕고자 애쓰는 사람들입니다.
                </p>
                <div className="text-center bg-[#FFAC3A]/10 p-4 rounded-xl border border-[#FFAC3A]/30">
                  <p className="text-lg font-bold text-[#FFAC3A] mb-2">
                    기버만 모인다면 어떤 시너지와 협업이 생겨날까요?
                  </p>
                  <p className="text-sm text-white/90">
                    타인에게 줄 수 있는 무언가가 있나요? 그게 무엇이든
                    좋습니다.(개발, 카피라이팅, 기획 아이디어 등)
                  </p>
                </div>
              </div>

              {/* Point 3: 밀도 높은 네트워킹 설계 */}
              <div className="mb-12 bg-gradient-to-br from-[#FFAC3A]/15 via-[#101F50]/10 to-black/60 backdrop-blur-[30px] p-6 rounded-xl border border-[#FFAC3A]/30">
                <div className="mb-4 inline-block">
                  <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                    ✅ Point 3.
                  </h3>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">
                  밀도 높은 네트워킹 설계
                </h4>
                <p className="text-white/90 leading-relaxed mb-4">
                  <span className="font-bold text-[#FFAC3A]">
                    네트워킹에 진심인 우리는 자체적으로 앱을 만들어버렸습니다.
                  </span>
                </p>
                <p className="text-white/90 leading-relaxed mb-4">
                  기존 비즈니스 모임의 얕은 대화, 제한된 네트워크, 술자리 중심
                  문화에서 벗어나{" "}
                  <span className="font-bold text-[#FFAC3A]">
                    진정한 네트워킹의 가치
                  </span>
                  에 집중할 수 있습니다.
                </p>
                <p className="text-white/90 leading-relaxed mb-4">
                  직장과 업계의 경계를 넘는 혁신적인 기버들의 만남,{" "}
                  <span className="font-bold text-[#FFAC3A]">
                    오직 나우서울만 경험할 수 있습니다.
                  </span>
                </p>
                <p className="text-white/90 leading-relaxed">
                  프로필 카드를 작성하고, 다양한 전문가와 효과적으로 만날 수
                  있도록 자리를 배치합니다. 내가 필요한 걸 줄 수 있는 기버를
                  쉽게 찾을 수 있어 의미 있는 연결이 가능합니다.
                </p>

                {/* 이미지 추가 */}
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

                <div className="text-center bg-gradient-to-r from-[#FFAC3A]/20 to-[#FFAC3A]/10 px-6 py-4 rounded-full border border-[#FFAC3A]/30">
                  <p className="text-lg font-bold text-[#FFAC3A]">
                    &quot;내가 성장하고, 남도 성장시키는&quot; 밀도 높은
                    커뮤니티 🤝
                  </p>
                </div>
              </div>

              {/* Point 4: 짧은 시간동안 최대한 많은 사람과의 대화 */}
              <div className="mb-12 bg-gradient-to-br from-[#FFAC3A]/15 via-[#101F50]/10 to-black/60 backdrop-blur-[30px] p-6 rounded-xl border border-[#FFAC3A]/30">
                <div className="mb-4 inline-block">
                  <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                    ✅ Point 4.
                  </h3>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">
                  짧은 시간동안 최대한 많은 사람과의 대화
                </h4>
                <p className="text-white/90 leading-relaxed mb-4">
                  <span className="font-bold text-[#FFAC3A]">
                    네트워킹 본질은 &apos;짧은 시간 동안 많은 사람을 알아가는
                    것&apos; 입니다.
                  </span>{" "}
                  옆사람과 의미없는 대화만 하다가 온 경험, 누구나 있을거예요.
                </p>
                <p className="text-white/90 leading-relaxed mb-6">
                  최대 20명이 함께 하는 네트워킹이지만{" "}
                  <span className="font-bold text-[#FFAC3A]">
                    4~6명 소수로 그룹핑
                  </span>
                  되어 밀도 있는 대화가 가능하며, 3번의 테이블 세션에서 30분마다
                  자리를 바꿔 최대한 많은 사람들과 만날 수 있습니다.
                </p>

                {/* 진행 순서 */}
                <h5 className="text-lg font-bold text-[#FFAC3A] mb-4">
                  📋 진행 순서
                </h5>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white">
                        1. 환영 및 오리엔테이션
                      </span>
                      <span className="text-[#FFAC3A] font-bold">[15분]</span>
                    </div>
                    <p className="text-sm text-white/80">
                      참가자 소개 및 나우서울 네트워킹 진행 방식 안내
                    </p>
                  </div>

                  <div className="bg-[#FFAC3A]/20 p-4 rounded-xl border border-[#FFAC3A]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-white">
                        2. 테이블 세션
                      </span>
                      <span className="text-[#FFAC3A] font-bold">
                        [1시간 30분]
                      </span>
                    </div>
                    <div className="pl-4 space-y-2">
                      <p className="text-sm text-white/90">
                        •{" "}
                        <span className="font-medium">
                          Table Session 1 [30분]
                        </span>{" "}
                        — 서로 다른 직무의 참가자들과 첫 대화
                      </p>
                      <p className="text-sm text-white/90">
                        •{" "}
                        <span className="font-medium">
                          Table Session 2 [30분]
                        </span>{" "}
                        — 새로운 그룹과 심화 주제 토론
                      </p>
                      <p className="text-sm text-white/90">
                        •{" "}
                        <span className="font-medium">
                          Table Session 3 [30분]
                        </span>{" "}
                        — 실질적 고민과 협업 가능성 모색
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FFAC3A]/20 p-4 rounded-xl border border-[#FFAC3A]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white">
                        3. 스탠딩 세션
                      </span>
                      <span className="text-[#FFAC3A] font-bold">[30분]</span>
                    </div>
                    <p className="text-sm text-white/90 mb-2">
                      자유롭게 더 대화하고 싶은 사람들과 연결
                    </p>
                    <p className="text-sm text-white/80">
                      프로필 카드를 통해 참가자들의 정보를 확인하고,{" "}
                      <span className="font-bold text-[#FFAC3A]">
                        상호 관심이 있는 경우에만
                      </span>{" "}
                      연락처가 공유되는 안전한 시스템으로 운영됩니다.
                    </p>
                  </div>

                  <div className="bg-black/30 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white">
                        4. 마무리 & 자유 네트워킹 타임
                      </span>
                      <span className="text-[#FFAC3A] font-bold">[15분~]</span>
                    </div>
                    <p className="text-sm text-white/80">
                      관심 있는 참가자들과의 추가 대화 및 연결 기회
                    </p>
                  </div>
                </div>
              </div>

              {/* Point 5: 지속 가능한 커뮤니티 */}
              <div className="mb-12 bg-gradient-to-br from-[#FFAC3A]/15 via-[#101F50]/10 to-black/60 backdrop-blur-[30px] p-6 rounded-xl border border-[#FFAC3A]/30">
                <div className="mb-4 inline-block">
                  <h3 className="text-xl font-extrabold text-[#FFAC3A]">
                    ✅ Point 5.
                  </h3>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">
                  지속 가능한 커뮤니티
                </h4>
                <p className="text-white/90 leading-relaxed mb-4">
                  <span className="font-bold text-[#FFAC3A]">
                    나우서울 Meet UP은 일회성 모임이 아닌, 지속적인 관계 형성을
                    목표로 합니다.
                  </span>{" "}
                  첫 만남 이후에도 전문가 기버 간의 연결을 유지할 수 있는 다양한
                  채널과 후속 이벤트를 제공합니다.
                </p>

                <h5 className="text-lg font-bold text-[#FFAC3A] mb-3">
                  🤝 네트워킹 후속 지원
                </h5>
                <div className="space-y-2 mb-4">
                  <p className="text-white/90">
                    •{" "}
                    <span className="font-bold text-[#FFAC3A]">
                      기브 리스트(give list) 기반 협업 기회 상시 제공
                    </span>
                  </p>
                  <p className="text-white/90">
                    • 참가자 연락처 공유 시스템 (선택적)
                  </p>
                  <p className="text-white/90">• 커뮤니티 온라인 그룹 초대</p>
                  <p className="text-white/90">
                    • 다음 Meet Up 및 관련 이벤트 우선 알림
                  </p>
                </div>

                <div className="text-center bg-gradient-to-r from-[#FFAC3A]/20 to-[#FFAC3A]/10 px-6 py-4 rounded-full border border-[#FFAC3A]/30">
                  <p className="text-lg font-bold text-[#FFAC3A]">
                    &quot;한 번의 만남, 지속적인 연결, 함께하는 성장&quot;
                  </p>
                </div>
              </div>

              {/* 예시 이미지 */}
              <div className="text-center">
                <div className="w-full mb-8">
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
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 고객 후기 섹션 */}
            <div className="my-20">
              <h2 className="text-2xl font-bold text-center mb-12 text-white">
                나우서울 참가자분들이 남겨주신
                <br />
                소중한 후기입니다
              </h2>

              <div className="space-y-6">
                {/* 후기 1 */}
                <div className="bg-[#101F50]/20 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
                  <p className="text-white mb-4 leading-relaxed">
                    &quot;다양한 직무의 전문가들과 깊이 있는 대화를 나눌 수
                    있어서 정말 값진 시간이었어요. 마케팅 아이디어를 얻고 실제
                    협업까지 이어진 경험이 놀라웠습니다!&quot;
                  </p>
                  <p className="text-[#FFAC3A] text-right font-medium">
                    - 2년차 마케터 서지민
                  </p>
                </div>

                {/* 후기 2 */}
                <div className="bg-[#101F50]/20 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
                  <p className="text-white mb-4 leading-relaxed">
                    &quot;평일 저녁에 이렇게 의미 있는 커뮤니티를 만날 수 있다니
                    놀랐어요. 개발자로서 다른 직무와 인사이트를 얻을 수 있는
                    소중한 기회였습니다.&quot;
                  </p>
                  <p className="text-[#FFAC3A] text-right font-medium">
                    - 13년차 개발자 김도현
                  </p>
                </div>

                {/* 후기 3 */}
                <div className="bg-[#101F50]/20 backdrop-blur-[30px] p-6 rounded-xl border border-[#101F50]/50">
                  <p className="text-white mb-4 leading-relaxed">
                    &quot;체계적인 네트워킹 시스템에 감동했어요. 디자이너로서
                    다양한 분야의 피드백을 한 자리에서 얻고 실제 프로젝트
                    의뢰까지 받았습니다!&quot;
                  </p>
                  <p className="text-[#FFAC3A] text-right font-medium">
                    - 5년차 디자이너 이혜원
                  </p>
                </div>
              </div>
            </div>

            {/* 마무리 섹션 */}
            <div className="text-center my-20">
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-white">
                전문성은 나누고, 인사이트는 채우고!
                <br />
                진정한 네트워킹의 가치를 경험하세요!
              </h2>
              <p className="text-lg mb-8 text-white/90">
                이제 더 이상 형식적인 명함 교환에 그치지 마세요!
              </p>
              <div className="bg-gradient-to-br from-[#FFAC3A]/20 via-[#FFAC3A]/10 to-black/40 backdrop-blur-md p-8 rounded-2xl border border-[#FFAC3A]/30">
                <p className="text-xl md:text-2xl text-[#FFAC3A] font-bold mb-4">
                  성장과 협업의 기회를 만들어 줄
                </p>
                <p className="text-2xl md:text-3xl text-white font-bold">
                  &lt;나우서울 밋업&gt;이 당신을 기다립니다.
                </p>
              </div>
            </div>

            {/* 연합어때 이미지 */}
            <div className="w-full my-24"></div>

            {/* 신청 전 최종 확인 내용 */}
            <div className="mb-16">
              <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 text-center">
                  신청 전 최종 확인 내용
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-[#FFAC3A]">
                      참가자 지각
                    </span>
                    <span>
                      당일 지각 시간 정확히 나우서울 서비스센터에 알림! 15분
                      지각 이후 입장 불가
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-[#FFAC3A]">소요시간</span>
                    <span>2시간 30분 ~ 3시간</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-[#FFAC3A]">제공사항</span>
                    <span>체계적인 네트워킹 콘텐츠, 다과 및 음료</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-[#FFAC3A]">준비물품</span>
                    <span>충전된 폰, 명함 (선택)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ 섹션 */}
            <FAQSection questions={faqQuestions} />
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
          <div className="w-full max-w-[620px] mx-auto">
            <LinkWithUtm
              href="https://form.ssobig.com/nowseoul"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] bg-[#101F50] hover:bg-[#0A1838] text-white font-bold px-6 rounded-[100px] flex items-center justify-center transition-colors text-lg shadow-lg hover:shadow-xl"
              brandPage="now_seoul"
              buttonType="meetup_main_cta"
              destination="smore_form"
            >
              📢 알림 신청하기
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
      </div>
    </>
  );
}
