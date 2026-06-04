export const LOVE_BUDDIES_PIXEL_ID = "1541266446734040";
export const SSOBIG_STORY_PIXEL_ID = "2156713988421222";
export const META_EVENT_CURRENCY = "KRW";
export const DAY_NAMMAE_CONTENT_NAME = "일일남매";
export const DAY_NAMMAE_CONTENT_ID = "day-nammae";
export const DAY_NAMMAE_BASE_PRICE = 35000;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    __ssobigMetaPixelIds?: Record<string, boolean>;
  }
}

export function safeFbq(...args: unknown[]) {
  if (typeof window === "undefined" || !window.fbq) {
    return;
  }

  try {
    window.fbq(...args);
  } catch (error) {
    console.error("Meta Pixel 호출 실패:", error);
  }
}

type MetaStandardEventName = "ViewContent" | "CompleteRegistration" | "InitiateCheckout";

interface MetaPixelExtraEvent {
  eventName: MetaStandardEventName;
  payload: Record<string, unknown>;
  options?: Record<string, unknown>;
}

interface DayNammaeStandardEventParams {
  value: number;
  eventId?: string;
  schedule?: string;
  couponApplied?: boolean;
  couponLabel?: string;
}

function normalizeMetaValue(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.round(value);
}

function buildDayNammaeMetaParams(params: DayNammaeStandardEventParams) {
  return {
    value: normalizeMetaValue(params.value),
    currency: META_EVENT_CURRENCY,
    content_name: DAY_NAMMAE_CONTENT_NAME,
    content_ids: [DAY_NAMMAE_CONTENT_ID],
    content_type: "product",
    ...(params.schedule ? { schedule: params.schedule } : {}),
    ...(typeof params.couponApplied === "boolean"
      ? { coupon_applied: params.couponApplied }
      : {}),
    ...(params.couponLabel ? { coupon_label: params.couponLabel } : {}),
  };
}

export function buildDayNammaeMetaEventId(
  eventName: MetaStandardEventName,
  requestId: string
) {
  return `${DAY_NAMMAE_CONTENT_ID}:${eventName}:${requestId}`;
}

export function trackDayNammaeMetaStandardEvent(
  eventName: MetaStandardEventName,
  params: DayNammaeStandardEventParams
) {
  const payload = buildDayNammaeMetaParams(params);
  const options = params.eventId ? { eventID: params.eventId } : undefined;

  if (options) {
    safeFbq("track", eventName, payload, options);
    return;
  }

  safeFbq("track", eventName, payload);
}

function buildMetaPixelExtraEventScript(events: MetaPixelExtraEvent[]) {
  return events
    .map((event) => {
      const eventName = JSON.stringify(event.eventName);
      const payload = JSON.stringify(event.payload);
      const options = event.options ? `, ${JSON.stringify(event.options)}` : "";

      return `fbq('track', ${eventName}, ${payload}${options});`;
    })
    .join("\n");
}

export function buildMetaPixelPageViewScript(
  pixelId: string,
  extraEvents: MetaPixelExtraEvent[] = []
) {
  const extraEventScript = buildMetaPixelExtraEventScript(extraEvents);

  return `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.__ssobigMetaPixelIds = window.__ssobigMetaPixelIds || {};
    if (!window.__ssobigMetaPixelIds['${pixelId}']) {
      fbq('set', 'autoConfig', false, '${pixelId}');
      fbq('init', '${pixelId}');
      window.__ssobigMetaPixelIds['${pixelId}'] = true;
    }
    fbq('track', 'PageView');
    ${extraEventScript}
  `;
}
