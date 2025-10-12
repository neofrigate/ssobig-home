# 반응형 폰트 가이드

쏘빅 홈페이지의 일관된 타이포그래피를 위한 반응형 폰트 사이즈 가이드입니다.

## 📐 타이포그래피 레벨

### 1️⃣ 페이지 메인 제목 (Page Main Heading)

페이지의 최상위 주요 제목에 사용되는 가장 큰 폰트 사이즈입니다.

#### 적용 범위

- **소셜링 페이지**

  - "독창적인 콘텐츠로 만드는 특별한 인연"

- **플레이룸 페이지**
  - "추석에도 쏘빅에서 친구들과 마피아 즐기기"

#### Tailwind CSS 클래스

```css
text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px]
```

#### 브레이크포인트별 크기

| 디바이스  | 브레이크포인트 | 폰트 크기 |
| --------- | -------------- | --------- |
| 📱 모바일 | `~640px`       | **28px**  |
| 📱 sm     | `640px~768px`  | **32px**  |
| 💻 md     | `768px~1024px` | **36px**  |
| 🖥️ lg     | `1024px~`      | **40px**  |

#### Line Height

```css
leading-tight  /* line-height: 1.25 */
```

---

### 2️⃣ 섹션 제목 (Section Heading)

페이지 내 각 섹션의 제목에 사용되는 표준 폰트 사이즈입니다.

#### 적용 범위

- **소셜링 페이지**

  - "러브버디즈"
  - "게임오브"

- **플레이룸 페이지**
  - "쏘빅 랭킹"
  - "💕 연인과 함께"
  - "👥 친구들과 함께"
  - "🎯 동아리·모임"
  - "🎪 대규모 행사"

#### Tailwind CSS 클래스

```css
text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px]
```

#### 브레이크포인트별 크기

| 디바이스  | 브레이크포인트 | 폰트 크기 |
| --------- | -------------- | --------- |
| 📱 모바일 | `~640px`       | **20px**  |
| 📱 sm     | `640px~768px`  | **24px**  |
| 💻 md     | `768px~1024px` | **28px**  |
| 🖥️ lg     | `1024px~`      | **32px**  |

#### Line Height

```css
leading-tight  /* line-height: 1.25 */
```

## 🎨 사용 예시

### 페이지 메인 제목

```tsx
<h1 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold text-gray-900 leading-tight">
  독창적인 콘텐츠로 만드는
  <br />
  특별한 인연
</h1>
```

### 섹션 제목

```tsx
<h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white leading-tight">
  러브버디즈
</h2>
```

### React 컴포넌트 예시

```tsx
// 페이지 메인 제목 컴포넌트
export function PageMainHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold leading-tight">
      {children}
    </h1>
  );
}

// 섹션 제목 컴포넌트
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-tight">
      {children}
    </h2>
  );
}
```

## 📋 체크리스트

### 페이지 메인 제목 추가 시

- [ ] 폰트 크기: `text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px]`
- [ ] 폰트 굵기: `font-bold`
- [ ] Line height: `leading-tight`
- [ ] HTML 태그: `<h1>`

### 섹션 제목 추가 시

- [ ] 폰트 크기: `text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px]`
- [ ] 폰트 굵기: `font-bold`
- [ ] Line height: `leading-tight`
- [ ] HTML 태그: `<h2>`

### 공통

- [ ] 모든 디바이스에서 테스트 완료
- [ ] 컬러 및 간격 적절히 적용

## 🔄 업데이트 내역

### 2024-10-10 v3 (최신)

- 페이지 메인 제목 모바일/sm 폰트 크기 증가 (28/32px)
- 전체적으로 더 큰 폰트 크기로 가독성 향상
- 메인 제목: 28/32/36/40px (섹션 제목과 명확한 크기 차이 유지)

### 2024-10-10 v2

- 페이지 메인 제목과 섹션 제목을 2단계로 구분
- 섹션 제목 폰트 사이즈 축소 (20/24/28/32px)
- 타이포그래피 위계 명확화

### 2024-10-10 v1

- 메인 제목 및 섹션 헤딩 폰트 사이즈 통일
- 반응형 브레이크포인트 4단계로 표준화
- Line height `leading-tight` (1.25)로 통일

## 📝 주의사항

1. **위계 구조 준수**: 페이지 메인 제목과 섹션 제목의 크기 차이를 명확히 유지하세요.
2. **일관성 유지**: 같은 레벨의 제목은 모두 동일한 폰트 사이즈를 사용합니다.
3. **커스텀 사이즈 사용**: Tailwind의 기본 클래스(`text-2xl`, `text-3xl` 등) 대신 픽셀 단위를 사용하여 정확한 크기를 보장합니다.
4. **브레이크포인트 준수**: Tailwind의 기본 브레이크포인트(`sm: 640px`, `md: 768px`, `lg: 1024px`)를 따릅니다.
5. **테스트**: 변경 후 반드시 모든 디바이스에서 테스트하세요.

## 🔗 관련 파일

- `/src/app/socialing/page.tsx`
- `/src/app/playroom/page.tsx`

## 💡 타이포그래피 위계 시각화

```
1️⃣ 페이지 메인 제목 (h1)
   28px → 32px → 36px → 40px
   └─ 예: "독창적인 콘텐츠로 만드는 특별한 인연"

2️⃣ 섹션 제목 (h2)
   20px → 24px → 28px → 32px
   └─ 예: "러브버디즈", "쏘빅 랭킹"

3️⃣ 하위 제목 (h3) - 추후 정의 예정
   └─ 본문 텍스트, 부제목, 버튼 등
```

## 📱 디바이스별 차이

| 레벨      | 모바일 | sm   | md   | lg   | 차이    |
| --------- | ------ | ---- | ---- | ---- | ------- |
| 메인 제목 | 28px   | 32px | 36px | 40px | 12px ⬆️ |
| 섹션 제목 | 20px   | 24px | 28px | 32px | 12px ⬆️ |

모바일에서 데스크톱으로 갈수록 폰트 크기가 자연스럽게 증가합니다.

---

**문서 작성일**: 2024-10-10  
**최종 업데이트**: 2024-10-10  
**작성자**: Ssobig Development Team
