import { headers } from "next/headers";
import { NextResponse } from "next/server";

const APPLE_APP_SLUG = "ssobig-murder-mystery";
const APPLE_TRACK_ID = "6745536878";
const APPLE_DEFAULT_STOREFRONT = "us";
const PLAY_PACKAGE_ID = "com.ssobig.ssobigtool";
const PLAY_DEFAULT_COUNTRY = "US";
const COUNTRY_HEADER_KEYS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country-code",
] as const;

function resolvePlatform(userAgent: string) {
  const normalized = userAgent.toLowerCase();

  const isAndroid = normalized.includes("android");
  const isIOS =
    normalized.includes("iphone") ||
    normalized.includes("ipad") ||
    normalized.includes("ipod") ||
    (normalized.includes("macintosh") && normalized.includes("mobile"));

  if (isAndroid) {
    return "android" as const;
  }

  if (isIOS) {
    return "ios" as const;
  }

  return "other" as const;
}

function resolveCountryFromAcceptLanguage(acceptLanguage: string) {
  const normalized = acceptLanguage.toLowerCase();

  if (normalized.includes("ko")) return "KR";
  if (normalized.includes("ja")) return "JP";
  if (normalized.includes("zh-tw")) return "TW";
  if (normalized.includes("zh-hk")) return "HK";
  if (normalized.includes("zh")) return "TW";

  return PLAY_DEFAULT_COUNTRY;
}

function resolveCountryCode(headerList: Headers) {
  for (const key of COUNTRY_HEADER_KEYS) {
    const value = headerList.get(key)?.trim().toUpperCase();

    if (value && /^[A-Z]{2}$/.test(value)) {
      return value;
    }
  }

  return resolveCountryFromAcceptLanguage(
    headerList.get("accept-language") ?? "",
  );
}

function resolveAppleStorefront(countryCode: string) {
  if (countryCode === "CN") {
    return APPLE_DEFAULT_STOREFRONT;
  }

  if (countryCode === "MO") {
    return "hk";
  }

  if (countryCode === "UK") {
    return "gb";
  }

  return countryCode.toLowerCase();
}

function resolvePlayLocale(countryCode: string) {
  if (countryCode === "KR") {
    return { gl: "KR", hl: "ko" };
  }

  if (countryCode === "JP") {
    return { gl: "JP", hl: "ja" };
  }

  if (countryCode === "TW") {
    return { gl: "TW", hl: "zh-TW" };
  }

  if (countryCode === "HK" || countryCode === "MO") {
    return { gl: "HK", hl: "zh-TW" };
  }

  if (countryCode === "CN") {
    return { gl: PLAY_DEFAULT_COUNTRY, hl: "en" };
  }

  return {
    gl: /^[A-Z]{2}$/.test(countryCode) ? countryCode : PLAY_DEFAULT_COUNTRY,
    hl: "en",
  };
}

function buildAppleStoreUrl(countryCode: string) {
  const storefront = resolveAppleStorefront(countryCode);

  return `https://apps.apple.com/${storefront}/app/${APPLE_APP_SLUG}/id${APPLE_TRACK_ID}`;
}

function buildPlayStoreUrl(countryCode: string) {
  const { gl, hl } = resolvePlayLocale(countryCode);
  const query = new URLSearchParams({
    id: PLAY_PACKAGE_ID,
    gl,
    hl,
  });

  return `https://play.google.com/store/apps/details?${query.toString()}`;
}

function resolveDownloadUrl(userAgent: string, countryCode: string) {
  const platform = resolvePlatform(userAgent);

  if (platform === "ios") {
    return buildAppleStoreUrl(countryCode);
  }

  if (platform === "android") {
    return buildPlayStoreUrl(countryCode);
  }

  // Desktop and unknown environments fall back to the web-friendly Play Store page.
  return buildPlayStoreUrl(countryCode);
}

export async function GET() {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") ?? "";
  const countryCode = resolveCountryCode(headerList);
  const downloadUrl = resolveDownloadUrl(userAgent, countryCode);

  return NextResponse.redirect(downloadUrl, {
    status: 307,
    headers: {
      Vary: "User-Agent, Accept-Language, X-Vercel-IP-Country, CF-IPCountry, X-Country-Code",
      "Cache-Control": "no-store",
    },
  });
}

export async function HEAD() {
  return GET();
}
