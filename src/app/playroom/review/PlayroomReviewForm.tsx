"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
  options: string[];
  onChange: (value: string) => void;
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

const SATISFACTION_OPTIONS = ["🥰 최고예요", "🙂 괜찮아요", "🥲 아쉬워요"];
const PLAY_EXPERIENCE_OPTIONS = [
  "처음 플레이했어요",
  "1~2번 플레이해봤어요",
  "3번 이상 플레이해봤어요",
  "자주 플레이해요",
];
const INFLOW_OPTIONS = [
  "공식 홈페이지/SNS",
  "지인 추천",
  "검색",
  "커뮤니티",
  "기타",
];
const SEQUEL_OPTIONS = [
  "꼭 해보고 싶어요",
  "관심 있어요",
  "잘 모르겠어요",
  "아직은 아니에요",
];
const PREVIEW_GAME_ID = "__preview__";
const PREVIEW_PLAYER_ID = "__preview__";
const LOCAL_PREVIEW_CONTEXT: ReviewContext = {
  env: "staging",
  gameId: PREVIEW_GAME_ID,
  playerId: PREVIEW_PLAYER_ID,
  game: {
    id: PREVIEW_GAME_ID,
    title: "기억 속의 너 3447",
    templateId: "preview-template",
    enterCode: "3447",
    imageUrl: "",
  },
  player: {
    id: PREVIEW_PLAYER_ID,
    recordId: "preview-player-record",
    nickname: "미리보기 플레이어",
    number: 7,
    sex: "",
    name: "",
    phoneNumber: "",
    email: "",
    age: "",
  },
};

function ChoiceGroup({ label, value, options, onChange }: ChoiceGroupProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-[#1f2937]">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`min-h-[48px] rounded-md border px-4 py-3 text-left text-sm font-semibold transition ${
                selected
                  ? "border-[#111827] bg-[#111827] text-white"
                  : "border-[#d1d5db] bg-white text-[#374151] hover:border-[#6b7280]"
              }`}
              aria-pressed={selected}
            >
              {option}
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

function contextTitle(context: ReviewContext) {
  const number =
    typeof context.player.number === "number" && context.player.number > 0
      ? `${context.player.number}번 `
      : "";
  return `${context.game.title} / ${number}${context.player.nickname}`;
}

function contextErrorMessage(status: number, serverError?: string) {
  if (status === 404) {
    return serverError || "방 또는 플레이어 정보를 찾을 수 없습니다.";
  }

  if (status === 400) {
    return serverError || "후기 링크가 올바르지 않습니다.";
  }

  return "방과 플레이어 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

function submitErrorMessage(status: number, serverError?: string) {
  if (status === 502) {
    return "후기 저장에 실패했습니다. 잠시 후 다시 제출해 주세요.";
  }

  if (status === 400 || status === 404) {
    return serverError || "후기 링크 또는 입력값을 확인해 주세요.";
  }

  return "후기 제출 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
}

export default function PlayroomReviewForm({
  gameId,
  playerId,
  env,
}: {
  gameId: string;
  playerId: string;
  env: EnvName;
}) {
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
        setLoadState({ status: "ready", context: LOCAL_PREVIEW_CONTEXT });
        return;
      }

      if (!gameId || !playerId) {
        setLoadState({
          status: "error",
          message: "후기 링크에 필요한 정보가 없습니다.",
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
            message: contextErrorMessage(response.status, payload?.error),
          });
          return;
        }
        setLoadState({ status: "ready", context: payload.data });
      } catch {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: "후기 작성 정보를 불러오지 못했습니다.",
          });
        }
      }
    }

    loadContext();
    return () => {
      cancelled = true;
    };
  }, [gameId, isPreview, playerId, query]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (submitState.status === "error") setSubmitState({ status: "idle" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loadState.status !== "ready" || !form.satisfaction) {
      setSubmitState({
        status: "error",
        message: "만족도를 선택해 주세요.",
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
          message: submitErrorMessage(response.status, payload?.error),
        });
        return;
      }
      setSubmitState({ status: "success" });
    } catch {
      setSubmitState({
        status: "error",
        message: "후기를 저장하지 못했습니다.",
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f0] px-5 py-24 text-[#111827] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#6b7280]">
            ssobig playroom
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            플레이 후기
          </h1>
        </header>

        {loadState.status === "loading" && (
          <section className="rounded-md border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#4b5563]">
              후기 작성 정보를 불러오는 중입니다.
            </p>
          </section>
        )}

        {loadState.status === "error" && (
          <section className="rounded-md border border-[#fca5a5] bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-[#991b1b]">
              후기를 작성할 수 없습니다
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
              <p className="text-sm text-[#6b7280]">작성 대상</p>
              <h2 className="mt-1 text-xl font-bold leading-8">
                {contextTitle(loadState.context)}
              </h2>
              {loadState.context.env === "staging" && (
                <span className="mt-3 inline-flex rounded-md bg-[#fef3c7] px-3 py-1 text-xs font-bold text-[#92400e]">
                  staging
                </span>
              )}
            </section>

            <div className="space-y-8">
              <ChoiceGroup
                label="만족도"
                value={form.satisfaction}
                options={SATISFACTION_OPTIONS}
                onChange={(value) => update("satisfaction", value)}
              />
              <ChoiceGroup
                label="플레이 경험"
                value={form.playExperience}
                options={PLAY_EXPERIENCE_OPTIONS}
                onChange={(value) => update("playExperience", value)}
              />
              <ChoiceGroup
                label="유입 경로"
                value={form.inflowSource}
                options={INFLOW_OPTIONS}
                onChange={(value) => update("inflowSource", value)}
              />
              <TextAreaField
                label="추천 대상"
                value={form.recommendationTarget}
                placeholder="이 게임을 누구에게 추천하고 싶은지 적어주세요."
                onChange={(value) => update("recommendationTarget", value)}
              />
              <TextAreaField
                label="매력 포인트"
                value={form.charmPoint}
                placeholder="가장 인상 깊었던 장면, 장치, 분위기를 적어주세요."
                onChange={(value) => update("charmPoint", value)}
              />
              <ChoiceGroup
                label="후속작 관심도"
                value={form.sequelInterest}
                options={SEQUEL_OPTIONS}
                onChange={(value) => update("sequelInterest", value)}
              />
              <TextAreaField
                label="추가 의견"
                value={form.additionalComment}
                placeholder="작가에게 남기고 싶은 말을 자유롭게 적어주세요."
                onChange={(value) => update("additionalComment", value)}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[#e5e7eb] pt-6">
              <button
                type="submit"
                disabled={submitState.status === "submitting"}
                className="min-h-[52px] rounded-md bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#374151] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
              >
                {submitState.status === "submitting" ? "저장 중" : "후기 남기기"}
              </button>
              {submitState.status === "success" && (
                <p className="rounded-md bg-[#ecfdf5] px-4 py-3 text-sm font-semibold text-[#047857]">
                  후기가 저장되었습니다.
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
