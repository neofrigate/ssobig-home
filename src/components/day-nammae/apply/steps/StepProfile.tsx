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
  return `mt-2 h-12 w-full rounded-lg border bg-white px-4 text-base text-black placeholder:text-black/35 outline-none ${
    hasError ? "border-red-500" : "border-[#2c2024]"
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
    <div className="space-y-5 rounded-2xl border border-[#2c2024] bg-[#1b1416] p-4">
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
                className={`h-10 rounded-lg border text-sm font-medium ${
                  selected
                    ? "border-[#FF6B9F] bg-[#fff0f7] text-[#cc2c72]"
                    : "border-[#2c2024] bg-white text-black/75"
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
          className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-base text-black placeholder:text-black/35 outline-none ${
            errors.traits ? "border-red-500" : "border-[#2c2024]"
          }`}
        />
        {errors.traits && (
          <p className="mt-1 text-xs text-red-400">특징을 작성해주세요.</p>
        )}
      </div>
    </div>
  );
}
