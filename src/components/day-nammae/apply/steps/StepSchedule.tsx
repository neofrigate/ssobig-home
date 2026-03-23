import {
  getDayNammeScheduleLabel,
  isDayNammeScheduleSelectable,
} from "@/features/day-nammae/schedule";
import { ScheduleItem } from "@/features/day-nammae/types";

function getScheduleHelperText(
  schedule: ScheduleItem,
  gender: "남" | "여" | ""
) {
  if (schedule.status === "전체마감") return "전체 마감";
  if (gender === "여" && schedule.status === "여자마감") return "여성 마감";
  if (gender === "남" && schedule.status === "남자마감") return "남성 마감";
  if (
    !gender &&
    (schedule.status === "여자마감" || schedule.status === "남자마감")
  )
    return "성별 선택 후 확인";
  return schedule.status || "신청 가능";
}

interface StepScheduleProps {
  scheduleData: ScheduleItem[];
  isLoading: boolean;
  gender: "남" | "여" | "";
  selectedSchedule: string;
  onSelect: (label: string) => void;
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

        return (
          <button
            key={label}
            type="button"
            disabled={!selectable}
            onClick={() => onSelect(label)}
            className={`w-full rounded-2xl border px-4 py-4 text-left transition [touch-action:manipulation] ${
              selected
                ? "border-[#FF6B9F] bg-[#FF6B9F]/15"
                : selectable
                  ? "border-white/10 bg-white/5"
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
                <p className="mt-1 text-xs text-white/40">
                  현재 {schedule.applicants.total}/{schedule.maxCapacity}명 신청
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  selectable
                    ? "bg-[#FF6B9F]/20 text-[#FFB1D4]"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {getScheduleHelperText(schedule, gender)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
