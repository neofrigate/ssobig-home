import assert from "node:assert/strict";
import test from "node:test";

import {
  getClientSentryDebugContext,
  shouldIgnoreKnownInAppBrowserError,
} from "../src/lib/sentry-debug.ts";

const iosUa =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23F84";
const bridgeError =
  "undefined is not an object (evaluating 'window.webkit.messageHandlers')";

function eventFor(t, userAgent, value = bridgeError, type = "TypeError") {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  t.after(() => {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      delete globalThis.window;
    }
  });
  globalThis.window = {
    location: new URL("https://www.ssobig.com/offline/11namme"),
    navigator: { userAgent, language: "ko-KR" },
    document: { referrer: "" },
  };
  return {
    ...getClientSentryDebugContext(),
    exception: { values: [{ type, value }] },
  };
}

test("observed Barcelona iOS event is recognized and filtered", (t) => {
  const event = eventFor(t, `${iosUa} Barcelona 422.0.0.31.66 IABMV/1`);
  assert.equal(event.tags.in_app_browser, "true");
  assert.equal(event.tags.in_app_browser_name, "threads");
  assert.equal(shouldIgnoreKnownInAppBrowserError(event), true);
});

test("Threads marker takes precedence over an Instagram marker", (t) => {
  const event = eventFor(t, `${iosUa} Threads Instagram`);
  assert.equal(event.tags.in_app_browser_name, "threads");
  assert.equal(shouldIgnoreKnownInAppBrowserError(event), true);
});

for (const [name, ua, value, type] of [
  ["Safari", `${iosUa} Version/18.7 Safari/604.1`, bridgeError, "TypeError"],
  ["Kakao", `${iosUa} KAKAOTALK`, bridgeError, "TypeError"],
  ["Android Threads", "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Barcelona", bridgeError, "TypeError"],
  ["application error", `${iosUa} Barcelona`, "application submission failed", "TypeError"],
  ["similar bridge message", `${iosUa} Barcelona`, `custom failure: ${bridgeError}`, "TypeError"],
  ["different exception type", `${iosUa} Barcelona`, bridgeError, "Error"],
  ["other Meta noise", `${iosUa} Barcelona`, "Java object is gone", "Error"],
]) {
  test(`${name} remains visible`, (t) => {
    assert.equal(shouldIgnoreKnownInAppBrowserError(eventFor(t, ua, value, type)), false);
  });
}

test("missing iOS context does not suppress the event", (t) => {
  const event = eventFor(t, `${iosUa} Barcelona`);
  delete event.contexts.browserContext;
  assert.equal(shouldIgnoreKnownInAppBrowserError(event), false);
});

for (const name of ["Instagram", "FBAN/FBIOS"]) {
  test(`${name} existing bridge filter is preserved`, (t) => {
    assert.equal(
      shouldIgnoreKnownInAppBrowserError(eventFor(t, `${iosUa} ${name}`)),
      true,
    );
  });
}

const iabInnerFrameError =
  "undefined is not an object (evaluating 'window._META.IABInnerFrame')";
const iabInnerFrameV8Error =
  "Cannot read properties of undefined (reading 'IABInnerFrame')";
const androidUa =
  "Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.0.0 Mobile Safari/537.36";

for (const [name, ua, value] of [
  ["Instagram iOS", `${iosUa} Instagram 400.0.0`, iabInnerFrameError],
  ["Facebook iOS", `${iosUa} [FBAN/FBIOS;FBAV/480.0]`, iabInnerFrameError],
  ["Threads iOS", `${iosUa} Barcelona 422.0.0.31.66`, iabInnerFrameError],
  ["Instagram Android", `${androidUa} Instagram 400.0.0`, iabInnerFrameV8Error],
  ["Facebook Android", `${androidUa} [FB_IAB/FB4A;FBAV/480.0]`, iabInnerFrameV8Error],
]) {
  test(`${name} _META.IABInnerFrame noise is filtered`, (t) => {
    assert.equal(shouldIgnoreKnownInAppBrowserError(eventFor(t, ua, value)), true);
  });
}

for (const [name, ua, value, type] of [
  ["Safari IABInnerFrame", `${iosUa} Version/18.7 Safari/604.1`, iabInnerFrameError, "TypeError"],
  ["Kakao IABInnerFrame", `${iosUa} KAKAOTALK`, iabInnerFrameError, "TypeError"],
  ["Chrome IABInnerFrame", `${androidUa}`, iabInnerFrameV8Error, "TypeError"],
  ["IABInnerFrame with non-TypeError", `${iosUa} Instagram`, iabInnerFrameError, "Error"],
  ["wrapped IABInnerFrame message", `${iosUa} Instagram`, `apply failed: ${iabInnerFrameError}`, "TypeError"],
  ["other undefined read in Instagram", `${iosUa} Instagram`, "undefined is not an object (evaluating 'window.form.value')", "TypeError"],
  ["other V8 undefined read in Instagram", `${androidUa} Instagram`, "Cannot read properties of undefined (reading 'value')", "TypeError"],
]) {
  test(`${name} remains visible`, (t) => {
    assert.equal(shouldIgnoreKnownInAppBrowserError(eventFor(t, ua, value, type)), false);
  });
}
