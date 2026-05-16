import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "일일남매 설문 폼을 기준으로 정리한 쏘빅 폼 디자인 시스템 검토 페이지입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

const colors = [
  {
    name: "Canvas",
    value: "#050505",
    usage: "전체 페이지 배경",
    className: "bg-[#050505]",
  },
  {
    name: "Surface",
    value: "rgba(255,255,255,0.04)",
    usage: "섹션 카드, 헤더 카드",
    className: "bg-white/[0.04]",
  },
  {
    name: "Raised",
    value: "rgba(0,0,0,0.30)",
    usage: "메타 정보, 입력 내부 배경",
    className: "bg-black/30",
  },
  {
    name: "Accent",
    value: "#FF7A59",
    usage: "선택 상태, 주요 CTA, 포커스",
    className: "bg-[#FF7A59]",
  },
  {
    name: "Accent Soft",
    value: "#FFB38A",
    usage: "스텝 라벨, 보조 강조",
    className: "bg-[#FFB38A]",
  },
  {
    name: "Warm Notice",
    value: "#120C0A",
    usage: "완료, 오류, 주의 상태",
    className: "bg-[#120C0A]",
  },
];

const typography = [
  {
    name: "Page Title",
    sample: "일일남매 설문조사",
    className: "text-3xl md:text-5xl font-semibold tracking-tight",
    usage: "페이지 최상단 제목",
  },
  {
    name: "Section Title",
    sample: "콘텐츠의 전반적 흐름은 어떠셨나요?",
    className: "text-xl md:text-2xl font-semibold",
    usage: "폼 질문 제목",
  },
  {
    name: "Step Label",
    sample: "Q1",
    className: "text-xs font-semibold uppercase tracking-[0.24em]",
    usage: "섹션 순서와 타입 표시",
  },
  {
    name: "Body",
    sample: "솔직한 의견을 부탁드려요.",
    className: "text-base md:text-lg leading-7 text-white/72",
    usage: "안내 문장",
  },
  {
    name: "Helper",
    sample: "1점은 매우 불만족, 5점은 매우 만족입니다.",
    className: "text-sm leading-6 text-white/60",
    usage: "질문 설명과 보조 정보",
  },
];

const spacing = [
  ["Page width", "max-w-3xl", "설문/폼은 폭을 좁혀 한 줄 읽기 부담을 낮춤"],
  ["Page padding", "px-5 py-14 md:py-20", "모바일 여백 우선, 데스크톱 상하 여백 확장"],
  ["Header card", "p-6 md:p-8", "상단 맥락 카드"],
  ["Question card", "p-5 md:p-7", "각 질문 섹션"],
  ["Card radius", "rounded-[28px] / rounded-[32px]", "큰 컨테이너"],
  ["Control radius", "rounded-xl / rounded-2xl", "버튼, 칩, 입력"],
];

const designMdSections = [
  "Purpose: 이 시스템이 해결하는 제품 경험과 사용 범위",
  "Principles: 다크 캔버스, 따뜻한 액센트, 집중형 폼 흐름",
  "Tokens: 색상, 타이포그래피, 간격, 반경, 그림자",
  "Components: Header, Section, Score, Choice, Textarea, CTA, State",
  "States: Loading, Empty, Error, Disabled, Selected, Submitted",
  "Copy Rules: 질문 문장, 도움말, 오류/완료 메시지 작성 기준",
  "Implementation Notes: Tailwind 클래스와 재사용 컴포넌트 후보",
];

function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-white/10 py-8 md:py-10">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
          {eyebrow}
        </p>
        <h2 className="text-xl font-semibold text-white md:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 break-keep text-sm leading-6 text-white/60">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function CodePill({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/70">
      {children}
    </code>
  );
}

function ScoreButton({
  value,
  selected = false,
}: {
  value: number;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition ${
        selected
          ? "border-[#FF7A59] bg-[#FF7A59] text-white"
          : "border-white/15 bg-white/[0.03] text-white/80"
      }`}
    >
      {value}
    </button>
  );
}

function ChoiceChip({
  children,
  selected = false,
}: {
  children: React.ReactNode;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
        selected
          ? "border-[#FF7A59] bg-[#FF7A59] text-white shadow-[0_12px_30px_rgba(255,122,89,0.25)]"
          : "border-white/15 bg-white/[0.03] text-white/78"
      }`}
    >
      {children}
    </button>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <header className="grid gap-6 border-b border-white/10 pb-10 md:grid-cols-[1fr_340px] md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-[#FFB38A]">
              ssobig Form Design System
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              설문 폼에서 시작하는 따뜻한 다크 인터페이스
            </h1>
            <p className="mt-5 max-w-2xl break-keep text-base leading-7 text-white/72 md:text-lg">
              현재 일일남매 설문조사 폼의 시각 언어를 기준으로 색상, 간격,
              컴포넌트, 상태 표현을 한 화면에 모았습니다. 이 페이지가 승인되면
              같은 구조로 `design.md` 문서를 만들 수 있습니다.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
            <p className="text-xs text-white/45">Source Pattern</p>
            <p className="mt-2 text-sm font-medium text-white">
              /offline/11namme/survey/[applicationId]
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="text-xs text-white/45">Base</p>
                <p className="mt-2 text-sm font-semibold text-white">Form</p>
              </div>
              <div>
                <p className="text-xs text-white/45">Tone</p>
                <p className="mt-2 text-sm font-semibold text-white">Warm Dark</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
              Contents
            </p>
            <nav className="mt-4 grid gap-2 text-sm text-white/70">
              {[
                "Principles",
                "Colors",
                "Typography",
                "Layout",
                "Components",
                "States",
                "Design.md",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(".", "")}`}
                  className="rounded-xl px-3 py-2 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-5">
            <SectionShell
              eyebrow="Principles"
              title="경험 원칙"
              description="현재 설문 폼에서 유지해야 할 핵심 방향입니다."
            >
              <div
                id="principles"
                className="grid gap-3 md:grid-cols-3"
              >
                {[
                  ["집중", "선택지는 크고 명확하게, 한 화면에는 하나의 질문 흐름만 강조합니다."],
                  ["따뜻함", "검은 배경 위에 오렌지 계열 액센트를 사용해 차갑지 않은 인상을 만듭니다."],
                  ["확신", "제출 가능/불가, 선택됨, 완료 상태가 한눈에 구분되어야 합니다."],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <h3 className="text-base font-semibold text-white">
                      {title}
                    </h3>
                    <p className="mt-2 break-keep text-sm leading-6 text-white/58">
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </SectionShell>

            <SectionShell
              eyebrow="Colors"
              title="컬러 토큰"
              description="다크 캔버스, 반투명 표면, 따뜻한 액센트의 조합을 기본으로 둡니다."
            >
              <div id="colors" className="grid gap-3 md:grid-cols-2">
                {colors.map((color) => (
                  <div
                    key={color.name}
                    className="grid grid-cols-[72px_1fr] gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div
                      className={`h-16 rounded-2xl border border-white/10 ${color.className}`}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">
                          {color.name}
                        </h3>
                        <CodePill>{color.value}</CodePill>
                      </div>
                      <p className="mt-2 text-sm text-white/58">{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionShell>

            <SectionShell
              eyebrow="Typography"
              title="타이포그래피"
              description="큰 제목은 절제하고, 질문 제목과 보조 설명의 위계를 안정적으로 유지합니다."
            >
              <div id="typography" className="space-y-3">
                {typography.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB38A]">
                      {item.name}
                    </p>
                    <p className={`mt-3 text-white ${item.className}`}>
                      {item.sample}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <CodePill>{item.className}</CodePill>
                      <span className="text-xs text-white/45">{item.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionShell>

            <SectionShell
              eyebrow="Layout"
              title="간격과 컨테이너"
              description="폼은 좁고 깊게, 내부 선택지는 충분한 터치 타겟을 확보합니다."
            >
              <div id="layout" className="grid gap-3 md:grid-cols-2">
                {spacing.map(([name, token, usage]) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="mt-2 text-sm text-white/58">{usage}</p>
                    <div className="mt-3">
                      <CodePill>{token}</CodePill>
                    </div>
                  </div>
                ))}
              </div>
            </SectionShell>

            <SectionShell
              eyebrow="Components"
              title="폼 컴포넌트"
              description="현재 설문 폼의 핵심 컨트롤을 문서화 가능한 형태로 재현했습니다."
            >
              <div id="components" className="space-y-5">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
                    Q1
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    만족도를 선택해주세요.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    1점은 매우 불만족, 5점은 매우 만족입니다.
                  </p>
                  <div className="mt-5 grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <ScoreButton key={value} value={value} selected={value === 4} />
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <ChoiceChip>공식 인스타그램</ChoiceChip>
                  <ChoiceChip selected>지인 추천</ChoiceChip>
                  <ChoiceChip>블로그·카페</ChoiceChip>
                  <ChoiceChip>기타</ChoiceChip>
                </div>

                <textarea
                  readOnly
                  value="좋았던 점, 아쉬웠던 점, 다음 회차에 바라는 점을 편하게 적는 영역입니다."
                  className="h-32 w-full resize-none rounded-2xl border border-white/12 bg-black/30 px-4 py-4 text-sm leading-6 text-white outline-none"
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    className="flex min-h-14 items-center justify-center rounded-2xl bg-[#FF7A59] px-6 text-base font-semibold text-white transition"
                  >
                    설문 제출하기
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex min-h-14 cursor-not-allowed items-center justify-center rounded-2xl bg-[#7F4A3A] px-6 text-base font-semibold text-white/55"
                  >
                    필수 항목을 입력해주세요
                  </button>
                </div>
              </div>
            </SectionShell>

            <SectionShell
              eyebrow="States"
              title="상태 패턴"
              description="설문 링크의 로딩, 오류, 제출 완료 상태는 같은 형태의 큰 피드백 패널로 처리합니다."
            >
              <div id="states" className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-center">
                  <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-white/10 border-t-[#FF7A59]" />
                  <p className="text-sm font-semibold text-white">Loading</p>
                  <p className="mt-2 text-xs leading-5 text-white/50">
                    설문 정보를 불러오는 중
                  </p>
                </div>
                <div className="rounded-2xl border border-[#FF7A59]/25 bg-[#120C0A] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB38A]">
                    Error
                  </p>
                  <p className="mt-3 text-sm font-semibold text-white">
                    설문 링크를 확인해 주세요
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/55">
                    유효한 설문 대상 신청 정보를 찾지 못했습니다.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#FF7A59]/20 bg-[#120C0A] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB38A]">
                    Submitted
                  </p>
                  <p className="mt-3 text-sm font-semibold text-white">
                    설문이 이미 제출되었습니다
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/55">
                    같은 신청 건으로는 한 번만 제출할 수 있어요.
                  </p>
                </div>
              </div>
            </SectionShell>

            <SectionShell
              eyebrow="Design.md"
              title="추후 문서화 목차"
              description="페이지 승인 후 이 구조를 `design.md`로 옮기면 됩니다."
            >
              <ol id="designmd" className="grid gap-2">
                {designMdSections.map((section, index) => (
                  <li
                    key={section}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF7A59] text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="break-keep leading-6">{section}</span>
                  </li>
                ))}
              </ol>
            </SectionShell>
          </div>
        </div>
      </div>
    </div>
  );
}
