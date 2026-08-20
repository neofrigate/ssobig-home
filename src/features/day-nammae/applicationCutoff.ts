export const DAY_NAMMAE_APPLICATION_CLOSED_CODE =
  "DAY_NAMMAE_APPLICATION_CLOSED";
export const DAY_NAMMAE_SCHEDULE_INVALID_CODE =
  "DAY_NAMMAE_SCHEDULE_INVALID";
export const DAY_NAMMAE_APPLICATION_CLOSED_MESSAGE =
  "모임 시작 1시간 전부터 신청 및 결제가 불가합니다. 다른 일정을 선택해주세요.";
export const DAY_NAMMAE_SCHEDULE_INVALID_MESSAGE =
  "선택한 일정 정보를 확인할 수 없습니다. 일정을 다시 선택해주세요.";

const APPLICATION_CUTOFF_MS = 60 * 60 * 1000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isDayNammaeStaffScheduleId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value.trim());
}

export type DayNammaeApplicationErrorCode =
  | typeof DAY_NAMMAE_APPLICATION_CLOSED_CODE
  | typeof DAY_NAMMAE_SCHEDULE_INVALID_CODE;

export function isDayNammaeApplicationErrorCode(
  value: unknown
): value is DayNammaeApplicationErrorCode {
  return (
    value === DAY_NAMMAE_APPLICATION_CLOSED_CODE ||
    value === DAY_NAMMAE_SCHEDULE_INVALID_CODE
  );
}

export function evaluateDayNammaeApplicationCutoff(params: {
  scheduleDate: unknown;
  timeSlot: unknown;
  nowMs?: number;
}):
  | {
      valid: true;
      closed: boolean;
      scheduleStartsAt: string;
      cutoffAt: string;
    }
  | { valid: false } {
  const scheduleDate = String(params.scheduleDate || "").trim();
  const timeSlot = String(params.timeSlot || "").trim();
  const dateMatch = scheduleDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = timeSlot.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

  if (!dateMatch || !timeMatch) return { valid: false };

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));

  if (
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return { valid: false };
  }

  const normalizedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const scheduleStartsAtMs = Date.parse(
    `${scheduleDate}T${normalizedTime}:00+09:00`
  );
  const nowMs = params.nowMs ?? Date.now();
  if (!Number.isFinite(scheduleStartsAtMs) || !Number.isFinite(nowMs)) {
    return { valid: false };
  }

  const cutoffAtMs = scheduleStartsAtMs - APPLICATION_CUTOFF_MS;
  return {
    valid: true,
    closed: nowMs >= cutoffAtMs,
    scheduleStartsAt: new Date(scheduleStartsAtMs).toISOString(),
    cutoffAt: new Date(cutoffAtMs).toISOString(),
  };
}
