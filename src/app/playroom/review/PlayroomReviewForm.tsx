"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
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
    isBot: boolean;
    sex: string;
    name: string;
    phoneNumber: string;
    email: string;
    age: string;
  };
  existingReview?: ExistingReview | null;
};

type ExistingReview = {
  id: number | string;
  sentTime: string;
  satisfaction: string;
  satisfactionCode: string;
  playExperience: string;
  inflowSource: string;
  inflowSourceOther: string;
  recommendationTarget: string;
  charmPoint: string;
  charmPointChoice?: string;
  charmPointOther?: string;
  sequelInterest: string;
  additionalComment: string;
};

type RewardResult = {
  status: "rewarded" | "already_rewarded" | "skipped" | "failed";
  campaignId: string | null;
  couponCode: string | null;
  creditCount: number | null;
  previousCredit: number | null;
  remainCredit: number | null;
  delta: number | null;
  message: string | null;
};

type FormState = {
  satisfaction: string;
  playExperience: string;
  inflowSource: string;
  inflowSourceOther: string;
  recommendationTarget: string;
  charmPoint: string;
  charmPointOther: string;
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
  | { status: "success"; reward: RewardResult | null }
  | { status: "error"; message: string };

type ChoiceGroupProps = {
  questionNumber: string;
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
  rewardNotice: string;
  satisfactionLabel: (context: ReviewContext) => string;
  playExperienceLabel: string;
  inflowLabel: string;
  inflowOtherLabel: string;
  inflowOtherPlaceholder: string;
  recommendationTargetLabel: string;
  charmPointLabel: string;
  charmPointPlaceholder: string;
  sequelInterestLabel: string;
  additionalCommentLabel: string;
  additionalCommentPlaceholder: string;
  submitIdle: string;
  submitEdit: string;
  submitLoading: string;
  submitProgress: string[];
  submitWaitShort: string;
  submitWaitLong: string;
  submitSuccess: string;
  modalTitle: string;
  modalClose: string;
  rewardSuccess: (previous: number | null, next: number | null, delta: number | null) => string;
  rewardAlready: string;
  rewardSkipped: string;
  rewardFailed: string;
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
  botBlockedTitle: string;
  botBlockedMessage: string;
  contextTitle: (context: ReviewContext) => string;
};

const INITIAL_FORM: FormState = {
  satisfaction: "",
  playExperience: "",
  inflowSource: "",
  inflowSourceOther: "",
  recommendationTarget: "",
  charmPoint: "",
  charmPointOther: "",
  sequelInterest: "",
  additionalComment: "",
};

const SATISFACTION_VALUES = ["excellent", "okay", "poor"] as const;
const PLAY_EXPERIENCE_VALUES = [
  "2~5회",
  "6회~15회",
  "16~25회",
  "26회 이상",
] as const;
const INFLOW_VALUES = [
  "온라인 광고",
  "지인 추천",
  "텀블벅 펀딩",
] as const;
const RECOMMENDATION_TARGET_VALUES = [
  "머더 미스터리가 처음인 '입문자'",
  "몇 번 해본 적 있는 '경험자'",
  "추리에 자신 있는 '고인물'",
] as const;
const CHARM_POINT_OTHER_VALUE = "기타 답변 작성하기";
const CHARM_POINT_VALUES = [
  "단서를 모아 범인을 추리하는 과정이 재밌었어요",
  "캐릭터가 되어 연기하고 대화하는 롤플레이가 재밌었어요",
  CHARM_POINT_OTHER_VALUE,
] as const;
const SEQUEL_VALUES = [
  "네 무조건 플레이하고 싶습니다.",
  "주제나 스토리를 보고 결정할 것 같습니다.",
  "아니요, 이번 경험으로 충분합니다.",
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
    title: "플레이 리뷰",
    loading: "리뷰 작성 정보를 불러오는 중입니다.",
    unavailableTitle: "리뷰를 작성할 수 없습니다",
    targetLabel: "작성 대상",
    rewardNotice:
      "리뷰를 작성하시면 쏘빅툴 내 콘텐츠 구매에 사용할 수 있는 30 토큰을 바로 지급합니다.",
    satisfactionLabel: (context) => `"${context.game.title}"의 플레이는 어떠셨나요?`,
    playExperienceLabel: "머더 미스터리 게임을 몇 번 정도 해보셨나요?",
    inflowLabel: "이 게임을 어떻게 알게 되셨나요?",
    inflowOtherLabel: "기타 유입 경로",
    inflowOtherPlaceholder: "어디에서 알게 되었는지 적어주세요.",
    recommendationTargetLabel:
      "친구에게 이 게임을 영업한다면, 누구에게 추천하고 싶나요?",
    charmPointLabel: "이 게임의 매력은 어디에 있었나요?",
    charmPointPlaceholder: "기타 답변을 입력해 주세요.",
    sequelInterestLabel: "다음 작품이 출시된다면 플레이하실 의향이 있으신가요?",
    additionalCommentLabel:
      "작가에게 남기고 싶은 한마디나 후기가 있다면 자유롭게 적어주세요.",
    additionalCommentPlaceholder: "여기 입력하세요",
    submitIdle: "리뷰 남기기",
    submitEdit: "리뷰 수정하기",
    submitLoading: "저장 중",
    submitProgress: [
      "리뷰를 저장하고 있어요.",
      "리뷰 작성 여부를 확인하고 있어요.",
      "30토큰 지급을 처리하고 있어요.",
      "거의 완료되었습니다.",
    ],
    submitWaitShort:
      "리뷰 저장과 토큰 지급을 함께 처리하고 있어 조금 걸릴 수 있습니다.",
    submitWaitLong: "창을 닫지 말고 잠시만 기다려 주세요.",
    submitSuccess: "리뷰가 저장되었습니다.",
    modalTitle: "리뷰 저장 완료",
    modalClose: "확인",
    rewardSuccess: (previous, next, delta) =>
      previous !== null && next !== null
        ? `30토큰 보상이 적용되어 보유 토큰이 ${previous} → ${next}로 늘었습니다. 증가량: +${delta ?? 30}토큰`
        : `30토큰 보상이 적용되었습니다.`,
    rewardAlready: "이 템플릿 리뷰 보상은 이미 지급되어 추가 지급은 없습니다.",
    rewardSkipped: "리뷰는 저장되었지만 보상 지급 대상이 아닙니다.",
    rewardFailed: "리뷰는 저장되었지만 토큰 보상 처리에 실패했습니다. 잠시 후 다시 확인해 주세요.",
    validationSatisfaction: "만족도를 선택해 주세요.",
    missingLink: "리뷰 링크에 필요한 정보가 없습니다.",
    contextNotFound: "방 또는 플레이어 정보를 찾을 수 없습니다.",
    invalidLink: "리뷰 링크가 올바르지 않습니다.",
    contextLoadFailed:
      "방과 플레이어 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    contextLoadFailedShort: "리뷰 작성 정보를 불러오지 못했습니다.",
    submitFailedRetry: "리뷰 저장에 실패했습니다. 잠시 후 다시 제출해 주세요.",
    submitInvalid: "리뷰 링크 또는 입력값을 확인해 주세요.",
    submitFailed: "리뷰 제출 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    submitFailedShort: "리뷰를 저장하지 못했습니다.",
    botBlockedTitle: "리뷰를 작성할 수 없습니다",
    botBlockedMessage: "bot 플레이어는 작성할 수 없습니다.",
    contextTitle: (context) =>
      `${context.game.title} / ${numberPrefixKo(context)}${context.player.nickname}`,
  },
  en: {
    eyebrow: "ssobig playroom",
    title: "Play Review",
    loading: "Loading review details.",
    unavailableTitle: "This review link is unavailable",
    targetLabel: "Reviewing",
    rewardNotice:
      "Submit a review and receive 30 tokens for SsoBig Tool content purchases.",
    satisfactionLabel: (context) => `How was your play of "${context.game.title}"?`,
    playExperienceLabel: "How many murder mystery games have you played?",
    inflowLabel: "How did you find this game?",
    inflowOtherLabel: "Other source",
    inflowOtherPlaceholder: "Tell us where you found this game.",
    recommendationTargetLabel: "Who would you recommend this game to?",
    charmPointLabel: "What was this game's strongest appeal?",
    charmPointPlaceholder: "Enter your own answer.",
    sequelInterestLabel: "Would you play the next title if it is released?",
    additionalCommentLabel:
      "If you have a message or review for the creator, please write it freely.",
    additionalCommentPlaceholder: "Enter your message",
    submitIdle: "Submit Review",
    submitEdit: "Edit Review",
    submitLoading: "Saving",
    submitProgress: [
      "Saving your review.",
      "Checking review status.",
      "Applying the 30-token reward.",
      "Almost done.",
    ],
    submitWaitShort:
      "Saving the review and applying the token reward can take a moment.",
    submitWaitLong: "Please keep this window open for a little longer.",
    submitSuccess: "Your review has been saved.",
    modalTitle: "Review Saved",
    modalClose: "OK",
    rewardSuccess: (previous, next, delta) =>
      previous !== null && next !== null
        ? `A 30-token reward was applied. Your token balance increased from ${previous} to ${next}. Increase: +${delta ?? 30} tokens.`
        : "A 30-token reward was applied.",
    rewardAlready: "You have already received the review reward for this template.",
    rewardSkipped: "Your review was saved, but this submission is not eligible for a reward.",
    rewardFailed: "Your review was saved, but the token reward could not be applied. Please check again later.",
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
    botBlockedTitle: "This review cannot be submitted",
    botBlockedMessage: "Bot players cannot submit reviews.",
    contextTitle: (context) =>
      `${context.game.title} / ${numberPrefixEn(context)}${context.player.nickname}`,
  },
  ja: {
    eyebrow: "ssobig playroom",
    title: "プレイレビュー",
    loading: "レビュー作成情報を読み込んでいます。",
    unavailableTitle: "レビューを作成できません",
    targetLabel: "レビュー対象",
    rewardNotice:
      "レビューを作成すると、SsoBig Tool のコンテンツ購入に使える30トークンをすぐに付与します。",
    satisfactionLabel: (context) => `「${context.game.title}」のプレイはいかがでしたか？`,
    playExperienceLabel: "マーダーミステリーゲームを何回くらいプレイしましたか？",
    inflowLabel: "このゲームをどのように知りましたか？",
    inflowOtherLabel: "その他の流入経路",
    inflowOtherPlaceholder: "どこで知ったか入力してください。",
    recommendationTargetLabel: "友人にすすめるなら、誰にすすめたいですか？",
    charmPointLabel: "このゲームの魅力はどこにありましたか？",
    charmPointPlaceholder: "その他の回答を入力してください。",
    sequelInterestLabel: "次回作が発売されたらプレイしたいですか？",
    additionalCommentLabel:
      "作者に伝えたい一言やレビューがあれば自由に書いてください。",
    additionalCommentPlaceholder: "ここに入力してください",
    submitIdle: "レビューを送信",
    submitEdit: "レビューを修正",
    submitLoading: "保存中",
    submitProgress: [
      "レビューを保存しています。",
      "レビュー作成状況を確認しています。",
      "30トークン特典を処理しています。",
      "まもなく完了します。",
    ],
    submitWaitShort:
      "レビュー保存とトークン付与を同時に処理しているため、少し時間がかかる場合があります。",
    submitWaitLong: "この画面を閉じずに、もう少しお待ちください。",
    submitSuccess: "レビューが保存されました。",
    modalTitle: "レビュー保存完了",
    modalClose: "確認",
    rewardSuccess: (previous, next, delta) =>
      previous !== null && next !== null
        ? `30トークンの特典が適用され、保有トークンが ${previous} → ${next} に増えました。増加量: +${delta ?? 30}トークン`
        : "30トークンの特典が適用されました。",
    rewardAlready: "このテンプレートのレビュー特典はすでに付与されています。",
    rewardSkipped: "レビューは保存されましたが、特典付与の対象ではありません。",
    rewardFailed: "レビューは保存されましたが、トークン特典を適用できませんでした。しばらくしてから確認してください。",
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
    botBlockedTitle: "レビューを作成できません",
    botBlockedMessage: "bot プレイヤーはレビューを作成できません。",
    contextTitle: (context) =>
      `${context.game.title} / ${numberPrefixJa(context)}${context.player.nickname}`,
  },
};

const CHOICE_LABELS: Record<ReviewLanguage, Record<string, string>> = {
  ko: {
    excellent: "🥰 최고예요",
    okay: "🙂 괜찮아요",
    poor: "🥲 아쉬워요",
    "2~5회": "2~5회",
    "6회~15회": "6회~15회",
    "16~25회": "16~25회",
    "26회 이상": "26회 이상",
    "온라인 광고": "온라인 광고",
    "지인 추천": "지인 추천",
    "텀블벅 펀딩": "텀블벅 펀딩",
    "머더 미스터리가 처음인 '입문자'": "머더 미스터리가 처음인 '입문자'",
    "몇 번 해본 적 있는 '경험자'": "몇 번 해본 적 있는 '경험자'",
    "추리에 자신 있는 '고인물'": "추리에 자신 있는 '고인물'",
    "단서를 모아 범인을 추리하는 과정이 재밌었어요":
      "단서를 모아 범인을 추리하는 과정이 재밌었어요",
    "캐릭터가 되어 연기하고 대화하는 롤플레이가 재밌었어요":
      "캐릭터가 되어 연기하고 대화하는 롤플레이가 재밌었어요",
    [CHARM_POINT_OTHER_VALUE]: "기타 답변 작성하기",
    "네 무조건 플레이하고 싶습니다.": "네 무조건 플레이하고 싶습니다.",
    "주제나 스토리를 보고 결정할 것 같습니다.":
      "주제나 스토리를 보고 결정할 것 같습니다.",
    "아니요, 이번 경험으로 충분합니다.": "아니요, 이번 경험으로 충분합니다.",
  },
  en: {
    excellent: "🥰 Excellent",
    okay: "🙂 Good",
    poor: "🥲 Not for me",
    "2~5회": "2-5",
    "6회~15회": "6-15",
    "16~25회": "16-25",
    "26회 이상": "26+",
    "온라인 광고": "Online ad",
    "지인 추천": "Friend recommendation",
    "텀블벅 펀딩": "Tumblbug funding",
    "머더 미스터리가 처음인 '입문자'": "Murder mystery beginners",
    "몇 번 해본 적 있는 '경험자'": "Players with some experience",
    "추리에 자신 있는 '고인물'": "Confident deduction fans",
    "단서를 모아 범인을 추리하는 과정이 재밌었어요":
      "Collecting clues and deducing the culprit was fun.",
    "캐릭터가 되어 연기하고 대화하는 롤플레이가 재밌었어요":
      "Role-playing and talking in character was fun.",
    [CHARM_POINT_OTHER_VALUE]: "Write another answer",
    "네 무조건 플레이하고 싶습니다.": "Yes, definitely.",
    "주제나 스토리를 보고 결정할 것 같습니다.":
      "I would decide after seeing the theme or story.",
    "아니요, 이번 경험으로 충분합니다.": "No, this experience was enough.",
  },
  ja: {
    excellent: "🥰 最高です",
    okay: "🙂 よかったです",
    poor: "🥲 惜しかったです",
    "2~5회": "2〜5回",
    "6회~15회": "6〜15回",
    "16~25회": "16〜25回",
    "26회 이상": "26回以上",
    "온라인 광고": "オンライン広告",
    "지인 추천": "知人のおすすめ",
    "텀블벅 펀딩": "Tumblbugファンディング",
    "머더 미스터리가 처음인 '입문자'": "マーダーミステリー初心者",
    "몇 번 해본 적 있는 '경험자'": "何度か遊んだ経験者",
    "추리에 자신 있는 '고인물'": "推理に自信がある上級者",
    "단서를 모아 범인을 추리하는 과정이 재밌었어요":
      "手がかりを集めて犯人を推理する過程が楽しかったです。",
    "캐릭터가 되어 연기하고 대화하는 롤플레이가 재밌었어요":
      "キャラクターになって演じ、会話するロールプレイが楽しかったです。",
    [CHARM_POINT_OTHER_VALUE]: "その他の回答を書く",
    "네 무조건 플레이하고 싶습니다.": "はい、ぜひプレイしたいです。",
    "주제나 스토리를 보고 결정할 것 같습니다.":
      "テーマやストーリーを見て決めたいです。",
    "아니요, 이번 경험으로 충분합니다.": "いいえ、今回の体験で十分です。",
  },
};

function buildChoiceOptions<T extends readonly string[]>(
  values: T,
  language: ReviewLanguage
): ChoiceOption[] {
  return values.map((value) => ({
    value,
    label: CHOICE_LABELS[language][value] || value,
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
      isBot: false,
      sex: "",
      name: "",
      phoneNumber: "",
      email: "",
      age: "",
    },
    existingReview: null,
  };
}

function normalizeExistingSatisfaction(review: ExistingReview) {
  const code = review.satisfactionCode || review.satisfaction;
  const normalized = code.toLowerCase();
  if (normalized.includes("excellent") || review.satisfaction.includes("최고")) {
    return "excellent";
  }
  if (normalized.includes("okay") || review.satisfaction.includes("괜찮")) {
    return "okay";
  }
  if (normalized.includes("poor") || review.satisfaction.includes("아쉬")) {
    return "poor";
  }
  return "";
}

function normalizeExistingChoice(
  value: string,
  options: readonly string[]
) {
  return options.includes(value) ? value : "";
}

function normalizeExistingCharmPoint(review: ExistingReview) {
  const savedChoice = review.charmPointChoice || "";
  const savedOther = review.charmPointOther || "";
  const savedValue = review.charmPoint || "";
  if (CHARM_POINT_VALUES.includes(savedChoice as (typeof CHARM_POINT_VALUES)[number])) {
    return {
      charmPoint: savedChoice,
      charmPointOther:
        savedChoice === CHARM_POINT_OTHER_VALUE ? savedOther || savedValue : "",
    };
  }
  if (CHARM_POINT_VALUES.includes(savedValue as (typeof CHARM_POINT_VALUES)[number])) {
    return {
      charmPoint: savedValue,
      charmPointOther: "",
    };
  }
  if (savedValue) {
    return {
      charmPoint: CHARM_POINT_OTHER_VALUE,
      charmPointOther: savedOther || savedValue,
    };
  }
  return {
    charmPoint: "",
    charmPointOther: "",
  };
}

function formFromExistingReview(review: ExistingReview | null | undefined): FormState {
  if (!review) return INITIAL_FORM;
  const charmPoint = normalizeExistingCharmPoint(review);
  return {
    satisfaction: normalizeExistingSatisfaction(review),
    playExperience: normalizeExistingChoice(review.playExperience, PLAY_EXPERIENCE_VALUES),
    inflowSource: normalizeExistingChoice(review.inflowSource, INFLOW_VALUES),
    inflowSourceOther: review.inflowSourceOther || "",
    recommendationTarget: normalizeExistingChoice(
      review.recommendationTarget,
      RECOMMENDATION_TARGET_VALUES
    ),
    charmPoint: charmPoint.charmPoint,
    charmPointOther: charmPoint.charmPointOther,
    sequelInterest: normalizeExistingChoice(review.sequelInterest, SEQUEL_VALUES),
    additionalComment: review.additionalComment || "",
  };
}

function rewardMessage(copy: ReviewCopy, reward: RewardResult | null) {
  if (!reward) return copy.rewardSkipped;
  if (reward.status === "rewarded") {
    return copy.rewardSuccess(reward.previousCredit, reward.remainCredit, reward.delta);
  }
  if (reward.status === "already_rewarded") {
    return copy.rewardAlready;
  }
  if (reward.status === "failed") {
    return copy.rewardFailed;
  }
  return copy.rewardSkipped;
}

function QuestionShell({
  questionNumber,
  label,
  children,
}: {
  questionNumber: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <p className="text-xs font-bold uppercase text-[#b875ff]">{questionNumber}</p>
      <h3 className="text-sm font-bold leading-6 text-white">{label}</h3>
      {children}
    </section>
  );
}

function ChoiceGroup({
  questionNumber,
  label,
  value,
  options,
  onChange,
}: ChoiceGroupProps) {
  return (
    <QuestionShell questionNumber={questionNumber} label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-h-[36px] rounded px-4 py-2 text-left text-xs font-bold leading-5 shadow-sm transition ${
                selected
                  ? "bg-[#f3e8ff] text-[#111827] ring-2 ring-[#c084fc]"
                  : "bg-black text-white hover:bg-[#2f2439]"
              }`}
              aria-pressed={selected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </QuestionShell>
  );
}

function TextAreaField({
  questionNumber,
  label,
  value,
  placeholder,
  onChange,
}: {
  questionNumber: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <QuestionShell questionNumber={questionNumber} label={label}>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-y rounded-none border-2 border-[#c084fc] bg-black/20 px-4 py-3 text-[16px] leading-6 text-white outline-none transition placeholder:text-[#c7bdd3] focus:border-[#e9d5ff]"
      />
    </QuestionShell>
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
  if (status === 403) {
    return serverError || copy.botBlockedMessage;
  }

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
  const recommendationTargetOptions = useMemo(
    () => buildChoiceOptions(RECOMMENDATION_TARGET_VALUES, language),
    [language]
  );
  const charmPointOptions = useMemo(
    () => buildChoiceOptions(CHARM_POINT_VALUES, language),
    [language]
  );
  const sequelOptions = useMemo(
    () => buildChoiceOptions(SEQUEL_VALUES, language),
    [language]
  );
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [submitElapsedMs, setSubmitElapsedMs] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [hasExistingReview, setHasExistingReview] = useState(false);
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
        setHasExistingReview(false);
        setForm(INITIAL_FORM);
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
        const existingReview = payload.data.existingReview || null;
        setHasExistingReview(Boolean(existingReview));
        setForm(formFromExistingReview(existingReview));
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

  useEffect(() => {
    if (submitState.status !== "submitting") {
      setSubmitElapsedMs(0);
      return;
    }
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setSubmitElapsedMs(Date.now() - startedAt);
    }, 250);
    return () => window.clearInterval(timer);
  }, [submitState.status]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "inflowSource" && value !== "기타") {
        next.inflowSourceOther = "";
      }
      if (key === "charmPoint" && value !== CHARM_POINT_OTHER_VALUE) {
        next.charmPointOther = "";
      }
      return next;
    });
    if (submitState.status === "error") setSubmitState({ status: "idle" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loadState.status === "ready" && loadState.context.player.isBot) {
      setSubmitState({
        status: "error",
        message: copy.botBlockedMessage,
      });
      return;
    }
    if (loadState.status !== "ready" || !form.satisfaction) {
      setSubmitState({
        status: "error",
        message: copy.validationSatisfaction,
      });
      return;
    }

    const resolvedCharmPoint =
      form.charmPoint === CHARM_POINT_OTHER_VALUE
        ? form.charmPointOther.trim()
        : form.charmPoint;

    setSubmitState({ status: "submitting" });
    if (isPreview) {
      window.setTimeout(() => {
        setHasExistingReview(true);
        setSubmitState({
          status: "success",
          reward: {
            status: "rewarded",
            campaignId: "review_preview-template",
            couponCode: "PREV-IEW1",
            creditCount: 30,
            previousCredit: 10,
            remainCredit: 40,
            delta: 30,
            message: null,
          },
        });
      }, 1800);
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
          charmPoint: resolvedCharmPoint,
          charmPointChoice: form.charmPoint,
          charmPointOther: form.charmPointOther,
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; data?: { reward?: RewardResult | null }; error?: string }
        | null;

      if (!response.ok || !payload?.success) {
        setSubmitState({
          status: "error",
          message: submitErrorMessage(copy, response.status, payload?.error),
        });
        return;
      }
      setHasExistingReview(true);
      setSubmitState({ status: "success", reward: payload.data?.reward || null });
    } catch {
      setSubmitState({
        status: "error",
        message: copy.submitFailedShort,
      });
    }
  }

  const submitProgressIndex = Math.min(
    Math.floor(submitElapsedMs / 1600),
    copy.submitProgress.length - 1
  );

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

        {loadState.status === "ready" && loadState.context.player.isBot && (
          <section className="rounded-md border border-[#fca5a5] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#6b7280]">{copy.targetLabel}</p>
            <h2 className="mt-1 text-xl font-bold leading-8 text-[#111827]">
              {copy.contextTitle(loadState.context)}
            </h2>
            <div className="mt-5 rounded-md bg-[#fef2f2] px-4 py-3">
              <h3 className="text-base font-bold text-[#991b1b]">
                {copy.botBlockedTitle}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#b91c1c]">
                {copy.botBlockedMessage}
              </p>
            </div>
          </section>
        )}

        {loadState.status === "ready" && !loadState.context.player.isBot && (
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-md border border-[#2f2439] bg-[#111827] text-white shadow-sm"
          >
            <section className="border-b border-white/10 bg-[#f8f7f2] p-5 text-[#111827] sm:p-7">
              <p className="text-sm text-[#6b7280]">{copy.targetLabel}</p>
              <h2 className="mt-1 text-xl font-bold leading-8">
                {copy.contextTitle(loadState.context)}
              </h2>
              <p className="mt-4 rounded-md bg-[#fff7ed] px-4 py-3 text-sm font-semibold leading-6 text-[#7c2d12]">
                {copy.rewardNotice}
              </p>
              {loadState.context.env === "staging" && (
                <span className="mt-3 inline-flex rounded-md bg-[#fef3c7] px-3 py-1 text-xs font-bold text-[#92400e]">
                  staging
                </span>
              )}
            </section>

            <fieldset
              disabled={submitState.status === "submitting"}
              className="space-y-8 bg-[radial-gradient(circle_at_45%_20%,rgba(192,132,252,0.20),transparent_30%),linear-gradient(180deg,#17202d_0%,#1f1a27_45%,#15121c_100%)] p-5 disabled:opacity-80 sm:p-7"
            >
              <ChoiceGroup
                questionNumber="Q1"
                label={copy.satisfactionLabel(loadState.context)}
                value={form.satisfaction}
                options={satisfactionOptions}
                onChange={(value) => update("satisfaction", value)}
              />
              <ChoiceGroup
                questionNumber="Q2"
                label={copy.playExperienceLabel}
                value={form.playExperience}
                options={playExperienceOptions}
                onChange={(value) => update("playExperience", value)}
              />
              <ChoiceGroup
                questionNumber="Q3"
                label={copy.inflowLabel}
                value={form.inflowSource}
                options={inflowOptions}
                onChange={(value) => update("inflowSource", value)}
              />
              {form.inflowSource === "기타" ? (
                <TextAreaField
                  questionNumber="Q3"
                  label={copy.inflowOtherLabel}
                  value={form.inflowSourceOther}
                  placeholder={copy.inflowOtherPlaceholder}
                  onChange={(value) => update("inflowSourceOther", value)}
                />
              ) : null}
              <ChoiceGroup
                questionNumber="Q4"
                label={copy.recommendationTargetLabel}
                value={form.recommendationTarget}
                options={recommendationTargetOptions}
                onChange={(value) => update("recommendationTarget", value)}
              />
              <ChoiceGroup
                questionNumber="Q5"
                label={copy.charmPointLabel}
                value={form.charmPoint}
                options={charmPointOptions}
                onChange={(value) => update("charmPoint", value)}
              />
              {form.charmPoint === CHARM_POINT_OTHER_VALUE ? (
                <TextAreaField
                  questionNumber="Q5"
                  label={copy.charmPointPlaceholder}
                  value={form.charmPointOther}
                  placeholder={copy.charmPointPlaceholder}
                  onChange={(value) => update("charmPointOther", value)}
                />
              ) : null}
              <ChoiceGroup
                questionNumber="Q6"
                label={copy.sequelInterestLabel}
                value={form.sequelInterest}
                options={sequelOptions}
                onChange={(value) => update("sequelInterest", value)}
              />
              <TextAreaField
                questionNumber="Q7 (선택)"
                label={copy.additionalCommentLabel}
                value={form.additionalComment}
                placeholder={copy.additionalCommentPlaceholder}
                onChange={(value) => update("additionalComment", value)}
              />
            </fieldset>

            <div className="flex flex-col gap-3 border-t border-white/10 bg-[#f8f7f2] p-5 sm:p-7">
              <button
                type="submit"
                disabled={submitState.status === "submitting"}
                className="min-h-[52px] rounded-md bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#374151] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
              >
                {submitState.status === "submitting"
                  ? copy.submitLoading
                  : hasExistingReview
                    ? copy.submitEdit
                    : copy.submitIdle}
              </button>
              {submitState.status === "submitting" && (
                <div className="rounded-md border border-[#e5e7eb] bg-white px-4 py-3 text-sm leading-6 text-[#374151]">
                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                    <div
                      className="h-full rounded-full bg-[#7c3aed] transition-all duration-300"
                      style={{
                        width: `${Math.min(92, 18 + submitProgressIndex * 24)}%`,
                      }}
                    />
                  </div>
                  <p className="font-bold text-[#111827]">
                    {copy.submitProgress[submitProgressIndex]}
                  </p>
                  {submitElapsedMs >= 2200 && (
                    <p className="mt-1 text-xs font-semibold text-[#6b7280]">
                      {copy.submitWaitShort}
                    </p>
                  )}
                  {submitElapsedMs >= 7000 && (
                    <p className="mt-1 text-xs font-semibold text-[#7c2d12]">
                      {copy.submitWaitLong}
                    </p>
                  )}
                </div>
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
      {submitState.status === "success" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-success-title"
        >
          <section className="w-full max-w-md rounded-md bg-white p-6 shadow-xl">
            <h2
              id="review-success-title"
              className="text-xl font-bold leading-8 text-[#111827]"
            >
              {copy.modalTitle}
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#047857]">
              {copy.submitSuccess}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#374151]">
              {rewardMessage(copy, submitState.reward)}
            </p>
            <button
              type="button"
              onClick={() => setSubmitState({ status: "idle" })}
              className="mt-6 min-h-[44px] w-full rounded-md bg-[#111827] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#374151]"
            >
              {copy.modalClose}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
