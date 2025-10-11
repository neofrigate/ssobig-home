#!/bin/bash

# 3000번 포트 확인 및 정리
echo "🔍 3000번 포트 확인 중..."
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "⚠️  3000번 포트 사용 중인 프로세스 종료..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  sleep 1
  echo "✅ 3000번 포트 정리 완료"
else
  echo "✅ 3000번 포트 사용 가능"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 개발 서버 시작 중..."
echo "💻 접속 주소: http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 개발 서버 실행
yarn dev

