#!/bin/bash

# 사용법 출력
show_usage() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 사용법"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "  ./runserver.sh          # 개발 서버 + ngrok 실행"
  echo "  ./runserver.sh check    # 배포 전 체크 (lint + build)"
  echo "  ./runserver.sh lint     # ESLint만 실행"
  echo "  ./runserver.sh build    # 프로덕션 빌드만 실행"
  echo ""
  exit 0
}

# 배포 전 체크 함수
check_for_deploy() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔍 배포 전 체크 시작"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
  # Step 1: ESLint 체크
  echo "📝 [1/2] ESLint 체크 중..."
  echo ""
  if yarn lint; then
    echo ""
    echo "✅ ESLint 통과"
  else
    echo ""
    echo "❌ ESLint 에러 발생"
    echo "💡 에러를 수정한 후 다시 시도하세요"
    exit 1
  fi
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
  # Step 2: 프로덕션 빌드
  echo "🏗️  [2/2] 프로덕션 빌드 테스트 중..."
  echo ""
  if yarn build; then
    echo ""
    echo "✅ 빌드 성공"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 모든 체크 통과! Vercel 배포 가능합니다"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "💡 로컬에서 프로덕션 빌드 결과를 확인하려면:"
    echo "   yarn start"
    echo ""
  else
    echo ""
    echo "❌ 빌드 실패"
    echo "💡 위의 에러를 수정한 후 다시 시도하세요"
    exit 1
  fi
  
  exit 0
}

# Cleanup 함수 (Ctrl+C 시 모든 프로세스 종료)
cleanup() {
  echo ""
  echo "🛑 서버 종료 중..."
  
  # ngrok 프로세스 종료
  if [ ! -z "$NGROK_PID" ]; then
    kill $NGROK_PID 2>/dev/null
  fi
  
  # yarn dev 프로세스 종료
  if [ ! -z "$DEV_PID" ]; then
    kill $DEV_PID 2>/dev/null
  fi
  
  # 3000번 포트 정리
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  
  echo "✅ 모든 프로세스 종료 완료"
  exit 0
}

# 명령어 처리
case "$1" in
  help|--help|-h)
    show_usage
    ;;
  check)
    check_for_deploy
    ;;
  lint)
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 ESLint 실행 중..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    yarn lint
    exit $?
    ;;
  build)
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🏗️  프로덕션 빌드 실행 중..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    yarn build
    exit $?
    ;;
  "")
    # 인자 없으면 기본 개발 서버 실행
    ;;
  *)
    echo "❌ 알 수 없는 명령어: $1"
    show_usage
    ;;
esac

# Ctrl+C 시 cleanup 함수 실행
trap cleanup SIGINT SIGTERM

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
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 개발 서버를 백그라운드로 실행
yarn dev > /dev/null 2>&1 &
DEV_PID=$!

echo "⏳ 서버 준비 대기 중..."

# localhost:3000이 응답할 때까지 대기 (최대 30초)
for i in {1..30}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 개발 서버 준비 완료!"
    break
  fi
  sleep 1
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌍 ngrok 터널 시작 중..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💻 로컬 주소:  http://localhost:3000"
echo "📱 외부 주소:  아래 ngrok URL 확인"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ngrok 설치 확인
if ! command -v ngrok &> /dev/null; then
  echo "❌ ngrok이 설치되지 않았습니다."
  echo "설치 방법: brew install ngrok"
  echo ""
  echo "일단 로컬 서버는 실행 중입니다 (http://localhost:3000)"
  echo "종료하려면 Ctrl+C를 누르세요."
  wait $DEV_PID
  exit 1
fi

# ngrok 실행
ngrok http 3000
