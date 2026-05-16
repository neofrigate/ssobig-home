"use client";

import { useEffect, useState } from "react";

type SurveyContext = {
  customerName?: string | null;
  phoneMasked?: string | null;
  schedule?: string | null;
  scheduleDateTime?: string | null;
  alreadySubmitted: boolean;
  submittedAt?: string | null;
};

type SurveySubmitResponse = {
  success?: boolean;
  alreadySubmitted?: boolean;
  submittedAt?: string | null;
  error?: string;
};

type FormState = {
  overallSatisfaction: number | null;
  acquisitionChannels: string[];
  acquisitionChannelEtc: string;
  contentFlowScore: number | null;
  recommendationScore: number | null;
  recommendedTargets: string[];
  recommendedTargetEtc: string;
  freeText: string;
};

type SurveyPageClientProps = {
  surveyToken: string;
};

const ACQUISITION_CHANNEL_OPTIONS = [
  "공식 인스타그램",
  "광고",
  "지인 추천",
  "블로그·카페",
  "기타",
] as const;

const RECOMMENDED_TARGET_OPTIONS = [
  "새로운 친구를 사귀고 싶은 분",
  "주말에 혼자 시간 보내기 심심한 분",
  "이성/동성 친구를 만들고 싶은 분",
  "색다른 경험을 해보고 싶은 분",
  "사회생활 외 인간관계를 넓히고 싶은 분",
  "기타",
] as const;

const INITIAL_FORM_STATE: FormState = {
  overallSatisfaction: null,
  acquisitionChannels: [],
  acquisitionChannelEtc: "",
  contentFlowScore: null,
  recommendationScore: null,
  recommendedTargets: [],
  recommendedTargetEtc: "",
  freeText: "",
};

const DUMMY_SURVEY_TOKENS = new Set([
  "dummyapplication",
  "dummy-application",
  "dummy-application-id",
]);

const DUMMY_SURVEY_CONTEXT: SurveyContext = {
  customerName: "테스트 참여자",
  phoneMasked: "010-****-0000",
  schedule: "일일남매 테스트 회차",
  scheduleDateTime: null,
  alreadySubmitted: false,
  submittedAt: null,
};

function isDummySurveyToken(token: string) {
  return DUMMY_SURVEY_TOKENS.has(token.trim().toLowerCase());
}

function formatSubmittedAt(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatSchedule(schedule?: string | null, scheduleDateTime?: string | null) {
  if (schedule?.trim()) {
    return schedule;
  }

  if (!scheduleDateTime) {
    return "";
  }

  const date = new Date(scheduleDateTime);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function toggleOption(currentValues: string[], option: string) {
  return currentValues.includes(option)
    ? currentValues.filter((value) => value !== option)
    : [...currentValues, option];
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
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
        selected
          ? "border-[#FF7A59] bg-[#FF7A59] text-white shadow-[0_12px_30px_rgba(255,122,89,0.25)]"
          : "border-white/15 bg-white/[0.03] text-white/78 hover:border-white/30 hover:bg-white/[0.06]"
      }`}
    >
      {label}
    </button>
  );
}

function ScoreButton({
  value,
  selected,
  onClick,
}: {
  value: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition ${
        selected
          ? "border-[#FF7A59] bg-[#FF7A59] text-white"
          : "border-white/15 bg-white/[0.03] text-white/80 hover:border-white/30 hover:bg-white/[0.06]"
      }`}
    >
      {value}
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
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
          {step}
        </p>
        <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function SurveyPageClient({
  surveyToken,
}: SurveyPageClientProps) {
  const isDummySurvey = isDummySurveyToken(surveyToken);
  const [context, setContext] = useState<SurveyContext | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchContext() {
      setIsLoading(true);
      setLoadError("");

      if (isDummySurvey) {
        setContext(DUMMY_SURVEY_CONTEXT);
        setSubmittedAt(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/offline/day-nammae/survey?token=${encodeURIComponent(surveyToken)}`,
          {
            cache: "no-store",
          }
        );

        const payload = (await response.json().catch(() => null)) as
          | (SurveyContext & { error?: string })
          | null;

        if (!response.ok) {
          throw new Error(payload?.error || "설문 정보를 불러오지 못했습니다.");
        }

        if (cancelled) return;

        setContext(payload);
        setSubmittedAt(payload?.submittedAt ?? null);
      } catch (error) {
        if (cancelled) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "설문 정보를 불러오지 못했습니다."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchContext();

    return () => {
      cancelled = true;
    };
  }, [isDummySurvey, surveyToken]);

  const scheduleLabel = formatSchedule(
    context?.schedule,
    context?.scheduleDateTime
  );

  const requiresAcquisitionEtc = form.acquisitionChannels.includes("기타");
  const requiresRecommendedTargetEtc = form.recommendedTargets.includes("기타");

  const canSubmit =
    form.overallSatisfaction !== null &&
    form.acquisitionChannels.length > 0 &&
    (!requiresAcquisitionEtc || form.acquisitionChannelEtc.trim().length > 0) &&
    form.contentFlowScore !== null &&
    form.recommendationScore !== null &&
    form.recommendedTargets.length > 0 &&
    (!requiresRecommendedTargetEtc ||
      form.recommendedTargetEtc.trim().length > 0) &&
    !context?.alreadySubmitted;

  const handleMultiSelect = (
    key: "acquisitionChannels" | "recommendedTargets",
    option: string
  ) => {
    setForm((current) => ({
      ...current,
      [key]: toggleOption(current[key], option),
      ...(key === "acquisitionChannels" && option === "기타"
        ? {
            acquisitionChannelEtc: current[key].includes("기타")
              ? ""
              : current.acquisitionChannelEtc,
          }
        : {}),
      ...(key === "recommendedTargets" && option === "기타"
        ? {
            recommendedTargetEtc: current[key].includes("기타")
              ? ""
              : current.recommendedTargetEtc,
          }
        : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!context || !canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    if (isDummySurvey) {
      const now = new Date().toISOString();
      setContext((current) =>
        current
          ? {
              ...current,
              alreadySubmitted: true,
              submittedAt: now,
            }
          : current
      );
      setSubmittedAt(now);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/offline/day-nammae/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: surveyToken,
          overallSatisfaction: form.overallSatisfaction,
          acquisitionChannels: form.acquisitionChannels,
          acquisitionChannelEtc: form.acquisitionChannelEtc.trim() || null,
          contentFlowScore: form.contentFlowScore,
          recommendationScore: form.recommendationScore,
          recommendedTargets: form.recommendedTargets,
          recommendedTargetEtc: form.recommendedTargetEtc.trim() || null,
          freeText: form.freeText.trim() || null,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | SurveySubmitResponse
        | null;

      if (response.status === 409 || payload?.alreadySubmitted) {
        setContext((current) =>
          current
            ? {
                ...current,
                alreadySubmitted: true,
                submittedAt: payload?.submittedAt ?? current.submittedAt ?? null,
              }
            : current
        );
        setSubmittedAt(payload?.submittedAt ?? submittedAt);
        return;
      }

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "설문 제출에 실패했습니다.");
      }

      setContext((current) =>
        current
          ? {
              ...current,
              alreadySubmitted: true,
              submittedAt: payload.submittedAt ?? current.submittedAt ?? null,
            }
          : current
      );
      setSubmittedAt(payload.submittedAt ?? null);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "설문 제출에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-5 py-16">
          <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#FF7A59]" />
            <p className="text-lg font-medium text-white">설문 정보를 불러오는 중입니다.</p>
            <p className="mt-2 text-sm text-white/55">
              잠시만 기다려 주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !context) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-5 py-16">
          <div className="w-full rounded-[32px] border border-[#FF7A59]/25 bg-[#120C0A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
              Survey Unavailable
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              설문 링크를 확인해 주세요
            </h1>
            <p className="mt-4 whitespace-pre-line text-base leading-7 text-white/70">
              {loadError || "유효한 설문 정보를 찾지 못했습니다."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = context.alreadySubmitted;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-0 h-[420px] w-[420px] rounded-full bg-[#FF7A59]/12 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-10%] h-[360px] w-[360px] rounded-full bg-[#FFD15C]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 py-14 md:py-20">
        <div className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFB38A]">
            SSOBIG OFFLINE
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            일일남매 설문조사
          </h1>
          <p className="mt-4 break-keep text-base leading-7 text-white/72 md:text-lg">
            {context.customerName ? `${context.customerName}님, ` : ""}
            일일남매 경험을 더 좋아지게 만들 수 있도록 솔직한 의견을 부탁드려요.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-white/45">응답 링크</p>
              <p className="mt-2 text-sm font-medium text-white">개인 전용 링크</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-white/45">참여자</p>
              <p className="mt-2 text-sm font-medium text-white">
                {context.customerName || context.phoneMasked || "확인 완료"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-white/45">회차</p>
              <p className="mt-2 text-sm font-medium text-white">
                {scheduleLabel || "일일남매"}
              </p>
            </div>
          </div>
        </div>

        {isCompleted ? (
          <div className="rounded-[32px] border border-[#FF7A59]/20 bg-[#120C0A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
              Already Submitted
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              설문이 이미 제출되었습니다
            </h2>
            <p className="mt-4 break-keep text-base leading-7 text-white/72">
              응답해 주셔서 감사합니다. 같은 신청 건으로는 한 번만 제출할 수 있어요.
            </p>
            {formatSubmittedAt(submittedAt || context.submittedAt) ? (
              <p className="mt-5 text-sm text-white/50">
                제출 시각: {formatSubmittedAt(submittedAt || context.submittedAt)}
              </p>
            ) : null}
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Section
              step="Q1"
              title="일일남매 경험에 전반적으로 얼마나 만족하셨나요?"
              description="1점은 매우 불만족, 5점은 매우 만족입니다."
            >
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <ScoreButton
                    key={value}
                    value={value}
                    selected={form.overallSatisfaction === value}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        overallSatisfaction: value,
                      }))
                    }
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs text-white/45">
                <span>매우 불만족</span>
                <span>매우 만족</span>
              </div>
            </Section>

            <Section
              step="Q2"
              title="일일남매를 어떤 경로로 알게 되셨나요?"
              description="해당되는 항목을 모두 선택해 주세요."
            >
              <div className="grid gap-3 md:grid-cols-2">
                {ACQUISITION_CHANNEL_OPTIONS.map((option) => (
                  <ChoiceChip
                    key={option}
                    label={option}
                    selected={form.acquisitionChannels.includes(option)}
                    onClick={() => handleMultiSelect("acquisitionChannels", option)}
                  />
                ))}
              </div>
              {requiresAcquisitionEtc ? (
                <textarea
                  value={form.acquisitionChannelEtc}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      acquisitionChannelEtc: event.target.value,
                    }))
                  }
                  placeholder="기타 경로를 적어 주세요"
                  className="mt-4 h-28 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#FF7A59]"
                />
              ) : null}
            </Section>

            <Section
              step="Q3"
              title="콘텐츠의 전반적 흐름은 어떠셨했나요?"
              description="1점은 매우 지루, 5점은 매우 흥미로움입니다."
            >
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <ScoreButton
                    key={value}
                    value={value}
                    selected={form.contentFlowScore === value}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        contentFlowScore: value,
                      }))
                    }
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs text-white/45">
                <span>매우 지루</span>
                <span>매우 흥미로움</span>
              </div>
            </Section>

            <Section
              step="Q4"
              title="주변 지인에게 일일남매를 추천할 의향이 있으신가요?"
              description="0점은 전혀 추천하지 않음, 10점은 적극 추천입니다."
            >
              <div className="grid grid-cols-6 gap-3 md:grid-cols-11">
                {Array.from({ length: 11 }, (_, value) => (
                  <ScoreButton
                    key={value}
                    value={value}
                    selected={form.recommendationScore === value}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        recommendationScore: value,
                      }))
                    }
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs text-white/45">
                <span>전혀 추천하지 않음</span>
                <span>적극 추천</span>
              </div>
            </Section>

            <Section
              step="Q5"
              title="일일남매를 어떤 분에게 추천하고 싶으신가요?"
              description="해당되는 항목을 모두 선택해 주세요."
            >
              <div className="grid gap-3">
                {RECOMMENDED_TARGET_OPTIONS.map((option) => (
                  <ChoiceChip
                    key={option}
                    label={option}
                    selected={form.recommendedTargets.includes(option)}
                    onClick={() => handleMultiSelect("recommendedTargets", option)}
                  />
                ))}
              </div>
              {requiresRecommendedTargetEtc ? (
                <textarea
                  value={form.recommendedTargetEtc}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      recommendedTargetEtc: event.target.value,
                    }))
                  }
                  placeholder="기타 추천 대상을 적어 주세요"
                  className="mt-4 h-28 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#FF7A59]"
                />
              ) : null}
            </Section>

            <Section
              step="Q6"
              title="좋았던 점이나 개선되었으면 하는 점을 자유롭게 알려주세요."
              description="짧게 남겨주셔도 충분합니다."
            >
              <textarea
                value={form.freeText}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    freeText: event.target.value,
                  }))
                }
                placeholder="좋았던 점, 아쉬웠던 점, 다음 회차에 바라는 점 등을 편하게 적어 주세요."
                className="h-44 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-[#FF7A59]"
              />
            </Section>

            {submitError ? (
              <div className="rounded-2xl border border-[#FF7A59]/25 bg-[#120C0A] px-4 py-3 text-sm text-[#FFD3C4]">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#FF7A59] px-6 text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#7F4A3A] disabled:text-white/55"
            >
              {isSubmitting ? "응답 제출 중..." : "설문 제출하기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
