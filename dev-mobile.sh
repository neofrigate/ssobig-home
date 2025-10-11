#!/bin/bash

# 3000번 포트 확인 및 정리
echo "🔍 3000번 포트 확인 중..."
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "⚠️  3000번 포트 사용 중인 프로세스 종료..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  sleep 1
fi

# 로컬 IP 주소 가져오기
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo ""
echo "✅ 개발 서버 시작..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 모바일 접속 주소: http://${LOCAL_IP}:3000"
echo "💻 컴퓨터 접속 주소: http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 개발 서버 실행
yarn dev:mobile

