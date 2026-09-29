// Run against a local dev server. All external traffic and application writes are mocked.
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import {
  referralFailureMessage,
  REFERRAL_NETWORK_MESSAGE,
} from "../src/features/day-nammae/referral.ts";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3107";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("Local server only");
await mkdir("output/referral-qa", { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(10000);
let reason = "본인의 추천 코드는 사용할 수 없습니다.";
let validationDelay = 0;
let validationCount = 0;
let submitMode = "network";
const submissions = [];
await page.route("**/*", async (route) => {
  const url = route.request().url();
  if (url.includes("day-nammae-schedules"))
    return route.fulfill({
      json: {
        todayKst: "2026-09-29",
        schedules: [
          {
            staffScheduleId: "11111111-1111-4111-8111-111111111111",
            scheduleDate: "2026-10-03",
            schedule: "10/3 (토) 19:00 테스트 회차",
            closeStatus: "모집중",
            maxCapacity: 30,
            exposedTotal: 4,
            exposedFemale: 2,
            exposedMale: 2,
            ageRangeKey: "20_35",
          },
        ],
      },
    });
  if (url === `${base}/api/offline/day-nammae/referral/validate`) {
    validationCount++;
    const captured = reason;
    await new Promise((r) => setTimeout(r, validationDelay));
    if (captured === "network") return route.abort();
    return route.fulfill({
      status: captured ? 409 : 200,
      json: {
        success: !captured,
        message: captured
          ? referralFailureMessage(captured)
          : "지인 추천 30% 할인 사용이 가능합니다. 최종 신청 시 한 번 더 확인합니다.",
      },
    });
  }
  if (url === `${base}/api/offline/day-nammae/apply`) {
    submissions.push(route.request().postDataBuffer().toString());
    if (submitMode === "network") return route.abort();
    if (submitMode === "closed")
      return route.fulfill({
        status: 409,
        json: {
          code: "DAY_NAMMAE_APPLICATION_CLOSED",
          userMessage:
            "모임 시작 1시간 전부터 신청 및 결제가 불가합니다. 다른 일정을 선택해주세요.",
        },
      });
    return route.fulfill({
      status: 409,
      json: {
        success: false,
        applicationSubmitted: false,
        errorCode: "REFERRAL_REJECTED",
        userMessage: referralFailureMessage("이미 추천 할인을 이용하셨습니다."),
      },
    });
  }
  if (!url.startsWith(base)) return route.abort();
  return route.continue();
});
const next = () =>
  page.getByRole("button", { name: "다음", exact: true }).click();
const message = () => page.locator("#referral-feedback").innerText();
const waitMessage = async (text) => {
  await page.waitForFunction(
    (t) =>
      document.querySelector("#referral-feedback")?.textContent?.includes(t),
    text,
  );
};
try {
  await page.goto(`${base}/offline/11namme/apply`);
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page
    .getByRole("button", { name: "남성 남성으로 신청", exact: true })
    .click();
  await page.getByRole("button", { name: /10\/3/ }).click();
  await next();
  assert.ok(
    (
      await page
        .locator("[role=alert]:not(#__next-route-announcer__)")
        .innerText()
    ).includes("이름"),
  );
  await page.locator("[name=day_nammae_name]").fill("화면테스트");
  await page.getByRole("button", { name: "2000", exact: true }).click();
  await page.locator("[name=day_nammae_height]").fill("175");
  await page.locator("[name=day_nammae_phone]").fill("01000000000");
  await page.locator("[name=day_nammae_traits]").fill("테스트 입력");
  await page.getByRole("button", { name: "지인 추천", exact: true }).click();
  await page.getByRole("checkbox").check();
  await next();
  assert.ok((await message()).includes("6자리"));
  assert.equal(submissions.length, 0);
  await page.locator("#referral-code").fill("SELF00");
  await waitMessage("본인의");
  await next();
  assert.equal(await page.locator("#referral-code").count(), 1);
  await page.locator("#referral-code").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "output/referral-qa/referral-self-mobile.png",
  });
  for (const failure of [
    "추천 코드와 전화번호를 확인해 주세요.",
    "이미 추천 할인을 이용하셨습니다.",
    "이미 추천 할인이 적용된 진행 중 신청이 있어",
    "추천 프로그램은 현재 준비 또는 중단 상태입니다.",
    "쿠폰",
  ]) {
    reason = failure;
    await page.getByRole("button", { name: "추천 코드 다시 확인" }).click();
    await waitMessage(referralFailureMessage(failure));
  }
  reason = "network";
  await page.getByRole("button", { name: "추천 코드 다시 확인" }).click();
  await waitMessage(REFERRAL_NETWORK_MESSAGE);
  assert.equal(await page.locator("#referral-code").inputValue(), "SELF00");
  // A delayed success for an old code must not replace the new code's rejection.
  reason = "";
  validationDelay = 1500;
  const before = validationCount;
  await page.locator("#referral-code").fill("VALID0");
  while (validationCount === before) await page.waitForTimeout(50);
  reason = "본인의 추천 코드는 사용할 수 없습니다.";
  validationDelay = 0;
  await page.locator("#referral-code").fill("SELF01");
  await waitMessage("본인의");
  await page.waitForTimeout(1700);
  assert.ok((await message()).includes("본인의"));
  reason = "";
  await page.getByRole("button", { name: "추천 코드 다시 확인" }).click();
  await waitMessage("사용이 가능합니다");
  reason = "이미 추천 할인을 이용하셨습니다.";
  await page.locator("[name=day_nammae_phone]").fill("01000000001");
  await next();
  assert.equal(await page.locator("#referral-code").count(), 1);
  await waitMessage("최초 1회");
  await page.getByRole("button", { name: "광고", exact: true }).click();
  assert.ok(
    (
      await page
        .locator("[role=alert]:not(#__next-route-announcer__)")
        .innerText()
    ).includes("추천 할인"),
  );
  await page
    .getByRole("button", { name: "추천 할인 해제 · 정상가로 계속" })
    .click();
  assert.equal(await page.locator("#referral-code").count(), 0);
  await next();
  assert.equal(await page.locator("input[type=file]").count(), 1);
  await page.getByRole("button", { name: "이전 단계" }).click();
  await page.getByRole("checkbox").check();
  reason = "";
  await page.getByRole("button", { name: "추천 코드 다시 확인" }).click();
  await waitMessage("사용이 가능합니다");
  await next();
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "bad.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("bad"),
    });
  assert.ok(
    (
      await page
        .locator("[role=alert]:not(#__next-route-announcer__)")
        .innerText()
    ).includes("이미지"),
  );
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=",
    "base64",
  );
  await page
    .locator("input[type=file]")
    .setInputFiles({ name: "test.png", mimeType: "image/png", buffer: png });
  await next();
  console.log("PROFILE / VALIDATION / RACE / OPT-OUT / PHOTO PASSED");
  for (let i = 0; i < 2; i++) {
    await page
      .getByRole("button", { name: "위 내용을 확인했으며 동의합니다" })
      .click();
    await next();
  }
  await page
    .getByRole("button", { name: "위 내용을 확인했으며 동의합니다" })
    .click();
  await page.getByRole("button", { name: "신청 완료", exact: true }).click();
  await page
    .getByText("입력한 내용과 사진은 이 화면에 유지됩니다.", { exact: false })
    .waitFor();
  const firstCount = submissions.length;
  assert.ok(firstCount >= 1);
  const requestId = (body) =>
    body.match(/name="client_request_id"\r\n\r\n([^\r]+)/)?.[1];
  assert.ok(requestId(submissions[0]));
  await page.getByRole("button", { name: "신청 완료", exact: true }).click();
  await page
    .getByText("입력한 내용과 사진은 이 화면에 유지됩니다.", { exact: false })
    .waitFor();
  assert.ok(submissions.length > firstCount);
  assert.equal(new Set(submissions.map(requestId)).size, 1);
  assert.ok(
    submissions.every(
      (body) =>
        body.includes('name="referralRequested"\r\n\r\ntrue') &&
        body.includes('name="referralCode"\r\n\r\nSELF01') &&
        body.includes('filename="test.png"'),
    ),
  );
  submitMode = "referral-rejected";
  await page.getByRole("button", { name: "신청 완료", exact: true }).click();
  await waitMessage("최초 1회");
  assert.equal(
    await page.locator("[name=day_nammae_name]").inputValue(),
    "화면테스트",
  );
  assert.equal(await page.locator("#referral-code").inputValue(), "SELF01");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator("#referral-code").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "output/referral-qa/referral-rejected-desktop.png",
  });
  console.log(
    "SUBMIT NETWORK RETRY / STABLE ID / PHOTO PRESERVATION / FINAL REJECTION PASSED",
  );
  reason = "";
  await page.getByRole("button", { name: "추천 코드 다시 확인" }).click();
  await waitMessage("사용이 가능합니다");
  for (let i = 0; i < 4; i++) await next();
  submitMode = "closed";
  await page.getByRole("button", { name: "신청 완료", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  assert.ok((await page.getByRole("dialog").innerText()).includes("다른 일정"));
  await page.goto(`${base}/offline/11namme/apply?coupon=ABCDEFGH`);
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page
    .getByRole("button", { name: "남성 남성으로 신청", exact: true })
    .click();
  await page.getByRole("button", { name: /10\/3/ }).click();
  await page.getByRole("button", { name: /쿠폰 있어요/ }).click();
  await next();
  await page.getByRole("button", { name: "쿠폰 확인", exact: true }).click();
  await page
    .getByText("쿠폰 확인 서버에 연결하지 못했습니다.", { exact: false })
    .waitFor();
  assert.equal(
    await page.getByRole("button", { name: "다음", exact: true }).isDisabled(),
    true,
  );
  assert.equal(await page.locator("input").inputValue(), "ABCDEFGH");
  console.log("CLOSED SCHEDULE / COUPON NETWORK GUIDANCE PASSED");
} finally {
  await browser.close();
}
