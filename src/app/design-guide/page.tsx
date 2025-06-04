"use client";

import React, { useState } from "react";
import GlobalNav from "@/components/GlobalNav";
import ActionButton from "@/components/ActionButton";
import Card from "@/components/Card";
import MainCard from "@/components/MainCard";
import CardWrapper from "@/components/CardWrapper";
import {
  LinkIcon,
  CssInstagramIcon,
  HamburgerIcon,
} from "@/components/IconComponents";

export default function DesignGuidePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("사이드바 토글:", !sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalNav toggleSidebar={toggleSidebar} />

      <div className="pt-[72px] px-4 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎨 Ssobig 디자인 시스템
            </h1>
            <p className="text-xl text-gray-600">
              모든 컴포넌트를 한 눈에 확인할 수 있는 디자인 가이드입니다
            </p>
          </div>

          {/* Navigation Components */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-blue-500">
              🧭 Navigation Components
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">GlobalNav</h3>
              <p className="text-gray-600 mb-4">
                전역 네비게이션 바 - 뒤로가기 버튼과 햄버거 메뉴를 포함
              </p>
              <div className="bg-gray-800 rounded-lg overflow-hidden relative h-20">
                <div className="absolute inset-0 flex items-center justify-between px-5">
                  <div className="text-neutral-100">← 뒤로가기</div>
                  <div className="flex-1"></div>
                  <HamburgerIcon className="w-8 h-8 text-neutral-100" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Props: toggleSidebar (함수), 홈페이지에서는 뒤로가기 버튼 숨김
              </div>
            </div>
          </section>

          {/* Button Components */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-pink-500">
              🔘 Button Components
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">ActionButton</h3>
              <p className="text-gray-600 mb-4">
                CTA 버튼 - UTM 파라미터와 Google Analytics 추적 기능 포함
              </p>
              <div className="flex justify-center">
                <ActionButton
                  href="https://example.com"
                  brandPage="design-guide"
                  buttonType="demo"
                  destination="example"
                >
                  데모 버튼 클릭해보세요!
                </ActionButton>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Props: href, children, className, target, rel, brandPage,
                buttonType, destination
              </div>
            </div>
          </section>

          {/* Card Components */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-green-500">
              🃏 Card Components
            </h2>

            {/* Regular Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Card (일반 카드)</h3>
              <p className="text-gray-600 mb-4">
                재사용 가능한 카드 컴포넌트 - 이미지, 제목, 설명, 링크 포함
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card
                  title="일반 카드 예시"
                  description="이것은 일반 카드 컴포넌트입니다.\n다양한 스타일과 옵션을 지원합니다."
                  linkText="링크 방문하기"
                  linkHref="https://example.com"
                  linkIconType="link"
                  imagePlaceholderText="이미지 영역"
                  brandPage="design-guide"
                  buttonType="card-demo"
                  destination="example"
                />
                <Card
                  title="Instagram 카드"
                  description="Instagram 아이콘을 사용하는 카드입니다.\n소셜 미디어 링크에 적합합니다."
                  linkText="@ssobig_official"
                  linkHref="https://instagram.com/ssobig_official"
                  linkIconType="instagram"
                  imagePlaceholderText="Instagram 이미지"
                  brandPage="design-guide"
                  buttonType="social-demo"
                  destination="instagram"
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Props: title, description, linkText, linkHref, linkIconType,
                hasImageArea, cardBgClass, titleClass, descriptionClass,
                linkTextClass, fullImageCard, brandPage, buttonType, destination
              </div>
            </div>

            {/* Full Image Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Card (풀 이미지 카드)
              </h3>
              <p className="text-gray-600 mb-4">
                전체 이미지 스타일의 카드 - fullImageCard prop 사용
              </p>
              <div className="max-w-md mx-auto">
                <Card
                  title="풀 이미지 카드"
                  description="전체 이미지 스타일"
                  linkText="자세히 보기"
                  linkHref="https://example.com"
                  linkIconType="link"
                  fullImageCard={true}
                  imageAreaStyle={{
                    backgroundImage:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                  brandPage="design-guide"
                  buttonType="fullimage-demo"
                  destination="example"
                />
              </div>
            </div>

            {/* MainCard */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">MainCard</h3>
              <p className="text-gray-600 mb-4">
                메인 페이지용 카드 - 밝은 배경색과 콤팩트한 디자인
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <MainCard
                  title="메인 카드 예시"
                  description="메인 페이지에 사용되는 카드입니다"
                  linkText="바로가기"
                  linkHref="https://example.com"
                  linkIconType="link"
                  imagePlaceholderText="메인 이미지"
                />
                <MainCard
                  title="Instagram 메인 카드"
                  description="Instagram 링크용 메인 카드"
                  linkText="@ssobig"
                  linkHref="https://instagram.com"
                  linkIconType="instagram"
                  imagePlaceholderText="Instagram"
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Props: imageUrl, imagePlaceholderText, imageAreaStyle, title,
                description, linkText, linkHref, linkIconType, hasImageArea,
                cardBgClass, titleClass, descriptionClass, linkTextClass
              </div>
            </div>

            {/* CardWrapper */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">CardWrapper</h3>
              <p className="text-gray-600 mb-4">
                카드를 클릭 가능하게 만드는 래퍼 컴포넌트 - UTM 파라미터 자동
                추가
              </p>
              <CardWrapper href="https://example.com">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg cursor-pointer transform transition-all hover:scale-105">
                  <h4 className="text-lg font-bold mb-2">클릭 가능한 카드</h4>
                  <p>CardWrapper로 감싸진 콘텐츠입니다. 클릭해보세요!</p>
                </div>
              </CardWrapper>
              <div className="mt-4 text-sm text-gray-500">
                Props: href, children
              </div>
            </div>
          </section>

          {/* Icon Components */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-purple-500">
              🎯 Icon Components
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">IconComponents</h3>
              <p className="text-gray-600 mb-6">
                프로젝트에서 사용하는 아이콘 컴포넌트들
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                  <LinkIcon className="mx-auto mb-2" />
                  <h4 className="font-semibold">LinkIcon</h4>
                  <p className="text-sm text-gray-500">일반 링크용 아이콘</p>
                </div>
                <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                  <CssInstagramIcon className="mx-auto mb-2" />
                  <h4 className="font-semibold">CssInstagramIcon</h4>
                  <p className="text-sm text-gray-500">
                    Instagram 링크용 아이콘
                  </p>
                </div>
                <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                  <HamburgerIcon className="mx-auto mb-2 text-gray-700" />
                  <h4 className="font-semibold">HamburgerIcon</h4>
                  <p className="text-sm text-gray-500">메뉴 버튼용 아이콘</p>
                </div>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-yellow-500">
              🎨 Color Palette
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">주요 색상</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-full h-20 bg-[#FF689F] rounded-lg mb-2"></div>
                  <p className="text-sm font-semibold">#FF689F</p>
                  <p className="text-xs text-gray-500">Primary Pink</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 bg-neutral-900 rounded-lg mb-2"></div>
                  <p className="text-sm font-semibold">neutral-900</p>
                  <p className="text-xs text-gray-500">Dark Card BG</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 bg-neutral-200 rounded-lg mb-2 border"></div>
                  <p className="text-sm font-semibold">neutral-200</p>
                  <p className="text-xs text-gray-500">Light Card BG</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 bg-gray-50 rounded-lg mb-2 border"></div>
                  <p className="text-sm font-semibold">gray-50</p>
                  <p className="text-xs text-gray-500">Page Background</p>
                </div>
              </div>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-red-500">
              💡 사용 예시
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">컴포넌트 조합 예시</h3>
              <p className="text-gray-600 mb-6">
                실제 페이지에서 컴포넌트들이 어떻게 조합되는지 확인해보세요
              </p>

              <div className="space-y-8">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">브랜드 섹션 예시</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card
                      title="Love Buddies"
                      description="애정운과 사랑스러운 관심 만들기 굿\n사랑들을 연결하는 플랫폼 쏘빅입니다."
                      linkText="love_buddies"
                      linkHref="https://love-buddies.com"
                      linkIconType="link"
                      imageAreaStyle={{
                        backgroundImage:
                          "linear-gradient(135deg, #000000 0%, #434343 100%)",
                      }}
                      brandPage="design-guide"
                      buttonType="brand-example"
                      destination="love-buddies"
                    />
                    <Card
                      title="N.O.W seoul 나우서울"
                      description="힐링 & 일하는 전문적 비즈니스네트워킹 모임"
                      linkText="now_seoul"
                      linkHref="https://now-seoul.com"
                      linkIconType="instagram"
                      imageAreaStyle={{
                        backgroundImage:
                          "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                      }}
                      brandPage="design-guide"
                      buttonType="brand-example"
                      destination="now-seoul"
                    />
                  </div>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">CTA 버튼 예시</h4>
                  <div className="text-center">
                    <ActionButton
                      href="https://about.ssobig.com"
                      brandPage="design-guide"
                      buttonType="main-cta"
                      destination="about"
                    >
                      Ssobig에 대해 더 알아보기 →
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center py-8 border-t border-gray-200">
            <p className="text-gray-500">
              모든 컴포넌트는 TypeScript로 작성되었으며, Tailwind CSS를
              사용합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
