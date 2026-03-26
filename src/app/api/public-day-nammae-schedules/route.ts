import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DAY_NAMMAE_SUPABASE_URL = "https://ferhwwjztseoegaizsko.supabase.co";
const REQUEST_TABLE = "day-nammae-request";

interface ExposureSettingRow {
  schedule: string;
  request_table: string;
  visible: boolean;
  closed_female: boolean | null;
  closed_male: boolean | null;
  max_capacity: number | null;
  approved_female: number | null;
  approved_male: number | null;
  dummy_female: number | null;
  dummy_male: number | null;
}

interface StaffScheduleRow {
  schedule_date: string;
  time_slot: string | null;
  label: string | null;
  status: string | null;
}

function getTodayKst() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getCloseStatus({
  closedFemale,
  closedMale,
}: {
  closedFemale: boolean;
  closedMale: boolean;
}) {
  if (closedFemale && closedMale) {
    return "전체마감";
  }

  if (closedFemale) {
    return "여자마감";
  }

  if (closedMale) {
    return "남자마감";
  }

  return "오픈";
}

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return jsonResponse(
      {
        error: "Failed to fetch public day-nammae schedules",
        detail: "SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다.",
      },
      500
    );
  }

  try {
    const supabase = createClient(DAY_NAMMAE_SUPABASE_URL, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const todayKst = getTodayKst();

    const [{ data: exposureSettings, error: exposureError }, { data: staffSchedules, error: staffError }] =
      await Promise.all([
        supabase
          .from("exposure_settings")
          .select(
            "schedule, request_table, visible, closed_female, closed_male, max_capacity, approved_female, approved_male, dummy_female, dummy_male"
          )
          .eq("request_table", REQUEST_TABLE)
          .eq("visible", true),
        supabase
          .from("staff_schedules")
          .select("schedule_date, time_slot, label, status")
          .gte("schedule_date", todayKst)
          .eq("status", "상정"),
      ]);

    if (exposureError) {
      throw exposureError;
    }

    if (staffError) {
      throw staffError;
    }

    const schedules = (exposureSettings as ExposureSettingRow[])
      .map((exposure) => {
        const matchedStaffSchedule = (staffSchedules as StaffScheduleRow[]).find(
          (staffSchedule) =>
            typeof staffSchedule.label === "string" &&
            exposure.schedule.startsWith(staffSchedule.label)
        );

        if (!matchedStaffSchedule?.label || !matchedStaffSchedule.schedule_date) {
          return null;
        }

        const approvedFemale = exposure.approved_female ?? 0;
        const approvedMale = exposure.approved_male ?? 0;
        const dummyFemale = exposure.dummy_female ?? 0;
        const dummyMale = exposure.dummy_male ?? 0;
        const exposedFemale = approvedFemale + dummyFemale;
        const exposedMale = approvedMale + dummyMale;

        return {
          schedule: exposure.schedule,
          scheduleDate: matchedStaffSchedule.schedule_date,
          timeSlot: matchedStaffSchedule.time_slot || "",
          label: matchedStaffSchedule.label,
          requestTable: REQUEST_TABLE,
          closeStatus: getCloseStatus({
            closedFemale: Boolean(exposure.closed_female),
            closedMale: Boolean(exposure.closed_male),
          }),
          visible: true,
          closedFemale: Boolean(exposure.closed_female),
          closedMale: Boolean(exposure.closed_male),
          maxCapacity: exposure.max_capacity ?? 48,
          approvedFemale,
          approvedMale,
          dummyFemale,
          dummyMale,
          exposedFemale,
          exposedMale,
          exposedTotal: exposedFemale + exposedMale,
        };
      })
      .filter(
        (
          schedule
        ): schedule is NonNullable<typeof schedule> => schedule !== null
      )
      .sort((a, b) => {
        const aKey = `${a.scheduleDate}T${a.timeSlot || "00:00"}`;
        const bKey = `${b.scheduleDate}T${b.timeSlot || "00:00"}`;
        return aKey.localeCompare(bKey);
      });

    return jsonResponse({
      requestTable: REQUEST_TABLE,
      generatedAt: new Date().toISOString(),
      todayKst,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: "Failed to fetch public day-nammae schedules",
        detail:
          error instanceof Error ? error.message : "Unknown server error",
      },
      500
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });
}
