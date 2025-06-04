"use client";

import React, { useState } from "react";
import GlobalNav from "@/components/GlobalNav";

export default function TestNavPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("사이드바 토글:", !sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <GlobalNav toggleSidebar={toggleSidebar} />

      <div className="pt-[72px] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            GlobalNav 컴포넌트 테스트
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">테스트 정보</h2>
            <ul className="space-y-2 text-gray-600">
              <li>
                • 현재 페이지: /test-nav (홈이 아니므로 뒤로가기 버튼 표시)
              </li>
              <li>• 사이드바 상태: {sidebarOpen ? "열림" : "닫힘"}</li>
              <li>• 햄버거 메뉴 클릭 시 콘솔에 로그가 출력됩니다</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">컴포넌트 기능</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                🔙 <strong>뒤로가기 버튼:</strong> 홈이 아닌 페이지에서만
                표시됩니다
              </p>
              <p>
                ☰ <strong>햄버거 메뉴:</strong> 클릭하면 사이드바를 토글합니다
              </p>
              <p>
                📱 <strong>반응형:</strong> 모바일과 데스크톱에서 크기가
                조정됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
