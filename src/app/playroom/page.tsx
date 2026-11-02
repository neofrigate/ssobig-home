import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  detectPlayroomLocale,
  localeToCanonicalPath,
  normalizePlayroomSiteLocale,
} from "./playroomSiteLocale";

export default async function PlayroomPage() {
  const requestHeaders = await headers();
  const preference = (await cookies()).get("ssobig_locale")?.value;
  const locale = normalizePlayroomSiteLocale(preference) ?? detectPlayroomLocale(requestHeaders);
  redirect(localeToCanonicalPath(locale));
}
