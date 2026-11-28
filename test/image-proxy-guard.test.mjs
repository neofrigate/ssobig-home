import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchGuardedImage,
  isAllowedImageContentType,
  isAllowedImageHost,
  normalizeNotionPageId,
  parseAllowedImageUrl,
} from "../src/lib/image-proxy-guard.ts";

const S3_URL =
  "https://prod-files-secure.s3.us-west-2.amazonaws.com/abc/def/image.png?X-Amz-Expires=3600";

function imageResponse(bytes = 4, headers = {}) {
  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: { "content-type": "image/png", ...headers },
  });
}

function mockFetch(responses) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    const next = responses.shift();
    if (typeof next === "function") return next(url, init);
    return next;
  };
  return { fetchImpl, calls };
}

test("allowed notion image hosts", () => {
  for (const host of [
    "prod-files-secure.s3.us-west-2.amazonaws.com",
    "s3.us-west-2.amazonaws.com",
    "notion.so",
    "www.notion.so",
    "file.notion.so",
    "foo.notion.site",
    "images.unsplash.com",
    "PROD-FILES-SECURE.S3.US-WEST-2.AMAZONAWS.COM",
  ]) {
    assert.equal(isAllowedImageHost(host), true, host);
  }
  for (const host of [
    "example.com",
    "evilnotion.so",
    "notion.so.evil.com",
    "attacker-bucket.s3.us-west-2.amazonaws.com",
    "169.254.169.254",
    "localhost",
    "www.ssobig.com",
  ]) {
    assert.equal(isAllowedImageHost(host), false, host);
  }
});

test("parseAllowedImageUrl requires https, allowed host, default port, no credentials", () => {
  assert.ok(parseAllowedImageUrl(S3_URL));
  assert.equal(parseAllowedImageUrl(null), null);
  assert.equal(parseAllowedImageUrl("not a url"), null);
  assert.equal(parseAllowedImageUrl("http://file.notion.so/a.png"), null);
  assert.equal(parseAllowedImageUrl("file:///etc/passwd"), null);
  assert.equal(parseAllowedImageUrl("https://file.notion.so:8443/a.png"), null);
  assert.equal(parseAllowedImageUrl("https://user:pw@file.notion.so/a.png"), null);
  assert.equal(parseAllowedImageUrl("https://example.com/a.png"), null);
  assert.equal(parseAllowedImageUrl("https://127.0.0.1/a.png"), null);
});

test("content type must be raster image/*", () => {
  assert.equal(isAllowedImageContentType("image/png"), true);
  assert.equal(isAllowedImageContentType("image/jpeg; charset=binary"), true);
  assert.equal(isAllowedImageContentType("IMAGE/WEBP"), true);
  assert.equal(isAllowedImageContentType("image/svg+xml"), false);
  assert.equal(isAllowedImageContentType("image/svg+xml; charset=utf-8"), false);
  assert.equal(isAllowedImageContentType("text/html"), false);
  assert.equal(isAllowedImageContentType("application/octet-stream"), false);
  assert.equal(isAllowedImageContentType(null), false);
  assert.equal(isAllowedImageContentType(""), false);
});

test("notion page id accepts 32 hex with or without hyphens", () => {
  assert.equal(
    normalizeNotionPageId("1A2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"),
    "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"
  );
  assert.equal(
    normalizeNotionPageId("1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"),
    "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"
  );
  for (const bad of [
    null,
    "",
    "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6",
    "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6dz",
    "../databases/xyz",
    "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d/../../users",
    "1a2b-3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
  ]) {
    assert.equal(normalizeNotionPageId(bad), null, String(bad));
  }
});

test("fetchGuardedImage returns image body and uses manual redirect + timeout signal", async () => {
  const { fetchImpl, calls } = mockFetch([imageResponse(8)]);
  const result = await fetchGuardedImage(S3_URL, { fetchImpl });
  assert.equal(result.ok, true);
  assert.equal(result.contentType, "image/png");
  assert.equal(result.body.byteLength, 8);
  assert.equal(calls[0].init.redirect, "manual");
  assert.ok(calls[0].init.signal instanceof AbortSignal);
});

test("fetchGuardedImage rejects disallowed host without fetching", async () => {
  const { fetchImpl, calls } = mockFetch([]);
  const result = await fetchGuardedImage("https://example.com/x.png", { fetchImpl });
  assert.deepEqual(result, { ok: false, status: 403, error: "Image host not allowed" });
  assert.equal(calls.length, 0);
});

test("fetchGuardedImage follows allowed redirect and blocks redirect to other host", async () => {
  const ok = mockFetch([
    new Response(null, { status: 302, headers: { location: "https://file.notion.so/b.png" } }),
    imageResponse(2),
  ]);
  const okResult = await fetchGuardedImage(S3_URL, { fetchImpl: ok.fetchImpl });
  assert.equal(okResult.ok, true);
  assert.equal(ok.calls[1].url, "https://file.notion.so/b.png");

  const bad = mockFetch([
    new Response(null, { status: 302, headers: { location: "http://169.254.169.254/latest/meta-data" } }),
  ]);
  const badResult = await fetchGuardedImage(S3_URL, { fetchImpl: bad.fetchImpl });
  assert.equal(badResult.ok, false);
  assert.equal(badResult.status, 403);
  assert.equal(bad.calls.length, 1);
});

test("fetchGuardedImage stops after too many redirects", async () => {
  const loop = () =>
    new Response(null, { status: 302, headers: { location: "https://file.notion.so/loop.png" } });
  const { fetchImpl, calls } = mockFetch([loop, loop, loop, loop, loop, loop]);
  const result = await fetchGuardedImage(S3_URL, { fetchImpl });
  assert.equal(result.ok, false);
  assert.equal(result.status, 502);
  assert.equal(calls.length, 4);
});

test("fetchGuardedImage rejects html and svg content types with 415", async () => {
  for (const type of ["text/html", "image/svg+xml"]) {
    const { fetchImpl } = mockFetch([
      new Response("<script>alert(1)</script>", { status: 200, headers: { "content-type": type } }),
    ]);
    const result = await fetchGuardedImage(S3_URL, { fetchImpl });
    assert.deepEqual(result, { ok: false, status: 415, error: "Unsupported content type" }, type);
  }
});

test("fetchGuardedImage enforces size limit by content-length and by bytes read", async () => {
  const declared = mockFetch([imageResponse(4, { "content-length": "999999" })]);
  const declaredResult = await fetchGuardedImage(S3_URL, { fetchImpl: declared.fetchImpl, maxBytes: 100 });
  assert.equal(declaredResult.ok, false);
  assert.equal(declaredResult.error, "Image too large");

  // content-length 없이 실제 바이트가 상한 초과
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(60));
      controller.enqueue(new Uint8Array(60));
      controller.close();
    },
  });
  const streamed = mockFetch([
    new Response(stream, { status: 200, headers: { "content-type": "image/jpeg" } }),
  ]);
  const streamedResult = await fetchGuardedImage(S3_URL, { fetchImpl: streamed.fetchImpl, maxBytes: 100 });
  assert.equal(streamedResult.ok, false);
  assert.equal(streamedResult.error, "Image too large");
});

test("fetchGuardedImage maps upstream errors and timeouts", async () => {
  const notFound = mockFetch([new Response("nope", { status: 404 })]);
  const nf = await fetchGuardedImage(S3_URL, { fetchImpl: notFound.fetchImpl });
  assert.equal(nf.ok, false);
  assert.equal(nf.status, 404);

  const timeout = mockFetch([
    (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => reject(init.signal.reason));
      }),
  ]);
  // AbortSignal.timeout 타이머는 unref라 이벤트 루프를 붙잡아 둘 타이머가 필요
  const keepAlive = setTimeout(() => {}, 1000);
  const to = await fetchGuardedImage(S3_URL, { fetchImpl: timeout.fetchImpl, timeoutMs: 20 });
  clearTimeout(keepAlive);
  assert.equal(to.ok, false);
  assert.equal(to.status, 504);
});
