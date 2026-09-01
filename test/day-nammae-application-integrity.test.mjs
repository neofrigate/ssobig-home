import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveDayNammaeDuplicateUpload,
  sanitizeDayNammaeSentryContext,
} from "../src/lib/day-nammae-application-integrity.ts";

test("duplicate retry removes only the newly uploaded photo", () => {
  assert.deepEqual(
    resolveDayNammaeDuplicateUpload({
      edgeBody: { duplicate: true, uuid: "persisted-uuid" },
      currentUuid: "retry-uuid",
      uploadedPath: "day-nammae/retry-uuid/photo.jpg",
    }),
    {
      persistedUuid: "persisted-uuid",
      duplicate: true,
      shouldCleanupUpload: true,
    },
  );
});

test("first submission and exact UUID replay preserve the uploaded photo", () => {
  assert.equal(
    resolveDayNammaeDuplicateUpload({
      edgeBody: { duplicate: false, uuid: "first-uuid" },
      currentUuid: "first-uuid",
      uploadedPath: "day-nammae/first-uuid/photo.jpg",
    }).shouldCleanupUpload,
    false,
  );

  assert.equal(
    resolveDayNammaeDuplicateUpload({
      edgeBody: { duplicate: true, uuid: "first-uuid" },
      currentUuid: "first-uuid",
      uploadedPath: "day-nammae/first-uuid/photo.jpg",
    }).shouldCleanupUpload,
    false,
  );
});

test("Sentry context keeps diagnostics but drops file names and navigation data", () => {
  assert.deepEqual(
    sanitizeDayNammaeSentryContext({
      debugClientContext: {
        inAppBrowserName: "KakaoTalk",
        viewport: "390x844",
        onLine: true,
        visibilityState: "visible",
        connectionEffectiveType: "4g",
        connectionRtt: 50,
        connectionDownlink: 7.5,
        connectionSaveData: false,
        pageUrl: "https://example.com/private?phone=01012345678",
        referrer: "https://example.com/private-referrer",
      },
      photoContext: {
        photoName: "홍길동-증명사진.jpg",
        photoType: "image/jpeg",
        photoSize: 12345,
        photoLastModified: 123456789,
      },
    }),
    {
      photoType: "image/jpeg",
      photoSize: 12345,
      inAppBrowserName: "KakaoTalk",
      viewport: "390x844",
      onLine: true,
      visibilityState: "visible",
      connectionEffectiveType: "4g",
      connectionRtt: 50,
      connectionDownlink: 7.5,
      connectionSaveData: false,
    },
  );
});
