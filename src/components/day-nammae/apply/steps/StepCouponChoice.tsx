interface StepCouponChoiceProps {
  hasCoupon: boolean | null;
  onSelect: (nextValue: boolean) => void;
}

function optionClass(selected: boolean) {
  return `rounded-2xl border p-5 text-left transition ${
    selected
      ? "border-[#FF6B9F] bg-[#351923] text-white"
      : "border-[#2c2024] bg-[#1b1416] text-white/70"
  }`;
}

function descriptionClass(selected: boolean) {
  return selected ? "mt-2 text-sm leading-relaxed text-white/75" : "mt-2 text-sm leading-relaxed text-white/45";
}

export default function StepCouponChoice({
  hasCoupon,
  onSelect,
}: StepCouponChoiceProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onSelect(true)}
        className={`w-full ${optionClass(hasCoupon === true)}`}
      >
        <p className="text-base font-bold">쿠폰 있어요</p>
        <p className={descriptionClass(hasCoupon === true)}>
          할인 쿠폰 번호를 입력하고 검증한 뒤 할인 결제 링크로 이동합니다.
        </p>
      </button>

      <button
        type="button"
        onClick={() => onSelect(false)}
        className={`w-full ${optionClass(hasCoupon === false)}`}
      >
        <p className="text-base font-bold">쿠폰 없어요</p>
        <p className={descriptionClass(hasCoupon === false)}>
          바로 일반 결제 링크로 이동합니다.
        </p>
      </button>
    </div>
  );
}
