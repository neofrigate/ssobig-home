"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { PlaytestLocale } from "../locales";

type FormState = {
  name: string;
  email: string;
  country: string;
  selectedTemplateId: string;
  experience: string;
  source: string[];
  sourceOther: string;
  motivation: string[];
  motivationOther: string;
  consent: boolean;
};

type LocaleOption = {
  value: PlaytestLocale;
  label: string;
};

type LanguagePromptCopy = {
  title: string;
  body: string;
  cancel: string;
  confirm: string;
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

type PlaytestTemplateOption = {
  slug: string;
  templateId: Record<PlaytestLocale, string>;
  titleKo: string;
  titleEn: string;
  titleJa: string;
  titleZh: string;
  sourceTitle: string;
  playersLabel: string;
  rating: string;
  imageUrl: string;
  detailUrl: Record<PlaytestLocale, string>;
};

type StoryOptionSourceItem = {
  sourceTitle: string;
  imageUrl: string;
  playersLabel: string;
  rating: string;
  templateIds: string[];
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  country: "",
  selectedTemplateId: "",
  experience: "",
  source: [],
  sourceOther: "",
  motivation: [],
  motivationOther: "",
  consent: false,
};

const PLAYTEST_TEMPLATE_META: Array<
  Pick<PlaytestTemplateOption, "slug" | "templateId" | "titleKo" | "titleEn" | "titleJa" | "titleZh"> & {
    sourceAliases: string[];
  }
> = [
  {
    slug: "snow-white-poison-apple",
    templateId: {
      ko: "c2439b65-325a-4420-ad22-fa7e415b6cde",
      en: "7d5476dd-776e-49eb-9722-f254a66c268b",
      ja: "7d5476dd-776e-49eb-9722-f254a66c268b",
      zh: "7d5476dd-776e-49eb-9722-f254a66c268b",
    },
    titleKo: "백설공주의 독사과",
    titleEn: "Snow White and the Poison Apple",
    titleJa: "白雪姫と毒りんご",
    titleZh: "白雪公主与毒苹果",
    sourceAliases: ["백설공주의 독사과", "백설공주와 독사과"],
  },
  {
    slug: "memory-of-you",
    templateId: {
      ko: "0bb6fcf7-20f8-4651-8652-fda5852657b0",
      en: "3716e34f-69f3-4e0d-aa0a-9c5235ca0f44",
      ja: "3716e34f-69f3-4e0d-aa0a-9c5235ca0f44",
      zh: "3716e34f-69f3-4e0d-aa0a-9c5235ca0f44",
    },
    titleKo: "기억 속의 너",
    titleEn: "You in My Memory",
    titleJa: "記憶の中の君",
    titleZh: "记忆中的你",
    sourceAliases: ["기억 속의 너"],
  },
  {
    slug: "night-island",
    templateId: {
      ko: "1ac66ad7-014d-451b-b800-b4ca072f7737",
      en: "a116adab-50ae-47d4-b5af-f77fd803e2f5",
      ja: "a116adab-50ae-47d4-b5af-f77fd803e2f5",
      zh: "a116adab-50ae-47d4-b5af-f77fd803e2f5",
    },
    titleKo: "밤 아일랜드",
    titleEn: "Night Island",
    titleJa: "ナイトアイランド",
    titleZh: "夜之岛",
    sourceAliases: ["밤 아일랜드"],
  },
  {
    slug: "sugar-village",
    templateId: {
      ko: "d9ffa689-f3fc-4b37-ac80-e2bfa8438c2c",
      en: "de60e4a2-9a08-4327-9f08-d3abccc141f8",
      ja: "de60e4a2-9a08-4327-9f08-d3abccc141f8",
      zh: "de60e4a2-9a08-4327-9f08-d3abccc141f8",
    },
    titleKo: "슈가빌리지",
    titleEn: "Sugar Village",
    titleJa: "シュガービレッジ",
    titleZh: "糖果村",
    sourceAliases: ["슈가빌리지"],
  },
  {
    slug: "empress-murder",
    templateId: {
      ko: "d20f00fd-f9bf-4fff-8478-887fad5637f3",
      en: "fa858e0b-a33a-432c-aa67-2a80c5e4efb9",
      ja: "fa858e0b-a33a-432c-aa67-2a80c5e4efb9",
      zh: "fa858e0b-a33a-432c-aa67-2a80c5e4efb9",
    },
    titleKo: "황후마마 살인사건",
    titleEn: "Her Majesty the Empress Murder Case",
    titleJa: "皇后様殺人事件",
    titleZh: "皇后陛下杀人事件",
    sourceAliases: ["황후마마 살인사건"],
  },
  {
    slug: "my-happy-story",
    templateId: {
      ko: "c5770c78-9fd9-447a-b9a7-41eabe2a5adf",
      en: "9162c042-2fe3-4835-a609-fe3495777bb5",
      ja: "9162c042-2fe3-4835-a609-fe3495777bb5",
      zh: "9162c042-2fe3-4835-a609-fe3495777bb5",
    },
    titleKo: "마이 해피 스토리",
    titleEn: "My Happy Story",
    titleJa: "マイ・ハッピーストーリー",
    titleZh: "我的快乐故事",
    sourceAliases: ["마이 해피 스토리"],
  },
  {
    slug: "doppelganger",
    templateId: {
      ko: "3e7a2f6e-52a9-4f4d-9650-ab87f1e64172",
      en: "3b231691-450e-11f1-95ac-b1113dae1ca1",
      ja: "3b231691-450e-11f1-95ac-b1113dae1ca1",
      zh: "3b231691-450e-11f1-95ac-b1113dae1ca1",
    },
    titleKo: "도플갱어",
    titleEn: "Doppelganger",
    titleJa: "ドッペルゲンガー",
    titleZh: "替身",
    sourceAliases: ["도플갱어"],
  },
];

function normalizeTitle(value: string) {
  return value.replace(/\s+/g, "").trim();
}

function getLocalizedTemplateTitle(
  option: Pick<PlaytestTemplateOption, "titleKo" | "titleEn" | "titleJa" | "titleZh">,
  locale: PlaytestLocale
) {
  if (locale === "ko") return option.titleKo;
  if (locale === "ja") return option.titleJa;
  if (locale === "zh") return option.titleZh;
  return option.titleEn;
}

function getLanguagePromptCopy(
  currentLocale: PlaytestLocale,
  targetLocale: PlaytestLocale
): LanguagePromptCopy {
  const targetLabels = {
    ko: { ko: "한국어", en: "Korean", ja: "韓国語", zh: "韩文" },
    en: { ko: "영어", en: "English", ja: "英語", zh: "英文" },
    ja: { ko: "일본어", en: "Japanese", ja: "日本語", zh: "日文" },
    zh: { ko: "중국어", en: "Chinese", ja: "中国語", zh: "中文" },
  } as const;

  if (currentLocale === "ko") {
    return {
      title: `${targetLabels[targetLocale].ko}로 보시겠어요?`,
      body:
        "언어를 바꾸면 현재 작성 중인 내용은 사라집니다. 다음 페이지에서 해당 언어 신청서를 볼 수 있습니다.",
      cancel: "계속 작성하기",
      confirm: `${targetLabels[targetLocale].ko} 신청서 보기`,
    };
  }

  if (currentLocale === "ja") {
    return {
      title: `${targetLabels[targetLocale].ja}版を表示しますか？`,
      body:
        "言語を切り替えると、現在入力中の内容は消えます。次のページで該当言語のフォームを表示できます。",
      cancel: "このまま入力する",
      confirm: `${targetLabels[targetLocale].ja}版フォームを見る`,
    };
  }

  if (currentLocale === "zh") {
    return {
      title: `要切换到${targetLabels[targetLocale].zh}版吗？`,
      body:
        "切换语言后，当前填写的内容会被清除。你可以在下一页继续填写对应语言版本的表单。",
      cancel: "继续填写当前内容",
      confirm: `查看${targetLabels[targetLocale].zh}版表单`,
    };
  }

  return {
    title: `View this form in ${targetLabels[targetLocale].en}?`,
    body:
      "Your current answers will be lost when you switch languages. You can continue on the next page in the selected language.",
    cancel: "Stay here",
    confirm: `View ${targetLabels[targetLocale].en} form`,
  };
}

const PLAYTEST_TEMPLATE_META_BY_TITLE = new Map(
  PLAYTEST_TEMPLATE_META.flatMap((item) =>
    item.sourceAliases.map((alias) => [normalizeTitle(alias), item] as const)
  )
);

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
    eyebrow: "ssobig PLAYROOM",
    title: "Early Access Playtest",
    intro:
      "Try ssobig's English-first story mystery games before launch and share your feedback. Selected testers will receive a free play coupon by email.",
    sourcePattern: "Playtest form",
    howItWorks: {
      title: "How it works",
      items: [
        "Submit this form.",
        "We review applications and email selected testers within 3-5 business days.",
        "Selected testers receive a free play coupon and access instructions by email.",
        "Play on web, Android, or iOS, then share brief feedback after playing.",
      ],
    },
    sections: {
      profile: {
        step: "Q1",
        title: "How can we contact you?",
        description: "We will only use this email for playtest access and follow-up.",
      },
      group: {
        step: "Q2",
        title: "Which ssobig title would you most like to try?",
        description: "Choose one title you want to play first.",
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
      detail: "Details",
      rating: "Rating",
      consent:
        "I agree to receive playtest access, coupons, and follow-up emails from ssobig.",
      submit: "Apply for playtest",
      submitting: "Submitting...",
      languageSwitch: "EN",
    },
    placeholders: {
      name: "Alex",
      email: "alex@example.com",
      country: "Select country or region",
      sourceOther: "Tell us where",
      motivationOther: "Tell us what else you want to evaluate",
    },
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
      "Preview mode: your submission was saved locally for testing, but the production collection endpoint is not connected yet.",
    storyOptionsLoading: "Loading available titles...",
    storyOptionsError:
      "We could not load the title list right now. Please refresh and try again.",
    storyInfoLinkLabel: "(Click) See title details here",
    languageSwitch: {
      title: "View this form in Korean?",
      body:
        "Your current answers will be lost when you switch languages. You can continue in Korean on the next page.",
      cancel: "Stay here",
      confirm: "View Korean form",
    },
  },
  ko: {
    eyebrow: "ssobig PLAYROOM",
    title: "얼리 액세스 사전 체험 신청",
    intro:
      "쏘빅의 영어권 스토리 추리게임을 정식 출시 전에 먼저 체험하고 의견을 남겨주세요. 선정된 테스터에게는 무료 플레이 쿠폰을 이메일로 보내드립니다.",
    sourcePattern: "Playtest form",
    howItWorks: {
      title: "진행 방식",
      items: [
        "신청서를 제출해주세요.",
        "신청 내용을 확인한 뒤 선정된 분께 3-5영업일 내 이메일로 안내드립니다.",
        "선정된 테스터에게 무료 플레이 쿠폰과 접속 방법을 보내드립니다.",
        "웹, Android, iOS에서 플레이한 뒤 간단한 피드백을 남겨주세요.",
      ],
    },
    sections: {
      profile: {
        step: "Q1",
        title: "연락받을 정보를 알려주세요.",
        description: "플레이 권한과 후속 안내 이메일 발송에만 사용합니다.",
      },
      group: {
        step: "Q2",
        title: "어떤 쏘빅 작품을 가장 해보고 싶나요?",
        description: "가장 먼저 체험해보고 싶은 작품 하나를 선택해주세요.",
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
      detail: "상세보기",
      rating: "평점",
      consent:
        "쏘빅의 플레이테스트 권한, 쿠폰, 후속 안내 이메일 수신에 동의합니다.",
      submit: "플레이테스트 신청하기",
      submitting: "신청 제출 중...",
      languageSwitch: "KO",
    },
    placeholders: {
      name: "Alex",
      email: "alex@example.com",
      country: "국가 또는 지역 선택",
      sourceOther: "알게 된 경로를 적어주세요",
      motivationOther: "추가로 확인하고 싶은 내용을 적어주세요",
    },
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
      "미리보기 모드: 제출 내용은 로컬 테스트용으로 저장되었지만, 운영 수집 엔드포인트는 아직 연결되지 않았습니다.",
    storyOptionsLoading: "체험 가능한 작품을 불러오는 중입니다...",
    storyOptionsError:
      "작품 목록을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.",
    storyInfoLinkLabel: "(클릭) 작품정보는 여기서 확인하세요",
    languageSwitch: {
      title: "영어로 보시겠어요?",
      body:
        "언어를 바꾸면 현재 작성 중인 내용은 사라집니다. 다음 페이지에서 영어로 신청서를 볼 수 있습니다.",
      cancel: "계속 작성하기",
      confirm: "영어 신청서 보기",
    },
  },
  ja: {
    eyebrow: "ssobig PLAYROOM",
    title: "先行体験テスター応募",
    intro:
      "ssobigの英語圏向けストーリーミステリーゲームを正式リリース前に体験し、ご意見をお聞かせください。選ばれたテスターには無料プレイクーポンをメールでお送りします。",
    sourcePattern: "Playtest form",
    howItWorks: {
      title: "参加の流れ",
      items: [
        "このフォームを送信してください。",
        "内容を確認後、選ばれた方へ3〜5営業日以内にメールでご案内します。",
        "選ばれたテスターには無料プレイクーポンとアクセス方法をメールでお送りします。",
        "Web、Android、iOSでプレイ後、簡単なフィードバックをお寄せください。",
      ],
    },
    sections: {
      profile: {
        step: "Q1",
        title: "連絡先情報を教えてください。",
        description: "プレイ権限とご案内メール送信のためだけに使用します。",
      },
      group: {
        step: "Q2",
        title: "最初に体験してみたいssobig作品はどれですか？",
        description: "最も体験してみたい作品を1つ選んでください。",
      },
      experience: {
        step: "Q3",
        title: "推理ゲーム経験はどれに近いですか？",
        description: "最も近いものを選んでください。",
      },
      source: {
        step: "Q4",
        title: "このプレイテストをどこで知りましたか？",
        description: "当てはまるものをすべて選んでください。",
      },
      motivation: {
        step: "Q5",
        title: "どの部分を重点的に見てみたいですか？",
        description: "短くても大丈夫です。",
      },
    },
    labels: {
      name: "名前またはニックネーム",
      email: "メールアドレス",
      country: "国または地域",
      sourceOther: "その他の経路",
      motivationOther: "その他メモ",
      detail: "詳細を見る",
      rating: "評価",
      consent:
        "ssobigからのプレイテスト権限、クーポン、フォローアップメールの受信に同意します。",
      submit: "プレイテストに応募する",
      submitting: "送信中...",
      languageSwitch: "JA",
    },
    placeholders: {
      name: "Alex",
      email: "alex@example.com",
      country: "国または地域を選択",
      sourceOther: "知ったきっかけを入力してください",
      motivationOther: "追加で確認したい内容を入力してください",
    },
    experienceOptions: [
      "マーダーミステリーは初めて",
      "デジタル推理ゲームの経験あり",
      "オフライン/ボードゲーム型マーダーミステリーの経験あり",
      "ゲーム進行/ホスト経験あり",
    ],
    sourceOptions: ["Reddit", "Discord", "Facebookグループ", "BoardGameGeek", "知人の紹介", "その他"],
    motivationOptions: [
      "翻訳の自然さ",
      "ストーリー進行の流れ",
      "初回体験",
      "グループプレイ",
      "決済フロー",
      "その他",
    ],
    validation: {
      required: "必須項目を入力してください。",
      email: "有効なメールアドレスを入力してください。",
      consent: "プレイテスト案内メールの受信に同意してください。",
      sourceOther: "その他の経路を入力してください。",
      motivationOther: "その他メモを入力してください。",
      generic: "応募を送信できませんでした。しばらくしてから再度お試しください。",
    },
    successTitle: "応募を受け付けました",
    successBody:
      "ありがとうございます。選ばれた場合は、プレイ権限とクーポン案内をメールでお送りします。",
    dryRunNote:
      "プレビューモード: 送信内容はローカルテスト用に保存されましたが、本番収集エンドポイントはまだ接続されていません。",
    storyOptionsLoading: "体験可能な作品を読み込み中です...",
    storyOptionsError:
      "作品一覧を読み込めませんでした。ページを更新してもう一度お試しください。",
    storyInfoLinkLabel: "（クリック）作品情報はこちらで確認してください",
    languageSwitch: {
      title: "英語版を表示しますか？",
      body:
        "言語を切り替えると、現在入力中の内容は消えます。次のページで英語版フォームを表示できます。",
      cancel: "このまま入力する",
      confirm: "英語版フォームを見る",
    },
  },
  zh: {
    eyebrow: "ssobig PLAYROOM",
    title: "抢先体验测试报名",
    intro:
      "欢迎在正式上线前体验ssobig面向英语用户的剧情推理游戏，并向我们分享你的反馈。入选的测试者将通过电子邮件收到免费游玩优惠券。",
    sourcePattern: "Playtest form",
    howItWorks: {
      title: "参与流程",
      items: [
        "请先提交这份表单。",
        "我们会审核申请，并在3到5个工作日内向入选者发送邮件。",
        "入选测试者将通过邮件收到免费游玩优惠券和访问方式。",
        "请在Web、Android或iOS上体验后，提交简短反馈。",
      ],
    },
    sections: {
      profile: {
        step: "Q1",
        title: "请填写联系方式。",
        description: "仅用于发送游玩权限和后续通知邮件。",
      },
      group: {
        step: "Q2",
        title: "你最想先体验哪一部ssobig作品？",
        description: "请选择你最想先体验的一部作品。",
      },
      experience: {
        step: "Q3",
        title: "你的推理游戏经验更接近哪一项？",
        description: "请选择最接近的一项。",
      },
      source: {
        step: "Q4",
        title: "你是通过哪里了解到这次测试的？",
        description: "请选择所有符合的渠道。",
      },
      motivation: {
        step: "Q5",
        title: "你最想重点体验哪些部分？",
        description: "简短填写也可以。",
      },
    },
    labels: {
      name: "姓名或昵称",
      email: "电子邮箱",
      country: "国家或地区",
      sourceOther: "其他渠道",
      motivationOther: "其他备注",
      detail: "查看详情",
      rating: "评分",
      consent:
        "我同意接收ssobig发送的测试资格、优惠券以及后续通知邮件。",
      submit: "报名参加测试",
      submitting: "提交中...",
      languageSwitch: "中文",
    },
    placeholders: {
      name: "Alex",
      email: "alex@example.com",
      country: "请选择国家或地区",
      sourceOther: "请填写了解渠道",
      motivationOther: "请填写你想进一步体验的内容",
    },
    experienceOptions: [
      "第一次接触谋杀之谜",
      "有数字推理游戏经验",
      "有线下/桌游类谋杀之谜经验",
      "有主持或带局经验",
    ],
    sourceOptions: ["Reddit", "Discord", "Facebook小组", "BoardGameGeek", "朋友推荐", "其他"],
    motivationOptions: [
      "翻译是否自然",
      "剧情推进节奏",
      "首次上手体验",
      "多人游玩体验",
      "支付流程",
      "其他",
    ],
    validation: {
      required: "请填写必填项。",
      email: "请输入有效的电子邮箱地址。",
      consent: "请同意接收测试通知邮件。",
      sourceOther: "请填写其他渠道。",
      motivationOther: "请填写其他备注。",
      generic: "提交申请失败，请稍后再试。",
    },
    successTitle: "报名已提交",
    successBody:
      "感谢你的报名。如被选中，我们将通过电子邮件发送游玩权限和优惠券说明。",
    dryRunNote:
      "预览模式：提交内容已保存到本地测试记录中，但尚未连接正式收集接口。",
    storyOptionsLoading: "正在加载可体验作品...",
    storyOptionsError:
      "无法加载作品列表，请刷新页面后重试。",
    storyInfoLinkLabel: "（点击）请在这里查看作品信息",
    languageSwitch: {
      title: "要切换到英文版吗？",
      body:
        "切换语言后，当前填写的内容会被清除。你可以在下一页继续填写英文版表单。",
      cancel: "继续填写当前内容",
      confirm: "查看英文版表单",
    },
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
      className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-[#FF7A59] md:h-12 md:rounded-xl md:px-4"
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
      className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-black/30 px-3 text-sm text-white outline-none transition focus:border-[#FF7A59] md:h-12 md:rounded-xl md:px-4"
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
      className={`inline-flex w-fit max-w-full rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition md:rounded-xl md:px-4 md:py-3 ${
        selected
          ? "border-[#FF7A59] bg-[#FF7A59] text-[#050505] shadow-[0_12px_30px_rgba(255,122,89,0.25)]"
          : "border-white/15 bg-white/[0.03] text-white/78 hover:border-white/30 hover:bg-white/[0.06]"
      }`}
    >
      {label}
    </button>
  );
}

function TemplateCardButton({
  locale,
  option,
  ratingLabel,
  selected,
  onClick,
}: {
  locale: PlaytestLocale;
  option: PlaytestTemplateOption;
  ratingLabel: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border text-left transition md:rounded-xl ${
        selected
          ? "border-[#FF7A59] bg-[#140E0B] shadow-[0_14px_32px_rgba(255,122,89,0.18)]"
          : "border-white/12 bg-white/[0.03] hover:border-white/28 hover:bg-white/[0.05]"
      }`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className="block w-full text-left"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20">
          <Image
            src={option.imageUrl}
            alt={getLocalizedTemplateTitle(option, locale)}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            unoptimized={option.imageUrl.startsWith("https://")}
          />
        </div>
        <div className="border-t border-white/8 p-2.5 md:p-3">
          <p className="text-[11px] font-semibold leading-5 text-white md:text-sm">
            {getLocalizedTemplateTitle(option, locale)}
          </p>
          <p className="mt-1 text-[11px] text-white/52 md:text-xs">
            {option.playersLabel} · {ratingLabel} {option.rating}
          </p>
        </div>
      </button>
    </div>
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
    <section className="border-b border-white/10 py-6 last:border-b-0 md:py-8">
      <div className="mb-4 md:mb-5">
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
  const router = useRouter();
  const copy = content[locale];
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<PlaytestLocale | null>(null);
  const [storySourceItems, setStorySourceItems] = useState<StoryOptionSourceItem[]>([]);
  const [storyOptionsError, setStoryOptionsError] = useState("");
  const localeOptions: LocaleOption[] = [
    { value: "ko", label: "한국어" },
    { value: "en", label: "English" },
    { value: "ja", label: "日本語" },
    { value: "zh", label: "中文" },
  ];
  const languagePromptCopy = pendingLocale
    ? getLanguagePromptCopy(locale, pendingLocale)
    : null;

  const playtestOptions = useMemo<PlaytestTemplateOption[]>(
    () => {
      const seenSlugs = new Set<string>();

      return storySourceItems.flatMap((item) => {
        const meta = PLAYTEST_TEMPLATE_META_BY_TITLE.get(
          normalizeTitle(item.sourceTitle)
        );
        const fallbackTemplateId = item.templateIds.find(Boolean) ?? "";
        const slug =
          meta?.slug || normalizeTitle(item.sourceTitle).toLowerCase() || item.sourceTitle;

        if (seenSlugs.has(slug)) {
          return [];
        }
        seenSlugs.add(slug);

        return [{
          slug,
          templateId: {
            ko: meta?.templateId.ko ?? fallbackTemplateId,
            en: meta?.templateId.en ?? fallbackTemplateId,
            ja:
              meta?.templateId.ja ??
              meta?.templateId.en ??
              fallbackTemplateId,
            zh:
              meta?.templateId.zh ??
              meta?.templateId.en ??
              fallbackTemplateId,
          },
          titleKo: meta?.titleKo ?? item.sourceTitle,
          titleEn: meta?.titleEn ?? item.sourceTitle,
          titleJa: meta?.titleJa ?? meta?.titleEn ?? item.sourceTitle,
          titleZh: meta?.titleZh ?? meta?.titleEn ?? item.sourceTitle,
          sourceTitle: item.sourceTitle,
          playersLabel: item.playersLabel,
          rating: item.rating,
          imageUrl: item.imageUrl,
          detailUrl: {
            ko: `https://tool.ssobig.com/templates/${meta?.templateId.ko ?? fallbackTemplateId}`,
            en: `https://tool.ssobig.com/templates/${meta?.templateId.en ?? fallbackTemplateId}`,
            ja: `https://tool.ssobig.com/templates/${meta?.templateId.ja ?? meta?.templateId.en ?? fallbackTemplateId}`,
            zh: `https://tool.ssobig.com/templates/${meta?.templateId.zh ?? meta?.templateId.en ?? fallbackTemplateId}`,
          },
        }];
      });
    },
    [storySourceItems]
  );

  const selectedTemplate = useMemo(
    () =>
      playtestOptions.find(
        (option) => option.templateId[locale] === form.selectedTemplateId
      ) ?? null,
    [form.selectedTemplateId, locale, playtestOptions]
  );

  useEffect(() => {
    const displayLocale =
      locale === "ko" ? "ko" : locale === "ja" ? "ja" : locale === "zh" ? "zh-CN" : "en";
    const displayNames = new Intl.DisplayNames([displayLocale], {
      type: "region",
    });
    const englishNames = new Intl.DisplayNames(["en"], {
      type: "region",
    });

    setCountryOptions(
      COUNTRY_CODES.map((code) => ({
        code,
        label: displayNames.of(code) ?? code,
        value: englishNames.of(code) ?? code,
      })).sort((a, b) => {
        if (a.code === "KR") return -1;
        if (b.code === "KR") return 1;
        return a.label.localeCompare(b.label, displayLocale);
      })
    );
  }, [locale]);

  useEffect(() => {
    let cancelled = false;

    async function loadStoryOptions() {
      try {
        setStoryOptionsError("");
        const response = await fetch("/api/playroom/playtest/story-options", {
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => null)) as
          | { items?: StoryOptionSourceItem[]; error?: string }
          | null;

        if (!response.ok || !payload?.items) {
          throw new Error(payload?.error || copy.storyOptionsError);
        }

        if (cancelled) return;
        setStorySourceItems(payload.items);
      } catch (error) {
        if (cancelled) return;
        setStorySourceItems([]);
        setStoryOptionsError(
          error instanceof Error ? error.message : copy.storyOptionsError
        );
      }
    }

    loadStoryOptions();

    return () => {
      cancelled = true;
    };
  }, [copy.storyOptionsError]);

  useEffect(() => {
    if (!playtestOptions.length) return;

    setForm((current) => {
      const hasValidSelection = playtestOptions.some(
        (option) => option.templateId[locale] === current.selectedTemplateId
      );
      if (hasValidSelection) return current;
      return {
        ...current,
        selectedTemplateId: playtestOptions[0].templateId[locale],
      };
    });
  }, [locale, playtestOptions]);

  const requiresSourceOther = form.source.includes("Other") || form.source.includes("기타");
  const requiresMotivationOther =
    form.motivation.includes("Other") || form.motivation.includes("기타");

  const validationError = useMemo(() => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.country.trim() ||
      !form.selectedTemplateId ||
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
          groupSize: selectedTemplate?.playersLabel ?? "",
          motivation,
          pageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
          selectedTemplateId: selectedTemplate?.templateId[locale] ?? "",
          selectedTemplateTitle:
            locale === "ko"
              ? selectedTemplate?.sourceTitle ?? selectedTemplate?.titleKo ?? ""
              : getLocalizedTemplateTitle(
                  selectedTemplate ?? {
                    titleKo: "",
                    titleEn: "",
                    titleJa: "",
                    titleZh: "",
                  },
                  locale
                ),
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

      <div className="relative mx-auto max-w-3xl px-4 py-10 md:px-5 md:py-20">
        <header className="mb-2 border-b border-white/10 pb-7 md:pb-10">
          <div className="mb-4 flex items-center justify-between gap-4 md:mb-5">
            <p className="text-lg font-semibold tracking-[0.28em] text-[#FFB38A] md:text-xl">
              {copy.eyebrow}
            </p>
            <select
              aria-label="Language"
              value={locale}
              onChange={(event) => {
                const nextLocale = event.target.value as PlaytestLocale;
                if (nextLocale === locale) return;
                setPendingLocale(nextLocale);
                setShowLanguagePrompt(true);
              }}
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium text-white/72 outline-none transition hover:border-white/25 hover:text-white md:rounded-xl md:px-4"
            >
              {localeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <h1 className="mt-4 break-keep text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 break-keep text-base leading-7 text-white/72 md:text-lg">
            {copy.intro}
          </p>

          <div className="mt-7 border-t border-white/10 pt-4 md:mt-8 md:pt-5">
            <p className="text-sm font-semibold text-white">
              {copy.howItWorks.title}
            </p>
            <ol className="mt-3 text-sm leading-6 text-white/65">
              {copy.howItWorks.items.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-3 border-t border-white/8 py-3 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-[#FFB38A]">
                    {index + 1}
                  </span>
                  <span className="break-keep">{item}</span>
                </li>
              ))}
            </ol>
          </div>

        </header>

        <form onSubmit={handleSubmit}>
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
            {storyOptionsError ? (
              <div className="rounded-lg border border-[#FF7A59]/20 bg-[#120C0A] px-3 py-2.5 text-sm text-[#FFD3C4] md:rounded-xl md:px-4 md:py-3">
                {storyOptionsError}
              </div>
          ) : playtestOptions.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white/65 md:rounded-xl md:px-4 md:py-3">
              {copy.storyOptionsLoading}
            </div>
          ) : (
            <div>
              <a
                href="https://www.ssobig.com/playroom"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-3 inline-flex text-sm font-medium text-white/62 underline underline-offset-4 transition hover:text-white md:mb-4"
              >
                {copy.storyInfoLinkLabel}
              </a>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {playtestOptions.map((option) => (
                  <TemplateCardButton
                    key={option.slug}
                    locale={locale}
                    option={option}
                    ratingLabel={copy.labels.rating}
                    selected={form.selectedTemplateId === option.templateId[locale]}
                    onClick={() =>
                      update("selectedTemplateId", option.templateId[locale])
                    }
                  />
                ))}
              </div>
            </div>
          )}
          </Section>

          <Section {...copy.sections.experience}>
            <div className="flex flex-wrap gap-3">
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
            <div className="flex flex-wrap gap-3">
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
            <div className="flex flex-wrap gap-3">
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

          <label className="mt-6 flex gap-3 rounded-lg border border-white/10 bg-black/30 p-3 text-sm leading-6 text-white/72 md:mt-7 md:rounded-xl md:p-4">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => update("consent", event.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-[#FF7A59]"
            />
            <span>{copy.labels.consent}</span>
          </label>

          {submitState.status === "error" ? (
            <div className="mt-4 rounded-lg border border-[#FF7A59]/25 bg-[#120C0A] px-3 py-2.5 text-sm text-[#FFD3C4] md:rounded-xl md:px-4 md:py-3">
              {submitState.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-4 flex min-h-12 w-full items-center justify-center rounded-lg bg-[#FF7A59] px-5 text-base font-semibold text-[#050505] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#7F4A3A] disabled:text-white/55 md:min-h-14 md:rounded-xl md:px-6"
          >
            {submitState.status === "submitting"
              ? copy.labels.submitting
              : copy.labels.submit}
          </button>
        </form>
      </div>

      {showLanguagePrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
          <div className="w-full max-w-md rounded-[28px] border border-white/12 bg-[#111111] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <h2 className="break-keep text-xl font-semibold text-white">
              {languagePromptCopy?.title ?? copy.languageSwitch.title}
            </h2>
            <p className="mt-3 break-keep text-sm leading-6 text-white/65">
              {languagePromptCopy?.body ?? copy.languageSwitch.body}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setShowLanguagePrompt(false);
                  setPendingLocale(null);
                }}
                className="min-h-12 rounded-2xl border border-white/12 px-4 text-sm font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
              >
                {languagePromptCopy?.cancel ?? copy.languageSwitch.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!pendingLocale) return;
                  router.push(`/playroom/form/playtest/${pendingLocale}`);
                }}
                className="min-h-12 rounded-2xl bg-[#FF7A59] px-4 text-sm font-semibold text-[#050505] transition hover:brightness-105"
              >
                {languagePromptCopy?.confirm ?? copy.languageSwitch.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
