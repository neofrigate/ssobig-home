#!/bin/bash

# ngrok 도메인 설정
NGROK_DOMAIN="undepressive-makenzie-supernaturally.ngrok-free.dev"
NGROK_DOMAIN_FILE="local.ngrok-domain"
USING_CUSTOM_NGROK_DOMAIN=false
USE_RANDOM_DOMAIN=false

if [ -f "$NGROK_DOMAIN_FILE" ]; then
  CUSTOM_NGROK_DOMAIN=$(sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' "$NGROK_DOMAIN_FILE")
  if [ ! -z "$CUSTOM_NGROK_DOMAIN" ]; then
    CUSTOM_NGROK_DOMAIN_LOWER=$(echo "$CUSTOM_NGROK_DOMAIN" | tr '[:upper:]' '[:lower:]')
    if [[ "$CUSTOM_NGROK_DOMAIN_LOWER" == "random" || "$CUSTOM_NGROK_DOMAIN_LOWER" == "none" ]]; then
      USE_RANDOM_DOMAIN=true
      USING_CUSTOM_NGROK_DOMAIN=true
    else
      NGROK_DOMAIN="$CUSTOM_NGROK_DOMAIN"
      USING_CUSTOM_NGROK_DOMAIN=true
    fi
  fi
fi

# 사용법 출력
show_usage() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 사용법"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "  ./runserver.sh                  # 개발 서버 + ngrok 실행 (고정 도메인)"
  echo "  ./runserver.sh random           # 개발 서버 + ngrok 실행 (랜덤 도메인)"
  echo "  ./runserver.sh check            # 배포 전 체크 (lint + build)"
  echo "  ./runserver.sh lint             # ESLint만 실행"
  echo "  ./runserver.sh build            # 프로덕션 빌드만 실행"
  echo ""
  echo "  현재 고정 도메인: $NGROK_DOMAIN"
  echo "  (개인 도메인은 local.ngrok-domain 파일에 저장"
  echo "   파일에 random 또는 none을 입력하면 랜덤 도메인 사용)"
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
  random)
    # 랜덤 도메인으로 실행
    USE_RANDOM_DOMAIN=true
    ;;
  "")
    # 인자 없으면 기본 개발 서버 실행 (고정 도메인)
    ;;
  *)
    echo "❌ 알 수 없는 명령어: $1"
    show_usage
    ;;
esac

# Ctrl+C 시 cleanup 함수 실행
trap cleanup SIGINT SIGTERM

# 기존 ngrok 프로세스 확인 및 종료
echo "🔍 기존 ngrok 프로세스 확인 중..."
NGROK_PIDS=$(pgrep -f "ngrok")
if [ ! -z "$NGROK_PIDS" ]; then
  echo "⚠️  기존 ngrok 프로세스 종료 중..."
  echo "$NGROK_PIDS" | xargs kill -9 2>/dev/null
  sleep 2
  echo "✅ ngrok 프로세스 정리 완료"
else
  echo "✅ 실행 중인 ngrok 프로세스 없음"
fi

echo ""

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

echo "🧪 TypeScript 타입 체크 중..."
if yarn tsc --noEmit; then
  echo "✅ 타입 체크 통과"
else
  echo "❌ 타입 오류가 발생했습니다. 위의 에러를 수정한 뒤 다시 실행하세요."
  exit 1
fi

echo ""
echo "📝 ESLint 체크 중..."
if yarn lint; then
  echo "✅ ESLint 체크 통과"
else
  echo "❌ ESLint 오류가 발생했습니다. 위의 에러를 수정한 뒤 다시 실행하세요."
  exit 1
fi

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

if [ "$USE_RANDOM_DOMAIN" = false ]; then
  if [ "$USING_CUSTOM_NGROK_DOMAIN" = true ]; then
    echo "ℹ️  local.ngrok-domain 파일에서 사용자 정의 도메인을 불러왔습니다."
  else
    echo "ℹ️  local.ngrok-domain 파일을 찾지 못해 기본 도메인을 사용합니다."
  fi
fi

if [ "$USE_RANDOM_DOMAIN" = true ]; then
  echo "📱 외부 주소:  아래 ngrok URL 확인 (랜덤 도메인)"
else
  echo "📱 외부 주소:  https://$NGROK_DOMAIN"
fi

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

# ngrok 실행 (도메인 지정 여부에 따라 분기)
if [ "$USE_RANDOM_DOMAIN" = true ]; then
  ngrok http 3000
else
  # 도메인 예약 오류 시 자동으로 랜덤 도메인으로 fallback
  echo "🔐 ngrok 인증 확인 중..."
  
  # ngrok 실행 시도 (출력을 임시 파일로 저장)
  NGROK_LOG_FILE="/tmp/ngrok_output_$$.log"
  ngrok http --domain=$NGROK_DOMAIN 3000 > "$NGROK_LOG_FILE" 2>&1 &
  NGROK_PID=$!
  
  # 3초 대기 후 에러 확인 (ngrok이 에러를 출력하는데 시간이 걸릴 수 있음)
  sleep 3
  
  # 로그 파일에서 에러 확인
  if [ -f "$NGROK_LOG_FILE" ]; then
    if grep -qi "ERR_NGROK_320\|reserved for another account\|failed to start tunnel" "$NGROK_LOG_FILE" 2>/dev/null; then
      # 도메인 예약 오류 발견 - 프로세스 종료 후 랜덤 도메인으로 전환
      kill $NGROK_PID 2>/dev/null
      wait $NGROK_PID 2>/dev/null
      echo "✅ ngrok 인증 확인 완료"
      echo ""
      echo "⚠️  도메인 '$NGROK_DOMAIN'이 다른 계정에 예약되어 있습니다."
      echo "🔄 랜덤 도메인으로 자동 전환합니다..."
      echo ""
      rm -f "$NGROK_LOG_FILE"
      ngrok http 3000
      exit 0
    fi
  fi
  
  # 프로세스가 여전히 실행 중인지 확인
  if kill -0 $NGROK_PID 2>/dev/null; then
    # 정상 실행 중 - 로그 파일 삭제하고 ngrok 출력을 화면에 표시
    echo "✅ ngrok 인증 완료"
    rm -f "$NGROK_LOG_FILE"
    # ngrok 출력을 화면에 표시하면서 실행
    wait $NGROK_PID
  else
    # 프로세스가 종료되었는데 에러가 감지되지 않았으면 로그 출력
    if [ -f "$NGROK_LOG_FILE" ]; then
      echo "❌ ngrok 실행 실패:"
      cat "$NGROK_LOG_FILE"
      rm -f "$NGROK_LOG_FILE"
    fi
    exit 1
  fi
fi
