---
version: "alpha"
name: "ssobig Warm Dark Form"
description: "A focused warm-dark form design system derived from ssobig's 11namme survey flow."
colors:
  primary: "#FF7A59"
  on-primary: "#050505"
  primary-soft: "#FFB38A"
  background: "#050505"
  surface: "#151515"
  surface-raised: "#101010"
  surface-notice: "#120C0A"
  text-primary: "#FFFFFF"
  text-body: "#CFCFCF"
  text-muted: "#8C8C8C"
  text-placeholder: "#8C8C8C"
  text-error: "#FFD3C4"
  disabled: "#7F4A3A"
typography:
  page-title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: "1.05"
    letterSpacing: "0px"
  form-title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "1.25"
    letterSpacing: "0px"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.75"
    letterSpacing: "0px"
  helper:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5rem"
    letterSpacing: "0px"
  label-caps:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: "1rem"
    letterSpacing: "0.24em"
rounded:
  sm: "12px"
  md: "16px"
  lg: "28px"
  xl: "32px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "32px"
  "4xl": "56px"
components:
  page-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    padding: "56px 20px"
  header-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  section-label:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary-soft}"
    typography: "{typography.label-caps}"
  meta-label:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-muted}"
    typography: "{typography.helper}"
  form-section:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "20px"
  score-button:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.sm}"
    height: "44px"
  score-button-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    height: "44px"
  choice-chip:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  choice-chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  textarea:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "16px"
  textarea-placeholder:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-placeholder}"
    rounded: "{rounded.md}"
    padding: "16px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    height: "56px"
  button-primary-disabled:
    backgroundColor: "{colors.disabled}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    height: "56px"
  state-panel:
    backgroundColor: "{colors.surface-notice}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "32px"
  inline-error:
    backgroundColor: "{colors.surface-notice}"
    textColor: "{colors.text-error}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
---

## Overview

ssobig Warm Dark Form is a focused form interface for surveys, playtest recruitment, coupon registration, and permission-request flows. It uses a near-black canvas, translucent layered surfaces, and a warm coral accent to keep the experience concentrated without feeling cold.

Use this design system when the user needs to complete a single, deliberate task: answer a survey, apply for a tester group, register a coupon, or confirm a personal event link.

Do not use it as the default style for broad marketing pages, portfolio pages, or image-heavy brand landing pages. Those pages should follow the existing ssobig site structure unless the task is explicitly form-centered.

Primary implementation references:

- `src/app/design-system/page.tsx`
- `src/app/offline/11namme/survey/[applicationId]/SurveyPageClient.tsx`
- `src/components/GlobalNav.tsx`

## Colors

The palette is intentionally narrow. The UI should read as warm dark, not blue-black, purple-gradient, or generic SaaS gray.

- **Background (`#050505`)**: the full-page canvas. Use for the outer page shell.
- **Surface (`#151515`)**: the approximate solid equivalent of the current translucent card surface. In Tailwind implementation, `bg-white/[0.04]` may be used on top of the black canvas.
- **Surface Raised (`#101010`)**: the approximate solid equivalent of `bg-black/30`; use for meta cards, textareas, and unselected controls.
- **Primary (`#FF7A59`)**: the only high-emphasis interaction color. Use for selected controls, focus borders, and the primary CTA.
- **On Primary (`#050505`)**: the accessibility-safe text color for new components placed on Primary. The current survey implementation uses white text on the coral accent; new UI should prefer this darker token unless brand review explicitly keeps white.
- **Primary Soft (`#FFB38A`)**: small labels and section eyebrows only.
- **Surface Notice (`#120C0A`)**: error, already-submitted, and warning state panels.
- **Text Primary (`#FFFFFF`)**: headings and selected values.
- **Text Body (`#CFCFCF`)**: body copy and unselected controls.
- **Text Muted (`#8C8C8C`)**: metadata, endpoint labels, helper ranges.
- **Text Placeholder (`#8C8C8C`)**: textarea placeholder copy.
- **Text Error (`#FFD3C4`)**: inline error text.
- **Disabled (`#7F4A3A`)**: disabled primary CTA background.

When implementing with Tailwind, the existing form may continue using alpha utilities such as `text-white/72`, `text-white/60`, `border-white/10`, `bg-white/[0.04]`, and `bg-black/30`. Treat the YAML colors as the canonical solid-token approximation and the prose as the application rule.

## Typography

Typography should stay calm and utilitarian. The form should feel like a guided product surface, not a marketing hero.

- **Page title**: `text-3xl md:text-5xl font-semibold tracking-tight` for actual forms. It is used sparingly at the top of the flow.
- **Design page title**: `text-4xl md:text-6xl font-semibold tracking-tight` is allowed only for documentation or design-system preview pages.
- **Form title**: `text-xl md:text-2xl font-semibold` for question titles.
- **Body**: `text-base md:text-lg leading-7 text-white/72` for human-facing introduction copy.
- **Helper**: `text-sm leading-6 text-white/60` for instructions, scoring ranges, and explanations.
- **Label caps**: `text-xs font-semibold uppercase tracking-[0.24em] text-[#FFB38A]` for `Q1`, `States`, `Colors`, and similar short labels.

Do not use negative letter spacing. Use letter spacing only for short uppercase labels. Keep button text at `text-base font-semibold` for primary actions and `text-sm font-medium` for chips.

## Layout

Actual form pages should be narrow and vertically focused.

Recommended form shell:

```tsx
<div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
  <div className="relative mx-auto max-w-3xl px-5 py-14 md:py-20">
    ...
  </div>
</div>
```

Rules:

- Keep real forms within `max-w-3xl`, even on desktop.
- Use `px-5` on mobile so the form has enough side breathing room.
- Use `space-y-5` between question sections.
- Use `gap-3` between score buttons and choice chips.
- Use `break-keep` and explicit line-height on Korean copy.
- Use `min-h-14` for full-width submit buttons.
- Avoid nested page-section cards. Use cards only for actual contained UI units such as a question section, status panel, or repeated preview item.

Documentation or design-system pages may use a wider `max-w-6xl` layout with a sticky side navigation:

```tsx
<div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
  <header className="grid gap-6 border-b border-white/10 pb-10 md:grid-cols-[1fr_340px] md:items-end">
    ...
  </header>
  <div className="mt-8 grid gap-5 lg:grid-cols-[260px_1fr]">
    ...
  </div>
</div>
```

## Elevation & Depth

Depth is created through tonal layering, borders, and sparse shadows.

- Use `border-white/10` for most card boundaries.
- Use `bg-white/[0.04]` for large sections and header cards.
- Use `bg-black/30` for inner controls and compact metadata.
- Use `shadow-[0_24px_80px_rgba(0,0,0,0.25)]` only for top-level cards or state panels.
- Use `shadow-[0_12px_30px_rgba(255,122,89,0.25)]` only for selected choice chips.

Do not add decorative card stacks, heavy elevation systems, or nested cards inside cards. If a section needs separation, prefer a border-top band or simple spacing.

## Shapes

The system uses soft but not playful rounding.

- **Large card**: `rounded-[28px]` for header cards and question sections.
- **State panel**: `rounded-[32px]` for loading, error, and submitted panels.
- **Control**: `rounded-xl` for compact score buttons.
- **Chip/Input/CTA**: `rounded-2xl` for choice chips, textareas, and submit buttons.

Avoid pill buttons for form choices unless the option is extremely short and the surrounding system already uses pills. Current survey controls use rounded rectangles because they need larger text targets and clear selected states.

## Components

### Header Context Card

Use at the top of a personal form link to confirm context.

```tsx
<div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-8">
  ...
</div>
```

Show compact metadata such as link type, participant, and schedule:

```tsx
<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
  <p className="text-xs text-white/45">회차</p>
  <p className="mt-2 text-sm font-medium text-white">일일남매</p>
</div>
```

### Form Section

Use one section per question.

```tsx
<section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">Q1</p>
  <h2 className="text-xl font-semibold text-white md:text-2xl">질문 제목</h2>
  <p className="mt-2 text-sm leading-6 text-white/60">질문 설명</p>
  ...
</section>
```

Question titles should be complete, human-readable questions. Put scoring rules and input requirements in helper text.

### Score Button

Use for radio-like numeric scoring.

```tsx
className={`flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition ${
  selected
    ? "border-[#FF7A59] bg-[#FF7A59] text-white"
    : "border-white/15 bg-white/[0.03] text-white/80 hover:border-white/30 hover:bg-white/[0.06]"
}`}
```

Grid rules:

- 1-5 score: `grid grid-cols-5 gap-3`
- 0-10 score: `grid grid-cols-6 gap-3 md:grid-cols-11`

### Choice Chip

Use for checkbox-like multi-select controls.

```tsx
className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
  selected
    ? "border-[#FF7A59] bg-[#FF7A59] text-white shadow-[0_12px_30px_rgba(255,122,89,0.25)]"
    : "border-white/15 bg-white/[0.03] text-white/78 hover:border-white/30 hover:bg-white/[0.06]"
}`}
```

Rules:

- Mobile: one column.
- Desktop: two columns when options are short.
- Selected state must change both background and border.
- Use `aria-pressed` when implementing as a button.

### Textarea

Use for free text and "Other" details.

```tsx
className="h-44 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-[#FF7A59]"
```

Rules:

- Other detail: `h-28`
- Free response: `h-44`
- Use Accent only on focus border.
- Keep placeholder copy practical and short.

### Primary CTA

Use for the final form action.

```tsx
className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#FF7A59] px-6 text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#7F4A3A] disabled:text-white/55"
```

Rules:

- Only one primary CTA per form page.
- Disable until required fields are valid.
- Use action-oriented copy: `설문 제출하기`, `신청 완료하기`, `쿠폰 등록하기`.

### State Panel

Use for loading, error, already-submitted, and completed states.

```tsx
<div className="rounded-[32px] border border-[#FF7A59]/25 bg-[#120C0A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
  ...
</div>
```

Loading states may use:

```tsx
<div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#FF7A59]" />
```

## Do's and Don'ts

### Do

- Use the warm coral Accent for selected states, focus, and the final CTA.
- Keep real forms narrow and vertically readable.
- Use explicit selected, disabled, error, and submitted states.
- Use Korean copy that explains the next action, not just the error state.
- Keep controls large enough for mobile touch.
- Keep the page dark navigation mode for `/design-system` and form-like dark pages.
- Use `robots: { index: false, follow: false }` for private or internal form/system pages.

### Don't

- Do not turn this into a generic dark dashboard style.
- Do not introduce purple-blue gradients, decorative orbs, or unrelated hero imagery.
- Do not place cards inside cards unless the inner card is a real repeated item or control group.
- Do not use multiple competing CTA colors.
- Do not use tiny native radio or checkbox controls when the flow needs large touch targets.
- Do not widen form pages just because the viewport is wide.
- Do not write vague button copy such as `Submit` or `Next` when a concrete Korean action is possible.

## Copy Rules

Questions should be complete and specific.

Good:

- `일일남매 경험에 전반적으로 얼마나 만족하셨나요?`
- `주변 지인에게 일일남매를 추천할 의향이 있으신가요?`

Avoid:

- `만족도`
- `추천 의향`

Helper text should explain the required action or scoring scale:

- `1점은 매우 불만족, 5점은 매우 만족입니다.`
- `해당되는 항목을 모두 선택해 주세요.`

Error copy should tell the user what to check or do next:

- `설문 링크를 확인해 주세요`
- `기타 경로를 입력해 주세요`
- `설문 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.`

## Responsive Behavior

| Element | Mobile | Desktop |
| --- | --- | --- |
| Form container | `px-5`, one column | `max-w-3xl`, one column |
| 1-5 score | `grid-cols-5` | `grid-cols-5` |
| 0-10 score | `grid-cols-6` | `md:grid-cols-11` |
| Choice chips | one column | `md:grid-cols-2` when options are short |
| Header metadata | one column | `md:grid-cols-3` |
| Design-system docs | one column | `lg:grid-cols-[260px_1fr]` |

Check long Korean labels on mobile. Text may wrap, but it must not overflow its parent or shift neighboring controls unexpectedly.

## Implementation Notes

This file should live at the repository root as `DESIGN.md`. For agents that do not automatically read it, reference `./DESIGN.md` from `AGENTS.md` or project-level instructions.

Use the official DESIGN.md CLI when available:

```bash
npx @google/design.md lint DESIGN.md
npx @google/design.md diff DESIGN.md DESIGN-v2.md
npx @google/design.md export --format css-tailwind DESIGN.md
```

The current design system preview page is implemented at:

```txt
src/app/design-system/page.tsx
```

Potential future component extraction targets:

1. `FormPageShell`
2. `FormHeaderCard`
3. `FormSection`
4. `ScoreButton`
5. `ChoiceChip`
6. `FormTextarea`
7. `PrimarySubmitButton`
8. `FormStatePanel`

Do not extract these prematurely. Extract them when the playtest signup form or coupon form repeats the same patterns.
