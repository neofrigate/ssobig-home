import {
  getDayNammeScheduleHelperDescription,
  getDayNammeScheduleHelperText,
  getDayNammeScheduleLabel,
  isDayNammeScheduleWaitlistSelectable,
  isDayNammeScheduleSelectable,
} from "@/features/day-nammae/schedule";
import { ScheduleItem } from "@/features/day-nammae/types";

interface StepScheduleProps {
  scheduleData: ScheduleItem[];
  isLoading: boolean;
  gender: "남" | "여" | "";
  selectedSchedule: string;
  allowedScheduleIds?: string[];
  targetScheduleLabel?: string;
  onSelect: (schedule: ScheduleItem) => void | Promise<void>;
}

export default function StepSchedule({
  scheduleData,
  isLoading,
  gender,
  selectedSchedule,
  allowedScheduleIds = [],
  targetScheduleLabel = "",
  onSelect,
}: StepScheduleProps) {
  const hasAllowedSchedules = allowedScheduleIds.length > 0;

  return (
    <div className="space-y-3">
      {isLoading && (
        <p className="text-sm text-white/40">일정을 불러오는 중...</p>
      )}

      {!gender && (
        <p className="mb-2 text-xs text-white/40">
          성별을 먼저 선택하면 신청 가능한 일정을 정확히 안내해드려요.
        </p>
      )}

      {hasAllowedSchedules && (
        <div className="rounded-2xl border border-[#FF6B9F]/30 bg-[#FF6B9F]/10 px-4 py-3 text-xs leading-relaxed text-[#FFD0E2]">
          이 쿠폰은 회차 전용 쿠폰입니다. {targetScheduleLabel || "쿠폰 대상 회차"}만
          선택할 수 있습니다.
        </div>
      )}

      {scheduleData.map((schedule) => {
        const label = getDayNammeScheduleLabel(schedule);
        const isCouponTarget =
          !hasAllowedSchedules ||
          allowedScheduleIds.includes(schedule.staffScheduleId);
        const selectable =
          isCouponTarget && isDayNammeScheduleSelectable(schedule, gender);
        const selected = selectedSchedule === label;
        const waitlistSelectable = isDayNammeScheduleWaitlistSelectable(
          schedule,
          gender
        );
        const helperText = getDayNammeScheduleHelperText(schedule, gender);
        const isImminent = helperText === "임박";
        const badgeClassName = waitlistSelectable
          ? "bg-white/10 text-white/65"
          : isImminent
            ? "bg-[#F6C66A]/22 text-[#FFE2A4]"
            : helperText === "여유"
              ? "bg-[#C8F1D7]/12 text-[#C8F1D7]"
              : selectable
                ? "bg-[#FF6B9F]/20 text-[#FFB1D4]"
                : "bg-white/5 text-white/30";
        const cardClassName = selected
          ? isImminent
            ? "border-[#F6C66A] bg-[#F6C66A]/14"
            : "border-[#FF6B9F] bg-[#FF6B9F]/15"
          : selectable
            ? isImminent
              ? "border-[#F6C66A]/35 bg-[#F6C66A]/8"
              : "border-white/10 bg-white/5"
            : "border-white/5 bg-white/[0.02] opacity-40";
        const descriptionClassName = isImminent
          ? selectable
            ? "text-[#F8D999]"
            : "text-white/30"
          : "text-white/40";

        return (
          <button
            key={label}
            type="button"
            disabled={!selectable}
            onClick={() => onSelect(schedule)}
            className={`w-full rounded-2xl border px-4 py-4 text-left transition [touch-action:manipulation] ${cardClassName}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`text-sm font-bold ${selected ? "text-white" : selectable ? "text-white/80" : "text-white/40"}`}
                >
                  {label}
                </p>
                <p
                  className={`mt-1 text-xs ${descriptionClassName}`}
                >
                {isCouponTarget
                  ? getDayNammeScheduleHelperDescription(schedule, gender)
                  : "쿠폰 대상 회차가 아닙니다."}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClassName}`}
              >
                {helperText}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
