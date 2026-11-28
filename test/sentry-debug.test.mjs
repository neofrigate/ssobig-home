import assert from "node:assert/strict";
import test from "node:test";

import {
  getClientSentryDebugContext,
  shouldIgnoreKnownInAppBrowserError,
  shouldIgnoreKnownThirdPartyError,
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

const ourChunkFrame = {
  filename: "app:///_next/static/chunks/app/layout-0a1b2c3d.js",
  function: "submitApplication",
};

function exceptionEvent(type, value, frames) {
  return {
    exception: {
      values: [{ type, value, ...(frames ? { stacktrace: { frames } } : {}) }],
    },
  };
}

const sandboxError =
  'Sandbox access violation: Blocked a frame at "https://www.ssobig.com" from accessing a cross-origin frame. The frame being accessed is sandboxed and lacks the "allow-same-origin" flag.';
const autofillFrames = [
  { filename: "app:///playroom/kr/abc", function: "extractFormsAndFormElements_" },
  { filename: "app:///playroom/kr/abc", function: "hasPasswordField_" },
];
const extensionConnectionError =
  "Could not establish connection. Receiving end does not exist.";
const timerCallbackError = "callback `timer callback` was terminated";
const safeLinksRejection =
  "Non-Error promise rejection captured with value: Object Not Found Matching Id:3, MethodName:update, ParamCount:4";

for (const [name, event] of [
  ["iOS autofill sandbox SecurityError", exceptionEvent("SecurityError", sandboxError, autofillFrames)],
  ["autofill frame hasPasswordField_ only", exceptionEvent("SecurityError", sandboxError, [autofillFrames[1]])],
  ["extension connection error from injected script", exceptionEvent("Error", extensionConnectionError, [{ filename: "app:///injectedScript.bundle.js" }])],
  ["extension connection error without frames", exceptionEvent("Error", extensionConnectionError)],
  ["timer callback termination", exceptionEvent("Error", timerCallbackError, [{ filename: "app:///", lineno: 0 }])],
  ["Outlook SafeLinks rejection", exceptionEvent("UnhandledRejection", safeLinksRejection)],
  ["Outlook SafeLinks message event", { message: "Object Not Found Matching Id:12, MethodName:get, ParamCount:2" }],
]) {
  test(`${name} is filtered as third-party noise`, () => {
    assert.equal(shouldIgnoreKnownThirdPartyError(event), true);
  });
}

for (const [name, event] of [
  ["sandbox SecurityError from our code", exceptionEvent("SecurityError", sandboxError, [ourChunkFrame])],
  ["sandbox SecurityError without frames", exceptionEvent("SecurityError", sandboxError)],
  ["autofill frames with a different error", exceptionEvent("TypeError", "Cannot read properties of null (reading 'contentDocument')", autofillFrames)],
  ["sandbox message with non-SecurityError type", exceptionEvent("Error", sandboxError, autofillFrames)],
  ["extension connection error in our bundle", exceptionEvent("Error", extensionConnectionError, [{ filename: "app:///injectedScript.bundle.js" }, ourChunkFrame])],
  ["wrapped extension connection error", exceptionEvent("Error", `apply failed: ${extensionConnectionError}`)],
  ["timer callback termination in our bundle", exceptionEvent("Error", timerCallbackError, [ourChunkFrame])],
  ["Trusted Types sink error (filter on hold)", exceptionEvent("TypeError", "Failed to execute 'src': This document requires 'TrustedScriptURL' assignment for the 'HTMLScriptElement src' sink.", [ourChunkFrame])],
  ["similar Object Not Found message", exceptionEvent("Error", "Object Not Found: schedule 3")],
  ["our application error", exceptionEvent("Error", "Day Nammae client submit failed: client:fetch:transport_error", [ourChunkFrame])],
]) {
  test(`${name} remains visible`, () => {
    assert.equal(shouldIgnoreKnownThirdPartyError(event), false);
  });
}
