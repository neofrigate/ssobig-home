interface StepGenderProps {
  gender: "남" | "여" | "";
  onSelect: (gender: "남" | "여") => void;
}

export default function StepGender({ gender, onSelect }: StepGenderProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["여", "남"] as const).map((option) => {
        const selected = gender === option;
        const isFemale = option === "여";

        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-2xl border px-5 py-6 text-left transition ${
              selected
                ? isFemale
                  ? "border-[#FF69B4] bg-[#FF69B4]/15 text-[#FFB1D4]"
                  : "border-[#4A90E2] bg-[#4A90E2]/15 text-[#8BB8F0]"
                : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            <span className="block text-lg font-bold">
              {isFemale ? "여성" : "남성"}
            </span>
            <span className="mt-1 block text-xs text-current/70">
              {isFemale ? "여성으로 신청" : "남성으로 신청"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
