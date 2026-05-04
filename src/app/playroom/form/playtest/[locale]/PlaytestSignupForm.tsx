"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { PlaytestLocale } from "../locales";

type FormState = {
  name: string;
  email: string;
  country: string;
  groupSize: string;
  experience: string;
  source: string[];
  sourceOther: string;
  motivation: string[];
  motivationOther: string;
  consent: boolean;
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; dryRun?: boolean }
  | { status: "error"; message: string };

type CountryOption = {
  code: string;
  label: string;
  value: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  country: "",
  groupSize: "",
  experience: "",
  source: [],
  sourceOther: "",
  motivation: [],
  motivationOther: "",
  consent: false,
};

const COUNTRY_CODES = [
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM",
  "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ",
  "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF",
  "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC",
  "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ",
  "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET",
  "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE",
  "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY",
  "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE",
  "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR",
  "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO",
  "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX",
  "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP",
  "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM",
  "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR",
  "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC",
  "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI",
  "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH",
  "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR",
  "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU",
  "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW",
] as const;

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
      group: {
        step: "Q2",
        title: "How many people will play together?",
        description: "Choose the closest group size.",
      },
      experience: {
        step: "Q3",
        title: "What kind of mystery-game player are you?",
        description: "Choose the closest option.",
      },
      source: {
        step: "Q4",
        title: "Where did you hear about this playtest?",
        description: "Select every channel that applies.",
      },
      motivation: {
        step: "Q5",
        title: "What would you like to help us evaluate?",
        description: "Short notes are enough.",
      },
    },
    labels: {
      name: "Name or nickname",
      email: "Email",
      country: "Country or region",
      sourceOther: "Other channel",
      motivationOther: "Other note",
      consent:
        "I agree to receive playtest access, coupons, and follow-up emails from SsoBig.",
      submit: "Apply for playtest",
      submitting: "Submitting...",
    },
    placeholders: {
      name: "Alex",
      email: "alex@example.com",
      country: "Select country or region",
      sourceOther: "Tell us where",
      motivationOther: "Tell us what else you want to evaluate",
    },
    groupOptions: ["2-3 people", "4-6 people", "7+ people"],
    experienceOptions: [
      "New to murder mystery",
      "Played digital mystery games",
      "Played tabletop murder mystery",
      "Hosted games before",
    ],
    sourceOptions: ["Reddit", "Discord", "Facebook group", "BoardGameGeek", "Friend", "Other"],
    motivationOptions: [
      "Translation clarity",
      "Story pacing",
      "Onboarding",
      "Group play",
      "Payment flow",
      "Other",
    ],
    validation: {
      required: "Please fill in the required fields.",
      email: "Please enter a valid email address.",
      consent: "Please agree to receive playtest access emails.",
      sourceOther: "Please tell us the other channel.",
      motivationOther: "Please tell us the other note.",
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
      group: {
        step: "Q2",
        title: "몇 명이 함께 플레이할 예정인가요?",
        description: "가장 가까운 인원 구간을 선택해주세요.",
      },
      experience: {
        step: "Q3",
        title: "추리게임 경험은 어느 쪽에 가까운가요?",
        description: "가장 가까운 항목을 선택해주세요.",
      },
      source: {
        step: "Q4",
        title: "이 플레이테스트를 어디에서 알게 되었나요?",
        description: "해당되는 채널을 모두 선택해주세요.",
      },
      motivation: {
        step: "Q5",
        title: "어떤 부분을 중점적으로 봐주고 싶나요?",
        description: "짧게 적어주셔도 충분합니다.",
      },
    },
    labels: {
      name: "이름 또는 닉네임",
      email: "이메일",
      country: "국가 또는 지역",
      sourceOther: "기타 채널",
      motivationOther: "기타 메모",
      consent:
        "쏘빅의 플레이테스트 권한, 쿠폰, 후속 안내 이메일 수신에 동의합니다.",
      submit: "플레이테스트 신청하기",
      submitting: "신청 제출 중...",
    },
    placeholders: {
      name: "Alex",
      email: "alex@example.com",
      country: "국가 또는 지역 선택",
      sourceOther: "알게 된 경로를 적어주세요",
      motivationOther: "추가로 확인하고 싶은 내용을 적어주세요",
    },
    groupOptions: ["2-3명", "4-6명", "7명 이상"],
    experienceOptions: [
      "머더미스터리는 처음",
      "디지털 추리게임 경험 있음",
      "오프라인/보드게임형 머더미스터리 경험 있음",
      "게임 진행/호스트 경험 있음",
    ],
    sourceOptions: ["Reddit", "Discord", "Facebook 그룹", "BoardGameGeek", "지인 추천", "기타"],
    motivationOptions: [
      "번역 자연스러움",
      "스토리 진행 흐름",
      "첫 진입 경험",
      "그룹 플레이",
      "결제 흐름",
      "기타",
    ],
    validation: {
      required: "필수 항목을 입력해주세요.",
      email: "올바른 이메일 주소를 입력해주세요.",
      consent: "플레이테스트 안내 이메일 수신에 동의해주세요.",
      sourceOther: "기타 채널을 입력해주세요.",
      motivationOther: "기타 메모를 입력해주세요.",
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

function SelectInput({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 h-12 w-full rounded-2xl border border-white/12 bg-black/30 px-4 text-sm text-white outline-none transition focus:border-[#FF7A59]"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {children}
    </select>
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
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);

  useEffect(() => {
    const displayLocale = locale === "ko" ? "ko" : "en";
    const displayNames = new Intl.DisplayNames([displayLocale], {
      type: "region",
    });
    const englishNames = new Intl.DisplayNames(["en"], {
      type: "region",
    });

    setCountryOptions(COUNTRY_CODES.map((code) => ({
      code,
      label: displayNames.of(code) ?? code,
      value: englishNames.of(code) ?? code,
    })).sort((a, b) => a.label.localeCompare(b.label, displayLocale)));
  }, [locale]);

  const requiresSourceOther = form.source.includes("Other") || form.source.includes("기타");
  const requiresMotivationOther =
    form.motivation.includes("Other") || form.motivation.includes("기타");

  const validationError = useMemo(() => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.country.trim() ||
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
    if (requiresMotivationOther && !form.motivationOther.trim()) {
      return copy.validation.motivationOther;
    }
    if (!form.consent) return copy.validation.consent;
    return "";
  }, [copy, form, requiresMotivationOther, requiresSourceOther]);

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
      const motivation = [
        ...form.motivation.filter((value) => value !== "Other" && value !== "기타"),
        form.motivationOther.trim(),
      ]
        .filter(Boolean)
        .join(", ");

      const response = await fetch("/api/playroom/playtest/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          ...form,
          motivation,
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
                <SelectInput
                  value={form.country}
                  onChange={(value) => update("country", value)}
                  placeholder={copy.placeholders.country}
                >
                  {countryOptions.map((option) => (
                    <option key={option.code} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectInput>
              </div>
            </div>
          </Section>

          <Section {...copy.sections.group}>
            <div className="grid gap-3 md:grid-cols-3">
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
            <div className="grid gap-3 md:grid-cols-2">
              {copy.motivationOptions.map((option) => (
                <ChoiceChip
                  key={option}
                  label={option}
                  selected={form.motivation.includes(option)}
                  onClick={() =>
                    update("motivation", toggleOption(form.motivation, option))
                  }
                />
              ))}
            </div>
            {requiresMotivationOther ? (
              <div className="mt-4">
                <FieldLabel>{copy.labels.motivationOther}</FieldLabel>
                <TextInput
                  value={form.motivationOther}
                  onChange={(value) => update("motivationOther", value)}
                  placeholder={copy.placeholders.motivationOther}
                />
              </div>
            ) : null}
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
