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
  likedFactors: string[];
  likedFactorOther: string;
  improvementPoints: string[];
  improvementPointOther: string;
  futureSessionPreferences: string[];
  friendIntroText: string;
  finalOpinionText: string;
};

type SurveyPageClientProps = {
  surveyToken: string;
};

const LIKED_FACTOR_OPTIONS = [
  "현장 MC의 진행",
  "AI 집사의 시스템 안내",
  "서로 돌아가며 남매소개서를 말해주던 시간",
  "첫인상 투표로 다른 사람이 보는 나를 알 수 있던 것",
  "연애 가치관/밸런스를 통해 나와 잘 맞는 사람의 유사도를 볼 수 있었던 것",
  "쪽지 미션으로 내 남매가 나를 어필해준 시간",
  "QR 미션으로 궁금한 이성과 대화를 나누는 시간",
  "최종 선택 및 매칭 결과 공개",
  "기타",
] as const;

const CONTENT_EXPLANATION_ISSUE_OPTION =
  "콘텐츠 설명이 어려운 부분이 있었음";
const NO_IMPROVEMENT_POINT_OPTION = "특별히 없음";
const MAX_LIKED_FACTOR_SELECTIONS = 3;

const IMPROVEMENT_POINT_OPTIONS = [
  CONTENT_EXPLANATION_ISSUE_OPTION,
  "테이블 대화 시간이 전반적으로 부족했음",
  "쪽지 or QR미션 수행 방식이 어렵거나 부담스러웠음",
  "참가자 연령대와 분위기가 생각과 달랐음",
  "자리 이동 횟수가 적었음",
  "공간이 불편했음",
  NO_IMPROVEMENT_POINT_OPTION,
  "기타",
] as const;

const FUTURE_SESSION_OPTIONS = [
  "비슷한 기본 일일남매",
  "연령대가 더 비슷한 사람끼리 만나는 회차",
  "관심사/취향 기반 회차",
  "조금 더 소규모 회차",
  "더 많은 사람을 만나는 회차",
  "친구와 함께 참여 가능한 회차",
  "가격 혜택이 있는 회차",
  "아직 재참여 의향 없음",
] as const;

const TEN_POINT_SCORE_VALUES = Array.from(
  { length: 10 },
  (_, index) => index + 1
);

const NAVER_REVIEW_URL = "https://m.place.naver.com/my/timeline";
const REVIEW_INCENTIVE_THRESHOLD = 7;
const REVIEW_SCREENSHOT_MESSAGE =
  "[일일남매] 네이버 리뷰 인증샷 확인 부탁드립니다. 커피 쿠폰 또는 일일남매 30% 할인 쿠폰 신청합니다.";

const INITIAL_FORM_STATE: FormState = {
  overallSatisfaction: null,
  likedFactors: [],
  likedFactorOther: "",
  improvementPoints: [],
  improvementPointOther: "",
  futureSessionPreferences: [],
  friendIntroText: "",
  finalOpinionText: "",
};

const DUMMY_SURVEY_TOKENS = new Set([
  "dummyapplication",
  "dummy-application",
  "dummy-application-id",
]);

const DUMMY_SURVEY_TOKEN_PATTERNS = [
  /^dummy-application-id-\d+$/,
  /^dummy-applcation-id-\d+$/,
];

const DUMMY_SURVEY_CONTEXT: SurveyContext = {
  customerName: "테스트 참여자",
  phoneMasked: "010-****-0000",
  schedule: "일일남매 테스트 회차",
  scheduleDateTime: null,
  alreadySubmitted: false,
  submittedAt: null,
};

function isDummySurveyToken(token: string) {
  const normalizedToken = token.trim().toLowerCase();
  return (
    DUMMY_SURVEY_TOKENS.has(normalizedToken) ||
    DUMMY_SURVEY_TOKEN_PATTERNS.some((pattern) =>
      pattern.test(normalizedToken)
    )
  );
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

function toggleLikedFactor(currentValues: string[], option: string) {
  if (currentValues.includes(option)) {
    return currentValues.filter((value) => value !== option);
  }

  if (currentValues.length >= MAX_LIKED_FACTOR_SELECTIONS) {
    return currentValues;
  }

  return [...currentValues, option];
}

function toggleImprovementPoint(currentValues: string[], option: string) {
  if (currentValues.includes(option)) {
    return currentValues.filter((value) => value !== option);
  }

  if (option === NO_IMPROVEMENT_POINT_OPTION) {
    return [NO_IMPROVEMENT_POINT_OPTION];
  }

  return [
    ...currentValues.filter((value) => value !== NO_IMPROVEMENT_POINT_OPTION),
    option,
  ];
}

function getReviewScoreAverage(form: FormState) {
  if (form.overallSatisfaction === null) {
    return null;
  }

  return form.overallSatisfaction;
}

function isReviewIncentiveEligible(form: FormState) {
  const average = getReviewScoreAverage(form);
  return average !== null && average >= REVIEW_INCENTIVE_THRESHOLD;
}

function ChoiceChip({
  selected,
  disabled = false,
  label,
  onClick,
}: {
  selected: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${
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
  const [context, setContext] = useState<SurveyContext | null>(
    isDummySurvey ? DUMMY_SURVEY_CONTEXT : null
  );
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(!isDummySurvey);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [showReviewIncentive, setShowReviewIncentive] = useState(false);

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

  const requiresLikedFactorOther = form.likedFactors.includes("기타");
  const requiresImprovementPointOther =
    form.improvementPoints.includes("기타") ||
    form.improvementPoints.includes(CONTENT_EXPLANATION_ISSUE_OPTION);

  const canSubmit =
    form.overallSatisfaction !== null &&
    form.likedFactors.length > 0 &&
    (!requiresLikedFactorOther || form.likedFactorOther.trim().length > 0) &&
    form.improvementPoints.length > 0 &&
    (!requiresImprovementPointOther ||
      form.improvementPointOther.trim().length > 0) &&
    form.futureSessionPreferences.length > 0 &&
    !context?.alreadySubmitted;

  const handleMultiSelect = (
    key: "likedFactors" | "improvementPoints" | "futureSessionPreferences",
    option: string
  ) => {
    setForm((current) => {
      if (key === "likedFactors") {
        const nextLikedFactors = toggleLikedFactor(current.likedFactors, option);

        return {
          ...current,
          likedFactors: nextLikedFactors,
          likedFactorOther: nextLikedFactors.includes("기타")
            ? current.likedFactorOther
            : "",
        };
      }

      if (key === "improvementPoints") {
        const nextImprovementPoints = toggleImprovementPoint(
          current.improvementPoints,
          option
        );
        const needsImprovementDetail =
          nextImprovementPoints.includes("기타") ||
          nextImprovementPoints.includes(CONTENT_EXPLANATION_ISSUE_OPTION);

        return {
          ...current,
          improvementPoints: nextImprovementPoints,
          improvementPointOther: needsImprovementDetail
            ? current.improvementPointOther
            : "",
        };
      }

      return {
        ...current,
        [key]: toggleOption(current[key], option),
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!context || !canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const shouldShowReviewIncentive = isReviewIncentiveEligible(form);

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
      setShowReviewIncentive(shouldShowReviewIncentive);
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
          surveyScaleVersion: 2,
          overallSatisfaction: form.overallSatisfaction,
          likedFactors: form.likedFactors,
          likedFactorOther: form.likedFactorOther.trim() || null,
          improvementPoints: form.improvementPoints,
          improvementPointOther: form.improvementPointOther.trim() || null,
          futureSessionPreferences: form.futureSessionPreferences,
          friendIntroText: form.friendIntroText.trim() || null,
          finalOpinionText: form.finalOpinionText.trim() || null,
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
        setShowReviewIncentive(false);
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
      setShowReviewIncentive(shouldShowReviewIncentive);
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
  const openChannelTalkForReviewScreenshot = () => {
    window.ChannelIO?.("openChat", undefined, REVIEW_SCREENSHOT_MESSAGE);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-0 h-[420px] w-[420px] rounded-full bg-[#FF7A59]/12 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-10%] h-[360px] w-[360px] rounded-full bg-[#FFD15C]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 py-14 md:py-20">
        <div className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-8">
          <p className="text-xs font-semibold tracking-[0.28em] text-[#FFB38A]">
            ssobig OFFLINE
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
          <div className="space-y-5">
            <section className="rounded-[32px] border border-[#FF7A59]/20 bg-[#120C0A] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
                Submitted
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                설문이 제출되었습니다
              </h2>
              <p className="mt-4 break-keep text-base leading-7 text-white/72">
                응답해 주셔서 감사합니다. 같은 신청 건으로는 한 번만 제출할 수 있어요.
              </p>
              {formatSubmittedAt(submittedAt || context.submittedAt) ? (
                <p className="mt-5 text-sm text-white/50">
                  제출 시각: {formatSubmittedAt(submittedAt || context.submittedAt)}
                </p>
              ) : null}
            </section>

            {showReviewIncentive ? (
              <section className="rounded-[32px] border border-[#FF7A59]/24 bg-[#100A08] p-7 shadow-[0_24px_80px_rgba(255,122,89,0.08)] md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
                      Review Gift
                    </p>
                    <h3 className="mt-3 break-keep text-2xl font-semibold text-white md:text-3xl">
                      리뷰 인증하고 커피 쿠폰 받기
                    </h3>
                    <p className="mt-3 break-keep text-sm leading-6 text-white/68 md:text-base md:leading-7">
                      일일남매가 좋았다면 네이버에 짧은 후기를 남겨주세요.
                      작성 화면을 캡처해 채널톡으로 보내주시면 확인 후
                      커피 쿠폰 또는 일일남매 30% 할인 쿠폰을 보내드립니다.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-white/72 md:grid-cols-3">
                  {[
                    "네이버 리뷰 작성",
                    "작성 화면 캡처",
                    "채널톡으로 전송",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF7A59] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <a
                    href={NAVER_REVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-14 items-center justify-center rounded-2xl bg-[#FF7A59] px-5 text-center text-sm font-semibold text-white transition hover:brightness-105"
                  >
                    네이버 리뷰 쓰기
                  </a>
                  <button
                    type="button"
                    onClick={openChannelTalkForReviewScreenshot}
                    className="flex min-h-14 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.05] px-5 text-sm font-semibold text-white transition hover:border-white/28 hover:bg-white/[0.08]"
                  >
                    인증샷 보내고 쿠폰 받기
                  </button>
                </div>
              </section>
            ) : null}
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Section
              step="Q1"
              title="일일남매 경험에 전반적으로 얼마나 만족하셨나요?"
              description="1점은 매우 아쉬움, 10점은 매우 만족입니다."
            >
              <div className="grid grid-cols-5 gap-3 md:grid-cols-10">
                {TEN_POINT_SCORE_VALUES.map((value) => (
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
                <span>매우 아쉬움</span>
                <span>매우 만족</span>
              </div>
            </Section>

            <Section
              step="Q2"
              title="오늘 콘텐츠 중 좋았던 건 무엇이었나요?"
              description="1~3개까지 편하게 선택해 주세요!"
            >
              <div className="grid gap-3 md:grid-cols-2">
                {LIKED_FACTOR_OPTIONS.map((option) => {
                  const selected = form.likedFactors.includes(option);
                  return (
                    <ChoiceChip
                      key={option}
                      label={option}
                      selected={selected}
                      disabled={
                        !selected &&
                        form.likedFactors.length >= MAX_LIKED_FACTOR_SELECTIONS
                      }
                      onClick={() => handleMultiSelect("likedFactors", option)}
                    />
                  );
                })}
              </div>
              {requiresLikedFactorOther ? (
                <textarea
                  value={form.likedFactorOther}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      likedFactorOther: event.target.value,
                    }))
                  }
                  placeholder="좋았던 다른 순간이 있다면 적어 주세요"
                  className="mt-4 h-28 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#FF7A59]"
                />
              ) : null}
            </Section>

            <Section
              step="Q3"
              title="아쉽거나 더 좋아지면 좋겠다고 느낀 부분"
              description="없다면 '특별히 없음'을 선택해 주세요."
            >
              <div className="grid gap-3 md:grid-cols-2">
                {IMPROVEMENT_POINT_OPTIONS.map((option) => (
                  <ChoiceChip
                    key={option}
                    label={option}
                    selected={form.improvementPoints.includes(option)}
                    onClick={() => handleMultiSelect("improvementPoints", option)}
                  />
                ))}
              </div>
              {requiresImprovementPointOther ? (
                <textarea
                  value={form.improvementPointOther}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      improvementPointOther: event.target.value,
                    }))
                  }
                  placeholder={
                    form.improvementPoints.includes(
                        CONTENT_EXPLANATION_ISSUE_OPTION
                      )
                      ? "어떤 콘텐츠 설명이 어려웠는지 적어 주세요"
                      : "더 좋아지면 좋겠는 다른 부분이 있다면 적어 주세요"
                  }
                  className="mt-4 h-28 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#FF7A59]"
                />
              ) : null}
            </Section>

            <Section
              step="Q4"
              title="다음에 또 온다면 어떤 회차가 끌리나요?"
              description="관심 있는 회차를 편하게 골라주세요."
            >
              <div className="grid gap-3">
                {FUTURE_SESSION_OPTIONS.map((option) => (
                  <ChoiceChip
                    key={option}
                    label={option}
                    selected={form.futureSessionPreferences.includes(option)}
                    onClick={() =>
                      handleMultiSelect("futureSessionPreferences", option)
                    }
                  />
                ))}
              </div>
            </Section>

            <Section
              step="Q5"
              title="친구에게 소개한다면 뭐라고 말하고 싶나요?"
              description="짧게 적어도 좋고, 비워두셔도 괜찮습니다."
            >
              <textarea
                value={form.friendIntroText}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    friendIntroText: event.target.value,
                  }))
                }
                placeholder="예: 혼자 가도 어색하지 않았고, 여러 사람과 자연스럽게 대화할 수 있었어."
                className="h-36 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-[#FF7A59]"
              />
            </Section>

            <Section
              step="Q6"
              title="마지막으로 남기고 싶은 말이 있다면 적어주세요."
              description="좋았던 점, 아쉬웠던 점 모두 편하게 남겨주세요."
            >
              <textarea
                value={form.finalOpinionText}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    finalOpinionText: event.target.value,
                  }))
                }
                placeholder="운영팀에게 전하고 싶은 말을 자유롭게 적어 주세요."
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
