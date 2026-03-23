"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { DAY_NAMMAE_NOTICE_SECTIONS } from "@/features/day-nammae/constants";
import {
  getDayNammeScheduleLabel,
  isDayNammeScheduleSelectable,
} from "@/features/day-nammae/schedule";
import {
  DayNammeFormValues,
  ScheduleItem,
} from "@/features/day-nammae/types";
import { getSafeSearchParams } from "@/utils/utm";
import ApplyStepShell from "./ApplyStepShell";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function safeFbq(...args: unknown[]) {
  if (typeof window === "undefined" || !window.fbq) {
    return;
  }

  try {
    window.fbq(...args);
  } catch (error) {
    console.error("Meta Pixel 호출 실패:", error);
  }
}

function trackEvent(eventName: string, params?: Record<string, unknown>) {
  safeFbq("trackCustom", eventName, params);
}

function trackCompleteRegistration(formValues: DayNammeFormValues) {
  if (typeof window === "undefined") {
    return;
  }

  const phoneDigits = formValues.phone.replace(/\D/g, "");
  const metaPhone = phoneDigits.length === 11 ? `82${phoneDigits.slice(1)}` : "";
  const metaGender = formValues.gender === "남" ? "m" : "f";
  const metaBirthDate = `${formValues.birthYear}0101`;

  safeFbq("init", "1541266446734040", {
    fn: formValues.name.toLowerCase(),
    ph: metaPhone,
    db: metaBirthDate,
    ge: metaGender,
  });
  safeFbq("track", "CompleteRegistration", {
    content_name: "일일남매",
  });
}
import StepGender from "./steps/StepGender";
import StepSchedule from "./steps/StepSchedule";
import StepProfile from "./steps/StepProfile";
import StepPhoto from "./steps/StepPhoto";
import StepAgreement from "./steps/StepAgreement";

type ApplyFlowMode = "modal" | "page";

interface LoveBuddiesApplyFlowProps {
  mode: ApplyFlowMode;
  scheduleData: ScheduleItem[];
  isLoadingSchedules: boolean;
  onClose?: () => void;
}

interface SubmitState {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
}

const TOTAL_STEPS = 7;

const INITIAL_FORM_VALUES: DayNammeFormValues = {
  gender: "",
  schedule: "",
  name: "",
  birthYear: "",
  height: "",
  phone: "",
  traits: "",
  photo: null,
};

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

const STEP_CONFIG = [
  { title: "성별을 선택해주세요", description: "해당 성별 기준으로 일정 마감 여부가 달라집니다." },
  { title: "일정을 선택해주세요", description: "참여하고 싶은 일정을 골라주세요." },
  { title: "신청서를 작성해주세요", description: "프로필 정보를 입력해주세요." },
  { title: "사진을 등록해주세요", description: "본인의 매력이 잘 드러나는 사진 한 장을 올려주세요." },
  { title: "승인 기준을 확인해주세요", description: "신청 전 꼭 확인해야 하는 내용이에요." },
  { title: "마케팅 동의를 확인해주세요", description: "촬영 및 콘텐츠 활용에 대한 안내예요." },
  { title: "주의 사항을 확인해주세요", description: "참여 전 꼭 알아두셔야 할 사항이에요." },
];

export default function LoveBuddiesApplyFlow({
  mode,
  scheduleData,
  isLoadingSchedules,
  onClose,
}: LoveBuddiesApplyFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [agreements, setAgreements] = useState([false, false, false]);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    if (!formValues.photo) {
      setPhotoPreviewUrl("");
      return;
    }
    const previewUrl = URL.createObjectURL(formValues.photo);
    setPhotoPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [formValues.photo]);

  const closeFlow = () => {
    if (mode === "page") {
      router.push("/offline/11namme");
      return;
    }
    onClose?.();
  };

  const handleValueChange =
    (field: "name" | "birthYear" | "height" | "phone" | "traits") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let nextValue = event.target.value;
      if (field === "phone") nextValue = formatPhoneNumber(nextValue);
      if (field === "height") nextValue = nextValue.replace(/\D/g, "").slice(0, 3);
      setFormValues((current) => ({ ...current, [field]: nextValue }));
      setFormError("");
    };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith("image/")) {
      setFormError("사진은 이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    setFormValues((current) => ({ ...current, photo: file }));
    setFormError("");
  };

  const handleGenderSelect = (gender: "남" | "여") => {
    setFormValues((current) => {
      const currentSchedule = scheduleData.find(
        (schedule) => getDayNammeScheduleLabel(schedule) === current.schedule
      );
      const nextSchedule =
        currentSchedule && !isDayNammeScheduleSelectable(currentSchedule, gender)
          ? ""
          : current.schedule;
      return { ...current, gender, schedule: nextSchedule };
    });
    setFormError("");
  };

  const handleScheduleSelect = (scheduleLabel: string) => {
    setFormValues((current) => ({ ...current, schedule: scheduleLabel }));
    setFormError("");
  };

  const handleBirthYearSelect = (year: string) => {
    setFormValues((current) => ({ ...current, birthYear: year }));
  };

  const handleAgreementChange = (index: number) => (agreed: boolean) => {
    setAgreements((current) => {
      const next = [...current];
      next[index] = agreed;
      return next;
    });
  };

  const canProceed = (() => {
    switch (currentStep) {
      case 1:
        return formValues.gender !== "";
      case 2:
        return formValues.schedule !== "";
      case 3:
        return (
          formValues.name.trim() !== "" &&
          formValues.birthYear !== "" &&
          formValues.height.trim() !== "" &&
          formValues.phone.replace(/\D/g, "").length === 11 &&
          formValues.traits.trim() !== ""
        );
      case 4:
        return formValues.photo !== null;
      case 5:
        return agreements[0];
      case 6:
        return agreements[1];
      case 7:
        return agreements[2];
      default:
        return false;
    }
  })();

  const handleSubmit = async () => {
    setSubmitState({ status: "submitting", message: "" });
    setFormError("");

    try {
      const urlSearchParams =
        typeof window !== "undefined"
          ? getSafeSearchParams(window.location.search)
          : new URLSearchParams();
      const requestBody = new FormData();
      requestBody.append("gender", formValues.gender);
      requestBody.append("schedule", formValues.schedule);
      requestBody.append("name", formValues.name.trim());
      requestBody.append("birthYear", formValues.birthYear);
      requestBody.append("height", formValues.height.trim());
      requestBody.append("phone", formValues.phone.trim());
      requestBody.append("traits", formValues.traits.trim());
      requestBody.append("photo", formValues.photo as File);
      requestBody.append("utm_source", urlSearchParams.get("utm_source") || "");
      requestBody.append("utm_medium", urlSearchParams.get("utm_medium") || "");
      requestBody.append("utm_content", urlSearchParams.get("utm_content") || "");

      const response = await fetch("/api/offline/day-nammae/apply", {
        method: "POST",
        body: requestBody,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "신청서를 제출하지 못했습니다."
        );
      }

      trackEvent("DN_SubmitApplication", {
        gender: formValues.gender,
        schedule: formValues.schedule,
      });
      trackCompleteRegistration(formValues);

      setSubmitState({
        status: "success",
        message: "신청이 정상적으로 접수되었습니다. 검토 후 안내 메시지를 보내드릴게요.",
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error ? error.message : "신청서를 제출하지 못했습니다.",
      });
    }
  };

  const handleNext = () => {
    if (currentStep === 3 && !canProceed) {
      setShowFieldErrors(true);
      return;
    }
    if (currentStep === TOTAL_STEPS) {
      trackEvent("DN_Step7_AcceptNotice");
      handleSubmit();
      return;
    }

    const stepEvents: Record<number, () => void> = {
      1: () => trackEvent("DN_Step1_SelectGender", { gender: formValues.gender }),
      2: () => trackEvent("DN_Step2_SelectSchedule", { schedule: formValues.schedule }),
      3: () => trackEvent("DN_Step3_CompleteProfile"),
      4: () => trackEvent("DN_Step4_UploadPhoto"),
      5: () => trackEvent("DN_Step5_AcceptApproval"),
      6: () => trackEvent("DN_Step6_AcceptMarketing"),
    };
    stepEvents[currentStep]?.();

    setShowFieldErrors(false);
    setCurrentStep((s) => s + 1);
    setFormError("");
  };

  const handleBack = () => {
    if (currentStep === 1) {
      closeFlow();
      return;
    }
    setCurrentStep((s) => s - 1);
    setFormError("");
  };

  if (submitState.status === "success") {
    const bookingUrl = (() => {
      const match = formValues.schedule.match(/(\d+)\/(\d+)/);
      if (!match) return "https://booking.naver.com/booking/12/bizes/1378688/items/6629371";
      const now = new Date();
      const month = parseInt(match[1], 10);
      const day = parseInt(match[2], 10);
      let year = now.getFullYear();
      if (month < now.getMonth() + 1) year += 1;
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return `https://booking.naver.com/booking/12/bizes/1378688/items/6629371?startDateTime=${encodeURIComponent(`${dateStr}T00:00:00+09:00`)}`;
    })();

    return (
      <ApplyStepShell
        currentStep={TOTAL_STEPS}
        totalSteps={TOTAL_STEPS}
        title="결제를 진행해주세요"
        description="결제까지 진행해주셔야 신청이 완료됩니다."
        canProceed={true}
        hideNav
        onNext={() => {}}
        onBack={() => {}}
      >
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-5 text-center">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">신청 내역</p>
          <p className="mt-3 text-base font-bold text-white">{formValues.schedule}</p>
          <p className="mt-1 text-sm text-white/70">{formValues.name} · {formValues.phone}</p>
        </div>

        <div className="mt-5 px-1 text-left text-sm leading-relaxed text-white/60">
          <p>• 결제가 완료된 순서대로 참가자를 승인해드립니다.</p>
          <p className="mt-1">• 결제 완료 후 &apos;참가 확정 메세지&apos;를 받으셔야 최종 확정입니다.</p>
          <p className="mt-1">• 승인/확정 처리까지 최대 24시간이 소요될 수 있습니다.</p>
        </div>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("DN_InitiateCheckout", { schedule: formValues.schedule });
            safeFbq("track", "InitiateCheckout", {
              value: 35000,
              currency: "KRW",
              content_name: "일일남매",
            });
          }}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#FF6B9F] text-base font-bold text-white transition active:scale-[0.98]"
        >
          35,000원 결제하기
        </a>
        <button
          type="button"
          onClick={() => {
            setSubmitState({ status: "idle", message: "" });
            setCurrentStep(1);
            setFormValues(INITIAL_FORM_VALUES);
            setAgreements([false, false, false]);
            setShowFieldErrors(false);
          }}
          className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 text-sm font-medium text-white/60 transition active:scale-[0.98]"
        >
          신청서 다시 작성하기
        </button>
      </ApplyStepShell>
    );
  }

  const stepConfig = STEP_CONFIG[currentStep - 1];

  return (
    <ApplyStepShell
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      title={stepConfig.title}
      description={stepConfig.description}
      canProceed={currentStep === 3 ? true : canProceed}
      isSubmitting={submitState.status === "submitting"}
      isLastStep={currentStep === TOTAL_STEPS}
      onNext={handleNext}
      onBack={handleBack}
    >
      {formError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </div>
      )}

      {submitState.status === "error" && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {submitState.message}
        </div>
      )}

      {currentStep === 1 && (
        <StepGender gender={formValues.gender} onSelect={handleGenderSelect} />
      )}

      {currentStep === 2 && (
        <StepSchedule
          scheduleData={scheduleData}
          isLoading={isLoadingSchedules}
          gender={formValues.gender}
          selectedSchedule={formValues.schedule}
          onSelect={handleScheduleSelect}
        />
      )}

      {currentStep === 3 && (
        <StepProfile
          formValues={formValues}
          onValueChange={handleValueChange}
          onBirthYearSelect={handleBirthYearSelect}
          showErrors={showFieldErrors}
        />
      )}

      {currentStep === 4 && (
        <StepPhoto
          photoPreviewUrl={photoPreviewUrl}
          onPhotoChange={handlePhotoChange}
        />
      )}

      {currentStep === 5 && (
        <StepAgreement
          section={DAY_NAMMAE_NOTICE_SECTIONS[0]}
          agreed={agreements[0]}
          onAgreeChange={handleAgreementChange(0)}
        />
      )}

      {currentStep === 6 && (
        <StepAgreement
          section={DAY_NAMMAE_NOTICE_SECTIONS[1]}
          agreed={agreements[1]}
          onAgreeChange={handleAgreementChange(1)}
        />
      )}

      {currentStep === 7 && (
        <StepAgreement
          section={DAY_NAMMAE_NOTICE_SECTIONS[2]}
          agreed={agreements[2]}
          onAgreeChange={handleAgreementChange(2)}
        />
      )}
    </ApplyStepShell>
  );
}
