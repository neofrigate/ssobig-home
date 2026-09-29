export const REFERRAL_NETWORK_MESSAGE =
  "추천 할인 확인에 실패했습니다. 인터넷 연결을 확인한 뒤 다시 확인해 주세요. 확인 전에는 신청이 진행되지 않습니다.";

export function referralFailureMessage(reason: unknown): string {
  const value = typeof reason === "string" ? reason : "";
  if (value.includes("본인의"))
    return "본인의 추천 코드는 사용할 수 없습니다. 다른 지인의 코드를 입력하거나 추천 할인을 해제해 주세요.";
  if (value.includes("진행 중"))
    return "이미 추천 할인이 적용된 진행 중 신청이 있습니다. 기존 신청을 확인해 주세요. 취소했는데도 계속 표시되면 채널톡으로 문의해 주세요.";
  if (value.includes("이미 추천 할인"))
    return "이미 추천 할인을 이용하셨습니다. 추천 할인은 최초 1회만 사용할 수 있습니다. 추천 할인을 해제하면 일반 신청을 진행할 수 있습니다.";
  if (value.includes("중단") || value.includes("준비"))
    return "추천 프로그램이 현재 중단되어 할인을 사용할 수 없습니다. 나중에 다시 확인하거나 추천 할인을 해제해 주세요.";
  if (value.includes("쿠폰"))
    return "쿠폰과 추천 할인은 함께 사용할 수 없습니다. 사용할 혜택 하나를 선택해 주세요.";
  if (
    value.includes("코드와 전화번호") ||
    value.includes("사용할 수 없는 추천 코드")
  )
    return "사용할 수 없는 추천 코드이거나 전화번호가 올바르지 않습니다. 코드가 정확한지 지인에게 확인하고, 신청자 전화번호를 확인해 주세요. 비활성 코드는 사용할 수 없습니다.";
  return "추천 할인을 적용할 수 없습니다. 코드와 전화번호를 다시 확인해 주세요. 문제가 계속되면 채널톡으로 문의하거나 추천 할인을 해제해 주세요.";
}

export function referralInputMessage(code: string, phone: string): string {
  if (!/^01[0-9]{9}$/.test(phone))
    return "추천 할인을 확인하려면 신청자 휴대폰 번호 11자리를 먼저 입력해 주세요.";
  if (!/^[A-Z0-9]{6}$/.test(code))
    return "추천 코드의 영문·숫자 6자리를 모두 입력해 주세요. 빈 코드로는 추천 할인을 적용할 수 없습니다.";
  return "";
}
