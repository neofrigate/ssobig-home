import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as errors from "../src/features/day-nammae/waitlistAlertErrors.ts";
import * as cutoff from "../src/features/day-nammae/applicationCutoff.ts";
import * as integrity from "../src/lib/day-nammae-application-integrity.ts";

async function submitWithEdgeResponse(status, body) {
  const captured = [];
  const logs = [];
  const module = { exports: {} };
  const source = readFileSync(new URL("../src/app/api/offline/day-nammae/apply/route.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const scope = { setTag() {}, setContext() {}, setFingerprint() {}, setExtra() {} };
  const imports = {
    "@/features/day-nammae/waitlistAlertErrors": errors,
    "@/features/day-nammae/applicationCutoff": cutoff,
    "@/lib/day-nammae-application-integrity": integrity,
    "@/features/day-nammae/referral": {},
    "@sentry/nextjs": { withScope: fn => fn(scope), captureException: e => captured.push(e) },
    "next/server": { NextResponse: Response },
    "@supabase/supabase-js": { createClient() { throw new Error("Unexpected database mutation"); } },
  };
  vm.runInNewContext(outputText, {
    module, exports: module.exports,
    require: name => { assert.ok(name in imports, name); return imports[name]; },
    process: { env: { SUPABASE_SERVICE_ROLE_KEY: "test-only" } },
    console: Object.fromEntries(["log", "warn", "error"].map(level => [level, (...args) => logs.push({ level, args })])),
    fetch: async () => Response.json(body, { status }),
    Request, Response, Headers, URL, FormData, File, Blob, Date, Math, crypto: globalThis.crypto,
  });
  const form = new FormData();
  for (const [key, value] of Object.entries({
    gender: "여성", schedule: "10/24 (토) 15:00", name: "테스트", phone: "01000000000",
    applicationMode: "waitlist_alert", client_request_id: "test-waitlist-approved",
  })) form.set(key, value);
  const response = await module.exports.POST(new Request("http://localhost/api/offline/day-nammae/apply", { method: "POST", body: form }));
  return { response, body: await response.json(), captured, logs };
}

test("already approved refusal returns actionable guidance without Sentry or error logs", async () => {
  const result = await submitWithEdgeResponse(400, { success: false, error: errors.WAITLIST_ALERT_ALREADY_APPROVED_EDGE_MESSAGE });
  assert.equal(result.response.status, 400);
  assert.equal(result.body.code, errors.WAITLIST_ALERT_ALREADY_APPROVED_CODE);
  assert.equal(result.body.userMessage, errors.WAITLIST_ALERT_ALREADY_APPROVED_MESSAGE);
  assert.ok(result.body.requestId);
  assert.equal(result.captured.length, 0);
  assert.equal(result.logs.filter(log => log.level === "error").length, 0);
});

test("closed waitlist keeps existing guidance without Sentry", async () => {
  const result = await submitWithEdgeResponse(400, { error: "waitlist alert is not available for this schedule" });
  assert.equal(result.response.status, 400);
  assert.match(result.body.userMessage, /마감된 일정/);
  assert.equal(result.captured.length, 0);
});

test("unexpected backend failure remains a server error reported to Sentry", async () => {
  const result = await submitWithEdgeResponse(500, { error: "database connection failed" });
  assert.equal(result.response.status, 500);
  assert.equal(result.captured.length, 1);
  assert.match(result.body.userMessage, /문의 코드/);
  assert.doesNotMatch(result.body.userMessage, /database/);
});

test("client preserves the approved refusal code and server guidance", () => {
  const file = new URL("../src/components/day-nammae/apply/LoveBuddiesApplyFlow.tsx", import.meta.url);
  const source = ts.createSourceFile(file.pathname, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const names = ["isSubmitFailureCode", "getResponseErrorCode", "buildResponseFailureMessage"];
  const functions = source.statements
    .filter(node => ts.isFunctionDeclaration(node) && names.includes(node.name?.text))
    .map(node => node.getText(source)).join("\n");
  const { outputText } = ts.transpileModule(functions, { compilerOptions: { target: ts.ScriptTarget.ES2022 } });
  const client = vm.runInNewContext(outputText + ";({ getResponseErrorCode, buildResponseFailureMessage })", {
    WAITLIST_ALERT_ALREADY_APPROVED_CODE: errors.WAITLIST_ALERT_ALREADY_APPROVED_CODE,
    isDayNammaeApplicationErrorCode: cutoff.isDayNammaeApplicationErrorCode,
  });
  assert.equal(client.getResponseErrorCode({ code: errors.WAITLIST_ALERT_ALREADY_APPROVED_CODE }), errors.WAITLIST_ALERT_ALREADY_APPROVED_CODE);
  assert.equal(client.buildResponseFailureMessage({ userMessage: errors.WAITLIST_ALERT_ALREADY_APPROVED_MESSAGE }, null), errors.WAITLIST_ALERT_ALREADY_APPROVED_MESSAGE);
});
