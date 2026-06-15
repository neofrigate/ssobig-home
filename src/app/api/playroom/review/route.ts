import { createSign } from "node:crypto";
import { NextResponse } from "next/server";

type EnvName = "staging" | "production";

type FirebaseServiceAccount = {
  client_email?: string;
  private_key?: string;
};

type AccessTokenCacheEntry = {
  accessToken: string;
  expiresAt: number;
};

type PlayerRow = {
  id: string;
  data: Record<string, unknown>;
};

type ReviewLookup = {
  env: EnvName;
  gameId: string;
  playerId: string;
  game: {
    id: string;
    title: string;
    templateId: string;
    enterCode: string;
    imageUrl: string;
  };
  player: {
    id: string;
    recordId: string;
    nickname: string;
    number: number | null;
    isBot: boolean;
    sex: string;
    name: string;
    phoneNumber: string;
    email: string;
    age: string;
  };
};

const PLAYROOM_REVIEW_SUBMIT_URL =
  process.env.PLAYROOM_REVIEW_SUBMIT_URL?.trim() ||
  "https://tlyioijsopxeegzfjlqe.supabase.co/functions/v1/submit-playroom-review";
const PLAYROOM_REVIEW_SUBMIT_SECRET =
  process.env.PLAYROOM_REVIEW_SUBMIT_SECRET?.trim() || "";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIREBASE_SCOPE =
  "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email";
const TOKEN_CACHE = new Map<EnvName, AccessTokenCacheEntry>();
const SATISFACTION_VALUES = new Set([
  "🥰 최고예요",
  "🙂 괜찮아요",
  "🥲 아쉬워요",
]);

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return "";
}

function normalizeEnv(value: unknown): EnvName {
  return String(value || "").trim().toLowerCase() === "staging"
    ? "staging"
    : "production";
}

function parseEnv(value: unknown): EnvName | null {
  const text = String(value || "production").trim().toLowerCase();
  if (text === "staging" || text === "production") return text;
  return null;
}

function nullableNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePhoneNumber(value: unknown) {
  const text = firstString(value);
  if (!text) return "";
  const digits = text.replace(/[^0-9]/g, "");
  if (digits.startsWith("82")) return `0${digits.slice(2)}`;
  return digits || text;
}

function isBotIdentity(value: unknown) {
  return firstString(value).toLowerCase().startsWith("bot_");
}

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function firebaseSecretName(env: EnvName, suffix: string) {
  return `FIREBASE_${env.toUpperCase()}_${suffix}`;
}

function getServiceAccount(env: EnvName): FirebaseServiceAccount {
  const raw = process.env[firebaseSecretName(env, "SERVICE_ACCOUNT_JSON")];
  if (!raw) {
    throw new Error(`${firebaseSecretName(env, "SERVICE_ACCOUNT_JSON")} is missing`);
  }
  const account = JSON.parse(raw) as FirebaseServiceAccount;
  if (!account.client_email || !account.private_key) {
    throw new Error(`${firebaseSecretName(env, "SERVICE_ACCOUNT_JSON")} is invalid`);
  }
  return {
    ...account,
    private_key: account.private_key.replace(/\\n/g, "\n"),
  };
}

function getDatabaseBaseUrl(env: EnvName) {
  const databaseUrl = process.env[firebaseSecretName(env, "DATABASE_URL")]?.trim();
  if (!databaseUrl) {
    throw new Error(`${firebaseSecretName(env, "DATABASE_URL")} is missing`);
  }
  return databaseUrl.replace(/\/+$/, "");
}

function signJwt(account: FirebaseServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const payload = {
    iss: account.client_email,
    scope: FIREBASE_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(payload)
  )}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(account.private_key || "");
  return `${unsigned}.${base64UrlEncode(signature)}`;
}

async function getGoogleAccessToken(env: EnvName) {
  const cached = TOKEN_CACHE.get(env);
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.accessToken;
  }

  const account = getServiceAccount(env);
  const assertion = signJwt(account);
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const data = (await response.json().catch(() => null)) as
    | { access_token?: string; expires_in?: number; error?: string }
    | null;

  if (!response.ok || !data?.access_token) {
    throw new Error(data?.error || "Failed to obtain Firebase access token");
  }

  TOKEN_CACHE.set(env, {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  });
  return data.access_token;
}

async function rtdbRequest(env: EnvName, path: string) {
  const accessToken = await getGoogleAccessToken(env);
  const response = await fetch(`${getDatabaseBaseUrl(env)}/${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error?: unknown }).error)
        : "Realtime Database request failed";
    throw new Error(message);
  }
  return data;
}

async function rtdbQueryByChild(
  env: EnvName,
  node: string,
  child: string,
  value: string
) {
  const params = new URLSearchParams({
    orderBy: JSON.stringify(child),
    equalTo: JSON.stringify(value),
  });
  return rtdbRequest(env, `${node}.json?${params.toString()}`);
}

function normalizeRecordMap(raw: unknown): PlayerRow[] {
  if (!raw || typeof raw !== "object") return [];
  return Object.entries(raw as Record<string, unknown>).map(([id, value]) => ({
    id,
    data:
      value && typeof value === "object"
        ? (value as Record<string, unknown>)
        : {},
  }));
}

function playerIdentityTokens(id: string, data: Record<string, unknown>) {
  return [
    id,
    data.documentId,
    data.originalUserID,
    data.originalUserId,
    data.userId,
    data.nickname,
    data.nickName,
    data.realName,
    data.displayName,
    data.name,
    data.number,
  ]
    .map((value) => firstString(value).toLowerCase())
    .filter(Boolean);
}

function mergePlayerRows(
  players: PlayerRow[],
  gamePlayerList: Record<string, unknown> | null
) {
  const merged: PlayerRow[] = [];
  const indexByToken = new Map<string, number>();

  function addPlayer(id: string, data: Record<string, unknown>) {
    const tokens = playerIdentityTokens(id, data);
    const existingIndex = tokens
      .map((token) => indexByToken.get(token))
      .find((index): index is number => index !== undefined);
    const index = existingIndex ?? merged.length;
    merged[index] =
      existingIndex !== undefined
        ? { id: merged[index].id, data: { ...data, ...merged[index].data } }
        : { id, data };

    playerIdentityTokens(merged[index].id, merged[index].data)
      .concat(tokens)
      .forEach((token) => indexByToken.set(token, index));
  }

  players.forEach(({ id, data }) => addPlayer(id, data));

  const listedPlayersSource =
    gamePlayerList?.players && typeof gamePlayerList.players === "object"
      ? (gamePlayerList.players as Record<string, unknown>)
      : gamePlayerList || {};
  const listedPlayers =
    listedPlayersSource && typeof listedPlayersSource === "object"
      ? listedPlayersSource
      : {};
  Object.entries(listedPlayers).forEach(([id, value]) => {
    if (!value || typeof value !== "object") return;
    addPlayer(id, value as Record<string, unknown>);
  });

  return merged.sort((a, b) => {
    return (nullableNumber(a.data.number) || 0) - (nullableNumber(b.data.number) || 0);
  });
}

function findPlayer(rows: PlayerRow[], playerId: string) {
  const normalized = playerId.toLowerCase();
  return (
    rows.find(({ id, data }) => playerIdentityTokens(id, data).includes(normalized)) ||
    null
  );
}

function buildPlayer(id: string, data: Record<string, unknown>) {
  const number = nullableNumber(data.number);
  const playerId = firstString(data.originalUserID, data.originalUserId, data.userId, id);
  return {
    id: playerId,
    recordId: id,
    nickname: firstString(
      data.nickname,
      data.nickName,
      data.realName,
      data.displayName,
      data.name,
      "익명"
    ),
    number,
    isBot:
      isBotIdentity(playerId) ||
      isBotIdentity(id) ||
      isBotIdentity(data.documentId) ||
      isBotIdentity(data.nickname) ||
      isBotIdentity(data.nickName) ||
      isBotIdentity(data.realName) ||
      isBotIdentity(data.displayName) ||
      isBotIdentity(data.email),
    sex: firstString(data.sex, data.gender),
    name: firstString(data.realName, data.displayName, data.name),
    phoneNumber: normalizePhoneNumber(firstString(data.phoneNumber, data.phone, data.mobile)),
    email: firstString(data.email),
    age: firstString(data.age),
  };
}

async function loadReviewLookup(
  env: EnvName,
  gameId: string,
  playerId: string
): Promise<ReviewLookup> {
  const game = (await rtdbRequest(
    env,
    `games/${encodeURIComponent(gameId)}.json`
  )) as Record<string, unknown> | null;
  if (!game) {
    const error = new Error("Room not found");
    error.name = "RoomNotFound";
    throw error;
  }

  const [playersRaw, gamePlayerListRaw] = await Promise.all([
    rtdbQueryByChild(env, "players", "gameId", gameId),
    rtdbRequest(env, `gamePlayerList/${encodeURIComponent(gameId)}.json`).catch(
      () => null
    ),
  ]);
  const players = mergePlayerRows(
    normalizeRecordMap(playersRaw),
    gamePlayerListRaw && typeof gamePlayerListRaw === "object"
      ? (gamePlayerListRaw as Record<string, unknown>)
      : null
  );
  const row = findPlayer(players, playerId);
  if (!row) {
    const error = new Error("Player not found");
    error.name = "PlayerNotFound";
    throw error;
  }

  return {
    env,
    gameId,
    playerId,
    game: {
      id: gameId,
      title: firstString(game.title, game.documentId, gameId),
      templateId: firstString(game.templateId),
      enterCode: firstString(game.enterCode),
      imageUrl: firstString(game.imageUrl, game.backgroundImageUrl),
    },
    player: buildPlayer(row.id, row.data),
  };
}

function readStringField(body: Record<string, unknown>, key: string) {
  return typeof body[key] === "string" ? body[key].trim() : "";
}

async function parseReviewRequest(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | Record<string, unknown>
    | null;
  if (!body) {
    return { error: "Invalid request body" as const };
  }
  return { body };
}

function responseForLookupError(error: unknown) {
  if (error instanceof Error && error.name === "RoomNotFound") {
    return jsonResponse({ success: false, error: "Room not found" }, 404);
  }
  if (error instanceof Error && error.name === "PlayerNotFound") {
    return jsonResponse({ success: false, error: "Player not found" }, 404);
  }
  console.error("[playroom-review] lookup error", error);
  return jsonResponse({ success: false, error: "Failed to load review context" }, 500);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gameId = firstString(url.searchParams.get("gameId"));
  const playerId = firstString(url.searchParams.get("playerId"));
  const env = parseEnv(url.searchParams.get("env"));

  if (!env) {
    return jsonResponse({ success: false, error: "Invalid env" }, 400);
  }
  if (!gameId || !playerId) {
    return jsonResponse(
      { success: false, error: "gameId and playerId are required" },
      400
    );
  }

  try {
    const lookup = await loadReviewLookup(env, gameId, playerId);
    return jsonResponse({ success: true, data: lookup });
  } catch (error) {
    return responseForLookupError(error);
  }
}

export async function POST(request: Request) {
  const parsed = await parseReviewRequest(request);
  if ("error" in parsed) {
    return jsonResponse({ success: false, error: parsed.error }, 400);
  }

  const body = parsed.body;
  const env = parseEnv(body.env);
  const gameId = readStringField(body, "gameId");
  const playerId = readStringField(body, "playerId");
  const satisfaction = readStringField(body, "satisfaction");

  if (!env) {
    return jsonResponse({ success: false, error: "Invalid env" }, 400);
  }
  if (!gameId || !playerId) {
    return jsonResponse(
      { success: false, error: "gameId and playerId are required" },
      400
    );
  }
  if (isBotIdentity(playerId)) {
    return jsonResponse({ success: false, error: "Bot players cannot submit reviews" }, 403);
  }
  if (!SATISFACTION_VALUES.has(satisfaction)) {
    return jsonResponse({ success: false, error: "satisfaction is required" }, 400);
  }

  if (!PLAYROOM_REVIEW_SUBMIT_SECRET) {
    console.error("[playroom-review] PLAYROOM_REVIEW_SUBMIT_SECRET is missing");
    return jsonResponse({ success: false, error: "Review submit is not configured" }, 500);
  }

  try {
    const response = await fetch(PLAYROOM_REVIEW_SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-playroom-review-secret": PLAYROOM_REVIEW_SUBMIT_SECRET,
      },
      body: JSON.stringify({
        gameId,
        playerId,
        env: normalizeEnv(env),
        satisfaction,
        playExperience: readStringField(body, "playExperience"),
        inflowSource: readStringField(body, "inflowSource"),
        recommendationTarget: readStringField(body, "recommendationTarget"),
        charmPoint: readStringField(body, "charmPoint"),
        sequelInterest: readStringField(body, "sequelInterest"),
        additionalComment: readStringField(body, "additionalComment"),
      }),
    });
    const responseBody = (await response.json().catch(() => null)) as
      | { success?: boolean; data?: unknown; error?: string }
      | null;

    if (!response.ok || responseBody?.success !== true) {
      return jsonResponse(
        {
          success: false,
          error: responseBody?.error || "Failed to submit review",
        },
        502
      );
    }

    return jsonResponse({
      success: true,
      data: responseBody.data || null,
    });
  } catch (error) {
    console.error("[playroom-review] submit error", error);
    return jsonResponse({ success: false, error: "Failed to submit review" }, 502);
  }
}
