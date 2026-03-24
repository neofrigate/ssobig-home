import { ChangeEvent } from "react";
import { DAY_NAMMAE_BIRTH_YEARS } from "@/features/day-nammae/constants";
import { DayNammeFormValues } from "@/features/day-nammae/types";

interface StepProfileProps {
  formValues: DayNammeFormValues;
  onValueChange: (
    field: "name" | "birthYear" | "height" | "phone" | "traits"
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBirthYearSelect: (year: string) => void;
  showErrors?: boolean;
}

function inputClass(hasError: boolean) {
  return `mt-2 h-12 w-full rounded-xl border bg-white/5 px-4 text-base text-white placeholder:text-white/30 outline-none transition focus:border-[#FF6B9F]/50 focus:bg-white/[0.08] ${
    hasError ? "border-red-500" : "border-white/10"
  }`;
}

export default function StepProfile({
  formValues,
  onValueChange,
  onBirthYearSelect,
  showErrors,
}: StepProfileProps) {
  const errors = showErrors
    ? {
        name: !formValues.name.trim(),
        birthYear: !formValues.birthYear,
        height: !formValues.height.trim(),
        phone: formValues.phone.replace(/\D/g, "").length !== 11,
        traits: !formValues.traits.trim(),
      }
    : { name: false, birthYear: false, height: false, phone: false, traits: false };

  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-5">
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
          name="day_nammae_name"
          className={inputClass(errors.name)}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">이름을 입력해주세요.</p>
        )}
      </div>

      <div>
        <div className="text-sm font-semibold text-white/80">출생연도</div>
        <div className={`mt-2 grid grid-cols-4 gap-2 rounded-xl ${errors.birthYear ? "ring-1 ring-red-500 p-1" : ""}`}>
          {DAY_NAMMAE_BIRTH_YEARS.map((year) => {
            const selected = formValues.birthYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => onBirthYearSelect(year)}
                className={`h-10 rounded-xl border text-sm font-medium transition [touch-action:manipulation] ${
                  selected
                    ? "border-[#FF6B9F] bg-[#FF6B9F]/15 text-[#FFB1D4]"
                    : "border-white/10 bg-white/5 text-white/60"
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
        {errors.birthYear && (
          <p className="mt-1 text-xs text-red-400">출생연도를 선택해주세요.</p>
        )}
      </div>

      <div>
        <div className="text-sm font-semibold text-white/80">키</div>
        <input
          value={formValues.height}
          onChange={onValueChange("height")}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="키를 입력하세요"
          enterKeyHint="next"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          name="day_nammae_height"
          className={inputClass(errors.height)}
        />
        {errors.height && (
          <p className="mt-1 text-xs text-red-400">키를 입력해주세요.</p>
        )}
      </div>

      <div>
        <div className="text-sm font-semibold text-white/80">전화번호</div>
        <input
          value={formValues.phone}
          onChange={onValueChange("phone")}
          inputMode="tel"
          pattern="[0-9-]*"
          placeholder="010-0000-0000"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="next"
          name="day_nammae_phone"
          className={inputClass(errors.phone)}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-400">전화번호 11자리를 입력해주세요.</p>
        )}
      </div>

      <div>
        <div className="text-sm font-semibold text-white/80">특징</div>
        <textarea
          value={formValues.traits}
          onChange={onValueChange("traits")}
          placeholder="ex - 웃상, MBTI는 ENFP, 여유로운 편"
          rows={4}
          enterKeyHint="done"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
          className={`mt-2 w-full rounded-xl border bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-[#FF6B9F]/50 focus:bg-white/[0.08] ${
            errors.traits ? "border-red-500" : "border-white/10"
          }`}
        />
        {errors.traits && (
          <p className="mt-1 text-xs text-red-400">특징을 작성해주세요.</p>
        )}
      </div>
    </div>
  );
}
