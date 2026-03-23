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
            className={`rounded-2xl border px-5 py-6 text-left transition [touch-action:manipulation] ${
              selected
                ? isFemale
                  ? "border-[#FF69B4] bg-[#351923] text-[#ffd4e7]"
                  : "border-[#4A90E2] bg-[#16263a] text-[#cfe4ff]"
                : "border-[#2c2024] bg-[#21161a] text-white/70"
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
