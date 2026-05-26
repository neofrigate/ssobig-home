# Progress Log

> 이 파일은 Claude Code 작업 진행 상황을 기록합니다.
> 스레드가 종료되더라도 이 파일을 읽으면 작업을 이어서 진행할 수 있습니다.

---

## 현재 상태

- **현재 브랜치**: `main`
- **워킹 트리**: `progress.md` 수정 1건
- **마지막 업데이트**: 2026-05-23

---

## 최근 완료된 작업

| 날짜 | 브랜치 | 작업 내용 | 상태 |
|------|--------|----------|------|
| 2026-05-23 | main | 마케팅/플레이테스트 신청 Slack 알림 연동, `invalid_blocks` 수정, 제목 이모지/요약형 포맷 정리, `14_ssobig_manage-story` `e9d6390` 푸시 | 완료 |
| 2026-05-23 | main | 마케팅 리뷰어 폼 국가/지역 드롭다운 복구 및 `groupSize` 자동 보완으로 제출 오류 수정, `fffd341` 재배포 | 완료 |
| 2026-05-22 | main | 마케팅 리뷰어 폼 라인형 개편, 카드형 작품 선택 적용, 빌드 오류 수정 후 `a15b841`로 재배포 | 완료 |
| 2026-05-20 | main | 플레이테스트 작품 카드 `상세보기` 제거, 공용 안내 링크 추가, 캐시 버스트용 `41c4ad2` 푸시 | 완료 |
| 2026-05-20 | main | 플레이테스트 신청 폼 다국어/디자인 개편, 공개 제출 함수 연동, `7eae943`로 `main` 푸시 | 완료 |
| 2026-05-16 | main | 일일남매 상세 페이지 상단 스케줄 UI를 리스트형 성비 그래프로 개편하고 `83e7791`로 `main` 푸시 | 완료 |
| 2026-04-20 | main | 일일남매 신청서 제출 payload에 Meta Pixel `_fbp` 쿠키 전달 추가 후 `09bea0f`로 푸시 | 완료 |
| - | feature-form-ssobig-redirect | lovebuddies, realgenius, manito 게임 URL 리다이렉트 추가 | 완료 |
| - | feature-form-ssobig-redirect | 여러 페이지의 게임 링크를 새 URL로 업데이트 | 완료 |

---

## 진행 중인 작업

> 현재 진행 중인 작업이 없습니다. 새로운 작업이 시작되면 여기에 기록됩니다.

<!--
### [작업 제목]
- **브랜치**:
- **시작일**:
- **목표**:
- **진행 상황**:
  - [ ] 단계 1
  - [ ] 단계 2
- **관련 파일**:
  - `path/to/file`
- **메모**:
  - 참고 사항
-->

---

## 보류/이슈

- 로컬 preview는 `next dev`/`turbopack`에서 `_next/static/chunks/main-app.js` 계열 404와 `.next` 캐시 꼬임이 반복됨.
- 현재 확인용으로는 `npm run build` 후 `npx next start -H 0.0.0.0 -p 3010` production preview 사용이 더 안정적임.
- `www.ssobig.com`은 현재 로컬 `.vercel/project.json`이 연결된 `surin-kims-projects/ssobig-home` 프로젝트가 아니라 다른 Vercel 프로젝트/팀 배포를 바라보는 것으로 확인됨.

---

### 2026-05-23 세션 마무리

**완료한 작업**:
- `src/app/playroom/form/marketing/[locale]/MarketingSignupForm.tsx`에서 `국가 또는 지역`을 드롭다운으로 복구하고, 리뷰어 폼에서 제거한 `플레이 인원` 대신 선택 작품의 `playersLabel`을 제출 payload의 `groupSize`로 자동 매핑해 `Missing required fields` 오류를 해소함.
- 위 변경을 `fffd341`로 `main`에 푸시하고, Vercel 프로덕션 재배포 후 운영 링크 [https://www.ssobig.com/playroom/form/marketing/ko](https://www.ssobig.com/playroom/form/marketing/ko) 에서 새 빌드 노출을 확인함.
- 마케팅/플레이테스트 폼이 공통으로 사용하는 Supabase Edge Function(`14_ssobig_manage-story`)에 Slack 알림을 연결하고, 채널 `C0B5NRJNN1L` / 봇 토큰 설정 후 `playtest-signup-public`, `playtest-signup-api`를 재배포함.
- 초기 Slack 미전송 원인을 단계적으로 확인해 `value.replaceAll is not a function` 버그를 수정했고, 이후에도 미전송되던 원인이 Slack 앱 권한이 아니라 `chat.postMessage`의 `invalid_blocks`였음을 확인함.
- `supabase/functions/_shared/playtest_slack_notification.ts`를 추가해 제목/상단 개인정보 요약/본문 세부 항목/하단 링크로 구성된 Slack 포맷을 구현하고, 현재 제목은 `📥 플레이테스트 신청`, `📝 리뷰어 체험 신청`으로 정리함.
- 실제 라이브 함수 호출 테스트에서 `slackNotificationStatus: "sent"`를 확인했고, 테스트 신청 `id:24`까지 Slack 채널로 도착하는 상태를 검증함.
- `14_ssobig_manage-story` 저장소는 작업트리가 지저분해서 직접 건드리지 않고, `origin/main` 최신 `d77aa45` 기준 clean worktree(`/private/tmp/ssobig_manage_story_push`)를 만들어 슬랙 관련 3개 파일만 커밋한 뒤 `e9d6390`으로 `main`에 안전하게 푸시함.

**진행 중 (미완료)**:
- Slack 알림 텍스트 자체는 1차 정리만 끝난 상태라, 이후 운영 피드백에 따라 라벨/항목 순서/내부값 노출 범위를 더 다듬을 수 있음.
- 관련 파일: `src/app/playroom/form/marketing/[locale]/MarketingSignupForm.tsx`, `src/app/api/playroom/playtest/signup/route.ts`, `14_ssobig_manage-story/supabase/functions/_shared/playtest_slack_notification.ts`, `14_ssobig_manage-story/supabase/functions/playtest-signup-public/index.ts`, `14_ssobig_manage-story/supabase/functions/playtest-signup-api/index.ts`

**다음 세션에서 할 일**:
- Slack 메시지에서 `유입 유형`, `소스 플랫폼`, `인플루언서` 같은 내부 성격 항목을 계속 노출할지 검토하고, 필요한 경우 더 짧은 운영용 포맷으로 축약.
- 실제 운영 신청이 들어왔을 때 Slack 채널에서 텍스트 가독성이 충분한지 확인하고, 제목/구분선/항목 묶음을 한 번 더 정리.
- 필요하면 마케팅 폼/플레이테스트 폼 응답을 조회하는 내부 대시보드에서 Slack 전송 상태(`sent/failed`)도 함께 노출하는 방향 검토.

---

### 2026-05-22 세션 마무리

**완료한 작업**:
- `src/app/playroom/form/marketing/[locale]/MarketingSignupForm.tsx`를 리뷰어 초대 흐름에 맞춰 개편하고, 카드형 컨테이너를 라인형 섹션으로 바꾼 뒤 작품 선택을 플레이테스트 폼과 같은 포스터 카드 UI로 재구성함.
- `몇 명이 함께 플레이할 예정인가요?` 문항을 제거하고, 휴대폰 번호 안내를 `쿠폰/접속 안내 전달용` 톤으로 부드럽게 정리했으며, 상단 `direct`/`marketing-direct` 칩을 숨김 처리함.
- 한국어 마케팅 폼 문구를 `리뷰어 체험 신청`, `1~3일 내로 바로 시작할 수 있는 무료 체험 쿠폰과 안내` 흐름으로 정리하고, `localhost:4000` 미리보기 기준으로 먼저 확인함.
- 초기 운영 미반영 원인을 추적해 새 디자인 미반영이 캐시가 아니라 프로덕션 빌드 실패 때문임을 확인했고, `copy.labels` 참조 오류를 수정해 `Fix marketing reviewer form label references` (`a15b841`)로 `main`에 푸시함.
- `npx vercel deploy --prod --yes`로 프로덕션 배포를 직접 다시 실행했고, 운영 링크 [https://www.ssobig.com/playroom/form/marketing/ko](https://www.ssobig.com/playroom/form/marketing/ko) 에서 `리뷰어 체험 신청` 헤더, 라인형 섹션, `플레이 인원` 제거, 작품 포스터 카드 노출까지 화면으로 재확인함.

**진행 중 (미완료)**:
- 현재 진행 중인 작업은 없음.

**다음 세션에서 할 일**:
- 필요 시 `marketing/en|ja|zh` 로케일도 같은 리뷰어 초대 톤으로 자연스러운지 문구와 레이아웃을 추가 점검.
- 실제 마케팅 운영 시나리오 기준으로 제출 후 수집 데이터와 후속 안내 흐름이 충분한지 한 번 더 검토.

---

### 2026-05-20 세션 마무리

**완료한 작업**:
- `src/app/playroom/form/playtest/[locale]/PlaytestSignupForm.tsx`를 기준으로 플레이테스트 신청 폼을 한국어/영어/일본어/중국어 4개 로케일로 확장하고, 질문 섹션 선형화, 카드 라운드 축소, 작품 선택 카드/상세보기 링크/언어 드롭다운 경고 팝업 등 사용자가 요청한 UI를 반영함.
- `src/app/api/playroom/playtest/story-options/route.ts`를 추가해 `14_ssobig_manage-story`의 `game_settings`/`reviews`를 읽는 작품 목록 소스로 연결하고, 밤 아일랜드 이미지/평점/출시작 필터 기준을 실제 운영 데이터와 맞춤.
- `src/app/api/playroom/playtest/signup/route.ts`에서 프리뷰 저장 fallback을 추가해 로컬 `localhost:4000`에서도 제출 흐름 테스트가 가능하도록 만들고, 이후 운영 제출용 공개 함수 `playtest-signup-public`을 `14_ssobig_manage-story/supabase/functions/`에 추가해 실제 저장 경로를 분리함.
- `14_ssobig_manage-story/supabase/functions/playtest-signup-api/index.ts`와 `_shared/playtest_confirmation_email.ts`를 수정해 `ja/zh`도 운영 백엔드 로케일로 처리하도록 확장하고 함수 재배포를 완료함.
- 프론트 빌드 중 드러난 타입 오류를 `story-options` route와 `src/app/playroom/form/marketing/[locale]/MarketingSignupForm.tsx`에서 정리한 뒤, `Update playtest signup flow and localized forms` (`7eae943`) 커밋을 `main`에 푸시함.

**진행 중 (미완료)**:
- 실제 `www.ssobig.com` 프로덕션 반영 경로 확인 — 현재 상태: GitHub `origin/main`에는 `7eae943`까지 푸시했지만, 로컬에서 접근 가능한 Vercel 프로젝트는 `ssobig-home-one.vercel.app` 계열이고 `www.ssobig.com` 도메인은 다른 Vercel 프로젝트/팀을 보고 있어 직접 alias 제어는 못 함.
- 관련 파일: `src/app/playroom/form/playtest/[locale]/PlaytestSignupForm.tsx`, `src/app/api/playroom/playtest/story-options/route.ts`, `src/app/api/playroom/playtest/signup/route.ts`, `src/app/playroom/form/marketing/[locale]/MarketingSignupForm.tsx`, `src/components/ChannelTalk.tsx`, `src/components/GlobalNav.tsx`, `14_ssobig_manage-story/supabase/functions/playtest-signup-api/index.ts`, `14_ssobig_manage-story/supabase/functions/playtest-signup-public/index.ts`

**다음 세션에서 할 일**:
- 실제 `www.ssobig.com`이 어느 Vercel 프로젝트/팀에 연결돼 있는지 운영 계정 기준으로 확인하고, 필요하면 `7eae943`가 배포된 소스를 그쪽 프로덕션에 다시 연결.
- 운영 제출 테스트 결과를 `playtest_signups`/확인 메일/알림톡 기준으로 점검하고, 공개 함수 `playtest-signup-public`에 rate limit이나 abuse 방어가 필요한지 검토.
- 플레이테스트 폼이 마케팅 폼/기존 운영 경로와 섞이지 않도록 도메인/프로젝트 연결 구조를 문서화.

### 2026-05-20 추가 세션 마무리

**완료한 작업**:
- `src/app/playroom/form/playtest/[locale]/PlaytestSignupForm.tsx`에서 작품 카드 내부 `상세보기` 링크를 제거하고, 카드 목록 상단에 `https://www.ssobig.com/playroom`으로 연결되는 안내 링크 `(클릭) 작품정보는 여기서 확인하세요`를 추가함.
- 해당 변경을 `Adjust playtest story card details link placement` (`d9e1ba7`)으로 `main`에 푸시해 운영 배포를 다시 트리거함.
- 운영 페이지가 새 릴리스(`sentry-release=d9e1ba7...`)를 서빙하면서도 브라우저가 예전 immutable 청크를 계속 쓰는 현상을 확인하고, `src/app/playroom/form/playtest/[locale]/PlaytestSignupFormV2.tsx`를 추가한 뒤 `page.tsx` import를 새 모듈로 바꿔 강제 캐시 버스트를 적용함.
- 캐시 버스트 변경을 `Bust cache for playtest form client bundle` (`41c4ad2`)으로 `main`에 푸시함.

**진행 중 (미완료)**:
- 운영 브라우저에서 캐시 버스트가 실제로 반영됐는지 최종 사용자 화면 확인 필요 — 현재 상태: 서버 응답과 라이브 JS 번들 기준으로는 새 링크 문구와 `상세보기` 제거가 확인됐지만, 사용자 캡처상 운영 화면은 여전히 예전 청크를 보여줌.
- 관련 파일: `src/app/playroom/form/playtest/[locale]/PlaytestSignupForm.tsx`, `src/app/playroom/form/playtest/[locale]/PlaytestSignupFormV2.tsx`, `src/app/playroom/form/playtest/[locale]/page.tsx`

**다음 세션에서 할 일**:
- 실제 사용자 브라우저에서 `https://www.ssobig.com/playroom/form/playtest/ko`가 새 청크를 받았는지 다시 확인하고, 여전히 이전 UI면 추가적인 캐시 무효화 전략(모듈 정리, 파일명 재구성, 재배포)을 검토.
- `PlaytestSignupFormV2.tsx`가 캐시 우회용 임시 복제 파일이므로, 운영 반영이 안정화되면 원본 파일로 다시 합치고 import를 정리.

### 2026-05-20 OG 썸네일 세션 마무리

**완료한 작업**:
- `/playroom` 링크 자체가 미리보기 메타를 낼 수 있도록 `src/app/playroom/page.tsx`를 서버 메타 래퍼로 바꾸고, 기존 클라이언트 구현을 `src/app/playroom/PlayroomPageClient.tsx`로 분리함. 이 변경은 `Add playroom and playtest social preview metadata` (`06d174e`)로 `main`에 푸시함.
- 플레이테스트 4개 링크(`/playroom/form/playtest/ko|en|ja|zh`)에 검은 배경 OG 이미지를 생성하는 `src/app/playroom/form/playtest/[locale]/opengraph-image.tsx`를 추가하고, `page.tsx` 메타가 해당 이미지를 바라보도록 구성함.
- 운영 확인 결과 `og:image`/`twitter:image` 메타와 `/playroom/form/playtest/ko/opengraph-image` 응답은 정상이나, 일부 앱에서 동적 OG URL 미리보기를 안정적으로 보여주지 않을 가능성을 확인함.
- 따라서 생성된 OG 이미지를 정적 PNG 자산 [playtest-preview.png](/Users/surin/Library/Mobile%20Documents/com~apple~CloudDocs/PROJECT/11_ssobig_home/public/ssobig_assets/playroom/playtest-preview.png)로 저장하고, 메타가 해당 정적 PNG를 직접 가리키도록 변경한 뒤 `Use static PNG for playtest social preview` (`aaf05e4`)로 `main`에 푸시함.

**진행 중 (미완료)**:
- 메신저/앱 링크 미리보기 캐시 반영 확인 필요 — 현재 상태: 운영 HTML 메타와 정적 PNG 경로는 정상 반영됐지만, 사용자 측 앱 미리보기는 앱별 캐시 때문에 즉시 안 바뀔 수 있음.
- 관련 파일: `src/app/playroom/page.tsx`, `src/app/playroom/PlayroomPageClient.tsx`, `src/app/playroom/form/playtest/[locale]/page.tsx`, `src/app/playroom/form/playtest/[locale]/opengraph-image.tsx`, `public/ssobig_assets/playroom/playtest-preview.png`

**다음 세션에서 할 일**:
- 실제 공유 대상 앱(카카오톡/슬랙/디스코드 등)에서 `https://www.ssobig.com/playroom/form/playtest/ko` 미리보기가 정적 PNG로 보이는지 확인.
- 앱 캐시가 계속 남아 있으면 쿼리스트링 없이도 새 파일명으로 교체하는 방식(`playtest-preview-v2.png`)을 검토.
- 동적 OG용 `opengraph-image.tsx`는 현재 정적 PNG fallback 이후 우선순위가 낮아졌으므로, 장기적으로 유지할지 정리할지 판단.

---

### 2026-05-16 세션 마무리

**완료한 작업**:
- 저장소를 최신 `origin/main`으로 동기화한 뒤, `src/app/offline/11namme/page.tsx`의 상단 스케줄 영역을 캘린더형에서 리스트형 성비 그래프 UI로 전면 개편함.
- 사용자 피드백에 맞춰 태그/그래프/텍스트 스케일을 반복 조정하고, 기본 6개 일정 + `일정 전체 보기` 토글, 마감 태그 정리, 범례 제거, 잔여 표기 단순화까지 반영함.
- `src/app/layout.tsx`에서 Google Fonts 의존성을 제거해 로컬 빌드가 되도록 수정하고, `src/components/day-nammae/apply/LoveBuddiesApplyFlow.tsx`의 `heic2any` 로딩을 런타임 fallback으로 바꿔 빌드 오류를 해소함.
- `npm run build` 검증 후 `Refine day nammae schedule summary UI` (`83e7791`) 커밋을 `main`에 푸시해 Vercel 자동 배포를 트리거함.

**진행 중 (미완료)**:
- Vercel 자동 배포 성공 여부 확인 — 현재 상태: `main` 푸시는 완료됐지만, 연결된 Vercel 권한이 팀 스코프 `surin-kims-projects`에 대해 `403 Forbidden`이라 Codex 쪽에서 배포 상태 조회는 못 함.
- 로컬 preview 안정화 확인 — 현재 상태: `3001`의 dev preview는 브라우저 캐시/Next chunk alias 문제로 반복적으로 꼬였고, `3010` production preview에서 확인하는 방식으로 우회해 둠.
- 관련 파일: `src/app/offline/11namme/page.tsx`, `src/app/layout.tsx`, `src/components/day-nammae/apply/LoveBuddiesApplyFlow.tsx`

**다음 세션에서 할 일**:
- 실제 운영 배포본에서 `/offline/11namme` 스케줄 UI가 의도대로 보이는지 모바일 기준으로 최종 확인.
- 필요하면 그래프/태그 스케일을 한 번 더 줄이거나, `일정 전체 보기` 버튼 시각 강조를 재조정.
- 로컬 확인이 다시 필요하면 `npm run build` 후 `npx next start -H 0.0.0.0 -p 3010`로 production preview를 사용하는 쪽을 우선 권장.

---

### 2026-04-20 세션 마무리

**완료한 작업**:
- 로컬 변경을 버리고 저장소를 `origin/main` 최신 상태로 동기화함.
- `src/components/day-nammae/DayNammeApplyFlow.tsx`에서 신청서 제출 시 `_fbp` 쿠키를 읽어 `fbp` 필드로 함께 전송하도록 수정함.
- 대상 파일 기준 `npm run lint -- --file src/components/day-nammae/DayNammeApplyFlow.tsx` 검증 후 `09bea0f` 커밋을 `main`에 푸시함.

**진행 중 (미완료)**:
- 없음.

**다음 세션에서 할 일**:
- 실제 광고 유입 환경에서 신청서 요청 payload에 `fbp`가 포함되는지 네트워크 탭 또는 서버 로그로 한 번 확인.
- 필요하면 동일한 전환 추적 파라미터 적용 범위를 다른 신청/설문 경로까지 확장 검토.

---

## 작업 가이드 (새 스레드에서 참고)

1. 이 파일(`progress.md`)을 먼저 읽고 현재 진행 상황 파악
2. `CLAUDE.md`에서 프로젝트 구조 및 컨벤션 확인
3. `git status`와 `git log`로 최신 상태 확인
4. "진행 중인 작업" 섹션의 체크리스트를 이어서 진행
5. 작업 완료 시 이 파일 업데이트
