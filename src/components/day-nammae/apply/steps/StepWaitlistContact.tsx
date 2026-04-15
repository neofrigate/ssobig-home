import { ChangeEvent } from "react";
import { DayNammeFormValues } from "@/features/day-nammae/types";

interface StepWaitlistContactProps {
  formValues: DayNammeFormValues;
  onValueChange: (
    field: "name" | "phone"
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  showErrors?: boolean;
}

function inputClass(hasError: boolean) {
  return `mt-2 h-12 w-full rounded-lg border bg-[#21161a] px-4 text-base text-white placeholder:text-white/30 outline-none ${
    hasError ? "border-red-500" : "border-[#2c2024]"
  }`;
}

export default function StepWaitlistContact({
  formValues,
  onValueChange,
  showErrors,
}: StepWaitlistContactProps) {
  const errors = showErrors
    ? {
        name: !formValues.name.trim(),
        phone: formValues.phone.replace(/\D/g, "").length !== 11,
      }
    : { name: false, phone: false };

  return (
    <div className="space-y-5 rounded-2xl border border-[#2c2024] bg-[#1b1416] p-4">
      <div className="rounded-xl border border-[#F6C66A]/18 bg-[#F6C66A]/8 px-4 py-4 text-sm leading-relaxed text-[#FFE9BA]">
        신청서나 결제는 지금 진행되지 않습니다.
        <br />
        이름과 전화번호만 남겨두시면, 자리가 생겼을 때 신청 가능한 링크를 다시 보내드려요.
      </div>

      <div>
        <div className="text-sm font-semibold text-white/80">이름</div>
        <input
          value={formValues.name}
          onChange={onValueChange("name")}
          placeholder="이름을 입력하세요"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          name="day_nammae_waitlist_name"
          className={inputClass(errors.name)}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">이름을 입력해주세요.</p>
        )}
      </div>

      <div>
        <div className="text-sm font-semibold text-white/80">전화번호</div>
        <input
          value={formValues.phone}
          onChange={onValueChange("phone")}
          inputMode="tel"
          placeholder="010-0000-0000"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
          name="day_nammae_waitlist_phone"
          className={inputClass(errors.phone)}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-400">전화번호 11자리를 입력해주세요.</p>
        )}
      </div>
    </div>
  );
}
