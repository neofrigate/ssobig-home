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
  introDescription: string;
  loading: string;
  loadingHint: string;
  unavailableEyebrow: string;
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
  modalEyebrow: string;
  modalTitle: string;
  modalClose: string;
  optionalQuestionNumber: string;
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

function numberPrefixZh(context: ReviewContext) {
  return typeof context.player.number === "number" && context.player.number > 0
    ? `${context.player.number}号 `
    : "";
}

const REVIEW_COPY: Record<ReviewLanguage, ReviewCopy> = {
  ko: {
    eyebrow: "ssobig playroom",
    title: "플레이 리뷰",
    introDescription:
      "플레이가 끝난 뒤 느낀 점을 남겨주세요. 작성 내용은 다음 플레이룸 콘텐츠를 다듬는 데 사용됩니다.",
    loading: "리뷰 작성 정보를 불러오는 중입니다.",
    loadingHint: "잠시만 기다려 주세요.",
    unavailableEyebrow: "리뷰 링크 확인",
    unavailableTitle: "리뷰를 작성할 수 없습니다",
    targetLabel: "리뷰할 플레이",
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
    modalEyebrow: "제출 완료",
    modalTitle: "리뷰 저장 완료",
    modalClose: "확인",
    optionalQuestionNumber: "Q7 (선택)",
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
    introDescription:
      "Tell us what you thought after playing. Your feedback helps us make future Playroom stories better.",
    loading: "Loading review details.",
    loadingHint: "Please wait a moment.",
    unavailableEyebrow: "Review Link",
    unavailableTitle: "This review link is unavailable",
    targetLabel: "Reviewing This Play",
    rewardNotice:
      "Leave a review and get 30 tokens to use on SsoBig Tool content.",
    satisfactionLabel: (context) => `How was "${context.game.title}"?`,
    playExperienceLabel: "How much murder mystery experience do you have?",
    inflowLabel: "How did you hear about this game?",
    inflowOtherLabel: "Other source",
    inflowOtherPlaceholder: "Tell us where you found this game.",
    recommendationTargetLabel: "Who do you think would enjoy this game most?",
    charmPointLabel: "What stood out to you the most?",
    charmPointPlaceholder: "Write your answer here.",
    sequelInterestLabel: "Would you be interested in playing another story?",
    additionalCommentLabel:
      "Anything else you would like to tell the creator?",
    additionalCommentPlaceholder: "Share any extra thoughts here.",
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
    modalEyebrow: "Submitted",
    modalTitle: "Review Saved",
    modalClose: "OK",
    optionalQuestionNumber: "Q7 (Optional)",
    rewardSuccess: (previous, next, delta) =>
      previous !== null && next !== null
        ? `Your 30-token reward has been added. Your balance is now ${next}, up from ${previous}. +${delta ?? 30} tokens.`
        : "Your 30-token reward has been added.",
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
    introDescription:
      "プレイ後に感じたことをお聞かせください。いただいた内容は今後の Playroom コンテンツ改善に活用します。",
    loading: "レビュー作成情報を読み込んでいます。",
    loadingHint: "少々お待ちください。",
    unavailableEyebrow: "レビューリンク確認",
    unavailableTitle: "レビューを作成できません",
    targetLabel: "レビューするプレイ",
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
    modalEyebrow: "送信完了",
    modalTitle: "レビュー保存完了",
    modalClose: "OK",
    optionalQuestionNumber: "Q7（任意）",
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
  zh: {
    eyebrow: "ssobig playroom",
    title: "游玩评价",
    introDescription:
      "请分享游玩后的感受。你的反馈将用于改进之后的 Playroom 内容。",
    loading: "正在加载评价信息。",
    loadingHint: "请稍候。",
    unavailableEyebrow: "评价链接确认",
    unavailableTitle: "无法填写评价",
    targetLabel: "本次游玩",
    rewardNotice:
      "提交评价后，将立即发放可用于购买 SsoBig Tool 内容的 30 个代币。",
    satisfactionLabel: (context) => `你觉得《${context.game.title}》的游玩体验如何？`,
    playExperienceLabel: "你玩过多少次谋杀推理游戏？",
    inflowLabel: "你是怎么知道这个游戏的？",
    inflowOtherLabel: "其他来源",
    inflowOtherPlaceholder: "请写下你是在哪里知道这个游戏的。",
    recommendationTargetLabel: "如果推荐给朋友，你想推荐给哪类人？",
    charmPointLabel: "这个游戏最吸引你的地方是什么？",
    charmPointPlaceholder: "请输入其他回答。",
    sequelInterestLabel: "如果推出下一部作品，你愿意游玩吗？",
    additionalCommentLabel: "如果有想对作者说的话或评价，请自由填写。",
    additionalCommentPlaceholder: "请在这里输入",
    submitIdle: "提交评价",
    submitEdit: "修改评价",
    submitLoading: "保存中",
    submitProgress: [
      "正在保存评价。",
      "正在确认评价状态。",
      "正在处理 30 个代币奖励。",
      "即将完成。",
    ],
    submitWaitShort: "评价保存和代币发放需要一点时间。",
    submitWaitLong: "请不要关闭窗口，再稍等一下。",
    submitSuccess: "评价已保存。",
    modalEyebrow: "提交完成",
    modalTitle: "评价保存完成",
    modalClose: "OK",
    optionalQuestionNumber: "Q7（可选）",
    rewardSuccess: (previous, next, delta) =>
      previous !== null && next !== null
        ? `30 个代币奖励已发放。你的代币余额从 ${previous} 增加到 ${next}。增加量：+${delta ?? 30} 个代币。`
        : "30 个代币奖励已发放。",
    rewardAlready: "此模板的评价奖励已经发放过，不会重复发放。",
    rewardSkipped: "评价已保存，但本次提交不符合奖励条件。",
    rewardFailed: "评价已保存，但代币奖励处理失败。请稍后再确认。",
    validationSatisfaction: "请选择满意度。",
    missingLink: "评价链接缺少必要信息。",
    contextNotFound: "找不到房间或玩家信息。",
    invalidLink: "评价链接无效。",
    contextLoadFailed: "无法加载房间和玩家信息。请稍后重试。",
    contextLoadFailedShort: "无法加载评价信息。",
    submitFailedRetry: "评价保存失败。请稍后重新提交。",
    submitInvalid: "请检查评价链接或输入内容。",
    submitFailed: "提交评价时发生问题。请稍后重试。",
    submitFailedShort: "无法保存评价。",
    botBlockedTitle: "无法填写评价",
    botBlockedMessage: "Bot 玩家不能提交评价。",
    contextTitle: (context) =>
      `${context.game.title} / ${numberPrefixZh(context)}${context.player.nickname}`,
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
    "2~5회": "A few times",
    "6회~15회": "Several times",
    "16~25회": "Quite a lot",
    "26회 이상": "Very experienced",
    "온라인 광고": "Online ad",
    "지인 추천": "Friend recommendation",
    "텀블벅 펀딩": "Tumblbug funding",
    "머더 미스터리가 처음인 '입문자'": "First-time murder mystery players",
    "몇 번 해본 적 있는 '경험자'": "Players with some mystery game experience",
    "추리에 자신 있는 '고인물'": "Players who love solving tough mysteries",
    "단서를 모아 범인을 추리하는 과정이 재밌었어요":
      "Piecing together clues to find the culprit was fun.",
    "캐릭터가 되어 연기하고 대화하는 롤플레이가 재밌었어요":
      "Getting into character and role-playing with others was fun.",
    [CHARM_POINT_OTHER_VALUE]: "Something else",
    "네 무조건 플레이하고 싶습니다.": "Yes, definitely.",
    "주제나 스토리를 보고 결정할 것 같습니다.":
      "Maybe, depending on the theme and story.",
    "아니요, 이번 경험으로 충분합니다.": "Probably not for now.",
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
  zh: {
    excellent: "🥰 很喜欢",
    okay: "🙂 还不错",
    poor: "🥲 有些可惜",
    "2~5회": "2-5 次",
    "6회~15회": "6-15 次",
    "16~25회": "16-25 次",
    "26회 이상": "26 次以上",
    "온라인 광고": "线上广告",
    "지인 추천": "朋友推荐",
    "텀블벅 펀딩": "Tumblbug 众筹",
    "머더 미스터리가 처음인 '입문자'": "第一次玩谋杀推理的新手",
    "몇 번 해본 적 있는 '경험자'": "玩过几次的有经验玩家",
    "추리에 자신 있는 '고인물'": "对推理有信心的资深玩家",
    "단서를 모아 범인을 추리하는 과정이 재밌었어요":
      "收集线索并推理凶手的过程很有趣。",
    "캐릭터가 되어 연기하고 대화하는 롤플레이가 재밌었어요":
      "扮演角色并进行对话的过程很有趣。",
    [CHARM_POINT_OTHER_VALUE]: "填写其他回答",
    "네 무조건 플레이하고 싶습니다.": "是的，一定想玩。",
    "주제나 스토리를 보고 결정할 것 같습니다.":
      "会根据主题或故事再决定。",
    "아니요, 이번 경험으로 충분합니다.": "不了，这次体验已经足够。",
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
    zh: {
      title: "记忆中的你 3447",
      nickname: "预览玩家",
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
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
          {questionNumber}
        </p>
        <h3 className="break-keep text-xl font-semibold leading-7 text-white md:text-2xl md:leading-8">
          {label}
        </h3>
      </div>
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
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium leading-6 transition ${
                selected
                  ? "border-[#FF7A59] bg-[#FF7A59] text-white shadow-[0_12px_30px_rgba(255,122,89,0.25)]"
                  : "border-white/15 bg-white/[0.03] text-white/78 hover:border-white/30 hover:bg-white/[0.06]"
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
        className="min-h-36 w-full resize-y rounded-2xl border border-white/12 bg-black/30 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-[#FF7A59]"
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
    <main className="min-h-screen bg-[#050505] px-5 py-14 text-white sm:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFB38A]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 break-keep text-base leading-7 text-white/72 md:text-lg">
            {copy.introDescription}
          </p>
          {loadState.status === "ready" && !loadState.context.player.isBot && (
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
                {copy.targetLabel}
              </p>
              <h2 className="mt-3 break-keep text-2xl font-semibold leading-8 text-white md:text-3xl">
                {copy.contextTitle(loadState.context)}
              </h2>
              <p className="mt-5 break-keep text-base font-medium leading-7 text-[#FFD3C4] md:text-lg md:leading-8">
                {copy.rewardNotice}
              </p>
            </div>
          )}
        </header>

        {loadState.status === "loading" && (
          <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#FF7A59]" />
            <p className="text-lg font-medium text-white">
              {copy.loading}
            </p>
            <p className="mt-2 text-sm text-white/55">{copy.loadingHint}</p>
          </section>
        )}

        {loadState.status === "error" && (
          <section className="rounded-[32px] border border-[#FF7A59]/25 bg-[#120C0A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
              {copy.unavailableEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              {copy.unavailableTitle}
            </h2>
            <p className="mt-4 whitespace-pre-line text-base leading-7 text-white/70">
              {loadState.message}
            </p>
          </section>
        )}

        {loadState.status === "ready" && loadState.context.player.isBot && (
          <section className="rounded-[32px] border border-[#FF7A59]/25 bg-[#120C0A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
              {copy.targetLabel}
            </p>
            <h2 className="mt-3 break-keep text-2xl font-semibold leading-8 text-white md:text-3xl">
              {copy.contextTitle(loadState.context)}
            </h2>
            <div className="mt-5 rounded-2xl border border-[#FF7A59]/25 bg-black/25 px-4 py-3">
              <h3 className="text-base font-semibold text-[#FFD3C4]">
                {copy.botBlockedTitle}
              </h3>
              <p className="mt-2 text-sm font-medium leading-6 text-white/70">
                {copy.botBlockedMessage}
              </p>
            </div>
          </section>
        )}

        {loadState.status === "ready" && !loadState.context.player.isBot && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset
              disabled={submitState.status === "submitting"}
              className="space-y-5 disabled:opacity-80"
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
                questionNumber={copy.optionalQuestionNumber}
                label={copy.additionalCommentLabel}
                value={form.additionalComment}
                placeholder={copy.additionalCommentPlaceholder}
                onChange={(value) => update("additionalComment", value)}
              />
            </fieldset>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={submitState.status === "submitting"}
                className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#FF7A59] px-6 text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-wait disabled:bg-[#7F4A3A] disabled:text-white/70"
              >
                {submitState.status === "submitting"
                  ? copy.submitLoading
                  : hasExistingReview
                    ? copy.submitEdit
                    : copy.submitIdle}
              </button>
              {submitState.status === "submitting" && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/70">
                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#FF7A59] transition-all duration-300"
                      style={{
                        width: `${Math.min(92, 18 + submitProgressIndex * 24)}%`,
                      }}
                    />
                  </div>
                  <p className="font-semibold text-white">
                    {copy.submitProgress[submitProgressIndex]}
                  </p>
                  {submitElapsedMs >= 2200 && (
                    <p className="mt-1 text-xs font-medium text-white/50">
                      {copy.submitWaitShort}
                    </p>
                  )}
                  {submitElapsedMs >= 7000 && (
                    <p className="mt-1 text-xs font-medium text-[#FFD3C4]">
                      {copy.submitWaitLong}
                    </p>
                  )}
                </div>
              )}
              {submitState.status === "error" && (
                <p className="whitespace-pre-line rounded-2xl border border-[#FF7A59]/25 bg-[#120C0A] px-4 py-3 text-sm font-medium leading-6 text-[#FFD3C4]">
                  {submitState.message}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
      {submitState.status === "success" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-success-title"
        >
          <section className="w-full max-w-md rounded-[32px] border border-[#FF7A59]/20 bg-[#120C0A] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FFB38A]">
              {copy.modalEyebrow}
            </p>
            <h2
              id="review-success-title"
              className="mt-3 text-2xl font-semibold leading-8 text-white"
            >
              {copy.modalTitle}
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#FFD3C4]">
              {copy.submitSuccess}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {rewardMessage(copy, submitState.reward)}
            </p>
            <button
              type="button"
              onClick={() => setSubmitState({ status: "idle" })}
              className="mt-6 min-h-12 w-full rounded-2xl bg-[#FF7A59] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
            >
              {copy.modalClose}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
