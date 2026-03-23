export const LOVE_BUDDIES_PIXEL_ID = "1541266446734040";

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

export function buildMetaPixelPageViewScript(pixelId: string) {
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
      fbq('init', '${pixelId}');
      window.__ssobigMetaPixelIds['${pixelId}'] = true;
    }
    fbq('track', 'PageView');
  `;
}
