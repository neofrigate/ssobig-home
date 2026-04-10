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
  onSelect: (schedule: ScheduleItem) => void;
}

export default function StepSchedule({
  scheduleData,
  isLoading,
  gender,
  selectedSchedule,
  onSelect,
}: StepScheduleProps) {
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

      {scheduleData.map((schedule) => {
        const label = getDayNammeScheduleLabel(schedule);
        const selectable = isDayNammeScheduleSelectable(schedule, gender);
        const selected = selectedSchedule === label;
        const waitlistSelectable = isDayNammeScheduleWaitlistSelectable(
          schedule,
          gender
        );

        return (
          <button
            key={label}
            type="button"
            disabled={!selectable}
            onClick={() => onSelect(schedule)}
            className={`w-full rounded-2xl border px-4 py-4 text-left transition [touch-action:manipulation] ${
              selected
                ? waitlistSelectable
                  ? "border-[#F6C66A] bg-[#F6C66A]/14"
                  : "border-[#FF6B9F] bg-[#FF6B9F]/15"
                : selectable
                  ? waitlistSelectable
                    ? "border-[#F6C66A]/35 bg-[#F6C66A]/8"
                    : "border-white/10 bg-white/5"
                  : "border-white/5 bg-white/[0.02] opacity-40"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`text-sm font-bold ${selected ? "text-white" : selectable ? "text-white/80" : "text-white/40"}`}
                >
                  {label}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    waitlistSelectable
                      ? selectable
                        ? "text-[#F8D999]"
                        : "text-white/30"
                      : "text-white/40"
                  }`}
                >
                  {getDayNammeScheduleHelperDescription(schedule, gender)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  waitlistSelectable
                    ? "bg-[#F6C66A]/18 text-[#FFE2A4]"
                    : selectable
                      ? "bg-[#FF6B9F]/20 text-[#FFB1D4]"
                      : "bg-white/5 text-white/30"
                }`}
              >
                {getDayNammeScheduleHelperText(schedule, gender)}
              </span>
            </div>

            {waitlistSelectable && (
              <div className="mt-3 rounded-xl border border-[#F6C66A]/18 bg-black/20 px-3 py-2 text-[11px] leading-relaxed text-[#FFE9BA]">
                지금은 마감된 회차예요. 취소 자리가 생기면 결제 안내 후 확정할 수 있어요.
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
