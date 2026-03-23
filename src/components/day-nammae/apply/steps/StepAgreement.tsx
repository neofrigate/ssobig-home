interface StepAgreementProps {
  section: { title: string; body: string[] };
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
}

export default function StepAgreement({
  section,
  agreed,
  onAgreeChange,
}: StepAgreementProps) {
  return (
    <div>
      <div className="rounded-2xl border border-[#2c2024] bg-[#21161a] p-5">
        <h2 className="text-lg font-bold text-white">{section.title}</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/68">
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAgreeChange(!agreed)}
        className="mt-5 flex w-full items-center gap-3 rounded-xl px-1 py-2 text-left transition"
      >
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
            agreed
              ? "border-[#FF6B9F] bg-[#FF6B9F] text-white"
              : "border-[#3a292f] bg-[#21161a] text-transparent"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span
          className={`text-sm font-medium ${agreed ? "text-white" : "text-white/58"}`}
        >
          위 내용을 확인했으며 동의합니다
        </span>
      </button>
    </div>
  );
}
