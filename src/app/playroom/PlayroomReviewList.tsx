"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import PlayroomReviewComment from "@/app/playroom/PlayroomReviewComment";

const REVIEW_BATCH_SIZE = 8;

export type PlayroomReviewListItem = {
  id: string;
  nickname: string;
  localeLabel: string;
  satisfactionText: string;
  satisfactionEmoji: string;
  dateLabel: string;
  comment: string;
  spoilerHidden: boolean;
};

type PlayroomReviewListProps = {
  reviews: PlayroomReviewListItem[];
  accentColor: string;
  loadMoreLabel: string;
};

export default function PlayroomReviewList({
  reviews,
  accentColor,
  loadMoreLabel,
}: PlayroomReviewListProps) {
  const [visibleCount, setVisibleCount] = useState(REVIEW_BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const visibleReviews = useMemo(
    () => reviews.slice(0, visibleCount),
    [reviews, visibleCount],
  );
  const hasMoreReviews = visibleCount < reviews.length;

  useEffect(() => {
    setVisibleCount(REVIEW_BATCH_SIZE);
  }, [reviews]);

  useEffect(() => {
    if (!hasMoreReviews) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVisibleCount((current) =>
          Math.min(current + REVIEW_BATCH_SIZE, reviews.length),
        );
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreReviews, reviews.length]);

  return (
    <div className="space-y-8 px-1">
      {visibleReviews.map((review, index) => (
        <PlayroomReviewComment
          key={`${review.id}:${index}`}
          nickname={review.nickname}
          localeLabel={review.localeLabel}
          satisfactionText={review.satisfactionText}
          satisfactionEmoji={review.satisfactionEmoji}
          dateLabel={review.dateLabel}
          comment={review.comment}
          spoilerHidden={review.spoilerHidden}
          accentColor={accentColor}
        />
      ))}

      {hasMoreReviews ? (
        <div
          ref={sentinelRef}
          className="flex h-12 items-center justify-center"
          aria-live="polite"
        >
          <span className="sr-only">{loadMoreLabel}</span>
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-current"
            style={{ color: accentColor }}
            aria-hidden="true"
          />
        </div>
      ) : null}
    </div>
  );
}
