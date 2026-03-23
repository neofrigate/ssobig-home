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
  return `mt-2 h-12 w-full rounded-xl border bg-[#21161a] px-4 text-base md:text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#FF6B9F]/60 ${
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
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-white/80">이름</label>
        <p className="mt-1 text-xs text-white/45">
          닉네임이 아닌 실명을 입력해주세요!
        </p>
        <input
          value={formValues.name}
          onChange={onValueChange("name")}
          placeholder="이름을 입력하세요"
          autoComplete="name"
          className={inputClass(errors.name)}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">이름을 입력해주세요.</p>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold text-white/80">출생연도</label>
        <p className="mt-1 text-xs text-white/45">
          태어난 출생 연도를 선택해주세요.
        </p>
        <div className={`mt-2 grid grid-cols-4 gap-2 rounded-xl ${errors.birthYear ? "ring-1 ring-red-500 p-1" : ""}`}>
          {DAY_NAMMAE_BIRTH_YEARS.map((year) => {
            const selected = formValues.birthYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => onBirthYearSelect(year)}
                className={`h-10 rounded-xl border text-sm font-medium transition ${
                  selected
                    ? "border-[#FF6B9F] bg-[#351923] text-[#ffd4e7]"
                    : "border-[#2c2024] bg-[#21161a] text-white/58"
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
        <label className="text-sm font-semibold text-white/80">키</label>
        <p className="mt-1 text-xs text-white/45">본인의 키를 적어주세요.</p>
        <input
          value={formValues.height}
          onChange={onValueChange("height")}
          inputMode="numeric"
          placeholder="키를 입력하세요"
          enterKeyHint="next"
          className={inputClass(errors.height)}
        />
        {errors.height && (
          <p className="mt-1 text-xs text-red-400">키를 입력해주세요.</p>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold text-white/80">전화번호</label>
        <p className="mt-1 text-xs text-white/45">
          연락받을 번호를 입력해주세요.
        </p>
        <input
          value={formValues.phone}
          onChange={onValueChange("phone")}
          inputMode="tel"
          placeholder="010-0000-0000"
          autoComplete="tel"
          enterKeyHint="next"
          className={inputClass(errors.phone)}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-400">전화번호 11자리를 입력해주세요.</p>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold text-white/80">특징</label>
        <p className="mt-1 text-xs text-white/45">
          본인을 설명할 수 있는 특징을 편하게 적어주세요.
        </p>
        <textarea
          value={formValues.traits}
          onChange={onValueChange("traits")}
          placeholder="ex - 웃상, MBTI는 ENFP, 여유로운 편"
          rows={4}
          enterKeyHint="done"
          className={`mt-2 w-full rounded-xl border bg-[#21161a] px-4 py-3 text-base md:text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#FF6B9F]/60 ${
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
