"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { PlaytestLocale } from "../../playtest/locales";

type FormState = {
  name: string;
  email: string;
  phone: string;
  country: string;
  experience: string;
  selectedTemplateId: string;
  motivation: string;
  consent: boolean;
};

type Attribution = {
  sourceType: "influencer" | "overseas_beta";
  campaignSlug: string;
  sourcePlatform: string;
  influencerId: string;
  influencerSlug: string;
  displayName: string;
  couponCampaignId: string;
  customMessage: string;
};

type StoryOptionSourceItem = {
  sourceTitle: string;
  imageUrl: string;
  playersLabel: string;
  rating: string;
  templateIds: string[];
};

type CountryOption = {
  code: string;
  label: string;
  value: string;
};

type MarketingTemplateOption = {
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
};

const PUBLIC_INFLUENCER_API =
  "https://tlyioijsopxeegzfjlqe.supabase.co/functions/v1/marketing-management-api/public/marketing-influencers";

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  country: "",
  experience: "",
  selectedTemplateId: "",
  motivation: "",
  consent: false,
};

const DEFAULT_ATTRIBUTION: Attribution = {
  sourceType: "overseas_beta",
  campaignSlug: "marketing-direct",
  sourcePlatform: "direct",
  influencerId: "",
  influencerSlug: "",
  displayName: "",
  couponCampaignId: "marketing_direct",
  customMessage: "",
};

const MARKETING_TEMPLATE_META: Array<
  Pick<
    MarketingTemplateOption,
    "slug" | "templateId" | "titleKo" | "titleEn" | "titleJa" | "titleZh"
  > & {
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
    titleEn: "Snow White and the Poisoned Apple",
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

const COPY = {
  en: {
    eyebrow: "ssobig REVIEWER ACCESS",
    title: "Reviewer access request",
    intro:
      "If this title looks like a good fit for your blog or channel, submit this form and we will review your request. Selected reviewers receive a free play coupon within 1 business day.",
    howItWorks: {
      title: "How it works",
      items: [
        "Submit this form.",
        "We review requests and email selected players within 1 business day.",
        "Selected reviewers receive a free play coupon and access instructions.",
      ],
    },
    sections: {
      profile: {
        step: "Q1",
        title: "How can we contact you?",
        description:
          "We only use this to deliver your access details and follow-up guidance. A mobile number helps us reach you quickly if coupon delivery needs confirmation.",
      },
      experience: {
        step: "Q2",
        title: "How much murder mystery experience do you have?",
        description: "Choose the closest option.",
      },
      product: {
        step: "Q3",
        title: "Which ssobig title would you most like to try?",
        description: "Choose one scenario you want to review first.",
      },
      note: {
        step: "Q4",
        title: "Anything we should know?",
        description: "Preferred play date, review plan, or questions are helpful.",
      },
    },
    labels: {
      name: "Name or nickname",
      email: "Email",
      phone: "Mobile phone",
      country: "Country or region",
      note: "Notes",
      rating: "Rating",
      consent:
        "I agree to receive beta access, coupons, and follow-up emails from ssobig.",
      submit: "Submit request",
      submitting: "Submitting...",
    },
    fields: {
      note: "Preferred play date, review plan, or questions",
    },
    experienceOptions: [
      "New to murder mystery",
      "Played digital mystery games",
      "Played tabletop murder mystery",
      "Hosted games before",
    ],
    validation: {
      required: "Please fill in all required fields.",
      email: "Please enter a valid email address.",
      consent: "Please agree to receive access emails.",
      generic: "We could not submit your request. Please try again later.",
    },
    successTitle: "Request received",
    successBody:
      "Thanks. We will review it and send coupon instructions within 1 business day.",
    storyOptionsLoading: "Loading available titles...",
    storyOptionsError:
      "We could not load the title list right now. Please refresh and try again.",
    storyInfoLinkLabel: "(Click) See title details here",
  },
  ko: {
    eyebrow: "ssobig REVIEWER ACCESS",
    title: "리뷰어 체험 신청",
    intro:
      "블로그나 SNS에 소개해보고 싶은 작품이 있다면 편하게 신청해주세요. 신청 내용을 확인한 뒤, 선정된 분께는 1~3일 내로 바로 시작할 수 있는 무료 체험 쿠폰과 안내를 보내드립니다.",
    howItWorks: {
      title: "진행 방식",
      items: [
        "신청서를 제출해주세요.",
        "신청 내용을 확인한 뒤 1~3일 내로 메일로 안내드립니다.",
        "선정된 분께 바로 시작할 수 있는 무료 체험 쿠폰과 접속 안내를 보내드립니다.",
      ],
    },
    sections: {
      profile: {
        step: "Q1",
        title: "연락받을 정보를 알려주세요.",
        description:
          "체험권과 후속 안내를 보내드릴 때만 사용합니다. 휴대폰 번호는 쿠폰이나 접속 안내 전달이 필요한 경우 빠르게 확인드리기 위한 용도입니다.",
      },
      experience: {
        step: "Q2",
        title: "머더미스터리 경험은 어느 쪽에 가까운가요?",
        description: "가장 가까운 항목을 선택해주세요.",
      },
      product: {
        step: "Q3",
        title: "어떤 쏘빅 작품을 체험하고 싶나요?",
        description: "가장 먼저 리뷰해보고 싶은 작품 하나를 선택해주세요.",
      },
      note: {
        step: "Q4",
        title: "추가로 알려주실 내용이 있나요?",
        description: "희망 플레이 일정이나 리뷰 계획이 있으면 함께 적어주세요.",
      },
    },
    labels: {
      name: "이름 또는 닉네임",
      email: "이메일",
      phone: "휴대폰 번호",
      country: "국가 또는 지역",
      note: "추가 메모",
      rating: "평점",
      consent: "쏘빅의 체험권, 쿠폰, 후속 안내 이메일 수신에 동의합니다.",
      submit: "체험 신청하기",
      submitting: "제출 중...",
    },
    fields: {
      note: "희망 플레이 일정, 리뷰 계획, 궁금한 점",
    },
    experienceOptions: [
      "머더미스터리는 처음",
      "디지털 추리게임 경험 있음",
      "오프라인/보드게임형 머더미스터리 경험 있음",
      "게임 진행/호스트 경험 있음",
    ],
    validation: {
      required: "필수 항목을 입력해주세요.",
      email: "올바른 이메일 주소를 입력해주세요.",
      consent: "체험 안내 이메일 수신에 동의해주세요.",
      generic: "신청을 제출하지 못했습니다. 잠시 후 다시 시도해주세요.",
    },
    successTitle: "신청이 접수되었습니다",
    successBody:
      "감사합니다. 확인 후 1~3일 내로 바로 시작할 수 있는 무료 체험 쿠폰과 안내를 보내드리겠습니다.",
    storyOptionsLoading: "체험 가능한 작품을 불러오는 중입니다...",
    storyOptionsError:
      "작품 목록을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.",
    storyInfoLinkLabel: "(클릭) 작품정보는 여기서 확인하세요",
  },
  ja: {
    eyebrow: "ssobig REVIEWER ACCESS",
    title: "レビュアー体験申込み",
    intro:
      "ブログやSNSで紹介してみたい作品があれば、気軽に申込みしてください。内容を確認し、選ばれた方には1営業日以内に無料プレイクーポンと案内をお送りします。",
    howItWorks: {
      title: "進行方法",
      items: [
        "このフォームを送信してください。",
        "内容を確認し、1営業日以内にメールでご案内します。",
        "選ばれた方には無料プレイクーポンと案内をお送りします。",
      ],
    },
    sections: {
      profile: {
        step: "Q1",
        title: "連絡先を教えてください。",
        description:
          "体験案内とフォローアップの連絡にのみ使用します。携帯番号はクーポンやアクセス案内の確認が必要な際に、すばやくご連絡するためのものです。",
      },
      experience: {
        step: "Q2",
        title: "マーダーミステリー経験はどれに近いですか？",
        description: "最も近い項目を選んでください。",
      },
      product: {
        step: "Q3",
        title: "どのssobig作品を体験してみたいですか？",
        description: "最初にレビューしてみたい作品を1つ選んでください。",
      },
      note: {
        step: "Q4",
        title: "追加で伝えたいことはありますか？",
        description: "希望プレイ日やレビュー予定があれば記入してください。",
      },
    },
    labels: {
      name: "名前またはニックネーム",
      email: "メールアドレス",
      phone: "携帯電話番号",
      country: "国または地域",
      note: "追加メモ",
      rating: "評価",
      consent: "ssobigからの体験権、クーポン、後続案内メールの受信に同意します。",
      submit: "体験を申し込む",
      submitting: "送信中...",
    },
    fields: {
      note: "希望プレイ日、レビュー予定、質問など",
    },
    experienceOptions: [
      "マーダーミステリーは初めて",
      "デジタル推理ゲームの経験あり",
      "オフライン/ボードゲーム型マーダーミステリーの経験あり",
      "進行役/ホスト経験あり",
    ],
    validation: {
      required: "必須項目を入力してください。",
      email: "正しいメールアドレスを入力してください。",
      consent: "体験案内メールの受信に同意してください。",
      generic: "申込みを送信できませんでした。しばらくしてからもう一度お試しください。",
    },
    successTitle: "申込みを受け付けました",
    successBody:
      "ありがとうございます。確認後、1営業日以内にクーポン案内をお送りします。",
    storyOptionsLoading: "体験可能な作品を読み込み中です...",
    storyOptionsError:
      "作品一覧を読み込めませんでした。ページを更新してもう一度お試しください。",
    storyInfoLinkLabel: "（クリック）作品情報はこちらで確認してください",
  },
  zh: {
    eyebrow: "ssobig REVIEWER ACCESS",
    title: "评测体验申请",
    intro:
      "如果你想在博客或社交平台上介绍这部作品，欢迎填写这份表单。我们会先审核申请，并在1个工作日内向入选者发送免费试玩优惠券和说明。",
    howItWorks: {
      title: "参与方式",
      items: [
        "请先提交这份表单。",
        "我们会审核申请，并在1个工作日内通过邮件联系你。",
        "入选者将收到免费游玩优惠券和访问说明。",
      ],
    },
    sections: {
      profile: {
        step: "Q1",
        title: "请填写联系方式。",
        description:
          "仅用于发送体验资格和后续通知。手机号主要用于在优惠券或访问说明需要确认时，能够更快联系到你。",
      },
      experience: {
        step: "Q2",
        title: "你的谋杀之谜经验更接近哪一项？",
        description: "请选择最接近的一项。",
      },
      product: {
        step: "Q3",
        title: "你最想体验哪一部ssobig作品？",
        description: "请选择你最想优先评测的一部作品。",
      },
      note: {
        step: "Q4",
        title: "还有什么想补充的吗？",
        description: "如果有希望游玩的日期或评测计划，可以一起告诉我们。",
      },
    },
    labels: {
      name: "姓名或昵称",
      email: "电子邮箱",
      phone: "手机号",
      country: "国家或地区",
      note: "补充说明",
      rating: "评分",
      consent: "我同意接收ssobig发送的体验资格、优惠券及后续通知邮件。",
      submit: "提交申请",
      submitting: "提交中...",
    },
    fields: {
      note: "希望游玩的日期、评测计划或问题",
    },
    experienceOptions: [
      "第一次接触谋杀之谜",
      "有数字推理游戏经验",
      "有线下/桌游类谋杀之谜经验",
      "有主持或带局经验",
    ],
    validation: {
      required: "请填写所有必填项。",
      email: "请输入有效的电子邮箱地址。",
      consent: "请同意接收体验通知邮件。",
      generic: "提交申请失败，请稍后再试。",
    },
    successTitle: "申请已提交",
    successBody:
      "感谢你的申请。审核后，我们会在1个工作日内发送优惠券说明。",
    storyOptionsLoading: "正在加载可体验作品...",
    storyOptionsError:
      "无法加载作品列表，请刷新页面后重试。",
    storyInfoLinkLabel: "（点击）请在这里查看作品信息",
  },
} as const;

function normalizeTitle(value: string) {
  return value.replace(/\s+/g, "").trim();
}

function getLocalizedTemplateTitle(
  option: Pick<
    MarketingTemplateOption,
    "titleKo" | "titleEn" | "titleJa" | "titleZh"
  >,
  locale: PlaytestLocale,
) {
  if (locale === "ko") return option.titleKo;
  if (locale === "ja") return option.titleJa;
  if (locale === "zh") return option.titleZh;
  return option.titleEn;
}

const MARKETING_TEMPLATE_META_BY_TITLE = new Map(
  MARKETING_TEMPLATE_META.flatMap((item) =>
    item.sourceAliases.map((alias) => [normalizeTitle(alias), item] as const),
  ),
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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function fieldClass() {
  return "mt-2 h-11 w-full rounded-lg border border-white/12 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-[#FF7A59] md:h-12 md:rounded-xl md:px-4";
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
  option: MarketingTemplateOption;
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

function selectedTemplateOption(
  options: MarketingTemplateOption[],
  locale: PlaytestLocale,
  id: string,
) {
  return options.find((option) => option.templateId[locale] === id) ?? null;
}

export default function MarketingSignupForm({
  locale,
}: {
  locale: PlaytestLocale;
}) {
  const copy = COPY[locale];
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [attribution, setAttribution] =
    useState<Attribution>(DEFAULT_ATTRIBUTION);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [storySourceItems, setStorySourceItems] = useState<
    StoryOptionSourceItem[]
  >([]);
  const [storyOptionsError, setStoryOptionsError] = useState("");
  const [submitState, setSubmitState] = useState<
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success"; dryRun?: boolean }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const marketingOptions = useMemo<MarketingTemplateOption[]>(() => {
    const seenSlugs = new Set<string>();

    return storySourceItems.flatMap((item) => {
      const meta = MARKETING_TEMPLATE_META_BY_TITLE.get(
        normalizeTitle(item.sourceTitle),
      );
      const fallbackTemplateId = item.templateIds.find(Boolean) ?? "";
      const slug =
        meta?.slug ||
        normalizeTitle(item.sourceTitle).toLowerCase() ||
        item.sourceTitle;

      if (seenSlugs.has(slug)) {
        return [];
      }
      seenSlugs.add(slug);

      return [
        {
          slug,
          templateId: {
            ko: meta?.templateId.ko ?? fallbackTemplateId,
            en: meta?.templateId.en ?? fallbackTemplateId,
            ja:
              meta?.templateId.ja ?? meta?.templateId.en ?? fallbackTemplateId,
            zh:
              meta?.templateId.zh ?? meta?.templateId.en ?? fallbackTemplateId,
          },
          titleKo: meta?.titleKo ?? item.sourceTitle,
          titleEn: meta?.titleEn ?? item.sourceTitle,
          titleJa: meta?.titleJa ?? meta?.titleEn ?? item.sourceTitle,
          titleZh: meta?.titleZh ?? meta?.titleEn ?? item.sourceTitle,
          sourceTitle: item.sourceTitle,
          playersLabel: item.playersLabel,
          rating: item.rating,
          imageUrl: item.imageUrl,
        },
      ];
    });
  }, [storySourceItems]);

  const product = useMemo(
    () => selectedTemplateOption(marketingOptions, locale, form.selectedTemplateId),
    [form.selectedTemplateId, locale, marketingOptions],
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
      }),
    );
  }, [locale]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const influencerSlug = params.get("influencer") || params.get("i") || "";
    const sourceType =
      params.get("sourceType") === "influencer"
        ? "influencer"
        : "overseas_beta";
    const nextAttribution: Attribution = {
      sourceType,
      campaignSlug:
        params.get("campaign") || params.get("campaignSlug") || "marketing-direct",
      sourcePlatform:
        params.get("platform") || params.get("sourcePlatform") || "direct",
      influencerId: params.get("influencerId") || "",
      influencerSlug,
      displayName: params.get("name") || "",
      couponCampaignId: params.get("couponCampaignId") || "marketing_direct",
      customMessage: "",
    };
    setAttribution(nextAttribution);

    if (!influencerSlug) return;
    fetch(`${PUBLIC_INFLUENCER_API}/${encodeURIComponent(influencerSlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const item = data?.item;
        if (!item) return;
        setAttribution({
          sourceType:
            item.source_type === "influencer" ? "influencer" : "overseas_beta",
          campaignSlug: item.campaign_slug || nextAttribution.campaignSlug,
          sourcePlatform: item.platform || nextAttribution.sourcePlatform,
          influencerId: String(item.id || ""),
          influencerSlug: item.slug || influencerSlug,
          displayName: item.display_name || nextAttribution.displayName,
          couponCampaignId:
            item.coupon_campaign_id || nextAttribution.couponCampaignId,
          customMessage: item.custom_message || "",
        });
      })
      .catch(() => undefined);
  }, []);

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
          error instanceof Error ? error.message : copy.storyOptionsError,
        );
      }
    }

    loadStoryOptions();

    return () => {
      cancelled = true;
    };
  }, [copy.storyOptionsError]);

  useEffect(() => {
    if (!marketingOptions.length) return;

    setForm((current) => {
      const hasValidSelection = marketingOptions.some(
        (option) => option.templateId[locale] === current.selectedTemplateId,
      );
      if (hasValidSelection) return current;

      return {
        ...current,
        selectedTemplateId: marketingOptions[0].templateId[locale],
      };
    });
  }, [locale, marketingOptions]);

  const validationError = useMemo(() => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      (locale === "ko" && !form.phone.trim()) ||
      !form.country.trim() ||
      !form.experience ||
      !form.selectedTemplateId
    ) {
      return copy.validation.required;
    }
    if (!isValidEmail(form.email)) return copy.validation.email;
    if (!form.consent) return copy.validation.consent;
    return "";
  }, [copy, form, locale]);

  const canSubmit = !validationError && submitState.status !== "submitting";

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !product) {
      setSubmitState({
        status: "error",
        message: validationError || copy.validation.generic,
      });
      return;
    }

    setSubmitState({ status: "submitting" });
    try {
      const sourceLabel =
        attribution.displayName ||
        attribution.influencerSlug ||
        attribution.sourcePlatform;
      const response = await fetch("/api/playroom/playtest/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          groupSize: product.playersLabel,
          experience: form.experience,
          source: [sourceLabel],
          sourceOther: attribution.campaignSlug,
          motivation: form.motivation,
          consent: form.consent,
          pageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
          sourceType: attribution.sourceType,
          campaignSlug: attribution.campaignSlug,
          sourcePlatform: attribution.sourcePlatform,
          influencerId: attribution.influencerId,
          influencerSlug: attribution.influencerSlug,
          selectedTemplateId: product.templateId[locale],
          selectedTemplateTitle: getLocalizedTemplateTitle(product, locale),
          requestedCouponStatus: "pending",
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
        message:
          error instanceof Error ? error.message : copy.validation.generic,
      });
    }
  };

  if (submitState.status === "success") {
    return (
      <div className="min-h-screen bg-[#050505] px-5 py-16 text-white md:py-24">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
          <div className="w-full rounded-[32px] border border-[#FF7A59]/20 bg-[#120C0A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#FFB38A]">
              ssobig
            </p>
            <h1 className="mt-4 break-keep text-3xl font-semibold text-white md:text-5xl">
              {copy.successTitle}
            </h1>
            <p className="mt-4 break-keep text-base leading-7 text-white/72">
              {copy.successBody}
            </p>
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
          <p className="text-lg font-semibold tracking-[0.28em] text-[#FFB38A] md:text-xl">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 break-keep text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 break-keep text-base leading-7 text-white/72 md:text-lg">
            {attribution.customMessage || copy.intro}
          </p>

          {attribution.displayName ? (
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#FF7A59]/25 bg-[#FF7A59]/10 px-3 py-1 text-xs font-semibold text-[#FFD3C4]">
                {attribution.displayName}
              </span>
            </div>
          ) : null}

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
              <label className="text-sm font-medium text-white/80">
                {copy.labels.name}
                <input
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  className={fieldClass()}
                  autoComplete="name"
                />
              </label>
              <label className="text-sm font-medium text-white/80">
                {copy.labels.email}
                <input
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  className={fieldClass()}
                  type="email"
                  autoComplete="email"
                />
              </label>
              {locale === "ko" ? (
                <label className="text-sm font-medium text-white/80">
                  {copy.labels.phone}
                  <input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    className={fieldClass()}
                    type="tel"
                    autoComplete="tel"
                    placeholder="010-0000-0000"
                  />
                </label>
              ) : null}
              <label className="text-sm font-medium text-white/80">
                {copy.labels.country}
                <select
                  value={form.country}
                  onChange={(event) => update("country", event.target.value)}
                  className={fieldClass()}
                >
                  <option value="" disabled>
                    {copy.labels.country}
                  </option>
                  {countryOptions.map((option) => (
                    <option key={option.code} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
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

          <Section {...copy.sections.product}>
            {storyOptionsError ? (
              <div className="rounded-lg border border-[#FF7A59]/20 bg-[#120C0A] px-3 py-2.5 text-sm text-[#FFD3C4] md:rounded-xl md:px-4 md:py-3">
                {storyOptionsError}
              </div>
            ) : marketingOptions.length === 0 ? (
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
                  {marketingOptions.map((option) => (
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

          <Section {...copy.sections.note}>
            <label className="text-sm font-medium text-white/80">
              {copy.labels.note}
              <textarea
                value={form.motivation}
                onChange={(event) => update("motivation", event.target.value)}
                placeholder={copy.fields.note}
                className="mt-2 min-h-28 w-full rounded-lg border border-white/12 bg-black/30 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-[#FF7A59] md:rounded-xl md:px-4"
              />
            </label>
          </Section>

          <div className="pt-6 md:pt-8">
            <label className="flex gap-3 rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/72">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) => update("consent", event.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-[#FF7A59]"
              />
              <span>{copy.labels.consent}</span>
            </label>

            {submitState.status === "error" ? (
              <div className="mt-4 rounded-xl border border-[#FF7A59]/25 bg-[#120C0A] px-4 py-3 text-sm text-[#FFD3C4]">
                {submitState.message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-4 flex min-h-14 w-full items-center justify-center rounded-xl bg-[#FF7A59] px-6 text-base font-semibold text-[#050505] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#7F4A3A] disabled:text-white/55"
            >
              {submitState.status === "submitting"
                ? copy.labels.submitting
                : copy.labels.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
