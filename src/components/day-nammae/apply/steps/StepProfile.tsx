import { ChangeEvent } from "react";
import { getDefaultDayNammeBirthYears } from "@/features/day-nammae/age";
import { DayNammeFormValues } from "@/features/day-nammae/types";

const ACQUISITION_CHANNEL_OPTIONS = [
  "지인 추천",
  "공식 인스타그램",
  "광고",
  "블로그·카페",
  "재참여",
  "기타",
];

interface StepProfileProps {
  formValues: DayNammeFormValues;
  onValueChange: (
    field:
      | "name"
      | "birthYear"
      | "height"
      | "phone"
      | "traits"
      | "acquisitionChannelOther"
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAcquisitionChannelSelect: (channel: string) => void;
  onBirthYearSelect: (year: string) => void;
  birthYears?: string[];
  ageRangeLabel?: string;
  showErrors?: boolean;
}

function inputClass(hasError: boolean) {
  return `mt-2 h-12 w-full rounded-lg border bg-[#21161a] px-4 text-base text-white placeholder:text-white/30 outline-none ${
    hasError ? "border-red-500" : "border-[#2c2024]"
  }`;
}

export default function StepProfile({
  formValues,
  onValueChange,
  onAcquisitionChannelSelect,
  onBirthYearSelect,
  birthYears = getDefaultDayNammeBirthYears(),
  ageRangeLabel = "",
  showErrors,
}: StepProfileProps) {
  const errors = showErrors
    ? {
        name: !formValues.name.trim(),
        birthYear: !formValues.birthYear,
        height: !formValues.height.trim(),
        phone: formValues.phone.replace(/\D/g, "").length !== 11,
        traits: !formValues.traits.trim(),
        acquisitionChannel: !formValues.acquisitionChannel,
        acquisitionChannelOther:
          formValues.acquisitionChannel === "기타" &&
          !formValues.acquisitionChannelOther.trim(),
      }
    : {
        name: false,
        birthYear: false,
        height: false,
        phone: false,
        traits: false,
        acquisitionChannel: false,
        acquisitionChannelOther: false,
      };

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
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-white/80">출생연도</div>
          {ageRangeLabel && (
            <span className="rounded-full border border-[#8FD8FF]/25 bg-[#8FD8FF]/10 px-2.5 py-1 text-[11px] font-semibold text-[#BFEAFF]">
              {ageRangeLabel}
            </span>
          )}
        </div>
        <div className={`mt-2 grid grid-cols-4 gap-2 rounded-xl ${errors.birthYear ? "ring-1 ring-red-500 p-1" : ""}`}>
          {birthYears.map((year) => {
            const selected = formValues.birthYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => onBirthYearSelect(year)}
                className={`h-10 rounded-lg border text-sm font-medium [touch-action:manipulation] ${
                  selected
                    ? "border-[#FF6B9F] bg-[#351923] text-[#FFB1D4]"
                    : "border-[#2c2024] bg-[#21161a] text-white/60"
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
          className={`mt-2 w-full rounded-lg border bg-[#21161a] px-4 py-3 text-base text-white placeholder:text-white/30 outline-none ${
            errors.traits ? "border-red-500" : "border-[#2c2024]"
          }`}
        />
        {errors.traits && (
          <p className="mt-1 text-xs text-red-400">특징을 작성해주세요.</p>
        )}
      </div>

      <div>
        <div className="text-sm font-semibold text-white/80">
          일일남매를 어디서 보고 신청하게 되셨나요?
        </div>
        <div
          className={`mt-2 grid grid-cols-2 gap-2 rounded-xl ${
            errors.acquisitionChannel ? "ring-1 ring-red-500 p-1" : ""
          }`}
        >
          {ACQUISITION_CHANNEL_OPTIONS.map((option) => {
            const selected = formValues.acquisitionChannel === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onAcquisitionChannelSelect(option)}
                className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium [touch-action:manipulation] ${
                  selected
                    ? "border-[#FF6B9F] bg-[#351923] text-[#FFB1D4]"
                    : "border-[#2c2024] bg-[#21161a] text-white/60"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {errors.acquisitionChannel && (
          <p className="mt-1 text-xs text-red-400">유입경로를 선택해주세요.</p>
        )}
        {formValues.acquisitionChannel === "기타" && (
          <div>
            <input
              value={formValues.acquisitionChannelOther}
              onChange={onValueChange("acquisitionChannelOther")}
              placeholder="어디서 보셨는지 적어주세요"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck={false}
              className={inputClass(errors.acquisitionChannelOther)}
            />
            {errors.acquisitionChannelOther && (
              <p className="mt-1 text-xs text-red-400">
                기타 경로를 입력해주세요.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
