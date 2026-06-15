"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReviewLanguage } from "./reviewLanguage";

type EnvName = "staging" | "production";

type ReviewContext = {
  env: EnvName;
  gameId: string;
  playerId: string;
  game: {
    id: string;
    title: string;
    templateId: string;
    enterCode: string;
    imageUrl: string;
  };
  player: {
    id: string;
    recordId: string;
    nickname: string;
    number: number | null;
    sex: string;
    name: string;
    phoneNumber: string;
    email: string;
    age: string;
  };
};

type FormState = {
  satisfaction: string;
  playExperience: string;
  inflowSource: string;
  recommendationTarget: string;
  charmPoint: string;
  sequelInterest: string;
  additionalComment: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; context: ReviewContext }
  | { status: "error"; message: string };

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

type ChoiceGroupProps = {
  label: string;
  value: string;
  options: ChoiceOption[];
  onChange: (value: string) => void;
};

type ChoiceOption = {
  value: string;
  label: string;
};

type ReviewCopy = {
  eyebrow: string;
  title: string;
  loading: string;
  unavailableTitle: string;
  targetLabel: string;
  satisfactionLabel: string;
  playExperienceLabel: string;
  inflowLabel: string;
  recommendationTargetLabel: string;
  recommendationTargetPlaceholder: string;
  charmPointLabel: string;
  charmPointPlaceholder: string;
  sequelInterestLabel: string;
  additionalCommentLabel: string;
  additionalCommentPlaceholder: string;
  submitIdle: string;
  submitLoading: string;
  submitSuccess: string;
  validationSatisfaction: string;
  missingLink: string;
  contextNotFound: string;
  invalidLink: string;
  contextLoadFailed: string;
  contextLoadFailedShort: string;
  submitFailedRetry: string;
  submitInvalid: string;
  submitFailed: string;
  submitFailedShort: string;
  contextTitle: (context: ReviewContext) => string;
};

const INITIAL_FORM: FormState = {
  satisfaction: "",
  playExperience: "",
  inflowSource: "",
  recommendationTarget: "",
  charmPoint: "",
  sequelInterest: "",
  additionalComment: "",
};

const SATISFACTION_VALUES = ["🥰 최고예요", "🙂 괜찮아요", "🥲 아쉬워요"] as const;
const PLAY_EXPERIENCE_VALUES = [
  "처음 플레이했어요",
  "1~2번 플레이해봤어요",
  "3번 이상 플레이해봤어요",
  "자주 플레이해요",
] as const;
const INFLOW_VALUES = [
  "공식 홈페이지/SNS",
  "지인 추천",
  "검색",
  "커뮤니티",
  "기타",
] as const;
const SEQUEL_VALUES = [
  "꼭 해보고 싶어요",
  "관심 있어요",
  "잘 모르겠어요",
  "아직은 아니에요",
] as const;
const PREVIEW_GAME_ID = "__preview__";
const PREVIEW_PLAYER_ID = "__preview__";

function numberPrefixKo(context: ReviewContext) {
  return typeof context.player.number === "number" && context.player.number > 0
    ? `${context.player.number}번 `
    : "";
}

function numberPrefixEn(context: ReviewContext) {
  return typeof context.player.number === "number" && context.player.number > 0
    ? `Player ${context.player.number} `
    : "";
}

function numberPrefixJa(context: ReviewContext) {
  return typeof context.player.number === "number" && context.player.number > 0
    ? `${context.player.number}番 `
    : "";
}

const REVIEW_COPY: Record<ReviewLanguage, ReviewCopy> = {
  ko: {
    eyebrow: "ssobig playroom",
    title: "플레이 후기",
    loading: "후기 작성 정보를 불러오는 중입니다.",
    unavailableTitle: "후기를 작성할 수 없습니다",
    targetLabel: "작성 대상",
    satisfactionLabel: "만족도",
    playExperienceLabel: "플레이 경험",
    inflowLabel: "유입 경로",
    recommendationTargetLabel: "추천 대상",
    recommendationTargetPlaceholder: "이 게임을 누구에게 추천하고 싶은지 적어주세요.",
    charmPointLabel: "매력 포인트",
    charmPointPlaceholder: "가장 인상 깊었던 장면, 장치, 분위기를 적어주세요.",
    sequelInterestLabel: "후속작 관심도",
    additionalCommentLabel: "추가 의견",
    additionalCommentPlaceholder: "작가에게 남기고 싶은 말을 자유롭게 적어주세요.",
    submitIdle: "후기 남기기",
    submitLoading: "저장 중",
    submitSuccess: "후기가 저장되었습니다.",
    validationSatisfaction: "만족도를 선택해 주세요.",
    missingLink: "후기 링크에 필요한 정보가 없습니다.",
    contextNotFound: "방 또는 플레이어 정보를 찾을 수 없습니다.",
    invalidLink: "후기 링크가 올바르지 않습니다.",
    contextLoadFailed:
      "방과 플레이어 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    contextLoadFailedShort: "후기 작성 정보를 불러오지 못했습니다.",
    submitFailedRetry: "후기 저장에 실패했습니다. 잠시 후 다시 제출해 주세요.",
    submitInvalid: "후기 링크 또는 입력값을 확인해 주세요.",
    submitFailed: "후기 제출 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    submitFailedShort: "후기를 저장하지 못했습니다.",
    contextTitle: (context) =>
      `${context.game.title} / ${numberPrefixKo(context)}${context.player.nickname}`,
  },
  en: {
    eyebrow: "ssobig playroom",
    title: "Play Review",
    loading: "Loading review details.",
    unavailableTitle: "This review link is unavailable",
    targetLabel: "Reviewing",
    satisfactionLabel: "Satisfaction",
    playExperienceLabel: "Play experience",
    inflowLabel: "How did you find this?",
    recommendationTargetLabel: "Who would you recommend it to?",
    recommendationTargetPlaceholder: "Tell us who you would recommend this game to.",
    charmPointLabel: "Favorite part",
    charmPointPlaceholder:
      "Share the scene, device, or mood that stood out the most.",
    sequelInterestLabel: "Interest in a sequel",
    additionalCommentLabel: "Additional comments",
    additionalCommentPlaceholder: "Leave any message you would like to share.",
    submitIdle: "Submit Review",
    submitLoading: "Saving",
    submitSuccess: "Your review has been saved.",
    validationSatisfaction: "Please select your satisfaction level.",
    missingLink: "This review link is missing required information.",
    contextNotFound: "Room or player information could not be found.",
    invalidLink: "This review link is invalid.",
    contextLoadFailed:
      "Could not load the room and player information. Please try again shortly.",
    contextLoadFailedShort: "Could not load the review details.",
    submitFailedRetry: "Could not save your review. Please try again shortly.",
    submitInvalid: "Please check the review link or your input.",
    submitFailed: "Something went wrong while submitting your review. Please try again shortly.",
    submitFailedShort: "Could not save your review.",
    contextTitle: (context) =>
      `${context.game.title} / ${numberPrefixEn(context)}${context.player.nickname}`,
  },
  ja: {
    eyebrow: "ssobig playroom",
    title: "プレイレビュー",
    loading: "レビュー作成情報を読み込んでいます。",
    unavailableTitle: "レビューを作成できません",
    targetLabel: "レビュー対象",
    satisfactionLabel: "満足度",
    playExperienceLabel: "プレイ経験",
    inflowLabel: "流入経路",
    recommendationTargetLabel: "おすすめしたい相手",
    recommendationTargetPlaceholder: "このゲームを誰におすすめしたいか入力してください。",
    charmPointLabel: "魅力ポイント",
    charmPointPlaceholder: "印象に残った場面、仕掛け、雰囲気を入力してください。",
    sequelInterestLabel: "続編への関心",
    additionalCommentLabel: "その他のご意見",
    additionalCommentPlaceholder: "作者に伝えたいことを自由に入力してください。",
    submitIdle: "レビューを送信",
    submitLoading: "保存中",
    submitSuccess: "レビューが保存されました。",
    validationSatisfaction: "満足度を選択してください。",
    missingLink: "レビューリンクに必要な情報がありません。",
    contextNotFound: "ルームまたはプレイヤー情報が見つかりません。",
    invalidLink: "レビューリンクが正しくありません。",
    contextLoadFailed:
      "ルームとプレイヤー情報を読み込めませんでした。しばらくしてからもう一度お試しください。",
    contextLoadFailedShort: "レビュー作成情報を読み込めませんでした。",
    submitFailedRetry: "レビューの保存に失敗しました。しばらくしてからもう一度送信してください。",
    submitInvalid: "レビューリンクまたは入力内容を確認してください。",
    submitFailed: "レビュー送信中に問題が発生しました。しばらくしてからもう一度お試しください。",
    submitFailedShort: "レビューを保存できませんでした。",
    contextTitle: (context) =>
      `${context.game.title} / ${numberPrefixJa(context)}${context.player.nickname}`,
  },
};

const CHOICE_LABELS: Record<
  ReviewLanguage,
  Record<
    | (typeof SATISFACTION_VALUES)[number]
    | (typeof PLAY_EXPERIENCE_VALUES)[number]
    | (typeof INFLOW_VALUES)[number]
    | (typeof SEQUEL_VALUES)[number],
    string
  >
> = {
  ko: {
    "🥰 최고예요": "🥰 최고예요",
    "🙂 괜찮아요": "🙂 괜찮아요",
    "🥲 아쉬워요": "🥲 아쉬워요",
    "처음 플레이했어요": "처음 플레이했어요",
    "1~2번 플레이해봤어요": "1~2번 플레이해봤어요",
    "3번 이상 플레이해봤어요": "3번 이상 플레이해봤어요",
    "자주 플레이해요": "자주 플레이해요",
    "공식 홈페이지/SNS": "공식 홈페이지/SNS",
    "지인 추천": "지인 추천",
    검색: "검색",
    커뮤니티: "커뮤니티",
    기타: "기타",
    "꼭 해보고 싶어요": "꼭 해보고 싶어요",
    "관심 있어요": "관심 있어요",
    "잘 모르겠어요": "잘 모르겠어요",
    "아직은 아니에요": "아직은 아니에요",
  },
  en: {
    "🥰 최고예요": "🥰 Excellent",
    "🙂 괜찮아요": "🙂 Good",
    "🥲 아쉬워요": "🥲 Not for me",
    "처음 플레이했어요": "This was my first time",
    "1~2번 플레이해봤어요": "I have played 1-2 times",
    "3번 이상 플레이해봤어요": "I have played 3+ times",
    "자주 플레이해요": "I play often",
    "공식 홈페이지/SNS": "Official website/SNS",
    "지인 추천": "Friend recommendation",
    검색: "Search",
    커뮤니티: "Community",
    기타: "Other",
    "꼭 해보고 싶어요": "Definitely interested",
    "관심 있어요": "Interested",
    "잘 모르겠어요": "Not sure",
    "아직은 아니에요": "Not yet",
  },
  ja: {
    "🥰 최고예요": "🥰 最高です",
    "🙂 괜찮아요": "🙂 よかったです",
    "🥲 아쉬워요": "🥲 惜しかったです",
    "처음 플레이했어요": "初めてプレイしました",
    "1~2번 플레이해봤어요": "1〜2回プレイしたことがあります",
    "3번 이상 플레이해봤어요": "3回以上プレイしたことがあります",
    "자주 플레이해요": "よくプレイします",
    "공식 홈페이지/SNS": "公式サイト/SNS",
    "지인 추천": "知人のおすすめ",
    검색: "検索",
    커뮤니티: "コミュニティ",
    기타: "その他",
    "꼭 해보고 싶어요": "ぜひプレイしたいです",
    "관심 있어요": "興味があります",
    "잘 모르겠어요": "まだわかりません",
    "아직은 아니에요": "今はまだです",
  },
};

function buildChoiceOptions<T extends readonly string[]>(
  values: T,
  language: ReviewLanguage
): ChoiceOption[] {
  return values.map((value) => ({
    value,
    label: CHOICE_LABELS[language][value as keyof (typeof CHOICE_LABELS)[ReviewLanguage]],
  }));
}

function localPreviewContext(language: ReviewLanguage): ReviewContext {
  const copy = {
    ko: {
      title: "기억 속의 너 3447",
      nickname: "미리보기 플레이어",
    },
    en: {
      title: "Memory of You 3447",
      nickname: "Preview Player",
    },
    ja: {
      title: "記憶の中の君 3447",
      nickname: "プレビュープレイヤー",
    },
  }[language];

  return {
    env: "staging",
    gameId: PREVIEW_GAME_ID,
    playerId: PREVIEW_PLAYER_ID,
    game: {
      id: PREVIEW_GAME_ID,
      title: copy.title,
      templateId: "preview-template",
      enterCode: "3447",
      imageUrl: "",
    },
    player: {
      id: PREVIEW_PLAYER_ID,
      recordId: "preview-player-record",
      nickname: copy.nickname,
      number: 7,
      sex: "",
      name: "",
      phoneNumber: "",
      email: "",
      age: "",
    },
  };
}

function ChoiceGroup({ label, value, options, onChange }: ChoiceGroupProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-[#1f2937]">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-h-[48px] rounded-md border px-4 py-3 text-left text-sm font-semibold transition ${
                selected
                  ? "border-[#111827] bg-[#111827] text-white"
                  : "border-[#d1d5db] bg-white text-[#374151] hover:border-[#6b7280]"
              }`}
              aria-pressed={selected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-3">
      <span className="text-sm font-semibold text-[#1f2937]">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-y rounded-md border border-[#d1d5db] bg-white px-4 py-3 text-[16px] leading-6 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#111827]"
      />
    </label>
  );
}

function contextErrorMessage(copy: ReviewCopy, status: number, serverError?: string) {
  if (status === 404) {
    return serverError || copy.contextNotFound;
  }

  if (status === 400) {
    return serverError || copy.invalidLink;
  }

  return copy.contextLoadFailed;
}

function submitErrorMessage(copy: ReviewCopy, status: number, serverError?: string) {
  if (status === 502) {
    return copy.submitFailedRetry;
  }

  if (status === 400 || status === 404) {
    return serverError || copy.submitInvalid;
  }

  return copy.submitFailed;
}

export default function PlayroomReviewForm({
  gameId,
  playerId,
  env,
  language,
}: {
  gameId: string;
  playerId: string;
  env: EnvName;
  language: ReviewLanguage;
}) {
  const copy = REVIEW_COPY[language];
  const satisfactionOptions = useMemo(
    () => buildChoiceOptions(SATISFACTION_VALUES, language),
    [language]
  );
  const playExperienceOptions = useMemo(
    () => buildChoiceOptions(PLAY_EXPERIENCE_VALUES, language),
    [language]
  );
  const inflowOptions = useMemo(
    () => buildChoiceOptions(INFLOW_VALUES, language),
    [language]
  );
  const sequelOptions = useMemo(
    () => buildChoiceOptions(SEQUEL_VALUES, language),
    [language]
  );
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const isPreview =
    (gameId === PREVIEW_GAME_ID && playerId === PREVIEW_PLAYER_ID) ||
    (process.env.NODE_ENV === "development" && (!gameId || !playerId));

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (gameId) params.set("gameId", gameId);
    if (playerId) params.set("playerId", playerId);
    params.set("env", env);
    return params.toString();
  }, [env, gameId, playerId]);

  useEffect(() => {
    let cancelled = false;

    async function loadContext() {
      if (isPreview) {
        setLoadState({ status: "ready", context: localPreviewContext(language) });
        return;
      }

      if (!gameId || !playerId) {
        setLoadState({
          status: "error",
          message: copy.missingLink,
        });
        return;
      }

      setLoadState({ status: "loading" });
      try {
        const response = await fetch(`/api/playroom/review?${query}`, {
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => null)) as
          | { success?: boolean; data?: ReviewContext; error?: string }
          | null;

        if (cancelled) return;
        if (!response.ok || !payload?.success || !payload.data) {
          setLoadState({
            status: "error",
            message: contextErrorMessage(copy, response.status, payload?.error),
          });
          return;
        }
        setLoadState({ status: "ready", context: payload.data });
      } catch {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: copy.contextLoadFailedShort,
          });
        }
      }
    }

    loadContext();
    return () => {
      cancelled = true;
    };
  }, [copy, gameId, isPreview, language, playerId, query]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (submitState.status === "error") setSubmitState({ status: "idle" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loadState.status !== "ready" || !form.satisfaction) {
      setSubmitState({
        status: "error",
        message: copy.validationSatisfaction,
      });
      return;
    }

    setSubmitState({ status: "submitting" });
    if (isPreview) {
      window.setTimeout(() => {
        setSubmitState({ status: "success" });
      }, 250);
      return;
    }

    try {
      const response = await fetch("/api/playroom/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          playerId,
          env,
          ...form,
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.success) {
        setSubmitState({
          status: "error",
          message: submitErrorMessage(copy, response.status, payload?.error),
        });
        return;
      }
      setSubmitState({ status: "success" });
    } catch {
      setSubmitState({
        status: "error",
        message: copy.submitFailedShort,
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f0] px-5 py-24 text-[#111827] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#6b7280]">
            {copy.eyebrow}
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            {copy.title}
          </h1>
        </header>

        {loadState.status === "loading" && (
          <section className="rounded-md border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#4b5563]">
              {copy.loading}
            </p>
          </section>
        )}

        {loadState.status === "error" && (
          <section className="rounded-md border border-[#fca5a5] bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-[#991b1b]">
              {copy.unavailableTitle}
            </h2>
            <p className="text-sm leading-6 text-[#7f1d1d]">{loadState.message}</p>
          </section>
        )}

        {loadState.status === "ready" && (
          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-[#e5e7eb] bg-white p-5 shadow-sm sm:p-7"
          >
            <section className="mb-8 border-b border-[#e5e7eb] pb-5">
              <p className="text-sm text-[#6b7280]">{copy.targetLabel}</p>
              <h2 className="mt-1 text-xl font-bold leading-8">
                {copy.contextTitle(loadState.context)}
              </h2>
              {loadState.context.env === "staging" && (
                <span className="mt-3 inline-flex rounded-md bg-[#fef3c7] px-3 py-1 text-xs font-bold text-[#92400e]">
                  staging
                </span>
              )}
            </section>

            <div className="space-y-8">
              <ChoiceGroup
                label={copy.satisfactionLabel}
                value={form.satisfaction}
                options={satisfactionOptions}
                onChange={(value) => update("satisfaction", value)}
              />
              <ChoiceGroup
                label={copy.playExperienceLabel}
                value={form.playExperience}
                options={playExperienceOptions}
                onChange={(value) => update("playExperience", value)}
              />
              <ChoiceGroup
                label={copy.inflowLabel}
                value={form.inflowSource}
                options={inflowOptions}
                onChange={(value) => update("inflowSource", value)}
              />
              <TextAreaField
                label={copy.recommendationTargetLabel}
                value={form.recommendationTarget}
                placeholder={copy.recommendationTargetPlaceholder}
                onChange={(value) => update("recommendationTarget", value)}
              />
              <TextAreaField
                label={copy.charmPointLabel}
                value={form.charmPoint}
                placeholder={copy.charmPointPlaceholder}
                onChange={(value) => update("charmPoint", value)}
              />
              <ChoiceGroup
                label={copy.sequelInterestLabel}
                value={form.sequelInterest}
                options={sequelOptions}
                onChange={(value) => update("sequelInterest", value)}
              />
              <TextAreaField
                label={copy.additionalCommentLabel}
                value={form.additionalComment}
                placeholder={copy.additionalCommentPlaceholder}
                onChange={(value) => update("additionalComment", value)}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[#e5e7eb] pt-6">
              <button
                type="submit"
                disabled={submitState.status === "submitting"}
                className="min-h-[52px] rounded-md bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#374151] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
              >
                {submitState.status === "submitting"
                  ? copy.submitLoading
                  : copy.submitIdle}
              </button>
              {submitState.status === "success" && (
                <p className="rounded-md bg-[#ecfdf5] px-4 py-3 text-sm font-semibold text-[#047857]">
                  {copy.submitSuccess}
                </p>
              )}
              {submitState.status === "error" && (
                <p className="rounded-md bg-[#fef2f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
                  {submitState.message}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
