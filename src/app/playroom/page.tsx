import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  detectPlayroomLocale,
  localeToCanonicalPath,
} from "./playroomSiteLocale";

export default async function PlayroomPage() {
  const requestHeaders = await headers();
  const locale = detectPlayroomLocale(requestHeaders);
  redirect(localeToCanonicalPath(locale));
}
