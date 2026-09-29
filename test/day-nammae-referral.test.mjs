import test from "node:test";
import assert from "node:assert/strict";
import {
  referralFailureMessage,
  referralInputMessage,
} from "../src/features/day-nammae/referral.ts";

test("each known rejection provides a reason and next action", () => {
  for (const [reason, expected] of [
    ["본인의 추천 코드는 사용할 수 없습니다.", "다른 지인"],
    ["추천 코드와 전화번호를 확인해 주세요.", "비활성"],
    ["이미 추천 할인을 이용하셨습니다.", "최초 1회"],
    ["이미 추천 할인이 적용된 진행 중 신청이 있어", "기존 신청"],
    ["추천 프로그램은 현재 준비 또는 중단 상태입니다.", "나중에 다시"],
    ["쿠폰", "하나를 선택"],
  ])
    assert.ok(referralFailureMessage(reason).includes(expected), reason);
  assert.ok(!referralFailureMessage("internal SQL secret").includes("SQL"));
});

test("empty, partial and malformed codes or phone cannot validate", () => {
  for (const code of ["", "AB12", "!!!!!!"])
    assert.notEqual(referralInputMessage(code, "01000000000"), "");
  for (const phone of ["", "010", "99999999999"])
    assert.notEqual(referralInputMessage("AB12CD", phone), "");
  assert.equal(referralInputMessage("AB12CD", "01000000000"), "");
});

import ts from "typescript";
import { readFile } from "node:fs/promises";
const dataUrl = (source) =>
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const referralUrl = dataUrl(
  ts.transpileModule(
    await readFile(
      new URL("../src/features/day-nammae/referral.ts", import.meta.url),
      "utf8",
    ),
    { compilerOptions: { module: ts.ModuleKind.ESNext } },
  ).outputText,
);
const nextStub = dataUrl(
  'export const NextResponse = {json:(body, init)=>new Response(JSON.stringify(body), {...init, headers:{...init.headers,"Content-Type":"application/json"}})};',
);
const supabaseStub = dataUrl(
  "export function createClient(){return {rpc(name,args){globalThis.referralRpcCalls.push({name,args});return {abortSignal(){return Promise.resolve(globalThis.referralRpcResult)}}}}}",
);
const source = (
  await readFile(
    new URL(
      "../src/app/api/offline/day-nammae/referral/validate/route.ts",
      import.meta.url,
    ),
    "utf8",
  )
)
  .replace('"next/server"', JSON.stringify(nextStub))
  .replace('"@supabase/supabase-js"', JSON.stringify(supabaseStub))
  .replace('"@/features/day-nammae/referral"', JSON.stringify(referralUrl));
const { POST } = await import(
  dataUrl(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
  )
);

test("validation API is read-only, validates input, whitelists output and fails closed", async () => {
  const previous = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-not-a-real-key";
  globalThis.referralRpcCalls = [];
  const request = (body) =>
    new Request("http://localhost/api/validate", {
      method: "POST",
      body: JSON.stringify(body),
    });
  try {
    assert.equal(
      (await POST(request({ code: "", phone: "01000000000" }))).status,
      400,
    );
    assert.equal(
      (
        await POST(
          request({ code: "AB12CD", phone: "01000000000", hasCoupon: true }),
        )
      ).status,
      409,
    );
    assert.equal(globalThis.referralRpcCalls.length, 0);
    globalThis.referralRpcResult = {
      data: { success: true, phone: "private", code: "AB12CD" },
      error: null,
    };
    const response = await POST(
      request({ code: " ab12cd ", phone: "010-0000-0000" }),
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(globalThis.referralRpcCalls, [
      {
        name: "validate_day_nammae_referral",
        args: { p_code: "AB12CD", p_phone: "01000000000" },
      },
    ]);
    assert.deepEqual(Object.keys(await response.json()).sort(), [
      "message",
      "success",
    ]);
    globalThis.referralRpcResult = {
      data: {
        success: false,
        reason: "본인의 추천 코드는 사용할 수 없습니다.",
      },
      error: null,
    };
    assert.equal(
      (await POST(request({ code: "AB12CD", phone: "01000000000" }))).status,
      409,
    );
    globalThis.referralRpcResult = {
      data: null,
      error: { message: "secret internal failure" },
    };
    const failure = await POST(
      request({ code: "AB12CD", phone: "01000000000" }),
    );
    assert.equal(failure.status, 503);
    assert.ok(!(await failure.text()).includes("secret"));
    globalThis.referralRpcResult = { data: {}, error: null };
    assert.equal(
      (await POST(request({ code: "AB12CD", phone: "01000000000" }))).status,
      503,
    );
  } finally {
    if (previous === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previous;
    delete globalThis.referralRpcCalls;
    delete globalThis.referralRpcResult;
  }
});
