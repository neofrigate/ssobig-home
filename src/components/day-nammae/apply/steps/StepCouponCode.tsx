import { ChangeEvent } from "react";
import { CouponValidationResult } from "@/features/day-nammae/types";

interface StepCouponCodeProps {
  couponCode: string;
  validationStatus: "idle" | "validating" | "valid" | "invalid";
  validatedCoupon: CouponValidationResult | null;
  onCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onValidate: () => void;
}

function inputClass(hasSuccess: boolean) {
  return `h-12 w-full rounded-r-lg border border-l-0 bg-[#21161a] px-4 text-base uppercase text-white placeholder:text-white/30 outline-none ${
    hasSuccess ? "border-emerald-500/60" : "border-[#2c2024]"
  }`;
}

function formatExpiry(rawDate?: string) {
  if (!rawDate) {
    return "";
  }

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}까지`;
}

export default function StepCouponCode({
  couponCode,
  validationStatus,
  validatedCoupon,
  onCodeChange,
  onValidate,
}: StepCouponCodeProps) {
  const hasSuccess = validationStatus === "valid" && Boolean(validatedCoupon);
  const expiryLabel = formatExpiry(validatedCoupon?.expires_at);

  return (
    <div className="space-y-4 rounded-2xl border border-[#2c2024] bg-[#1b1416] p-4">
      <div>
        <div className="text-sm font-semibold text-white/80">쿠폰 번호</div>
        <div className="mt-2 flex items-stretch">
          <div
            className={`inline-flex h-12 shrink-0 items-center rounded-l-lg border bg-[#2a1a20] px-4 text-sm font-semibold tracking-[0.12em] text-white/75 ${
              hasSuccess ? "border-emerald-500/60 border-r-0" : "border-[#2c2024] border-r-0"
            }`}
          >
            SSOBIG-
          </div>
          <input
            value={couponCode}
            onChange={onCodeChange}
            placeholder="12345678"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            maxLength={8}
            className={inputClass(hasSuccess)}
          />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/45">
          앞의 SSOBIG-은 고정이며, 뒤 8자리 영문 대문자와 숫자를 입력하면 됩니다.
        </p>
      </div>

      <button
        type="button"
        onClick={onValidate}
        disabled={couponCode.trim().length !== 8 || validationStatus === "validating"}
        className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[#FF6B9F]/60 bg-[#FF6B9F]/10 px-4 text-sm font-semibold text-[#FFB1D4] disabled:border-white/10 disabled:bg-white/5 disabled:text-white/35"
      >
        {validationStatus === "validating" ? "쿠폰 확인 중..." : "쿠폰 확인"}
      </button>

      {hasSuccess && validatedCoupon && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
          <p className="font-semibold">사용 가능한 쿠폰입니다.</p>
          {validatedCoupon.discount_label && (
            <p className="mt-2">혜택: {validatedCoupon.discount_label}</p>
          )}
          {validatedCoupon.target_schedule_label && (
            <p className="mt-1 text-emerald-100/80">
              사용 가능 회차: {validatedCoupon.target_schedule_label}
            </p>
          )}
          {validatedCoupon.requires_payment === false && (
            <p className="mt-1 text-emerald-100/80">
              별도 결제 없이 무료초대 신청으로 접수됩니다.
            </p>
          )}
          {expiryLabel && <p className="mt-1 text-emerald-100/80">만료: {expiryLabel}</p>}
        </div>
      )}
    </div>
  );
}
