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
  const isPageMode = mode === "page";
  const shellClassName =
    mode === "modal"
      ? "relative flex h-[100svh] w-full flex-col overflow-hidden bg-[#161012] md:h-auto md:max-h-[90vh] md:max-w-[560px] md:rounded-[28px] md:border md:border-[#2a1d21] md:shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
      : "relative w-full overflow-x-hidden bg-[#161012]";
  const scrollAreaClassName =
    mode === "modal"
      ? `relative z-10 flex-1 overflow-y-auto pb-24 ${
          hideNav ? "flex flex-col justify-center" : ""
        }`
      : `relative z-10 ${hideNav ? "flex flex-col justify-center" : ""}`;
  const navClassName =
    mode === "modal"
      ? "relative z-20 shrink-0 border-t border-[#2a1d21] bg-[#161012] px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4"
      : "relative z-20 mt-6 border-t border-[#2a1d21] bg-[#161012] px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4";
  const headerClassName =
    mode === "modal"
      ? "relative z-20 shrink-0 border-b border-[#2a1d21] bg-[#161012]"
      : "relative z-20 shrink-0 border-b border-[#2a1d21] bg-[#161012]";
  const contentClassName =
    mode === "modal"
      ? "mx-auto w-full max-w-[520px] px-5 pt-4"
      : "mx-auto w-full max-w-[520px] px-5 pt-4 pb-6";

  return (
    <div className={shellClassName}>
      {/* Fixed top: Progress bar + Logo */}
      {!hideNav && <div className={headerClassName}>
        <div className="h-[8px] w-full bg-[#24181d]">
          <div
            className="h-full bg-[#FF6B9F]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mx-auto flex w-full max-w-[520px] items-start justify-between px-5 pt-4 pb-3">
          <Image
            src="/ssobig_assets/lovebuddies/11namme-logo.png"
            alt="일일남매"
            width={300}
            height={120}
            className={`${isPageMode ? "h-20" : "h-24"} w-auto object-contain`}
            priority={isPageMode}
          />
          <span className="text-sm font-medium text-white/55">
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
            <p className="mt-2 text-sm leading-relaxed text-white/58">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className={contentClassName}>
          {children}
        </div>
      </div>

      {/* Fixed bottom navigation */}
      {!hideNav && <div className={navClassName}>
        <div className="mx-auto flex max-w-[520px] items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#312328] bg-[#24181d] text-white [touch-action:manipulation]"
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
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#FF6B9F] text-base font-bold text-white disabled:bg-[#5b3a47] disabled:text-white/40 [touch-action:manipulation]"
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
