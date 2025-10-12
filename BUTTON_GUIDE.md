# 버튼 디자인 가이드

쏘빅 홈페이지의 일관된 버튼 스타일을 위한 반응형 버튼 가이드입니다.

## 🔘 버튼 위계

### 1️⃣ Primary Action 버튼

페이지 내 주요 액션을 유도하는 버튼입니다.

#### 적용 범위

- **홈 페이지**

  - "친구들과 즐기기"
  - "새로운 사람과 알아가기"
  - "지금 시작하기"
  - "템플릿 둘러보기"
  - "소셜링 자세히 보기"

- **소셜링 페이지**
  - "연프 좋아하는 솔로 💕"
  - "게임 예능 러버 🎮"

#### 현재 스타일

```tsx
className =
  "inline-flex items-center justify-center border border-gray-900 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-full transition-colors hover:bg-gray-900 hover:text-white";
```

#### 디바이스별 크기 (현재)

| 속성          | 모바일 (~640px) | sm (640px~)    | md (768px~)    | lg (1024px~)   |
| ------------- | --------------- | -------------- | -------------- | -------------- |
| **좌우 패딩** | 24px (px-6)     | 32px (px-8)    | 32px           | 32px           |
| **상하 패딩** | 12px (py-3)     | 16px (py-4)    | 16px           | 16px           |
| **폰트 크기** | 14px (text-sm)  | 18px (text-lg) | 18px           | 18px           |
| **폰트 굵기** | semibold (600)  | semibold (600) | semibold (600) | semibold (600) |
| **라운드**    | rounded-full    | rounded-full   | rounded-full   | rounded-full   |

#### 최종 반응형 시스템 ✅

| 속성          | 모바일 (~640px) | sm (640px~) | md (768px~) | lg (1024px~) |
| ------------- | --------------- | ----------- | ----------- | ------------ |
| **좌우 패딩** | 24px            | 28px        | 32px        | 32px         |
| **상하 패딩** | 12px            | 14px        | 16px        | 16px         |
| **폰트 크기** | 14px            | 16px        | 18px        | 18px         |
| **폰트 굵기** | semibold        | semibold    | semibold    | semibold     |
| **라운드**    | full            | full        | full        | full         |

**Tailwind CSS 클래스**

```css
px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full
```

---

### 2️⃣ Secondary Action 버튼 (자세히 보기)

섹션 내 상세 페이지로 이동하는 버튼입니다.

#### 적용 범위

- **소셜링 페이지**
  - "러브버디즈 자세히 보기 →"
  - "게임오브 자세히 보기 →"

#### 현재 스타일

```tsx
className =
  "inline-flex items-center justify-center border border-white/80 text-white px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-full transition-colors hover:border-white hover:bg-white/10";
```

#### 디바이스별 크기 (현재)

| 속성          | 모바일 (~640px) | sm (640px~)    | md (768px~)    | lg (1024px~)   |
| ------------- | --------------- | -------------- | -------------- | -------------- |
| **좌우 패딩** | 24px (px-6)     | 40px (px-10)   | 40px           | 40px           |
| **상하 패딩** | 12px (py-3)     | 16px (py-4)    | 16px           | 16px           |
| **폰트 크기** | 14px (text-sm)  | 18px (text-lg) | 18px           | 18px           |
| **폰트 굵기** | semibold (600)  | semibold (600) | semibold (600) | semibold (600) |
| **라운드**    | rounded-full    | rounded-full   | rounded-full   | rounded-full   |

#### 최종 반응형 시스템 ✅

| 속성          | 모바일 (~640px) | sm (640px~) | md (768px~) | lg (1024px~) |
| ------------- | --------------- | ----------- | ----------- | ------------ |
| **좌우 패딩** | 24px            | 28px        | 32px        | 32px         |
| **상하 패딩** | 12px            | 14px        | 16px        | 16px         |
| **폰트 크기** | 14px            | 16px        | 18px        | 18px         |
| **폰트 굵기** | semibold        | semibold    | semibold    | semibold     |
| **라운드**    | full            | full        | full        | full         |

**Tailwind CSS 클래스**

```css
px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full
```

**💡 참고**: Primary와 동일한 크기로 통일되었습니다.

---

## 📊 버튼 크기 통일

### Primary & Secondary 버튼 (통일됨) ✅

| 디바이스 | 좌우 패딩 | 상하 패딩 | 폰트 크기 |
| -------- | --------- | --------- | --------- |
| 모바일   | 24px      | 12px      | 14px      |
| sm       | 28px      | 14px      | 16px      |
| md       | 32px      | 16px      | 18px      |
| lg       | 32px      | 16px      | 18px      |

모든 액션 버튼이 동일한 크기 시스템을 사용하여 일관된 사용자 경험을 제공합니다.

### 폰트 크기 (공통)

| 디바이스 | 폰트 크기 | Tailwind  |
| -------- | --------- | --------- |
| 모바일   | 14px      | text-sm   |
| sm       | 16px      | text-base |
| md       | 18px      | text-lg   |
| lg       | 18px      | text-lg   |

---

## 🎨 스타일 가이드

### 컬러 시스템

#### Light 배경 (Primary)

```tsx
// Default
border: border - gray - 900;
text: text - gray - 900;
bg: transparent;

// Hover
bg: bg - gray - 900;
text: text - white;
```

#### Dark 배경 (Secondary)

```tsx
// Default
border: border - white / 80;
text: text - white;
bg: transparent;

// Hover
border: border - white;
bg: bg - white / 10;
```

### 애니메이션

```css
transition-colors  /* 색상 전환 애니메이션 */
```

### 접근성

```tsx
// 아이콘만 있는 버튼
aria-label="버튼 설명"

// 인터랙션
cursor-pointer
hover:opacity-70  // 또는 hover:bg-변경
```

---

## 🔗 관련 파일

- `/src/app/page.tsx` (홈)
- `/src/app/socialing/page.tsx`
- `/src/app/playroom/page.tsx`

---

## 💡 버튼 위계 시각화

```
1️⃣ Primary Action 버튼 (통일됨) ✅
   패딩: 24→28→32 (좌우) / 12→14→16 (상하)
   폰트: 14→16→18px

   홈 페이지:
   └─ "친구들과 즐기기", "새로운 사람과 알아가기"
   └─ "지금 시작하기", "템플릿 둘러보기", "소셜링 자세히 보기"

   소셜링 페이지:
   └─ "연프 좋아하는 솔로 💕", "게임 예능 러버 🎮"

2️⃣ Secondary Action 버튼 (통일됨) ✅
   패딩: 24→28→32 (좌우) / 12→14→16 (상하)
   폰트: 14→16→18px

   소셜링 페이지:
   └─ "러브버디즈 자세히 보기 →", "게임오브 자세히 보기 →"

💡 Primary와 Secondary가 동일한 크기로 통일되어 일관성 확보!

3️⃣ Tertiary / Icon 버튼 - 추후 정의 예정
   └─ 작은 액션 버튼, 아이콘 버튼 등
```

---

## 📱 반응형 동작

- **모바일**: 컴팩트한 크기로 터치 타겟 확보 (최소 44x44px)
- **sm**: 약간 증가하여 여유 공간 활용
- **md**: 표준 데스크톱 크기로 적절한 시각적 무게감
- **lg**: 큰 화면에서 더욱 편안한 클릭 영역

---

## 📋 체크리스트

### Primary Action 버튼 추가 시

- [ ] 패딩: `px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4`
- [ ] 폰트: `text-sm sm:text-base md:text-lg font-semibold`
- [ ] 스타일: `rounded-full border border-gray-900` (1px border 사용)
- [ ] 애니메이션: `transition-colors hover:bg-gray-900 hover:text-white`
- [ ] ⚠️ 주의: `border-2` 사용 금지 (너무 두꺼움)

### Secondary Action 버튼 추가 시

- [ ] 패딩: `px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4`
- [ ] 폰트: `text-sm sm:text-base md:text-lg font-semibold`
- [ ] 스타일: `rounded-full border border-white/80` (1px border 사용)
- [ ] 애니메이션: `transition-colors hover:border-white hover:bg-white/10`
- [ ] 💡 Primary와 동일한 크기 시스템 사용
- [ ] ⚠️ 주의: `border-2` 사용 금지 (너무 두꺼움)

### 공통

- [ ] 터치 타겟 크기 확인 (최소 44x44px)
- [ ] 모든 디바이스에서 테스트
- [ ] 호버 상태 확인
- [ ] 접근성 속성 추가 (aria-label 등)
- [ ] **Border는 항상 1px (border) 사용, border-2 금지**

---

## 🔄 업데이트 내역

### 2024-10-10 v5 (최신) ✅

- **Border 두께 최적화**
- `border-2` → `border` (2px → 1px)로 변경
- 더 세련되고 가벼운 느낌 구현
- 홈 페이지 버튼 3개 + CTA 카드 3개 적용

### 2024-10-10 v4

- **홈 페이지 버튼 적용 완료**
- 5개 버튼 모두 버튼 가이드에 맞게 변경
- 전체 사이트 버튼 스타일 통일 완료
- rounded-full 스타일 일괄 적용

### 2024-10-10 v3

- **Primary & Secondary 버튼 크기 통일**
- 모든 액션 버튼이 동일한 크기 시스템 사용
- 패딩: 24→28→32px (좌우), 12→14→16px (상하)
- 폰트: 14→16→18px
- 일관된 사용자 경험 제공
- 실제 코드에 적용 완료

### 2024-10-10 v2

- Primary Action 버튼 최종 크기 확정
- 3단계 실질적 크기 변화 (md/lg 동일)
- 실제 코드에 적용 완료

### 2024-10-10 v1

- 버튼 위계 2단계 정의 (Primary, Secondary)
- 반응형 4단계 시스템 제안 (모바일/sm/md/lg)
- 현재 상태와 제안 시스템 비교 문서화

---

## 📝 주의사항

1. **크기 통일**: 모든 액션 버튼은 동일한 크기 시스템을 사용합니다.
2. **터치 타겟**: 모바일에서 최소 44x44px 이상 확보하세요.
3. **일관성**: 같은 레벨의 버튼은 동일한 스타일을 사용하세요.
4. **컨텍스트**: 배경색에 따라 적절한 컬러 스타일을 선택하세요 (Light 배경: gray-900 border, Dark 배경: white/80 border).
5. **접근성**: 아이콘만 있는 버튼은 aria-label을 반드시 추가하세요.
6. **구분**: Primary와 Secondary는 크기가 아닌 컬러와 컨텍스트로 구분됩니다.
7. **⚠️ Border 두께**: 항상 `border` (1px) 사용, `border-2` (2px)는 사용 금지 - 너무 두껍고 무거워 보입니다.

---

**문서 작성일**: 2024-10-10  
**최종 업데이트**: 2024-10-10  
**버전**: 1.0
