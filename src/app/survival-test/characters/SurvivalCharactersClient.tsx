"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  allCharacterNames,
  characterImages,
  TUMBLBUG_URL,
} from "../prototypeCharacters";
import { profiles } from "../prototypeData";

const groupLabels = {
  A그룹: "공존형",
  B그룹: "통제형",
  C그룹: "경계형",
} as const;

export default function SurvivalCharactersClient() {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const selectedProfile = useMemo(
    () => profiles.find((item) => item.name === selectedName) ?? null,
    [selectedName],
  );

  useEffect(() => {
    document.body.classList.add("survival-test-page");

    return () => {
      document.body.classList.remove("survival-test-page");
    };
  }, []);

  useEffect(() => {
    if (!selectedProfile) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedName(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProfile]);

  async function copyShareUrl(url: string) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  async function handleShareTest() {
    const shareUrl = new URL("/survival-test", window.location.href).toString();
    const shareData = {
      title: "PROTO TYPE 생존 성향 테스트",
      text: "나는 생존 게임 프로토타입에서 어떤 생존자로 기록될까? 너도 테스트해봐.",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("공유창을 열었어요.");
        return;
      }

      await copyShareUrl(shareUrl);
      setShareStatus("테스트 링크를 복사했어요.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      await copyShareUrl(shareUrl);
      setShareStatus("테스트 링크를 복사했어요.");
    }
  }

  return (
    <main className="prototype-grit relative min-h-screen w-full overflow-x-hidden px-5 py-8 text-[#f3e6d7] sm:px-7 lg:px-0">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.38),rgba(0,0,0,0.03)_48%,rgba(0,0,0,0.38))]" />
        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,rgba(3,3,3,0)_0%,rgba(3,3,3,0.44)_58%,rgba(3,3,3,0.78)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[30%] bg-[linear-gradient(180deg,rgba(3,3,3,0.28)_0%,rgba(3,3,3,0)_100%)]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[680px] flex-col">
        <div className="grid grid-cols-[128px_1fr] items-center gap-5 sm:grid-cols-[188px_1fr] sm:gap-8">
          <div className="relative aspect-[2/3] overflow-hidden rounded-[8px] bg-black shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
            <Image
              src="/images/prototype-poster.png"
              alt="프로토타입 포스터"
              fill
              priority
              sizes="(min-width: 640px) 188px, 128px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="font-[family-name:var(--font-preview-display)] text-[9px] uppercase tracking-[0.18em] text-[#d60404] drop-shadow-[2px_2px_0_rgba(0,0,0,0.78)] sm:text-[12px]">
              survivor character archive
            </p>
            <h1 className="mt-3 text-[34px] font-black leading-none tracking-normal text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.62)] sm:text-[52px]">
              프로토타입
            </h1>

            <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["★", "수집중"],
                ["☻", "12인"],
                ["◷", "150분"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className="flex min-h-[64px] flex-col items-center justify-center rounded-[8px] bg-[#ff2a20] px-1.5 py-2 text-center text-white shadow-[4px_4px_0_rgba(0,0,0,0.45)] sm:min-h-[82px] sm:px-2.5 sm:py-3"
                >
                  <span className="text-[19px] font-black leading-none sm:text-[27px]">
                    {icon}
                  </span>
                  <span className="mt-1.5 text-[15px] font-black leading-none tracking-normal sm:mt-2 sm:text-[24px]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-[14px] font-semibold leading-[1.8] tracking-normal text-[#f3e6d7] drop-shadow-[2px_2px_0_rgba(0,0,0,0.72)] sm:text-[18px] sm:leading-8">
          <p>
            프로토타입은 멸망 이후의 캠프에서 살아남기 위해 서로를 의심하고,
            설득하고, 선택해야 하는 생존 게임입니다. 각자의 역할과 성향이
            충돌하는 상황 속에서 당신은 어떤 방식으로 끝까지 살아남을 수
            있을까요?
          </p>
          <p className="mt-4">
            현재 텀블벅에서 펀딩 중입니다. 더 많은 생존자들이 캠프에 모일 수
            있도록 많은 관심과 후원 부탁드립니다!
          </p>
        </div>

        <div className="mt-10 pb-28">
          <p className="font-[family-name:var(--font-preview-display)] text-[10px] uppercase tracking-[0.16em] text-[#d60404] sm:text-[13px] sm:tracking-[0.2em]">
            all characters
          </p>
          <p className="mt-2 text-[12px] font-bold leading-6 tracking-normal text-[#d7bda1] sm:text-[15px]">
            클릭하면 자세히 볼 수 있어요.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
            {allCharacterNames.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedName(name)}
                className={`p-2 text-left backdrop-blur-sm transition sm:p-3 ${
                  selectedName === name
                    ? "bg-[#d60404]/22 shadow-[0_0_0_1px_rgba(214,4,4,0.72),5px_5px_0_rgba(0,0,0,0.62)]"
                    : "bg-white/5 hover:bg-[#d60404]/14"
                }`}
              >
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[96px] sm:max-w-[128px]">
                  <Image
                    src={characterImages[name]}
                    alt={name}
                    fill
                    sizes="(min-width: 640px) 128px, 30vw"
                    className="object-contain object-center"
                  />
                </div>
                <p className="mt-2 text-center text-[12px] font-black tracking-normal text-[#fff1df] sm:text-[15px]">
                  {name}
                </p>
              </button>
            ))}
          </div>
          <a
            href="/survival-test"
            className="mt-8 block w-full border border-[#d60404]/55 bg-black/28 px-5 py-4 text-center text-[13px] font-black tracking-normal text-[#fff1df] transition hover:bg-[#d60404]/18 sm:text-[17px]"
          >
            다시하기
          </a>
          <button
            type="button"
            onClick={handleShareTest}
            className="mt-3 block w-full border border-[#d60404]/42 bg-white/8 px-5 py-4 text-center text-[13px] font-black tracking-normal text-[#fff1df] transition hover:bg-[#d60404]/14 sm:text-[17px]"
          >
            친구에게 공유하기
          </button>
          {shareStatus && (
            <p className="mt-3 text-center text-[12px] font-bold leading-5 tracking-normal text-[#d7bda1] sm:text-[14px]">
              {shareStatus}
            </p>
          )}
        </div>
      </section>

      {selectedProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/76 px-5 py-7 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="survival-character-dialog-title"
          onClick={() => setSelectedName(null)}
        >
          <section
            className="relative max-h-full w-full max-w-[680px] overflow-y-auto border border-[#d60404]/58 bg-[radial-gradient(circle_at_50%_26%,rgba(76,65,57,0.96)_0%,rgba(38,27,24,0.97)_48%,rgba(10,6,6,0.98)_100%)] p-4 shadow-[8px_8px_0_rgba(0,0,0,0.75)] sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedName(null)}
              aria-label="닫기"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-[#d60404]/55 bg-black/42 text-[22px] font-black leading-none text-[#fff1df] transition hover:bg-[#d60404]/18"
            >
              ×
            </button>

            <p className="pr-10 font-[family-name:var(--font-preview-display)] text-[9px] uppercase tracking-[0.16em] text-[#d60404] sm:text-[12px] sm:tracking-[0.2em]">
              selected survivor
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-[220px_1fr] sm:items-center">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] bg-transparent">
                <Image
                  src={characterImages[selectedProfile.name]}
                  alt={selectedProfile.name}
                  fill
                  priority
                  sizes="220px"
                  className="object-contain object-center"
                />
              </div>
              <div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    groupLabels[selectedProfile.group],
                    selectedProfile.position,
                    selectedProfile.judgment,
                  ].map((label) => (
                    <span
                      key={label}
                      className="border border-[#d60404]/58 bg-black/28 px-2 py-1 text-[10px] font-black leading-none tracking-normal text-[#fff1df] shadow-[2px_2px_0_rgba(0,0,0,0.62)] sm:px-2.5 sm:text-[12px]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <h2
                  id="survival-character-dialog-title"
                  className="prototype-title mt-4 text-[26px] font-black leading-[1.1] tracking-normal text-[#fff1df] sm:text-[36px]"
                >
                  {selectedProfile.name}
                </h2>
                <p className="mt-3 text-[14px] font-black leading-[1.65] tracking-normal text-[#f3e6d7] sm:text-[17px]">
                  “{selectedProfile.tagline}”
                </p>
                <p className="mt-4 text-[13px] font-bold leading-[1.75] tracking-normal text-[#d7bda1] sm:text-[16px] sm:leading-7">
                  {selectedProfile.summary}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 bg-[linear-gradient(180deg,rgba(3,3,3,0)_0%,rgba(3,3,3,0.72)_30%,#030303_100%)] px-5 pb-6 pt-12 lg:px-0">
        <div className="mx-auto w-full max-w-[680px]">
          <a
            href={TUMBLBUG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#d60404] px-5 py-4 text-center text-[13px] font-black tracking-normal text-black transition shadow-[5px_5px_0_rgba(0,0,0,0.75)] hover:bg-[#ff1d1d] sm:text-[17px]"
          >
            텀블벅 알림신청 하러가기
          </a>
        </div>
      </div>
    </main>
  );
}
