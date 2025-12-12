# 프로젝트 MD 파일 작성 가이드

이 디렉토리는 쏘빅 프로젝트 페이지에 표시될 프로젝트 정보를 MD(Markdown) 파일 형태로 관리합니다.

## 파일 구조

각 프로젝트는 개별 `.md` 파일로 관리됩니다. 파일명이 프로젝트 ID가 됩니다.

```
content/projects/
├── example-project-1.md
├── example-project-2.md
└── example-project-3.md
```

## MD 파일 형식

각 MD 파일은 다음과 같은 구조를 가집니다:

```markdown
---
# 필수 필드
id: "프로젝트-고유-id"
title: "프로젝트 제목"
description: "프로젝트 간단한 설명"
category: "카테고리명"
tags: ["태그1", "태그2", "태그3"]
year: "2024"
status: "published" # published 또는 draft

# 선택 필드
date: "2024-03-15"
partner: "파트너사명"
thumbnail: "/ssobig_assets/프로젝트/thumbnail.png"
images:
  - "/ssobig_assets/프로젝트/image1.png"
  - "/ssobig_assets/프로젝트/image2.png"
link: "https://프로젝트-웹사이트.com"
selection: ["추천", "인기"]
---

# 프로젝트 본문 시작

여기에 프로젝트에 대한 상세 설명을 마크다운 형식으로 작성합니다.

## 소제목

내용...

### 더 작은 소제목

- 리스트 항목 1
- 리스트 항목 2

> 인용문

---

구분선
```

## 필드 설명

### 필수 필드

- **id**: 프로젝트의 고유 식별자 (파일명과 동일하게 설정)
- **title**: 프로젝트 제목
- **description**: 프로젝트 한 줄 설명
- **category**: 프로젝트 카테고리 (예: "게임", "소셜링", "공간" 등)
- **tags**: 프로젝트 태그 배열
- **year**: 프로젝트 연도
- **status**: 게시 상태
  - `published`: 프로젝트 페이지에 표시됨
  - `draft`: 작성 중, 페이지에 표시되지 않음

### 선택 필드

- **date**: 프로젝트 날짜 (YYYY-MM-DD 형식)
- **partner**: 파트너사 또는 협력 기관
- **thumbnail**: 썸네일 이미지 경로 (프로젝트 목록에 표시)
- **images**: 갤러리 이미지 경로 배열 (프로젝트 상세 페이지에 표시)
- **link**: 외부 링크 (프로젝트 웹사이트, 신청 폼 등)
- **selection**: 프로젝트 선택 항목 (예: ["추천", "인기", "화제"] 등)

## 본문 작성 가이드

### 마크다운 문법

표준 마크다운 문법을 모두 사용할 수 있습니다:

- `#`, `##`, `###`: 제목
- `**굵게**`, `*기울임*`: 텍스트 스타일
- `- 항목`: 리스트
- `> 인용`: 인용문
- `---`: 구분선

### 특수 임베드

#### 유튜브 영상

```markdown
[VIDEO]https://www.youtube.com/watch?v=비디오ID
```

#### 외부 링크

```markdown
[LINK]https://example.com
```

#### 임베드

```markdown
[EMBED]https://example.com/embed
```

## 이미지 파일 관리

프로젝트 이미지는 `public/ssobig_assets/` 디렉토리에 저장합니다.

권장 구조:

```
public/ssobig_assets/
├── 프로젝트명1/
│   ├── thumbnail.png
│   ├── image1.png
│   └── image2.png
└── 프로젝트명2/
    └── ...
```

MD 파일에서 이미지 경로 참조:

```yaml
thumbnail: "/ssobig_assets/프로젝트명1/thumbnail.png"
images:
  - "/ssobig_assets/프로젝트명1/image1.png"
  - "/ssobig_assets/프로젝트명1/image2.png"
```

## 새 프로젝트 추가하기

1. `content/projects/` 디렉토리에 새 `.md` 파일 생성
2. 파일명을 프로젝트 ID로 설정 (예: `my-new-project.md`)
3. 위의 템플릿을 참고하여 frontmatter와 본문 작성
4. `status: "published"` 로 설정하여 게시
5. 필요한 이미지는 `public/ssobig_assets/` 에 업로드

## 주의사항

- 파일명에는 영문 소문자, 숫자, 하이픈(-)만 사용 권장
- `status: "published"` 인 프로젝트만 프로젝트 페이지에 표시됨
- 이미지는 반드시 `public/` 디렉토리 하위에 위치해야 함
- YAML frontmatter 형식을 정확히 지켜야 함 (들여쓰기 주의)

## 예제 파일

`example-project-1.md`, `example-project-2.md`, `example-project-3.md` 파일을 참고하세요.





