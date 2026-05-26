import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import PlayroomHtmlFrame from "@/app/playroom/PlayroomHtmlFrame";
import {
  buildPlayroomTemplateDetailApiUrl,
  type PlayroomTemplateApiItem,
} from "@/app/playroom/playroomApi";
import {
  localeToCanonicalPath,
  normalizePlayroomSiteLocale,
  type PlayroomSiteLocale,
} from "@/app/playroom/playroomSiteLocale";

type PageProps = {
  params: Promise<{
    locale: string;
    gameSettingsId: string;
  }>;
};

async function fetchPlayroomTemplateDetail(
  locale: PlayroomSiteLocale,
  gameSettingsId: string,
) {
  const response = await fetch(
    buildPlayroomTemplateDetailApiUrl(locale, gameSettingsId).toString(),
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Playroom detail API failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    item?: PlayroomTemplateApiItem | null;
  };
  return data.item || null;
}

function renderTextDescription(text: string) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 text-[17px] leading-8 text-slate-700 md:text-[18px]">
      {blocks.map((block, index) => (
        <p key={index} className="whitespace-pre-wrap">
          {block}
        </p>
      ))}
    </div>
  );
}

export default async function PlayroomGameDetailPage({ params }: PageProps) {
  const { locale, gameSettingsId } = await params;
  const normalizedLocale = normalizePlayroomSiteLocale(locale);
  if (!normalizedLocale) {
    notFound();
  }

  const item = await fetchPlayroomTemplateDetail(normalizedLocale, gameSettingsId);
  if (!item) {
    notFound();
  }

  const detailHtml = String(item.detail_description_html || "").trim();
  const detailText = String(
    item.detail_description || item.description || "",
  ).trim();
  const detailFormat = String(item.detail_description_format || "text")
    .trim()
    .toLowerCase();
  const shouldRenderHtml = detailFormat === "html" && detailHtml;
  const backHref = localeToCanonicalPath(normalizedLocale);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_26%,#f8fafc_100%)]">
      <div className="mx-auto flex w-full max-w-[980px] flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          목록으로 돌아가기
        </Link>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="relative mx-auto aspect-[3/4] w-[180px] overflow-hidden rounded-[22px] bg-slate-100 md:mx-0 md:w-[220px]">
              <Image
                src={item.card_image_url}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 180px, 220px"
                priority
              />
            </div>

            <div className="flex-1">
              <div className="mb-4 flex flex-wrap gap-2">
                {item.price_label ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                    ⚡ {item.price_label}
                  </span>
                ) : null}
                {item.players_label ? (
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-800">
                    👥 {item.players_label}
                  </span>
                ) : null}
              </div>

              <h1 className="mb-3 text-[34px] font-black tracking-[-0.03em] text-slate-950 md:text-[50px]">
                {item.title}
              </h1>
              <p className="max-w-2xl whitespace-pre-wrap text-[16px] leading-7 text-slate-600 md:text-[18px]">
                {item.description}
              </p>

              <div className="mt-6">
                <a
                  href={item.destination_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  플레이하러 가기
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.05)] md:p-8">
          {shouldRenderHtml ? (
            <PlayroomHtmlFrame
              html={detailHtml}
              messageKey={`${normalizedLocale}:${gameSettingsId}`}
              title={`${item.title} 상세 설명`}
            />
          ) : (
            renderTextDescription(detailText)
          )}
        </section>
      </div>
    </main>
  );
}
