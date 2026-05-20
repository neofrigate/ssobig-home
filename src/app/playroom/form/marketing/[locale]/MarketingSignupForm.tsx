"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlaytestLocale } from "../../playtest/locales";

type FormState = {
  name: string;
  email: string;
  phone: string;
  country: string;
  groupSize: string;
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

type Product = {
  id: string;
  title: string;
  players: string;
  rating: string;
  genre: string;
  href: string;
};

const PUBLIC_INFLUENCER_API =
  "https://tlyioijsopxeegzfjlqe.supabase.co/functions/v1/marketing-management-api/public/marketing-influencers";

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  country: "",
  groupSize: "",
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

const PRODUCTS: Record<PlaytestLocale, Product[]> = {
  en: [
    {
      id: "7d5476dd-776e-49eb-9722-f254a66c268b",
      title: "Snow White and the Poisoned Apple",
      players: "2 players",
      rating: "4.7",
      genre: "Mystery/Fantasy",
      href: "https://tool.ssobig.com/templates/7d5476dd-776e-49eb-9722-f254a66c268b",
    },
    {
      id: "3716e34f-69f3-4e0d-aa0a-9c5235ca0f44",
      title: "In Your Memory",
      players: "2 players",
      rating: "4.2",
      genre: "Emotional/Narrative",
      href: "https://tool.ssobig.com/templates/3716e34f-69f3-4e0d-aa0a-9c5235ca0f44",
    },
    {
      id: "a116adab-50ae-47d4-b5af-f77fd803e2f5",
      title: "Night Island",
      players: "4 players",
      rating: "4.2",
      genre: "Immersive/Mystery",
      href: "https://tool.ssobig.com/templates/a116adab-50ae-47d4-b5af-f77fd803e2f5",
    },
    {
      id: "de60e4a2-9a08-4327-9f08-d3abccc141f8",
      title: "Sugar Village",
      players: "5 players",
      rating: "3.9",
      genre: "Mystery/Thriller",
      href: "https://tool.ssobig.com/templates/de60e4a2-9a08-4327-9f08-d3abccc141f8",
    },
    {
      id: "fa858e0b-a33a-432c-aa67-2a80c5e4efb9",
      title: "The Empress Murder Case",
      players: "7 players",
      rating: "3.9",
      genre: "Historical/Mystery",
      href: "https://tool.ssobig.com/templates/fa858e0b-a33a-432c-aa67-2a80c5e4efb9",
    },
    {
      id: "3b231691-450e-11f1-95ac-b1113dae1ca1",
      title: "Doppelganger",
      players: "4 players",
      rating: "3.6",
      genre: "Sci-fi/Thriller",
      href: "https://tool.ssobig.com/templates/3b231691-450e-11f1-95ac-b1113dae1ca1",
    },
  ],
  ko: [
    {
      id: "c2439b65-325a-4420-ad22-fa7e415b6cde",
      title: "백설공주의 독사과",
      players: "2인",
      rating: "4.7",
      genre: "미스터리/판타지",
      href: "https://tool.ssobig.com/templates/c2439b65-325a-4420-ad22-fa7e415b6cde",
    },
    {
      id: "0bb6fcf7-20f8-4651-8652-fda5852657b0",
      title: "기억 속의 너",
      players: "2인",
      rating: "4.2",
      genre: "감성/서사",
      href: "https://tool.ssobig.com/templates/0bb6fcf7-20f8-4651-8652-fda5852657b0",
    },
    {
      id: "1ac66ad7-014d-451b-b800-b4ca072f7737",
      title: "밤 아일랜드",
      players: "4인",
      rating: "4.2",
      genre: "몰입형/미스터리",
      href: "https://tool.ssobig.com/templates/1ac66ad7-014d-451b-b800-b4ca072f7737",
    },
    {
      id: "d9ffa689-f3fc-4b37-ac80-e2bfa8438c2c",
      title: "슈가빌리지",
      players: "5인",
      rating: "3.9",
      genre: "미스터리/스릴러",
      href: "https://tool.ssobig.com/templates/d9ffa689-f3fc-4b37-ac80-e2bfa8438c2c",
    },
    {
      id: "d20f00fd-f9bf-4fff-8478-887fad5637f3",
      title: "황후마마 살인사건",
      players: "7인",
      rating: "3.9",
      genre: "역사/미스터리",
      href: "https://tool.ssobig.com/templates/d20f00fd-f9bf-4fff-8478-887fad5637f3",
    },
    {
      id: "3e7a2f6e-52a9-4f4d-9650-ab87f1e64172",
      title: "도플갱어",
      players: "4인",
      rating: "3.6",
      genre: "SF/스릴러",
      href: "https://tool.ssobig.com/templates/3e7a2f6e-52a9-4f4d-9650-ab87f1e64172",
    },
  ],
  ja: [
    {
      id: "7d5476dd-776e-49eb-9722-f254a66c268b",
      title: "白雪姫と毒りんご",
      players: "2人",
      rating: "4.7",
      genre: "ミステリー/ファンタジー",
      href: "https://tool.ssobig.com/templates/7d5476dd-776e-49eb-9722-f254a66c268b",
    },
    {
      id: "3716e34f-69f3-4e0d-aa0a-9c5235ca0f44",
      title: "記憶の中の君",
      players: "2人",
      rating: "4.2",
      genre: "感性/ストーリー",
      href: "https://tool.ssobig.com/templates/3716e34f-69f3-4e0d-aa0a-9c5235ca0f44",
    },
    {
      id: "a116adab-50ae-47d4-b5af-f77fd803e2f5",
      title: "ナイトアイランド",
      players: "4人",
      rating: "4.2",
      genre: "没入型/ミステリー",
      href: "https://tool.ssobig.com/templates/a116adab-50ae-47d4-b5af-f77fd803e2f5",
    },
    {
      id: "de60e4a2-9a08-4327-9f08-d3abccc141f8",
      title: "シュガービレッジ",
      players: "5人",
      rating: "3.9",
      genre: "ミステリー/スリラー",
      href: "https://tool.ssobig.com/templates/de60e4a2-9a08-4327-9f08-d3abccc141f8",
    },
    {
      id: "fa858e0b-a33a-432c-aa67-2a80c5e4efb9",
      title: "皇后様殺人事件",
      players: "7人",
      rating: "3.9",
      genre: "歴史/ミステリー",
      href: "https://tool.ssobig.com/templates/fa858e0b-a33a-432c-aa67-2a80c5e4efb9",
    },
    {
      id: "3b231691-450e-11f1-95ac-b1113dae1ca1",
      title: "ドッペルゲンガー",
      players: "4人",
      rating: "3.6",
      genre: "SF/スリラー",
      href: "https://tool.ssobig.com/templates/3b231691-450e-11f1-95ac-b1113dae1ca1",
    },
  ],
  zh: [
    {
      id: "7d5476dd-776e-49eb-9722-f254a66c268b",
      title: "白雪公主与毒苹果",
      players: "2人",
      rating: "4.7",
      genre: "悬疑/奇幻",
      href: "https://tool.ssobig.com/templates/7d5476dd-776e-49eb-9722-f254a66c268b",
    },
    {
      id: "3716e34f-69f3-4e0d-aa0a-9c5235ca0f44",
      title: "记忆中的你",
      players: "2人",
      rating: "4.2",
      genre: "情感/叙事",
      href: "https://tool.ssobig.com/templates/3716e34f-69f3-4e0d-aa0a-9c5235ca0f44",
    },
    {
      id: "a116adab-50ae-47d4-b5af-f77fd803e2f5",
      title: "夜之岛",
      players: "4人",
      rating: "4.2",
      genre: "沉浸式/悬疑",
      href: "https://tool.ssobig.com/templates/a116adab-50ae-47d4-b5af-f77fd803e2f5",
    },
    {
      id: "de60e4a2-9a08-4327-9f08-d3abccc141f8",
      title: "糖果村",
      players: "5人",
      rating: "3.9",
      genre: "悬疑/惊悚",
      href: "https://tool.ssobig.com/templates/de60e4a2-9a08-4327-9f08-d3abccc141f8",
    },
    {
      id: "fa858e0b-a33a-432c-aa67-2a80c5e4efb9",
      title: "皇后陛下杀人事件",
      players: "7人",
      rating: "3.9",
      genre: "历史/悬疑",
      href: "https://tool.ssobig.com/templates/fa858e0b-a33a-432c-aa67-2a80c5e4efb9",
    },
    {
      id: "3b231691-450e-11f1-95ac-b1113dae1ca1",
      title: "替身",
      players: "4人",
      rating: "3.6",
      genre: "科幻/惊悚",
      href: "https://tool.ssobig.com/templates/3b231691-450e-11f1-95ac-b1113dae1ca1",
    },
  ],
};

const COPY = {
  en: {
    eyebrow: "ssobig REVIEWER ACCESS",
    title: "Choose a scenario for your beta access",
    intro:
      "We will check your request and send the play coupon within 1 business day. Everyone in your group can join for free.",
    profile: "Contact",
    group: "Group size",
    experience: "Mystery-game experience",
    product: "Scenario",
    note: "Anything we should know?",
    consent: "I agree to receive beta access, coupons, and follow-up emails from ssobig.",
    submit: "Submit request",
    submitting: "Submitting...",
    successTitle: "Request received",
    successBody:
      "Thanks. We will review it and send coupon instructions within 1 business day.",
    fields: {
      name: "Name or nickname",
      email: "Email",
      phone: "Mobile phone",
      country: "Country or region",
      note: "Preferred play date, review plan, or questions",
    },
    groupOptions: ["2-3 people", "4-6 people", "7+ people"],
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
  },
  ko: {
    eyebrow: "ssobig REVIEWER ACCESS",
    title: "체험할 시나리오를 선택해주세요",
    intro:
      "신청 내용을 확인한 뒤 1영업일 내에 플레이 쿠폰을 보내드립니다. 함께 플레이하실 분들도 전원 무료로 입장할 수 있습니다.",
    profile: "연락처",
    group: "플레이 인원",
    experience: "머더미스터리 경험",
    product: "시나리오",
    note: "추가 메모",
    consent: "쏘빅의 체험권, 쿠폰, 후속 안내 이메일 수신에 동의합니다.",
    submit: "체험 신청하기",
    submitting: "제출 중...",
    successTitle: "신청이 접수되었습니다",
    successBody:
      "감사합니다. 확인 후 1영업일 내에 쿠폰 안내를 보내드리겠습니다.",
    fields: {
      name: "이름 또는 닉네임",
      email: "이메일",
      phone: "휴대폰 번호",
      country: "국가 또는 지역",
      note: "희망 플레이 일정, 리뷰 계획, 궁금한 점",
    },
    groupOptions: ["2-3명", "4-6명", "7명 이상"],
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
  },
  ja: {
    eyebrow: "ssobig REVIEWER ACCESS",
    title: "体験するシナリオを選んでください",
    intro:
      "申込み内容を確認したうえで、1営業日以内にプレイクーポンをお送りします。同行するメンバーも全員無料で参加できます。",
    profile: "連絡先",
    group: "プレイ人数",
    experience: "マーダーミステリー経験",
    product: "シナリオ",
    note: "追加メモ",
    consent: "ssobigからの体験権、クーポン、後続案内メールの受信に同意します。",
    submit: "体験を申し込む",
    submitting: "送信中...",
    successTitle: "申込みを受け付けました",
    successBody:
      "ありがとうございます。確認後、1営業日以内にクーポン案内をお送りします。",
    fields: {
      name: "名前またはニックネーム",
      email: "メールアドレス",
      phone: "携帯電話番号",
      country: "国または地域",
      note: "希望プレイ日、レビュー予定、質問など",
    },
    groupOptions: ["2-3人", "4-6人", "7人以上"],
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
  },
  zh: {
    eyebrow: "ssobig REVIEWER ACCESS",
    title: "请选择你想体验的剧本",
    intro:
      "我们会先审核你的申请，并在1个工作日内发送试玩优惠券。与你同行的成员也都可以免费参加。",
    profile: "联系方式",
    group: "游玩人数",
    experience: "谋杀之谜经验",
    product: "剧本",
    note: "补充说明",
    consent: "我同意接收 ssobig 发送的体验资格、优惠券及后续通知邮件。",
    submit: "提交申请",
    submitting: "提交中...",
    successTitle: "申请已提交",
    successBody:
      "感谢你的申请。审核后，我们会在1个工作日内发送优惠券说明。",
    fields: {
      name: "姓名或昵称",
      email: "电子邮箱",
      phone: "手机号",
      country: "国家或地区",
      note: "希望游玩的日期、评测计划或问题",
    },
    groupOptions: ["2-3人", "4-6人", "7人以上"],
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
  },
} as const;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function selectedProduct(locale: PlaytestLocale, id: string) {
  return PRODUCTS[locale].find((product) => product.id === id) || null;
}

function fieldClass() {
  return "mt-2 h-12 w-full rounded-2xl border border-white/12 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-[#FF7A59]";
}

export default function MarketingSignupForm({
  locale,
}: {
  locale: PlaytestLocale;
}) {
  const copy = COPY[locale];
  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    selectedTemplateId: PRODUCTS[locale][0]?.id || "",
  });
  const [attribution, setAttribution] = useState<Attribution>(DEFAULT_ATTRIBUTION);
  const [submitState, setSubmitState] = useState<
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success"; dryRun?: boolean }
    | { status: "error"; message: string }
  >({ status: "idle" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const influencerSlug = params.get("influencer") || params.get("i") || "";
    const sourceType =
      params.get("sourceType") === "influencer" ? "influencer" : "overseas_beta";
    const nextAttribution: Attribution = {
      sourceType,
      campaignSlug: params.get("campaign") || params.get("campaignSlug") || "marketing-direct",
      sourcePlatform: params.get("platform") || params.get("sourcePlatform") || "direct",
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
          sourceType: item.source_type === "influencer" ? "influencer" : "overseas_beta",
          campaignSlug: item.campaign_slug || nextAttribution.campaignSlug,
          sourcePlatform: item.platform || nextAttribution.sourcePlatform,
          influencerId: String(item.id || ""),
          influencerSlug: item.slug || influencerSlug,
          displayName: item.display_name || nextAttribution.displayName,
          couponCampaignId: item.coupon_campaign_id || nextAttribution.couponCampaignId,
          customMessage: item.custom_message || "",
        });
      })
      .catch(() => undefined);
  }, []);

  const validationError = useMemo(() => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      (locale === "ko" && !form.phone.trim()) ||
      !form.country.trim() ||
      !form.groupSize ||
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
  const product = selectedProduct(locale, form.selectedTemplateId);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !product) {
      setSubmitState({ status: "error", message: validationError || copy.validation.generic });
      return;
    }

    setSubmitState({ status: "submitting" });
    try {
      const sourceLabel = attribution.displayName ||
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
          groupSize: form.groupSize,
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
          selectedTemplateId: product.id,
          selectedTemplateTitle: product.title,
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
        message: error instanceof Error ? error.message : copy.validation.generic,
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

      <div className="relative mx-auto max-w-3xl px-5 py-14 md:py-20">
        <header className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-8">
          <p className="text-sm font-semibold tracking-[0.28em] text-[#FFB38A]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 break-keep text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 break-keep text-base leading-7 text-white/72 md:text-lg">
            {attribution.customMessage || copy.intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-xs font-semibold text-white/65">
              {attribution.sourcePlatform}
            </span>
            <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-xs font-semibold text-white/65">
              {attribution.campaignSlug}
            </span>
            {attribution.displayName ? (
              <span className="rounded-full border border-[#FF7A59]/25 bg-[#FF7A59]/10 px-3 py-1 text-xs font-semibold text-[#FFD3C4]">
                {attribution.displayName}
              </span>
            ) : null}
          </div>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
            <h2 className="text-xl font-semibold text-white">{copy.profile}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-white/80">
                {copy.fields.name}
                <input
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  className={fieldClass()}
                  autoComplete="name"
                />
              </label>
              <label className="text-sm font-medium text-white/80">
                {copy.fields.email}
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
                  {copy.fields.phone}
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
                {copy.fields.country}
                <input
                  value={form.country}
                  onChange={(event) => update("country", event.target.value)}
                  className={fieldClass()}
                  autoComplete="country-name"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
            <h2 className="text-xl font-semibold text-white">{copy.group}</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {copy.groupOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => update("groupSize", option)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    form.groupSize === option
                      ? "border-[#FF7A59] bg-[#FF7A59] text-[#050505]"
                      : "border-white/15 bg-white/[0.03] text-white/78 hover:border-white/30"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
            <h2 className="text-xl font-semibold text-white">{copy.experience}</h2>
            <div className="mt-5 grid gap-3">
              {copy.experienceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => update("experience", option)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    form.experience === option
                      ? "border-[#FF7A59] bg-[#FF7A59] text-[#050505]"
                      : "border-white/15 bg-white/[0.03] text-white/78 hover:border-white/30"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
            <h2 className="text-xl font-semibold text-white">{copy.product}</h2>
            <div className="mt-5 grid gap-3">
              {PRODUCTS[locale].map((item) => (
                <label
                  key={item.id}
                  className={`grid cursor-pointer gap-2 rounded-2xl border p-4 transition ${
                    form.selectedTemplateId === item.id
                      ? "border-[#FF7A59] bg-[#FF7A59]/12"
                      : "border-white/15 bg-white/[0.03] hover:border-white/30"
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={form.selectedTemplateId === item.id}
                      onChange={() => update("selectedTemplateId", item.id)}
                      className="mt-1 h-4 w-4 accent-[#FF7A59]"
                    />
                    <span>
                      <span className="block text-base font-semibold text-white">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm text-white/58">
                        {item.players} · KR {item.rating}/5 · {item.genre}
                      </span>
                    </span>
                  </span>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="ml-7 text-sm font-semibold text-[#FFB38A] underline-offset-4 hover:underline"
                  >
                    tool template link
                  </a>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
            <label className="text-sm font-medium text-white/80">
              {copy.note}
              <textarea
                value={form.motivation}
                onChange={(event) => update("motivation", event.target.value)}
                placeholder={copy.fields.note}
                className="mt-2 min-h-28 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-[#FF7A59]"
              />
            </label>
          </section>

          <label className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/72">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => update("consent", event.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-[#FF7A59]"
            />
            <span>{copy.consent}</span>
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
            {submitState.status === "submitting" ? copy.submitting : copy.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
