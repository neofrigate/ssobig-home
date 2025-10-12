# 쏘빅 웹사이트 페이지 구조

> 최종 업데이트: 2025년 10월 11일

---

## 📋 페이지 구조 (스토리텔링 기반)

```
🌐 ssobig.com (소개 사이트)
├── 🏠 Home (메인 페이지 - 스토리텔링 중심)
│   └── https://ssobig.com/
│   └── [스토리 흐름]
│       1. 히어로: 브랜드 선언
│          - "2명의 소중한 시간부터 100명의 특별한 순간까지"
│          - CTA: 친구들과 즐기기 (/playroom) | 새로운 사람과 알아가기 (/socialing)
│       2. 쏘빅툴: 메인 서비스 (템플릿)
│          - 핸드폰만 있으면 언제 어디서나 바로 시작
│          - 4가지 강점 (모바일 접근성, 함께하는 재미, 검증된 콘텐츠, 다양한 상황)
│       3. 소셜링: 추가 옵션 (러브버디즈, 게임오브)
│          - 러브버디즈: 술 없이도 친해지는 소셜 개더링
│          - 게임오브: 당신이 주인공인 게임 예능 현실판
│       4. 신뢰 구축: 협업 실적 & 역량
│          - 유튜브 협업 | B2B/B2G 행사 | 축제/이벤트
│       5. CTA: 3가지 선택
│          - 템플릿 사용하기 (about.ssobig.com)
│          - 소셜링 참여하기 (/socialing)
│          - 협업 문의하기 (/contact)
│
├── 🎮 Playroom (플레이룸)
│   └── https://ssobig.com/playroom/
│   └── Coming Soon 페이지
│       - 쏘빅의 새로운 플레이룸 준비 중
│       - 곧 공개 예정 안내
│
├── 🎯 Socialing (소셜링)
│   ├── https://ssobig.com/socialing/
│   │   └── 소셜링 메인 페이지 (3개 섹션, 풀페이지 스크롤)
│   │       1. 소셜링 소개
│   │          - "독창적인 콘텐츠로 만드는 특별한 인연"
│   │          - 3년 동안 70개가 넘는 콘텐츠 제작
│   │       2. 러브버디즈 섹션 (풀페이지)
│   │          - "술 없이 매력있고 사랑스러운 <찐친>들 잔뜩 만드는 곳"
│   │       3. 게임오브 섹션 (풀페이지)
│   │          - "무료한 일상은 그만! 게임으로 찐친 만들기"
│   │
│   ├── 💕 Love Buddies (러브버디즈)
│   │   ├── https://ssobig.com/socialing/love-buddies/
│   │   │   └── 러브버디즈 메인 페이지
│   │   │       - 브랜드 소개
│   │   │       - 진행 중인 프로그램 리스트
│   │   │       - 인스타그램 연결
│   │   │
│   │   ├── https://ssobig.com/socialing/love-buddies/11namme/
│   │   │   └── 일일남매 (11남매)
│   │   │       - 프로그램 상세 정보
│   │   │       - 신청 폼 연결
│   │   │
│   │   ├── https://ssobig.com/socialing/love-buddies/alpha/
│   │   │   └── 알파남매
│   │   │       - 프로그램 상세 정보
│   │   │       - 신청 폼 연결
│   │   │
│   │   └── https://ssobig.com/socialing/love-buddies/manito/
│   │       └── 마니또
│   │           - 프로그램 상세 정보
│   │           - 신청 폼 연결
│   │
│   └── 🎲 Game Orb (게임오브)
│       ├── https://ssobig.com/socialing/game-orb/
│       │   └── 게임오브 메인 페이지
│       │       - TV 게임 예능을 현실에서 구현
│       │       - 더 지니어스, 크라임씬, 피의 게임, 데블스 플랜 컨셉
│       │       - 진행 중인 프로그램 & 커뮤니티 링크
│       │
│       └── https://ssobig.com/socialing/game-orb/social_genius/
│           └── 소셜지니어스
│               - 프로그램 상세 정보
│               - 신청 폼 연결
│
├── 📁 Project (프로젝트)
│   └── https://ssobig.com/project/
│   └── 프로젝트 포트폴리오 페이지
│       - 진행 중인 프로젝트 리스트
│       - 프로젝트 상세 정보
│       - 협업 문의 CTA
│
└── 📞 Contact (협업 문의)
    └── https://ssobig.com/contact/
    └── B2B/B2G 협업 문의
        - (구현 필요)
```

---

## 🗂️ 레거시 페이지 (Legacy)

```
📦 /legacy/ (숨겨진 페이지들)
├── Game Orb (게임오브 레거시)
│   ├── /legacy/game-orb/demoday/
│   ├── /legacy/game-orb/devils-plan/
│   └── /legacy/game-orb/real_genius/
│
└── Love Buddies (러브버디즈 레거시)
    ├── /legacy/love-buddies/day_nammae/
    ├── /legacy/love-buddies/detail/
    └── /legacy/love-buddies/detail2/
```

---

## 🎨 디자인 패턴

### 1. 메인 페이지 (/)

- **레이아웃**: 풀페이지 히어로 + 섹션별 좌측 정렬
- **컬러**: 블랙 히어로 → 화이트 컨텐츠 섹션
- **CTA**: 단계별 선택지 제공 (템플릿/소셜링/협업)

### 2. 소셜링 페이지 (/socialing)

- **레이아웃**: 풀페이지 스크롤 (3개 섹션)
- **인터랙션**:
  - 마우스 휠 스크롤로 섹션 전환
  - 우측 페이지네이션 인디케이터
  - 가로 무한 스크롤 이미지 슬라이더
- **컬러**:
  - 섹션 1: 화이트 배경
  - 섹션 2: 러브버디즈 (핑크 계열 배경)
  - 섹션 3: 게임오브 (퍼플-블랙 그라데이션 배경)

### 3. 브랜드 상세 페이지

- **레이아웃**: 중앙 정렬 (max-width: 720px)
- **구성**:
  - 배경 이미지 + 오버레이
  - 브랜드 로고
  - SNS 링크
  - 프로그램 카드 리스트
- **컬러**:
  - 러브버디즈: 핑크 포인트
  - 게임오브: 퍼플 포인트

### 4. Coming Soon 페이지 (/playroom)

- **레이아웃**: 전체 화면 중앙 정렬
- **컬러**: 다크 그라데이션 배경
- **메시지**: 새로운 서비스 준비 중

---

## 🔗 외부 링크 연결

### 쏘빅툴 (템플릿 플랫폼)

- URL: `https://about.ssobig.com`
- 연결 위치:
  - 메인 페이지 CTA 버튼
  - 푸터 링크

### SNS 계정

- **인스타그램**:
  - 쏘빅 공식: `@ssobig_official`
  - 러브버디즈: `@love.buddies_`
  - 게임오브: `@game_orb`
- **유튜브**: `@ssobig`

### 카카오톡 오픈채팅

- 게임오브 비밀 카톡방: `https://open.kakao.com/o/g9LIA56f`

### 약관 및 정책

- 개인정보 처리방침: `https://about.ssobig.com/privacy_policy`
- 이용약관: `https://about.ssobig.com/terms_of_service`

---

## 📱 반응형 디자인

### 브레이크포인트

- **Mobile**: < 640px (sm)
- **Tablet**: 640px ~ 768px (md)
- **Desktop**: 768px ~ 1024px (lg)
- **Large Desktop**: > 1024px

### GNB (Global Navigation Bar)

- **Desktop**: 높이 60px
- **Mobile**: 높이 88px
- 페이지 진입 시 음수 마진으로 처리하여 풀페이지 효과

### 콘텐츠 최대 너비

- **메인 섹션**: 1400px
- **브랜드 상세**: 720px
- **소셜링 풀페이지**: 1000px

---

## 🚀 다음 단계 (TODO)

- [ ] Contact 페이지 구현 (/contact)
- [ ] How to Play 페이지 구현 (/how-to-play)
- [ ] Playroom 실제 컨텐츠 구현 (현재 Coming Soon)
- [ ] Project 페이지 실제 프로젝트 추가
- [ ] 레거시 페이지 제거 또는 리다이렉트 설정
- [ ] SEO 메타데이터 최적화
- [ ] OG 이미지 설정

---

## 📝 메모

- **메인 페이지**: 스토리텔링 중심의 흐름으로 방문자를 3가지 선택지로 유도
- **소셜링 페이지**: 풀페이지 스크롤로 몰입감 있는 경험 제공
- **브랜드 일관성**: 러브버디즈(핑크), 게임오브(퍼플) 컬러로 명확한 구분
- **CTA 전략**: 각 페이지마다 명확한 다음 단계 제시 (신청하기, 문의하기, 자세히 보기)
