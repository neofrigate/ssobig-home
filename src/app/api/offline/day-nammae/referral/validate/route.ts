import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  referralFailureMessage,
  referralInputMessage,
  REFERRAL_NETWORK_MESSAGE,
} from "@/features/day-nammae/referral";

export async function POST(request: Request) {
  const reply = (body: object, status: number) =>
    NextResponse.json(body, {
      status,
      headers: { "Cache-Control": "no-store" },
    });
  let input;
  try {
    input = await request.json();
  } catch {
    return reply(
      { success: false, message: "추천 코드와 전화번호를 확인해 주세요." },
      400,
    );
  }
  const code =
    typeof input?.code === "string" ? input.code.trim().toUpperCase() : "";
  const phone =
    typeof input?.phone === "string" ? input.phone.replace(/\D/g, "") : "";
  const message = referralInputMessage(code, phone);
  if (message) return reply({ success: false, message }, 400);
  if (input.hasCoupon === true)
    return reply(
      { success: false, message: referralFailureMessage("쿠폰") },
      409,
    );
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key)
    return reply({ success: false, message: REFERRAL_NETWORK_MESSAGE }, 503);
  try {
    const supabase = createClient(
      "https://ferhwwjztseoegaizsko.supabase.co",
      key,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabase
      .rpc("validate_day_nammae_referral", { p_code: code, p_phone: phone })
      .abortSignal(AbortSignal.timeout(8000));
    if (error || !data || typeof data.success !== "boolean")
      return reply({ success: false, message: REFERRAL_NETWORK_MESSAGE }, 503);
    if (!data.success)
      return reply(
        { success: false, message: referralFailureMessage(data.reason) },
        409,
      );
    return reply(
      {
        success: true,
        message:
          "지인 추천 30% 할인 사용이 가능합니다. 최종 신청 시 한 번 더 확인합니다.",
      },
      200,
    );
  } catch {
    return reply({ success: false, message: REFERRAL_NETWORK_MESSAGE }, 503);
  }
}
