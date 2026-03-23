"use client";

import Image from "next/image";

interface ApplyStepShellProps {
  mode: "modal" | "page";
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: string;
  canProceed: boolean;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  hideNav?: boolean;
  onNext: () => void;
  onBack: () => void;
  children: React.ReactNode;
}

export default function ApplyStepShell({
  mode,
  currentStep,
  totalSteps,
  title,
  description,
  canProceed,
  isSubmitting,
  isLastStep,
  hideNav,
  onNext,
  onBack,
  children,
}: ApplyStepShellProps) {
  const progressPercent = (currentStep / totalSteps) * 100;
  const shellClassName =
    mode === "modal"
      ? "relative flex w-full max-w-[560px] flex-col overflow-hidden rounded-[32px] bg-black md:max-h-[90vh]"
      : "relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden bg-black";
  const scrollAreaClassName =
    mode === "modal"
      ? `relative z-10 flex-1 overflow-y-auto pb-24 ${
          hideNav ? "flex flex-col justify-center" : ""
        }`
      : `relative z-10 flex-1 pb-24 ${hideNav ? "flex flex-col justify-center" : ""}`;
  const navClassName =
    mode === "modal"
      ? "relative z-20 shrink-0 px-5 pb-8 pt-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
      : "sticky bottom-0 z-20 mt-auto px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent";
  const headerClassName =
    mode === "modal"
      ? "relative z-20 shrink-0"
      : "sticky top-0 z-20 shrink-0 bg-gradient-to-b from-black/95 via-black/80 to-transparent";

  return (
    <div className={shellClassName}>
      {/* Background image - always fixed */}
      <Image
        src="/ssobig_assets/lovebuddies/hero-main.jpg"
        alt=""
        fill
        className="pointer-events-none object-cover opacity-40"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-black/50" />

      {/* Fixed top: Progress bar + Logo */}
      {!hideNav && <div className={headerClassName}>
        <div className="h-[8px] w-full bg-white/10">
          <div
            className="h-full bg-[#FF6B9F] transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mx-auto flex w-full max-w-[520px] items-start justify-between px-5 pt-4 pb-3">
          <Image
            src="/ssobig_assets/lovebuddies/11namme-logo.png"
            alt="일일남매"
            width={300}
            height={120}
            className="h-24 w-auto object-contain"
          />
          <span className="text-sm font-medium text-white/50">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>}

      {/* Scrollable area: Title + Content */}
      <div className={scrollAreaClassName}>
        {/* Title */}
        <div className={`mx-auto w-full max-w-[520px] px-5 pt-4 pb-2 ${hideNav ? "text-center" : ""}`}>
          <h1 className="text-[26px] leading-tight font-black text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="mx-auto w-full max-w-[520px] px-5 pt-4">
          {children}
        </div>
      </div>

      {/* Fixed bottom navigation */}
      {!hideNav && <div className={navClassName}>
        <div className="mx-auto flex max-w-[520px] items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition active:scale-95 [touch-action:manipulation]"
            aria-label="이전 단계"
          >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          <button
            type="button"
            disabled={!canProceed || isSubmitting}
            onClick={onNext}
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#FF6B9F] text-base font-bold text-white transition active:scale-[0.98] disabled:bg-[#FF6B9F]/40 disabled:text-white/50 [touch-action:manipulation]"
          >
            {isSubmitting
              ? "제출하는 중..."
              : isLastStep
                ? "신청 완료"
                : "다음"}
          </button>
        </div>
      </div>}
    </div>
  );
}
