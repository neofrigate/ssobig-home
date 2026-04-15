"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  DAY_NAMMAE_BIRTH_YEARS,
  DAY_NAMMAE_NOTICE_SECTIONS,
} from "@/features/day-nammae/constants";
import {
  getDayNammeScheduleLabel,
  isDayNammeScheduleSelectable,
} from "@/features/day-nammae/schedule";
import {
  DayNammeFormValues,
  ScheduleItem,
} from "@/features/day-nammae/types";
import { getSafeSearchParams } from "@/utils/utm";

type ApplyFlowMode = "modal" | "page";

interface DayNammeApplyFlowProps {
  mode: ApplyFlowMode;
  scheduleData: ScheduleItem[];
  isLoadingSchedules: boolean;
  onClose?: () => void;
}

interface SubmitState {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
}

const INITIAL_FORM_VALUES: DayNammeFormValues = {
  gender: "",
  schedule: "",
  name: "",
  birthYear: "",
  height: "",
  phone: "",
  traits: "",
  photo: null,
  hasCoupon: null,
  couponCode: "",
};

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function getScheduleHelperText(schedule: ScheduleItem, gender: "남" | "여" | "") {
  if (schedule.status === "전체마감") {
    return "전체 마감";
  }

  if (gender === "여" && schedule.status === "여자마감") {
    return "여성 마감";
  }

  if (gender === "남" && schedule.status === "남자마감") {
    return "남성 마감";
  }

  if (!gender && (schedule.status === "여자마감" || schedule.status === "남자마감")) {
    return "성별 선택 후 확인";
  }

  return schedule.status || "신청 가능";
}

export default function DayNammeApplyFlow({
  mode,
  scheduleData,
  isLoadingSchedules,
  onClose,
}: DayNammeApplyFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });
  const selectionStepComplete =
    Boolean(formValues.gender) && Boolean(formValues.schedule);
  const profileStepComplete =
    Boolean(formValues.name.trim()) &&
    Boolean(formValues.birthYear) &&
    Boolean(formValues.height.trim()) &&
    Boolean(formValues.phone.trim()) &&
    Boolean(formValues.traits.trim()) &&
    Boolean(formValues.photo);

  useEffect(() => {
    if (!formValues.photo) {
      setPhotoPreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(formValues.photo);
    setPhotoPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [formValues.photo]);

  const closeFlow = () => {
    if (mode === "page") {
      router.push("/offline/11namme");
      return;
    }

    onClose?.();
  };

  const handleValueChange =
    (field: Exclude<keyof DayNammeFormValues, "photo">) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      let nextValue = event.target.value;

      if (field === "phone") {
        nextValue = formatPhoneNumber(nextValue);
      }

      if (field === "height") {
        nextValue = nextValue.replace(/\D/g, "").slice(0, 3);
      }

      setFormValues((current) => ({
        ...current,
        [field]: nextValue,
      }));

      setFormError("");
    };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file && !file.type.startsWith("image/")) {
      setFormError("사진은 이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setFormValues((current) => ({
      ...current,
      photo: file,
    }));
    setFormError("");
  };

  const handleGenderSelect = (gender: "남" | "여") => {
    setFormValues((current) => {
      const currentSchedule = scheduleData.find(
        (schedule) => getDayNammeScheduleLabel(schedule) === current.schedule
      );

      const nextSchedule =
        currentSchedule &&
        !isDayNammeScheduleSelectable(currentSchedule, gender)
          ? ""
          : current.schedule;

      return {
        ...current,
        gender,
        schedule: nextSchedule,
      };
    });
    setFormError("");
  };

  const handleScheduleSelect = (scheduleLabel: string) => {
    setFormValues((current) => ({
      ...current,
      schedule: scheduleLabel,
    }));
    setFormError("");
  };

  const validateProfileStep = () => {
    if (!formValues.name.trim()) {
      setFormError("이름을 입력해주세요.");
      return false;
    }

    if (!formValues.birthYear) {
      setFormError("출생연도를 선택해주세요.");
      return false;
    }

    if (!formValues.height.trim()) {
      setFormError("키를 입력해주세요.");
      return false;
    }

    if (!formValues.phone.trim()) {
      setFormError("전화번호를 입력해주세요.");
      return false;
    }

    if (!formValues.traits.trim()) {
      setFormError("특징을 작성해주세요.");
      return false;
    }

    if (!formValues.photo) {
      setFormError("프로필 사진을 업로드해주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateProfileStep()) {
      return;
    }

    setSubmitState({
      status: "submitting",
      message: "",
    });
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
      requestBody.append(
        "utm_content",
        urlSearchParams.get("utm_content") || ""
      );

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

      setSubmitState({
        status: "success",
        message:
          "신청이 정상적으로 접수되었습니다. 검토 후 안내 메시지를 보내드릴게요.",
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "신청서를 제출하지 못했습니다.",
      });
    }
  };

  const shellClassName =
    mode === "modal"
      ? "relative z-10 w-full max-w-[720px] rounded-[32px] bg-[#fffafc] text-black shadow-[0_40px_120px_rgba(0,0,0,0.35)]"
      : "min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fff7fb_48%,#f5eef8_100%)] text-black";

  return (
    <div className={shellClassName}>
      <div
        className={`${
          mode === "modal"
            ? "max-h-[88vh] overflow-y-auto px-5 py-5 md:px-8 md:py-7"
            : "mx-auto min-h-screen max-w-[720px] px-4 pb-16 pt-6 md:px-8"
        }`}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c46592]">
              Love Buddies Apply
            </p>
            <h1 className="mt-2 text-[28px] font-black tracking-[-0.03em] text-[#27222a] md:text-[34px]">
              러브버디즈 신청하기
            </h1>
            <p className="mt-2 text-sm leading-6 text-black/60">
              {currentStep === 0 && "신청 전 꼭 확인해야 하는 기준을 안내드려요."}
              {currentStep === 1 && "성별과 참여 일정을 선택하면 다음 단계로 이동합니다."}
              {currentStep === 2 && "프로필 정보를 입력하고 신청을 완료해주세요."}
            </p>
          </div>

          {mode === "modal" ? (
            <button
              type="button"
              onClick={closeFlow}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black/5 text-black/70 transition hover:bg-black/10"
              aria-label="신청 창 닫기"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : (
            <Link
              href="/offline/11namme"
              className="inline-flex h-10 items-center rounded-full border border-black/10 px-4 text-sm font-semibold text-black/70 transition hover:bg-black/5"
            >
              돌아가기
            </Link>
          )}
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2 rounded-full bg-black/5 p-1.5">
          {["안내", "선택", "프로필"].map((label, index) => {
            const isActive = currentStep === index;
            const isDone = currentStep > index || submitState.status === "success";
            const canMoveToStep =
              submitState.status === "success" || index <= currentStep;

            return (
              <button
                key={label}
                type="button"
                disabled={!canMoveToStep}
                onClick={() => {
                  if (!canMoveToStep) {
                    return;
                  }

                  setCurrentStep(index);
                  setFormError("");
                }}
                className={`rounded-full px-4 py-2 text-center text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#ff6b9f] text-white shadow-sm"
                    : isDone
                      ? "bg-white text-[#c46592] hover:bg-[#fff2f7]"
                      : "text-black/45"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {submitState.status === "success" ? (
          <div className="rounded-[28px] border border-[#ffd4e4] bg-white p-6 text-center shadow-sm md:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffedf4] text-[#ff6b9f]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-[-0.03em] text-[#27222a]">
              신청이 접수되었어요
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/65">
              {submitState.message}
            </p>
            <div className="mt-5 rounded-2xl bg-[#fff7fb] px-4 py-4 text-left text-sm text-black/70">
              <p className="font-semibold text-black">접수 내용</p>
              <p className="mt-2">성별: {formValues.gender}</p>
              <p className="mt-1">일정: {formValues.schedule}</p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={closeFlow}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff6b9f] px-6 text-sm font-bold text-white transition hover:bg-[#eb5b8f]"
              >
                {mode === "modal" ? "상세 페이지로 돌아가기" : "일일남매 페이지로 이동"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 0 && (
              <div className="space-y-4">
                {DAY_NAMMAE_NOTICE_SECTIONS.map((section) => (
                  <section
                    key={section.title}
                    className="rounded-[28px] border border-[#f1dbe5] bg-white p-5 shadow-sm md:p-6"
                  >
                    <h2 className="text-xl font-black tracking-[-0.03em] text-[#27222a]">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-3 text-sm leading-6 text-black/70">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setFormError("");
                  }}
                  className="mt-2 flex h-14 w-full items-center justify-center rounded-full bg-[#ff6b9f] text-base font-bold text-white transition hover:bg-[#eb5b8f]"
                >
                  내용을 확인했고 신청을 진행할게요
                </button>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <section className="rounded-[28px] border border-[#f1dbe5] bg-white p-5 shadow-sm md:p-6">
                  <p className="text-sm font-semibold text-[#c46592]">Q. 성별</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {(["여", "남"] as const).map((genderOption) => (
                      <button
                        key={genderOption}
                        type="button"
                        onClick={() => handleGenderSelect(genderOption)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          formValues.gender === genderOption
                            ? genderOption === "여"
                              ? "border-[#ff69b4] bg-[#fff0f7] text-[#b93e80]"
                              : "border-[#4a90e2] bg-[#eef6ff] text-[#2d67ad]"
                            : "border-black/10 bg-white text-black/65 hover:border-black/20"
                        }`}
                      >
                        <span className="block text-sm font-semibold">
                          {genderOption === "여" ? "여성으로 신청" : "남성으로 신청"}
                        </span>
                        <span className="mt-1 block text-xs text-current/70">
                          해당 성별 기준으로 일정 마감 여부가 달라집니다.
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="rounded-[28px] border border-[#f1dbe5] bg-white p-5 shadow-sm md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#c46592]">
                        [일일남매] 일정 선택
                      </p>
                      <p className="mt-1 text-xs text-black/45">
                        {formValues.gender
                          ? "선택한 성별 기준으로 신청 가능한 일정만 활성화됩니다."
                          : "성별을 먼저 선택하면 신청 가능한 일정을 정확히 안내해드려요."}
                      </p>
                    </div>
                    {isLoadingSchedules && (
                      <span className="text-xs text-black/45">불러오는 중...</span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    {scheduleData.map((schedule) => {
                      const label = getDayNammeScheduleLabel(schedule);
                      const selectable = isDayNammeScheduleSelectable(
                        schedule,
                        formValues.gender
                      );
                      const selected = formValues.schedule === label;

                      return (
                        <button
                          key={label}
                          type="button"
                          disabled={!selectable}
                          onClick={() => handleScheduleSelect(label)}
                          className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                            selected
                              ? "border-[#ff6b9f] bg-[#fff0f7] shadow-sm"
                              : selectable
                                ? "border-black/10 bg-white hover:border-[#ffcadb]"
                                : "cursor-not-allowed border-black/5 bg-black/[0.03] text-black/35"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-bold text-black">{label}</p>
                              <p className="mt-1 text-xs text-black/55">
                                현재 {schedule.applicants.total}/{schedule.maxCapacity}명 신청
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                selectable
                                  ? "bg-[#fff0f7] text-[#c46592]"
                                  : "bg-black/5 text-black/40"
                              }`}
                            >
                              {getScheduleHelperText(schedule, formValues.gender)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="flex h-14 flex-1 items-center justify-center rounded-full border border-black/10 bg-white text-base font-semibold text-black/65 transition hover:bg-black/[0.03]"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    disabled={!selectionStepComplete}
                    onClick={() => {
                      if (!selectionStepComplete) {
                        return;
                      }

                      setCurrentStep(2);
                      setFormError("");
                    }}
                    className="flex h-14 flex-[1.3] items-center justify-center rounded-full bg-[#ff6b9f] text-base font-bold text-white transition hover:bg-[#eb5b8f] disabled:cursor-not-allowed disabled:bg-[#ffb1cd] disabled:text-white/75"
                  >
                    프로필 작성하기
                  </button>
                </div>
                {!selectionStepComplete && (
                  <p className="px-1 text-center text-sm text-black/45">
                    성별과 일정을 모두 선택하면 다음 단계로 이동할 수 있어요.
                  </p>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <section className="rounded-[28px] border border-[#f1dbe5] bg-white p-5 shadow-sm md:p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-[#4a4650]">
                        Q. 이름
                      </label>
                      <p className="mt-1 text-xs leading-5 text-black/40">
                        이름을 입력해주세요. (감을 위해 공개될 경우 일부 마스킹됩니다.)
                      </p>
                      <input
                        value={formValues.name}
                        onChange={handleValueChange("name")}
                        placeholder="여기 입력하세요"
                        className="mt-3 h-13 w-full rounded-none border border-[#f08db4] bg-white px-4 text-sm outline-none transition focus:border-[#ff5e97]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#4a4650]">
                        Q. 나이
                      </label>
                      <p className="mt-1 text-xs leading-5 text-black/40">
                        태어난 출생 연도를 선택해주세요.
                      </p>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {DAY_NAMMAE_BIRTH_YEARS.map((year) => {
                          const selected = formValues.birthYear === year;

                          return (
                            <button
                              key={year}
                              type="button"
                              onClick={() =>
                                setFormValues((current) => ({
                                  ...current,
                                  birthYear: year,
                                }))
                              }
                              className={`h-11 rounded-xl border text-sm font-medium transition ${
                                selected
                                  ? "border-[#ff6b9f] bg-[#fff0f7] text-[#c46592]"
                                  : "border-black/10 bg-[#faf8fa] text-black/60 hover:border-[#f6bfd3]"
                              }`}
                            >
                              {year}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#4a4650]">
                        Q. 키
                      </label>
                      <p className="mt-1 text-xs leading-5 text-black/40">
                        본인의 키를 적어주세요.
                      </p>
                      <input
                        value={formValues.height}
                        onChange={handleValueChange("height")}
                        inputMode="numeric"
                        placeholder="여기 입력하세요"
                        className="mt-3 h-13 w-full rounded-none border border-[#f08db4] bg-white px-4 text-sm outline-none transition focus:border-[#ff5e97]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#4a4650]">
                        Q. 전화번호
                      </label>
                      <p className="mt-1 text-xs leading-5 text-black/40">
                        연락받을 번호를 입력해주세요.
                      </p>
                      <input
                        value={formValues.phone}
                        onChange={handleValueChange("phone")}
                        inputMode="tel"
                        placeholder="여기 입력하세요"
                        className="mt-3 h-13 w-full rounded-none border border-[#f08db4] bg-white px-4 text-sm outline-none transition focus:border-[#ff5e97]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#4a4650]">
                        Q. 특징
                      </label>
                      <p className="mt-1 text-xs leading-5 text-black/40">
                        본인을 설명할 수 있는 특징을 편하게 적어주세요.
                      </p>
                      <textarea
                        value={formValues.traits}
                        onChange={handleValueChange("traits")}
                        placeholder="ex - 웃상, MBTI는 ENFP, 여유로운 편"
                        rows={5}
                        className="mt-3 w-full rounded-none border border-[#f08db4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#ff5e97]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#4a4650]">
                        Q. 사진
                      </label>
                      <p className="mt-1 text-xs leading-5 text-black/40">
                        본인의 매력이 잘 드러나는 사진 한 장을 업로드해주세요.
                      </p>
                      <label className="mt-3 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#f08db4] bg-[#fff7fb] px-4 py-6 text-center transition hover:border-[#ff5e97]">
                        {photoPreviewUrl ? (
                          <div className="w-full">
                            <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-[20px]">
                              <Image
                                src={photoPreviewUrl}
                                alt="업로드한 프로필 미리보기"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <p className="mt-3 text-xs font-semibold text-[#c46592]">
                              다른 사진으로 변경하기
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#c46592] shadow-sm">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.8}
                                  d="M3 7h4l2-2h6l2 2h4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                                />
                                <circle cx="12" cy="13" r="3.5" strokeWidth={1.8} />
                              </svg>
                            </div>
                            <p className="mt-4 text-sm font-semibold text-black/70">
                              사진 선택하기
                            </p>
                            <p className="mt-1 text-xs text-black/40">
                              JPG, PNG, WEBP 파일 업로드 가능
                            </p>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </section>

                {formError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                  </div>
                )}

                {submitState.status === "error" && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {submitState.message}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex h-14 flex-1 items-center justify-center rounded-full border border-black/10 bg-white text-base font-semibold text-black/65 transition hover:bg-black/[0.03]"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    disabled={
                      submitState.status === "submitting" || !profileStepComplete
                    }
                    className="flex h-14 flex-[1.4] items-center justify-center rounded-full bg-[#ff6b9f] text-base font-bold text-white transition hover:bg-[#eb5b8f] disabled:cursor-not-allowed disabled:bg-[#ffb1cd] disabled:text-white/75"
                  >
                    {submitState.status === "submitting"
                      ? "신청서를 제출하는 중..."
                      : "러브버디즈 신청 완료"}
                  </button>
                </div>
                {!profileStepComplete && (
                  <p className="px-1 text-center text-sm text-black/45">
                    이름, 나이, 키, 전화번호, 특징, 사진을 모두 입력하면 신청할 수 있어요.
                  </p>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
