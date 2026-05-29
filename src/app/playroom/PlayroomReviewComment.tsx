"use client";

import { useState } from "react";

type PlayroomReviewCommentProps = {
  nickname: string;
  localeLabel: string;
  satisfactionText: string;
  satisfactionEmoji: string;
  dateLabel: string;
  comment: string;
  spoilerHidden: boolean;
  accentColor: string;
};

export default function PlayroomReviewComment({
  nickname,
  localeLabel,
  satisfactionText,
  satisfactionEmoji,
  dateLabel,
  comment,
  spoilerHidden,
  accentColor,
}: PlayroomReviewCommentProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const shouldBlur = spoilerHidden && !isRevealed;

  return (
    <article
      className={[
        "preview-comment-item flex flex-col gap-1 px-1",
        spoilerHidden ? "is-spoiler-hidden" : "",
        isRevealed ? "is-spoiler-revealed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 shrink-0 rounded-full bg-[#e8e8e8]" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate text-[15px] font-light leading-[22px] tracking-[-0.025em] text-[#333333]">
            {nickname}
          </span>
          <span className="shrink-0 rounded-full bg-[#f4f4f4] px-2 py-[2px] text-[13px] font-light leading-[18px] tracking-[-0.025em] text-[#767676]">
            {localeLabel}
          </span>
        </div>
        <span className="relative ml-auto h-4 w-4 shrink-0">
          <span className="absolute left-[6px] top-[3px] h-[3px] w-[3px] rounded-full bg-[#111111] shadow-[0_4px_0_#111111,0_8px_0_#111111]" />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[#767676]">
        <span className="text-[15px] font-normal leading-[22px] tracking-[-0.025em] text-[#111111]">
          {satisfactionEmoji} {satisfactionText}
        </span>
        <span className="text-[13px] font-light leading-[18px] tracking-[-0.025em]">
          {dateLabel}
        </span>
      </div>

      <p
        className={[
          "preview-comment-body whitespace-pre-wrap text-[14px] font-normal leading-[20px] tracking-[-0.025em] text-[#333333] transition-[filter]",
          shouldBlur ? "pointer-events-none select-none blur-[5px]" : "select-text blur-none",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {comment}
      </p>

      {spoilerHidden ? (
        <button
          type="button"
          className="preview-spoiler-toggle mt-[6px] w-fit border-0 bg-transparent p-0 text-[12px] font-bold leading-[18px]"
          style={{ color: accentColor }}
          onClick={() => {
            setIsRevealed((current) => !current);
          }}
        >
          스포일러 보기
        </button>
      ) : null}
    </article>
  );
}
