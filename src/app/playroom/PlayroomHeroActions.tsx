"use client";

type PlayroomHeroActionsProps = {
  backHref: string;
  isDarkMode: boolean;
  shareLabel: string;
  backLabel: string;
  title: string;
};

export default function PlayroomHeroActions({
  backHref,
  isDarkMode,
  shareLabel,
  backLabel,
  title,
}: PlayroomHeroActionsProps) {
  const iconColorClass = isDarkMode ? "text-white" : "text-[#111111]";

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      return;
    }
  }

  return (
    <div className="mb-4 flex items-center justify-between">
      <a
        href={backHref}
        aria-label={backLabel}
        className={`inline-flex h-6 w-6 items-center justify-center ${iconColorClass}`}
      >
        <svg
          viewBox="0 0 24 24"
          role="presentation"
          focusable="false"
          className="h-5 w-5 stroke-current"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M11 6 5 12l6 6" />
        </svg>
      </a>

      <button
        type="button"
        aria-label={shareLabel}
        onClick={() => {
          void handleShare();
        }}
        className={`inline-flex h-6 w-6 items-center justify-center ${iconColorClass}`}
      >
        <svg
          viewBox="0 0 24 24"
          role="presentation"
          focusable="false"
          className="h-5 w-5 stroke-current"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5.5" r="2.5" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="18.5" r="2.5" />
          <path d="M8.2 10.8 15.8 6.7" />
          <path d="M8.2 13.2 15.8 17.3" />
        </svg>
      </button>
    </div>
  );
}
