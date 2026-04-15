import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DAY_NAMMAE_SUPABASE_URL = "https://ferhwwjztseoegaizsko.supabase.co";
const OFFLINE_REQUEST_TABLES = [
  "day-nammae-request",
  "day-manito-request",
  "game-orb-request",
] as const;
const LEGACY_PARTICIPANT_COUNT = 14000;
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

async function fetchApprovedCount(
  serviceRoleKey: string,
  tableName: (typeof OFFLINE_REQUEST_TABLES)[number]
) {
  const supabase = createClient(DAY_NAMMAE_SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true })
    .eq("approved", true);

  if (error) {
    throw new Error(`${tableName} count query failed: ${error.message}`);
  }

  return count ?? 0;
}

export async function GET() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        error: "SUPABASE_SERVICE_ROLE_KEY is missing",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  try {
    const counts = await Promise.all(
      OFFLINE_REQUEST_TABLES.map((tableName) =>
        fetchApprovedCount(serviceRoleKey, tableName)
      )
    );

    const liveParticipants = counts.reduce((sum, count) => sum + count, 0);
    const totalParticipants = LEGACY_PARTICIPANT_COUNT + liveParticipants;

    return NextResponse.json(
      {
        legacyParticipants: LEGACY_PARTICIPANT_COUNT,
        liveParticipants,
        totalParticipants,
        source: "legacy-offset-plus-supabase-approved-offline-requests",
      },
      {
        headers: {
          "Cache-Control": CACHE_CONTROL,
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch offline participant count:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch offline participant count",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
