"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { PlaytestLocale } from "../locales";

type FormState = {
  name: string;
  email: string;
  country: string;
  timezone: string;
  languages: string[];
  platform: string;
  device: string;
  groupSize: string;
  experience: string;
  source: string[];
  sourceOther: string;
  motivation: string;
  consent: boolean;
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; dryRun?: boolean }
  | { status: "error"; message: string };

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  country: "",
  timezone: "",
  languages: ["en-US"],
  platform: "",
  device: "",
  groupSize: "",
  experience: "",
  source: [],
  sourceOther: "",
  motivation: "",
  consent: false,
};

const LANGUAGE_OPTIONS = ["en-US", "es-ES", "ja-JP", "zh-CN", "ko-KR"];

const content = {
  en: {
    eyebrow: "SSOBIG PLAYROOM",
    title: "Overseas playtest signup",
    intro:
      "Help us test English-first story mystery games before the overseas launch. Selected testers will receive a free play coupon by email.",
    sourcePattern: "Playtest form",
    rewardLabel: "Reward",
    rewardValue: "Free play coupon",
    formatLabel: "Format",
    formatValue: "Web · Android · iOS",
    estimateLabel: "Time",
    estimateValue: "3-5 minutes",
    sections: {
      profile: {
        step: "Q1",
        title: "How can we contact you?",
        description: "We will only use this email for playtest access and follow-up.",
      },
      languages: {
        step: "Q2",
        title: "Which language versions would you like to test?",
        description: "Pick every language you can comfortably evaluate.",
      },
      access: {
        step: "Q3",
        title: "Where will you play?",
        description: "This helps us prepare platform-specific instructions.",
      },
      experience: {
        step: "Q4",
        title: "What kind of mystery-game player are you?",
        description: "Choose the closest option.",
      },
      source: {
        step: "Q5",
        title: "Where did you hear about this playtest?",
        description: "Select every channel that applies.",
      },
      motivation: {
        step: "Q6",
        title: "What would you like to help us evaluate?",
        description: "Short notes are enough.",
      },
    },
    labels: {
      name: "Name or nickname",
      email: "Email",
      country: "Country or region",
      timezone: "Timezone",
      device: "Device / browser",
      sourceOther: "Other channel",
      motivation: "Notes",
      consent:
        "I agree to receive playtest access, coupons, and follow-up emails from SsoBig.",
      submit: "Apply for playtest",
      submitting: "Submitting...",
    },
    placeholders: {
      name: "Alex",
      email: "alex@example.com",
      country: "United States",
      timezone: "Pacific Time, CET, JST...",
      device: "iPhone 15, Pixel 8, Chrome on Windows...",
      sourceOther: "Tell us where",
      motivation:
        "Example: translation clarity, pacing, onboarding, group play, payment flow...",
    },
    platformOptions: ["Web", "Android app", "iOS app", "Not sure yet"],
    groupOptions: ["Solo check", "2-3 people", "4-6 people", "7+ people"],
    experienceOptions: [
      "New to murder mystery",
      "Played digital mystery games",
      "Played tabletop murder mystery",
      "Hosted games before",
    ],
    sourceOptions: ["Reddit", "Discord", "Facebook group", "BoardGameGeek", "Friend", "Other"],
    validation: {
      required: "Please fill in the required fields.",
      email: "Please enter a valid email address.",
      consent: "Please agree to receive playtest access emails.",
      sourceOther: "Please tell us the other channel.",
      generic: "We could not submit your signup. Please try again later.",
    },
    successTitle: "Signup received",
    successBody:
      "Thanks. If you are selected, we will send play access and coupon instructions by email.",
    dryRunNote:
      "Preview mode: the form UI is working, but the production collection endpoint is not connected yet.",
  },
  ko: {
    eyebrow: "SSOBIG PLAYROOM",
    title: "해외 플레이테스트 신청",
    intro:
      "쏘빅의 영어권 스토리 추리게임 출시 전에 먼저 플레이해보고 의견을 남겨주세요. 선정된 테스터에게는 무료 플레이 쿠폰을 이메일로 보내드립니다.",
    sourcePattern: "Playtest form",
    rewardLabel: "리워드",
    rewardValue: "무료 플레이 쿠폰",
    formatLabel: "형태",
    formatValue: "웹 · Android · iOS",
    estimateLabel: "소요 시간",
    estimateValue: "3-5분",
    sections: {
      profile: {
        step: "Q1",
        title: "연락받을 정보를 알려주세요.",
        description: "플레이 권한과 후속 안내 이메일 발송에만 사용합니다.",
      },
      languages: {
        step: "Q2",
        title: "어떤 언어 버전을 테스트할 수 있나요?",
        description: "평가 가능한 언어를 모두 선택해주세요.",
      },
      access: {
        step: "Q3",
        title: "어떤 환경에서 플레이할 예정인가요?",
        description: "플랫폼별 안내를 준비하기 위한 질문입니다.",
      },
      experience: {
        step: "Q4",
        title: "추리게임 경험은 어느 쪽에 가까운가요?",
        description: "가장 가까운 항목을 선택해주세요.",
      },
      source: {
        step: "Q5",
        title: "이 플레이테스트를 어디에서 알게 되었나요?",
        description: "해당되는 채널을 모두 선택해주세요.",
      },
      motivation: {
        step: "Q6",
        title: "어떤 부분을 중점적으로 봐주고 싶나요?",
        description: "짧게 적어주셔도 충분합니다.",
      },
    },
    labels: {
      name: "이름 또는 닉네임",
      email: "이메일",
      country: "국가 또는 지역",
      timezone: "시간대",
      device: "기기 / 브라우저",
      sourceOther: "기타 채널",
      motivation: "메모",
      consent:
        "쏘빅의 플레이테스트 권한, 쿠폰, 후속 안내 이메일 수신에 동의합니다.",
      submit: "플레이테스트 신청하기",
      submitting: "신청 제출 중...",
    },
    placeholders: {
      name: "Alex",
      email: "alex@example.com",
      country: "United States",
      timezone: "Pacific Time, CET, JST...",
      device: "iPhone 15, Pixel 8, Windows Chrome...",
      sourceOther: "알게 된 경로를 적어주세요",
      motivation:
        "예: 번역 자연스러움, 진행 흐름, 첫 진입 경험, 그룹 플레이, 결제 흐름 등",
    },
    platformOptions: ["Web", "Android 앱", "iOS 앱", "아직 모르겠음"],
    groupOptions: ["혼자 확인", "2-3명", "4-6명", "7명 이상"],
    experienceOptions: [
      "머더미스터리는 처음",
      "디지털 추리게임 경험 있음",
      "오프라인/보드게임형 머더미스터리 경험 있음",
      "게임 진행/호스트 경험 있음",
    ],
    sourceOptions: ["Reddit", "Discord", "Facebook 그룹", "BoardGameGeek", "지인 추천", "기타"],
    validation: {
      required: "필수 항목을 입력해주세요.",
      email: "올바른 이메일 주소를 입력해주세요.",
      consent: "플레이테스트 안내 이메일 수신에 동의해주세요.",
      sourceOther: "기타 채널을 입력해주세요.",
      generic: "신청을 제출하지 못했습니다. 잠시 후 다시 시도해주세요.",
    },
    successTitle: "신청이 접수되었습니다",
    successBody:
      "감사합니다. 선정되면 플레이 권한과 쿠폰 안내를 이메일로 보내드리겠습니다.",
    dryRunNote:
      "미리보기 모드: 폼 UI는 동작하지만 운영 수집 엔드포인트는 아직 연결되지 않았습니다.",
  },
} as const;

function toggleOption(values: string[], option: string) {
  return values.includes(option)
    ? values.filter((value) => value !== option)
    : [...values, option];
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-white/80">{children}</label>;
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      autoComplete={autoComplete}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="mt-2 h-12 w-full rounded-2xl border border-white/12 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-[#FF7A59]"
    />
  );
}

function ChoiceChip({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
        selected
          ? "border-[#FF7A59] bg-[#FF7A59] text-[#050505] shadow-[0_12px_30px_rgba(255,122,89,0.25)]"
          : "border-white/15 bg-white/[0.03] text-white/78 hover:border-white/30 hover:bg-white/[0.06]"
      }`}
    >
      {label}
    </button>
  );
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
          {step}
        </p>
        <h2 className="break-keep text-xl font-semibold text-white md:text-2xl">
          {title}
        </h2>
        <p className="mt-2 break-keep text-sm leading-6 text-white/60">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

export default function PlaytestSignupForm({
  locale,
}: {
  locale: PlaytestLocale;
}) {
  const copy = content[locale];
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const requiresSourceOther = form.source.includes("Other") || form.source.includes("기타");

  const validationError = useMemo(() => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.country.trim() ||
      form.languages.length === 0 ||
      !form.platform ||
      !form.groupSize ||
      !form.experience ||
      form.source.length === 0
    ) {
      return copy.validation.required;
    }
    if (!isValidEmail(form.email)) return copy.validation.email;
    if (requiresSourceOther && !form.sourceOther.trim()) {
      return copy.validation.sourceOther;
    }
    if (!form.consent) return copy.validation.consent;
    return "";
  }, [copy, form, requiresSourceOther]);

  const canSubmit = !validationError && submitState.status !== "submitting";

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setSubmitState({ status: "error", message: validationError });
      return;
    }

    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/api/playroom/playtest/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          ...form,
          pageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; dryRun?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || copy.validation.generic);
      }

      setSubmitState({ status: "success", dryRun: payload.dryRun });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: error instanceof Error ? error.message : copy.validation.generic,
      });
    }
  };

  if (submitState.status === "success") {
    return (
      <div className="min-h-screen bg-[#050505] px-5 py-16 text-white md:py-24">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
          <div className="w-full rounded-[32px] border border-[#FF7A59]/20 bg-[#120C0A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
              Playtest Signup
            </p>
            <h1 className="mt-4 break-keep text-3xl font-semibold text-white md:text-5xl">
              {copy.successTitle}
            </h1>
            <p className="mt-4 break-keep text-base leading-7 text-white/72">
              {copy.successBody}
            </p>
            {submitState.dryRun ? (
              <p className="mt-5 rounded-2xl border border-[#FF7A59]/25 bg-black/30 px-4 py-3 text-sm leading-6 text-[#FFD3C4]">
                {copy.dryRunNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-0 h-[420px] w-[420px] rounded-full bg-[#FF7A59]/12 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-10%] h-[360px] w-[360px] rounded-full bg-[#FFD15C]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 py-14 md:py-20">
        <header className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <Image
              src="/ssobig_assets/Logo/logo=ssobig, color=white.png"
              alt="SsoBig"
              width={96}
              height={35}
              className="h-auto w-24"
              unoptimized
            />
            <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-white/60">
              {locale === "ko" ? "KO" : "EN"}
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFB38A]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 break-keep text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 break-keep text-base leading-7 text-white/72 md:text-lg">
            {copy.intro}
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-white/45">{copy.rewardLabel}</p>
              <p className="mt-2 text-sm font-medium text-white">
                {copy.rewardValue}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-white/45">{copy.formatLabel}</p>
              <p className="mt-2 text-sm font-medium text-white">
                {copy.formatValue}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-white/45">{copy.estimateLabel}</p>
              <p className="mt-2 text-sm font-medium text-white">
                {copy.estimateValue}
              </p>
            </div>
          </div>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Section {...copy.sections.profile}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>{copy.labels.name}</FieldLabel>
                <TextInput
                  value={form.name}
                  onChange={(value) => update("name", value)}
                  placeholder={copy.placeholders.name}
                  autoComplete="name"
                />
              </div>
              <div>
                <FieldLabel>{copy.labels.email}</FieldLabel>
                <TextInput
                  value={form.email}
                  onChange={(value) => update("email", value)}
                  placeholder={copy.placeholders.email}
                  type="email"
                  autoComplete="email"
                />
              </div>
              <div>
                <FieldLabel>{copy.labels.country}</FieldLabel>
                <TextInput
                  value={form.country}
                  onChange={(value) => update("country", value)}
                  placeholder={copy.placeholders.country}
                  autoComplete="country-name"
                />
              </div>
              <div>
                <FieldLabel>{copy.labels.timezone}</FieldLabel>
                <TextInput
                  value={form.timezone}
                  onChange={(value) => update("timezone", value)}
                  placeholder={copy.placeholders.timezone}
                />
              </div>
            </div>
          </Section>

          <Section {...copy.sections.languages}>
            <div className="grid gap-3 md:grid-cols-2">
              {LANGUAGE_OPTIONS.map((option) => (
                <ChoiceChip
                  key={option}
                  label={option}
                  selected={form.languages.includes(option)}
                  onClick={() =>
                    update("languages", toggleOption(form.languages, option))
                  }
                />
              ))}
            </div>
          </Section>

          <Section {...copy.sections.access}>
            <div className="grid gap-3 md:grid-cols-2">
              {copy.platformOptions.map((option) => (
                <ChoiceChip
                  key={option}
                  label={option}
                  selected={form.platform === option}
                  onClick={() => update("platform", option)}
                />
              ))}
            </div>
            <div className="mt-4">
              <FieldLabel>{copy.labels.device}</FieldLabel>
              <TextInput
                value={form.device}
                onChange={(value) => update("device", value)}
                placeholder={copy.placeholders.device}
              />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {copy.groupOptions.map((option) => (
                <ChoiceChip
                  key={option}
                  label={option}
                  selected={form.groupSize === option}
                  onClick={() => update("groupSize", option)}
                />
              ))}
            </div>
          </Section>

          <Section {...copy.sections.experience}>
            <div className="grid gap-3">
              {copy.experienceOptions.map((option) => (
                <ChoiceChip
                  key={option}
                  label={option}
                  selected={form.experience === option}
                  onClick={() => update("experience", option)}
                />
              ))}
            </div>
          </Section>

          <Section {...copy.sections.source}>
            <div className="grid gap-3 md:grid-cols-2">
              {copy.sourceOptions.map((option) => (
                <ChoiceChip
                  key={option}
                  label={option}
                  selected={form.source.includes(option)}
                  onClick={() => update("source", toggleOption(form.source, option))}
                />
              ))}
            </div>
            {requiresSourceOther ? (
              <div className="mt-4">
                <FieldLabel>{copy.labels.sourceOther}</FieldLabel>
                <TextInput
                  value={form.sourceOther}
                  onChange={(value) => update("sourceOther", value)}
                  placeholder={copy.placeholders.sourceOther}
                />
              </div>
            ) : null}
          </Section>

          <Section {...copy.sections.motivation}>
            <textarea
              value={form.motivation}
              onChange={(event) => update("motivation", event.target.value)}
              placeholder={copy.placeholders.motivation}
              className="h-44 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/45 focus:border-[#FF7A59]"
            />
          </Section>

          <label className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/72">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => update("consent", event.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-[#FF7A59]"
            />
            <span>{copy.labels.consent}</span>
          </label>

          {submitState.status === "error" ? (
            <div className="rounded-2xl border border-[#FF7A59]/25 bg-[#120C0A] px-4 py-3 text-sm text-[#FFD3C4]">
              {submitState.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#FF7A59] px-6 text-base font-semibold text-[#050505] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#7F4A3A] disabled:text-white/55"
          >
            {submitState.status === "submitting"
              ? copy.labels.submitting
              : copy.labels.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
