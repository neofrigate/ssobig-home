import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';

const route = readFileSync('src/app/api/offline/day-nammae/apply/route.ts', 'utf8');
const flow = readFileSync('src/components/day-nammae/apply/LoveBuddiesApplyFlow.tsx', 'utf8');
test('server conversions persist in a private outbox instead of a best-effort cross-project request', () => {
  assert.match(route, /from\("day_nammae_meta_outbox"\)\.upsert/);
  assert.match(route, /onConflict: "event_id", ignoreDuplicates: true/);
  assert.doesNotMatch(route, /DAY_NAMMAE_CAPI_RELAY_SECRET/);
  assert.match(route, /metaCapiContext:[\s\S]*client_ip_address: getClientIp\(request.headers\)/);
  assert.match(route, /day-nammae-capi-outbox/);
});
test('registration uses the browser conversion ID and does not pretend to be purchase revenue', () => {
  const event = flow.slice(flow.indexOf('trackDayNammaeMetaStandardEvent("CompleteRegistration"'), flow.indexOf('trackDayNammaeMetaStandardEvent("CompleteRegistration"') + 300);
  assert.match(event, /eventId: completeRegistrationEventId/);
  assert.doesNotMatch(event, /value:/);
});
test('optional registration value does not remove real content and checkout prices', () => {
  const source = readFileSync('src/utils/metaPixel.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const calls = [];
  const context = { exports: {}, window: { fbq: (...args) => calls.push(args) }, console };
  vm.createContext(context); vm.runInContext(compiled, context);
  const track = context.exports.trackDayNammaeMetaStandardEvent;
  track('CompleteRegistration', { eventId: 'fixture' });
  assert.equal(calls[0][2].value, undefined);
  assert.equal(calls[0][2].currency, undefined);
  track('InitiateCheckout', { value: 24500, eventId: 'checkout' });
  assert.equal(calls[1][2].value, 24500);
  assert.equal(calls[1][2].currency, 'KRW');
  assert.doesNotMatch(source, /safeFbq\("track",\s*"Purchase"/);
});
